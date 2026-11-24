// lib/mirathLand.ts - land share per heir. Pure logic, exact BigInt maths.
// The sharai fractions come from the Mirath engine; this file only turns "land x fraction"
// into units the family uses (bigha-kattha-dhur, decimal, gaz, sq ft, acre, sq m).
import { parseExact, FACTOR, fromBase, toBase, type LandUnit } from "./land";

export type LandMode = "bk" | "dhur" | "gaz" | "decimal" | "sqft" | "acre" | "sqm";
export interface LandInput { mode: LandMode; a: string; b: string; r1: string; sq: string }
export const DEFAULT_LAND: LandInput = { mode: "bk", a: "", b: "", r1: "20", sq: "" };
export const LAND_MODES: LandMode[] = ["bk", "dhur", "gaz", "decimal", "sqft", "acre", "sqm"];
export const STD_UNIT: Record<Exclude<LandMode, "bk" | "dhur">, LandUnit> = { gaz: "sqyd", decimal: "decimal", sqft: "sqft", acre: "acre", sqm: "sqm" };

type Q = { n: bigint; d: bigint };
const Z = BigInt("0"), ONE = BigInt("1"), HUND = BigInt("100"), TWO = BigInt("2");
const add = (x: Q, y: Q): Q => ({ n: x.n * y.d + y.n * x.d, d: x.d * y.d });
const mulI = (x: Q, k: bigint): Q => ({ n: x.n * k, d: x.d });
const parseQ = (s: string): Q | null => (s.trim() === "" ? { n: Z, d: ONE } : parseExact(s));

export type LandTotal =
  | { ok: true; kind: "bk"; kattha: Q; r1: bigint; sq: Q | null }
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
  const sqIn = parseQ(inp.sq);
  if (!sqIn) return { ok: false, err: "num" };
  return { ok: true, kind: "bk", kattha: add(mulI(a, r1), b), r1, sq: sqIn.n === Z ? null : sqIn };
}

const hundredths = (h: bigint) => {
  const whole = h / HUND, fr = (h % HUND).toString().padStart(2, "0").replace(/0+$/, "");
  return fr ? `${whole}.${fr}` : `${whole}`;
};

/** Land of `n/d` of the whole. bk -> [bigha, kattha, dhur]; others -> [value] (+ sq ft hint when exact). */
export function landOf(t: Extract<LandTotal, { ok: true }>, n: number, d: number): { parts: string[]; sqft?: string; approx?: boolean; modern?: { sqft: string; decimal: string; gaz: string } } {
  const f = { n: BigInt(n), d: BigInt(d) };
  if (t.kind === "bk") {
    const q = { n: t.kattha.n * f.n, d: t.kattha.d * f.d };
    // exact: whole dhur + a true fraction (e.g. 13 1/3 dhur) - nothing is rounded away
    const DHUR = BigInt("20");
    const tn = q.n * DHUR;               // total dhur = tn / q.d
    const D = tn / q.d;                  // whole dhur (floor)
    let fn = tn % q.d, fd = q.d;         // leftover fraction of one dhur
    const g = (x: bigint, y: bigint): bigint => (y === Z ? x : g(y, x % y));
    if (fn !== Z) { const k = g(fn, fd); fn /= k; fd /= k; }
    const VULG: Record<string, string> = { "1/2": "½", "1/3": "⅓", "2/3": "⅔", "1/4": "¼", "3/4": "¾", "1/5": "⅕", "2/5": "⅖", "3/5": "⅗", "4/5": "⅘", "1/6": "⅙", "5/6": "⅚", "1/8": "⅛", "3/8": "⅜", "5/8": "⅝", "7/8": "⅞" };
    const fracTxt = fn === Z ? "" : (VULG[`${fn}/${fd}`] ?? ` ${fn}/${fd}`);
    const perBigha = t.r1 * DHUR;
    const rem = D % perBigha;
    const dhurTxt = (rem % DHUR).toString() + fracTxt;
    const out: { parts: string[]; sqft?: string; approx?: boolean; modern?: { sqft: string; decimal: string; gaz: string } } =
      { parts: [(D / perBigha).toString(), (rem / DHUR).toString(), dhurTxt], approx: false };
    if (t.sq) {
      const sqQ = { n: q.n * t.sq.n, d: q.d * t.sq.d }; // sq ft of this share
      const base = toBase(sqQ, FACTOR.sqft);
      out.modern = { sqft: fromBase(base, FACTOR.sqft, 0), decimal: fromBase(base, FACTOR.decimal, 2), gaz: fromBase(base, FACTOR.sqyd, 1) };
    }
    return out;
  }
  const q = { n: t.value.n * f.n, d: t.value.d * f.d };
  const parts = [fromBase(q, ONE, 4)];
  const u = t.unit;
  const sqft = !u || u === "sqft" ? undefined : fromBase(toBase(q, FACTOR[u]), FACTOR.sqft, 2);
  return { parts, sqft };
}
