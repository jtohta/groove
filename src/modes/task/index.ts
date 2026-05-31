import { FSM } from "../../fsm";
import { FSMState } from "../../fsm/base";
import { ALL_TOOLS } from "../../tools";
import type { GateResult } from "../../types";

class ExecuteState extends FSMState {
  name = "EXECUTE";
  tools = ALL_TOOLS;
  systemPrompt =
    "You are a coding assistant. Complete the requested task using the available tools.";

  async checkGate(): Promise<GateResult> {
    // TASK mode has no gate — loop ends naturally when model stops calling tools
    return { pass: false, reason: "TASK mode runs until model is done" };
  }
}

export function createTaskFSM(): FSM {
  return new FSM([new ExecuteState()]);
}
