import { describe, expect, it } from "vitest";
import { appendPath, formatJson, jsonStats, minifyJson, parseJson, positionToLineColumn, sortKeys } from "./json";
import {
  contrastRatio,
  generateScale,
  hslToRgb,
  parseHex,
  readableOn,
  rgbToHsl,
  slugifyTokenName,
  toHex,
  tokensToText,
  wcagLevel,
} from "./color";
import { activeBreakpoint, clampWidth, fitScale, parseWidth, sampleColumns } from "./responsive";

describe("parseJson", () => {
  it("parses valid documents", () => {
    const r = parseJson('{"a":[1,2,{"b":null}],"c":"x\\n"}');
    expect(r).toEqual({ ok: true, value: { a: [1, 2, { b: null }], c: "x\n" } });
  });
  it("reports empty input", () => {
    expect(parseJson("   ")).toMatchObject({ ok: false, error: { code: "empty" } });
  });
  it("points at the offending character with line and column", () => {
    const text = '{\n  "a": 1,\n  "b": ,\n}';
    const r = parseJson(text);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("unexpected-token");
      expect(r.error.char).toBe(",");
      expect(r.error).toMatchObject({ line: 3, column: 8 });
      expect(text[r.error.position]).toBe(",");
    }
  });
  it("detects trailing commas, single quotes and missing colons", () => {
    expect(parseJson("[1,2,]")).toMatchObject({ ok: false, error: { code: "unexpected-token" } });
    expect(parseJson("{'a':1}")).toMatchObject({ ok: false, error: { code: "expected-key" } });
    expect(parseJson('{"a" 1}')).toMatchObject({ ok: false, error: { code: "expected-colon" } });
    expect(parseJson('{"a":1 "b":2}')).toMatchObject({ ok: false, error: { code: "expected-comma-or-close" } });
  });
  it("detects truncated input and trailing content", () => {
    expect(parseJson('{"a":')).toMatchObject({ ok: false, error: { code: "unexpected-end" } });
    expect(parseJson("[1] x")).toMatchObject({ ok: false, error: { code: "trailing-content" } });
  });
  it("validates numbers, literals, escapes and control characters", () => {
    expect(parseJson("01")).toMatchObject({ ok: false, error: { code: "invalid-number" } });
    expect(parseJson("1.")).toMatchObject({ ok: false, error: { code: "invalid-number" } });
    expect(parseJson("tru")).toMatchObject({ ok: false, error: { code: "invalid-literal" } });
    expect(parseJson('"\\q"')).toMatchObject({ ok: false, error: { code: "invalid-escape" } });
    expect(parseJson('"a\nb"')).toMatchObject({ ok: false, error: { code: "control-char" } });
    expect(parseJson("-1.5e+3")).toEqual({ ok: true, value: -1500 });
  });
  it("guards against absurd nesting", () => {
    expect(parseJson("[".repeat(500))).toMatchObject({ ok: false, error: { code: "too-deep" } });
  });
  it("keeps __proto__ as an ordinary key", () => {
    const r = parseJson('{"__proto__":{"x":1}}');
    expect(r.ok).toBe(true);
    if (r.ok) expect(Object.keys(r.value as object)).toEqual(["__proto__"]);
  });
});

describe("json helpers", () => {
  it("maps positions to lines", () => {
    expect(positionToLineColumn("ab\ncd", 4)).toEqual({ line: 2, column: 2 });
  });
  it("formats and minifies", () => {
    expect(formatJson({ a: 1 }, 4)).toBe('{\n    "a": 1\n}');
    expect(formatJson({ a: 1 }, "tab")).toBe('{\n\t"a": 1\n}');
    expect(minifyJson({ a: [1, 2] })).toBe('{"a":[1,2]}');
  });
  it("sorts keys deeply without touching arrays", () => {
    expect(JSON.stringify(sortKeys({ b: 1, a: { d: 1, c: 2 }, l: [{ z: 1, y: 2 }] }))).toBe('{"a":{"c":2,"d":1},"b":1,"l":[{"y":2,"z":1}]}');
  });
  it("builds JSONPath accessors", () => {
    expect(appendPath("$", "users")).toBe("$.users");
    expect(appendPath("$.users", 0)).toBe("$.users[0]");
    expect(appendPath("$", "odd key")).toBe('$["odd key"]');
  });
  it("computes stats", () => {
    const text = '{"a":[1,{"b":2}]}';
    const r = parseJson(text);
    if (!r.ok) throw new Error("expected valid");
    expect(jsonStats(r.value, text)).toEqual({ nodes: 5, keys: 2, depth: 3, bytes: text.length });
  });
});

describe("colour maths", () => {
  it("parses and prints hex", () => {
    expect(parseHex("#F2411A")).toEqual({ r: 242, g: 65, b: 26 });
    expect(parseHex("abc")).toEqual({ r: 170, g: 187, b: 204 });
    expect(parseHex("#12")).toBeNull();
    expect(parseHex("#ggg")).toBeNull();
    expect(toHex({ r: 242, g: 65, b: 26 })).toBe("#f2411a");
  });
  it("round-trips through HSL", () => {
    const rgb = parseHex("#2a7fbf")!;
    const back = hslToRgb(rgbToHsl(rgb));
    expect(toHex(back)).toBe("#2a7fbf");
  });
  it("matches published WCAG contrast values", () => {
    const white = { r: 255, g: 255, b: 255 };
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, white)).toBeCloseTo(21, 5);
    expect(contrastRatio(parseHex("#767676")!, white)).toBeCloseTo(4.54, 1);
    expect(contrastRatio(white, white)).toBeCloseTo(1, 5);
  });
  it("classifies WCAG levels", () => {
    expect(wcagLevel(7)).toBe("AAA");
    expect(wcagLevel(4.5)).toBe("AA");
    expect(wcagLevel(3.2)).toBe("AA-large");
    expect(wcagLevel(2.9)).toBe("fail");
  });
  it("picks a readable foreground", () => {
    expect(readableOn(parseHex("#ffffff")!)).toBe("#101114");
    expect(readableOn(parseHex("#101114")!)).toBe("#ffffff");
  });
});

describe("generateScale", () => {
  it("returns 11 steps, contains the exact base once and darkens monotonically", () => {
    const scale = generateScale("#f2411a");
    expect(scale).toHaveLength(11);
    expect(scale.filter((s) => s.isBase)).toHaveLength(1);
    expect(scale.find((s) => s.isBase)?.hex).toBe("#f2411a");
    const lum = scale.map((s) => contrastRatio(parseHex(s.hex)!, { r: 255, g: 255, b: 255 }));
    for (let i = 1; i < lum.length; i++) expect(lum[i]!).toBeGreaterThan(lum[i - 1]! - 0.3);
    expect(lum[lum.length - 1]!).toBeGreaterThan(lum[0]!);
  });
  it("returns nothing for invalid input and handles greys", () => {
    expect(generateScale("nope")).toEqual([]);
    expect(generateScale("#808080")).toHaveLength(11);
  });
  it("exports tokens in three formats", () => {
    const scale = generateScale("#2a7fbf");
    expect(tokensToText("My Brand!", scale, "css")).toMatch(/^:root \{\n {2}--color-my-brand-50: #[0-9a-f]{6};/);
    expect(tokensToText("x", scale, "tailwind")).toMatch(/^@theme \{/);
    expect(JSON.parse(tokensToText("x", scale, "json")).x["500"]).toMatch(/^#[0-9a-f]{6}$/);
    expect(slugifyTokenName("  !!  ")).toBe("brand");
  });
});

describe("responsive helpers", () => {
  it("clamps and parses widths", () => {
    expect(clampWidth(100)).toBe(320);
    expect(clampWidth(5000)).toBe(1600);
    expect(clampWidth(Number.NaN)).toBe(320);
    expect(parseWidth("768px")).toBe(768);
    expect(parseWidth("abc")).toBeNull();
    expect(parseWidth("5")).toBeNull();
  });
  it("names the active container breakpoint and columns", () => {
    expect(activeBreakpoint(300)).toBe("base");
    expect(activeBreakpoint(360)).toBe("@xs");
    expect(activeBreakpoint(768)).toBe("@3xl");
    expect(activeBreakpoint(1600)).toBe("@5xl");
    expect(sampleColumns(360)).toBe(1);
    expect(sampleColumns(500)).toBe(2);
    expect(sampleColumns(900)).toBe(3);
  });
  it("fits frames into available space without enlarging", () => {
    expect(fitScale(1000, 500)).toBe(0.5);
    expect(fitScale(400, 800)).toBe(1);
    expect(fitScale(0, 800)).toBe(1);
  });
});
