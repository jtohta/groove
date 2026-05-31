import fs from "fs";
import path from "path";
import { nock } from "../helpers/nock-setup";
import { runFSM } from "../../src/runner";
import { createTaskFSM } from "../../src/modes/task";

describe("TASK mode end-to-end", () => {
  const sessionsDir = path.join(process.cwd(), ".groove", "sessions");

  beforeEach(() => {
    if (fs.existsSync(sessionsDir)) {
      fs.rmSync(sessionsDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // nock automatically cleans up interceptors after each test in back mode
  });

  it("reads package.json and returns the project name", async () => {
    const { nockDone } = await nock.back("task-read-package.json.json");

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.map(String).join(" "));
    };

    try {
      await runFSM(
        createTaskFSM(),
        "task",
        "read package.json and return the name field"
      );
    } finally {
      console.log = originalLog;
      nockDone();
    }

    // Assert token logs were written
    expect(fs.existsSync(sessionsDir)).toBe(true);
    const files = fs.readdirSync(sessionsDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files[0]).toMatch(/^session-\d+\.jsonl$/);

    // Assert a tool was invoked during the run
    expect(
      logs.some((l) => l.includes("→ bash")) ||
        logs.some((l) => l.includes("→ str_replace_based_edit_tool"))
    ).toBe(true);

    // Assert the answer was returned
    expect(logs.some((l) => l.toLowerCase().includes("groove"))).toBe(true);
  });
});
