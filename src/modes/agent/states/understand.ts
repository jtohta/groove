import { FSMState } from "../../../fsm/base";
import {
  readFileTool,
  askClarificationTool,
  lockRequirementsTool,
} from "../../../tools";
import type { GateResult } from "../../../types";

export class UnderstandState extends FSMState {
  name = "UNDERSTAND";
  tools = [readFileTool, askClarificationTool, lockRequirementsTool];
  systemPrompt = `You are in UNDERSTAND state. Read the codebase and lock requirements before writing any code.
You must call lock_requirements() when you fully understand what needs to be built.
Do not write any code yet.`;

  private lockCalled = false;

  signalLockRequirements(): void {
    this.lockCalled = true;
  }

  async checkGate(): Promise<GateResult> {
    if (this.lockCalled) {
      return { pass: true, reason: "Requirements locked. Proceeding to RED." };
    }
    return { pass: false, reason: "Call lock_requirements() when ready." };
  }
}
