"use client";

import "./mobile.css";
import { useEffect } from "react";
import { Target, CheckCircle2, ShieldCheck, Scale, Coins, Calculator, Download } from "lucide-react";
import { copyMore } from "../lib/copyMore";
import { ZakatWizard } from "./ZakatWizard";
import { MoreCalculators } from "./MoreCalculators";
import { ZAKAT_RULES } from "../lib/zakat";
import { PrintHead, HowBlock, ShareRow } from "./calcUi";
import { copyHow } from "../lib/copyHow";
import { useHome } from "./homeCore";
import { HomeHeader, HomeFooter } from "./HomeFrame";
import { MirathResultScreen, MirathForm } from "./MirathTab";
import { Field } from "./HomeBits";
import { useBackNav } from "./useBackNav";
import { tabNotes } from "../lib/tabNotes";
import { setNumLang } from "../lib/numWords";

export default function Home() {
  const c = useHome();
  useBackNav({ tab: c.tab, hasResult: !!c.mirathResult, dialogOpen: c.aboutOpen || c.demoOpen, closeDialog: () => { c.setAboutOpen(false); c.setDemoOpen(false); }, closeResult: () => c.setMirathResult(null), goHome: () => c.setTab("mirath") });
  const { lang, t2, t, tab, setTab, money, mirathResult, nisabBasis, setNisabBasis, setZakatResult, zk, setZ, zError, hawl, setHawl, runZakat, zakatResult, zakatRef, statusText, assetLabel, noteText, printReport } = c;
  useEffect(() => { setNumLang(lang); }, [lang]);
  return (
    <main className={`min-h-screen bg-cream pb-24 text-slate-800 md:pb-0 ${lang === "hi" ? "font-hindi" : ""}`} dir={lang === "ur" ? "rtl" : "ltr"}>
      <HomeHeader c={c}/>

      <div className="mx-auto grid max-w-7xl gap-6 px-3 py-4 sm:px-4 sm:py-8 md:grid-cols-[290px_1fr] md:px-8 md:py-10">
        <aside className="order-2 space-y-5 md:order-1">
          {tab === "mirath" && (
          <div className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 text-deen"><Target size={18}/><span className="text-sm font-extrabold">{t2.missionTitle}</span></div>
            <p className="mt-3 text-xs leading-6 text-slate-600">{t2.missionText}</p>
            <ul className="mt-3 space-y-2">
              {t2.principles.map(p => <li key={p} className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-700"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-deen"/><span>{p}</span></li>)}
            </ul>
          </div>
          )}
          <div className="rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 text-deen"><ShieldCheck size={18}/><span className="text-sm font-extrabold">{t.note}</span></div>
            <p className="mt-3 text-xs leading-6 text-slate-500">{tab === "zakat" || tab === "more" ? tabNotes[tab][lang] : t.noteText}</p>
          </div>
        </aside>

        <section className="order-1 min-w-0 md:order-2">
          <div className="mb-5 hidden rounded-2xl bg-white p-1.5 md:flex shadow-soft ring-1 ring-slate-900/5 print:hidden">
            <button type="button" aria-pressed={tab === "mirath"} onClick={() => setTab("mirath")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold transition ${tab === "mirath" ? "bg-deen text-white shadow-md" : "text-slate-500 hover:bg-emerald-50"}`}><Scale size={18}/>{t.mirath}</button>
            <button type="button" aria-pressed={tab === "zakat"} onClick={() => setTab("zakat")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold transition ${tab === "zakat" ? "bg-deen text-white shadow-md" : "text-slate-500 hover:bg-emerald-50"}`}><Coins size={18}/>{t.zakat}</button>
            <button type="button" aria-pressed={tab === "more"} onClick={() => setTab("more")} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold transition ${tab === "more" ? "bg-deen text-white shadow-md" : "text-slate-500 hover:bg-emerald-50"}`}><Calculator size={18}/>{copyMore[lang].tab}</button>
          </div>

          {tab === "zakat" ? <ZakatWizard lang={lang} money={money}/> : tab === "more" ? <MoreCalculators lang={lang} money={money}/> : tab === "mirath" && mirathResult ? <MirathResultScreen c={c}/> : tab === "mirath" ? <MirathForm c={c}/> : <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-900/5 md:p-7">
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

            {zakatResult && <div ref={zakatRef} role="status" className={`print-area scroll-mt-36 mt-5 rounded-2xl border p-5 ${zakatResult.status === "invalid" ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
              <PrintHead lang={lang} title={t.zakat}/>
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
                <HowBlock lang={lang} lines={[
                  { label: copyHow[lang].zNet, formula: `${money(zakatResult.netWealth)} × 2.5% = ${money(zakatResult.zakatDue)}` },
                  { label: copyHow[lang].zNisab, formula: `${money(zakatResult.netWealth)} / ${money(zakatResult.nisabValue)}` }
                ]}/>
                <ShareRow lang={lang} title={t.zakat} note={copyMore[lang].review} lines={[
                  `${t.zTotalAssets}: ${money(zakatResult.totalAssets)}`, `${t.zDebtsLine}: ${money(zakatResult.debts)}`, `${t.zNet}: ${money(zakatResult.netWealth)}`,
                  `${t.zNisab}: ${money(zakatResult.nisabValue)}`, `${t.result}: ${money(zakatResult.zakatDue)}`
                ]}/>
              </>}
            </div>}
            <button type="button" onClick={printReport} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-deen/20 bg-white px-5 py-3 text-sm font-bold text-deen print:hidden"><Download size={17}/>{t.report}</button>
          </div>}
        </section>
      </div>

      <HomeFooter c={c}/>
    </main>
  );
}
