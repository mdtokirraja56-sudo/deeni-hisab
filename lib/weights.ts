// lib/weights.ts
// Tola / Masha / Ratti <-> gram converter for gold and silver. Pure functions, no UI.
// 1 tola = 12 masha, 1 masha = 8 ratti (so 1 tola = 96 ratti).
// The tola weight (11.664 g) is the same figure that gives the nisab values used in the Zakat module
// (52.5 tola = 612.36 g silver, 7.5 tola = 87.48 g gold). `verified: false`: a scholar should confirm it.

export const WEIGHT_RULES = {
  tolaGrams: 11.664,
  mashaPerTola: 12,
  rattiPerMasha: 8,
  verified: false
} as const;

const RATTI_PER_TOLA = WEIGHT_RULES.mashaPerTola * WEIGHT_RULES.rattiPerMasha; // 96
export const GRAMS_PER_RATTI = WEIGHT_RULES.tolaGrams / RATTI_PER_TOLA; // 0.1215
export const GRAMS_PER_MASHA = WEIGHT_RULES.tolaGrams / WEIGHT_RULES.mashaPerTola; // 0.972

export interface TolaParts { tola: number; masha: number; ratti: number }

const bad = (n: number) => !Number.isFinite(n) || n < 0;
const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d;

export interface ToGramsResult { status: "invalid" | "ok"; grams: number; totalRatti: number }
export function tolaToGrams(p: TolaParts): ToGramsResult {
  if (bad(p.tola) || bad(p.masha) || bad(p.ratti) || (p.tola === 0 && p.masha === 0 && p.ratti === 0)) return { status: "invalid", grams: 0, totalRatti: 0 };
  const totalRatti = p.tola * RATTI_PER_TOLA + p.masha * WEIGHT_RULES.rattiPerMasha + p.ratti;
  return { status: "ok", grams: round(totalRatti * GRAMS_PER_RATTI, 4), totalRatti };
}

export interface FromGramsResult extends TolaParts { status: "invalid" | "ok"; grams: number; tolaDecimal: number }
export function gramsToTola(grams: number): FromGramsResult {
  const none = { status: "invalid" as const, grams: 0, tola: 0, masha: 0, ratti: 0, tolaDecimal: 0 };
  if (bad(grams) || grams === 0) return none;
  const total = Math.round((grams / GRAMS_PER_RATTI) * 100) / 100; // ratti, to 2 decimals
  const tola = Math.floor(total / RATTI_PER_TOLA);
  const rem = round(total - tola * RATTI_PER_TOLA, 2);
  const masha = Math.floor(rem / WEIGHT_RULES.rattiPerMasha);
  const ratti = round(rem - masha * WEIGHT_RULES.rattiPerMasha, 2);
  return { status: "ok", grams, tola, masha, ratti, tolaDecimal: round(grams / WEIGHT_RULES.tolaGrams, 4) };
}
