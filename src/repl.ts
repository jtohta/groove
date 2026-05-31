import * as readline from "readline";
import { Readable, Writable } from "stream";
import { runFSM } from "./runner";
import { createTaskFSM } from "./modes/task";
import { createAgentFSM } from "./modes/agent";

export async function startREPL(options?: {
  input?: Readable;
  output?: Writable;
}): Promise<void> {
  const rl = readline.createInterface({
    input: (options?.input ?? process.stdin) as NodeJS.ReadableStream,
    output: (options?.output ?? process.stdout) as NodeJS.WritableStream,
  });

  console.log("Groove v0.1.0");
  console.log('Type your instruction or "groove agent" to run a plan.');
  console.log('Type "exit" to quit.\n');
  (rl as any).output.write("> ");

  for await (const input of rl) {
    const trimmed = input.trim();

    if (!trimmed) {
      (rl as any).output.write("> ");
      continue;
    }

    if (trimmed === "exit" || trimmed === "quit") {
      console.log("Goodbye.");
      rl.close();
      break;
    }

    try {
      if (trimmed === "groove agent" || trimmed.startsWith("groove agent ")) {
        const planArg = trimmed.split("--plan ")[1];
        const planPath = planArg || "groove-plan.json";
        console.log(`[AGENT] Loading ${planPath}...`);
        await runFSM(createAgentFSM(), "agent");
      } else if (
        trimmed === "groove plan" ||
        trimmed.startsWith("groove plan")
      ) {
        throw new Error("PLAN mode not yet implemented");
      } else if (
        trimmed === "groove debug" ||
        trimmed.startsWith("groove debug")
      ) {
        throw new Error("DEBUG mode not yet implemented");
      } else {
        // Default: TASK mode
        await runFSM(createTaskFSM(), "task", trimmed);
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }

    if ((rl as any).closed) break;
    (rl as any).output.write("> ");
  }
}
