import { FSM } from '../../fsm'
import { UnderstandState } from './states/understand'
import { RedState } from './states/red'
import { GreenState } from './states/green'
import { RefactorState } from './states/refactor'

export function createAgentFSM(): FSM {
  return new FSM([
    new UnderstandState(),
    new RedState(),
    new GreenState(),
    new RefactorState(),
  ])
}
