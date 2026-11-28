"use client";

import { useState } from "react";
import type { CopyMore } from "../lib/copyMore";
import { copyWeights } from "../lib/copyWeights";
import { WEIGHT_RULES, gramsToTola, tolaToGrams } from "../lib/weights";
import type { Lang } from "../lib/heirs";
import { parseAmount, sanitizeDecimal } from "../lib/numbers";
import { OLD_WEIGHTS, ratti2parts, rattiToGrams, rattiToRupee } from "../lib/oldWeights";
import { Field, Choice, Tile, Note, Actions, ResultBox } from "./calcUi";

const OW: Record<Lang, { title: string; hint: string; col: string[]; t: string; m: string; r: string; src: string }> = {
  ur: { title: "پرانے شرعی وزن اور سکے (جدول)", hint: "ہر وزن رتی سے نکالا گیا ہے: ۱ رتی = ۰٫۱۲۹۶ گرام، ۱ ماشہ = ۸ رتی، ۱ تولہ = ۱۲ ماشے۔", col: ["نام", "تولہ · ماشہ · رتی", "روپے بھر", "گرام"], t: "تولہ", m: "ماشہ", r: "رتی", src: "ماخذ: منتخب فتاویٰ (اوزانِ جدیدہ سے متعلق)، ص ۲۳–۲۴، ۲۸۔ یہ سب وزن فتاویٰ رضویہ کے جدول سے لیے گئے ہیں۔" },
  roman: { title: "Purane shar'i wazan aur sikke (jadwal)", hint: "Har wazan ratti se nikala gaya hai: 1 ratti = 0.1296 g, 1 masha = 8 ratti, 1 tola = 12 masha.", col: ["Naam", "Tola · Masha · Ratti", "Rupay bhar", "Gram"], t: "tola", m: "masha", r: "ratti", src: "Hawala: Muntakhab Fatwe (Auzan-e-Jadeeda se muta'alliq), pp 23–24, 28. Ye sab wazan Fatawa Razaviyya ke jadwal se liye gaye hain." },
  hi: { title: "पुराने शरई वज़न और सिक्के (जदवल)", hint: "हर वज़न रत्ती से निकाला गया है: 1 रत्ती = 0.1296 ग्राम, 1 माशा = 8 रत्ती, 1 तोला = 12 माशा।", col: ["नाम", "तोला · माशा · रत्ती", "रुपये भर", "ग्राम"], t: "तोला", m: "माशा", r: "रत्ती", src: "हवाला: मुंतख़ब फ़तावा (औज़ान-ए-जदीदा से मुतअल्लिक़), पृ. 23–24, 28। ये सब वज़न फ़तावा रज़विय्या के जदवल से लिए गए हैं।" },
  en: { title: "Old shar'i weights and coins (table)", hint: "Every weight is derived from the ratti: 1 ratti = 0.1296 g, 1 masha = 8 ratti, 1 tola = 12 masha.", col: ["Name", "Tola · Masha · Ratti", "Rupee-weights", "Grams"], t: "tola", m: "masha", r: "ratti", src: "Source: Muntakhab Fatawe (on modern weights), pp. 23–24, 28. All figures come from the table of Fatawa Razaviyya." }
};
const num = (n: number, d = 4) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: d }).format(n);

export function WeightConverter({ t, lang, money }: { t: CopyMore; lang: Lang; money: (n: number) => string }) {
  const w = copyWeights[lang];
  const [mode, setMode] = useState<"toGrams" | "toTola">("toGrams");
  const [tola, setTola] = useState("");
  const [masha, setMasha] = useState("");
  const [ratti, setRatti] = useState("");
  const [gram, setGram] = useState("");
  const [price, setPrice] = useState("");
  const [go, setGo] = useState(false);
  const up = (set: (v: string) => void) => (v: string) => { set(sanitizeDecimal(v)); setGo(false); };

  const a = go && mode === "toGrams" ? tolaToGrams({ tola: parseAmount(tola), masha: parseAmount(masha), ratti: parseAmount(ratti) }) : null;
  const b = go && mode === "toTola" ? gramsToTola(parseAmount(gram)) : null;
  const grams = a?.status === "ok" ? a.grams : b?.status === "ok" ? b.grams : 0;
  const p = parseAmount(price);
  const parts = b?.status === "ok" ? [b.tola ? `${num(b.tola)} ${w.tolaWord}` : "", b.masha ? `${num(b.masha)} ${w.mashaWord}` : "", b.ratti ? `${num(b.ratti, 2)} ${w.rattiWord}` : ""].filter(Boolean).join(" · ") : "";
  const nisab = (tl: number) => { const r = tolaToGrams({ tola: tl, masha: 0, ratti: 0 }); return `${num(r.grams, 3)} g`; };

  return (
    <div className="space-y-5">
      <Choice value={mode} onChange={(v) => { setMode(v); setGo(false); }} label={w.mode} options={[{ id: "toGrams", text: w.toGrams }, { id: "toTola", text: w.toTola }]} />
      {mode === "toGrams" ? (
        <div className="space-y-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={w.tola} value={tola} setValue={up(setTola)} />
            <Field label={w.masha} value={masha} setValue={up(setMasha)} />
            <Field label={w.ratti} value={ratti} setValue={up(setRatti)} />
          </div>
          <p className="text-[11px] text-slate-400">{w.fieldHint}</p>
          {a?.status === "invalid" && <p role="alert" className="text-[11px] font-bold text-red-600">{w.errEmpty}</p>}
        </div>
      ) : (
        <Field label={w.gram} value={gram} setValue={up(setGram)} suffix="g" error={b?.status === "invalid" ? w.errGram : undefined} />
      )}
      <Field label={`${w.priceTitle}: ${w.price}`} value={price} setValue={up(setPrice)} prefix="₹" />
      <Actions t={t} onCalc={() => setGo(true)} onReset={() => { setTola(""); setMasha(""); setRatti(""); setGram(""); setPrice(""); setGo(false); }} />

      {grams > 0 && (
        <ResultBox t={t} title={w.title}
          lines={[a?.status === "ok" ? `${w.rGrams}: ${num(grams)} g` : `${w.rParts}: ${parts || "0"}`, ...(b?.status === "ok" ? [`${w.rDecimal}: ${num(b.tolaDecimal)}`] : []), ...(p > 0 ? [`${w.value}: ${money(grams * p)}`] : [])]}
          how={a?.status === "ok"
            ? [{ label: w.rGrams, formula: `${[parseAmount(tola) ? `${num(parseAmount(tola))} × ${WEIGHT_RULES.tolaGrams}` : "", parseAmount(masha) ? `${num(parseAmount(masha))} × ${WEIGHT_RULES.mashaGrams}` : "", parseAmount(ratti) ? `${num(parseAmount(ratti))} × ${WEIGHT_RULES.rattiGrams}` : ""].filter(Boolean).join(" + ")} = ${num(grams)} g` }]
            : [{ label: w.rDecimal, formula: `${num(grams)} g ÷ ${WEIGHT_RULES.tolaGrams} = ${num(b?.tolaDecimal ?? 0)}` }]}>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {a?.status === "ok" && <div className="col-span-2"><Tile strong label={w.rGrams} value={`${num(grams)} g`} /></div>}
            {b?.status === "ok" && (<>
              <div className="col-span-2"><Tile strong label={w.rParts} value={<span className="text-base">{parts || "0"}</span>} /></div>
              <div className="col-span-2"><Tile label={w.rDecimal} value={num(b.tolaDecimal)} /></div>
            </>)}
            {p > 0 && <div className="col-span-2"><Tile label={w.value} value={money(grams * p)} /></div>}
          </div>
        </ResultBox>
      )}

      <div className="space-y-2 rounded-2xl border border-slate-200 p-4">
        <div className="text-xs font-extrabold text-deen">{w.tableTitle}</div>
        <p className="text-[11px] leading-6 text-slate-600" dir="ltr">{w.refLine}</p>
        <p className="text-[11px] leading-6 text-slate-600">{w.nisabGold}: <b className="tabular-nums" dir="ltr">{nisab(7.5)}</b> · {w.nisabSilver}: <b className="tabular-nums" dir="ltr">{nisab(52.5)}</b></p>
      </div>
      <details className="rounded-2xl border border-slate-200 bg-white p-3">
        <summary className="cursor-pointer text-xs font-extrabold text-deen">{OW[lang].title}</summary>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">{OW[lang].hint}</p>
        <div className="mt-3 border-b border-slate-200 pb-1 grid grid-cols-3 gap-2 text-[9px] font-bold text-slate-400" dir="ltr"><span>{OW[lang].col[1]}</span><span className="text-center">{OW[lang].col[2]}</span><span className="text-end">{OW[lang].col[3]}</span></div>
        <div className="divide-y divide-slate-100">
          {OLD_WEIGHTS.map((r) => { const q = ratti2parts(r.ratti); const o = OW[lang];
            const parts = [q.tola ? `${num(q.tola)} ${o.t}` : "", q.masha ? `${num(q.masha)} ${o.m}` : "", q.ratti ? `${num(q.ratti, 1)} ${o.r}` : ""].filter(Boolean).join(" · ");
            const rp = rattiToRupee(r.ratti);
            return <div key={r.id} className="py-2">
              <div className="text-xs font-extrabold text-slate-700">{r.name[lang]}</div>
              {r.note && <div className="text-[10px] leading-4 text-slate-400">{r.note[lang]}</div>}
              <div className="mt-1 grid grid-cols-3 gap-2 text-[11px] text-slate-600" dir="ltr">
                <span>{parts}</span><span className="text-center">{num(rp, 3)}</span><span className="text-end font-bold tabular-nums text-deen">{num(rattiToGrams(r.ratti), 4)} g</span>
              </div>
            </div>; })}
        </div>
        <p className="mt-2 text-[10px] leading-5 text-slate-400">{OW[lang].src}</p>
      </details>
      <Note tone="warn">{w.note}</Note>
    </div>
  );
}
