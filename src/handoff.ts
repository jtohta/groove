import fs from "fs";
import path from "path";
import type { HandoffDocument } from "./types";

const HANDOFF_DIR = ".groove/handoffs";

export function writeHandoff(doc: HandoffDocument): void {
  fs.mkdirSync(HANDOFF_DIR, { recursive: true });
  const filename = `phase-${doc.phase}-${doc.state}.jsonl`;
  const filepath = path.join(HANDOFF_DIR, filename);
  fs.appendFileSync(filepath, JSON.stringify(doc) + "\n");
}

export function readHandoff(
  phase: number,
  state: string
): HandoffDocument | null {
  const filename = `phase-${phase}-${state}.jsonl`;
  const filepath = path.join(HANDOFF_DIR, filename);
  if (!fs.existsSync(filepath)) return null;
  const lines = fs.readFileSync(filepath, "utf-8").trim().split("\n");
  const last = lines[lines.length - 1];
  return JSON.parse(last) as HandoffDocument;
}
