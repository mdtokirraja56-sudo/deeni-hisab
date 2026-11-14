// lib/weights.ts
// Tola / Masha / Ratti <-> gram converter for gold and silver. Pure functions, no UI.
// 1 tola = 12 masha, 1 masha = 8 ratti (so 1 tola = 96 ratti).
// Values follow the fatwa of Mufti Muhammad Saleh Qadri Noori Bareilvi (Muntakhab Fatawe, pp. 18-31, 86-95):
//   1 ratti = 0.1296 g, 1 masha = 8 ratti = 1.0368 g, 1 tola = 12 masha = 12.4416 g.
//   The English silver rupee weighs 11.25 masha = 11.664 g ("rupay bhar"). This is NOT the same as the tola.
//   The "7.5 tola" and "52.5 tola" of the nisab mean 8 and 56 rupee-weights: 93.312 g gold, 653.184 g silver.
// `verified: false` stays until the site's scholar confirms it.

export const WEIGHT_RULES = {
  tolaGrams: 12.4416,
  mashaPerTola: 12,
  rattiPerMasha: 8,
  mashaGrams: 1.0368,
  rattiGrams: 0.1296,
  rupeeGrams: 11.664, // English silver rupee = 11.25 masha
  mithqalGrams: 4.6656, // 4.5 masha
  dirhamGrams: 3.26592, // shar'i dirham
  verified: false
} as const;

const RATTI_PER_TOLA = WEIGHT_RULES.mashaPerTola * WEIGHT_RULES.rattiPerMasha; // 96
export const GRAMS_PER_RATTI = WEIGHT_RULES.tolaGrams / RATTI_PER_TOLA; // 0.1296
export const GRAMS_PER_MASHA = WEIGHT_RULES.tolaGrams / WEIGHT_RULES.mashaPerTola; // 1.0368

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
