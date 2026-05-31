import Anthropic from "@anthropic-ai/sdk";
import type { FSM } from "./fsm";
import { Session } from "./session";
import { writeHandoff } from "./handoff";
import { loadConfig } from "./config";

const anthropic = new Anthropic({
  baseURL: process.env.ANTHROPIC_BASE_URL,
  apiKey:
    process.env.ANTHROPIC_API_KEY || process.env.FIREWORKS_API_KEY || "no-key",
});

export async function runFSM(
  fsm: FSM,
  mode: "task" | "agent" | "plan" | "debug",
  instruction?: string
): Promise<void> {
  const config = loadConfig();
  const session = new Session();
  const phaseNumber = 1;

  // For TASK mode, seed the first message with the instruction
  if (mode === "task" && instruction) {
    session.addMessage("user", instruction);
  }

  while (!fsm.isComplete()) {
    const state = fsm.currentState;
    const tools = fsm.availableTools();
    session.setContext(phaseNumber, state.name);

    console.log(`[${state.name}] Running...`);

    const messages = session.buildMessages();

    const response = await anthropic.messages.create({
      model: config.model[mode === "task" ? "agent" : mode] as string,
      max_tokens: 8096,
      system: state.systemPrompt,
      tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.inputSchema as Anthropic.Tool["input_schema"],
      })),
      messages: messages as Anthropic.MessageParam[],
    });

    session.logTokens({
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    });

    // Log any text from the model
    for (const block of response.content) {
      if (block.type === "text" && block.text) {
        console.log(
          `  ${block.text.slice(0, 100)}${block.text.length > 100 ? "..." : ""}`
        );
      }
    }

    // Model is done — for TASK mode this means the task is complete
    if (response.stop_reason === "end_turn" && mode === "task") {
      break;
    }

    // Execute tool calls
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;

      const tool = tools.find((t) => t.name === block.name);
      if (!tool) {
        throw new Error(
          `Tool ${block.name} not available in state ${state.name}. Available: ${tools.map((t) => t.name).join(", ")}`
        );
      }

      console.log(`  → ${block.name}`);
      let result: unknown;
      try {
        result = await tool.execute(block.input);
      } catch (err) {
        result = { error: String(err) };
      }

      session.addMessage("assistant", response.content);
      session.addMessage("user", [
        {
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        },
      ]);

      // Check gate after tool call
      const gate = await state.checkGate();
      if (gate.pass) {
        console.log(`  ✓ Gate passed: ${gate.reason}`);
        writeHandoff({
          phase: phaseNumber,
          state: state.name,
          context: session.context(),
          timestamp: new Date().toISOString(),
        });
        fsm.transition();
        if (!fsm.isComplete()) {
          session.reset();
          console.log(`[${fsm.currentState.name}] Transitioning...`);
        }
        break;
      }
    }
  }

  console.log(`\nDone. Tokens logged to .groove/sessions/`);
}
