import fs from "fs";
import path from "path";
import type { Config } from "./types";

const DEFAULT_CONFIG: Config = {
  model: {
    plan: "accounts/fireworks/models/kimi-k2p6",
    agent: "accounts/fireworks/models/kimi-k2p6",
    debug: "accounts/fireworks/models/kimi-k2p6",
  },
  modes: {
    agent: {
      test_runner: "jest",
      test_dir: "tests/",
      src_dir: "src/",
      one_test_def: "it() block",
    },
  },
  git: {
    auto_commit: false,
  },
};

export function loadConfig(): Config {
  const configPath = path.join(process.cwd(), "agent.json");
  if (!fs.existsSync(configPath)) return DEFAULT_CONFIG;
  const raw = fs.readFileSync(configPath, "utf-8");
  return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
}
