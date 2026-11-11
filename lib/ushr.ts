// lib/ushr.ts
// Pure Ushr (tithe on farm produce) calculation. No UI code here.
// IMPORTANT: every value in USHR_RULES is marked `verified: false`.
// A qualified Hanafi scholar must confirm each one before launch.

export type Irrigation = "rain" | "paid" | "mixed";
export type UshrUnit = "kg" | "quintal";

export const USHR_RULES = {
  // 1/10 when watered by rain, rivers or springs (no cost to the farmer).
  rainRate: 0.1,
  // 1/20 when watered with effort or cost (well, bore, pump, bucket, purchased water).
  paidRate: 0.05,
  // Imam Abu Hanifa: no nisab (minimum) and no deduction of farming costs.
  nisabKg: null,
  deductCosts: false,
  kgPerQuintal: 100,
  verified: false
} as const;

export interface UshrInput {
  quantity: number; // in `unit`
  unit: UshrUnit;
  pricePerKg: number; // optional, 0 = not given
  irrigation: Irrigation;
  paidSharePercent: number; // used only for "mixed": share of the growing season watered with cost, 0..100
}

export type UshrErrorCode = "number" | "quantity_required" | "share_range";

export type UshrStatus = "invalid" | "due" | "needs_ruling";

export interface UshrResult {
  status: UshrStatus;
  errors: { field: keyof UshrInput; code: UshrErrorCode }[];
  produceKg: number;
  rate: number; // 0.1 or 0.05 (0 when needs_ruling / invalid)
  ushrKg: number;
  remainingKg: number;
  ushrValue: number; // 0 when no price given
  hasPrice: boolean;
  notes: ("no_nisab" | "no_deduction" | "equal_share" | "scholar_review_required")[];
}

const isBad = (n: number) => !Number.isFinite(n) || Number.isNaN(n);

export function calculateUshr(input: UshrInput): UshrResult {
  const errors: UshrResult["errors"] = [];
  for (const f of ["quantity", "pricePerKg", "paidSharePercent"] as const) {
    if (isBad(input[f]) || input[f] < 0) errors.push({ field: f, code: "number" });
  }
  if (!errors.length && input.quantity <= 0) errors.push({ field: "quantity", code: "quantity_required" });
  if (!errors.length && input.irrigation === "mixed" && (input.paidSharePercent < 0 || input.paidSharePercent > 100)) {
    errors.push({ field: "paidSharePercent", code: "share_range" });
  }
  const produceKg = input.unit === "quintal" ? input.quantity * USHR_RULES.kgPerQuintal : input.quantity;
  const base: UshrResult = {
    status: "invalid", errors, produceKg: errors.length ? 0 : produceKg, rate: 0, ushrKg: 0, remainingKg: 0, ushrValue: 0,
    hasPrice: input.pricePerKg > 0, notes: ["no_nisab", "no_deduction", "scholar_review_required"]
  };
  if (errors.length) return base;

  let rate: number;
  if (input.irrigation === "rain") rate = USHR_RULES.rainRate;
  else if (input.irrigation === "paid") rate = USHR_RULES.paidRate;
  else if (input.paidSharePercent > 50) rate = USHR_RULES.paidRate; // mostly watered with cost
  else if (input.paidSharePercent < 50) rate = USHR_RULES.rainRate; // mostly watered without cost
  else return { ...base, status: "needs_ruling", notes: ["equal_share", "scholar_review_required"] }; // exactly half: do not guess

  const ushrKg = produceKg * rate;
  return {
    ...base, status: "due", rate, ushrKg, remainingKg: produceKg - ushrKg,
    ushrValue: input.pricePerKg > 0 ? ushrKg * input.pricePerKg : 0
  };
}
