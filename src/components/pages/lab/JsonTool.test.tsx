// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { labContent } from "@/content/lab";
import { JsonTool } from "./JsonTool";
import { TokenTool } from "./TokenTool";

afterEach(cleanup);

const t = labContent.en;
const input = () => document.getElementById("json-input") as HTMLTextAreaElement;

describe("JsonTool", () => {
  it("validates the sample and shows its structure", () => {
    render(<JsonTool t={t.json} />);
    expect(screen.getByText(t.json.valid)).toBeTruthy();
    expect(screen.getByRole("tree")).toBeTruthy();
  });
  it("reports the exact error position for invalid input", () => {
    render(<JsonTool t={t.json} />);
    fireEvent.change(input(), { target: { value: '{\n  "a": 1,\n  "b": ,\n}' } });
    expect(screen.getByText(t.json.invalid)).toBeTruthy();
    expect(screen.getAllByText("Line 3, column 8").length).toBeGreaterThan(0);
    expect(input().getAttribute("aria-invalid")).toBe("true");
  });
  it("minifies and formats the document in place", () => {
    render(<JsonTool t={t.json} />);
    fireEvent.change(input(), { target: { value: '{ "a": [1, 2] }' } });
    fireEvent.click(screen.getByText(t.json.minify));
    expect(input().value).toBe('{"a":[1,2]}');
    fireEvent.click(screen.getByText(t.json.prettify));
    expect(input().value).toBe('{\n  "a": [\n    1,\n    2\n  ]\n}');
  });
});

describe("TokenTool", () => {
  it("generates an 11-step scale and flags invalid colours without losing the last scale", () => {
    render(<TokenTool t={t.tokens} />);
    expect(document.querySelectorAll("tbody tr")).toHaveLength(11);
    fireEvent.change(document.getElementById("hex-input")!, { target: { value: "#12" } });
    expect(screen.getByRole("alert").textContent).toBe(t.tokens.invalid);
    expect(document.querySelectorAll("tbody tr")).toHaveLength(11);
  });
  it("exports the chosen token name", () => {
    render(<TokenTool t={t.tokens} />);
    fireEvent.change(document.getElementById("token-name")!, { target: { value: "Sunrise" } });
    expect(screen.getByLabelText(t.tokens.export).textContent).toContain("--color-sunrise-500");
  });
});
