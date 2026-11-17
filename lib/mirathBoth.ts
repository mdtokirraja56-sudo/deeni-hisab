// lib/mirathBoth.ts
// Khuntha mushkil AND an unborn child (hamal) in the SAME family.
// Same method as mirathSpecial.ts, just with two doubts: solve the problem for every combination
// (khuntha male/female  x  child = n boys / n girls = 4 cases) and give every living heir
// the LEAST of his shares over those cases. The unborn child's share and the rest are held back.
// Marked unverified: a scholar must confirm it. This file only adds to the engine.

import { calculateMirath, frac, fracValue, DEFAULT_OPTIONS, type Counts, type Frac, type Gender, type MirathOptions, type MirathResult } from "./mirath";
import type { HeirKey } from "./heirs";
import { ROLE_PAIRS, type HamalHold, type SpecialRole } from "./mirathSpecial";

const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
const ZERO: Frac = { n: 0, d: 1 };
const add = (a: Frac, b: Frac): Frac => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a: Frac, b: Frac): Frac => frac(a.n * b.d - b.n * a.d, a.d * b.d);
const mulInt = (a: Frac, k: number): Frac => frac(a.n * k, a.d);
const minF = (a: Frac, b: Frac) => (a.n * b.d - b.n * a.d <= 0 ? a : b);

export type BothWho = "khuntha" | "hamal" | "heir";
export interface BothRow {
  key: HeirKey;
  who: BothWho;
  count: number;
  cases: Frac[];       // all persons of this row together, in the 4 cases
  given: Frac;         // least over the 4 cases (0 for the unborn child: it is held)
  givenPerHead: Frac;
  parts: number;
}
export interface BothResult {
  status: "ok" | "invalid" | "unsupported";
  rows: BothRow[];
  caseLabels: [string, string][]; // [khuntha is "m"|"f", child is "m"|"f"]
  withheld: Frac;
  withheldParts: number;
  total: number;
}

export function solveBoth(gender: Gender, counts: Counts, khRole: SpecialRole, hmRole: SpecialRole, hold: HamalHold, opts: MirathOptions = DEFAULT_OPTIONS): BothResult {
  const [km, kf] = ROLE_PAIRS[khRole];
  const [hm, hf] = ROLE_PAIRS[hmRole];
  const combos: { k: HeirKey; h: HeirKey; lab: [string, string] }[] = [
    { k: km, h: hm, lab: ["m", "m"] }, { k: km, h: hf, lab: ["m", "f"] },
    { k: kf, h: hm, lab: ["f", "m"] }, { k: kf, h: hf, lab: ["f", "f"] }
  ];
  const empty: BothResult = { status: "ok", rows: [], caseLabels: combos.map(c => c.lab), withheld: ZERO, withheldParts: 0, total: 1 };
  const results: MirathResult[] = [];
  for (const c of combos) {
    const cc = { ...counts } as Counts;
    cc[c.k] = (cc[c.k] || 0) + 1;
    cc[c.h] = (cc[c.h] || 0) + hold;
    const r = calculateMirath(gender, cc, opts);
    if (r.status === "invalid") return { ...empty, status: "invalid" };
    if (r.status !== "ok") return { ...empty, status: "unsupported" };
    results.push(r);
  }
  const perHead = (i: number, key: HeirKey): Frac => {
    const row = results[i].rows.find(x => x.key === key);
    return row && row.status === "inherits" ? row.perHeadShare : ZERO;
  };

  const rows: BothRow[] = [];
  // the khuntha (alive, takes the least of his shares now)
  const kc = combos.map((c, i) => perHead(i, c.k));
  rows.push({ key: km, who: "khuntha", count: 1, cases: kc, given: kc.reduce(minF), givenPerHead: kc.reduce(minF), parts: 0 });
  // the unborn child (whole share held back)
  const hc = combos.map((c, i) => mulInt(perHead(i, c.h), hold));
  rows.push({ key: hm, who: "hamal", count: hold, cases: hc, given: ZERO, givenPerHead: ZERO, parts: 0 });
  for (const key of Object.keys(counts) as HeirKey[]) {
    const c = counts[key] || 0;
    if (c === 0) continue;
    const cs = combos.map((_, i) => perHead(i, key));
    const g = cs.reduce(minF);
    rows.push({ key, who: "heir", count: c, cases: cs.map(x => mulInt(x, c)), given: mulInt(g, c), givenPerHead: g, parts: 0 });
  }

  let sum = ZERO;
  for (const r of rows) sum = add(sum, r.given);
  const withheld = sub(frac(1, 1), sum);
  let total = lcm(1, withheld.d);
  for (const r of rows) { total = lcm(total, r.given.d); total = lcm(total, r.givenPerHead.d); }
  for (const r of rows) r.parts = Math.round(fracValue(r.given) * total);
  return { ...empty, rows, withheld, withheldParts: Math.round(fracValue(withheld) * total), total };
}
