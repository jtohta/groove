import type { ToolDefinition } from '../types'

// Tool stubs — implemented in subsequent prompts
const stub = (name: string) => async (_input: unknown): Promise<unknown> => {
  throw new Error(`not implemented: ${name}`)
}

export const readFileTool: ToolDefinition = {
  name: 'read_file',
  description: 'Read the contents of a file',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string' } },
    required: ['path']
  },
  execute: stub('read_file'),
}

export const editFileTool: ToolDefinition = {
  name: 'edit_file',
  description: 'Edit a file by replacing a unique string',
  inputSchema: {
    type: 'object',
    properties: {
      path: { type: 'string' },
      old_str: { type: 'string' },
      new_str: { type: 'string' },
    },
    required: ['path', 'old_str', 'new_str']
  },
  execute: stub('edit_file'),
}

export const bashTool: ToolDefinition = {
  name: 'bash',
  description: 'Run a bash command',
  inputSchema: {
    type: 'object',
    properties: { command: { type: 'string' } },
    required: ['command']
  },
  execute: stub('bash'),
}

export const writeTestTool: ToolDefinition = {
  name: 'write_test',
  description: 'Write a test file',
  inputSchema: {
    type: 'object',
    properties: {
      path: { type: 'string' },
      content: { type: 'string' },
    },
    required: ['path', 'content']
  },
  execute: stub('write_test'),
}

export const writeImplementationTool: ToolDefinition = {
  name: 'write_implementation',
  description: 'Write an implementation file',
  inputSchema: {
    type: 'object',
    properties: {
      path: { type: 'string' },
      content: { type: 'string' },
    },
    required: ['path', 'content']
  },
  execute: stub('write_implementation'),
}

export const lockRequirementsTool: ToolDefinition = {
  name: 'lock_requirements',
  description: 'Signal that requirements are understood and locked. Transitions to RED state.',
  inputSchema: {
    type: 'object',
    properties: { summary: { type: 'string' } },
    required: ['summary']
  },
  execute: stub('lock_requirements'),
}

export const completeFeatureTool: ToolDefinition = {
  name: 'complete_feature',
  description: 'Signal that the feature phase is complete.',
  inputSchema: {
    type: 'object',
    properties: { justification: { type: 'string' } },
    required: ['justification']
  },
  execute: stub('complete_feature'),
}

export const askClarificationTool: ToolDefinition = {
  name: 'ask_clarification',
  description: 'Ask the user a clarifying question',
  inputSchema: {
    type: 'object',
    properties: {
      question: { type: 'string' },
      recommendation: { type: 'string' },
    },
    required: ['question']
  },
  execute: stub('ask_clarification'),
}

export const spawnAgentTool: ToolDefinition = {
  name: 'spawn_agent',
  description: 'Spawn a sub-agent for parallel read-only work',
  inputSchema: {
    type: 'object',
    properties: { task: { type: 'string' } },
    required: ['task']
  },
  execute: stub('spawn_agent'),
}

export const ALL_TOOLS = [
  readFileTool, editFileTool, bashTool, writeTestTool,
  writeImplementationTool, lockRequirementsTool, completeFeatureTool,
  askClarificationTool, spawnAgentTool,
]
