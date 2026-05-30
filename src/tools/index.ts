import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
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
  execute: async (input: unknown) => {
    const { command } = input as { command: string }
    try {
      const output = execSync(command, {
        cwd: process.cwd(),
        encoding: 'utf-8',
        timeout: 30000,
        stdio: ['pipe', 'pipe', 'pipe'],
      })
      return { output, exitCode: 0 }
    } catch (err: unknown) {
      const error = err as { stdout?: string; stderr?: string; status?: number }
      return {
        output: error.stdout || '',
        error: error.stderr || String(err),
        exitCode: error.status || 1,
      }
    }
  },
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

function handleView(params: any): unknown {
  const resolved = path.resolve(process.cwd(), params.path)
  if (!fs.existsSync(resolved)) {
    return { error: `File not found: ${params.path}` }
  }
  let content = fs.readFileSync(resolved, 'utf-8')
  if (params.view_range) {
    const lines = content.split('\n')
    const [start, end] = params.view_range
    const slice = lines.slice(start - 1, end === -1 ? undefined : end)
    content = slice.join('\n')
  }
  return { content, path: params.path }
}

function handleCreate(params: any): unknown {
  const resolved = path.resolve(process.cwd(), params.path)
  fs.mkdirSync(path.dirname(resolved), { recursive: true })
  fs.writeFileSync(resolved, params.file_text || '', 'utf-8')
  return { success: true, path: params.path }
}

function handleStrReplace(params: any): unknown {
  const resolved = path.resolve(process.cwd(), params.path)
  if (!fs.existsSync(resolved)) {
    return { error: `File not found: ${params.path}` }
  }
  const content = fs.readFileSync(resolved, 'utf-8')
  if (!params.old_str || !content.includes(params.old_str)) {
    return { error: `String not found in ${params.path}: ${params.old_str?.slice(0, 50)}` }
  }
  const count = content.split(params.old_str).length - 1
  if (count > 1) {
    return { error: `Found ${count} matches for replacement text. Please provide more context to make a unique match.` }
  }
  const updated = content.replace(params.old_str, params.new_str || '')
  fs.writeFileSync(resolved, updated, 'utf-8')
  return { success: true, path: params.path }
}

function handleInsert(params: any): unknown {
  const resolved = path.resolve(process.cwd(), params.path)
  if (!fs.existsSync(resolved)) {
    return { error: `File not found: ${params.path}` }
  }
  const content = fs.readFileSync(resolved, 'utf-8')
  const lines = content.split('\n')
  const insertLine = params.insert_line ?? 0
  const insertText = params.insert_text || ''
  lines.splice(insertLine, 0, insertText)
  fs.writeFileSync(resolved, lines.join('\n'), 'utf-8')
  return { success: true, path: params.path }
}

export const strReplaceBasedEditTool: ToolDefinition = {
  name: 'str_replace_based_edit_tool',
  description: 'View, create, str_replace, or insert text in files',
  inputSchema: {
    type: 'object',
    properties: {
      command: { type: 'string', enum: ['view', 'create', 'str_replace', 'insert'] },
      path: { type: 'string' },
      view_range: { type: 'array', items: { type: 'integer' } },
      file_text: { type: 'string' },
      old_str: { type: 'string' },
      new_str: { type: 'string' },
      insert_line: { type: 'integer' },
      insert_text: { type: 'string' },
    },
    required: ['command', 'path']
  },
  execute: async (input: unknown) => {
    const params = input as {
      command: 'view' | 'create' | 'str_replace' | 'insert'
      path: string
      view_range?: [number, number]
      file_text?: string
      old_str?: string
      new_str?: string
      insert_line?: number
      insert_text?: string
    }

    switch (params.command) {
      case 'view': return handleView(params)
      case 'create': return handleCreate(params)
      case 'str_replace': return handleStrReplace(params)
      case 'insert': return handleInsert(params)
      default: return { error: `Unknown command: ${params.command}` }
    }
  },
}

export const ALL_TOOLS = [
  strReplaceBasedEditTool, bashTool,
  askClarificationTool, lockRequirementsTool, completeFeatureTool,
  spawnAgentTool,
]
