// lib/mirathSpecial.ts
// Special Mirath cases, following Al-Sirajiyya (fasl fil-khuntha, fasl fil-hamal).
// Both cases use ONE method: solve the problem under two assumptions (male / female),
// then compare the two results for every heir.
//
//   khuntha mushkil : "least"   = every heir gets the lesser of his two shares, the rest is held back
//                                 (Abu Hanifa and his companions; the fatwa).
//                     "average" = every heir gets half of (share if male + share if female)
//                                 (Sha'bi / Ibn Abbas, as Imam Muhammad derives it; sums to the whole).
//   hamal           : the child is taken as n boys and as n girls; every heir gets the lesser
//                     of the two, the rest is held back until birth.
//                     n = 1 : one child (Abu Yusuf via Khassaf; the book says "the fatwa is on it").
//                     n = 4 : four children (Abu Hanifa's narration; the book's worked example).
//
// Every rule here is marked unverified until the scholar confirms it.
// This file only adds to the main engine. It never changes calculateMirath().

import { calculateMirath, frac, fracValue, DEFAULT_OPTIONS, type Counts, type Frac, type Gender, type MirathOptions, type MirathResult } from "./mirath";
import type { HeirKey } from "./heirs";

const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
const ZERO: Frac = { n: 0, d: 1 };
const add = (a: Frac, b: Frac): Frac => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a: Frac, b: Frac): Frac => frac(a.n * b.d - b.n * a.d, a.d * b.d);
const mulInt = (a: Frac, k: number): Frac => frac(a.n * k, a.d);
const cmp = (a: Frac, b: Frac) => a.n * b.d - b.n * a.d;
const minF = (a: Frac, b: Frac) => (cmp(a, b) <= 0 ? a : b);
const half = (a: Frac): Frac => frac(a.n, a.d * 2);

// The doubtful person (khuntha) or the unborn child can stand in these places of the family.
export type SpecialRole = "child" | "grandchild" | "fullSibling" | "consanguineSibling" | "uterineSibling";
export const ROLE_PAIRS: Record<SpecialRole, [HeirKey, HeirKey]> = {
  child: ["son", "daughter"],
  grandchild: ["sonsSon", "sonsDaughter"],
  fullSibling: ["fullBrother", "fullSister"],
  consanguineSibling: ["consanguineBrother", "consanguineSister"],
  uterineSibling: ["uterineBrother", "uterineSister"]
} as Record<SpecialRole, [HeirKey, HeirKey]>;

export type SpecialKind = "khuntha" | "hamal";
export type KhunthaMethod = "least" | "average";
export type HamalHold = 1 | 4;

export interface SpecialInput {
  kind: SpecialKind;
  role: SpecialRole;
  khunthaMethod?: KhunthaMethod; // default "least"
  hamalHold?: HamalHold;         // default 1
}

export interface SpecialRow {
  key: HeirKey;
  count: number;
  ifMale: Frac;      // share of ONE person if the doubtful person is male / the child is a boy
  ifFemale: Frac;    // share of ONE person if female / girl
  given: Frac;       // all persons of this kind together
  givenPerHead: Frac;
  parts: number;     // `given` as parts of `total`
  isSpecial: boolean;
}

export interface SpecialResult {
  status: "ok" | "invalid" | "unsupported";
  rows: SpecialRow[];          // the special person is the first row (key = male key of the role, isSpecial)
  specialKey: HeirKey;
  withheld: Frac;              // held back until the doubt is cleared (0 in "average")
  withheldParts: number;
  total: number;               // common denominator of every share
  male: MirathResult;
  female: MirathResult;
  holdBack: number;            // how many children were taken for each scenario (hamal), 1 for khuntha
}

const specialShare = (res: MirathResult, key: HeirKey, k: number): Frac => {
  const row = res.rows.find((r) => r.key === key);
  if (!row || row.status !== "inherits") return ZERO;
  return mulInt(row.perHeadShare, k);
};

export function solveSpecial(gender: Gender, counts: Counts, input: SpecialInput, opts: MirathOptions = DEFAULT_OPTIONS): SpecialResult {
  const [mk, fk] = ROLE_PAIRS[input.role];
  const n = input.kind === "hamal" ? (input.hamalHold ?? 1) : 1;
  const method: KhunthaMethod = input.khunthaMethod ?? "least";
  const maleCounts = { ...counts, [mk]: (counts[mk] || 0) + n } as Counts;
  const femaleCounts = { ...counts, [fk]: (counts[fk] || 0) + n } as Counts;
  const male = calculateMirath(gender, maleCounts, opts);
  const female = calculateMirath(gender, femaleCounts, opts);
  const empty: SpecialResult = { status: "ok", rows: [], specialKey: mk, withheld: ZERO, withheldParts: 0, total: 1, male, female, holdBack: n };
  if (male.status === "invalid" || female.status === "invalid") return { ...empty, status: "invalid" };
  if (male.status !== "ok" || female.status !== "ok") return { ...empty, status: "unsupported" };

  const pick = (a: Frac, b: Frac) => (input.kind === "khuntha" && method === "average" ? half(add(a, b)) : minF(a, b));
  const perHead = (res: MirathResult, key: HeirKey) => {
    const r = res.rows.find((x) => x.key === key);
    return r && r.status === "inherits" ? r.perHeadShare : ZERO;
  };

  const rows: SpecialRow[] = [];
  const sm = specialShare(male, mk, n);
  const sf = specialShare(female, fk, n);
  // a khuntha is alive and takes his share now; an unborn child takes nothing now, its whole share is held back
  const sg = input.kind === "hamal" ? ZERO : pick(sm, sf);
  rows.push({ key: mk, count: n, ifMale: sm, ifFemale: sf, given: sg, givenPerHead: frac(sg.n, sg.d * n), parts: 0, isSpecial: true });

  for (const key of Object.keys(counts) as HeirKey[]) {
    const c = counts[key] || 0;
    if (c === 0) continue;
    const a = perHead(male, key), b = perHead(female, key);
    const g = pick(a, b);
    rows.push({ key, count: c, ifMale: a, ifFemale: b, given: mulInt(g, c), givenPerHead: g, parts: 0, isSpecial: false });
  }

  let sum = ZERO;
  for (const r of rows) sum = add(sum, r.given);
  const withheld = sub(frac(1, 1), sum);
  let total = lcm(1, withheld.d);
  for (const r of rows) { total = lcm(total, r.given.d); total = lcm(total, r.givenPerHead.d); }
  for (const r of rows) r.parts = Math.round(fracValue(r.given) * total);
  return { ...empty, rows, withheld, withheldParts: Math.round(fracValue(withheld) * total), total };
}
