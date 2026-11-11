// lib/fitr.ts
// Pure Sadaqah-e-Fitr calculation. No UI code here.
// IMPORTANT: every value in FITR_RULES is marked `verified: false`.
// Scholars differ on the modern weight of the sa'. A qualified scholar must choose the value to use.

export type FitrGrain = "wheat" | "barley" | "dates" | "raisins";

export const FITR_RULES = {
  // Weight of HALF a sa' of wheat, in grams. Widely quoted values:
  weightOptions: [1633, 2047] as const,
  // Preselected value. To be confirmed by the site's scholar.
  defaultWheatGrams: 2047,
  // Barley, dates and raisins: one full sa' = twice the wheat weight.
  multiplier: { wheat: 1, barley: 2, dates: 2, raisins: 2 } as Record<FitrGrain, number>,
  // Silver nisab (same figure as the Zakat module).
  nisabSilverGrams: 612.36,
  verified: false
} as const;

export interface FitrInput {
  persons: number; // whole number >= 1
  grain: FitrGrain;
  wheatGrams: number; // half sa' of wheat in grams (chosen by the user / scholar)
  pricePerKg: number; // price of the CHOSEN grain per kg
  // Optional "sahib-e-nisab" check
  surplusWealth: number; // 0 = not given
  silverPricePerGram: number; // 0 = not given
}

export type FitrErrorCode = "number" | "persons" | "weight" | "price_required";
export type FitrStatus = "invalid" | "ok";
export type FitrNisab = "unknown" | "reached" | "not_reached";

export interface FitrResult {
  status: FitrStatus;
  errors: { field: keyof FitrInput; code: FitrErrorCode }[];
  gramsPerPerson: number;
  amountPerPerson: number;
  total: number;
  nisab: FitrNisab;
  nisabValue: number;
  notes: ("weight_differs" | "scholar_review_required")[];
}

const isBad = (n: number) => !Number.isFinite(n) || Number.isNaN(n);

export function calculateFitr(input: FitrInput): FitrResult {
  const errors: FitrResult["errors"] = [];
  for (const f of ["persons", "wheatGrams", "pricePerKg", "surplusWealth", "silverPricePerGram"] as const) {
    if (isBad(input[f]) || input[f] < 0) errors.push({ field: f, code: "number" });
  }
  if (!errors.length) {
    if (!Number.isInteger(input.persons) || input.persons < 1) errors.push({ field: "persons", code: "persons" });
    if (input.wheatGrams <= 0) errors.push({ field: "wheatGrams", code: "weight" });
    if (input.pricePerKg <= 0) errors.push({ field: "pricePerKg", code: "price_required" });
  }
  const empty: FitrResult = {
    status: "invalid", errors, gramsPerPerson: 0, amountPerPerson: 0, total: 0, nisab: "unknown", nisabValue: 0,
    notes: ["weight_differs", "scholar_review_required"]
  };
  if (errors.length) return empty;

  const gramsPerPerson = input.wheatGrams * FITR_RULES.multiplier[input.grain];
  const amountPerPerson = (gramsPerPerson / 1000) * input.pricePerKg;
  let nisab: FitrNisab = "unknown";
  let nisabValue = 0;
  if (input.silverPricePerGram > 0 && input.surplusWealth > 0) {
    nisabValue = FITR_RULES.nisabSilverGrams * input.silverPricePerGram;
    nisab = input.surplusWealth >= nisabValue ? "reached" : "not_reached";
  }
  return { ...empty, status: "ok", gramsPerPerson, amountPerPerson, total: amountPerPerson * input.persons, nisab, nisabValue };
}
