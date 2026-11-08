// lib/zakat.ts
// Pure Zakat calculation logic. No UI code here.
// IMPORTANT: Every fiqh value in ZAKAT_RULES is marked `verified: false`.
// A qualified scholar must confirm each one before launch.

export type NisabBasis = "silver" | "gold";

export const ZAKAT_RULES = {
  // Rate of Zakat on zakatable wealth (1/40).
  rate: 0.025,
  // Commonly cited nisab weights (52.5 tola silver, 7.5 tola gold).
  // MUST be confirmed by a qualified scholar before launch.
  nisabSilverGrams: 612.36,
  nisabGoldGrams: 87.48,
  defaultNisabBasis: "silver" as NisabBasis,
  verified: false
} as const;

export interface ZakatInput {
  goldPricePerGram: number;
  silverPricePerGram: number;
  cash: number;
  goldGrams: number;
  silverGrams: number;
  businessStock: number;
  receivables: number;
  otherZakatable: number;
  debtsDueNow: number;
  nisabBasis: NisabBasis;
  hawlComplete: boolean;
}

export interface ZakatLine {
  code: string;
  amount: number;
}

export type ZakatStatus = "invalid" | "below_nisab" | "hawl_incomplete" | "due";

export interface ZakatResult {
  status: ZakatStatus;
  errors: { field: keyof ZakatInput; code: string }[];
  assets: ZakatLine[];
  totalAssets: number;
  debts: number;
  netWealth: number;
  nisabValue: number;
  nisabBasis: NisabBasis;
  zakatDue: number;
  notes: string[];
}

const MONEY_FIELDS: (keyof ZakatInput)[] = [
  "goldPricePerGram",
  "silverPricePerGram",
  "cash",
  "goldGrams",
  "silverGrams",
  "businessStock",
  "receivables",
  "otherZakatable",
  "debtsDueNow"
];

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function validateZakatInput(input: ZakatInput) {
  const errors: ZakatResult["errors"] = [];
  for (const field of MONEY_FIELDS) {
    const v = input[field] as number;
    if (typeof v !== "number" || !Number.isFinite(v)) {
      errors.push({ field, code: "not_a_number" });
    } else if (v < 0) {
      errors.push({ field, code: "negative" });
    }
  }
  if (errors.length > 0) return errors;

  const priceField = input.nisabBasis === "gold" ? "goldPricePerGram" : "silverPricePerGram";
  if (!(input[priceField] > 0)) {
    errors.push({ field: priceField, code: "price_required" });
  }
  if (input.goldGrams > 0 && !(input.goldPricePerGram > 0) && priceField !== "goldPricePerGram") {
    errors.push({ field: "goldPricePerGram", code: "price_required" });
  }
  if (input.silverGrams > 0 && !(input.silverPricePerGram > 0) && priceField !== "silverPricePerGram") {
    errors.push({ field: "silverPricePerGram", code: "price_required" });
  }
  return errors;
}

export function calculateZakat(input: ZakatInput): ZakatResult {
  const errors = validateZakatInput(input);
  if (errors.length > 0) {
    return {
      status: "invalid",
      errors,
      assets: [],
      totalAssets: 0,
      debts: 0,
      netWealth: 0,
      nisabValue: 0,
      nisabBasis: input.nisabBasis,
      zakatDue: 0,
      notes: []
    };
  }

  const assets: ZakatLine[] = [
    { code: "cash", amount: input.cash },
    { code: "gold", amount: input.goldGrams * input.goldPricePerGram },
    { code: "silver", amount: input.silverGrams * input.silverPricePerGram },
    { code: "businessStock", amount: input.businessStock },
    { code: "receivables", amount: input.receivables },
    { code: "otherZakatable", amount: input.otherZakatable }
  ].map((l) => ({ ...l, amount: round2(l.amount) }));

  const totalAssets = round2(assets.reduce((s, l) => s + l.amount, 0));
  const debts = round2(input.debtsDueNow);
  const netWealth = round2(Math.max(0, totalAssets - debts));

  const nisabValue = round2(
    input.nisabBasis === "gold"
      ? ZAKAT_RULES.nisabGoldGrams * input.goldPricePerGram
      : ZAKAT_RULES.nisabSilverGrams * input.silverPricePerGram
  );

  const notes = ["scholar_review_required"];
  if (debts > totalAssets) notes.push("debts_exceed_assets");

  const base = { errors: [], assets, totalAssets, debts, netWealth, nisabValue, nisabBasis: input.nisabBasis };

  if (netWealth < nisabValue) return { ...base, status: "below_nisab", zakatDue: 0, notes };
  if (!input.hawlComplete) return { ...base, status: "hawl_incomplete", zakatDue: 0, notes };
  return { ...base, status: "due", zakatDue: round2(netWealth * ZAKAT_RULES.rate), notes };
}
