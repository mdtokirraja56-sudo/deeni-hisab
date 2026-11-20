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
  try { window.localStorage.setItem(KEY, JSON.stringify({ mode: state.mode, r1: state.r1, r2: state.r2 })); } catch (e) { /* ignore */ }
  emit();
}
function useLand(): LandInput {
  const s = useSyncExternalStore(subscribe, () => state, () => DEFAULT_LAND);
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    try { const r = window.localStorage.getItem(KEY); if (r) { state = { ...state, ...JSON.parse(r) }; emit(); } } catch (e) { /* ignore */ }
  }, []);
  return s;
}

type Txt = { title: string; opt: string; modes: Record<LandMode, string>; bigha: string; kattha: string; dhur: string; hint: string; reset: string; shareTitle: string; total: string; each: string; all: string; eNum: string; eRatio: string; note: string };
const T: Record<Lang, Txt> = {
  en: { title: "Total land", opt: "optional", modes: { bkd: "Bigha · Kattha · Dhur", decimal: "Decimal", gaz: "Gaz (sq yd)", sqft: "Sq ft", acre: "Acre", sqm: "Sq m" }, bigha: "Bigha", kattha: "Kattha", dhur: "Dhur", hint: "Bigha size differs by region; write the ratio used in your area.", reset: "Clear land", shareTitle: "Land share of each heir", total: "Total land", each: "each", all: "all together", eNum: "Enter a valid land amount.", eRatio: "Write ratios as whole numbers (e.g. 20).", note: "Land is divided as part of the whole estate, using the exact Shariah fractions; only the last digit is rounded. For debts, bequests or special land cases, ask an Aalim." },
  roman: { title: "Kul zameen", opt: "zaroori nahi", modes: { bkd: "Bigha · Kattha · Dhur", decimal: "Decimal", gaz: "Gaz (sq yd)", sqft: "Sq ft", acre: "Acre", sqm: "Sq m" }, bigha: "Bigha", kattha: "Kattha", dhur: "Dhur", hint: "Bigha ka size ilaake ke hisab se alag hota hai; apne ilaake ka ratio likhein.", reset: "Zameen saaf karein", shareTitle: "Zameen mein har waris ka hissa", total: "Kul zameen", each: "har ek", all: "sab milakar", eNum: "Zameen ki sahi miqdar likhein.", eRatio: "Ratio poora number likhein (jaise 20).", note: "Zameen ko poore tarke ka hissa maan kar sharai fractions se baanta gaya hai; sirf aakhri digit round hota hai. Qarz, wasiyat ya khaas zameen ke masle mein Aalim se poochein." },
  ur: { title: "کل زمین", opt: "اختیاری", modes: { bkd: "بیگھہ · کٹھا · دھُر", decimal: "ڈسمل", gaz: "گز", sqft: "مربع فٹ", acre: "ایکڑ", sqm: "مربع میٹر" }, bigha: "بیگھہ", kattha: "کٹھا", dhur: "دھُر", hint: "بیگھہ کا سائز علاقے کے لحاظ سے الگ ہوتا ہے؛ اپنے علاقے کا تناسب لکھیں۔", reset: "زمین صاف کریں", shareTitle: "زمین میں ہر وارث کا حصہ", total: "کل زمین", each: "ہر ایک", all: "سب مل کر", eNum: "زمین کی درست مقدار لکھیں۔", eRatio: "تناسب پورا عدد لکھیں (مثلاً 20)۔", note: "زمین کو پورے ترکے کا حصہ مان کر شرعی کسور سے تقسیم کیا گیا ہے؛ صرف آخری ہندسہ راؤنڈ ہوتا ہے۔ قرض، وصیت یا خاص زمین کے مسئلے میں عالم سے پوچھیں۔" },
  hi: { title: "कुल ज़मीन", opt: "ज़रूरी नहीं", modes: { bkd: "बीघा · कट्ठा · धुर", decimal: "डिसमिल", gaz: "गज़", sqft: "वर्ग फ़ुट", acre: "एकड़", sqm: "वर्ग मीटर" }, bigha: "बीघा", kattha: "कट्ठा", dhur: "धुर", hint: "बीघा का साइज़ इलाक़े के हिसाब से अलग होता है; अपने इलाक़े का अनुपात लिखें।", reset: "ज़मीन साफ़ करें", shareTitle: "ज़मीन में हर वारिस का हिस्सा", total: "कुल ज़मीन", each: "हर एक", all: "सब मिलाकर", eNum: "ज़मीन की सही मात्रा लिखें।", eRatio: "अनुपात पूरी संख्या में लिखें (जैसे 20)।", note: "ज़मीन को पूरे तरके का हिस्सा मानकर शरई भिन्नों से बाँटा गया है; सिर्फ़ आख़िरी अंक राउंड होता है। क़र्ज़, वसीयत या ख़ास ज़मीन के मसले में आलिम से पूछें।" }
};

export function LandInputCard({ lang }: { lang: Lang }) {
  const s = useLand();
  const x = T[lang];
  const std = s.mode !== "bkd";
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-slate-700">{x.title} <span className="text-xs font-semibold text-slate-400">({x.opt})</span></p>
        {(s.a || s.b || s.c) && <button type="button" onClick={() => setLand({ a: "", b: "", c: "" })} className="text-[11px] font-bold text-red-600">{x.reset}</button>}
      </div>
      <div role="group" aria-label={x.title} className="mt-3 flex flex-wrap gap-2">
        {LAND_MODES.map(m => <button key={m} type="button" onClick={() => setLand({ mode: m })} aria-pressed={s.mode === m} className={`rounded-xl border px-3 py-2 text-xs font-bold ${s.mode === m ? "border-deen bg-deen text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{x.modes[m]}</button>)}
      </div>
      {std ? (
        <div className="mt-3"><Field label={x.modes[s.mode]} value={s.a} setValue={v => setLand({ a: sanitizeDecimal(v) })}/></div>
      ) : (<>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Field label={x.bigha} value={s.a} setValue={v => setLand({ a: sanitizeDecimal(v) })}/>
          <Field label={x.kattha} value={s.b} setValue={v => setLand({ b: sanitizeDecimal(v) })}/>
          <Field label={x.dhur} value={s.c} setValue={v => setLand({ c: sanitizeDecimal(v) })}/>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600" dir="ltr">
          <span>1 Bigha =</span>
          <input inputMode="numeric" value={s.r1} onChange={e => setLand({ r1: e.target.value.replace(/\D/g, "") })} aria-label="Kattha" className="w-14 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-center text-sm font-bold outline-none focus:border-emerald-700"/>
          <span>Kattha · 1 Kattha =</span>
          <input inputMode="numeric" value={s.r2} onChange={e => setLand({ r2: e.target.value.replace(/\D/g, "") })} aria-label="Dhur" className="w-14 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-center text-sm font-bold outline-none focus:border-emerald-700"/>
          <span>Dhur</span>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-slate-400">{x.hint}</p>
      </>)}
    </div>
  );
}

export function LandShareView({ lang, result, heirLabel }: { lang: Lang; result: MirathResult; heirLabel: (k: any) => string }) {
  const s = useLand();
  const x = T[lang];
  const tot = landTotal(s);
  if (!tot.ok) return tot.err === "empty" ? null : <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 print:hidden">{tot.err === "ratio" ? x.eRatio : x.eNum}</p>;
  const fmt = (n: number, d: number) => {
    const r = landOf(tot, n, d);
    let ps: { v: string; u: string }[];
    if (tot.kind === "bkd") {
      const all = [{ v: r.parts[0], u: x.bigha }, { v: r.parts[1], u: x.kattha }, { v: r.parts[2], u: x.dhur }];
      ps = all.filter(p => p.v !== "0");
      if (!ps.length) ps = [all[2]];
    } else {
      ps = [{ v: r.parts[0], u: x.modes[tot.mode] }];
      if (r.sqft) ps.push({ v: "≈ " + r.sqft, u: copyLand[lang].sqft });
    }
    return <span className="inline-flex flex-wrap gap-x-3">{ps.map(p => <bdi key={p.u}><b className="tabular-nums">{p.v}</b> {p.u}</bdi>)}</span>;
  };
  const whole = fmt(1, 1);
  return (
    <section className="mt-5 rounded-2xl border border-emerald-900/10 bg-white p-4 ring-1 ring-slate-900/5">
      <h4 className="text-sm font-extrabold text-deen">{x.shareTitle}</h4>
      <p className="mt-1 text-xs text-slate-500">{x.total}: {whole}</p>
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
    </section>
  );
}
