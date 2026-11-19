// lib/land.ts - land area converter. Exact units only; local units (bigha, kattha...) are
// entered by the user, because their size differs by region. All math is BigInt (no float error).
// Base: 1 square metre = 10^10 base units. Every factor below is an exact integer.
export type LandUnit = "sqft" | "sqyd" | "sqm" | "acre" | "hectare" | "decimal" | "are";
export const LAND_UNITS: LandUnit[] = ["sqft", "sqyd", "sqm", "decimal", "acre", "hectare", "are"];
const B = BigInt("10000000000");
// 1 ft = 0.3048 m exactly, so 1 sq ft = 0.09290304 m2; 1 acre = 43560 sq ft; 1 decimal (cent) = 1/100 acre.
export const FACTOR: Record<LandUnit, bigint> = {
  sqm: B, sqft: BigInt("929030400"), sqyd: BigInt("8361273600"), acre: BigInt("40468564224000"),
  decimal: BigInt("404685642240"), hectare: BigInt("100000000000000"), are: BigInt("1000000000000")
};
export const LENGTH_M: Record<"ft" | "yd" | "m", bigint> = { ft: BigInt("3048"), yd: BigInt("9144"), m: BigInt("10000") }; // x 10^-4 m

/** "12.5" -> {n:BigInt("125"), d:BigInt("10")}; returns null if not a positive-or-zero plain number. */
export function parseExact(s: string): { n: bigint; d: bigint } | null {
  const t = s.trim();
  if (!/^\d+(\.\d+)?$/.test(t) && !/^\.\d+$/.test(t)) return null;
  const [i, f = ""] = t.split(".");
  return { n: BigInt((i || "0") + f), d: BigInt("10") ** BigInt(f.length) };
}
type Q = { n: bigint; d: bigint };
const mul = (a: Q, b: Q): Q => ({ n: a.n * b.n, d: a.d * b.d });

/** Area as a fraction of base units. */
export const toBase = (value: Q, factor: bigint | Q): Q => mul(value, typeof factor === "bigint" ? { n: factor, d: BigInt("1") } : factor);
export function area(len: Q, wid: Q, lu: "ft" | "yd" | "m"): Q {
  // metres^2 = (len*f/1e4)*(wid*f/1e4); base = that * 1e10  =>  len*wid*f*f*100
  return mul(mul(len, wid), { n: LENGTH_M[lu] * LENGTH_M[lu] * BigInt("100"), d: BigInt("1") });
}
/** Converts base units to a unit (factor may be a fraction) with `dec` decimals, rounded half up. */
export function fromBase(base: Q, factor: bigint | Q, dec = 4): string {
  const f: Q = typeof factor === "bigint" ? { n: factor, d: BigInt("1") } : factor;
  const scale = BigInt("10") ** BigInt(dec);
  const den = base.d * f.n;
  const v = (base.n * f.d * scale * BigInt("2") + den) / (den * BigInt("2"));
  const s = v.toString().padStart(dec + 1, "0");
  const whole = s.slice(0, s.length - dec), frac = s.slice(s.length - dec).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}
/** Size of a user-defined local unit: "1 local unit = X <exact unit>", as base units (exact fraction). */
export const localFactor = (x: Q, unit: LandUnit): Q | null => (x.n === BigInt("0") ? null : { n: x.n * FACTOR[unit], d: x.d });
