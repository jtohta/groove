import { FSMState } from '../../../fsm/base'
import { editFileTool, bashTool, completeFeatureTool } from '../../../tools'
import type { GateResult } from '../../../types'

export class RefactorState extends FSMState {
  name = 'REFACTOR'
  tools = [editFileTool, bashTool, completeFeatureTool]
  systemPrompt = `You are in REFACTOR state. Clean up the implementation without changing behavior.
- Simplify the code
- Remove duplication
- All tests must still pass
- Call complete_feature() when done`

  async checkGate(): Promise<GateResult> {
    // STUB — Phase 5 implements the real REFACTOR gate
    return { pass: true, reason: 'STUB: REFACTOR gate always passes' }
  }
}
