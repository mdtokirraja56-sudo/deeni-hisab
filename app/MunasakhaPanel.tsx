"use client";

import { useEffect, useMemo, useState } from "react";
import { GitBranch, Printer, Undo2 } from "lucide-react";
import { HEIR_GROUPS, HEIR_DEFS, type HeirKey, type HeirDef } from "../lib/heirs";
import { computeMunasakha, genderOfKey, type Gender, type MasalaDef, type Person } from "../lib/munasakha";
import { MunView } from "./MunasakhaView";
import { MunDraft, KEYS } from "./MunasakhaDraft";
import { MUN } from "./MunasakhaText";
import { BK } from "./MunasakhaBook";
import type { HomeCtx } from "./homeCore";

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
    const alive = new Set(cur.map((x) => x.id));
    const norm = (x: string) => x.trim().replace(/\s+/g, " ").toLowerCase();
    for (const d of KEYS) { const n = newCounts[d.key] || 0; for (let i = 1; i <= n; i++) {
      const id = `p${stepNo}_${d.key}_${i}`; const typed = (custom[id] || "").trim();
      const same = typed ? persons.find((q) => q.id !== draft && alive.has(q.id) && norm(q.name) === norm(typed)) : undefined;
      if (same) { // same name as a living heir already in the masala = the same person (linked, not a new person)
        if (same.gender !== genderOfKey(d.key)) { setErr(bk.sameGender(typed)); return; }
        if (!members.some((m) => m.id === same.id)) members.push({ id: same.id, key: d.key as HeirKey });
        continue;
      }
      fresh.push({ id, key: d.key as HeirKey, gender: genderOfKey(d.key), name: `${heirLabel(d.key as HeirKey)}${n > 1 ? ` ${i}` : ""} (${t.stepWord} ${stepNo})` }); members.push({ id, key: d.key as HeirKey });
    } }
    const trial = computeMunasakha([...masalas, { dead: draft, gender: deadGender, members }], [...persons, ...fresh]);
    if (!trial.ok) { setErr(t.halt[trial.halt!]); return; }
    setSteps((s) => [...s, { dead: draft, gender: deadGender, members }]); setExtra((e) => [...e, ...fresh]); setDraft(null); setErr("");
  };


  return <section className="mt-5 rounded-3xl border border-deen/20 bg-emerald-50/40 p-3 sm:p-5" dir={lang === "ur" ? "rtl" : "ltr"}>
    <div className="flex items-start justify-between gap-2 print:hidden">
      <div><h3 className="flex items-center gap-2 text-lg font-extrabold text-deen"><GitBranch size={18} />{t.title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{t.sub}</p></div>
      <button type="button" onClick={() => { setMunOn(false); setSteps([]); setExtra([]); setDraft(null); }} className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">{t.close}</button>
    </div>

    <details className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-6 text-slate-700 print:hidden"><summary className="cursor-pointer font-extrabold text-deen">{bk.rulesTitle}</summary><ol className="mt-2 list-decimal space-y-1 ps-5">{bk.rules.map((r, i) => <li key={i}>{r}</li>)}</ol></details>

    {!first.members.length && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900">{t.needHeirs}</p>}
    {first.members.length > 0 && res && !res.ok && res.haltAt === 1 && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-bold leading-5 text-red-800">{t.halt[res.halt!]}</p>}

    {res && res.ok && <MunView res={res} lang={lang} nameOf={nameOf} firstName={firstName} tarka={tarka} unit={unit} remainingForHeirs={remainingForHeirs} money={money} nSteps={steps.length} />}

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

    {draft && <MunDraft lang={lang} t2={t2} heirLabel={heirLabel} draft={draft} nameOf={nameOf} cur={cur} persons={persons} links={links} setLinks={setLinks} newCounts={newCounts} custom={custom} setCustom={setCustom} openG={openG} setOpenG={setOpenG} fullCounts={fullCounts} update={update} disabled={disabled} linkable={linkable} nSteps={steps.length} err={err} setErr={setErr} submit={submit} onCancel={() => { setDraft(null); setErr(""); }} />}
  </section>;
}
