"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Calculator, Info, RotateCcw } from "lucide-react";
import type { CopyMore } from "../lib/copyMore";

export function Field({ label, value, setValue, prefix, suffix, hint, error }: { label: string; value: string; setValue: (v: string) => void; prefix?: string; suffix?: string; hint?: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-600">{label}</span>
      <div className={`flex items-center rounded-2xl border bg-slate-50 px-3 transition focus-within:bg-white focus-within:ring-4 ${error ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/10" : "border-slate-200 focus-within:border-emerald-700 focus-within:ring-emerald-700/10"}`}>
        {prefix && <span className="text-sm font-bold text-slate-400">{prefix}</span>}
        <input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} aria-invalid={error ? true : undefined} className="w-full min-w-0 bg-transparent px-2 py-3.5 text-sm font-semibold outline-none" placeholder="0" />
        {suffix && <span className="text-xs font-bold text-slate-400">{suffix}</span>}
      </div>
      {error ? <span role="alert" className="mt-1 block text-[11px] font-bold text-red-600">{error}</span> : hint ? <span className="mt-1 block text-[11px] text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function Choice<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { id: T; text: string }[]; label: string }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold text-slate-600">{label}</div>
      <div className="grid gap-2">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}
            className={`rounded-2xl border px-4 py-3 text-start text-sm font-bold transition ${value === o.id ? "border-deen bg-deen text-white shadow" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-emerald-50"}`}>{o.text}</button>
        ))}
      </div>
    </div>
  );
}

export function Tile({ label, value, strong }: { label: string; value: ReactNode; strong?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 text-center ring-1 ${strong ? "bg-deen text-white ring-deen" : "bg-white ring-slate-900/5"}`}>
      <div className={`text-lg font-black tabular-nums ${strong ? "text-white" : "text-deen"}`}>{value}</div>
      <div className={`mt-1 text-[11px] font-semibold leading-4 ${strong ? "text-emerald-100" : "text-slate-500"}`}>{label}</div>
    </div>
  );
}

export function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <p className={`flex items-start gap-2 rounded-xl p-3 text-xs leading-6 ${tone === "warn" ? "bg-amber-50 text-amber-950" : "bg-white text-slate-600 ring-1 ring-slate-900/5"}`}>
      {tone === "warn" ? <AlertTriangle size={14} className="mt-1 shrink-0" /> : <Info size={14} className="mt-1 shrink-0 text-deen" />}
      <span>{children}</span>
    </p>
  );
}

export function Actions({ onCalc, onReset, t }: { onCalc: () => void; onReset: () => void; t: CopyMore }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 print:hidden">
      <button type="button" onClick={onCalc} className="flex items-center justify-center gap-2 rounded-2xl bg-deen px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"><Calculator size={18} />{t.calc}</button>
      <button type="button" onClick={onReset} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"><RotateCcw size={18} />{t.reset}</button>
    </div>
  );
}

