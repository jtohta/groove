import os from "os";
import path from "path";
import fs from "fs";
import { strReplaceBasedEditTool } from "../../src/tools";

describe("str_replace_based_edit_tool", () => {
  const tmpDir = os.tmpdir();
  let testFile: string;

  beforeEach(() => {
    testFile = path.join(tmpDir, `groove-test-${Date.now()}.txt`);
  });

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  describe("view command", () => {
    it("returns file contents", async () => {
      fs.writeFileSync(testFile, "hello world", "utf-8");
      const result = await strReplaceBasedEditTool.execute({
        command: "view",
        path: testFile,
      });
      expect(result).toEqual({ content: "hello world", path: testFile });
    });

    it("returns error when file does not exist", async () => {
      const result = await strReplaceBasedEditTool.execute({
        command: "view",
        path: path.join(tmpDir, "nonexistent-file.txt"),
      });
      expect(result).toMatchObject({
        error: expect.stringContaining("File not found"),
      });
    });

    it("returns sliced content with view_range", async () => {
      fs.writeFileSync(testFile, "line1\nline2\nline3\nline4", "utf-8");
      const result = await strReplaceBasedEditTool.execute({
        command: "view",
        path: testFile,
        view_range: [2, 3],
      });
      expect(result).toEqual({ content: "line2\nline3", path: testFile });
    });

    it("returns content to end with view_range [-1]", async () => {
      fs.writeFileSync(testFile, "line1\nline2\nline3\nline4", "utf-8");
      const result = await strReplaceBasedEditTool.execute({
        command: "view",
        path: testFile,
        view_range: [3, -1],
      });
      expect(result).toEqual({ content: "line3\nline4", path: testFile });
    });
  });

  describe("create command", () => {
    it("creates a new file with content", async () => {
      const result = await strReplaceBasedEditTool.execute({
        command: "create",
        path: testFile,
        file_text: "new content",
      });
      expect(result).toEqual({ success: true, path: testFile });
      expect(fs.readFileSync(testFile, "utf-8")).toBe("new content");
    });

    it("creates parent directories if needed", async () => {
      const nestedFile = path.join(
        tmpDir,
        `groove-nested-${Date.now()}`,
        "file.txt"
      );
      const result = await strReplaceBasedEditTool.execute({
        command: "create",
        path: nestedFile,
        file_text: "nested",
      });
      expect(result).toEqual({ success: true, path: nestedFile });
      expect(fs.readFileSync(nestedFile, "utf-8")).toBe("nested");
      fs.rmSync(path.dirname(nestedFile), { recursive: true, force: true });
    });

    it("overwrites an existing file", async () => {
      fs.writeFileSync(testFile, "old", "utf-8");
      const result = await strReplaceBasedEditTool.execute({
        command: "create",
        path: testFile,
        file_text: "overwritten",
      });
      expect(result).toEqual({ success: true, path: testFile });
      expect(fs.readFileSync(testFile, "utf-8")).toBe("overwritten");
    });
  });

  describe("str_replace command", () => {
    it("replaces a unique string in a file", async () => {
      fs.writeFileSync(testFile, "hello world\ngoodbye world", "utf-8");
      const result = await strReplaceBasedEditTool.execute({
        command: "str_replace",
        path: testFile,
        old_str: "hello",
        new_str: "hi",
      });
      expect(result).toEqual({ success: true, path: testFile });
      expect(fs.readFileSync(testFile, "utf-8")).toBe(
        "hi world\ngoodbye world"
      );
    });

    it("returns error when file does not exist", async () => {
      const result = await strReplaceBasedEditTool.execute({
        command: "str_replace",
        path: path.join(tmpDir, "nonexistent-file.txt"),
        old_str: "x",
        new_str: "y",
      });
      expect(result).toMatchObject({
        error: expect.stringContaining("File not found"),
      });
    });

    it("returns error when old_str is not found", async () => {
      fs.writeFileSync(testFile, "hello world", "utf-8");
      const result = await strReplaceBasedEditTool.execute({
        command: "str_replace",
        path: testFile,
        old_str: "missing",
        new_str: "replaced",
      });
      expect(result).toMatchObject({
        error: expect.stringContaining("String not found"),
      });
    });

    it("returns error when old_str matches multiple times", async () => {
      fs.writeFileSync(testFile, "hello hello hello", "utf-8");
      const result = await strReplaceBasedEditTool.execute({
        command: "str_replace",
        path: testFile,
        old_str: "hello",
        new_str: "hi",
      });
      expect(result).toMatchObject({
        error: expect.stringContaining("3 matches"),
      });
    });
  });

  describe("insert command", () => {
    it("inserts text at the beginning", async () => {
      fs.writeFileSync(testFile, "line2\nline3", "utf-8");
      const result = await strReplaceBasedEditTool.execute({
        command: "insert",
        path: testFile,
        insert_line: 0,
        insert_text: "line1",
      });
      expect(result).toEqual({ success: true, path: testFile });
      expect(fs.readFileSync(testFile, "utf-8")).toBe("line1\nline2\nline3");
    });

    it("inserts text in the middle", async () => {
      fs.writeFileSync(testFile, "line1\nline3", "utf-8");
      const result = await strReplaceBasedEditTool.execute({
        command: "insert",
        path: testFile,
        insert_line: 1,
        insert_text: "line2",
      });
      expect(result).toEqual({ success: true, path: testFile });
      expect(fs.readFileSync(testFile, "utf-8")).toBe("line1\nline2\nline3");
    });

    it("returns error when file does not exist", async () => {
      const result = await strReplaceBasedEditTool.execute({
        command: "insert",
        path: path.join(tmpDir, "nonexistent-file.txt"),
        insert_line: 0,
        insert_text: "x",
      });
      expect(result).toMatchObject({
        error: expect.stringContaining("File not found"),
      });
    });
  });

  describe("unknown command", () => {
    it("returns error for unsupported command", async () => {
      const result = await strReplaceBasedEditTool.execute({
        command: "delete",
        path: testFile,
      });
      expect(result).toMatchObject({
        error: expect.stringContaining("Unknown command"),
      });
    });
  });
});
