"use client";

import { AlertTriangle, CheckCircle2, Download, Info, RotateCcw } from "lucide-react";
import { fracText, fracValue, type HeirRow, type MirathResult } from "../lib/mirath";
import { copy2, type Copy2 } from "../lib/copy2";
import { copy3 } from "../lib/copy3";
import type { HeirKey, Lang } from "../lib/heirs";
import { MirathSolution } from "./MirathSolution";
import { Letterhead, ResultSheet } from "./ResultSheet";
import { useLandFmt } from "./MirathLand";

interface Props {
  result: MirathResult;
  t2: Copy2;
  money: (n: number) => string;
  distributable: number;
  heirLabel: (key: HeirKey) => string;
  onPrint: () => void;
  onReset: () => void;
  printLabel: string;
}

// Small texts for the printed report header (4 languages)
const REPORT: Record<Lang, { title: string; sub: string; date: string }> = {
  en: { title: "Inheritance (Mirath) Report", sub: "Hanafi fiqh · Al-Sirajiyya", date: "Date" },
  roman: { title: "Mirath (Wirasat) ki Report", sub: "Fiqh-e-Hanafi · Sirajiyya", date: "Tareekh" },
  ur: { title: "رپورٹ میراث (ترکے کی تقسیم)", sub: "فقہِ حنفی · سراجیہ", date: "تاریخ" },
  hi: { title: "मीरास (विरासत) रिपोर्ट", sub: "फ़िक़्ह-ए-हनफ़ी · सिराजिय्या", date: "तारीख़" }
};

const ZM: Record<Lang, string> = { roman: "Zameen", en: "Land", ur: "زمین", hi: "ज़मीन" };
const EACH: Record<Lang, string> = { roman: "har ek", en: "each", ur: "ہر ایک", hi: "हर एक" };
const MORE: Record<Lang, string> = { roman: "Tafseel aur wajah", en: "Details and reasons", ur: "تفصیل اور وجہ", hi: "तफ़्सील और वजह" };

const pct = (v: number) => `${(Math.round(v * 10000) / 100).toString()}%`;

export function MirathResultView({ result, t2, money, distributable, heirLabel, onPrint, onReset, printLabel }: Props) {
    // The language is found from the text object that was passed in, so page.tsx needs no change.
  const lang = ((Object.keys(copy2) as Lang[]).find((l) => copy2[l] === t2) ?? "ur") as Lang;
  const t3 = copy3[lang];
  const rp = REPORT[lang];
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  if (result.status === "noheirs") {
    return <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{t2.noHeirs}</div>;
  }
  if (result.status === "invalid") {
    return (
      <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p className="font-bold">{t2.invalidTitle}</p>
        <ul className="mt-2 list-disc space-y-1 ps-5 text-xs">
          {result.errors.map((e, i) => (
            <li key={i}>
              {e.code === "bad_count" ? t2.errBadCount : e.code === "max_exceeded" ? t2.errMax : t2.errGender} {heirLabel(e.key)}
              {e.code === "max_exceeded" && e.max !== undefined ? ` (${e.max})` : ""}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (result.status === "unsupported") {
    return (
      <div role="alert" className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">
        {result.unsupported === "zawil_arham" ? t2.unsupportedArham : t2.unsupportedBig}
      </div>
    );
  }

  const inheriting = result.rows.filter((r) => r.status === "inherits");
  const nothing = result.rows.filter((r) => r.status === "nothing_left");
  const blocked = result.rows.filter((r) => r.status === "blocked");
  const hasAmount = distributable > 0;
  const land = useLandFmt(lang);

  const blockText = (r: HeirRow) => {
    const names = r.blockedBy.map(heirLabel).join(" / ");
    return `${r.blockedCode ? t2.blocks[r.blockedCode] : ""}${names ? ` (${names})` : ""}`;
  };

  const steps: { label: string; value: string }[] = [
    { label: t2.stepAsl, value: String(result.asl) },
    { label: t2.stepAwl, value: result.awl !== null ? String(result.awl) : t2.stepNone },
    { label: t2.stepRadd, value: result.raddBase !== null ? String(result.raddBase) : t2.stepNone },
    { label: t2.stepMazrub, value: result.mazrub > 1 ? String(result.mazrub) : t2.stepNone },
    { label: t2.stepTashih, value: String(result.tashih) }
  ];

  const sheetEl = (
        <ResultSheet d={{
          lang, title: rp.title,
          meta: [[t2.stepAsl, String(result.asl)], [t2.stepTashih, String(result.tashih)]],
          head: [t2.colHeir, t2.colShare, ...(hasAmount || land ? [[hasAmount ? t2.colAmount : "", land ? ZM[lang] : ""].filter(Boolean).join(" / ")] : [])],
          rows: [
            ...inheriting.map((r) => {
              const ph = r.perHeadShare;
              return [
                <span key="n">{heirLabel(r.key)}{r.count > 1 ? ` ×${r.count}` : ""}</span>,
                <span key="s" dir="ltr" className="block leading-4">{fracText(r.share)}<span className="block text-[9px] font-semibold text-slate-400 print:hidden">{pct(fracValue(r.share))}</span></span>,
                ...(hasAmount || land ? [(
                  <div key="c" className="space-y-0.5">
                    {hasAmount && <div className="font-bold tabular-nums">{money(fracValue(r.share) * distributable)}</div>}
                    {land && <div className="text-[11px] font-semibold text-slate-700">{land.fmt(r.share.n, r.share.d, true)}</div>}
                    {r.count > 1 && <div className="text-[9px] font-normal text-slate-400">{land ? land.each : EACH[lang]}: {hasAmount ? money(fracValue(ph) * distributable) : ""}{hasAmount && land ? " · " : ""}{land ? land.fmt(ph.n, ph.d, true) : null}</div>}
                  </div>
                )] : [])
              ];
            }),
            ...blocked.map((r) => [heirLabel(r.key), t2.statusBlocked, ...(hasAmount || land ? ["—"] : [])]),
            ...nothing.map((r) => [heirLabel(r.key), "—", ...(hasAmount || land ? ["—"] : [])])
          ],
          foot: ["Σ", <span key="f" dir="ltr">1 = 100%</span>, ...(hasAmount || land ? [<div key="t">{hasAmount ? money(distributable) : null}{land ? <div className="text-[10px] font-semibold">{land.fmt(1, 1, true)}</div> : null}</div>] : [])],
          verdictLabel: hasAmount ? t2.amountBase : t2.stepTashih,
          verdictValue: hasAmount ? money(distributable) : String(result.tashih),
          notes: [t2.betaNote]
        }} />
  );
  return (
    <section aria-label={t2.resultTitle} className="rounded-3xl border border-emerald-900/10 bg-emerald-50/40 p-3 md:p-6">
      <>
      <div className="mt-2 print:hidden">{sheetEl}</div>
      <details className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-slate-900/5 print:hidden">
      <summary className="cursor-pointer text-sm font-extrabold text-deen">{MORE[lang]}</summary>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {steps.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-900/5">
            <div className="text-lg font-black tabular-nums text-deen">{s.value}</div>
            <div className="mt-1 text-[10px] font-semibold leading-4 text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {hasAmount ? <>{t2.amountBase}: <strong className="tabular-nums text-deen">{money(distributable)}</strong></> : t2.amountHint}
      </p>

      <ul className="mt-4 space-y-3">
        {inheriting.map((r) => (
          <li key={r.key} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-800">{heirLabel(r.key)}</div>
                <div className="mt-0.5 text-[11px] font-semibold text-slate-400">{t2.colCount}: {r.count}</div>
              </div>
              <div className="text-end">
                <div dir="ltr" className="text-xl font-black tabular-nums text-deen">{fracText(r.share)}</div>
                <div className="text-[11px] font-semibold text-slate-400">{t2.colShare}</div>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 p-2">
                <dt className="text-[10px] font-semibold text-slate-400">{t2.colPercent}</dt>
                <dd className="text-sm font-extrabold tabular-nums text-slate-700">{pct(fracValue(r.share))}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-2">
                <dt className="text-[10px] font-semibold text-slate-400">{t2.colParts} ({t2.colPerPerson})</dt>
                <dd className="text-sm font-extrabold tabular-nums text-slate-700">{r.parts} / {result.tashih} ({r.perHeadParts})</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-2">
                <dt className="text-[10px] font-semibold text-slate-400">{t2.colAmount}</dt>
                <dd className="text-sm font-extrabold tabular-nums text-slate-700">{hasAmount ? money(fracValue(r.share) * distributable) : "—"}</dd>
              </div>
            </dl>
            {r.count > 1 && hasAmount && (
              <p className="mt-2 text-[11px] font-semibold text-slate-500">{t2.colPerPerson}: <span className="tabular-nums text-deen">{money((fracValue(r.share) * distributable) / r.count)}</span></p>
            )}
            <ul className="mt-3 space-y-1 text-xs leading-6 text-slate-600">
              {r.reasons.map((reason, i) => <li key={i} className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-deen" /><span>{t2.reasons[reason.code]}</span></li>)}
              {r.radd && <li className="flex gap-2 text-amber-800"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /><span>{t2.raddMark}</span></li>}
            </ul>
          </li>
        ))}
      </ul>

      {nothing.length > 0 && (
        <ul className="mt-3 space-y-2">
          {nothing.map((r) => (
            <li key={r.key} className="rounded-2xl border border-slate-200 bg-white/70 p-3 text-xs text-slate-600">
              <strong className="text-slate-700">{heirLabel(r.key)}</strong> ({r.count}): {t2.statusNothing}
            </li>
          ))}
        </ul>
      )}

      {blocked.length > 0 && (
        <ul className="mt-3 space-y-2">
          {blocked.map((r) => (
            <li key={r.key} className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3 text-xs leading-6 text-slate-500">
              <strong className="text-slate-700">{heirLabel(r.key)}</strong> ({r.count}): {t2.statusBlocked}. {blockText(r)}
            </li>
          ))}
        </ul>
      )}

      {result.notes.length > 0 && (
        <ul className="mt-4 space-y-2">
          {result.notes.map((n) => (
            <li key={n} className="flex gap-2 rounded-2xl bg-white p-3 text-xs leading-6 text-slate-600 ring-1 ring-slate-900/5">
              <Info size={15} className="mt-1 shrink-0 text-deen" />
              <span>{t2.notes[n]}</span>
            </li>
          ))}
        </ul>
      )}
      </details>
      <details className="mt-3 rounded-2xl bg-white p-3 ring-1 ring-slate-900/5 print:hidden">
        <summary className="cursor-pointer text-sm font-extrabold text-deen">{t3.fullTab}</summary>
        <div className="mt-3"><MirathSolution result={result} t2={t2} t3={t3} money={money} distributable={distributable} heirLabel={heirLabel} /></div>
      </details>
      </>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 print:hidden">
        <button type="button" onClick={onPrint} className="flex items-center justify-center gap-2 rounded-2xl border border-deen/20 bg-white px-5 py-3 text-sm font-extrabold text-deen transition hover:bg-emerald-50"><Download size={17} />{printLabel}</button>
        <button type="button" onClick={onReset} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"><RotateCcw size={17} />{t2.reset}</button>
      </div>
      <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-slate-400"><AlertTriangle size={13} className="mt-0.5 shrink-0" />{t2.betaNote}</p>

      {/* Printed / PDF report: always the full solution. Hidden on screen. */}
      <div className="print-area hidden print:block" aria-hidden="true">
        <Letterhead lang={lang} />
        {sheetEl}
      </div>
    </section>
  );
}
