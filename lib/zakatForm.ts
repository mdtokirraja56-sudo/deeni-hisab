// lib/zakatForm.ts
// Turns the detailed Zakat form (weights in tola/masha/ratti/gram/mg, prices per tola/gram/10 g/kg,
// cash, trade goods, liabilities) into the plain input of calculateZakat() in lib/zakat.ts.
// Pure functions. No UI. It does not change the Zakat rules; those stay in lib/zakat.ts.
// Items whose treatment depends on the scholar (provident fund, committee, loans given) are only
// counted when the user ticks "include". Nothing is decided for him.

import { WEIGHT_RULES, tolaToGrams } from "./weights";
import type { NisabBasis, ZakatInput } from "./zakat";

export type GoldPriceUnit = "tola" | "g" | "g10" | "rb"; // rb = "rupay bhar" = weight of the English silver rupee (11.664 g)
export type SilverPriceUnit = "tola" | "g" | "kg" | "rb";
export type PriceUnit = GoldPriceUnit | SilverPriceUnit;

// Every unit has its own box. Whatever is filled in is added together (e.g. 2 tola + 3 masha + 5 gram).
// "bhari" = "rupay-bhar" = the English silver rupee, 11.664 g (fatwa, Muntakhab Fatawe). The meaning of "bhari"
// differs by place, so it is shown on screen and the scholar must confirm it (unverified).
export const BHARI_GRAMS = WEIGHT_RULES.rupeeGrams;
export interface WeightForm { tola: string; masha: string; ratti: string; bhari: string; gram: string; mg: string }
export const emptyWeight = (): WeightForm => ({ tola: "", masha: "", ratti: "", bhari: "", gram: "", mg: "" });

const n = (s: string): number => { const v = parseFloat(s); return Number.isFinite(v) && v > 0 ? v : 0; };
const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

export function weightToGrams(w: WeightForm): number {
  const t = tolaToGrams({ tola: n(w.tola), masha: n(w.masha), ratti: n(w.ratti) });
  const fromTmr = t.status === "ok" ? t.grams : 0;
  return round(fromTmr + n(w.bhari) * BHARI_GRAMS + n(w.gram) + n(w.mg) / 1000, 6);
}

export function pricePerGram(unit: PriceUnit, price: string): number {
  const p = n(price);
  if (unit === "tola") return p / WEIGHT_RULES.tolaGrams;
  if (unit === "g10") return p / 10;
  if (unit === "rb") return p / WEIGHT_RULES.rupeeGrams;
  if (unit === "kg") return p / 1000;
  return p;
}

export interface ZakatForm {
  goldPrice: string; goldPriceUnit: GoldPriceUnit; silverPrice: string; silverPriceUnit: SilverPriceUnit;
  gold: WeightForm; silver: WeightForm;
  cashHand: string; cashBank: string; investments: string; prizeBonds: string;
  providentFund: string; committee: string; loansGiven: string;
  incPf: boolean; incCommittee: boolean; incLoans: boolean;
  rawMaterial: string; stock: string; tradePlots: string; partnership: string;
  loan: string; installments: string; committeeDue: string; utilities: string; dealers: string; salaries: string; lastZakat: string;
}

export const emptyForm = (): ZakatForm => ({
  goldPrice: "", goldPriceUnit: "tola", silverPrice: "", silverPriceUnit: "tola",
  gold: emptyWeight(), silver: emptyWeight(),
  cashHand: "", cashBank: "", investments: "", prizeBonds: "", providentFund: "", committee: "", loansGiven: "",
  incPf: false, incCommittee: false, incLoans: false,
  rawMaterial: "", stock: "", tradePlots: "", partnership: "",
  loan: "", installments: "", committeeDue: "", utilities: "", dealers: "", salaries: "", lastZakat: ""
});

export interface FormLine { code: string; amount: number }
export interface BuiltZakat {
  input: ZakatInput;
  goldGrams: number; silverGrams: number; goldValue: number; silverValue: number;
  assetLines: FormLine[]; liabilityLines: FormLine[]; excluded: FormLine[];
}

export function buildZakat(f: ZakatForm, nisabBasis: NisabBasis, hawlComplete: boolean): BuiltZakat {
  const goldGrams = weightToGrams(f.gold), silverGrams = weightToGrams(f.silver);
  const gp = pricePerGram(f.goldPriceUnit, f.goldPrice), sp = pricePerGram(f.silverPriceUnit, f.silverPrice);
  const goldValue = goldGrams * gp, silverValue = silverGrams * sp;

  const deferred: FormLine[] = [
    { code: "providentFund", amount: n(f.providentFund) }, { code: "committee", amount: n(f.committee) }, { code: "loansGiven", amount: n(f.loansGiven) }
  ];
  const incFlag = { providentFund: f.incPf, committee: f.incCommittee, loansGiven: f.incLoans } as Record<string, boolean>;
  const included = deferred.filter((d) => d.amount > 0 && incFlag[d.code]);
  const excluded = deferred.filter((d) => d.amount > 0 && !incFlag[d.code]);

  const assetLines: FormLine[] = [
    { code: "cashHand", amount: n(f.cashHand) }, { code: "cashBank", amount: n(f.cashBank) },
    { code: "gold", amount: goldValue }, { code: "silver", amount: silverValue },
    { code: "investments", amount: n(f.investments) }, { code: "prizeBonds", amount: n(f.prizeBonds) },
    ...included,
    { code: "rawMaterial", amount: n(f.rawMaterial) }, { code: "stock", amount: n(f.stock) },
    { code: "tradePlots", amount: n(f.tradePlots) }, { code: "partnership", amount: n(f.partnership) }
  ].filter((l) => l.amount > 0);

  const liabilityLines: FormLine[] = [
    { code: "loan", amount: n(f.loan) }, { code: "installments", amount: n(f.installments) }, { code: "committeeDue", amount: n(f.committeeDue) },
    { code: "utilities", amount: n(f.utilities) }, { code: "dealers", amount: n(f.dealers) }, { code: "salaries", amount: n(f.salaries) }, { code: "lastZakat", amount: n(f.lastZakat) }
  ].filter((l) => l.amount > 0);

  const sum = (codes: string[]) => assetLines.filter((l) => codes.includes(l.code)).reduce((s, l) => s + l.amount, 0);
  const input: ZakatInput = {
    goldPricePerGram: gp, silverPricePerGram: sp,
    cash: sum(["cashHand", "cashBank"]),
    goldGrams, silverGrams,
    businessStock: sum(["rawMaterial", "stock", "tradePlots", "partnership"]),
    receivables: sum(["providentFund", "committee", "loansGiven"]),
    otherZakatable: sum(["investments", "prizeBonds"]),
    debtsDueNow: liabilityLines.reduce((s, l) => s + l.amount, 0),
    nisabBasis, hawlComplete
  };
  return { input, goldGrams, silverGrams, goldValue, silverValue, assetLines, liabilityLines, excluded };
}
