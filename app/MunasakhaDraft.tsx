"use client";

import { HEIR_GROUPS, HEIR_DEFS, type HeirKey, type HeirDef, type Lang } from "../lib/heirs";
import { genderOfKey, type Person } from "../lib/munasakha";
import { HeirGroup } from "./HomeBits";
import { MUN } from "./MunasakhaText";
import { BK } from "./MunasakhaBook";
import type { HomeCtx } from "./homeCore";

export const KEYS = HEIR_DEFS.filter((d) => d.key !== "kafirSon");
type SetMap<T> = (f: (m: Record<string, T>) => Record<string, T>) => void;
interface Props {
  lang: Lang; t2: HomeCtx["t2"]; heirLabel: (k: HeirKey) => string; draft: string; nameOf: (id: string) => string; cur: { id: string; parts: bigint }[]; persons: Person[];
  links: Record<string, string>; setLinks: SetMap<string>; newCounts: Record<string, number>; custom: Record<string, string>; setCustom: SetMap<string>;
  openG: Record<string, boolean>; setOpenG: SetMap<boolean>; fullCounts: Record<HeirKey, number>; update: (key: HeirKey, delta: number) => void;
  disabled: (d: HeirDef) => boolean; linkable: (p: Person) => HeirDef[]; nSteps: number; err: string; setErr: (s: string) => void; submit: () => void; onCancel: () => void;
}

// The form for "who inherits from this heir who died": link existing heirs, add new ones, give names.
export function MunDraft(props: Props) {
  const { lang, t2, heirLabel, draft, nameOf, cur, persons, links, setLinks, newCounts, custom, setCustom, openG, setOpenG, fullCounts, update, disabled, linkable, nSteps, err, setErr, submit, onCancel } = props;
  const t = MUN[lang]; const bk = BK[lang]; const steps = { length: nSteps };
  return <>
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
        <div className="mt-2 grid gap-2 sm:grid-cols-2">{KEYS.flatMap((d) => Array.from({ length: newCounts[d.key] || 0 }, (_, i) => { const id = `p${steps.length + 2}_${d.key}_${i + 1}`; return <label key={id} className="block"><span className="block text-[10px] font-bold text-slate-400">{heirLabel(d.key as HeirKey)}{(newCounts[d.key] || 0) > 1 ? ` ${i + 1}` : ""}</span><input value={custom[id] ?? ""} onChange={(e) => setCustom((c) => ({ ...c, [id]: e.target.value }))} placeholder={bk.namePh} className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-700" />{(() => { const ty = (custom[id] || "").trim().toLowerCase(); const m = ty ? persons.find((q) => q.id !== draft && cur.some((x) => x.id === q.id) && q.name.trim().toLowerCase() === ty) : undefined; return m ? <span className={`mt-0.5 block text-[10px] font-bold ${m.gender === genderOfKey(d.key) ? "text-emerald-700" : "text-red-700"}`}>{m.gender === genderOfKey(d.key) ? bk.sameNote : bk.sameGender(m.name)}</span> : null; })()}</label>; }))}</div></div>}
      {err && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-bold leading-5 text-red-800">{err}</p>}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={submit} className="rounded-2xl bg-deen px-5 py-3 text-sm font-extrabold text-white">{t.calc}</button>
        <button type="button" onClick={onCancel} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-600">{t.cancel}</button>
      </div>
    </div>}
  </>;
}
