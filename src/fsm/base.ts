import type { ToolDefinition, GateResult } from '../types'

export abstract class FSMState {
  abstract name: string
  abstract tools: ToolDefinition[]
  abstract systemPrompt: string
  abstract checkGate(): Promise<GateResult>
}
