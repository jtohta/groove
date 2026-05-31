import fs from "fs";
import path from "path";
import { Readable, Writable } from "stream";
import { nock } from "../helpers/nock-setup";
import { startREPL } from "../../src/repl";

describe("REPL mode end-to-end", () => {
  const sessionsDir = path.join(process.cwd(), ".groove", "sessions");

  beforeEach(() => {
    if (fs.existsSync(sessionsDir)) {
      fs.rmSync(sessionsDir, { recursive: true, force: true });
    }
  });

  it("runs a task instruction and exits", async () => {
    const { nockDone } = await nock.back("repl-read-package.json.json");

    const stdin = new Readable({
      read() {},
    });
    stdin.push("read package.json and return the name field\n");
    stdin.push("exit\n");

    const stdout = new Writable({
      write(_chunk, _encoding, callback) {
        callback();
      },
    });

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.map(String).join(" "));
    };

    try {
      await startREPL({ input: stdin, output: stdout });
    } finally {
      console.log = originalLog;
      nockDone();
    }

    const output = logs.join("\n");

    expect(output.toLowerCase()).toContain("groove");
    expect(output).toContain("Goodbye.");

    expect(fs.existsSync(sessionsDir)).toBe(true);
    const files = fs.readdirSync(sessionsDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files[0]).toMatch(/^session-\d+\.jsonl$/);
  }, 30000);
});
