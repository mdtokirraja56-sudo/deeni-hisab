"use client";

import { useState } from "react";
import type { CopyMore } from "../lib/copyMore";
import type { CopyExtra } from "../lib/copyExtra";
import { calculateFitr, FITR_RULES } from "../lib/fitr";
import { EXTRA_RULES, calculateFidya, calculateKaffara, calculateMahr, calculateQurbani, calculateQaza, type FidyaKind, type KaffaraKind } from "../lib/extras";
import { parseAmount, sanitizeDecimal } from "../lib/numbers";
import { Field, Choice, Tile, Note, Actions, ResultBox } from "./calcUi";

type Money = (n: number) => string;
const rateHow = (x: CopyExtra, grams: number, price: string, value: number, money: Money) => ({ label: x.rateIs, formula: `${num(grams)} g ÷ 1000 × ${money(parseAmount(price))} = ${money(value)}` });
const whole = (s: string) => sanitizeDecimal(s).replace(/\./g, "");
const num = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 }).format(n);

/* Wheat price + weight -> amount for one poor person (same maths as Sadaqah-e-Fitr) */
function useRate(t: CopyMore) {
  const [price, setPrice] = useState("");
  const [wChoice, setWChoice] = useState<string>(String(FITR_RULES.defaultWheatGrams));
  const [custom, setCustom] = useState("");
  const grams = wChoice === "custom" ? parseAmount(custom) : Number(wChoice);
  const rate = () => {
    const r = calculateFitr({ persons: 1, grain: "wheat", wheatGrams: grams, pricePerKg: parseAmount(price), surplusWealth: 0, silverPricePerGram: 0 });
    return { ok: r.status === "ok", value: r.amountPerPerson, err: r.errors[0]?.code };
  };
  return { price, setPrice, grams, wChoice, setWChoice, custom, setCustom, rate, clear: () => { setPrice(""); setCustom(""); } };
}

function RateFields({ t, x, r, show }: { t: CopyMore; x: CopyExtra; r: ReturnType<typeof useRate>; show: boolean }) {
  const e = show ? r.rate() : null;
  return (
    <fieldset className="space-y-4 rounded-2xl border border-slate-200 p-4">
      <legend className="px-2 text-xs font-extrabold text-deen">{x.rateTitle}</legend>
      <Field label={x.wheatPrice} value={r.price} setValue={(v) => r.setPrice(sanitizeDecimal(v))} prefix="₹" error={e && !e.ok && (e.err === "price_required" || e.err === "number") ? x.errRate : undefined} />
      <Choice value={r.wChoice} onChange={r.setWChoice} label={t.weight} options={[{ id: "1633", text: t.w1633 }, { id: "2047", text: t.w2047 }, { id: "custom", text: t.wCustom }]} />
      {r.wChoice === "custom" && <Field label={t.customGrams} value={r.custom} setValue={(v) => r.setCustom(sanitizeDecimal(v))} suffix="g" error={e && !e.ok && e.err === "weight" ? t.errWeight : undefined} />}
      <p className="text-[11px] leading-5 text-slate-400">{t.weightHint}</p>
    </fieldset>
  );
}

/* ------------------------------ Fidya ------------------------------ */
export function FidyaCalc({ t, x, money }: { t: CopyMore; x: CopyExtra; money: Money }) {
  const r = useRate(t);
  const [kind, setKind] = useState<FidyaKind>("fasts");
  const [qty, setQty] = useState("");
  const [go, setGo] = useState(false);
  const rate = r.rate();
  const res = go && rate.ok ? calculateFidya({ kind, quantity: parseAmount(qty), ratePerPerson: rate.value }) : null;
  const qErr = go && !res ? undefined : res?.errors.find((e) => e.field === "quantity") ? x.errQty : undefined;
  const qErr2 = go && !parseAmount(qty) ? x.errQty : qErr;
  return (
    <div className="space-y-5" onChange={() => setGo(false)}>
      <Note>{x.fidyaCond}</Note>
      <Choice value={kind} onChange={(v) => { setKind(v); setGo(false); }} label={x.fidyaKind} options={[{ id: "fasts", text: x.fKFasts }, { id: "prayers", text: x.fKPrayers }]} />
      <Field label={kind === "fasts" ? x.fidyaQtyFasts : x.fidyaQtyDays} value={qty} setValue={(v) => { setQty(whole(v)); setGo(false); }} hint={kind === "prayers" ? x.fidyaDaysHint : undefined} error={qErr2} />
      <RateFields t={t} x={x} r={r} show={go} />
      <Actions t={t} onCalc={() => setGo(true)} onReset={() => { setQty(""); r.clear(); setGo(false); }} />
      {res && res.status === "ok" && (
        <ResultBox t={t} title={x.fidyaTitle}
          lines={[`${kind === "fasts" ? x.fidyaUnitsFasts : x.fidyaUnitsPrayers}: ${num(res.units)}`, `${x.rateIs}: ${money(rate.value)}`, `${x.fidyaTotal}: ${money(res.total)}`]}
          how={[
            ...(kind === "prayers" ? [{ label: x.fidyaUnitsPrayers, formula: `${num(parseAmount(qty))} × ${EXTRA_RULES.prayersPerDay} = ${num(res.units)}` }] : []),
            rateHow(x, r.grams, r.price, rate.value, money),
            { label: x.fidyaTotal, formula: `${num(res.units)} × ${money(rate.value)} = ${money(res.total)}` }
          ]}>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Tile label={kind === "fasts" ? x.fidyaUnitsFasts : x.fidyaUnitsPrayers} value={num(res.units)} />
            <Tile label={x.rateIs} value={money(rate.value)} />
          </div>
          <div className="mt-2"><Tile strong label={x.fidyaTotal} value={money(res.total)} /></div>
        </ResultBox>
      )}
    </div>
  );
}

/* ----------------------------- Kaffarah ---------------------------- */
export function KaffaraCalc({ t, x, money }: { t: CopyMore; x: CopyExtra; money: Money }) {
  const r = useRate(t);
  const [kind, setKind] = useState<KaffaraKind>("fast");
  const [count, setCount] = useState("1");
  const [go, setGo] = useState(false);
  const rate = r.rate();
  const res = go && rate.ok ? calculateKaffara({ kind, count: parseAmount(count), ratePerPerson: rate.value }) : null;
  return (
    <div className="space-y-5">
      <Note tone="warn">{x.kOrder}</Note>
      <Choice value={kind} onChange={(v) => { setKind(v); setGo(false); }} label={x.kKind} options={[{ id: "fast", text: x.kFast }, { id: "zihar", text: x.kZihar }, { id: "oath", text: x.kOath }]} />
      <Field label={x.kCount} value={count} setValue={(v) => { setCount(whole(v)); setGo(false); }} error={go && !parseAmount(count) ? x.errQty : undefined} />
      <RateFields t={t} x={x} r={r} show={go} />
      <Actions t={t} onCalc={() => setGo(true)} onReset={() => { setCount("1"); r.clear(); setGo(false); }} />
      {res && res.status === "ok" && (
        <ResultBox t={t} title={x.kaffaraTitle}
          lines={[`${x.poorAll}: ${num(res.poorTotal)}`, `${x.rateIs}: ${money(rate.value)}`, `${x.kTotal}: ${money(res.total)}`]}
          how={[
            { label: x.poorAll, formula: `${num(res.poorPerKaffara)} × ${num(parseAmount(count))} = ${num(res.poorTotal)}` },
            rateHow(x, r.grams, r.price, rate.value, money),
            { label: x.kTotal, formula: `${num(res.poorTotal)} × ${money(rate.value)} = ${money(res.total)}` }
          ]}>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Tile label={x.poorPer} value={num(res.poorPerKaffara)} />
            <Tile label={x.poorAll} value={num(res.poorTotal)} />
            <Tile label={x.rateIs} value={money(rate.value)} />
            <Tile label={x.fastAlt} value={num(res.fastDaysPerKaffara)} />
          </div>
          <div className="mt-2"><Tile strong label={x.kTotal} value={money(res.total)} /></div>
        </ResultBox>
      )}
    </div>
  );
}

/* ------------------------------- Mahr ------------------------------ */
export function MahrCalc({ t, x, money }: { t: CopyMore; x: CopyExtra; money: Money }) {
  const [silver, setSilver] = useState("");
  const [agreed, setAgreed] = useState("");
  const [go, setGo] = useState(false);
  const res = go ? calculateMahr({ silverPricePerGram: parseAmount(silver), agreedMahr: parseAmount(agreed) }) : null;
  return (
    <div className="space-y-5">
      <Field label={x.silverPrice} value={silver} setValue={(v) => { setSilver(sanitizeDecimal(v)); setGo(false); }} prefix="₹" error={res?.status === "invalid" ? x.errPrice : undefined} />
      <Field label={x.agreedMahr} value={agreed} setValue={(v) => { setAgreed(sanitizeDecimal(v)); setGo(false); }} prefix="₹" />
      <Actions t={t} onCalc={() => setGo(true)} onReset={() => { setSilver(""); setAgreed(""); setGo(false); }} />
      {res && res.status === "ok" && (
        <ResultBox t={t} title={x.mahrTitle}
          lines={[`${x.minMahr}: ${money(res.minValue)} (${num(res.minGrams)} g)`, `${x.fatimi}: ${money(res.fatimiValue)} (${num(res.fatimiGrams)} g)`]}
          how={[
            { label: x.minMahr, formula: `${EXTRA_RULES.minMahrDirham} × ${EXTRA_RULES.dirhamSilverGrams} g = ${num(res.minGrams)} g → × ${money(parseAmount(silver))} = ${money(res.minValue)}` },
            { label: x.fatimi, formula: `${EXTRA_RULES.fatimiMahrDirham} × ${EXTRA_RULES.dirhamSilverGrams} g = ${num(res.fatimiGrams)} g → × ${money(parseAmount(silver))} = ${money(res.fatimiValue)}` }
          ]}>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Tile label={`${x.minMahr} · ${num(res.minGrams)} g ${x.grams}`} value={money(res.minValue)} />
            <Tile strong label={`${x.fatimi} · ${num(res.fatimiGrams)} g ${x.grams}`} value={money(res.fatimiValue)} />
          </div>
          <div className="mt-3 space-y-2">
            {res.agreed === "above_min" && <Note>{x.mahrAbove}</Note>}
            {res.agreed === "below_min" && <Note tone="warn">{x.mahrBelow}</Note>}
            <Note>{x.mahrNote}</Note>
          </div>
        </ResultBox>
      )}
    </div>
  );
}

/* ------------------------------ Qurbani ---------------------------- */
export function QurbaniCalc({ t, x, money }: { t: CopyMore; x: CopyExtra; money: Money }) {
  const [price, setPrice] = useState("");
  const [shares, setShares] = useState("7");
  const [extra, setExtra] = useState("");
  const [go, setGo] = useState(false);
  const res = go ? calculateQurbani({ animalPrice: parseAmount(price), shares: parseAmount(shares), extraCosts: parseAmount(extra) }) : null;
  const e = (f: string) => res?.errors.find((y) => y.field === f);
  return (
    <div className="space-y-5">
      <Field label={x.animalPrice} value={price} setValue={(v) => { setPrice(sanitizeDecimal(v)); setGo(false); }} prefix="₹" error={e("animalPrice") ? x.errPrice : undefined} />
      <Field label={x.shares} value={shares} setValue={(v) => { setShares(whole(v)); setGo(false); }} error={e("shares") ? x.errShares : undefined} />
      <Field label={x.extra} value={extra} setValue={(v) => { setExtra(sanitizeDecimal(v)); setGo(false); }} prefix="₹" />
      <Actions t={t} onCalc={() => setGo(true)} onReset={() => { setPrice(""); setShares("7"); setExtra(""); setGo(false); }} />
      {res && res.status === "ok" && (
        <ResultBox t={t} title={x.qurbaniTitle}
          lines={[`${x.perShare}: ${money(res.perShare)}`]}
          how={[{ label: x.perShare, formula: `(${money(parseAmount(price))} + ${money(parseAmount(extra))}) ÷ ${num(parseAmount(shares))} = ${money(res.perShare)}` }]}>
          <div className="mt-3"><Tile strong label={x.perShare} value={money(res.perShare)} /></div>
          <div className="mt-3"><Note>{x.qurbaniNote}</Note></div>
        </ResultBox>
      )}
    </div>
  );
}

/* ----------------------------- Qaza-e-Umri ------------------------- */
export function QazaCalc({ t, x }: { t: CopyMore; x: CopyExtra }) {
  const [bulugh, setBulugh] = useState("15");
  const [start, setStart] = useState("");
  const [exc, setExc] = useState("");
  const [fasts, setFasts] = useState("");
  const [go, setGo] = useState(false);
  const res = go ? calculateQaza({ bulughAge: parseAmount(bulugh), startAge: parseAmount(start), daysExcusedPerYear: parseAmount(exc), fastsMissedPerYear: parseAmount(fasts) }) : null;
  const e = (f: string) => res?.errors.find((y) => y.field === f);
  const up = (set: (v: string) => void) => (v: string) => { set(sanitizeDecimal(v)); setGo(false); };
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={x.bulugh} value={bulugh} setValue={up(setBulugh)} suffix="yr" />
        <Field label={x.start} value={start} setValue={up(setStart)} suffix="yr" error={e("startAge") ? x.errAge : undefined} />
        <Field label={x.excused} value={exc} setValue={up(setExc)} error={e("daysExcusedPerYear") ? x.errExcused : undefined} />
        <Field label={x.fastsYear} value={fasts} setValue={up(setFasts)} />
      </div>
      <Actions t={t} onCalc={() => setGo(true)} onReset={() => { setBulugh("15"); setStart(""); setExc(""); setFasts(""); setGo(false); }} />
      {res && res.status === "ok" && (
        <ResultBox t={t} title={x.qazaTitle}
          lines={[`${x.qYears}: ${num(res.years)}`, `${x.qDays}: ${num(res.days)}`, `${x.qPrayers}: ${num(res.prayers)}`, ...(res.fasts > 0 ? [`${x.qFasts}: ${num(res.fasts)}`] : [])]}
          how={[
            { label: x.qYears, formula: `${num(parseAmount(start))} − ${num(parseAmount(bulugh))} = ${num(res.years)}` },
            { label: x.qDays, formula: `${num(res.years)} × (354 − ${num(parseAmount(exc))}) = ${num(res.days)}` },
            { label: x.qPrayers, formula: `${num(res.days)} × ${EXTRA_RULES.prayersPerDay} = ${num(res.prayers)}` }
          ]}>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Tile label={x.qYears} value={num(res.years)} />
            <Tile label={x.qDays} value={num(res.days)} />
            <Tile strong label={x.qPrayers} value={num(res.prayers)} />
            <Tile label={x.qEach} value={num(res.perPrayer)} />
            {res.fasts > 0 && <Tile label={x.qFasts} value={num(res.fasts)} />}
          </div>
          <div className="mt-3"><Note>{x.qazaNote}</Note></div>
        </ResultBox>
      )}
    </div>
  );
}
