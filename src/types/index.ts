export type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: object;
  execute: (input: unknown) => Promise<unknown>;
};

export type TestResult = {
  passed: string[];
  failed: string[];
  total: number;
};

export type GateResult = {
  pass: boolean;
  reason: string;
};

export type HandoffDocument = {
  phase: number;
  state: string;
  context: Record<string, unknown>;
  timestamp: string;
};

export type SessionLog = {
  phase: number;
  state: string;
  inputTokens: number;
  outputTokens: number;
  timestamp: string;
};

export type PhaseStatus = "pending" | "in_progress" | "complete" | "failed";

export type Phase = {
  id: number;
  test_sentence: string;
  status: PhaseStatus;
  handoff: string | null;
};

export type Plan = {
  feature: string;
  phases: Phase[];
};

export type Config = {
  model: {
    plan: string;
    agent: string;
    debug: string;
  };
  modes: {
    agent: {
      test_runner: string;
      test_dir: string;
      src_dir: string;
      one_test_def: string;
    };
  };
  git: {
    auto_commit: boolean;
  };
};
