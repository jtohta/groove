import type { FSMState } from './base'
import type { ToolDefinition } from '../types'

export class FSM {
  private states: FSMState[]
  private currentIndex: number = 0
  private _complete: boolean = false

  constructor(states: FSMState[]) {
    this.states = states
  }

  get currentState(): FSMState {
    return this.states[this.currentIndex]
  }

  availableTools(): ToolDefinition[] {
    return this.currentState.tools
  }

  transition(): void {
    if (this.currentIndex < this.states.length - 1) {
      this.currentIndex++
    } else {
      this._complete = true
    }
  }

  isComplete(): boolean {
    return this._complete
  }
}
