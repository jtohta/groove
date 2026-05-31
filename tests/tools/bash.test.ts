import { bashTool } from "../../src/tools";

describe("bash tool", () => {
  it("returns output and exitCode 0 for a successful command", async () => {
    const result = await bashTool.execute({ command: "echo hello" });
    expect(result).toMatchObject({ output: "hello\n", exitCode: 0 });
  });

  it("returns stderr in error field and non-zero exitCode for a failing command", async () => {
    const result = await bashTool.execute({
      command: "ls /nonexistent-directory-12345",
    });
    expect(result).toMatchObject({
      output: expect.any(String),
      error: expect.stringContaining("No such file or directory"),
      exitCode: expect.any(Number),
    });
    expect((result as any).exitCode).toBeGreaterThan(0);
  });

  it("captures stdout and stderr separately", async () => {
    const result = await bashTool.execute({
      command: "echo out && echo err >&2",
    });
    expect(result).toMatchObject({
      output: expect.stringContaining("out"),
      exitCode: 0,
    });
  });
});
