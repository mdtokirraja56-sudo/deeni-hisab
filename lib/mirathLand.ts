// lib/mirathLand.ts - land share per heir. Pure logic, exact BigInt maths.
// The sharai fractions come from the Mirath engine; this file only turns "land x fraction"
// into units the family uses (bigha-kattha-dhur, decimal, gaz, sq ft, acre, sq m).
import { parseExact, FACTOR, fromBase, toBase, type LandUnit } from "./land";

export type LandMode = "bk" | "dhur" | "gaz" | "decimal" | "sqft" | "acre" | "sqm";
export interface LandInput { mode: LandMode; a: string; b: string; r1: string }
export const DEFAULT_LAND: LandInput = { mode: "bk", a: "", b: "", r1: "20" };
export const LAND_MODES: LandMode[] = ["bk", "dhur", "gaz", "decimal", "sqft", "acre", "sqm"];
export const STD_UNIT: Record<Exclude<LandMode, "bk" | "dhur">, LandUnit> = { gaz: "sqyd", decimal: "decimal", sqft: "sqft", acre: "acre", sqm: "sqm" };

type Q = { n: bigint; d: bigint };
const Z = BigInt("0"), ONE = BigInt("1"), HUND = BigInt("100"), TWO = BigInt("2");
const add = (x: Q, y: Q): Q => ({ n: x.n * y.d + y.n * x.d, d: x.d * y.d });
const mulI = (x: Q, k: bigint): Q => ({ n: x.n * k, d: x.d });
const parseQ = (s: string): Q | null => (s.trim() === "" ? { n: Z, d: ONE } : parseExact(s));

export type LandTotal =
  | { ok: true; kind: "bk"; kattha: Q; r1: bigint }
  | { ok: true; kind: "std"; unit: LandUnit | null; mode: Exclude<LandMode, "bk">; value: Q }
  | { ok: false; err: "empty" | "num" | "ratio" };

export function landTotal(inp: LandInput): LandTotal {
  const a = parseQ(inp.a);
  if (inp.mode !== "bk") {
    if (!a) return { ok: false, err: "num" };
    if (a.n === Z) return { ok: false, err: "empty" };
    const unit = inp.mode === "dhur" ? null : STD_UNIT[inp.mode];
    return { ok: true, kind: "std", unit, mode: inp.mode, value: a };
  }
  const b = parseQ(inp.b);
  if (!a || !b) return { ok: false, err: "num" };
  if (a.n === Z && b.n === Z) return { ok: false, err: "empty" };
  if (!/^\d+$/.test(inp.r1.trim())) return { ok: false, err: "ratio" };
  const r1 = BigInt(inp.r1.trim());
  if (r1 === Z) return { ok: false, err: "ratio" };
  return { ok: true, kind: "bk", kattha: add(mulI(a, r1), b), r1 };
}

const hundredths = (h: bigint) => {
  const whole = h / HUND, fr = (h % HUND).toString().padStart(2, "0").replace(/0+$/, "");
  return fr ? `${whole}.${fr}` : `${whole}`;
};

/** Land of `n/d` of the whole. bk -> [bigha, kattha, dhur]; others -> [value] (+ sq ft hint when exact). */
export function landOf(t: Extract<LandTotal, { ok: true }>, n: number, d: number): { parts: string[]; sqft?: string } {
  const f = { n: BigInt(n), d: BigInt(d) };
  if (t.kind === "bk") {
    const q = { n: t.kattha.n * f.n, d: t.kattha.d * f.d };
    // total in hundredths of a dhur (1 kattha = 20 dhur), rounded half up
    const DHUR = BigInt("20");
    const H = (q.n * DHUR * HUND * TWO + q.d) / (q.d * TWO);
    const perBigha = t.r1 * DHUR * HUND;
    const rem = H % perBigha;
    return { parts: [(H / perBigha).toString(), (rem / (DHUR * HUND)).toString(), hundredths(rem % (DHUR * HUND))] };
  }
  const q = { n: t.value.n * f.n, d: t.value.d * f.d };
  const parts = [fromBase(q, ONE, 4)];
  const u = t.unit;
  const sqft = !u || u === "sqft" ? undefined : fromBase(toBase(q, FACTOR[u]), FACTOR.sqft, 2);
  return { parts, sqft };
}
