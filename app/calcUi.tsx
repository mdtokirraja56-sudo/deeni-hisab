"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Calculator, CheckCircle2, ChevronDown, ChevronUp, Download, Info, RotateCcw, Share2 } from "lucide-react";
import { copyMore, type CopyMore } from "../lib/copyMore";
import { copyHow } from "../lib/copyHow";
import type { Lang } from "../lib/heirs";

/** The language is found from the text object a calculator already has, so no extra prop is needed. */
export const langOf = (t: CopyMore): Lang => ((Object.keys(copyMore) as Lang[]).find((l) => copyMore[l] === t) ?? "ur") as Lang;

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


export interface HowLine { label: string; formula: string }

/** Collapsible "How is it calculated?" box. Always open when printed. */
export function HowBlock({ lang, lines }: { lang: Lang; lines: HowLine[] }) {
  const [open, setOpen] = useState(false);
  const h = copyHow[lang];
  if (!lines.length) return null;
  return (
    <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-900/5">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-start text-xs font-extrabold text-deen">
        <span>{h.howTitle}</span>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <ul className={`${open ? "block" : "hidden"} space-y-2 border-t border-slate-100 px-4 py-3 print:block`}>
        <li className="hidden text-xs font-extrabold text-deen print:block">{h.howTitle}</li>
        {lines.map((l, i) => (
          <li key={i} className="text-xs leading-6 text-slate-600">
            <span className="font-bold text-slate-700">{l.label}</span>
            <span dir="ltr" className="mt-0.5 block rounded-lg bg-slate-50 px-3 py-1.5 text-start font-semibold tabular-nums text-slate-800">{l.formula}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Header that is visible only on the printed / PDF page. */
export function PrintHead({ lang, title }: { lang: Lang; title: string }) {
  const h = copyHow[lang];
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  return (
    <div className="mb-4 hidden border-b-2 border-deen pb-3 text-center print:block">
      <div className="text-xl font-black tracking-wide text-deen">DEENI HISAB | دینی حساب</div>
      <div className="mt-1 text-base font-extrabold text-slate-800">{title}</div>
      <div className="mt-1 text-xs text-slate-500">{h.reportTitle} · {h.date}: {today}</div>
    </div>
  );
}

/** Share (WhatsApp / any app) and Save-as-PDF buttons. */
export function ShareRow({ lang, title, lines, note }: { lang: Lang; title: string; lines: string[]; note: string }) {
  const h = copyHow[lang];
  const [msg, setMsg] = useState("");
  const share = async () => {
    const text = `*DEENI HISAB | دینی حساب*\n${title}\n\n${lines.join("\n")}\n\n${note}\n${h.linkLine}: ${typeof window !== "undefined" ? window.location.origin : ""}`;
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") { await navigator.share({ title, text }); return; }
    } catch { return; /* the person closed the share sheet */ }
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) { await navigator.clipboard.writeText(text); setMsg(h.copied); setTimeout(() => setMsg(""), 3500); return; }
    } catch { /* fall through */ }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  return (
    <div className="mt-4 print:hidden">
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={share} className="flex items-center justify-center gap-2 rounded-2xl border border-deen/20 bg-white px-5 py-3 text-sm font-extrabold text-deen transition hover:bg-emerald-50"><Share2 size={17} />{h.share}</button>
        <button type="button" onClick={() => window.print()} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"><Download size={17} />{h.savePdf}</button>
      </div>
      {msg && <p role="status" className="mt-2 text-center text-[11px] font-bold text-emerald-800">{msg}</p>}
    </div>
  );
}

/** One result card used by every extra calculator: result + how it was calculated + share / PDF. */
export function ResultBox({ t, title, lines, how, children }: { t: CopyMore; title: string; lines: string[]; how: HowLine[]; children: ReactNode }) {
  const lang = langOf(t);
  const ref = useRef<HTMLElement>(null);
  // Bring the result into view as soon as it appears (the page header is sticky, hence scroll-mt-36).
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, []);
  return (
    <section ref={ref} role="status" className="print-area scroll-mt-36 rounded-3xl border border-emerald-900/10 bg-emerald-50/50 p-4 md:p-5">
      <PrintHead lang={lang} title={title} />
      <h4 className="flex items-center gap-2 text-base font-extrabold text-deen"><CheckCircle2 size={18} />{t.result}</h4>
      {children}
      <HowBlock lang={lang} lines={how} />
      <p className="mt-3 text-[11px] leading-5 text-amber-900">{t.review}</p>
      <ShareRow lang={lang} title={title} lines={lines} note={t.review} />
    </section>
  );
}
