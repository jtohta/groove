import { FSMState } from '../../../fsm/base'
import { writeTestTool, bashTool } from '../../../tools'
import type { GateResult } from '../../../types'

export class RedState extends FSMState {
  name = 'RED'
  tools = [writeTestTool, bashTool]
  systemPrompt = `You are in RED state. Write exactly ONE failing test.
- Write a single it() block that tests the behavior described in the plan
- Run the tests to confirm exactly one new failure exists
- Do not write any implementation code
- Do not write more than one test`

  async checkGate(): Promise<GateResult> {
    // STUB — Phase 4 implements the real RED gate
    return { pass: true, reason: 'STUB: RED gate always passes' }
  }
}
