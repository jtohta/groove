import { FSMState } from "../../../fsm/base";
import {
  writeImplementationTool,
  editFileTool,
  bashTool,
} from "../../../tools";
import type { GateResult } from "../../../types";

export class GreenState extends FSMState {
  name = "GREEN";
  tools = [writeImplementationTool, editFileTool, bashTool];
  systemPrompt = `You are in GREEN state. Write the minimum implementation to make the failing test pass.
- Make the test pass with the simplest possible code
- Do not add extra functionality
- Do not add new tests`;

  async checkGate(): Promise<GateResult> {
    // STUB — Phase 5 implements the real GREEN gate
    return { pass: true, reason: "STUB: GREEN gate always passes" };
  }
}
