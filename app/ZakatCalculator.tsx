"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Calculator, Coins, RotateCcw } from "lucide-react";
import type { Lang } from "../lib/heirs";
import { copyMore } from "../lib/copyMore";
import { copyZakat } from "../lib/copyZakat";
import { calculateZakat, ZAKAT_RULES, type NisabBasis, type ZakatResult } from "../lib/zakat";
import { WEIGHT_RULES } from "../lib/weights";
import { buildZakat, emptyForm, pricePerGram, weightToGrams, type BuiltZakat, type GoldPriceUnit, type SilverPriceUnit, type WeightForm, type WeightUnit, type ZakatForm } from "../lib/zakatForm";
import { sanitizeDecimal } from "../lib/numbers";
import { Field, Note, ResultBox, Tile } from "./calcUi";

const STORE = "deeni-hisab-zakat-prices";
const num = (v: number, d = 2) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: d }).format(v);

function Pills<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { id: T; text: string }[]; label: string }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold text-slate-600">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${value === o.id ? "border-deen bg-deen text-white" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-emerald-50"}`}>{o.text}</button>
        ))}
      </div>
    </div>
  );
}

function Section({ no, title, desc, children }: { no: number; title: string; desc: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-emerald-900/10 bg-white p-4 shadow-soft md:p-6">
      <h3 className="flex items-center gap-3 text-lg font-extrabold text-deen"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-amber-400 text-sm">{no}</span>{title}</h3>
      <p className="mt-2 text-xs leading-6 text-slate-500">{desc}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function ZakatCalculator({ lang, money }: { lang: Lang; money: (n: number) => string }) {
  const z = copyZakat[lang];
  const [f, setF] = useState<ZakatForm>(emptyForm);
  const [basis, setBasis] = useState<NisabBasis>("silver");
  const [hawl, setHawl] = useState(false);
  const [run, setRun] = useState(0);
  const [built, setBuilt] = useState<BuiltZakat | null>(null);
  const [res, setRes] = useState<ZakatResult | null>(null);
  const [saved, setSaved] = useState<{ gold: number; silver: number; date: string } | null>(null);

  const set = <K extends keyof ZakatForm>(k: K, v: ZakatForm[K]) => { setF((p) => ({ ...p, [k]: v })); setRes(null); };
  const money$ = (k: keyof ZakatForm) => (v: string) => set(k, sanitizeDecimal(v) as never);
  const setW = (which: "gold" | "silver", patch: Partial<WeightForm>) => set(which, { ...f[which], ...patch });
  const wNum = (which: "gold" | "silver", k: "tola" | "masha" | "ratti" | "gram" | "mg") => (v: string) => setW(which, { [k]: sanitizeDecimal(v) });

  // Prices stay on this phone only (browser storage may be blocked, so every access is guarded).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const s = JSON.parse(raw);
      setF((p) => ({ ...p, goldPrice: s.goldPrice ?? "", goldPriceUnit: s.goldPriceUnit ?? "tola", silverPrice: s.silverPrice ?? "", silverPriceUnit: s.silverPriceUnit ?? "tola" }));
      setSaved({ gold: Number(s.gold) || 0, silver: Number(s.silver) || 0, date: s.date || "" });
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    const gold = pricePerGram(f.goldPriceUnit, f.goldPrice) * WEIGHT_RULES.tolaGrams;
    const silver = pricePerGram(f.silverPriceUnit, f.silverPrice) * WEIGHT_RULES.tolaGrams;
    if (!(gold > 0 || silver > 0)) return;
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    setSaved({ gold, silver, date });
    try { localStorage.setItem(STORE, JSON.stringify({ goldPrice: f.goldPrice, goldPriceUnit: f.goldPriceUnit, silverPrice: f.silverPrice, silverPriceUnit: f.silverPriceUnit, gold, silver, date })); } catch { /* ignore */ }
  }, [f.goldPrice, f.goldPriceUnit, f.silverPrice, f.silverPriceUnit]);

  const calc = () => {
    const b = buildZakat(f, basis, hawl);
    setBuilt(b); setRes(calculateZakat(b.input)); setRun((n) => n + 1);
  };
  const reset = () => { setF((p) => ({ ...emptyForm(), goldPrice: p.goldPrice, goldPriceUnit: p.goldPriceUnit, silverPrice: p.silverPrice, silverPriceUnit: p.silverPriceUnit })); setHawl(false); setRes(null); setBuilt(null); };
  const err = (field: string) => { const e = res?.errors.find((x) => x.field === field); return e ? (e.code === "price_required" ? z.errPrice : z.errNumber) : undefined; };

  const live = (which: "gold" | "silver") => {
    const g = weightToGrams(f[which]);
    if (g <= 0) return null;
    const p = which === "gold" ? pricePerGram(f.goldPriceUnit, f.goldPrice) : pricePerGram(f.silverPriceUnit, f.silverPrice);
    return (
      <div className="grid grid-cols-2 gap-2">
        <Tile label={`${z.equals} (${z.gram})`} value={<span dir="ltr">{num(g, 4)} g</span>} />
        <Tile label={z.value} value={p > 0 ? money(g * p) : "—"} />
        {p <= 0 && <p className="col-span-2 text-[11px] text-slate-400">{z.needPrice}</p>}
      </div>
    );
  };

  const weightBox = (which: "gold" | "silver", label: string) => {
    const w = f[which];
    return (
      <div className="space-y-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-900/5">
        <div className="text-sm font-extrabold text-slate-700">{label}</div>
        <Pills<WeightUnit> label={z.weightUnit} value={w.unit} onChange={(u) => setW(which, { unit: u })} options={[{ id: "tmr", text: z.wTmr }, { id: "g", text: z.wG }, { id: "mg", text: z.wMg }]} />
        {w.unit === "tmr" ? <div className="grid grid-cols-3 gap-3"><Field label={z.tola} value={w.tola} setValue={wNum(which, "tola")} /><Field label={z.masha} value={w.masha} setValue={wNum(which, "masha")} /><Field label={z.ratti} value={w.ratti} setValue={wNum(which, "ratti")} /></div>
          : w.unit === "g" ? <Field label={z.gram} value={w.gram} setValue={wNum(which, "gram")} suffix="g" />
          : <Field label={z.mg} value={w.mg} setValue={wNum(which, "mg")} suffix="mg" />}
        {live(which)}
      </div>
    );
  };

  const statusText = res ? { invalid: z.stInvalid, below_nisab: z.stBelow, hawl_incomplete: z.stHawl, due: z.stDue }[res.status] : "";
  const cm = copyMore[lang];
  const L = (code: string) => z.lines[code] ?? code;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-900/5">
        <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-deen"><Coins size={24} /></div><div><h2 className="text-xl font-extrabold text-deen">{z.title}</h2><p className="text-xs text-slate-400">{z.sub}</p></div></div>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-950">
          <div className="font-extrabold">{z.priceBar}{saved?.date ? ` · ${z.on}: ${saved.date}` : ""}</div>
          {saved && (saved.gold > 0 || saved.silver > 0)
            ? <div className="mt-1 grid grid-cols-2 gap-2 tabular-nums"><div>{z.gold}: <b>{money(saved.gold)}</b> <span className="text-[10px]">{z.perTola}</span><br /><span className="text-[10px]">{money(saved.gold / WEIGHT_RULES.tolaGrams)} {z.perGram}</span></div><div>{z.silver}: <b>{money(saved.silver)}</b> <span className="text-[10px]">{z.perTola}</span><br /><span className="text-[10px]">{money(saved.silver / WEIGHT_RULES.tolaGrams)} {z.perGram}</span></div></div>
            : <p className="mt-1">{z.priceBarEmpty}</p>}
        </div>
      </div>

      <Section no={1} title={z.s1} desc={z.s1d}>
        <Pills<GoldPriceUnit> label={`${z.goldPrice}`} value={f.goldPriceUnit} onChange={(u) => set("goldPriceUnit", u)} options={[{ id: "tola", text: z.uTola }, { id: "g", text: z.uGram }, { id: "g10", text: z.u10g }, { id: "rb", text: z.uRb }]} />
        <Field label={z.goldPrice} value={f.goldPrice} setValue={money$("goldPrice")} prefix="₹" error={err("goldPricePerGram")} />
        <Pills<SilverPriceUnit> label={`${z.silverPrice}`} value={f.silverPriceUnit} onChange={(u) => set("silverPriceUnit", u)} options={[{ id: "tola", text: z.uTola }, { id: "g", text: z.uGram }, { id: "kg", text: z.uKg }, { id: "rb", text: z.uRb }]} />
        <Field label={z.silverPrice} value={f.silverPrice} setValue={money$("silverPrice")} prefix="₹" error={err("silverPricePerGram")} />
        <Pills<NisabBasis> label={z.basis} value={basis} onChange={(b) => { setBasis(b); setRes(null); }} options={[{ id: "silver", text: z.silver }, { id: "gold", text: z.gold }]} />
        <Note>{z.basisNote}</Note>
        <p className="text-[11px] font-bold text-slate-500" dir="ltr">{z.gold}: {num(ZAKAT_RULES.nisabGoldGrams, 3)} g · {z.silver}: {num(ZAKAT_RULES.nisabSilverGrams, 3)} g</p>
      </Section>

      <Section no={2} title={z.s2} desc={z.s2d}>
        {weightBox("gold", z.gold)}
        {weightBox("silver", z.silver)}
        <Note>{z.unitHelp}</Note>
      </Section>

      <Section no={3} title={z.s3} desc={z.s3d}>
        <Field label={z.cashHand} value={f.cashHand} setValue={money$("cashHand")} prefix="₹" />
        <Field label={z.cashBank} value={f.cashBank} setValue={money$("cashBank")} prefix="₹" />
        <Field label={z.investments} value={f.investments} setValue={money$("investments")} prefix="₹" />
        <div className="space-y-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-900/5">
          <div className="text-sm font-extrabold text-slate-700">{z.deferred}</div>
          <Note tone="warn">{z.deferredNote}</Note>
          {([["providentFund", "incPf", z.pf], ["committee", "incCommittee", z.committee], ["loansGiven", "incLoans", z.loansGiven]] as const).map(([k, inc, label]) => (
            <div key={k} className="space-y-2">
              <Field label={label} value={f[k]} setValue={money$(k)} prefix="₹" />
              <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={f[inc]} onChange={(e) => set(inc, e.target.checked as never)} className="h-4 w-4 accent-[#0f5132]" />{z.include}</label>
            </div>
          ))}
        </div>
      </Section>

      <Section no={4} title={z.s4} desc={z.s4d}>
        <Field label={z.rawMaterial} value={f.rawMaterial} setValue={money$("rawMaterial")} prefix="₹" />
        <Field label={z.stock} value={f.stock} setValue={money$("stock")} prefix="₹" />
        <Field label={z.tradePlots} value={f.tradePlots} setValue={money$("tradePlots")} prefix="₹" />
        <Field label={z.partnership} value={f.partnership} setValue={money$("partnership")} prefix="₹" />
      </Section>

      <Section no={5} title={z.s5} desc={z.s5d}>
        <Field label={z.loan} value={f.loan} setValue={money$("loan")} prefix="₹" />
        <Field label={z.installments} value={f.installments} setValue={money$("installments")} prefix="₹" />
        <Field label={z.committeeDue} value={f.committeeDue} setValue={money$("committeeDue")} prefix="₹" />
        <Field label={z.utilities} value={f.utilities} setValue={money$("utilities")} prefix="₹" />
        <Field label={z.dealers} value={f.dealers} setValue={money$("dealers")} prefix="₹" />
        <Field label={z.salaries} value={f.salaries} setValue={money$("salaries")} prefix="₹" />
        <Field label={z.lastZakat} value={f.lastZakat} setValue={money$("lastZakat")} prefix="₹" />
      </Section>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
        <input type="checkbox" checked={hawl} onChange={(e) => { setHawl(e.target.checked); setRes(null); }} className="mt-1.5 h-5 w-5 shrink-0 accent-[#0f5132]" />
        <span>{z.hawl}</span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2 print:hidden">
        <button type="button" onClick={calc} className="flex items-center justify-center gap-2 rounded-2xl bg-deen px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-800"><Calculator size={18} />{z.calc}</button>
        <button type="button" onClick={reset} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-extrabold text-slate-600 hover:bg-slate-50"><RotateCcw size={18} />{z.reset}</button>
      </div>

      {res && built && (res.status === "invalid"
        ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{z.stInvalid}</p>
        : <ResultBox key={run} t={cm} title={z.title}
            lines={[statusText, ...built.assetLines.map((l) => `${L(l.code)}: ${money(l.amount)}`), `${z.rTotal}: ${money(res.totalAssets)}`, `${z.rDebts}: ${money(res.debts)}`, `${z.rNet}: ${money(res.netWealth)}`, `${z.rNisab}: ${money(res.nisabValue)}`, `${z.rDue}: ${money(res.zakatDue)}`]}
            how={[
              ...(built.goldGrams > 0 ? [{ label: z.gw, formula: `${num(built.goldGrams, 4)} g × ${money(pricePerGram(f.goldPriceUnit, f.goldPrice))} = ${money(built.goldValue)}` }] : []),
              ...(built.silverGrams > 0 ? [{ label: z.sw, formula: `${num(built.silverGrams, 4)} g × ${money(pricePerGram(f.silverPriceUnit, f.silverPrice))} = ${money(built.silverValue)}` }] : []),
              { label: z.howNet, formula: `${money(res.totalAssets)} − ${money(res.debts)} = ${money(res.netWealth)}` },
              { label: z.howNisab, formula: `${money(res.netWealth)} / ${money(res.nisabValue)}` },
              { label: z.howZakat, formula: `${money(res.netWealth)} × 2.5% = ${money(res.zakatDue)}` }
            ]}>
            <p className="mt-2 text-sm font-bold leading-6 text-emerald-900">{statusText}</p>
            <ul className="mt-3 space-y-1.5 text-xs text-emerald-900">
              {built.assetLines.map((l) => <li key={l.code} className="flex justify-between gap-3"><span>{L(l.code)}</span><span className="font-bold tabular-nums">{money(l.amount)}</span></li>)}
              <li className="flex justify-between gap-3 border-t border-emerald-200 pt-1.5"><span>{z.rTotal}</span><span className="font-bold tabular-nums">{money(res.totalAssets)}</span></li>
              {built.liabilityLines.map((l) => <li key={l.code} className="flex justify-between gap-3 text-slate-600"><span>− {L(l.code)}</span><span className="tabular-nums">{money(l.amount)}</span></li>)}
              <li className="flex justify-between gap-3"><span>{z.rNet}</span><span className="font-bold tabular-nums">{money(res.netWealth)}</span></li>
              <li className="flex justify-between gap-3"><span>{z.rNisab} ({basis === "gold" ? z.gold : z.silver})</span><span className="font-bold tabular-nums">{money(res.nisabValue)}</span></li>
            </ul>
            <div className="mt-4 text-xs font-bold text-emerald-800">{z.rDue}</div>
            <div className="mt-1 text-3xl font-black text-deen">{money(res.zakatDue)}</div>
            {built.excluded.length > 0 && <div className="mt-3 rounded-xl bg-amber-50 p-3 text-[11px] leading-5 text-amber-950"><b>{z.excludedTitle}</b>: {built.excluded.map((l) => `${L(l.code)} ${money(l.amount)}`).join(" · ")}</div>}
          </ResultBox>)}
    </div>
  );
}

