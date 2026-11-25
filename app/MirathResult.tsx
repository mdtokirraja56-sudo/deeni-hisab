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
  kafirSon?: number; // count of non-Muslim sons entered (shown as "as if absent")
  gold?: string;   // grams of gold in the estate (text from the form)
  silver?: string; // grams of silver
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

// Fixed-share name (nisf, rubu ...) or asaba, shown under each heir's fraction to make the table easier to read.
const TERM: Record<string, Record<Lang, string>> = {
  "1/2": { ur: "نصف", roman: "Nisf", hi: "निस्फ़", en: "Nisf (½)" },
  "1/4": { ur: "ربع", roman: "Rub'", hi: "रुब'", en: "Rub' (¼)" },
  "1/8": { ur: "ثمن", roman: "Sumun", hi: "सुमुन", en: "Sumun (⅛)" },
  "2/3": { ur: "ثلثان", roman: "Sulusan", hi: "सुलुसान", en: "Thulthan (⅔)" },
  "1/3": { ur: "ثلث", roman: "Sulus", hi: "सुलुस", en: "Thulth (⅓)" },
  "1/6": { ur: "سدس", roman: "Sudus", hi: "सुदुस", en: "Sudus (⅙)" },
  rem3: { ur: "ثلثِ باقی", roman: "Sulus-e-baqi", hi: "सुलुस-ए-बाक़ी", en: "Third of remainder" },
  asaba: { ur: "عصبہ", roman: "Asaba", hi: "असबा", en: "Asaba (residuary)" },
  radd: { ur: "رد", roman: "radd", hi: "रद्द", en: "radd" }
};
const CODE_FRAC: Record<string, string> = {
  husband_half: "1/2", husband_quarter: "1/4", wife_quarter: "1/4", wife_eighth: "1/8",
  female_desc_half: "1/2", female_desc_two_thirds: "2/3", female_desc_sixth: "1/6",
  father_sixth_male_desc: "1/6", father_sixth_plus_asaba: "1/6", mother_sixth_children: "1/6", mother_sixth_siblings: "1/6",
  mother_third: "1/3", grandmother_sixth: "1/6", uterine_sixth: "1/6", uterine_third: "1/3",
  sister_half: "1/2", sister_two_thirds: "2/3", cons_sister_sixth: "1/6"
};
const ASABA_CODES = new Set(["male_desc_asaba", "asaba_with_male", "father_asaba", "father_sixth_plus_asaba", "sister_asaba_daughter", "asaba_remainder"]);
function termOf(r: { reasons: { code: string; fard?: string }[]; radd: boolean }, lang: Lang): string {
  const out: string[] = [];
  for (const x of r.reasons) {
    if (x.code === "mother_third_remainder") { out.push(TERM.rem3[lang]); continue; }
    const f = CODE_FRAC[x.code] ?? (x.fard && TERM[x.fard] ? x.fard : "");
    if (f && TERM[f] && !out.includes(TERM[f][lang])) out.push(TERM[f][lang]);
  }
  if (r.reasons.some((x) => ASABA_CODES.has(x.code))) out.push(TERM.asaba[lang]);
  let t = out.join(" + ");
  if (t && r.radd) t += ` (${TERM.radd[lang]})`;
  return t;
}

const KAFIR_LABEL: Record<Lang, string> = { ur: "ابنِ کافر", roman: "Ibn-e-Kafir", hi: "इब्न-ए-काफ़िर", en: "Non-Muslim son" };
const KAFIR_CELL: Record<Lang, string> = { ur: "وارث نہیں (کأن لم یکن)", roman: "Waaris nahi (ka-an lam yakun)", hi: "वारिस नहीं (क-अन लम यकुन)", en: "Not an heir (as if absent)" };
const KAFIR_NOTE: Record<Lang, string> = {
  ur: "ابنِ کافر کو ایسا سمجھا گیا ہے جیسے وہ ہے ہی نہیں (کأن لم یکن): وہ خود وارث نہیں اور دوسرے ورثاء کے حصے بھی کم نہیں کرتا۔ حوالہ: السراجیہ مع برکات السراج، باب العول، ص ۵۳ (اسی پر فتویٰ ہے)۔",
  roman: "Ibn-e-Kafir ko aisa samjha gaya hai jaise wo hai hi nahi (ka-an lam yakun): wo khud waaris nahi aur doosre warison ke hisse bhi kam nahi karta. Hawala: As-Sirajiya ma'a Barakat as-Siraj, Bab al-Awl, p. 53 (isi par fatwa hai).",
  hi: "इब्न-ए-काफ़िर को ऐसा समझा गया है जैसे वह है ही नहीं (क-अन लम यकुन): वह ख़ुद वारिस नहीं और दूसरे वारिसों के हिस्से भी कम नहीं करता। हवाला: अस-सिराजिया मअ बरकातिस-सिराज, बाबुल-अवल, पृ. 53 (इसी पर फ़तवा है)।",
  en: "The non-Muslim son is treated as if he did not exist (ka-an lam yakun): he is not an heir and does not reduce anyone else's share. Reference: As-Sirajiya with Barakat as-Siraj, Bab al-Awl, p. 53 (the fatwa follows this)."
};
const METAL: Record<"gold" | "silver", Record<Lang, string>> = {
  gold: { ur: "سونا", roman: "Sona", hi: "सोना", en: "Gold" },
  silver: { ur: "چاندی", roman: "Chandi", hi: "चाँदी", en: "Silver" }
};
const METAL_NOTE: Record<Lang, string> = {
  ur: "سونا اور چاندی بھی انہی حصوں کے مطابق تقسیم کیے گئے ہیں۔ قرض یا وصیت سونے چاندی سے ادا ہونی ہو تو عالم سے پوچھ لیں۔",
  roman: "Sona aur chandi bhi inhi hisson ke mutabiq taqseem kiye gaye hain. Qarz ya wasiyat sone-chandi se ada honi ho to Aalim se poochh lein.",
  hi: "सोना और चाँदी भी इन्हीं हिस्सों के मुताबिक़ तक़सीम किए गए हैं। क़र्ज़ या वसीयत सोने-चाँदी से अदा होनी हो तो आलिम से पूछ लें।",
  en: "Gold and silver are divided by the same shares. If debts or a bequest are to be paid from gold or silver, ask a scholar."
};
const pct = (v: number) => `${(Math.round(v * 10000) / 100).toString()}%`;

export function MirathResultView({ result, t2, money, distributable, heirLabel, onPrint, onReset, printLabel, gold, silver, kafirSon = 0 }: Props) {
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
  const numOf = (v?: string) => { const n = parseFloat(String(v ?? "").replace(/,/g, "")); return Number.isFinite(n) && n > 0 ? n : 0; };
  const goldG = numOf(gold), silverG = numOf(silver);
  const hasMetal = goldG > 0 || silverG > 0;
  const showCol = hasAmount || !!land || hasMetal;
  const g3 = (x: number) => (Math.round(x * 1000) / 1000).toString();
  const metalText = (n: number, d: number) => {
    const f = n / d; const parts: string[] = [];
    if (goldG > 0) parts.push(`${METAL.gold[lang]}: ${g3(goldG * f)} g`);
    if (silverG > 0) parts.push(`${METAL.silver[lang]}: ${g3(silverG * f)} g`);
    return parts.join(" · ");
  };

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
          head: [t2.colHeir, t2.colShare, ...(showCol ? [[hasAmount ? t2.colAmount : "", land ? ZM[lang] : "", hasMetal ? [goldG > 0 ? METAL.gold[lang] : "", silverG > 0 ? METAL.silver[lang] : ""].filter(Boolean).join("/") : ""].filter(Boolean).join(" / ")] : [])],
          rows: [
            ...inheriting.map((r) => {
              const ph = r.perHeadShare;
              return [
                <span key="n">{heirLabel(r.key)}{r.count > 1 ? ` ×${r.count}` : ""}</span>,
                <span key="s" dir="ltr" className="block leading-4">{fracText(r.share)}{termOf(r, lang) ? <span className="mt-0.5 block text-[11px] font-extrabold leading-5 text-deen">{termOf(r, lang)}</span> : null}<span className="block text-[9px] font-semibold text-slate-400 print:hidden">{pct(fracValue(r.share))}</span></span>,
                ...(showCol ? [(
                  <div key="c" className="space-y-0.5">
                    {hasAmount && <div className="font-bold tabular-nums">{money(fracValue(r.share) * distributable)}</div>}
                    {land && <div className="text-[11px] font-semibold text-slate-700">{land.fmt(r.share.n, r.share.d, true)}</div>}
                    {hasMetal && <div dir="ltr" className="text-[11px] font-semibold text-amber-800">{metalText(r.share.n, r.share.d)}</div>}
                    {r.count > 1 && <div className="text-[9px] font-normal text-slate-400">{land ? land.each : EACH[lang]}: {hasAmount ? money(fracValue(ph) * distributable) : ""}{hasAmount && land ? " · " : ""}{land ? land.fmt(ph.n, ph.d, true) : null}{hasMetal ? ((hasAmount || land) ? " · " : "") + metalText(ph.n, ph.d) : null}</div>}
                  </div>
                )] : [])
              ];
            }),
            ...blocked.map((r) => [heirLabel(r.key), t2.statusBlocked, ...(showCol ? ["—"] : [])]),
            ...nothing.map((r) => [heirLabel(r.key), "—", ...(showCol ? ["—"] : [])]),
            ...(kafirSon > 0 ? [[`${KAFIR_LABEL[lang]}${kafirSon > 1 ? ` ×${kafirSon}` : ""}`, KAFIR_CELL[lang], ...(showCol ? ["—"] : [])]] : [])
          ],
          foot: ["Σ", <span key="f" dir="ltr">1 = 100%</span>, ...(showCol ? [<div key="t">{hasAmount ? money(distributable) : null}{land ? <div className="text-[10px] font-semibold">{land.fmt(1, 1, true)}</div> : null}{hasMetal ? <div dir="ltr" className="text-[10px] font-semibold">{metalText(1, 1)}</div> : null}</div>] : [])],
          verdictLabel: hasAmount ? t2.amountBase : t2.stepTashih,
          verdictValue: hasAmount ? money(distributable) : String(result.tashih),
          notes: [t2.betaNote, ...(kafirSon > 0 ? [KAFIR_NOTE[lang]] : []), ...(hasMetal ? [METAL_NOTE[lang]] : [])]
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
