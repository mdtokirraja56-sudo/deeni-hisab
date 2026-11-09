// lib/mirath.ts
// Hanafi inheritance (Mirath) engine, following Al-Sirajiyya and its Urdu sharh (Tirazi).
// Pure logic. No UI code. All figures are exact fractions.
//
// Pipeline (same order as the book):
//   1. hajb      : who is blocked (hirman) and by whom
//   2. furud     : fixed shares of the Quran
//   3. asaba     : the residue goes to the nearest male line (2:1 where males and females share)
//   4. makharij  : the base number (asl) = LCM of the denominators of the fixed shares
//   5. awl       : when the fixed shares exceed the whole, the base number is raised
//   6. radd      : when nothing is left for asaba, the surplus returns to fixed-share heirs (not spouses)
//   7. tashih    : multiply the base number until every group gets a whole number of parts
//
// NOT handled (the app says "consult a mufti"): zawil-arham as sole heirs, munasakha, khuntha,
// pregnancy (hamal), missing person (mafqud), apostate, drowned/burnt together, wala'.
// The scholar must verify every rule before this is called final.

import type { HeirKey } from "./heirs";

export type Gender = "male" | "female";
export type Counts = Record<HeirKey, number>;

// ---------------------------------------------------------------- fractions
export interface Frac { n: number; d: number }
const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;
export const frac = (n: number, d = 1): Frac => { const g = gcd(n, d) || 1; return d < 0 ? { n: -n / g, d: -d / g } : { n: n / g, d: d / g }; };
const ZERO: Frac = { n: 0, d: 1 };
const add = (a: Frac, b: Frac): Frac => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a: Frac, b: Frac): Frac => frac(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a: Frac, b: Frac): Frac => frac(a.n * b.n, a.d * b.d);
const div = (a: Frac, b: Frac): Frac => frac(a.n * b.d, a.d * b.n);
const cmp = (a: Frac, b: Frac): number => a.n * b.d - b.n * a.d;
const isZero = (a: Frac) => a.n === 0;
export const fracText = (a: Frac): string => (a.n === 0 ? "0" : a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);
export const fracValue = (a: Frac): number => a.n / a.d;

// ---------------------------------------------------------------- options (points of ikhtilaf)
export interface MirathOptions {
  // Mother's share when only a spouse + mother + GRANDFATHER (not father) remain.
  // "whole"     = 1/3 of the whole estate (Abu Hanifa & Muhammad).
  // "remainder" = 1/3 of what is left after the spouse (Abu Yusuf).
  motherWithGrandfather: "whole" | "remainder";
}
export const DEFAULT_OPTIONS: MirathOptions = { motherWithGrandfather: "whole" };

// ---------------------------------------------------------------- output types
export type BlockCode =
  | "nearer"            // a nearer / stronger heir excludes him (asaba order, descendants)
  | "intermediary"      // related through a person who is present (grandfather via father, etc.)
  | "descendants"       // children or grandchildren exclude uterine siblings
  | "two_thirds_full"   // the two-thirds is already complete (two daughters / two full sisters)
  | "mother"            // the mother excludes all grandmothers
  | "nearer_grandmother"
  | "arham_blocked";    // zawil-arham inherit only when there is no asaba and no fixed-share heir

export type ReasonCode =
  | "husband_half" | "husband_quarter" | "wife_quarter" | "wife_eighth"
  | "female_desc_half" | "female_desc_two_thirds" | "female_desc_sixth"
  | "male_desc_asaba" | "asaba_with_male"
  | "father_sixth_male_desc" | "father_sixth_plus_asaba" | "father_asaba"
  | "mother_sixth_children" | "mother_sixth_siblings" | "mother_third" | "mother_third_remainder"
  | "grandmother_sixth" | "uterine_sixth" | "uterine_third"
  | "sister_half" | "sister_two_thirds" | "cons_sister_sixth" | "sister_asaba_daughter"
  | "asaba_remainder";

export interface Reason { code: ReasonCode; fard?: string }

export type NoteCode = "awl" | "radd" | "tashih" | "umariyyatayn" | "asaba_nothing_left" | "remainder_unassigned" | "mother_third_grandfather";

export interface HeirRow {
  key: HeirKey;
  count: number;
  status: "inherits" | "blocked" | "nothing_left";
  blockedBy: HeirKey[];
  blockedCode?: BlockCode;
  reasons: Reason[];
  share: Frac;          // all persons of this kind together, as a fraction of the whole estate
  parts: number;        // same share as parts of the final (tashih) number
  perHeadParts: number; // parts of ONE person
  perHeadShare: Frac;   // share of ONE person as a fraction of the whole estate
  radd: boolean;        // part of this share came back by radd
}

export interface MirathError { code: "bad_count" | "max_exceeded" | "gender_mismatch"; key: HeirKey; max?: number }

export interface MirathResult {
  status: "ok" | "noheirs" | "invalid" | "unsupported";
  errors: MirathError[];
  unsupported: "zawil_arham" | null;
  rows: HeirRow[];
  asl: number;              // base number from the fixed shares
  awl: number | null;       // raised number when the shares exceed the whole
  raddBase: number | null;  // base number after radd
  baseNumber: number;       // the number that is actually carried into tashih (awl / radd / asl)
  mazrub: number;           // multiplier used by tashih (1 = not needed)
  tashih: number;           // final total number of parts
  notes: NoteCode[];
  blocked: Partial<Record<HeirKey, { by: HeirKey[]; code: BlockCode }>>;
}

// ---------------------------------------------------------------- heir keys by role
const K = (k: string) => k as HeirKey;
const LEVELS: [HeirKey, HeirKey][] = [
  [K("son"), K("daughter")],
  [K("sonsSon"), K("sonsDaughter")],
  [K("sonsSonsSon"), K("sonsSonsDaughter")]
];
const SIBLINGS = ["fullBrother", "fullSister", "consanguineBrother", "consanguineSister", "uterineBrother", "uterineSister"].map(K);
const DISTANT = ["daughtersSon", "daughtersDaughter", "maternalGrandfather", "sistersSon", "sistersDaughter", "brothersDaughter", "paternalAunt", "maternalAunt", "maternalUncle"].map(K);
const ALL_KEYS_ORDER: HeirKey[] = [
  "husband", "wives", "son", "daughter", "sonsSon", "sonsDaughter", "sonsSonsSon", "sonsSonsDaughter",
  "father", "mother", "paternalGrandfather", "paternalGreatGrandfather", "paternalGrandmother", "paternalGreatGrandmother",
  "maternalGrandmother", "maternalGreatGrandmother", "fullBrother", "fullSister", "consanguineBrother", "consanguineSister",
  "uterineBrother", "uterineSister", "fullNephew", "consanguineNephew", "fullUncle", "consanguineUncle", "fullCousin", "consanguineCousin",
  ...DISTANT
].map(K);

export const MAX_COUNT: Partial<Record<string, number>> = { husband: 1, wives: 4, father: 1, mother: 1, paternalGrandfather: 1, paternalGreatGrandfather: 1 };

// ---------------------------------------------------------------- core
interface Member { key: HeirKey; weight: number }
interface Group {
  id: string;
  members: Member[];
  fard: Frac;                 // fixed share (0 when pure asaba)
  asaba: boolean;             // also takes the residue
  asabaOnly: boolean;
  spouse: boolean;
  reasons: Partial<Record<string, Reason[]>>; // per key
  raddEligible: boolean;
}

interface Core {
  blocked: Map<HeirKey, { by: HeirKey[]; code: BlockCode }>;
  groups: Group[];
  notes: NoteCode[];
  unsupported: "zawil_arham" | null;
}

function core(gender: Gender, c: Counts, opts: MirathOptions): Core {
  const n = (k: HeirKey) => Math.max(0, Math.floor(c[k] || 0));
  const blocked = new Map<HeirKey, { by: HeirKey[]; code: BlockCode }>();
  const notes: NoteCode[] = [];
  const block = (k: HeirKey, by: HeirKey[], code: BlockCode) => { if (n(k) > 0 && !blocked.has(k)) blocked.set(k, { by, code }); };
  const groups: Group[] = [];
  const newGroup = (id: string, members: Member[], fard: Frac, o: Partial<Group> = {}): Group => {
    const g: Group = { id, members, fard, asaba: false, asabaOnly: false, spouse: false, reasons: {}, raddEligible: true, ...o };
    groups.push(g);
    return g;
  };
  const addReason = (g: Group, key: HeirKey, r: Reason) => { (g.reasons[key] ||= []).push(r); };

  // ---- descendants ----
  const M = LEVELS.map(([m]) => n(m));
  const Fm = LEVELS.map(([, f]) => n(f));
  const maleLevel = M.findIndex((x) => x > 0); // -1 = none
  const hasMaleDesc = maleLevel >= 0;
  const hasFemaleDesc = Fm.some((x) => x > 0);
  const hasDesc = hasMaleDesc || hasFemaleDesc;
  const firstDescKey = (): HeirKey[] => { for (const [m, f] of LEVELS) { if (n(m) > 0) return [m]; if (n(f) > 0) return [f]; } return []; };

  if (hasMaleDesc) {
    const mKey = LEVELS[maleLevel][0];
    for (let l = maleLevel + 1; l < 3; l++) { block(LEVELS[l][0], [mKey], "nearer"); block(LEVELS[l][1], [mKey], "nearer"); }
  }
  // Female descendants who have a fixed share (those ABOVE the nearest male, or all when there is no male).
  const limit = hasMaleDesc ? maleLevel : 3;
  let used = ZERO;
  const rescued: HeirKey[] = []; // higher females blocked by the two-thirds but made asaba by a lower male
  const upperFemaleKeys: HeirKey[] = [];
  for (let l = 0; l < limit; l++) {
    const f = Fm[l];
    const fKey = LEVELS[l][1];
    if (f === 0) continue;
    if (isZero(used)) {
      const fd = f === 1 ? frac(1, 2) : frac(2, 3);
      const g = newGroup(`f${l}`, [{ key: fKey, weight: 1 }], fd);
      addReason(g, fKey, { code: f === 1 ? "female_desc_half" : "female_desc_two_thirds", fard: fracText(fd) });
      used = fd;
    } else if (cmp(used, frac(1, 2)) === 0) {
      const fd = frac(1, 6);
      const g = newGroup(`f${l}`, [{ key: fKey, weight: 1 }], fd);
      addReason(g, fKey, { code: "female_desc_sixth", fard: "1/6" });
      used = frac(2, 3);
    } else if (hasMaleDesc) {
      rescued.push(fKey); // a lower male makes her asaba (equal or lower rule)
    } else {
      block(fKey, [...upperFemaleKeys], "two_thirds_full");
    }
    upperFemaleKeys.push(fKey);
  }

  // ---- ascendants ----
  const hasFather = n(K("father")) > 0;
  const pgf = K("paternalGrandfather");
  const pggf = K("paternalGreatGrandfather");
  if (hasFather) { block(pgf, [K("father")], "intermediary"); block(pggf, [K("father")], "intermediary"); }
  else if (n(pgf) > 0) block(pggf, [pgf], "intermediary");
  const upMale: HeirKey | null = hasFather ? K("father") : n(pgf) > 0 ? pgf : n(pggf) > 0 ? pggf : null;
  const hasMother = n(K("mother")) > 0;
  const sibTotal = SIBLINGS.reduce((s, k) => s + n(k), 0);

  // grandmothers
  const pgm = K("paternalGrandmother"), pggm = K("paternalGreatGrandmother"), mgm = K("maternalGrandmother"), mggm = K("maternalGreatGrandmother");
  const gmEligible: HeirKey[] = [];
  const gmCandidates: [HeirKey, number][] = [[pgm, 2], [mgm, 2], [pggm, 3], [mggm, 3]];
  for (const [k] of gmCandidates) if (hasMother) block(k, [K("mother")], "mother");
  if (!hasMother) {
    if (hasFather) { block(pgm, [K("father")], "intermediary"); block(pggm, [K("father")], "intermediary"); }
    if (n(pgf) > 0 && !hasFather) block(pggm, [pgf], "intermediary");
    const near = [pgm, mgm].filter((k) => n(k) > 0 && !blocked.has(k));
    if (near.length > 0) { block(pggm, near, "nearer_grandmother"); block(mggm, near, "nearer_grandmother"); }
    if (n(mgm) > 0) block(mggm, [mgm], "intermediary");
    for (const [k] of gmCandidates) if (n(k) > 0 && !blocked.has(k)) gmEligible.push(k);
  }

  // ---- asaba ranks (after descendants and ascendants) ----
  const fb = K("fullBrother"), fs = K("fullSister"), cb = K("consanguineBrother"), cs = K("consanguineSister");
  const ub = K("uterineBrother"), us = K("uterineSister");
  const fn = K("fullNephew"), cn = K("consanguineNephew"), fu = K("fullUncle"), cu = K("consanguineUncle"), fc = K("fullCousin"), cc = K("consanguineCousin");

  const rankPresent: (HeirKey[] | null)[] = []; // rank index -> keys that rule (or null)
  rankPresent[1] = hasMaleDesc ? [LEVELS[maleLevel][0]] : null;
  rankPresent[2] = upMale ? [upMale] : null;
  const sisterMaaGhair = (sister: HeirKey) => n(sister) > 0 && hasFemaleDesc;
  rankPresent[3] = n(fb) > 0 ? [fb] : sisterMaaGhair(fs) ? [fs] : null;
  rankPresent[4] = n(cb) > 0 ? [cb] : (n(fs) === 0 && n(fb) === 0 && sisterMaaGhair(cs)) ? [cs] : null;
  rankPresent[5] = n(fn) > 0 ? [fn] : null;
  rankPresent[6] = n(cn) > 0 ? [cn] : null;
  rankPresent[7] = n(fu) > 0 ? [fu] : null;
  rankPresent[8] = n(cu) > 0 ? [cu] : null;
  rankPresent[9] = n(fc) > 0 ? [fc] : null;
  rankPresent[10] = n(cc) > 0 ? [cc] : null;
  const rankKeys: Record<number, HeirKey[]> = { 3: [fb, fs], 4: [cb, cs], 5: [fn], 6: [cn], 7: [fu], 8: [cu], 9: [fc], 10: [cc] };
  let ruling = 0;
  for (let r = 1; r <= 10; r++) { if (rankPresent[r]) { ruling = r; break; } }
  if (ruling > 0) {
    for (let r = Math.max(3, ruling + 1); r <= 10; r++) for (const k of rankKeys[r]) block(k, rankPresent[ruling]!, "nearer");
    if (ruling <= 2) for (const k of rankKeys[3].concat(rankKeys[4])) block(k, rankPresent[ruling]!, "nearer");
  }
  // full sister with a brother or with daughters is asaba; a lone full sister / consanguine sisters rely on fixed shares
  // uterine siblings: blocked by any descendant or any male ascendant
  if (hasDesc) { block(ub, firstDescKey(), "descendants"); block(us, firstDescKey(), "descendants"); }
  else if (upMale) { block(ub, [upMale], "intermediary"); block(us, [upMale], "intermediary"); }

  // ---- distant relatives ----
  const distantPresent = DISTANT.some((k) => n(k) > 0);
  const nonSpouseInheritor = (): boolean => {
    for (const k of ALL_KEYS_ORDER) {
      if (k === K("husband") || k === K("wives") || DISTANT.includes(k)) continue;
      if (n(k) > 0 && !blocked.has(k)) return true;
    }
    return false;
  };
  let unsupported: "zawil_arham" | null = null;
  if (distantPresent) {
    if (nonSpouseInheritor()) {
      for (const k of DISTANT) {
        const by = ALL_KEYS_ORDER.filter((x) => !DISTANT.includes(x) && x !== K("husband") && x !== K("wives") && n(x) > 0 && !blocked.has(x));
        block(k, by.slice(0, 2), "arham_blocked");
      }
    } else unsupported = "zawil_arham";
  }

  // ---- fixed shares ----
  // spouses
  let spouseShare = ZERO;
  if (n(K("husband")) > 0) {
    const fd = hasDesc ? frac(1, 4) : frac(1, 2);
    const g = newGroup("husband", [{ key: K("husband"), weight: 1 }], fd, { spouse: true, raddEligible: false });
    addReason(g, K("husband"), { code: hasDesc ? "husband_quarter" : "husband_half", fard: fracText(fd) });
    spouseShare = add(spouseShare, fd);
  }
  if (n(K("wives")) > 0) {
    const fd = hasDesc ? frac(1, 8) : frac(1, 4);
    const g = newGroup("wives", [{ key: K("wives"), weight: 1 }], fd, { spouse: true, raddEligible: false });
    addReason(g, K("wives"), { code: hasDesc ? "wife_eighth" : "wife_quarter", fard: fracText(fd) });
    spouseShare = add(spouseShare, fd);
  }

  // father / grandfather
  if (upMale) {
    if (hasMaleDesc) {
      const g = newGroup("up", [{ key: upMale, weight: 1 }], frac(1, 6), { raddEligible: false });
      addReason(g, upMale, { code: "father_sixth_male_desc", fard: "1/6" });
    } else if (hasFemaleDesc) {
      const g = newGroup("up", [{ key: upMale, weight: 1 }], frac(1, 6), { asaba: true, raddEligible: false });
      addReason(g, upMale, { code: "father_sixth_plus_asaba", fard: "1/6" });
    } else {
      const g = newGroup("up", [{ key: upMale, weight: 1 }], ZERO, { asaba: true, asabaOnly: true, raddEligible: false });
      addReason(g, upMale, { code: "father_asaba" });
    }
  }

  // mother
  if (hasMother) {
    const mk = K("mother");
    if (hasDesc) {
      const g = newGroup("mother", [{ key: mk, weight: 1 }], frac(1, 6));
      addReason(g, mk, { code: "mother_sixth_children", fard: "1/6" });
    } else if (sibTotal >= 2) {
      const g = newGroup("mother", [{ key: mk, weight: 1 }], frac(1, 6));
      addReason(g, mk, { code: "mother_sixth_siblings", fard: "1/6" });
    } else {
      // "Umariyyatayn": spouse + father + mother only  ->  mother takes 1/3 of the remainder.
      const onlyThree = !isZero(spouseShare) && upMale !== null && sibTotal === 0 && !hasDesc && ALL_KEYS_ORDER.every((k) => {
        if (k === K("husband") || k === K("wives") || k === mk || k === upMale) return true;
        return n(k) === 0 || blocked.has(k);
      });
      const remainderRule = onlyThree && (hasFather || opts.motherWithGrandfather === "remainder");
      if (remainderRule) {
        const fd = div(sub(frac(1, 1), spouseShare), frac(3, 1));
        const g = newGroup("mother", [{ key: mk, weight: 1 }], fd);
        addReason(g, mk, { code: "mother_third_remainder", fard: fracText(fd) });
        notes.push("umariyyatayn");
      } else {
        const g = newGroup("mother", [{ key: mk, weight: 1 }], frac(1, 3));
        addReason(g, mk, { code: "mother_third", fard: "1/3" });
        if (onlyThree && !hasFather) notes.push("mother_third_grandfather");
      }
    }
  }

  // grandmothers share 1/6 equally by heads
  if (gmEligible.length > 0) {
    const g = newGroup("grandmothers", gmEligible.map((key) => ({ key, weight: 1 })), frac(1, 6));
    for (const k of gmEligible) addReason(g, k, { code: "grandmother_sixth", fard: "1/6" });
  }

  // uterine siblings
  const uTotal = (blocked.has(ub) ? 0 : n(ub)) + (blocked.has(us) ? 0 : n(us));
  if (uTotal > 0) {
    const fd = uTotal === 1 ? frac(1, 6) : frac(1, 3);
    const members: Member[] = [];
    if (n(ub) > 0 && !blocked.has(ub)) members.push({ key: ub, weight: 1 });
    if (n(us) > 0 && !blocked.has(us)) members.push({ key: us, weight: 1 });
    const g = newGroup("uterine", members, fd);
    for (const m of members) addReason(g, m.key, { code: uTotal === 1 ? "uterine_sixth" : "uterine_third", fard: fracText(fd) });
  }

  // full sisters / consanguine sisters
  const fullSisterFard = n(fs) > 0 && !blocked.has(fs) && n(fb) === 0 && !sisterMaaGhair(fs);
  if (fullSisterFard) {
    const fd = n(fs) === 1 ? frac(1, 2) : frac(2, 3);
    const g = newGroup("fullSister", [{ key: fs, weight: 1 }], fd);
    addReason(g, fs, { code: n(fs) === 1 ? "sister_half" : "sister_two_thirds", fard: fracText(fd) });
  }
  const consSisterFard = n(cs) > 0 && !blocked.has(cs) && n(cb) === 0 && !sisterMaaGhair(cs);
  if (consSisterFard) {
    if (n(fs) === 0) {
      const fd = n(cs) === 1 ? frac(1, 2) : frac(2, 3);
      const g = newGroup("consSister", [{ key: cs, weight: 1 }], fd);
      addReason(g, cs, { code: n(cs) === 1 ? "sister_half" : "sister_two_thirds", fard: fracText(fd) });
    } else if (n(fs) === 1) {
      const g = newGroup("consSister", [{ key: cs, weight: 1 }], frac(1, 6));
      addReason(g, cs, { code: "cons_sister_sixth", fard: "1/6" });
    } else {
      block(cs, [fs], "two_thirds_full");
    }
  }

  // ---- asaba group ----
  const asabaMembers: Member[] = [];
  const asabaKeysReason: Partial<Record<string, Reason>> = {};
  if (ruling === 1) {
    const [mKey, fKey] = LEVELS[maleLevel];
    asabaMembers.push({ key: mKey, weight: 2 });
    if (n(fKey) > 0) asabaMembers.push({ key: fKey, weight: 1 });
    for (const r of rescued) asabaMembers.push({ key: r, weight: 1 });
    asabaKeysReason[mKey] = { code: "male_desc_asaba" };
    if (n(fKey) > 0) asabaKeysReason[fKey] = { code: "asaba_with_male" };
    for (const r of rescued) asabaKeysReason[r] = { code: "asaba_with_male" };
  } else if (ruling === 3) {
    if (n(fb) > 0) {
      asabaMembers.push({ key: fb, weight: 2 });
      asabaKeysReason[fb] = { code: "asaba_remainder" };
      if (n(fs) > 0) { asabaMembers.push({ key: fs, weight: 1 }); asabaKeysReason[fs] = { code: "asaba_with_male" }; }
    } else {
      asabaMembers.push({ key: fs, weight: 1 });
      asabaKeysReason[fs] = { code: "sister_asaba_daughter" };
    }
  } else if (ruling === 4) {
    if (n(cb) > 0) {
      asabaMembers.push({ key: cb, weight: 2 });
      asabaKeysReason[cb] = { code: "asaba_remainder" };
      if (n(cs) > 0) { asabaMembers.push({ key: cs, weight: 1 }); asabaKeysReason[cs] = { code: "asaba_with_male" }; }
    } else {
      asabaMembers.push({ key: cs, weight: 1 });
      asabaKeysReason[cs] = { code: "sister_asaba_daughter" };
    }
  } else if (ruling >= 5) {
    const key = rankPresent[ruling]![0];
    asabaMembers.push({ key, weight: 1 });
    asabaKeysReason[key] = { code: "asaba_remainder" };
  }
  if (asabaMembers.length > 0) {
    const g = newGroup("asaba", asabaMembers, ZERO, { asaba: true, asabaOnly: true, raddEligible: false });
    for (const m of asabaMembers) addReason(g, m.key, asabaKeysReason[m.key]!);
  }

  return { blocked, groups, notes, unsupported };
}

// ---------------------------------------------------------------- public helpers
export function emptyCounts(): Counts {
  return Object.fromEntries(ALL_KEYS_ORDER.map((k) => [k, 0])) as Counts;
}

// Who is blocked right now? Used for the live "mahjub" display in the form.
export function blockedMap(gender: Gender, counts: Counts, opts: MirathOptions = DEFAULT_OPTIONS) {
  const out: Partial<Record<HeirKey, { by: HeirKey[]; code: BlockCode }>> = {};
  core(gender, counts, opts).blocked.forEach((v, k) => { out[k] = v; });
  return out;
}

// "If I added ONE of this heir now, would he be blocked?" (for heirs currently at 0)
export function wouldBeBlocked(gender: Gender, counts: Counts, key: HeirKey, opts: MirathOptions = DEFAULT_OPTIONS) {
  if ((counts[key] || 0) > 0) return blockedMap(gender, counts, opts)[key] ?? null;
  const test = { ...counts, [key]: 1 } as Counts;
  return blockedMap(gender, test, opts)[key] ?? null;
}

export function validateMirath(gender: Gender, counts: Counts): MirathError[] {
  const errors: MirathError[] = [];
  for (const k of ALL_KEYS_ORDER) {
    const v = counts[k];
    if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || Math.floor(v) !== v) { errors.push({ code: "bad_count", key: k }); continue; }
    const max = MAX_COUNT[k];
    if (max !== undefined && v > max) errors.push({ code: "max_exceeded", key: k, max });
  }
  if (gender === "male" && (counts[K("husband")] || 0) > 0) errors.push({ code: "gender_mismatch", key: K("husband") });
  if (gender === "female" && (counts[K("wives")] || 0) > 0) errors.push({ code: "gender_mismatch", key: K("wives") });
  return errors;
}

// ---------------------------------------------------------------- main
export function calculateMirath(gender: Gender, counts: Counts, opts: MirathOptions = DEFAULT_OPTIONS): MirathResult {
  const base: MirathResult = {
    status: "ok", errors: [], unsupported: null, rows: [], asl: 1, awl: null, raddBase: null, baseNumber: 1, mazrub: 1, tashih: 1, notes: [], blocked: {}
  };
  const errors = validateMirath(gender, counts);
  if (errors.length > 0) return { ...base, status: "invalid", errors };
  const total = ALL_KEYS_ORDER.reduce((s, k) => s + (counts[k] || 0), 0);
  if (total === 0) return { ...base, status: "noheirs" };

  const { blocked, groups: allGroups, notes, unsupported } = core(gender, counts, opts);
  const blockedObj: MirathResult["blocked"] = {};
  blocked.forEach((v, k) => { blockedObj[k] = v; });
  if (unsupported) {
    return { ...base, status: "unsupported", unsupported, blocked: blockedObj, notes };
  }

  const groups = allGroups;
  const fardSum = groups.reduce((s, g) => add(s, g.fard), ZERO);
  const asabaGroup = groups.find((g) => g.asabaOnly && g.id === "asaba") || groups.find((g) => g.asabaOnly);
  const asabaFardGroup = groups.find((g) => g.asaba && !g.asabaOnly);
  const asabaTaker = asabaGroup || asabaFardGroup || null;

  // final fraction of each group
  const share = new Map<Group, Frac>();
  let awlOn = false, raddOn = false, remainderUnassigned = false;
  let asaNothing = false;
  const one = frac(1, 1);
  const cmpOne = cmp(fardSum, one);

  // book style base number: LCM of the denominators of the fixed shares
  let asl = 1;
  for (const g of groups) if (!isZero(g.fard)) asl = lcm(asl, g.fard.d);

  if (cmpOne > 0) {
    awlOn = true;
    for (const g of groups) share.set(g, isZero(g.fard) ? ZERO : div(g.fard, fardSum));
    if (asabaTaker) asaNothing = true;
  } else if (cmpOne === 0) {
    for (const g of groups) share.set(g, g.fard);
    if (asabaGroup) asaNothing = true;
  } else {
    const rem = sub(one, fardSum);
    if (asabaTaker) {
      for (const g of groups) share.set(g, g.fard);
      share.set(asabaTaker, add(asabaTaker.fard, rem));
    } else {
      const radd = groups.filter((g) => g.raddEligible && !isZero(g.fard));
      if (radd.length > 0) {
        raddOn = true;
        const spouse = groups.filter((g) => g.spouse).reduce((s, g) => add(s, g.fard), ZERO);
        const raddSum = radd.reduce((s, g) => add(s, g.fard), ZERO);
        const pool = sub(one, spouse);
        for (const g of groups) share.set(g, g.spouse ? g.fard : mul(g.fard, div(pool, raddSum)));
      } else {
        for (const g of groups) share.set(g, g.fard);
        remainderUnassigned = true;
      }
    }
  }

  // base numbers
  let baseNumber: number;
  let aslOut = asl;
  let awl: number | null = null;
  let raddBase: number | null = null;
  const liveGroups = groups.filter((g) => !isZero(share.get(g)!));
  if (liveGroups.length === 0) return { ...base, status: "noheirs", blocked: blockedObj };

  const asabaOnlyAll = groups.every((g) => isZero(g.fard) || false) && !!asabaGroup;
  if (asabaOnlyAll) {
    const R = asabaGroup!.members.reduce((s, m) => s + m.weight * (counts[m.key] || 0), 0);
    aslOut = R; baseNumber = R;
  } else if (awlOn) {
    const sumParts = groups.reduce((s, g) => s + (isZero(g.fard) ? 0 : fracValue(mul(g.fard, frac(asl, 1)))), 0);
    awl = Math.round(sumParts); baseNumber = awl;
  } else if (raddOn) {
    let b = 1;
    for (const g of liveGroups) b = lcm(b, share.get(g)!.d);
    raddBase = b; baseNumber = b;
  } else if (remainderUnassigned) {
    baseNumber = asl;
  } else {
    baseNumber = asl;
    for (const g of liveGroups) baseNumber = lcm(baseNumber, share.get(g)!.d);
  }
  if (!awlOn && !raddOn && !asabaOnlyAll) {
    // asl itself can already hold asaba parts: make sure every group is an integer number of parts
    let b = asl;
    for (const g of liveGroups) b = lcm(b, share.get(g)!.d);
    baseNumber = b;
    aslOut = asl;
  }

  // tashih (Part 1/Part 2 of the book): groups whose parts do not divide by their heads
  const heads = (g: Group) => g.members.reduce((s, m) => s + m.weight * (counts[m.key] || 0), 0);
  const partsOf = (g: Group) => Math.round(fracValue(share.get(g)!) * baseNumber);
  const stored: number[] = [];
  for (const g of liveGroups) {
    const S = partsOf(g), R = heads(g);
    if (R > 0 && S % R !== 0) stored.push(R / gcd(R, S));
  }
  const mazrub = stored.reduce((a, b) => lcm(a, b), 1);
  const tashih = baseNumber * mazrub;
  if (mazrub > 1) notes.push("tashih");
  if (awlOn) notes.push("awl");
  if (raddOn) notes.push("radd");
  if (asaNothing) notes.push("asaba_nothing_left");
  if (remainderUnassigned) notes.push("remainder_unassigned");
  if (tashih > 1e12) return { ...base, status: "unsupported", unsupported: null, blocked: blockedObj, errors: [] };

  // rows
  const rows: HeirRow[] = [];
  for (const key of ALL_KEYS_ORDER) {
    const cnt = counts[key] || 0;
    if (cnt === 0) continue;
    const blk = blocked.get(key);
    if (blk) {
      rows.push({ key, count: cnt, status: "blocked", blockedBy: blk.by, blockedCode: blk.code, reasons: [], share: ZERO, parts: 0, perHeadParts: 0, perHeadShare: ZERO, radd: false });
      continue;
    }
    let keyShare = ZERO, keyParts = 0;
    const reasons: Reason[] = [];
    let radd = false;
    for (const g of liveGroups) {
      const m = g.members.find((x) => x.key === key);
      if (!m) continue;
      const R = heads(g);
      const groupParts = partsOf(g) * mazrub;
      const unit = groupParts / R;
      keyParts += unit * m.weight * cnt;
      keyShare = add(keyShare, mul(share.get(g)!, frac(m.weight * cnt, R)));
      (g.reasons[key] || []).forEach((r) => reasons.push(r));
      if (g.raddEligible && raddOn) radd = true;
    }
    if (keyParts === 0) {
      rows.push({ key, count: cnt, status: "nothing_left", blockedBy: [], reasons: [], share: ZERO, parts: 0, perHeadParts: 0, perHeadShare: ZERO, radd: false });
      continue;
    }
    rows.push({ key, count: cnt, status: "inherits", blockedBy: [], reasons, share: keyShare, parts: keyParts, perHeadParts: keyParts / cnt, perHeadShare: div(keyShare, frac(cnt, 1)), radd });
  }

  return {
    status: "ok", errors: [], unsupported: null, rows,
    asl: aslOut, awl, raddBase, baseNumber, mazrub, tashih, notes, blocked: blockedObj
  };
}
