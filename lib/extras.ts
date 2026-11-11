// lib/extras.ts
// Pure calculations: Fidya, Kaffarah, Mahr, Qurbani share, Qaza-e-Umri counting. No UI code here.
// IMPORTANT: all rules are `verified: false` until a qualified Hanafi scholar confirms them.
// Where the rule is not settled, the code returns a count and the UI says "ask your scholar". Nothing is guessed.

export const EXTRA_RULES = {
  dirhamSilverGrams: 3.0618, // 1 shar'i dirham
  minMahrDirham: 10, // minimum mahr (Hanafi)
  fatimiMahrDirham: 500, // Mahr-e-Fatimi
  prayersPerDay: 6, // 5 fard + witr
  kaffaraFeed: { fast: 60, zihar: 60, oath: 10 } as Record<KaffaraKind, number>,
  kaffaraFastDays: { fast: 60, zihar: 60, oath: 3 } as Record<KaffaraKind, number>,
  qurbaniMaxShares: 7,
  verified: false
} as const;

const bad = (n: number) => !Number.isFinite(n) || n < 0;
const whole = (n: number) => Number.isInteger(n) && n >= 1;

/* ------------------------------ Fidya ------------------------------ */
export type FidyaKind = "fasts" | "prayers";
export interface FidyaInput { kind: FidyaKind; quantity: number; ratePerPerson: number } // prayers: quantity = number of DAYS of prayers
export interface FidyaResult {
  status: "invalid" | "ok";
  errors: { field: keyof FidyaInput; code: "number" | "quantity" | "rate" }[];
  units: number; // fasts, or prayers (6 per day incl. witr)
  total: number;
  notes: ("scholar_review_required" | "fidya_conditions")[];
}
export function calculateFidya(i: FidyaInput): FidyaResult {
  const errors: FidyaResult["errors"] = [];
  for (const f of ["quantity", "ratePerPerson"] as const) if (bad(i[f])) errors.push({ field: f, code: "number" });
  if (!errors.length) {
    if (!whole(i.quantity)) errors.push({ field: "quantity", code: "quantity" });
    if (i.ratePerPerson <= 0) errors.push({ field: "ratePerPerson", code: "rate" });
  }
  const notes: FidyaResult["notes"] = ["fidya_conditions", "scholar_review_required"];
  if (errors.length) return { status: "invalid", errors, units: 0, total: 0, notes };
  const units = i.kind === "prayers" ? i.quantity * EXTRA_RULES.prayersPerDay : i.quantity;
  return { status: "ok", errors, units, total: units * i.ratePerPerson, notes };
}

/* ----------------------------- Kaffarah ---------------------------- */
export type KaffaraKind = "fast" | "zihar" | "oath";
export interface KaffaraInput { kind: KaffaraKind; count: number; ratePerPerson: number }
export interface KaffaraResult {
  status: "invalid" | "ok";
  errors: { field: keyof KaffaraInput; code: "number" | "count" | "rate" }[];
  poorPerKaffara: number;
  poorTotal: number;
  fastDaysPerKaffara: number;
  total: number;
  notes: ("scholar_review_required" | "order_matters")[];
}
export function calculateKaffara(i: KaffaraInput): KaffaraResult {
  const errors: KaffaraResult["errors"] = [];
  for (const f of ["count", "ratePerPerson"] as const) if (bad(i[f])) errors.push({ field: f, code: "number" });
  if (!errors.length) {
    if (!whole(i.count)) errors.push({ field: "count", code: "count" });
    if (i.ratePerPerson <= 0) errors.push({ field: "ratePerPerson", code: "rate" });
  }
  const poorPerKaffara = EXTRA_RULES.kaffaraFeed[i.kind];
  const notes: KaffaraResult["notes"] = ["order_matters", "scholar_review_required"];
  if (errors.length) return { status: "invalid", errors, poorPerKaffara, poorTotal: 0, fastDaysPerKaffara: 0, total: 0, notes };
  return {
    status: "ok", errors, poorPerKaffara, poorTotal: poorPerKaffara * i.count,
    fastDaysPerKaffara: EXTRA_RULES.kaffaraFastDays[i.kind],
    total: poorPerKaffara * i.count * i.ratePerPerson, notes
  };
}

/* ------------------------------- Mahr ------------------------------ */
export interface MahrInput { silverPricePerGram: number; agreedMahr: number } // agreedMahr 0 = not given
export interface MahrResult {
  status: "invalid" | "ok";
  errors: { field: keyof MahrInput; code: "number" | "price_required" }[];
  minGrams: number; minValue: number;
  fatimiGrams: number; fatimiValue: number;
  agreed: "unknown" | "above_min" | "below_min";
}
export function calculateMahr(i: MahrInput): MahrResult {
  const errors: MahrResult["errors"] = [];
  for (const f of ["silverPricePerGram", "agreedMahr"] as const) if (bad(i[f])) errors.push({ field: f, code: "number" });
  if (!errors.length && i.silverPricePerGram <= 0) errors.push({ field: "silverPricePerGram", code: "price_required" });
  const minGrams = EXTRA_RULES.minMahrDirham * EXTRA_RULES.dirhamSilverGrams;
  const fatimiGrams = EXTRA_RULES.fatimiMahrDirham * EXTRA_RULES.dirhamSilverGrams;
  if (errors.length) return { status: "invalid", errors, minGrams, minValue: 0, fatimiGrams, fatimiValue: 0, agreed: "unknown" };
  const minValue = minGrams * i.silverPricePerGram;
  return {
    status: "ok", errors, minGrams, minValue, fatimiGrams, fatimiValue: fatimiGrams * i.silverPricePerGram,
    agreed: i.agreedMahr > 0 ? (i.agreedMahr >= minValue ? "above_min" : "below_min") : "unknown"
  };
}

/* ------------------------------ Qurbani ---------------------------- */
export interface QurbaniInput { animalPrice: number; shares: number; extraCosts: number }
export interface QurbaniResult {
  status: "invalid" | "ok";
  errors: { field: keyof QurbaniInput; code: "number" | "price_required" | "shares" }[];
  perShare: number;
  notes: ("equal_shares" | "scholar_review_required")[];
}
export function calculateQurbani(i: QurbaniInput): QurbaniResult {
  const errors: QurbaniResult["errors"] = [];
  for (const f of ["animalPrice", "shares", "extraCosts"] as const) if (bad(i[f])) errors.push({ field: f, code: "number" });
  if (!errors.length) {
    if (i.animalPrice <= 0) errors.push({ field: "animalPrice", code: "price_required" });
    if (!whole(i.shares) || i.shares > EXTRA_RULES.qurbaniMaxShares) errors.push({ field: "shares", code: "shares" });
  }
  const notes: QurbaniResult["notes"] = ["equal_shares", "scholar_review_required"];
  if (errors.length) return { status: "invalid", errors, perShare: 0, notes };
  return { status: "ok", errors, perShare: (i.animalPrice + i.extraCosts) / i.shares, notes };
}

/* ---------------------------- Qaza-e-Umri -------------------------- */
export interface QazaInput {
  bulughAge: number; // age when prayers became obligatory
  startAge: number; // age when regular prayer started (or current age if still not praying)
  daysExcusedPerYear: number; // e.g. women's haiz/nifas days, 0 if none
  fastsMissedPerYear: number; // 0 = not counted
}
export interface QazaResult {
  status: "invalid" | "ok";
  errors: { field: keyof QazaInput; code: "number" | "age_order" | "excused" }[];
  years: number; days: number; prayers: number; perPrayer: number; witr: number; fasts: number;
  notes: ("approximate" | "bulugh_age" | "scholar_review_required")[];
}
const DAYS_PER_YEAR = 354; // lunar year (approx.)
export function calculateQaza(i: QazaInput): QazaResult {
  const errors: QazaResult["errors"] = [];
  for (const f of ["bulughAge", "startAge", "daysExcusedPerYear", "fastsMissedPerYear"] as const) if (bad(i[f])) errors.push({ field: f, code: "number" });
  if (!errors.length) {
    if (i.startAge <= i.bulughAge) errors.push({ field: "startAge", code: "age_order" });
    if (i.daysExcusedPerYear >= DAYS_PER_YEAR) errors.push({ field: "daysExcusedPerYear", code: "excused" });
  }
  const notes: QazaResult["notes"] = ["approximate", "bulugh_age", "scholar_review_required"];
  const z = { years: 0, days: 0, prayers: 0, perPrayer: 0, witr: 0, fasts: 0 };
  if (errors.length) return { status: "invalid", errors, ...z, notes };
  const years = i.startAge - i.bulughAge;
  const days = Math.round(years * (DAYS_PER_YEAR - i.daysExcusedPerYear));
  return {
    status: "ok", errors, years, days, prayers: days * EXTRA_RULES.prayersPerDay,
    perPrayer: days, witr: days, fasts: Math.round(years * i.fastsMissedPerYear), notes
  };
}
