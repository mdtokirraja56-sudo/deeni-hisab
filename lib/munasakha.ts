// lib/munasakha.ts
// Munasakha (an heir dies before the estate is divided). Source: As-Sirajiya with Barakat as-Siraj, Bab al-Munasakha, pp. 85-89
// (main text p. 85; footnotes 7-24 on pp. 86-89; Fatawa Razaviyya 10/458, 10/472).
//   1. Solve the first deceased's masala up to tasheeh.   2. Solve the dead heir's own masala up to tasheeh.
//   3. Compare "ma fi yadihi" (his share in the first tasheeh) with the second tasheeh:
//        divides evenly = istiqama (no multiplication); equal = mumathala; common factor = muwafaqa (mudakhala is treated as muwafaqa);
//        no common factor = mubayana.
//      Multiply the first masala's people by (tasheeh2 / g) and the second masala's people by (mafiyad / g), g = gcd. This one rule is the
//      book's "zarb bil-wafq" (g > 1) and "zarb bil-kull" (g = 1) written together.  4. The total is the mablagh (jami'a).
//   5. A third / fourth / fifth death repeats the same steps with the mablagh standing for the first masala (matn p. 85, footnotes 22-24).
//   6. At the end the numbers may be reduced by their common factor (ikhtisar, p. 87).
// Every result is checked a second way (exact fractions of the estate). If the two ever disagree nothing is shown.
import { calculateMirath, emptyCounts } from "./mirath";
import type { HeirKey } from "./heirs";

export type Gender = "male" | "female";
export const FEMALE_KEYS: string[] = ["wives", "daughter", "sonsDaughter", "sonsSonsDaughter", "mother", "paternalGrandmother", "paternalGreatGrandmother", "maternalGrandmother", "maternalGreatGrandmother", "fullSister", "consanguineSister", "uterineSister", "daughtersDaughter", "sistersDaughter", "brothersDaughter", "paternalAunt", "maternalAunt"];
export const genderOfKey = (k: string): Gender => (FEMALE_KEYS.includes(k) ? "female" : "male");

export interface Person { id: string; key: HeirKey; name: string; gender: Gender }
export interface Member { id: string; key: HeirKey }
export interface MasalaDef { dead: string | null; gender: Gender; members: Member[] }

export type Relation = "istiqama" | "mumathala" | "muwafaqa" | "mubayana";
export interface StepInfo {
  index: number;               // 1 = first deceased
  dead: string | null;         // person id (null for the first)
  gender: Gender;
  asl: number; awl: number | null; tasheeh: bigint;
  per: { id: string; key: HeirKey; parts: bigint; asaba: boolean; fard: string | null; code: string | null }[];
  mafiyad?: bigint; g?: bigint; relation?: Relation; mudakhala?: boolean;
  zarbFirst?: bigint; zarbSecond?: bigint;
  radd?: RaddInfo | null;      // book method for a radd masala with a spouse (min la yuradd alayhi): own masala, baqi, radd masala, zarb
  mablagh: bigint;
  table: { id: string; parts: bigint }[]; // after this step, over `mablagh`
}
export interface RaddInfo { A: bigint; sp: bigint; baqi: bigint; B: bigint; Bp: bigint; rel: "tamathul" | "tawafuq" | "tabayun"; g: bigint; zSp: bigint; zOt: bigint; total: bigint }
export type Halt = "no_heirs" | "invalid" | "zawil_arham" | "dead_no_share" | "dead_unknown" | "mismatch" | "empty_heirs";
export interface MunResult {
  ok: boolean; halt?: Halt; haltAt?: number;
  steps: StepInfo[]; persons: Person[];
  mablagh: bigint; final: { id: string; parts: bigint }[];
  ikhtisar: bigint; reduced: bigint;     // divisor and reduced mablagh
  noChange: boolean;                      // survivors keep the first-masala ratio: no real munasakha was needed (hashiya 3)
}

const gcd = (a: bigint, b: bigint): bigint => { a = a < BigInt(0) ? -a : a; b = b < BigInt(0) ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; };

function solve(m: MasalaDef) {
  const c: any = emptyCounts();
  for (const x of m.members) c[x.key] = (c[x.key] || 0) + 1;
  if (m.members.length === 0) return { halt: "empty_heirs" as Halt };
  const r: any = calculateMirath(m.gender, c, { motherWithGrandfather: "whole" });
  if (r.status === "unsupported") return { halt: "zawil_arham" as Halt };
  if (r.status === "invalid") return { halt: "invalid" as Halt };
  if (r.status !== "ok") return { halt: "no_heirs" as Halt };
  const per = m.members.map((x) => { const row = r.rows.find((y: any) => y.key === x.key && y.status === "inherits"); const rs: any[] = row ? row.reasons || [] : []; const fd = rs.find((q: any) => q.fard && q.fard !== "0");
    const asaba = rs.some((q: any) => /asaba|residue|remainder/.test(String(q.code))) && !fd; return { id: x.id, key: x.key, parts: BigInt(row ? row.perHeadParts : 0), asaba, fard: fd ? String(fd.fard) : null, code: fd ? String(fd.code) : rs[0] ? String(rs[0].code) : null }; });
  // Book method for radd with a spouse: spouse takes his own masala (e.g. 4), the rest (baqi) is shared by the others whose masala is "radded" (e.g. 6 -> 4);
  // baqi and the radd total are compared (tamathul / tawafuq / tabayun) and multiplied. Shown only if it reproduces the engine's own numbers exactly.
  let radd: RaddInfo | null = null;
  try {
    const rows = r.rows.filter((y: any) => y.status === "inherits");
    const sp = rows.find((y: any) => y.key === "husband" || y.key === "wives");
    const others = rows.filter((y: any) => y !== sp);
    if (sp && others.length > 0 && others.every((y: any) => y.radd) && m.members.length === rows.reduce((a: number, y: any) => a + y.count, 0) && rows.every((y: any) => y.count === 1 || y === sp)) {
      const fq = (q: string) => { const [a, b] = q.split("/"); return [BigInt(a), BigInt(b || "1")] as [bigint, bigint]; };
      const sf = fq(sp.reasons.find((q: any) => q.fard)?.fard || "0/1");
      const A = sf[1], spn = sf[0], baqi = A - spn;
      let L = BigInt(1); const fr = others.map((y: any) => fq(y.reasons.find((q: any) => q.fard)?.fard || "0/1"));
      for (const f of fr) L = (L * f[1]) / gcd(L, f[1]);
      const sh = fr.map((f: [bigint, bigint]) => (f[0] * L) / f[1]); let Bp = BigInt(0); for (const v of sh) Bp += v;
      if (baqi > BigInt(0) && Bp > BigInt(0) && spn > BigInt(0)) {
        const g = gcd(baqi, Bp); const rel = baqi === Bp ? "tamathul" : g > BigInt(1) ? "tawafuq" : "tabayun";
        const zSp = Bp / g, zOt = baqi / g; const total = A * zSp;
        const ok = total === BigInt(r.tashih) && sp.perHeadParts !== undefined && BigInt(sp.perHeadParts) === spn * zSp && others.every((y: any, i: number) => BigInt(y.perHeadParts) === sh[i] * zOt);
        if (ok) radd = { A, sp: spn, baqi, B: L, Bp, rel, g, zSp, zOt, total };
      }
    }
  } catch { radd = null; }
  return { tasheeh: BigInt(r.tashih), asl: r.asl as number, awl: (r.awl ?? null) as number | null, per, radd };
}

export function computeMunasakha(masalas: MasalaDef[], persons: Person[]): MunResult {
  const fail = (halt: Halt, at: number): MunResult => ({ ok: false, halt, haltAt: at, steps: [], persons, mablagh: BigInt(0), final: [], ikhtisar: BigInt(1), reduced: BigInt(0), noChange: false });
  const first = solve(masalas[0]) as any;
  if (first.halt) return fail(first.halt, 1);
  let T: bigint = first.tasheeh;
  let tot = new Map<string, bigint>(); for (const p of first.per) tot.set(p.id, (tot.get(p.id) || BigInt(0)) + p.parts);
  const frac = new Map<string, [bigint, bigint]>(); // exact share of the estate: [num, den]
  for (const [id, v] of tot) frac.set(id, [v, T]);
  const m1 = new Map(tot);
  const steps: StepInfo[] = [{ index: 1, dead: null, gender: masalas[0].gender, asl: first.asl, awl: first.awl, tasheeh: first.tasheeh, per: first.per, radd: first.radd, mablagh: T, table: [...tot].map(([id, parts]) => ({ id, parts })) }];
  for (let i = 1; i < masalas.length; i++) {
    const m = masalas[i]; const s = solve(m) as any;
    if (s.halt) return fail(s.halt, i + 1);
    if (!m.dead || !tot.has(m.dead)) return fail("dead_unknown", i + 1);
    const y = tot.get(m.dead)!; if (y === BigInt(0)) return fail("dead_no_share", i + 1);
    const g = gcd(y, s.tasheeh); const fA = s.tasheeh / g, fB = y / g;
    const relation: Relation = y === s.tasheeh ? "mumathala" : y % s.tasheeh === BigInt(0) ? "istiqama" : g > BigInt(1) ? "muwafaqa" : "mubayana";
    const mudakhala = relation === "muwafaqa" && (s.tasheeh % y === BigInt(0) || y % s.tasheeh === BigInt(0));
    const nt = new Map<string, bigint>(); for (const [id, v] of tot) if (id !== m.dead) nt.set(id, v * fA);
    for (const p of s.per) nt.set(p.id, (nt.get(p.id) || BigInt(0)) + p.parts * fB);
    // exact check
    const dv = frac.get(m.dead)!; frac.delete(m.dead);
    for (const p of s.per) { const n = dv[0] * p.parts, d = dv[1] * s.tasheeh; const old = frac.get(p.id) || [BigInt(0), BigInt(1)]; const nn = old[0] * d + n * old[1], dd = old[1] * d; const gg = gcd(nn, dd) || BigInt(1); frac.set(p.id, [nn / gg, dd / gg]); }
    tot = nt; T = T * fA;
    steps.push({ index: i + 1, dead: m.dead, gender: m.gender, asl: s.asl, awl: s.awl, tasheeh: s.tasheeh, per: s.per, radd: s.radd, mafiyad: y, g, relation, mudakhala, zarbFirst: fA, zarbSecond: fB, mablagh: T, table: [...tot].map(([id, parts]) => ({ id, parts })) });
  }
  let sum = BigInt(0); for (const v of tot.values()) sum += v;
  let ok = sum === T; for (const [id, v] of tot) { const f = frac.get(id); if (!f || f[0] * T !== v * f[1]) ok = false; }
  if (!ok) return fail("mismatch", masalas.length);
  let G = T; for (const v of tot.values()) G = gcd(G, v); if (G === BigInt(0)) G = BigInt(1);
  const final = [...tot].filter(([, v]) => v > BigInt(0)).map(([id, parts]) => ({ id, parts }));
  // hashiya 3: survivors keep the same proportions as in the first masala => no change in the division
  let noChange = false;
  if (final.length > 0 && final.every((f) => m1.has(f.id)) && final.length < m1.size) {
    let s1 = BigInt(0); for (const f of final) s1 += m1.get(f.id)!;
    noChange = final.every((f) => f.parts * s1 === m1.get(f.id)! * T);
  }
  return { ok: true, steps, persons, mablagh: T, final, ikhtisar: G, reduced: T / G, noChange };
}
