"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, Sprout, HandCoins, Scale, Gift, Beef, History, Heart } from "lucide-react";
import { copyMore, type CopyMore } from "../lib/copyMore";
import { calculateUshr, type Irrigation, type UshrResult, type UshrUnit } from "../lib/ushr";
import { calculateFitr, FITR_RULES, type FitrGrain, type FitrResult } from "../lib/fitr";
import { parseAmount, sanitizeDecimal } from "../lib/numbers";
import type { Lang } from "../lib/heirs";
import { Field, Choice, Tile, Note, Actions } from "./calcUi";
import { FidyaCalc, KaffaraCalc, MahrCalc, QurbaniCalc, QazaCalc } from "./ExtraCalculators";
import { copyExtra } from "../lib/copyExtra";
import { WeightConverter } from "./WeightConverter";
import { copyWeights } from "../lib/copyWeights";

interface Props {
  lang: Lang;
  money: (n: number) => string;
}

const kg = (n: number) => `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 }).format(n)} kg`;
const digitsOnly = (s: string) => sanitizeDecimal(s).replace(/\./g, "");

/* ------------------------------- Ushr ------------------------------- */
function UshrCalc({ t, money }: { t: CopyMore; money: (n: number) => string }) {
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState<UshrUnit>("kg");
  const [price, setPrice] = useState("");
  const [irr, setIrr] = useState<Irrigation>("rain");
  const [share, setShare] = useState("");
  const [res, setRes] = useState<UshrResult | null>(null);

  const run = () => setRes(calculateUshr({ quantity: parseAmount(qty), unit, pricePerKg: parseAmount(price), irrigation: irr, paidSharePercent: parseAmount(share) }));
  const clear = () => { setQty(""); setPrice(""); setShare(""); setRes(null); };
  const err = (f: string) => {
    const e = res?.errors.find((x) => x.field === f);
    return e ? (e.code === "quantity_required" ? t.errQuantity : e.code === "share_range" ? t.errShare : t.errNumber) : undefined;
  };
  const touch = <T,>(set: (v: T) => void) => (v: T) => { set(v); setRes(null); };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.ushrQty} value={qty} setValue={touch(setQty)} suffix={unit === "kg" ? "kg" : "qtl"} error={err("quantity")} />
        <Choice value={unit} onChange={touch(setUnit)} label={t.ushrUnit} options={[{ id: "kg", text: t.unitKg }, { id: "quintal", text: t.unitQuintal }]} />
      </div>
      <Choice value={irr} onChange={touch(setIrr)} label={t.irrigation} options={[{ id: "rain", text: t.irrRain }, { id: "paid", text: t.irrPaid }, { id: "mixed", text: t.irrMixed }]} />
      {irr === "mixed" && <Field label={t.paidShare} value={share} setValue={touch(setShare)} suffix="%" hint={t.paidShareHint} error={err("paidSharePercent")} />}
      <Field label={t.ushrPrice} value={price} setValue={touch(setPrice)} prefix="₹" hint={t.ushrPriceHint} error={err("pricePerKg")} />
      <Actions onCalc={run} onReset={clear} t={t} />

      {res && res.status !== "invalid" && (
        <section role="status" className="rounded-3xl border border-emerald-900/10 bg-emerald-50/50 p-4 md:p-5">
          <h4 className="flex items-center gap-2 text-base font-extrabold text-deen"><CheckCircle2 size={18} />{t.result}</h4>
          {res.status === "needs_ruling" ? (
            <div className="mt-3 space-y-2"><Note tone="warn">{t.ushrEqual}</Note></div>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Tile label={t.ushrRate} value={res.rate === 0.1 ? t.ushrRainShort : t.ushrPaidShort} />
                <Tile label={t.ushrRemain} value={kg(res.remainingKg)} />
                <Tile strong label={t.ushrDueQty} value={kg(res.ushrKg)} />
                {res.hasPrice && <Tile strong label={t.ushrDueValue} value={money(res.ushrValue)} />}
              </div>
              <div className="mt-3 space-y-2">
                <Note>{t.ushrNoNisab}</Note>
                <Note>{t.ushrNoDeduction}</Note>
              </div>
            </>
          )}
          <p className="mt-3 text-[11px] leading-5 text-amber-900">{t.review}</p>
        </section>
      )}
    </div>
  );
}

/* ------------------------------ Fitr ------------------------------- */
function FitrCalc({ t, money }: { t: CopyMore; money: (n: number) => string }) {
  const [persons, setPersons] = useState("");
  const [grain, setGrain] = useState<FitrGrain>("wheat");
  const [wChoice, setWChoice] = useState<string>(String(FITR_RULES.defaultWheatGrams));
  const [custom, setCustom] = useState("");
  const [price, setPrice] = useState("");
  const [surplus, setSurplus] = useState("");
  const [silver, setSilver] = useState("");
  const [res, setRes] = useState<FitrResult | null>(null);

  const touch = <T,>(set: (v: T) => void) => (v: T) => { set(v); setRes(null); };
  const grams = wChoice === "custom" ? parseAmount(custom) : Number(wChoice);
  const run = () => setRes(calculateFitr({ persons: parseAmount(persons), grain, wheatGrams: grams, pricePerKg: parseAmount(price), surplusWealth: parseAmount(surplus), silverPricePerGram: parseAmount(silver) }));
  const clear = () => { setPersons(""); setPrice(""); setCustom(""); setSurplus(""); setSilver(""); setRes(null); };
  const err = (f: string) => {
    const e = res?.errors.find((x) => x.field === f);
    return e ? (e.code === "persons" ? t.errPersons : e.code === "weight" ? t.errWeight : e.code === "price_required" ? t.errPrice : t.errNumber) : undefined;
  };

  return (
    <div className="space-y-5">
      <Field label={t.persons} value={persons} setValue={(v) => { setPersons(digitsOnly(v)); setRes(null); }} hint={t.personsHint} error={err("persons")} />
      <Choice value={grain} onChange={touch(setGrain)} label={t.grain} options={[{ id: "wheat", text: t.gWheat }, { id: "barley", text: t.gBarley }, { id: "dates", text: t.gDates }, { id: "raisins", text: t.gRaisins }]} />
      <div className="space-y-3">
        <Choice value={wChoice} onChange={touch(setWChoice)} label={t.weight} options={[{ id: "1633", text: t.w1633 }, { id: "2047", text: t.w2047 }, { id: "custom", text: t.wCustom }]} />
        {wChoice === "custom" && <Field label={t.customGrams} value={custom} setValue={touch((v: string) => setCustom(sanitizeDecimal(v)))} suffix="g" error={err("wheatGrams")} />}
        <p className="text-[11px] leading-5 text-slate-400">{t.weightHint}</p>
      </div>
      <Field label={t.priceKg} value={price} setValue={touch((v: string) => setPrice(sanitizeDecimal(v)))} prefix="₹" error={err("pricePerKg")} />

      <fieldset className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
        <legend className="px-2 text-xs font-extrabold text-amber-900">{t.nisabTitle}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.surplus} value={surplus} setValue={touch((v: string) => setSurplus(sanitizeDecimal(v)))} prefix="₹" />
          <Field label={t.silverPrice} value={silver} setValue={touch((v: string) => setSilver(sanitizeDecimal(v)))} prefix="₹" />
        </div>
      </fieldset>
      <Actions onCalc={run} onReset={clear} t={t} />

      {res && res.status === "ok" && (
        <section role="status" className="rounded-3xl border border-emerald-900/10 bg-emerald-50/50 p-4 md:p-5">
          <h4 className="flex items-center gap-2 text-base font-extrabold text-deen"><CheckCircle2 size={18} />{t.result}</h4>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Tile label={t.perPersonQty} value={kg(res.gramsPerPerson / 1000)} />
            <Tile label={t.perPersonAmt} value={money(res.amountPerPerson)} />
          </div>
          <div className="mt-2"><Tile strong label={`${t.total} (${parseAmount(persons)} ${t.forPersons})`} value={money(res.total)} /></div>
          <div className="mt-3 space-y-2">
            {res.nisab === "reached" && <Note>{t.nisabReached}</Note>}
            {res.nisab === "not_reached" && <Note tone="warn">{t.nisabNot}</Note>}
            {res.nisab === "unknown" && <Note>{t.nisabUnknown}</Note>}
            {res.nisab !== "unknown" && <p className="text-[11px] text-slate-500">{t.nisabValueLine}: <span className="font-bold tabular-nums text-deen">{money(res.nisabValue)}</span></p>}
            <Note tone="warn">{t.weightDiffers}</Note>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-amber-900">{t.review}</p>
        </section>
      )}
    </div>
  );
}

/* --------------------------- Main component --------------------------- */
type Id = "ushr" | "fitr" | "fidya" | "kaffara" | "mahr" | "qurbani" | "qaza" | "weight";

export function MoreCalculators({ lang, money }: Props) {
  const t = copyMore[lang];
  const x = copyExtra[lang];
  const [sub, setSub] = useState<Id>("ushr");
  const chips: { id: Id; text: string }[] = [
    { id: "ushr", text: t.chipUshr }, { id: "fitr", text: t.chipFitr },
    { id: "fidya", text: t.chipFidya }, { id: "kaffara", text: t.chipKaffara },
    { id: "mahr", text: x.chipMahr }, { id: "qurbani", text: x.chipQurbani }, { id: "qaza", text: x.chipQaza }, { id: "weight", text: copyWeights[lang].chip }
  ];
  const meta: Record<Id, { title: string; sub: string; icon: ReactNode }> = {
    ushr: { title: t.ushrTitle, sub: t.ushrSub, icon: <Sprout size={24} /> },
    fitr: { title: t.fitrTitle, sub: t.fitrSub, icon: <HandCoins size={24} /> },
    fidya: { title: x.fidyaTitle, sub: x.fidyaSub, icon: <Heart size={24} /> },
    kaffara: { title: x.kaffaraTitle, sub: x.kaffaraSub, icon: <Scale size={24} /> },
    mahr: { title: x.mahrTitle, sub: x.mahrSub, icon: <Gift size={24} /> },
    qurbani: { title: x.qurbaniTitle, sub: x.qurbaniSub, icon: <Beef size={24} /> },
    qaza: { title: x.qazaTitle, sub: x.qazaSub, icon: <History size={24} /> },
    weight: { title: copyWeights[lang].title, sub: copyWeights[lang].sub, icon: <Scale size={24} /> }
  };
  const m = meta[sub];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-900/5 md:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-deen">{m.icon}</div>
        <div><h2 className="text-xl font-extrabold text-deen">{m.title}</h2><p className="text-xs text-slate-400">{m.sub}</p></div>
      </div>

      <div role="group" aria-label={t.pickTitle} className="mb-6 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button key={c.id} type="button" aria-pressed={sub === c.id} onClick={() => setSub(c.id)}
            className={`rounded-2xl px-4 py-2.5 text-sm font-extrabold transition ${sub === c.id ? "bg-deen text-white shadow" : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-emerald-50"}`}>{c.text}</button>
        ))}
      </div>

      {sub === "ushr" ? <UshrCalc t={t} money={money} />
        : sub === "fitr" ? <FitrCalc t={t} money={money} />
        : sub === "fidya" ? <FidyaCalc t={t} x={x} money={money} />
        : sub === "kaffara" ? <KaffaraCalc t={t} x={x} money={money} />
        : sub === "mahr" ? <MahrCalc t={t} x={x} money={money} />
        : sub === "qurbani" ? <QurbaniCalc t={t} x={x} money={money} />
        : sub === "weight" ? <WeightConverter t={t} lang={lang} money={money} />
        : <QazaCalc t={t} x={x} />}
    </div>
  );
      }
            
