"use client";

import { Lang, HeirDef, HeirKey } from "../lib/heirs";
import { BlockCode } from "../lib/mirath";
import { ChevronUp, ChevronDown, Minus, Plus } from "lucide-react";
import { LANGS, BlockInfo } from "./homeCore";

export function LangSwitch({ lang, setLang, label, className }: { lang: Lang; setLang: (l: Lang) => void; label: string; className: string }) {
  return <div role="group" aria-label={label} className={className}>{LANGS.map(l => <button type="button" key={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)} className={`rounded-full px-3 py-2 text-xs font-bold transition ${lang === l.id ? "bg-deen text-white" : "text-slate-500 hover:bg-slate-100"}`}>{l.label}</button>)}</div>;
}

export function Field({ label, value, setValue, prefix, suffix, error, hint }: { label: string; value: string; setValue: (v: string) => void; prefix?: string; suffix?: string; error?: string; hint?: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">{label}</span><div className={`flex items-center rounded-2xl border bg-slate-50 px-3 transition focus-within:bg-white focus-within:ring-4 ${error ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/10" : "border-slate-200 focus-within:border-emerald-700 focus-within:ring-emerald-700/10"}`}>{prefix && <span className="text-sm font-bold text-slate-400">{prefix}</span>}<input inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} aria-invalid={error ? true : undefined} className="min-w-0 w-full bg-transparent px-2 py-3.5 text-sm font-semibold outline-none" placeholder="0"/>{suffix && <span className="text-xs font-bold text-slate-400">{suffix}</span>}</div>{error ? <span role="alert" className="mt-1 block text-[11px] font-bold text-red-600">{error}</span> : hint ? <span className="mt-1 block text-[11px] text-slate-400">{hint}</span> : null}</label>;
}

export function HeirGroup({ title, defs, lang, heirs, update, disabled, blockInfo, blockedWord, blockTexts, heirLabel, naText, decLabel, incLabel, open, toggle }: { title: string; defs: HeirDef[]; lang: Lang; heirs: Record<HeirKey, number>; update: (key: HeirKey, delta: number) => void; disabled: (def: HeirDef) => boolean; blockInfo: Partial<Record<HeirKey, BlockInfo>>; blockedWord: string; blockTexts: Record<BlockCode, string>; heirLabel: (key: HeirKey) => string; naText: string; decLabel: string; incLabel: string; open: boolean; toggle: () => void }) {
  const count = defs.reduce((sum, d) => sum + heirs[d.key as HeirKey], 0);
  return <div>
    <button type="button" onClick={toggle} aria-expanded={open} className="mb-3 flex w-full items-center justify-between border-b border-slate-100 pb-2 text-start text-sm font-extrabold text-slate-700">
      <span className="flex items-center gap-2">{title}{count > 0 && <span className="rounded-full bg-deen px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>}</span>
      {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
    </button>
    {open && <div className="grid gap-3 sm:grid-cols-2">{defs.map(def => {
      const key = def.key as HeirKey; const off = disabled(def); const label = def.label[lang];
      const blk = off ? null : blockInfo[key] ?? null;
      const blockedNow = blk !== null;
      const cannotAdd = off || (blockedNow && heirs[key] === 0);
      return <div key={key} className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 ${off || (blockedNow && heirs[key] === 0) ? "border-slate-100 bg-slate-100/70 opacity-60" : blockedNow ? "border-amber-200 bg-amber-50/70" : "border-slate-100 bg-slate-50/80"}`}>
        <span className="text-sm font-semibold text-slate-700">{label}
          {off && <span className="block text-[10px] font-normal text-slate-400">{naText}</span>}
          {blk && <span className="block text-[10px] font-normal leading-4 text-amber-800">{blockedWord} — {blockTexts[blk.code]}{blk.by.length > 0 ? ` (${blk.by.slice(0, 2).map(heirLabel).join(" / ")})` : ""}</span>}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" disabled={off || heirs[key] <= 0} onClick={() => update(key, -1)} aria-label={`${decLabel}: ${label}`} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-deen hover:text-deen disabled:cursor-not-allowed disabled:opacity-40"><Minus size={14}/></button>
          <span className="w-6 text-center text-sm font-extrabold tabular-nums text-deen">{heirs[key]}</span>
          <button type="button" disabled={cannotAdd} onClick={() => update(key, 1)} aria-label={`${incLabel}: ${label}`} className="grid h-8 w-8 place-items-center rounded-lg bg-deen text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={14}/></button>
        </div>
      </div>;
    })}</div>}
  </div>;
}
