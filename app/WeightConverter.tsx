"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { CopyMore } from "../lib/copyMore";
import { copyWeights } from "../lib/copyWeights";
import { gramsToTola, tolaToGrams } from "../lib/weights";
import type { Lang } from "../lib/heirs";
import { parseAmount, sanitizeDecimal } from "../lib/numbers";
import { Field, Choice, Tile, Note, Actions } from "./calcUi";

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
        <section role="status" className="rounded-3xl border border-emerald-900/10 bg-emerald-50/50 p-4 md:p-5">
          <h4 className="flex items-center gap-2 text-base font-extrabold text-deen"><CheckCircle2 size={18} />{t.result}</h4>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {a?.status === "ok" && <div className="col-span-2"><Tile strong label={w.rGrams} value={`${num(grams)} g`} /></div>}
            {b?.status === "ok" && (<>
              <div className="col-span-2"><Tile strong label={w.rParts} value={<span className="text-base">{parts || "0"}</span>} /></div>
              <div className="col-span-2"><Tile label={w.rDecimal} value={num(b.tolaDecimal)} /></div>
            </>)}
            {p > 0 && <div className="col-span-2"><Tile label={w.value} value={money(grams * p)} /></div>}
          </div>
        </section>
      )}

      <div className="space-y-2 rounded-2xl border border-slate-200 p-4">
        <div className="text-xs font-extrabold text-deen">{w.tableTitle}</div>
        <p className="text-[11px] leading-6 text-slate-600" dir="ltr">{w.refLine}</p>
        <p className="text-[11px] leading-6 text-slate-600">{w.nisabGold}: <b className="tabular-nums" dir="ltr">{nisab(7.5)}</b> · {w.nisabSilver}: <b className="tabular-nums" dir="ltr">{nisab(52.5)}</b></p>
      </div>
      <Note tone="warn">{w.note}</Note>
    </div>
  );
}
