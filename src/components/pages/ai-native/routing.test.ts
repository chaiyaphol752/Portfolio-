import { describe, expect, it } from "vitest";
import { decideRoute, pathFor, type Criterion } from "./routing";

const route = (...c: Criterion[]) => decideRoute(new Set(c));

describe("hybrid routing simulation", () => {
  it("defaults to cloud models", () => {
    expect(route()).toEqual({ route: "cloud", decidedBy: [] });
  });
  it("keeps private data local", () => {
    expect(route("privacy")).toEqual({ route: "local", decidedBy: ["privacy"] });
    expect(route("privacy", "cost")).toMatchObject({ route: "local" });
  });
  it("prefers cloud for capability, local for cost and latency", () => {
    expect(route("capability").route).toBe("cloud");
    expect(route("cost", "latency")).toEqual({ route: "local", decidedBy: ["cost", "latency"] });
    expect(route("capability", "cost").route).toBe("cloud");
  });
  it("splits private context from a demanding task", () => {
    expect(route("privacy", "capability")).toEqual({ route: "split", decidedBy: ["privacy", "capability"] });
  });
  it("never routes to the cloud when offline", () => {
    expect(route("offline", "capability").route).toBe("local");
    expect(pathFor(route("offline").route).has("cloud")).toBe(false);
  });
  it("lights both model paths when split", () => {
    const p = pathFor("split");
    expect(p.has("cloud") && p.has("local")).toBe(true);
  });
});
