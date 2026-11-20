// lib/mirathLand.ts - land share per heir. Pure logic, exact BigInt maths.
// The sharai fractions come from the Mirath engine; this file only turns "land x fraction"
// into units the family uses (bigha-kattha-dhur, decimal, gaz, sq ft, acre, sq m).
import { parseExact, FACTOR, fromBase, toBase, type LandUnit } from "./land";

export type LandMode = "bkd" | "decimal" | "gaz" | "sqft" | "acre" | "sqm";
export interface LandInput { mode: LandMode; a: string; b: string; c: string; r1: string; r2: string }
export const DEFAULT_LAND: LandInput = { mode: "bkd", a: "", b: "", c: "", r1: "20", r2: "20" };
export const LAND_MODES: LandMode[] = ["bkd", "decimal", "gaz", "sqft", "acre", "sqm"];
export const STD_UNIT: Record<Exclude<LandMode, "bkd">, LandUnit> = { decimal: "decimal", gaz: "sqyd", sqft: "sqft", acre: "acre", sqm: "sqm" };

type Q = { n: bigint; d: bigint };
const Z = BigInt("0"), ONE = BigInt("1"), HUND = BigInt("100"), TWO = BigInt("2");
const add = (x: Q, y: Q): Q => ({ n: x.n * y.d + y.n * x.d, d: x.d * y.d });
const mulI = (x: Q, k: bigint): Q => ({ n: x.n * k, d: x.d });
const parseQ = (s: string): Q | null => (s.trim() === "" ? { n: Z, d: ONE } : parseExact(s));

export type LandTotal =
  | { ok: true; kind: "bkd"; dhur: Q; r1: bigint; r2: bigint }
  | { ok: true; kind: "std"; unit: LandUnit; mode: Exclude<LandMode, "bkd">; value: Q }
  | { ok: false; err: "empty" | "num" | "ratio" };

export function landTotal(inp: LandInput): LandTotal {
  const a = parseQ(inp.a);
  if (inp.mode !== "bkd") {
    if (!a) return { ok: false, err: "num" };
    if (a.n === Z) return { ok: false, err: "empty" };
    return { ok: true, kind: "std", unit: STD_UNIT[inp.mode], mode: inp.mode, value: a };
  }
  const b = parseQ(inp.b), c = parseQ(inp.c);
  if (!a || !b || !c) return { ok: false, err: "num" };
  if (a.n === Z && b.n === Z && c.n === Z) return { ok: false, err: "empty" };
  if (!/^\d+$/.test(inp.r1.trim()) || !/^\d+$/.test(inp.r2.trim())) return { ok: false, err: "ratio" };
  const r1 = BigInt(inp.r1.trim()), r2 = BigInt(inp.r2.trim());
  if (r1 === Z || r2 === Z) return { ok: false, err: "ratio" };
  const dhur = add(add(mulI(a, r1 * r2), mulI(b, r2)), c);
  return { ok: true, kind: "bkd", dhur, r1, r2 };
}

export interface LandPiece { text: string[]; extra?: string }
const hundredths = (h: bigint) => {
  const whole = h / HUND, fr = (h % HUND).toString().padStart(2, "0").replace(/0+$/, "");
  return fr ? `${whole}.${fr}` : `${whole}`;
};

/** Land of `n/d` of the whole. Returns parts [bigha, kattha, dhur] or [value] (+ sq ft hint). */
export function landOf(t: Extract<LandTotal, { ok: true }>, n: number, d: number): { parts: string[]; sqft?: string } {
  const f = { n: BigInt(n), d: BigInt(d) };
  if (t.kind === "bkd") {
    const q = { n: t.dhur.n * f.n, d: t.dhur.d * f.d };
    const H = (q.n * HUND * TWO + q.d) / (q.d * TWO); // dhur x100, rounded half up
    const perBigha = t.r1 * t.r2 * HUND, perKattha = t.r2 * HUND;
    const bigha = H / perBigha, rem = H % perBigha;
    const kattha = rem / perKattha, rd = rem % perKattha;
    return { parts: [bigha.toString(), kattha.toString(), hundredths(rd)] };
  }
  const q = { n: t.value.n * f.n, d: t.value.d * f.d };
  const parts = [fromBase(q, ONE, 4)];
  const sqft = t.unit === "sqft" ? undefined : fromBase(toBase(q, FACTOR[t.unit]), FACTOR.sqft, 2);
  return { parts, sqft };
}
