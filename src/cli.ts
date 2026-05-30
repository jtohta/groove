import { Command } from 'commander'
import { startREPL } from './repl'
import { runFSM } from './runner'
import { createTaskFSM } from './modes/task'
import { createAgentFSM } from './modes/agent'

const program = new Command()

program
  .name('groove')
  .description('FSM-based agentic coding runtime')
  .version('0.1.0')

// Default command — starts REPL
program
  .action(async () => {
    await startREPL()
  })

program
  .command('task <instruction>')
  .description('Run a one-shot task (TASK mode)')
  .action(async (instruction: string) => {
    await runFSM(createTaskFSM(), 'task', instruction)
  })

program
  .command('agent')
  .description('Run AGENT mode (TDD phases)')
  .option('--plan <path>', 'Path to plan.json', 'groove-plan.json')
  .action(async () => {
    await runFSM(createAgentFSM(), 'agent')
  })

program
  .command('plan')
  .description('Run PLAN mode (not yet implemented)')
  .action(() => {
    throw new Error('PLAN mode not yet implemented')
  })

program
  .command('debug')
  .description('Run DEBUG mode (not yet implemented)')
  .action(() => {
    throw new Error('DEBUG mode not yet implemented')
  })

program.parse()
