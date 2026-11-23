"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Coins, RotateCcw } from "lucide-react";
import type { Lang } from "../lib/heirs";
import { copyMore } from "../lib/copyMore";
import { copyZakat } from "../lib/copyZakat";
import { copyZakatHints } from "../lib/copyZakatHints";
import { copyZakatWiz } from "../lib/copyZakatWiz";
import { calculateZakat } from "../lib/zakat";
import { zakatOn } from "../lib/zakatKhums";
import { WEIGHT_RULES } from "../lib/weights";
import { buildZakat, emptyForm, emptyWeight, pricePerGram, weightToGrams, type GoldPriceUnit, type SilverPriceUnit, type WeightForm, type ZakatForm } from "../lib/zakatForm";
import { sanitizeDecimal } from "../lib/numbers";
import { Field, Note, ResultBox, Tile } from "./calcUi";
import { SaveCase } from "./AccountPanel";
import { BookNotes } from "./BookNotes";
import { ResultSheet } from "./ResultSheet";

const STORE = "deeni-hisab-zakat-prices";
const num = (v: number, d = 2) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: d }).format(v);

const INFO: Record<Lang, string> = { roman: "Wazahat dekhein", en: "See details", ur: "وضاحت دیکھیں", hi: "वज़ाहत देखें" };
const POT: Record<Lang, string> = { roman: "Zakat (agar saal poora ho)", en: "Zakat (if the year is complete)", ur: "زکوٰۃ (اگر سال پورا ہو)", hi: "ज़कात (अगर साल पूरा हो)" };
const HEAD: Record<Lang, string[]> = { roman: ["Tafseel", "Raqam"], en: ["Item", "Amount"], ur: ["تفصیل", "رقم"], hi: ["तफ़्सील", "रक़म"] };
const STMT: Record<Lang, string> = { roman: "Zakat ka Natija Patra", en: "Zakat Statement", ur: "زکوٰۃ کا نتیجہ پتر", hi: "ज़कात का नतीजा पत्र" };
const ITEMS: Record<Lang, string> = { roman: "Tafseel", en: "Itemised", ur: "تفصیل", hi: "तफ़्सील" };

function Tip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-600 ring-1 ring-slate-900/5">
      <summary className="cursor-pointer font-extrabold text-deen">{label}</summary>
      <div className="mt-2 space-y-2">{children}</div>
    </details>
  );
}

function Pills<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { id: T; text: string }[]; label: string }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold text-slate-600">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${value === o.id ? "border-deen bg-deen text-white" : "border-slate-200 bg-slate-50 text-slate-600"}`}>{o.text}</button>
        ))}
      </div>
    </div>
  );
}

function Gate({ q, on, set, yes, no }: { q: string; on: boolean; set: (v: boolean) => void; yes: string; no: string }) {
  return (
    <div>
      <p className="text-sm font-bold leading-7 text-slate-700">{q}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {[[true, yes], [false, no]].map(([v, text]) => (
          <button key={String(v)} type="button" aria-pressed={on === v} onClick={() => set(v as boolean)}
            className={`rounded-2xl border px-4 py-4 text-base font-extrabold transition ${on === v ? "border-deen bg-deen text-white" : "border-slate-200 bg-slate-50 text-slate-600"}`}>{text as string}</button>
        ))}
      </div>
    </div>
  );
}

export function ZakatWizard({ lang, money }: { lang: Lang; money: (n: number) => string }) {
  const z = copyZakat[lang];
  const hz = copyZakatHints[lang];
  const hh = hz.h;
  const w = copyZakatWiz[lang];
  const cm = copyMore[lang];
  const [step, setStep] = useState(0);
  const [f, setF] = useState<ZakatForm>(emptyForm);
  const [gate, setGate] = useState<Record<number, boolean>>({});
  const [hawl, setHawl] = useState(false);
  const [khums, setKhums] = useState(true);

  const set = <K extends keyof ZakatForm>(k: K, v: ZakatForm[K]) => setF((p) => ({ ...p, [k]: v }));
  const money$ = (k: keyof ZakatForm) => (v: string) => set(k, sanitizeDecimal(v) as never);
  const setW = (which: "gold" | "silver", patch: Partial<WeightForm>) => set(which, { ...f[which], ...patch });
  const wNum = (which: "gold" | "silver", k: keyof WeightForm) => (v: string) => setW(which, { [k]: sanitizeDecimal(v) });
  const go = (n: number) => { setStep(n); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { /* ignore */ } };

  // Prices stay on this phone only (same storage key as the older Zakat screen).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const s = JSON.parse(raw);
      setF((p) => ({ ...p, goldPrice: s.goldPrice ?? "", goldPriceUnit: s.goldPriceUnit ?? "tola", silverPrice: s.silverPrice ?? "", silverPriceUnit: s.silverPriceUnit ?? "tola" }));
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    const gold = pricePerGram(f.goldPriceUnit, f.goldPrice) * WEIGHT_RULES.tolaGrams;
    const silver = pricePerGram(f.silverPriceUnit, f.silverPrice) * WEIGHT_RULES.tolaGrams;
    if (!(gold > 0 || silver > 0)) return;
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    try { localStorage.setItem(STORE, JSON.stringify({ goldPrice: f.goldPrice, goldPriceUnit: f.goldPriceUnit, silverPrice: f.silverPrice, silverPriceUnit: f.silverPriceUnit, gold, silver, date })); } catch { /* ignore */ }
  }, [f.goldPrice, f.goldPriceUnit, f.silverPrice, f.silverPriceUnit]);

  // Sections that were answered "No" are left out of the sum, whatever was typed before.
  const eff = useMemo<ZakatForm>(() => ({
    ...f,
    ...(gate[2] ? {} : { gold: emptyWeight(), silver: emptyWeight() }),
    ...(gate[3] ? {} : { rawMaterial: "", stock: "", tradePlots: "", partnership: "" }),
    ...(gate[4] ? {} : { providentFund: "", committee: "", loansGiven: "" }),
    ...(gate[5] ? {} : { loan: "", installments: "", committeeDue: "", utilities: "", dealers: "", salaries: "", lastZakat: "" })
  }), [f, gate]);
  const built = useMemo(() => buildZakat(eff, "silver", hawl), [eff, hawl]);
  const res = useMemo(() => calculateZakat(built.input), [built]);
  const k = useMemo(() => zakatOn(res.netWealth, res.nisabValue, khums), [res, khums]);
  const due = res.status === "due" ? k.zakat : 0;
  const amount = res.status !== "invalid" && res.netWealth >= res.nisabValue ? k.zakat : 0;

  const err = (field: string) => { const e = res.errors.find((x) => x.field === field); return e ? (e.code === "price_required" ? z.errPrice : z.errNumber) : undefined; };
  const L = (code: string) => z.lines[code] ?? hz.lines[code] ?? code;
  const statusText = { invalid: z.stInvalid, below_nisab: z.stBelow, hawl_incomplete: z.stHawl, due: z.stDue }[res.status];
  const last = 6;

  const live = (which: "gold" | "silver") => {
    const g = weightToGrams(f[which]);
    if (g <= 0) return null;
    const p = which === "gold" ? pricePerGram(f.goldPriceUnit, f.goldPrice) : pricePerGram(f.silverPriceUnit, f.silverPrice);
    return (
      <div className="grid grid-cols-2 gap-2">
        <Tile label={`${hz.totalWeight} (${z.gram})`} value={<span dir="ltr">{num(g, 4)} g</span>} />
        <Tile label={z.value} value={p > 0 ? money(g * p) : "—"} />
      </div>
    );
  };
  const weightBox = (which: "gold" | "silver", label: string) => {
    const x = f[which];
    return (
      <div className="space-y-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-900/5">
        <div className="text-sm font-extrabold text-slate-700">{label}</div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={z.tola} value={x.tola} setValue={wNum(which, "tola")} />
          <Field label={z.masha} value={x.masha} setValue={wNum(which, "masha")} />
          <Field label={z.ratti} value={x.ratti} setValue={wNum(which, "ratti")} />
          <Field label={hz.bhari} value={x.bhari} setValue={wNum(which, "bhari")} />
          <Field label={z.gram} value={x.gram} setValue={wNum(which, "gram")} suffix="g" />
          <Field label={z.mg} value={x.mg} setValue={wNum(which, "mg")} suffix="mg" />
        </div>
        {live(which)}
      </div>
    );
  };
  const m = (key: keyof ZakatForm, label: string) => <Field key={key} label={label} value={f[key] as string} setValue={money$(key)} prefix="₹" />;
  const hintList = (items: [keyof ZakatForm, string][]) => <Tip label={INFO[lang]}>{items.map(([key, label]) => ((hh as Record<string, string>)[key] ? <p key={key}><b>{label}:</b> {(hh as Record<string, string>)[key]}</p> : null))}</Tip>;
  const gateBox = (n: number) => <Gate q={w.gate[n]} on={!!gate[n]} set={(v) => setGate((p) => ({ ...p, [n]: v }))} yes={w.yes} no={w.no} />;

  const reset = () => { setF((p) => ({ ...emptyForm(), goldPrice: p.goldPrice, goldPriceUnit: p.goldPriceUnit, silverPrice: p.silverPrice, silverPriceUnit: p.silverPriceUnit })); setGate({}); setHawl(false); go(0); };

  const resultLines = [statusText, ...built.assetLines.map((l) => `${L(l.code)}: ${money(l.amount)}`), ...built.liabilityLines.map((l) => `− ${L(l.code)}: ${money(l.amount)}`), `${z.rTotal}: ${money(res.totalAssets)}`, `${z.rNet}: ${money(res.netWealth)}`, `${z.rNisab}: ${money(res.nisabValue)}`, ...(res.status === "due" ? [`${w.base}: ${money(k.base)}`, ...(k.afw > 0 ? [`${w.afw}: ${money(k.afw)}`] : [])] : []), `${res.status === "hawl_incomplete" ? POT[lang] : z.rDue}: ${money(res.status === "hawl_incomplete" ? amount : due)}`];

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-900/5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-deen"><Coins size={22} /></div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold text-deen">{z.title}</h2>
            <p className="text-xs font-bold text-slate-500">{step + 1} {w.of} {last + 1} · {w.steps[step]}</p>
          </div>
        </div>
        <div className="mt-3 flex gap-1" dir="ltr" aria-hidden="true">
          {w.steps.map((_, i) => <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-deen" : "bg-slate-200"}`} />)}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-emerald-50 p-3 text-[11px] font-bold text-emerald-900">
          <div>{w.assets}<div className="text-sm font-black tabular-nums">{money(res.status === "invalid" ? 0 : res.totalAssets)}</div></div>
          <div>{w.debts}<div className="text-sm font-black tabular-nums">{money(res.status === "invalid" ? 0 : res.debts)}</div></div>
          <div>{z.title}<div className="text-sm font-black tabular-nums text-deen">{money(amount)}</div></div>
        </div>
      </div>

      <section className="space-y-4 rounded-3xl border border-emerald-900/10 bg-white p-4 shadow-soft">
        {step === 0 && (<>
          <BookNotes kind="zakat" lang={lang} />
          <h3 className="text-base font-extrabold text-deen">{z.s1}</h3>
          <p className="text-xs leading-6 text-slate-500">{z.s1d}</p>
          <Pills<SilverPriceUnit> label={z.silverPrice} value={f.silverPriceUnit} onChange={(u) => set("silverPriceUnit", u)} options={[{ id: "tola", text: z.uTola }, { id: "g", text: z.uGram }, { id: "kg", text: z.uKg }, { id: "rb", text: hz.uRb }]} />
          <Field label={z.silverPrice} value={f.silverPrice} setValue={money$("silverPrice")} prefix="₹" hint={hh.silverPrice} error={err("silverPricePerGram")} />
          <Pills<GoldPriceUnit> label={z.goldPrice} value={f.goldPriceUnit} onChange={(u) => set("goldPriceUnit", u)} options={[{ id: "tola", text: z.uTola }, { id: "g", text: z.uGram }, { id: "g10", text: z.u10g }, { id: "rb", text: hz.uRb }]} />
          <Field label={z.goldPrice} value={f.goldPrice} setValue={money$("goldPrice")} prefix="₹" hint={hh.goldPrice} error={err("goldPricePerGram")} />
          <Tip label={INFO[lang]}><p>{z.basisNote}</p></Tip>
        </>)}

        {step === 1 && (<>
          <h3 className="text-base font-extrabold text-deen">{z.s3}</h3>
          <p className="text-xs leading-6 text-slate-500">{z.s3d}</p>
          {m("cashHand", z.cashHand)}{m("cashBank", z.cashBank)}{m("investments", z.investments)}{m("prizeBonds", hz.prizeBonds)}
          {hintList([["cashHand", z.cashHand], ["cashBank", z.cashBank], ["investments", z.investments], ["prizeBonds", hz.prizeBonds]])}
        </>)}

        {step === 2 && (<>
          {gateBox(2)}
          {gate[2] && (<>
            {weightBox("gold", z.gold)}
            {weightBox("silver", z.silver)}
            <Tip label={INFO[lang]}><p>{w.goldNote}</p><p>{hz.bhariNote}</p></Tip>
          </>)}
        </>)}

        {step === 3 && (<>
          {gateBox(3)}
          {gate[3] && (<>{m("rawMaterial", z.rawMaterial)}{m("stock", z.stock)}{m("tradePlots", z.tradePlots)}{m("partnership", z.partnership)}{hintList([["rawMaterial", z.rawMaterial], ["stock", z.stock], ["tradePlots", z.tradePlots], ["partnership", z.partnership]])}<Tip label={INFO[lang]}><p>{w.tradeNote}</p></Tip></>)}
        </>)}

        {step === 4 && (<>
          {gateBox(4)}
          {gate[4] && (<>
            <Tip label={INFO[lang]}><p>{w.recvNote}</p><p>{z.deferredNote}</p></Tip>
            {([["providentFund", "incPf", z.pf], ["committee", "incCommittee", z.committee], ["loansGiven", "incLoans", z.loansGiven]] as const).map(([key, inc, label]) => (
              <div key={key} className="space-y-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-900/5">
                {m(key, label)}
                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={f[inc]} onChange={(e) => set(inc, e.target.checked as never)} className="h-5 w-5 accent-[#0f5132]" />{z.include}</label>
              </div>
            ))}
          </>)}
        </>)}

        {step === 5 && (<>
          {gateBox(5)}
          {gate[5] && (<>
            <Tip label={INFO[lang]}><p>{w.debtNote}</p></Tip>
            {m("loan", z.loan)}{m("installments", z.installments)}{m("committeeDue", z.committeeDue)}{m("utilities", z.utilities)}{m("dealers", z.dealers)}{m("salaries", z.salaries)}{m("lastZakat", z.lastZakat)}
          </>)}
        </>)}

        {step === 6 && (<>
          <h3 className="text-base font-extrabold text-deen">{w.hawlHead}</h3>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
            <input type="checkbox" checked={hawl} onChange={(e) => setHawl(e.target.checked)} className="mt-1.5 h-5 w-5 shrink-0 accent-[#0f5132]" />
            <span>{z.hawl}</span>
          </label>
          <details className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-900/5">
            <summary className="cursor-pointer text-sm font-extrabold text-slate-700">{w.khumsTitle}</summary>
            <label className="mt-2 flex cursor-pointer items-start gap-3 text-xs font-bold leading-6 text-slate-700">
              <input type="checkbox" checked={khums} onChange={(e) => setKhums(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#0f5132]" />
              <span>{w.khumsOn}</span>
            </label>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">{w.khumsInfo}</p>
          </details>
          {res.status === "invalid"
            ? <div role="alert" className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800"><p>{w.fillFirst}</p><button type="button" onClick={() => go(0)} className="rounded-xl bg-red-700 px-4 py-2 text-xs font-extrabold text-white">{w.goPrices}</button></div>
            : <ResultBox t={cm} title={z.title} lines={resultLines}
                how={[
                  ...(built.goldGrams > 0 ? [{ label: z.gw, formula: `${num(built.goldGrams, 4)} g × ${money(pricePerGram(f.goldPriceUnit, f.goldPrice))} = ${money(built.goldValue)}` }] : []),
                  ...(built.silverGrams > 0 ? [{ label: z.sw, formula: `${num(built.silverGrams, 4)} g × ${money(pricePerGram(f.silverPriceUnit, f.silverPrice))} = ${money(built.silverValue)}` }] : []),
                  { label: z.howNet, formula: `${money(res.totalAssets)} − ${money(res.debts)} = ${money(res.netWealth)}` },
                  { label: z.howNisab, formula: `${money(res.netWealth)} / ${money(res.nisabValue)}` },
                  { label: z.howZakat, formula: `${money(res.status === "due" ? k.base : res.netWealth)} × 2.5% = ${money(due)}` }
                ]}>
                <ResultSheet d={{
                  lang, title: STMT[lang], head: HEAD[lang],
                  rows: [
                    ...built.assetLines.map((l) => [L(l.code), money(l.amount)]),
                    [<b key="ta">{z.rTotal}</b>, <b key="tav">{money(res.totalAssets)}</b>],
                    ...built.liabilityLines.map((l) => [`− ${L(l.code)}`, money(l.amount)]),
                    [<b key="nw">{z.rNet}</b>, <b key="nwv">{money(res.netWealth)}</b>],
                    [`${z.rNisab} (${z.silver})`, money(res.nisabValue)],
                    ...(amount > 0 ? [[w.base, money(k.base)]] : []),
                    ...(amount > 0 && k.afw > 0 ? [[w.afw, money(k.afw)]] : [])
                  ],
                  verdictLabel: res.status === "hawl_incomplete" ? POT[lang] : z.rDue,
                  verdictValue: money(res.status === "hawl_incomplete" ? amount : due),
                  status: statusText, notes: [cm.review]
                }} />
                <SaveCase lang={lang} kind="zakat" title={z.title} lines={resultLines} />
                {built.excluded.length > 0 && <div className="mt-3 rounded-xl bg-amber-50 p-3 text-[11px] leading-5 text-amber-950"><b>{z.excludedTitle}</b>: {built.excluded.map((l) => `${L(l.code)} ${money(l.amount)}`).join(" · ")}</div>}
              </ResultBox>}
        </>)}

        <div className="flex gap-3 pt-2 print:hidden">
          {step > 0 && <button type="button" onClick={() => go(step - 1)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-extrabold text-slate-600"><ArrowLeft size={18} className="rtl:rotate-180" />{w.back}</button>}
          {step < last
            ? <button type="button" onClick={() => go(step + 1)} className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-deen px-4 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20">{w.next}<ArrowRight size={18} className="rtl:rotate-180" /></button>
            : <button type="button" onClick={reset} className="flex flex-[2] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-extrabold text-slate-600"><RotateCcw size={18} />{w.again}</button>}
        </div>
      </section>
    </div>
  );
}
