"use client";

import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { Lang } from "../lib/heirs";

export type L4 = Record<Lang, string>;
export const tr = (lang: Lang, o: L4) => o[lang];

export function StepHeader({ icon, title, step, names, ofText }: { icon: ReactNode; title: string; step: number; names: string[]; ofText: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-900/5">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-deen">{icon}</div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-deen">{title}</h2>
          <p className="text-xs font-bold text-slate-500">{step + 1} {ofText} {names.length} · {names[step]}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-1" dir="ltr" aria-hidden="true">
        {names.map((_, i) => <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-deen" : "bg-slate-200"}`} />)}
      </div>
    </div>
  );
}

export function Pills<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { id: T; text: string }[]; label: string }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold text-slate-600">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${value === o.id ? "border-deen bg-deen text-white" : "border-slate-200 bg-slate-50 text-slate-600"}`}>{o.text}</button>
        ))}
      </div>
    </div>
  );
}

export function YesNo({ q, on, set, yes, no }: { q: string; on: boolean; set: (v: boolean) => void; yes: string; no: string }) {
  return (
    <div>
      <p className="text-sm font-bold leading-7 text-slate-700">{q}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {([[true, yes], [false, no]] as [boolean, string][]).map(([v, text]) => (
          <button key={String(v)} type="button" aria-pressed={on === v} onClick={() => set(v)}
            className={`rounded-2xl border px-4 py-4 text-base font-extrabold transition ${on === v ? "border-deen bg-deen text-white" : "border-slate-200 bg-slate-50 text-slate-600"}`}>{text}</button>
        ))}
      </div>
    </div>
  );
}

export function StepNav({ step, last, go, onReset, next, back, again, canNext = true }: { step: number; last: number; go: (n: number) => void; onReset: () => void; next: string; back: string; again: string; canNext?: boolean }) {
  return (
    <div className="flex gap-3 pt-2 print:hidden">
      {step > 0 && <button type="button" onClick={() => go(step - 1)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-extrabold text-slate-600"><ArrowLeft size={18} className="rtl:rotate-180" />{back}</button>}
      {step < last
        ? <button type="button" disabled={!canNext} onClick={() => go(step + 1)} className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-deen px-4 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 disabled:opacity-40">{next}<ArrowRight size={18} className="rtl:rotate-180" /></button>
        : <button type="button" onClick={onReset} className="flex flex-[2] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-extrabold text-slate-600"><RotateCcw size={18} />{again}</button>}
    </div>
  );
}

export const COMMON: Record<"next" | "back" | "again" | "of", L4> = {
  next: { roman: "Aage", en: "Next", ur: "آگے", hi: "आगे" },
  back: { roman: "Peechhe", en: "Back", ur: "پیچھے", hi: "पीछे" },
  again: { roman: "Dobara shuru karein", en: "Start again", ur: "دوبارہ شروع کریں", hi: "दोबारा शुरू करें" },
  of: { roman: "/", en: "of", ur: "از", hi: "/" }
};
