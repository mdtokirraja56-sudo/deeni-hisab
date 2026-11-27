"use client";

import { useEffect, useMemo, useState } from "react";
import { GitBranch, Printer, Undo2 } from "lucide-react";
import { HEIR_GROUPS, HEIR_DEFS, type HeirKey, type HeirDef } from "../lib/heirs";
import { computeMunasakha, genderOfKey, type Gender, type MasalaDef, type Person } from "../lib/munasakha";
import { Letterhead, ResultSheet } from "./ResultSheet";
import { HeirGroup } from "./HomeBits";
import { MUN } from "./MunasakhaText";
import { BK } from "./MunasakhaBook";
import type { HomeCtx } from "./homeCore";

const KEYS = HEIR_DEFS.filter((d) => d.key !== "kafirSon");
const pct = (n: bigint, d: bigint) => (Number((n * BigInt(10000)) / d) / 100).toString();
const parseTarka = (raw: string): number => {
  let x = raw.trim().replace(/½/g, " 1/2").replace(/¼/g, " 1/4").replace(/¾/g, " 3/4").replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632)).replace(/,/g, "");
  const m = x.match(/^(\d+(?:\.\d+)?)?\s*(?:(\d+)\s*\/\s*(\d+))?$/);
  if (!m || (!m[1] && !m[2])) return 0;
  const whole = m[1] ? parseFloat(m[1]) : 0; const fr = m[2] && m[3] && Number(m[3]) > 0 ? Number(m[2]) / Number(m[3]) : 0;
  return whole + fr;
};
const fmtAmt = (n: number, unit: string) => `${(Math.round(n * 10000) / 10000).toLocaleString("en-IN", { maximumFractionDigits: 4 })}${unit ? " " + unit : ""}`;
interface Step { dead: string; gender: Gender; members: { id: string; key: HeirKey }[] }

export function MunasakhaPanel({ c }: { c: HomeCtx }) {
  const { lang, t2, gender, heirs, heirLabel, money, remainingForHeirs, munOn, setMunOn } = c;
  const t = MUN[lang]; const bk = BK[lang];
  const [steps, setSteps] = useState<Step[]>([]);
  const [extra, setExtra] = useState<Person[]>([]);
  const [draft, setDraft] = useState<string | null>(null);
  const [newCounts, setNewCounts] = useState<Record<string, number>>({});
  const [links, setLinks] = useState<Record<string, string>>({});
  const [openG, setOpenG] = useState<Record<string, boolean>>(() => Object.fromEntries(HEIR_GROUPS.map((g) => [g.id, g.defaultOpen])));
  const [err, setErr] = useState("");
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [firstName, setFirstName] = useState("");
  const [tarka, setTarka] = useState("");
  const [unit, setUnit] = useState("");

  // First deceased = the heirs chosen in the form above (people, not just counts).
  const first = useMemo(() => {
    const persons: Person[] = []; const members: { id: string; key: HeirKey }[] = [];
    for (const d of KEYS) { const n = (heirs as any)[d.key] || 0; for (let i = 1; i <= n; i++) { const id = `p1_${d.key}_${i}`; persons.push({ id, key: d.key as HeirKey, gender: genderOfKey(d.key), name: `${heirLabel(d.key as HeirKey)}${n > 1 ? ` ${i}` : ""}` }); members.push({ id, key: d.key as HeirKey }); } }
    return { persons, members };
  }, [heirs, heirLabel]);
  const sig = JSON.stringify(heirs) + gender;
  useEffect(() => { setSteps([]); setExtra([]); setDraft(null); setErr(""); }, [sig]);

  const persons = useMemo(() => [...first.persons, ...extra].map((p) => (custom[p.id]?.trim() ? { ...p, name: custom[p.id].trim() } : p)), [first, extra, custom]);
  const masalas: MasalaDef[] = useMemo(() => [{ dead: null, gender, members: first.members }, ...steps.map((s) => ({ dead: s.dead, gender: s.gender, members: s.members }))], [first, steps, gender]);
  const res = useMemo(() => (first.members.length ? computeMunasakha(masalas, persons) : null), [masalas, persons, first]);
  const nameOf = (id: string) => persons.find((p) => p.id === id)?.name ?? id;
  // The book writes, under each heir, his siham, then the product after this masala's multiplier, then after every later multiplier (e.g. 2 / 4 / 16).
  const chainOf = (k: number, parts: bigint): string[] => {
    const st = res && res.ok ? res.steps : []; const out = [String(parts)]; let v = parts;
    if (k > 1 && st[k - 1] && st[k - 1].zarbSecond! !== BigInt(1)) { v = v * st[k - 1].zarbSecond!; out.push(String(v)); }
    for (let j = k; j < st.length; j++) { const z = st[j].zarbFirst!; if (z !== BigInt(1)) { v = v * z; out.push(String(v)); } }
    if (out.length === 1) out.push(String(v));
    return out;
  };

  if (!munOn) return <div className="mt-5 print:hidden"><button type="button" onClick={() => setMunOn(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-deen/25 bg-white px-5 py-3 text-sm font-extrabold text-deen transition hover:bg-emerald-50"><GitBranch size={17} />{t.start}</button></div>;

  const cur = res && res.ok ? res.steps[res.steps.length - 1].table.filter((x) => x.parts > BigInt(0)) : [];
  const T = res && res.ok ? res.mablagh : BigInt(1);
  const deadGender: Gender = draft ? (persons.find((p) => p.id === draft)?.gender ?? "male") : "male";
  const fullCounts = Object.fromEntries(HEIR_DEFS.map((d) => [d.key, newCounts[d.key] || 0])) as Record<HeirKey, number>;
  const disabled = (d: HeirDef) => d.onlyFor !== undefined && d.onlyFor !== deadGender;
  const update = (key: HeirKey, delta: number) => { const def = HEIR_DEFS.find((d) => d.key === key)!; setNewCounts((p) => ({ ...p, [key]: Math.max(0, Math.min(def.max, (p[key] || 0) + delta)) })); setErr(""); };
  const linkable = (p: Person) => KEYS.filter((d) => genderOfKey(d.key) === p.gender && !disabled(d));
  const open = (id: string) => { setDraft(id); setNewCounts({}); setLinks({}); setErr(""); };

  const submit = () => {
    if (!draft) return;
    const members: { id: string; key: HeirKey }[] = []; const fresh: Person[] = [];
    for (const [pid, key] of Object.entries(links)) if (key) members.push({ id: pid, key: key as HeirKey });
    const stepNo = steps.length + 2;
    for (const d of KEYS) { const n = newCounts[d.key] || 0; for (let i = 1; i <= n; i++) { const id = `p${stepNo}_${d.key}_${i}`; fresh.push({ id, key: d.key as HeirKey, gender: genderOfKey(d.key), name: `${heirLabel(d.key as HeirKey)}${n > 1 ? ` ${i}` : ""} (${t.stepWord} ${stepNo})` }); members.push({ id, key: d.key as HeirKey }); } }
    const trial = computeMunasakha([...masalas, { dead: draft, gender: deadGender, members }], [...persons, ...fresh]);
    if (!trial.ok) { setErr(t.halt[trial.halt!]); return; }
    setSteps((s) => [...s, { dead: draft, gender: deadGender, members }]); setExtra((e) => [...e, ...fresh]); setDraft(null); setErr("");
  };

  const sheet = res && res.ok ? (() => {
    const tk = parseTarka(tarka); const showMoney = tk > 0 || remainingForHeirs > 0;
    const total = tk > 0 ? tk : remainingForHeirs; const fmt = (v: number) => (tk > 0 ? fmtAmt(v, unit) : money(v));
    const head = [t.person, t.siham, t.share, t.pct, ...(showMoney ? [t.amount] : [])];
    const rows = res.final.map((f) => [nameOf(f.id), `${f.parts}/${res.mablagh}`, `${f.parts / res.ikhtisar}/${res.reduced}`, `${pct(f.parts, res.mablagh)}%`, ...(showMoney ? [fmt(total * Number(f.parts) / Number(res.mablagh))] : [])]);
    const notes = [t.checked, t.source, ...(res.ikhtisar > BigInt(1) ? [t.ikhtisar(String(res.mablagh), String(res.reduced))] : []), ...(res.noChange ? [t.noChange] : [])];
    return { lang, title: t.finalTitle, meta: [[t.meta1, steps.length ? `${steps.length} · ${t.deathCount}` : "—"] as [string, string]], head, rows, foot: ["Σ", String(res.mablagh), "1", "100%", ...(showMoney ? [fmt(total)] : [])], verdictLabel: t.verdict, verdictValue: res.ikhtisar > BigInt(1) ? `${res.mablagh} → ${res.reduced}` : String(res.mablagh), notes };
  })() : null;

  return <section className="mt-5 rounded-3xl border border-deen/20 bg-emerald-50/40 p-3 sm:p-5" dir={lang === "ur" ? "rtl" : "ltr"}>
    <div className="flex items-start justify-between gap-2 print:hidden">
      <div><h3 className="flex items-center gap-2 text-lg font-extrabold text-deen"><GitBranch size={18} />{t.title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{t.sub}</p></div>
      <button type="button" onClick={() => { setMunOn(false); setSteps([]); setExtra([]); setDraft(null); }} className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">{t.close}</button>
    </div>

    <details className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-6 text-slate-700 print:hidden"><summary className="cursor-pointer font-extrabold text-deen">{bk.rulesTitle}</summary><ol className="mt-2 list-decimal space-y-1 ps-5">{bk.rules.map((r, i) => <li key={i}>{r}</li>)}</ol></details>

    {!first.members.length && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900">{t.needHeirs}</p>}
    {first.members.length > 0 && res && !res.ok && res.haltAt === 1 && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-bold leading-5 text-red-800">{t.halt[res.halt!]}</p>}

    {res && res.ok && <div className="print-area-wrap">
      <div className="print-area">
        <Letterhead lang={lang} className="hidden print:block" />
        {res.steps.map((s) => {
          const relTxt = s.index === 1 ? "" : s.relation === "mubayana" ? bk.rel.mubayana : s.relation === "mumathala" ? bk.rel.mumathala : s.relation === "istiqama" ? bk.rel.istiqama : s.mudakhala ? bk.rel.mudakhala(String(s.g)) : bk.rel.muwafaqa(String(s.g));
          const label = (p: { key: HeirKey; asaba: boolean; fard: string | null; code: string | null }) => p.code === "mother_third_remainder" ? bk.thirdOfRest : p.asaba ? bk.asabaW : bk.frac(p.fard);
          return <div key={s.index} className="mt-3 rounded-2xl border border-slate-300 bg-white p-3 text-xs text-slate-700 print:mt-1 print:break-inside-avoid print:p-1.5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 border-b-2 border-deen pb-1 text-deen">
              <span className="text-sm font-extrabold">{bk.batn(s.index)}: {bk.first} {s.dead ? nameOf(s.dead) : firstName} <span className="font-bold">· {bk.masala} {s.asl}{s.awl ? ` → ${s.awl}` : ""}{String(s.tasheeh) !== String(s.asl) ? ` → ${String(s.tasheeh)}` : ""}</span></span>
              <span className="text-center text-xs font-bold">{s.index > 1 ? `( ${relTxt} )` : ""}</span>
              <span className="text-xs font-bold" dir="ltr" style={{ textAlign: lang === "ur" ? "left" : "right" }}>{s.index > 1 ? <>{nameOf(s.dead!)} {bk.maa} {String(s.mafiyad)}</> : res.steps.length > 1 ? res.steps.map((x) => String(x.mablagh)).filter((v, i, a) => i === 0 || v !== a[i - 1]).join(" → ") : ""}</span>
            </div>
            {s.index > 1 && <div className="mt-1 text-center text-[11px] text-slate-500" dir="ltr">{t.zFirst}: ×{String(s.zarbFirst)} · {t.zSecond}: ×{String(s.zarbSecond)} → {String(s.mablagh)}</div>}
            {s.radd && <div className="mt-2 rounded-lg bg-amber-50 p-2 text-[11px] leading-5 text-amber-900">{bk.radd({ A: String(s.radd.A), sp: String(s.radd.sp), baqi: String(s.radd.baqi), B: String(s.radd.B), Bp: String(s.radd.Bp), rel: bk.raddRel[s.radd.rel], zSp: String(s.radd.zSp), zOt: String(s.radd.zOt), total: String(s.radd.total) })}</div>}
            <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">{s.per.map((p) => <div key={p.id} className="rounded-xl border border-slate-200 bg-emerald-50/50 p-2 text-center">
              <div className="font-extrabold">{nameOf(p.id)}</div>
              <div className="text-[11px] text-slate-500">{label(p)}{p.fard && !p.asaba && p.code !== "mother_third_remainder" ? <span dir="ltr"> ({p.fard})</span> : null}</div>
              <div className="mx-auto mt-1 inline-flex min-w-[44px] flex-col rounded-lg border-2 border-deen px-2 font-extrabold text-deen" dir="ltr">{chainOf(s.index, p.parts).map((v, i, a) => <span key={i} className={`block text-center ${i < a.length - 1 ? "border-b border-deen" : ""}`}>{v}</span>)}</div></div>)}</div>
          </div>;
        })}
        <div className="mt-3 rounded-2xl border border-slate-300 bg-white p-3 text-center print:mt-1 print:break-inside-avoid">
          <div className="text-base font-extrabold text-deen">{bk.mabalagh} <span dir="ltr">{String(res.mablagh)}</span></div>
          <div className="mt-2 border-b-2 border-deen pb-1 text-sm font-extrabold text-deen">{bk.ahya}</div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">{res.final.map((f) => <div key={f.id} className="min-w-[64px] rounded-xl border border-slate-200 px-2 py-1 text-xs"><div className="font-bold">{nameOf(f.id)}</div><div className="text-base font-extrabold text-deen" dir="ltr">{String(f.parts)}</div></div>)}</div>
          <div className="mt-2 text-[11px] text-slate-500" dir="ltr">{res.final.map((f) => String(f.parts)).join(" + ")} = {String(res.final.reduce((a, f) => a + f.parts, BigInt(0)))} ✓ {bk.milaan}</div>
        </div>
        <div className="mt-3 print:mt-1">{sheet && <ResultSheet d={sheet} />}</div>
      </div>
    </div>}

    {res && res.ok && !draft && <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 print:hidden">
      <div className="text-sm font-extrabold text-slate-800">{t.tarkaTitle}</div>
      <p className="text-[11px] leading-5 text-slate-500">{t.tarkaHint}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <input dir="ltr" inputMode="decimal" value={tarka} onChange={(e) => setTarka(e.target.value)} placeholder={t.tarkaPh} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none focus:border-emerald-700" />
        <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder={t.tarkaUnit} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs outline-none focus:border-emerald-700" />
      </div>
    </div>}
    {res && res.ok && !draft && <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 print:hidden"><summary className="cursor-pointer text-sm font-extrabold text-slate-800">{bk.namesTitle}</summary>
      <p className="mt-1 text-[11px] leading-5 text-slate-500">{bk.namesHint}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={bk.firstDead} className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3 py-3 text-sm font-semibold outline-none focus:border-emerald-700" />
        {persons.map((p) => <label key={p.id} className="block"><span className="block text-[10px] font-bold text-slate-400">{heirLabel(p.key)}</span><input value={custom[p.id] ?? ""} onChange={(e) => setCustom((c) => ({ ...c, [p.id]: e.target.value }))} placeholder={bk.namePh} className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-700" /></label>)}
      </div>
    </details>}
    {res && res.ok && !draft && <div className="mt-4 print:hidden">
      <div className="text-sm font-extrabold text-slate-800">{t.who}</div>
      <p className="text-[11px] text-slate-500">{t.whoHint}</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">{cur.map((x) => <li key={x.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-2">
        <span className="min-w-0 text-xs font-bold text-slate-700">{nameOf(x.id)}<span className="block text-[10px] font-semibold text-slate-400" dir="ltr">{String(x.parts)}/{String(T)}</span></span>
        <button type="button" onClick={() => open(x.id)} className="shrink-0 rounded-lg bg-deen px-3 py-2 text-xs font-extrabold text-white">{t.died}</button>
      </li>)}</ul>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">{t.more}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {steps.length > 0 && <button type="button" onClick={() => { const last = steps[steps.length - 1]; setSteps((s) => s.slice(0, -1)); setExtra((e) => e.filter((p) => !p.id.startsWith(`p${steps.length + 1}_`))); void last; }} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"><Undo2 size={14} />{t.undo}</button>}
        {steps.length > 0 && <button type="button" onClick={() => window.print()} className="flex items-center gap-1 rounded-xl border border-deen/30 bg-white px-3 py-2 text-xs font-bold text-deen"><Printer size={14} />{t.print}</button>}
      </div>
    </div>}

    {draft && <div className="mt-4 rounded-2xl border border-amber-200 bg-white p-3 print:hidden">
      <div className="text-sm font-extrabold text-deen">{t.heirsOf(nameOf(draft))}</div>
      {cur.filter((x) => x.id !== draft).length > 0 && <div className="mt-3">
        <div className="text-xs font-extrabold text-slate-700">{t.linkTitle}</div>
        <p className="text-[11px] leading-5 text-slate-500">{t.linkHint}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">{cur.filter((x) => x.id !== draft).map((x) => { const p = persons.find((q) => q.id === x.id)!; return <label key={x.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-700">
          <span className="min-w-0">{p.name}</span>
          <select value={links[x.id] || ""} onChange={(e) => { setLinks((l) => ({ ...l, [x.id]: e.target.value })); setErr(""); }} className="max-w-[55%] rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs">
            <option value="">{t.none}</option>
            {linkable(p).map((d) => <option key={d.key} value={d.key}>{d.label[lang]}</option>)}
          </select></label>; })}</div>
      </div>}
      <div className="mt-4 text-xs font-extrabold text-slate-700">{t.newHeirs}</div>
      <div className="mt-2 space-y-4">{HEIR_GROUPS.map((g) => <HeirGroup key={g.id} title={g.title[lang]} defs={KEYS.filter((d) => d.group === g.id)} lang={lang} heirs={fullCounts} update={update} disabled={disabled} blockInfo={{}} blockedWord={t2.blockedWord} blockTexts={t2.blocks} heirLabel={heirLabel} naText={t.na} decLabel={t.dec} incLabel={t.inc} open={!!openG[g.id]} toggle={() => setOpenG((p) => ({ ...p, [g.id]: !p[g.id] }))} />)}</div>
      {KEYS.some((d) => (newCounts[d.key] || 0) > 0) && <div className="mt-4"><div className="text-xs font-extrabold text-slate-700">{bk.namesTitle}</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">{KEYS.flatMap((d) => Array.from({ length: newCounts[d.key] || 0 }, (_, i) => { const id = `p${steps.length + 2}_${d.key}_${i + 1}`; return <label key={id} className="block"><span className="block text-[10px] font-bold text-slate-400">{heirLabel(d.key as HeirKey)}{(newCounts[d.key] || 0) > 1 ? ` ${i + 1}` : ""}</span><input value={custom[id] ?? ""} onChange={(e) => setCustom((c) => ({ ...c, [id]: e.target.value }))} placeholder={bk.namePh} className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-700" /></label>; }))}</div></div>}
      {err && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-bold leading-5 text-red-800">{err}</p>}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={submit} className="rounded-2xl bg-deen px-5 py-3 text-sm font-extrabold text-white">{t.calc}</button>
        <button type="button" onClick={() => { setDraft(null); setErr(""); }} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-600">{t.cancel}</button>
      </div>
    </div>}
  </section>;
}
