import fs from 'fs'
import path from 'path'
import type { SessionLog } from './types'

const SESSION_DIR = '.groove/sessions'

export class Session {
  private messages: Array<{ role: string; content: unknown }> = []
  private phase: number = 0
  private state: string = ''

  setContext(phase: number, state: string): void {
    this.phase = phase
    this.state = state
  }

  addMessage(role: string, content: unknown): void {
    this.messages.push({ role, content })
  }

  buildMessages(): Array<{ role: string; content: unknown }> {
    return this.messages
  }

  reset(): void {
    this.messages = []
  }

  context(): Record<string, unknown> {
    return { phase: this.phase, state: this.state }
  }

  logTokens(usage: { input_tokens: number; output_tokens: number }): void {
    fs.mkdirSync(SESSION_DIR, { recursive: true })
    const log: SessionLog = {
      phase: this.phase,
      state: this.state,
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
      timestamp: new Date().toISOString(),
    }
    const filename = `session-${Date.now()}.jsonl`
    fs.appendFileSync(path.join(SESSION_DIR, filename), JSON.stringify(log) + '\n')
  }
}
