"use client";

import type { ReactNode } from "react";
import type { Lang } from "../lib/heirs";

const TAG: Record<Lang, string> = {
  roman: "Fiqh-e-Hanafi ke mutabiq: Mirath · Zakat · Ushr · Sadqa-e-Fitr",
  en: "According to Hanafi fiqh: Inheritance · Zakat · Ushr · Sadaqah al-Fitr",
  ur: "فقہِ حنفی کے مطابق: میراث · زکوٰۃ · عشر · صدقۂ فطر",
  hi: "फ़िक़्ह-ए-हनफ़ी के मुताबिक़: मीरास · ज़कात · उश्र · सदक़ा-ए-फ़ित्र"
};
const DATE: Record<Lang, string> = { roman: "Tareekh", en: "Date", ur: "تاریخ", hi: "तारीख़" };

/** Report header with the logo. Used on screen (in the sheet) and on the printed page. */
export function Letterhead({ lang, className = "" }: { lang: Lang; className?: string }) {
  return (
    <div className={`border-b-4 border-double border-deen pb-3 text-center ${className}`}>
      <img src="/deeni-hisab-logo.webp" alt="DEENI HISAB" width={72} height={72} className="mx-auto h-16 w-16 rounded-full shadow ring-2 ring-amber-400/70" />
      <div className="mt-2 text-2xl font-black leading-tight text-deen font-urdu">دینی حساب</div>
      <div className="whitespace-nowrap text-xs font-black tracking-[0.2em] text-slate-800">DEENI HISAB</div>
      <div className="mt-1 text-[10px] font-semibold leading-4 text-slate-500">{TAG[lang]}</div>
    </div>
  );
}

export interface SheetData {
  lang: Lang;
  title: string;
  meta?: [string, string][];
  head: string[];
  rows: ReactNode[][];
  foot?: ReactNode[];
  verdictLabel: string;
  verdictValue: string;
  status?: string;
  notes?: string[];
}

/** A formal "statement" page: letterhead, details, table, total row, result bar, notes. */
export function ResultSheet({ d }: { d: SheetData }) {
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const meta: [string, string][] = [[DATE[d.lang], today], ...(d.meta ?? [])];
  const cols = d.head.length;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white p-3 shadow-sm sm:p-5">
      <Letterhead lang={d.lang} className="print:hidden" />
      <h3 className="mt-3 text-center text-lg font-black text-slate-900">{d.title}</h3>

      <table className="mt-3 w-full border-collapse text-xs">
        <tbody>
          {meta.map(([k, v]) => (
            <tr key={k} className="border-y border-slate-200">
              <th scope="row" className="w-2/5 bg-slate-50 px-2 py-2 text-start font-bold text-slate-600">{k}</th>
              <td className="px-2 py-2 font-extrabold text-slate-800"><bdi dir="ltr">{v}</bdi></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 overflow-x-auto"><table className="w-full border-collapse text-[11px] sm:text-xs">
        <thead>
          <tr className="bg-deen text-white">
            {d.head.map((h, i) => <th key={i} scope="col" className="px-1 py-2.5 text-center text-[10px] font-extrabold leading-4 first:text-start sm:text-xs">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {d.rows.map((r, i) => (
            <tr key={i} className={`border-b border-slate-200 ${i % 2 ? "bg-slate-50/70" : ""}`}>
              {r.map((c, j) => <td key={j} className={`px-1 py-2 align-middle ${j === 0 ? "text-start font-bold text-slate-800" : `text-center font-semibold tabular-nums text-slate-700 ${typeof c === "string" ? "whitespace-nowrap" : ""}`}`}>{c}</td>)}
            </tr>
          ))}
          {d.foot && (
            <tr className="border-y-2 border-deen bg-emerald-50 font-black text-deen">
              {d.foot.map((c, j) => <td key={j} className={`px-1.5 py-2.5 ${j === 0 ? "text-start" : "text-center tabular-nums"}`}>{c}</td>)}
              {d.foot.length < cols && <td colSpan={cols - d.foot.length} />}
            </tr>
          )}
        </tbody>
      </table></div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-deen px-3 py-3 text-white">
        <span className="min-w-0 flex-1 text-xs font-extrabold leading-5">{d.verdictLabel}</span>
        <span className="shrink-0 whitespace-nowrap text-base font-black tabular-nums sm:text-lg">{d.verdictValue}</span>
      </div>
      {d.status && <p className="mt-2 text-center text-xs font-bold leading-6 text-slate-700">{d.status}</p>}
      {d.notes && d.notes.length > 0 && (
        <ul className="mt-2 space-y-1 text-[10px] italic leading-5 text-slate-500">
          {d.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
    </div>
  );
}
