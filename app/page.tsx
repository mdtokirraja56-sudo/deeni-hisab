"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Calculator, ChevronDown, ChevronUp, CircleHelp, Download,
  Facebook, HeartHandshake, Instagram, MoonStar, Plus, Minus,
  ShieldCheck, Youtube, MessageCircle, Sparkles, Coins, Scale, Landmark, Target, CheckCircle2, AlertTriangle, RotateCcw
} from "lucide-react";
import { calculateZakat, ZAKAT_RULES, type NisabBasis, type ZakatInput, type ZakatResult } from "../lib/zakat";
import { parseAmount, sanitizeDecimal } from "../lib/numbers";
import { copy } from "../lib/copy";
import { copy2 } from "../lib/copy2";
import { HEIR_DEFS, HEIR_GROUPS, initialHeirs, type HeirDef, type HeirKey, type Lang } from "../lib/heirs";
import { MAX_COUNT, calculateMirath, wouldBeBlocked, type BlockCode, type Counts, type MirathResult } from "../lib/mirath";
import { MirathResultView } from "./MirathResult";

type ZakatField = "cash" | "goldGrams" | "silverGrams" | "goldPricePerGram" | "silverPricePerGram" | "businessStock" | "receivables" | "otherZakatable" | "debtsDueNow";

const initialZakat: Record<ZakatField, string> = {
  cash: "", goldGrams: "", silverGrams: "", goldPricePerGram: "", silverPricePerGram: "",
  businessStock: "", receivables: "", otherZakatable: "", debtsDueNow: ""
};

// Only facts that are certain are limited (4 wives; one husband, father, mother, grandfather). Going past the limit shows an alert.
const heirLimit = (key: string): number => MAX_COUNT[key] ?? 99;

type BlockInfo = { by: HeirKey[]; code: BlockCode } | null;

const LANGS: { id: Lang; label: string }[] = [
  { id: "ur", label: "اردو" },
  { id: "hi", label: "हिन्दी" },
  { id: "roman", label: "Roman" },
  { id: "en", label: "English" }
];
const HTML_LANG: Record<Lang, string> = { ur: "ur", hi: "hi", roman: "ur-Latn", en: "en" };

// Add REAL profile URLs here. Empty ones are not shown. Never add placeholder links.
const SOCIAL_LINKS: { label: string; url: string; Icon: typeof Facebook }[] = [
  { label: "Facebook", url: "", Icon: Facebook },
  { label: "YouTube", url: "", Icon: Youtube },
  { label: "WhatsApp", url: "", Icon: MessageCircle },
  { label: "Instagram", url: "", Icon: Instagram }
];


const isLang = (v: string | null): v is Lang => v === "ur" || v === "hi" || v === "roman" || v === "en";

export default function Home() {
  const [lang, setLang] = useState<Lang>("ur");
  const [tab, setTab] = useState<"mirath" | "zakat">("mirath");
  const [estate, setEstate] = useState("0");
  const [gold, setGold] = useState("0");
  const [silver, setSilver] = useState("0");
  const [funeral, setFuneral] = useState("");
  const [debtsEst, setDebtsEst] = useState("");
  const [bequest, setBequest] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => Object.fromEntries(HEIR_GROUPS.map(g => [g.id, g.defaultOpen])));
  const [gender, setGender] = useState<"male" | "female">("male");
  const [heirs, setHeirs] = useState(initialHeirs);
  const [showDeductions, setShowDeductions] = useState(false);
  const [zk, setZk] = useState(initialZakat);
  const [nisabBasis, setNisabBasis] = useState<NisabBasis>(ZAKAT_RULES.defaultNisabBasis);
  const [hawl, setHawl] = useState(false);
  const [zakatResult, setZakatResult] = useState<ZakatResult | null>(null);
  const [mirathResult, setMirathResult] = useState<MirathResult | null>(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);
  const t = copy[lang];
  const t2 = copy2[lang];
  const heirLabel = (key: HeirKey): string => HEIR_DEFS.find(d => d.key === key)?.label[lang] ?? key;
  // Live "mahjub" status for every heir, from the same engine that makes the result.
  const blockInfo = useMemo(() => {
    const counts = heirs as Counts;
    const out: Partial<Record<HeirKey, BlockInfo>> = {};
    for (const d of HEIR_DEFS) out[d.key as HeirKey] = wouldBeBlocked(gender, counts, d.key as HeirKey);
    return out;
  }, [gender, heirs]);
  const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
  const heirTotal = useMemo(() => Object.values(heirs).reduce((a, b) => a + b, 0), [heirs]);

  // Remember the chosen language and keep <html lang> correct.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("deeni-hisab-lang");
      if (isLang(saved)) setLang(saved);
    } catch { /* storage may be blocked; ignore */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    try { localStorage.setItem("deeni-hisab-lang", lang); } catch { /* ignore */ }
  }, [lang]);

  useEffect(() => {
    if (!alertMsg) return;
    const id = setTimeout(() => setAlertMsg(""), 4500);
    return () => clearTimeout(id);
  }, [alertMsg]);

  const updateHeir = (key: HeirKey, delta: number) => {
    const limit = heirLimit(key);
    if (delta > 0 && heirs[key] >= limit) {
      setAlertMsg(key === "wives" ? t2.alertWives : `${heirLabel(key)}: ${t2.alertSingle}`);
      return;
    }
    setHeirs(prev => ({ ...prev, [key]: Math.max(0, Math.min(limit, prev[key] + delta)) }));
    setMirathResult(null);
  };
  const chooseGender = (g: "male" | "female") => {
    setGender(g);
    // Remove heirs that cannot exist for this deceased gender.
    setHeirs(prev => {
      const next = { ...prev };
      for (const d of HEIR_DEFS) if (d.onlyFor && d.onlyFor !== g) next[d.key as HeirKey] = 0;
      return next;
    });
    setMirathResult(null);
  };
  const heirDisabled = (def: HeirDef) => def.onlyFor !== undefined && def.onlyFor !== gender;
  const reviewCase = () => setMirathResult(calculateMirath(gender, heirs as Counts));
  const resetMirath = () => { setHeirs(initialHeirs); setMirathResult(null); setAlertMsg(""); };

  const printReport = () => window.print();

  const setZ = (field: ZakatField, v: string) => { setZk(prev => ({ ...prev, [field]: sanitizeDecimal(v) })); setZakatResult(null); };
  const runZakat = () => {
    const input: ZakatInput = {
      goldPricePerGram: parseAmount(zk.goldPricePerGram), silverPricePerGram: parseAmount(zk.silverPricePerGram),
      cash: parseAmount(zk.cash), goldGrams: parseAmount(zk.goldGrams), silverGrams: parseAmount(zk.silverGrams),
      businessStock: parseAmount(zk.businessStock), receivables: parseAmount(zk.receivables),
      otherZakatable: parseAmount(zk.otherZakatable), debtsDueNow: parseAmount(zk.debtsDueNow),
      nisabBasis, hawlComplete: hawl
    };
    setZakatResult(calculateZakat(input));
  };
  const zError = (field: ZakatField): string | undefined => {
    const e = zakatResult?.errors.find(x => x.field === field);
    if (!e) return undefined;
    return e.code === "price_required" ? t.errPrice : e.code === "negative" ? t.errNegative : t.errNumber;
  };
  const assetLabel: Record<string, string> = {
    cash: t.zCash, gold: t.zGoldVal, silver: t.zSilverVal, businessStock: t.zStock, receivables: t.zReceivables, otherZakatable: t.zOther
  };
  const statusText: Record<string, string> = {
    invalid: t.statusInvalid, below_nisab: t.statusBelow, hawl_incomplete: t.statusHawl, due: t.statusDue
  };
  const noteText: Record<string, string> = { scholar_review_required: t.scholarNote, debts_exceed_assets: t.debtsExceed };

  const estateNum = parseAmount(estate);
  const costsNum = parseAmount(funeral) + parseAmount(debtsEst);
  const netEstate = Math.max(0, estateNum - costsNum);
  const bequestCap = netEstate / 3;
  const bequestCounted = Math.min(parseAmount(bequest), bequestCap);
  const remainingForHeirs = netEstate - bequestCounted;
  const socials = SOCIAL_LINKS.filter(s => s.url);

  return (
    <main className={`min-h-screen bg-cream text-slate-800 ${lang === "hi" ? "font-hindi" : ""}`} dir={lang === "ur" ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/90 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-deen text-white shadow-lg shadow-emerald-900/20"><MoonStar size={24}/></div>
            <div><div className="text-lg font-extrabold tracking-tight text-deen">{t.title}</div><div className="text-[10px] font-semibold uppercase tracking-[.22em] text-slate-400">DEENI HISAB</div></div>
          </a>
          <div className="flex items-center gap-2">
            <LangSwitch lang={lang} setLang={setLang} label={t.langLabel} className="hidden rounded-full border border-slate-200 bg-white p-1 sm:flex"/>
            <button type="button" onClick={() => setDemoOpen(true)} className="rounded-full border border-red-400 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 sm:px-4">{t.demo}</button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3 sm:hidden">
          <LangSwitch lang={lang} setLang={setLang} label={t.langLabel} className="grid grid-cols-4 gap-1 rounded-2xl border border-slate-200 bg-white p-1"/>
        </div>
      </header>

      <section className="relative overflow-hidden bg-deen text-white">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/10"/><div className="absolute -right-20 bottom-[-8rem] h-96 w-96 rounded-full border border-white/10"/>
        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center md:px-8 md:py-16">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-50"><Sparkles size={14}/> {t.chip}</div>
          <p className="mb-3 font-urdu text-xl text-amber-100 md:text-2xl">{t.bismillah}</p>
          <p className="mb-6 font-urdu text-sm text-emerald-100">{t.durood}</p>
          <h1 className={`text-4xl font-bold leading-tight md:text-6xl ${lang === "hi" ? "font-hindi" : "font-urdu"}`}>{t.title}</h1>
          <p className="mt-4 text-sm text-emerald-100 md:text-base">{t.subtitle}</p>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-emerald-100/80 md:text-sm">{t.intro}</p>
        </div>
      </section>

      <section aria-label={t2.howTitle} className="mx-auto max-w-7xl px-4 pt-8 md:px-8 print:hidden">
        <h2 className="mb-3 text-sm font-extrabold text-deen">{t2.howTitle}</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {t2.how.map((step, i) => (
            <li key={step} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-900/5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-deen text-sm font-black text-white">{i + 1}</span>
              <span className="text-xs font-semibold leading-6 text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[290px_1fr] md:px-8 md:py-10">
        <aside className="space-y-5">
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-900/5">
            <div className="h-20 bg-gradient-to-r from-deen to-emerald-700"/>
            <div className="-mt-11 px-5 pb-5">
              <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-amber-50 text-2xl font-black text-deen shadow-md">TR</div>
              <h2 className="mt-3 text-lg font-extrabold text-deen">{t.ownerName}</h2>
              <p className="text-xs font-semibold text-slate-500">{t.ownerRole}</p>
              <p className="mt-2 text-xs leading-6 text-slate-500">{t.profileText}</p>
              {socials.length > 0 && <div className="mt-4 flex flex-wrap gap-2">
                {socials.map(({ label, url, Icon }) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-deen transition hover:bg-deen hover:text-white"><Icon size={16}/></a>)}
              </div>}
              <p className="mt-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-800">{t.reviewStatus}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 text-deen"><Target size={18}/><span className="text-sm font-extrabold">{t2.missionTitle}</span></div>
            <p className="mt-3 text-xs leading-6 text-slate-600">{t2.missionText}</p>
            <ul className="mt-3 space-y-2">
              {t2.principles.map(p => <li key={p} className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-700"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-deen"/><span>{p}</span></li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 text-deen"><ShieldCheck size={18}/><span className="text-sm font-extrabold">{t.note}</span></div>
            <p className="mt-3 text-xs leading-6 text-slate-500">{t.noteText}</p>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 flex rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-slate-900/5 print:hidden">
            <button type="button" aria-pressed={tab === "mirath"} onClick={() => setTab("mirath")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold transition ${tab === "mirath" ? "bg-deen text-white shadow-md" : "text-slate-500 hover:bg-emerald-50"}`}><Scale size={18}/>{t.mirath}</button>
            <button type="button" aria-pressed={tab === "zakat"} onClick={() => setTab("zakat")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold transition ${tab === "zakat" ? "bg-deen text-white shadow-md" : "text-slate-500 hover:bg-emerald-50"}`}><Coins size={18}/>{t.zakat}</button>
          </div>

          {tab === "mirath" ? <div className="space-y-5">
            <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-900/5 md:p-7">
              <div className="mb-6 flex items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold text-deen">{t.mirath}</h2><p className="mt-1 text-xs text-slate-400">{t.mirathSub}</p></div><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-deen"><Landmark size={22}/></div></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={t.estate} value={estate} setValue={v => setEstate(sanitizeDecimal(v))} prefix="₹"/>
                <Field label={t.gold} value={gold} setValue={v => setGold(sanitizeDecimal(v))} suffix="g"/>
                <Field label={t.silver} value={silver} setValue={v => setSilver(sanitizeDecimal(v))} suffix="g"/>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label={t.funeral} value={funeral} setValue={v => setFuneral(sanitizeDecimal(v))} prefix="₹"/>
                <Field label={t.debtsEst} value={debtsEst} setValue={v => setDebtsEst(sanitizeDecimal(v))} prefix="₹"/>
                <Field label={t.bequest} value={bequest} setValue={v => setBequest(sanitizeDecimal(v))} prefix="₹"/>
              </div>
              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">{t.deceased}</label>
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                  <button type="button" aria-pressed={gender === "male"} onClick={() => chooseGender("male")} className={`rounded-xl py-3 text-sm font-bold ${gender === "male" ? "bg-deen text-white shadow" : "text-slate-500"}`}>{t.male}</button>
                  <button type="button" aria-pressed={gender === "female"} onClick={() => chooseGender("female")} className={`rounded-xl py-3 text-sm font-bold ${gender === "female" ? "bg-deen text-white shadow" : "text-slate-500"}`}>{t.female}</button>
                </div>
              </div>
              <button type="button" onClick={() => setShowDeductions(!showDeductions)} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-start text-sm font-bold text-amber-900"><span className="flex items-center gap-2"><CircleHelp size={17}/>{t.deductions}</span>{showDeductions ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}</button>
              {showDeductions && <p className="mt-2 rounded-xl bg-amber-50/70 p-4 text-xs leading-6 text-amber-900">{t.deductionsText}</p>}
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-900/5 md:p-7">
              <div className="mb-5 flex items-center justify-between"><div><h3 className="text-lg font-extrabold text-deen">{t.heirs}</h3><p className="mt-1 text-xs text-slate-400">{heirTotal} {t.selected}</p></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-deen"><HeartHandshake size={20}/></div></div>
              <div className="space-y-5">
                <p className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs leading-6 text-emerald-900">{t.heirNote}</p>
                {HEIR_GROUPS.map(g => <HeirGroup key={g.id} title={g.title[lang]} defs={HEIR_DEFS.filter(d => d.group === g.id)} lang={lang} heirs={heirs} update={updateHeir} disabled={heirDisabled} blockInfo={blockInfo} blockedWord={t2.blockedWord} blockTexts={t2.blocks} heirLabel={heirLabel} naText={t.notApplicable} decLabel={t.dec} incLabel={t.inc} open={openGroups[g.id]} toggle={() => setOpenGroups(prev => ({ ...prev, [g.id]: !prev[g.id] }))}/>)}
              </div>
              {alertMsg && <div role="alert" className="sticky bottom-3 z-30 mt-4 flex items-start gap-2 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold leading-6 text-red-800 shadow-lg"><AlertTriangle size={18} className="mt-0.5 shrink-0"/><span>{alertMsg}</span></div>}
              <div className="mt-7 grid gap-3 sm:grid-cols-2 print:hidden">
                <button type="button" onClick={reviewCase} className="flex items-center justify-center gap-2 rounded-2xl bg-deen px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"><Calculator size={18}/>{t2.divide}</button>
                <button type="button" onClick={resetMirath} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"><RotateCcw size={18}/>{t2.reset}</button>
              </div>
              {mirathResult && <>
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  <p className="text-xs">{t.sumEstate}: {money(estateNum)} · {t.gold}: {gold || "0"} · {t.silver}: {silver || "0"} · {heirTotal} {t.sumHeirs}</p>
                  <ul className="mt-3 space-y-1.5 text-xs">
                    <li className="flex justify-between gap-3"><span>{t.netAfterDebts}</span><span className="font-bold tabular-nums">{money(netEstate)}</span></li>
                    <li className="flex justify-between gap-3"><span>{t.bequestCap}</span><span className="font-bold tabular-nums">{money(bequestCap)}</span></li>
                    <li className="flex justify-between gap-3"><span>{t.bequestCounted}</span><span className="font-bold tabular-nums">{money(bequestCounted)}</span></li>
                    <li className="flex justify-between gap-3 border-t border-amber-200 pt-1.5"><span>{t.remaining}</span><span className="font-bold tabular-nums">{money(remainingForHeirs)}</span></li>
                  </ul>
                        {costsNum > estateNum && <p className="mt-2 text-xs font-bold text-red-700">{t.costsExceed}</p>}
                  {parseAmount(bequest) > bequestCap && <p className="mt-2 text-xs font-bold text-red-700">{t.bequestOver}</p>}
                </div>
                <MirathResultView result={mirathResult} t2={t2} money={money} distributable={remainingForHeirs} heirLabel={heirLabel} onPrint={printReport} onReset={resetMirath} printLabel={t.report}/>
              </>}
            </div>
          </div> : <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-900/5 md:p-7">
            <div className="mb-6 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-deen"><Coins size={24}/></div><div><h2 className="text-xl font-extrabold text-deen">{t.zakat}</h2><p className="text-xs text-slate-400">{t.zakatSub}</p></div></div>

            <h3 className="mb-3 text-sm font-extrabold text-slate-700">{t.zNisabBasis}</h3>
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
              <button type="button" aria-pressed={nisabBasis === "silver"} onClick={() => { setNisabBasis("silver"); setZakatResult(null); }} className={`rounded-xl py-3 text-sm font-bold ${nisabBasis === "silver" ? "bg-deen text-white shadow" : "text-slate-500"}`}>{t.zSilver}</button>
              <button type="button" aria-pressed={nisabBasis === "gold"} onClick={() => { setNisabBasis("gold"); setZakatResult(null); }} className={`rounded-xl py-3 text-sm font-bold ${nisabBasis === "gold" ? "bg-deen text-white shadow" : "text-slate-500"}`}>{t.zGold}</button>
            </div>

            <h3 className="mb-3 mt-6 border-b border-slate-100 pb-2 text-sm font-extrabold text-slate-700">{t.zAssets}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.zCash} value={zk.cash} setValue={v => setZ("cash", v)} prefix="₹" error={zError("cash")}/>
              <Field label={t.zStock} value={zk.businessStock} setValue={v => setZ("businessStock", v)} prefix="₹" error={zError("businessStock")}/>
              <Field label={t.gold} value={zk.goldGrams} setValue={v => setZ("goldGrams", v)} suffix="g" error={zError("goldGrams")}/>
              <Field label={t.zGoldPrice} value={zk.goldPricePerGram} setValue={v => setZ("goldPricePerGram", v)} prefix="₹" hint={t.zPriceHint} error={zError("goldPricePerGram")}/>
              <Field label={t.silver} value={zk.silverGrams} setValue={v => setZ("silverGrams", v)} suffix="g" error={zError("silverGrams")}/>
              <Field label={t.zSilverPrice} value={zk.silverPricePerGram} setValue={v => setZ("silverPricePerGram", v)} prefix="₹" hint={t.zPriceHint} error={zError("silverPricePerGram")}/>
              <Field label={t.zReceivables} value={zk.receivables} setValue={v => setZ("receivables", v)} prefix="₹" error={zError("receivables")}/>
              <Field label={t.zOther} value={zk.otherZakatable} setValue={v => setZ("otherZakatable", v)} prefix="₹" error={zError("otherZakatable")}/>
            </div>

            <h3 className="mb-3 mt-6 border-b border-slate-100 pb-2 text-sm font-extrabold text-slate-700">{t.zLiabilities}</h3>
            <Field label={t.zDebts} value={zk.debtsDueNow} setValue={v => setZ("debtsDueNow", v)} prefix="₹" error={zError("debtsDueNow")}/>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
              <input type="checkbox" checked={hawl} onChange={e => { setHawl(e.target.checked); setZakatResult(null); }} className="mt-1.5 h-5 w-5 shrink-0 accent-[#0f5132]"/>
              <span>{t.zHawl}</span>
            </label>

            <div className="mt-4 rounded-2xl bg-emerald-50 p-4"><div className="text-xs font-bold text-emerald-900">{t.rate}</div><div className="mt-1 text-2xl font-black text-deen">2.5%</div><p className="mt-1 text-[11px] leading-5 text-emerald-800">{t.rateNote}</p><p className="mt-2 text-[11px] leading-5 text-emerald-800">{t.rulesPending}: {ZAKAT_RULES.nisabSilverGrams} / {ZAKAT_RULES.nisabGoldGrams}</p></div>
            <button type="button" onClick={runZakat} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-deen px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20"><Calculator size={18}/>{t.calculateZakat}</button>

            {zakatResult && <div role="status" className={`mt-5 rounded-2xl border p-5 ${zakatResult.status === "invalid" ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
              <p className={`text-sm font-bold leading-6 ${zakatResult.status === "invalid" ? "text-red-800" : "text-emerald-900"}`}>{statusText[zakatResult.status]}</p>
              {zakatResult.status !== "invalid" && <>
                <ul className="mt-3 space-y-1.5 text-xs text-emerald-900">
                  {zakatResult.assets.filter(a => a.amount > 0).map(a => <li key={a.code} className="flex justify-between gap-3"><span>{assetLabel[a.code]}</span><span className="font-bold tabular-nums">{money(a.amount)}</span></li>)}
                  <li className="flex justify-between gap-3 border-t border-emerald-200 pt-1.5"><span>{t.zTotalAssets}</span><span className="font-bold tabular-nums">{money(zakatResult.totalAssets)}</span></li>
                  <li className="flex justify-between gap-3"><span>{t.zDebtsLine}</span><span className="font-bold tabular-nums">{money(zakatResult.debts)}</span></li>
                  <li className="flex justify-between gap-3"><span>{t.zNet}</span><span className="font-bold tabular-nums">{money(zakatResult.netWealth)}</span></li>
                  <li className="flex justify-between gap-3"><span>{t.zNisab} ({zakatResult.nisabBasis === "gold" ? t.zGold : t.zSilver})</span><span className="font-bold tabular-nums">{money(zakatResult.nisabValue)}</span></li>
                </ul>
                <div className="mt-4 text-xs font-bold text-emerald-800">{t.result}</div>
                <div className="mt-1 text-3xl font-black text-deen">{money(zakatResult.zakatDue)}</div>
                {zakatResult.notes.map(n => <p key={n} className="mt-2 text-[11px] leading-5 text-emerald-800">{noteText[n]}</p>)}
              </>}
            </div>}
            <button type="button" onClick={printReport} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-deen/20 bg-white px-5 py-3 text-sm font-bold text-deen print:hidden"><Download size={17}/>{t.report}</button>
          </div>}
        </section>
      </div>

      <footer className="border-t border-emerald-900/10 bg-white px-4 py-7 text-center text-xs text-slate-400">{t.footer}<div className="mt-2 font-bold tracking-[.2em] text-deen">DEENI HISAB</div></footer>

      {demoOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 print:hidden" onClick={() => setDemoOpen(false)}><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}><div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-deen"><BookOpen size={24}/></div><h3 className="text-lg font-extrabold text-deen">{t.demo}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{t.demoText}</p><button type="button" onClick={() => setDemoOpen(false)} className="mt-5 w-full rounded-xl bg-deen py-3 text-sm font-bold text-white">{t.closeBtn}</button></div></div>}
    </main>
  );
}

function LangSwitch({ lang, setLang, label, className }: { lang: Lang; setLang: (l: Lang) => void; label: string; className: string }) {
  return <div role="group" aria-label={label} className={className}>{LANGS.map(l => <button type="button" key={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${lang === l.id ? "bg-deen text-white" : "text-slate-500 hover:bg-slate-100"}`}>{l.label}</button>)}</div>;
}

function Field({ label, value, setValue, prefix, suffix, error, hint }: { label: string; value: string; setValue: (v: string) => void; prefix?: string; suffix?: string; error?: string; hint?: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">{label}</span><div className={`flex items-center rounded-2xl border bg-slate-50 px-3 transition focus-within:bg-white focus-within:ring-4 ${error ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/10" : "border-slate-200 focus-within:border-emerald-700 focus-within:ring-emerald-700/10"}`}>{prefix && <span className="text-sm font-bold text-slate-400">{prefix}</span>}<input inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} aria-invalid={error ? true : undefined} className="min-w-0 w-full bg-transparent px-2 py-3.5 text-sm font-semibold outline-none" placeholder="0"/>{suffix && <span className="text-xs font-bold text-slate-400">{suffix}</span>}</div>{error ? <span role="alert" className="mt-1 block text-[11px] font-bold text-red-600">{error}</span> : hint ? <span className="mt-1 block text-[11px] text-slate-400">{hint}</span> : null}</label>;
}

function HeirGroup({ title, defs, lang, heirs, update, disabled, blockInfo, blockedWord, blockTexts, heirLabel, naText, decLabel, incLabel, open, toggle }: { title: string; defs: HeirDef[]; lang: Lang; heirs: Record<HeirKey, number>; update: (key: HeirKey, delta: number) => void; disabled: (def: HeirDef) => boolean; blockInfo: Partial<Record<HeirKey, BlockInfo>>; blockedWord: string; blockTexts: Record<BlockCode, string>; heirLabel: (key: HeirKey) => string; naText: string; decLabel: string; incLabel: string; open: boolean; toggle: () => void }) {
  const count = defs.reduce((sum, d) => sum + heirs[d.key as HeirKey], 0);
  return <div>
    <button type="button" onClick={toggle} aria-expanded={open} className="mb-3 flex w-full items-center justify-between border-b border-slate-100 pb-2 text-start text-sm font-extrabold text-slate-700">
      <span className="flex items-center gap-2">{title}{count > 0 && <span className="rounded-full bg-deen px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>}</span>
      {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
    </button>
    {open && <div className="grid gap-3 sm:grid-cols-2">{defs.map(def => {
      const key = def.key as HeirKey; const off = disabled(def); const label = def.label[lang];
      const blk = off ? null : blockInfo[key] ?? null;
      const blockedNow = blk !== null;
      const cannotAdd = off || (blockedNow && heirs[key] === 0);
      return <div key={key} className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 ${off || (blockedNow && heirs[key] === 0) ? "border-slate-100 bg-slate-100/70 opacity-60" : blockedNow ? "border-amber-200 bg-amber-50/70" : "border-slate-100 bg-slate-50/80"}`}>
        <span className="text-sm font-semibold text-slate-700">{label}
          {off && <span className="block text-[10px] font-normal text-slate-400">{naText}</span>}
          {blk && <span className="block text-[10px] font-normal leading-4 text-amber-800">{blockedWord} — {blockTexts[blk.code]}{blk.by.length > 0 ? ` (${blk.by.slice(0, 2).map(heirLabel).join(" / ")})` : ""}</span>}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" disabled={off || heirs[key] <= 0} onClick={() => update(key, -1)} aria-label={`${decLabel}: ${label}`} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-deen hover:text-deen disabled:cursor-not-allowed disabled:opacity-40"><Minus size={14}/></button>
          <span className="w-6 text-center text-sm font-extrabold tabular-nums text-deen">{heirs[key]}</span>
          <button type="button" disabled={cannotAdd} onClick={() => update(key, 1)} aria-label={`${incLabel}: ${label}`} className="grid h-8 w-8 place-items-center rounded-lg bg-deen text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={14}/></button>
        </div>
      </div>;
    })}</div>}
  </div>;
}
