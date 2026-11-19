// lib/land.ts - land area converter. Exact units only; local units (bigha, kattha...) are
// entered by the user, because their size differs by region. All math is BigInt (no float error).
// Base: 1 square metre = 10^10 base units. Every factor below is an exact integer.
export type LandUnit = "sqft" | "sqyd" | "sqm" | "acre" | "hectare" | "decimal" | "are";
export const LAND_UNITS: LandUnit[] = ["sqft", "sqyd", "sqm", "decimal", "acre", "hectare", "are"];
const B = 10_000_000_000n;
// 1 ft = 0.3048 m exactly, so 1 sq ft = 0.09290304 m2; 1 acre = 43560 sq ft; 1 decimal (cent) = 1/100 acre.
export const FACTOR: Record<LandUnit, bigint> = {
  sqm: B, sqft: 929_030_400n, sqyd: 8_361_273_600n, acre: 40_468_564_224_000n,
  decimal: 404_685_642_240n, hectare: 100_000_000_000_000n, are: 1_000_000_000_000n
};
export const LENGTH_M: Record<"ft" | "yd" | "m", bigint> = { ft: 3048n, yd: 9144n, m: 10000n }; // x 10^-4 m

/** "12.5" -> {n:125n, d:10n}; returns null if not a positive-or-zero plain number. */
export function parseExact(s: string): { n: bigint; d: bigint } | null {
  const t = s.trim();
  if (!/^\d+(\.\d+)?$/.test(t) && !/^\.\d+$/.test(t)) return null;
  const [i, f = ""] = t.split(".");
  return { n: BigInt((i || "0") + f), d: 10n ** BigInt(f.length) };
}
type Q = { n: bigint; d: bigint };
const mul = (a: Q, b: Q): Q => ({ n: a.n * b.n, d: a.d * b.d });

/** Area as a fraction of base units. */
export const toBase = (value: Q, factor: bigint | Q): Q => mul(value, typeof factor === "bigint" ? { n: factor, d: 1n } : factor);
export function area(len: Q, wid: Q, lu: "ft" | "yd" | "m"): Q {
  // metres^2 = (len*f/1e4)*(wid*f/1e4); base = that * 1e10  =>  len*wid*f*f*100
  return mul(mul(len, wid), { n: LENGTH_M[lu] * LENGTH_M[lu] * 100n, d: 1n });
}
/** Converts base units to a unit (factor may be a fraction) with `dec` decimals, rounded half up. */
export function fromBase(base: Q, factor: bigint | Q, dec = 4): string {
  const f: Q = typeof factor === "bigint" ? { n: factor, d: 1n } : factor;
  const scale = 10n ** BigInt(dec);
  const den = base.d * f.n;
  const v = (base.n * f.d * scale * 2n + den) / (den * 2n);
  const s = v.toString().padStart(dec + 1, "0");
  const whole = s.slice(0, s.length - dec), frac = s.slice(s.length - dec).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}
/** Size of a user-defined local unit: "1 local unit = X <exact unit>", as base units (exact fraction). */
export const localFactor = (x: Q, unit: LandUnit): Q | null => (x.n === 0n ? null : { n: x.n * FACTOR[unit], d: x.d });
