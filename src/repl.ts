import * as readline from 'readline'
import { runFSM } from './runner'
import { createTaskFSM } from './modes/task'
import { createAgentFSM } from './modes/agent'

export async function startREPL(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log('Groove v0.1.0')
  console.log('Type your instruction or "groove agent" to run a plan.')
  console.log('Type "exit" to quit.\n')

  const prompt = () => {
    rl.question('> ', async (input) => {
      const trimmed = input.trim()

      if (!trimmed) {
        prompt()
        return
      }

      if (trimmed === 'exit' || trimmed === 'quit') {
        console.log('Goodbye.')
        rl.close()
        return
      }

      try {
        if (trimmed === 'groove agent' || trimmed.startsWith('groove agent ')) {
          const planArg = trimmed.split('--plan ')[1]
          const planPath = planArg || 'groove-plan.json'
          console.log(`[AGENT] Loading ${planPath}...`)
          await runFSM(createAgentFSM(), 'agent')
        } else if (trimmed === 'groove plan' || trimmed.startsWith('groove plan')) {
          throw new Error('PLAN mode not yet implemented')
        } else if (trimmed === 'groove debug' || trimmed.startsWith('groove debug')) {
          throw new Error('DEBUG mode not yet implemented')
        } else {
          // Default: TASK mode
          await runFSM(createTaskFSM(), 'task', trimmed)
        }
      } catch (err) {
        console.error(`Error: ${err}`)
      }

      prompt()
    })
  }

  prompt()
}
