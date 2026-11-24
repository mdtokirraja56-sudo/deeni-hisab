"use client";
import { useEffect, useSyncExternalStore } from "react";
import { sanitizeDecimal } from "../lib/numbers";
import { Field } from "./HomeBits";
import { copyLand } from "../lib/copyLand";
import type { Lang } from "../lib/heirs";
import type { MirathResult } from "../lib/mirath";
import { DEFAULT_LAND, LAND_MODES, landOf, landTotal, type LandInput, type LandMode } from "../lib/mirathLand";

const KEY = "deeni-mirath-land-v1";
let state: LandInput = DEFAULT_LAND;
let loaded = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach(f => f());
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export function setLand(p: Partial<LandInput>) {
  state = { ...state, ...p };
  try { window.localStorage.setItem(KEY, JSON.stringify({ mode: state.mode, r1: state.r1, sq: state.sq })); } catch (e) { /* ignore */ }
  emit();
}
function useLand(): LandInput {
  const s = useSyncExternalStore(subscribe, () => state, () => DEFAULT_LAND);
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    try { const r = window.localStorage.getItem(KEY); if (r) { const o = JSON.parse(r); state = { ...state, mode: LAND_MODES.indexOf(o.mode) >= 0 ? o.mode : state.mode, sq: typeof o.sq === "string" && /^\d{0,7}(\.\d{0,2})?$/.test(o.sq) ? o.sq : state.sq, r1: typeof o.r1 === "string" && o.r1 ? o.r1 : state.r1 }; emit(); } } catch (e) { /* ignore */ }
  }, []);
  return s;
}

type Txt = { title: string; opt: string; step1: string; step2: string; modes: Record<LandMode, string>; bigha: string; kattha: string; dhur: string; ratioQ: string; ratioA: string; reset: string; shareTitle: string; total: string; each: string; all: string; eNum: string; eRatio: string; note: string };
const T: Record<Lang, Txt> = {
  en: { title: "Land (optional)", opt: "", step1: "1. In which measure is the land?", step2: "2. Write the amount", modes: { bk: "Bigha + Kattha", dhur: "Dhur", gaz: "Gaz", decimal: "Decimal", sqft: "Sq ft", acre: "Acre", sqm: "Sq m" }, bigha: "Bigha", kattha: "Kattha", dhur: "Dhur", ratioQ: "Change Bigha size (default 1 Bigha = 20 Kattha)", ratioA: "1 Bigha = how many Kattha?", reset: "Clear", shareTitle: "Land share of each heir", total: "Total land", each: "each", all: "all together", eNum: "Enter a valid land amount.", eRatio: "Write the ratio as a whole number (e.g. 20).", note: "Land is divided as part of the whole estate with exact Shariah fractions; only the last digit is rounded. For debts, bequests or special land cases, ask an Aalim." },
  roman: { title: "Zameen (zaroori nahi)", opt: "", step1: "1. Zameen kis naap mein hai?", step2: "2. Miqdar likhein", modes: { bk: "Bigha + Kattha", dhur: "Dhur", gaz: "Gaz", decimal: "Decimal", sqft: "Sq ft", acre: "Acre", sqm: "Sq m" }, bigha: "Bigha", kattha: "Kattha", dhur: "Dhur", ratioQ: "Bigha ka size badlein (abhi 1 Bigha = 20 Kattha)", ratioA: "1 Bigha = kitne Kattha?", reset: "Saaf karein", shareTitle: "Zameen mein har waris ka hissa", total: "Kul zameen", each: "har ek", all: "sab milakar", eNum: "Zameen ki sahi miqdar likhein.", eRatio: "Ratio poora number likhein (jaise 20).", note: "Zameen ko poore tarke ka hissa maan kar sharai fractions se baanta gaya hai; sirf aakhri digit round hota hai. Qarz, wasiyat ya khaas zameen ke masle mein Aalim se poochein." },
  ur: { title: "زمین (ضروری نہیں)", opt: "", step1: "۱۔ زمین کس ناپ میں ہے؟", step2: "۲۔ مقدار لکھیں", modes: { bk: "بیگھہ + کٹھا", dhur: "دھُر", gaz: "گز", decimal: "ڈسمل", sqft: "مربع فٹ", acre: "ایکڑ", sqm: "مربع میٹر" }, bigha: "بیگھہ", kattha: "کٹھا", dhur: "دھُر", ratioQ: "بیگھہ کا سائز بدلیں (ابھی 1 بیگھہ = 20 کٹھا)", ratioA: "1 بیگھہ = کتنے کٹھا؟", reset: "صاف کریں", shareTitle: "زمین میں ہر وارث کا حصہ", total: "کل زمین", each: "ہر ایک", all: "سب مل کر", eNum: "زمین کی درست مقدار لکھیں۔", eRatio: "تناسب پورا عدد لکھیں (مثلاً 20)۔", note: "زمین کو پورے ترکے کا حصہ مان کر شرعی کسور سے تقسیم کیا گیا ہے؛ صرف آخری ہندسہ راؤنڈ ہوتا ہے۔ قرض، وصیت یا خاص زمین کے مسئلے میں عالم سے پوچھیں۔" },
  hi: { title: "ज़मीन (ज़रूरी नहीं)", opt: "", step1: "1. ज़मीन किस नाप में है?", step2: "2. मात्रा लिखें", modes: { bk: "बीघा + कट्ठा", dhur: "धुर", gaz: "गज़", decimal: "डिसमिल", sqft: "वर्ग फ़ुट", acre: "एकड़", sqm: "वर्ग मीटर" }, bigha: "बीघा", kattha: "कट्ठा", dhur: "धुर", ratioQ: "बीघा का साइज़ बदलें (अभी 1 बीघा = 20 कट्ठा)", ratioA: "1 बीघा = कितने कट्ठा?", reset: "साफ़ करें", shareTitle: "ज़मीन में हर वारिस का हिस्सा", total: "कुल ज़मीन", each: "हर एक", all: "सब मिलाकर", eNum: "ज़मीन की सही मात्रा लिखें।", eRatio: "अनुपात पूरी संख्या में लिखें (जैसे 20)।", note: "ज़मीन को पूरे तरके का हिस्सा मानकर शरई भिन्नों से बाँटा गया है; सिर्फ़ आख़िरी अंक राउंड होता है। क़र्ज़, वसीयत या ख़ास ज़मीन के मसले में आलिम से पूछें।" }
};

const NEW: Record<Lang, { sq: string; sqHint: string; approx: string; modern: string }> = {
  roman: { sq: "1 Kattha = kitne sq ft? (zaroori nahi)", sqHint: "Likhne par har hissa Decimal, Gaz aur Sq ft mein bhi dikhega. Aapke ilaqe mein 1 kattha kitne sq ft ka hai, registry ya patwari se pooch lein.", approx: "taqriban", modern: "Naye naap mein" },
  en: { sq: "1 Kattha = how many sq ft? (optional)", sqHint: "If filled, each share is also shown in Decimal, Gaz and Sq ft. Ask your registry or patwari how big 1 kattha is in your area.", approx: "approx.", modern: "In modern units" },
  ur: { sq: "۱ کٹھا = کتنے مربع فٹ؟ (ضروری نہیں)", sqHint: "لکھنے پر ہر حصہ ڈسمل، گز اور مربع فٹ میں بھی دکھے گا۔ آپ کے علاقے میں ایک کٹھا کتنے مربع فٹ کا ہے، رجسٹری یا پٹواری سے پوچھ لیں۔", approx: "تقریباً", modern: "نئے ناپ میں" },
  hi: { sq: "1 कट्ठा = कितने वर्ग फ़ुट? (ज़रूरी नहीं)", sqHint: "लिखने पर हर हिस्सा डिसमिल, गज़ और वर्ग फ़ुट में भी दिखेगा। आपके इलाक़े में 1 कट्ठा कितने वर्ग फ़ुट का है, रजिस्ट्री या पटवारी से पूछ लें।", approx: "तक़रीबन", modern: "नए नाप में" }
};

export function LandInputCard({ lang }: { lang: Lang }) {
  const s = useLand();
  const x = T[lang];
  const bk = s.mode === "bk";
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-700">{x.title}</p>
        {(s.a || s.b) && <button type="button" onClick={() => setLand({ a: "", b: "" })} className="text-[11px] font-bold text-red-600">{x.reset}</button>}
      </div>
      <p className="mt-3 text-xs font-bold text-slate-500">{x.step1}</p>
      <div role="group" aria-label={x.step1} className="mt-2 flex flex-wrap gap-2">
        {LAND_MODES.map(m => <button key={m} type="button" onClick={() => setLand({ mode: m })} aria-pressed={s.mode === m} className={`rounded-xl border px-3 py-2 text-xs font-bold ${s.mode === m ? "border-deen bg-deen text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{x.modes[m]}</button>)}
      </div>
      <p className="mt-4 text-xs font-bold text-slate-500">{x.step2}</p>
      {bk ? (<>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Field label={x.bigha} value={s.a} setValue={v => setLand({ a: sanitizeDecimal(v) })}/>
          <Field label={x.kattha} value={s.b} setValue={v => setLand({ b: sanitizeDecimal(v) })}/>
        </div>
        <details className="mt-3 text-xs text-slate-500">
          <summary className="cursor-pointer font-semibold">{x.ratioQ}</summary>
          <div className="mt-2" dir="ltr">
            <Field label={x.ratioA} value={s.r1} setValue={v => setLand({ r1: v.replace(/\D/g, "") })}/>
          </div>
        </details>
        <details className="mt-3 text-xs text-slate-500" open={!!s.sq}>
          <summary className="cursor-pointer font-semibold">{NEW[lang].sq}</summary>
          <div className="mt-2" dir="ltr">
            <Field label={NEW[lang].sq} value={s.sq} setValue={v => setLand({ sq: sanitizeDecimal(v) })}/>
            <p className="mt-1 text-[11px] leading-5">{NEW[lang].sqHint}</p>
          </div>
        </details>
      </>) : (
        <div className="mt-2"><Field label={x.modes[s.mode]} value={s.a} setValue={v => setLand({ a: sanitizeDecimal(v) })}/></div>
      )}
    </div>
  );
}

/** Land formatter for the one-page result sheet. Returns null when no valid land was entered. */
export function useLandFmt(lang: Lang): { fmt: (n: number, d: number, compact?: boolean) => JSX.Element; each: string; title: string } | null {
  const s = useLand();
  const x = T[lang];
  const tot = landTotal(s);
  if (!tot.ok) return null;
  const fmt = (n: number, d: number, compact?: boolean) => {
    const r = landOf(tot, n, d);
    let ps: { v: string; u: string }[];
    if (tot.kind === "bk") {
      const all = [{ v: r.parts[0], u: x.bigha }, { v: r.parts[1], u: x.kattha }, { v: (r.approx ? "≈ " : "") + r.parts[2], u: x.dhur }];
      ps = all.filter(p => p.v !== "0");
      if (!ps.length) ps = [all[2]];
    } else {
      ps = [{ v: r.parts[0], u: x.modes[tot.mode] }];
      if (r.sqft) ps.push({ v: "≈ " + r.sqft, u: copyLand[lang].sqft });
    }
    const md = r.modern;
    return <>
      <span className="inline-flex flex-wrap gap-x-3">{ps.map(p => <bdi key={p.u}><b className="tabular-nums">{p.v}</b> {p.u}</bdi>)}</span>
      {md && <span className={compact ? "mt-0.5 flex flex-wrap justify-center gap-x-2 text-[9px] font-normal text-slate-500" : "mt-1 flex flex-wrap gap-x-3 text-[12px] text-slate-500"}>{!compact && <span>{NEW[lang].modern}:</span>}<bdi><b className="tabular-nums">{md.decimal}</b> {x.modes.decimal}</bdi><bdi><b className="tabular-nums">{md.gaz}</b> {x.modes.gaz}</bdi><bdi><b className="tabular-nums">{md.sqft}</b> {copyLand[lang].sqft}</bdi></span>}
    </>;
  };
  return { fmt, each: x.each, title: x.modes.bk };
}

export function LandShareView({ lang, result, heirLabel }: { lang: Lang; result: MirathResult; heirLabel: (k: any) => string }) {
  const s = useLand();
  const x = T[lang];
  const tot = landTotal(s);
  if (!tot.ok) return tot.err === "empty" ? null : <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 print:hidden">{tot.err === "ratio" ? x.eRatio : x.eNum}</p>;
  const fmt = (n: number, d: number, compact?: boolean) => {
    const r = landOf(tot, n, d);
    let ps: { v: string; u: string }[];
    if (tot.kind === "bk") {
      const all = [{ v: r.parts[0], u: x.bigha }, { v: r.parts[1], u: x.kattha }, { v: (r.approx ? "≈ " : "") + r.parts[2], u: x.dhur }];
      ps = all.filter(p => p.v !== "0");
      if (!ps.length) ps = [all[2]];
    } else {
      ps = [{ v: r.parts[0], u: x.modes[tot.mode] }];
      if (r.sqft) ps.push({ v: "≈ " + r.sqft, u: copyLand[lang].sqft });
    }
    const md = r.modern;
    return <>
      <span className="inline-flex flex-wrap gap-x-3">{ps.map(p => <bdi key={p.u}><b className="tabular-nums">{p.v}</b> {p.u}</bdi>)}</span>
      {md && <span className={compact ? "mt-0.5 flex flex-wrap justify-center gap-x-2 text-[9px] font-normal text-slate-500" : "mt-1 flex flex-wrap gap-x-3 text-[12px] text-slate-500"}>{!compact && <span>{NEW[lang].modern}:</span>}<bdi><b className="tabular-nums">{md.decimal}</b> {x.modes.decimal}</bdi><bdi><b className="tabular-nums">{md.gaz}</b> {x.modes.gaz}</bdi><bdi><b className="tabular-nums">{md.sqft}</b> {copyLand[lang].sqft}</bdi></span>}
    </>;
  };
  const whole = fmt(1, 1);
  return (
    <details className="mt-5 rounded-2xl border border-emerald-900/10 bg-white p-4 ring-1 ring-slate-900/5 print:hidden">
      <summary className="cursor-pointer text-sm font-extrabold text-deen">{x.shareTitle}</summary>
      <p className="mt-2 text-xs text-slate-500">{x.total}: {whole}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {result.rows.filter(r => r.status === "inherits").map(r => (
          <li key={r.key} className="border-b border-slate-100 pb-2">
            <div className="font-bold">{heirLabel(r.key)}{r.count > 1 ? ` ×${r.count}` : ""}</div>
            <div className="text-xs text-slate-600">{x.each}: <span className="text-deen">{fmt(r.perHeadShare.n, r.perHeadShare.d)}</span></div>
            {r.count > 1 && <div className="text-[11px] text-slate-400">{x.all}: {fmt(r.share.n, r.share.d)}</div>}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-5 text-slate-400">{x.note}</p>
    </details>
  );
}
