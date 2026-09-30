/**
 * JSON tooling with precise, localizable error reporting.
 * The validator is a small strict parser (RFC 8259) so error positions are identical
 * in every browser; native JSON.parse messages differ between engines.
 */

export type JsonErrorCode =
  | "empty"
  | "unexpected-end"
  | "unexpected-token"
  | "expected-key"
  | "expected-colon"
  | "expected-comma-or-close"
  | "invalid-escape"
  | "invalid-number"
  | "invalid-literal"
  | "control-char"
  | "trailing-content"
  | "too-deep";

export interface JsonError {
  code: JsonErrorCode;
  /** Offending character, when the code refers to one. */
  char?: string;
  /** Zero-based character offset. */
  position: number;
  /** One-based. */
  line: number;
  column: number;
}

export type JsonParseResult = { ok: true; value: unknown } | { ok: false; error: JsonError };

const MAX_DEPTH = 200;

class ParseFailure extends Error {
  constructor(
    readonly code: JsonErrorCode,
    readonly position: number,
    readonly char?: string,
  ) {
    super(code);
  }
}

export function positionToLineColumn(text: string, position: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  const end = Math.min(position, text.length);
  for (let i = 0; i < end; i++) {
    if (text[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

function validate(text: string): void {
  let i = 0;

  const skipWs = () => {
    while (i < text.length && (text[i] === " " || text[i] === "\t" || text[i] === "\n" || text[i] === "\r")) i++;
  };
  const fail = (code: JsonErrorCode, at = i): never => {
    throw new ParseFailure(code, at, text[at]);
  };

  const parseString = () => {
    i++; // opening quote
    for (;;) {
      if (i >= text.length) fail("unexpected-end");
      const c = text[i] as string;
      if (c === '"') {
        i++;
        return;
      }
      if (c.charCodeAt(0) < 0x20) fail("control-char");
      if (c === "\\") {
        const next = text[i + 1];
        if (next === undefined) fail("unexpected-end", text.length);
        if (next === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) fail("invalid-escape", i);
          i += 6;
        } else if ('"\\/bfnrt'.includes(next as string)) {
          i += 2;
        } else {
          fail("invalid-escape", i);
        }
      } else {
        i++;
      }
    }
  };

  const parseNumber = () => {
    const match = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i));
    if (!match) return fail("invalid-number");
    i += match[0].length;
    // Reject things like "01" or "1." that the regex would otherwise stop in the middle of.
    if (/[\d.]/.test(text[i] ?? "")) fail("invalid-number");
  };

  const parseLiteral = (word: string) => {
    if (text.startsWith(word, i) && !/[A-Za-z0-9_]/.test(text[i + word.length] ?? "")) {
      i += word.length;
      return;
    }
    fail("invalid-literal");
  };

  const parseValue = (depth: number) => {
    if (depth > MAX_DEPTH) fail("too-deep");
    skipWs();
    if (i >= text.length) fail("unexpected-end");
    const c = text[i] as string;
    if (c === "{") {
      i++;
      skipWs();
      if (text[i] === "}") {
        i++;
        return;
      }
      for (;;) {
        skipWs();
        if (i >= text.length) fail("unexpected-end");
        if (text[i] !== '"') fail("expected-key");
        parseString();
        skipWs();
        if (i >= text.length) fail("unexpected-end");
        if (text[i] !== ":") fail("expected-colon");
        i++;
        parseValue(depth + 1);
        skipWs();
        if (i >= text.length) fail("unexpected-end");
        if (text[i] === ",") {
          i++;
          continue;
        }
        if (text[i] === "}") {
          i++;
          return;
        }
        fail("expected-comma-or-close");
      }
    } else if (c === "[") {
      i++;
      skipWs();
      if (text[i] === "]") {
        i++;
        return;
      }
      for (;;) {
        parseValue(depth + 1);
        skipWs();
        if (i >= text.length) fail("unexpected-end");
        if (text[i] === ",") {
          i++;
          continue;
        }
        if (text[i] === "]") {
          i++;
          return;
        }
        fail("expected-comma-or-close");
      }
    } else if (c === '"') {
      parseString();
    } else if (c === "-" || (c >= "0" && c <= "9")) {
      parseNumber();
    } else if (c === "t") {
      parseLiteral("true");
    } else if (c === "f") {
      parseLiteral("false");
    } else if (c === "n") {
      parseLiteral("null");
    } else {
      fail("unexpected-token");
    }
  };

  parseValue(0);
  skipWs();
  if (i < text.length) fail("trailing-content");
}

export function parseJson(text: string): JsonParseResult {
  if (text.trim() === "") {
    return { ok: false, error: { code: "empty", position: 0, line: 1, column: 1 } };
  }
  try {
    validate(text);
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch (error) {
    if (error instanceof ParseFailure) {
      const { line, column } = positionToLineColumn(text, error.position);
      return { ok: false, error: { code: error.code, char: error.char, position: error.position, line, column } };
    }
    // The validator accepted it but the engine did not (e.g. extreme nesting): report generically.
    return { ok: false, error: { code: "too-deep", position: 0, line: 1, column: 1 } };
  }
}

export type IndentOption = 2 | 4 | "tab";

export function formatJson(value: unknown, indent: IndentOption = 2): string {
  return JSON.stringify(value, null, indent === "tab" ? "\t" : indent);
}

export function minifyJson(value: unknown): string {
  return JSON.stringify(value);
}

/** Recursively sorts object keys alphabetically (arrays keep their order). */
export function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort((a, b) => a.localeCompare(b))) {
      Object.defineProperty(sorted, key, {
        value: sortKeys((value as Record<string, unknown>)[key]),
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return sorted;
  }
  return value;
}

export type JsonType = "object" | "array" | "string" | "number" | "boolean" | "null";

export function jsonType(value: unknown): JsonType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "object";
  }
}

export function childEntries(value: unknown): [string | number, unknown][] {
  if (Array.isArray(value)) return value.map((child, index) => [index, child] as [number, unknown]);
  if (value && typeof value === "object") return Object.entries(value);
  return [];
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/** Builds a JSONPath-style accessor: $.users[0].name or $["odd key"]. */
export function appendPath(path: string, key: string | number): string {
  if (typeof key === "number") return `${path}[${key}]`;
  return IDENTIFIER.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`;
}

export interface JsonStats {
  nodes: number;
  keys: number;
  depth: number;
  bytes: number;
}

export function jsonStats(value: unknown, source: string): JsonStats {
  let nodes = 0;
  let keys = 0;
  let maxDepth = 0;
  const walk = (node: unknown, depth: number) => {
    nodes += 1;
    maxDepth = Math.max(maxDepth, depth);
    if (node && typeof node === "object") {
      if (!Array.isArray(node)) keys += Object.keys(node).length;
      for (const [, child] of childEntries(node)) walk(child, depth + 1);
    }
  };
  walk(value, 0);
  return { nodes, keys, depth: maxDepth, bytes: new TextEncoder().encode(source).length };
}
