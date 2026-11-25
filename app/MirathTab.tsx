"use client";

import { ChevronDown, Landmark, CircleHelp, ChevronUp, HeartHandshake, AlertTriangle, Calculator, RotateCcw } from "lucide-react";
import { parseAmount, sanitizeDecimal } from "../lib/numbers";
import { MirathResultView } from "./MirathResult";
import { SaveCase } from "./AccountSheet";
import { fracText } from "../lib/mirath";
import { HEIR_GROUPS, HEIR_DEFS } from "../lib/heirs";
import { MirathSpecial } from "./MirathSpecial";
import { RT, type HomeCtx } from "./homeCore";
import { Field, HeirGroup } from "./HomeBits";
import { LandInputCard, LandShareView } from "./MirathLand";

export function MirathResultScreen({ c }: { c: HomeCtx }) {
  const { lang, t2, mirathResult, setMirathResult, t, money, estateNum, gold, silver, heirTotal, netEstate, bequestCap, bequestCounted, remainingForHeirs, costsNum, bequest, mirathRef, heirLabel, printReport, resetMirath, heirs } = c;
  if (!mirathResult) return null;
  return (<>
<div className="space-y-5">
            <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-900/5">
              <div className="p-3 md:p-7 print:p-0">
                <button type="button" onClick={() => setMirathResult(null)} className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-deen/20 bg-white px-4 py-2 text-sm font-extrabold text-deen transition hover:bg-emerald-50 print:hidden"><ChevronDown size={17} className="rotate-90"/>{RT[lang].back}</button>
                <div ref={mirathRef} className="scroll-mt-[4.5rem]"><MirathResultView result={mirathResult} t2={t2} money={money} distributable={remainingForHeirs} heirLabel={heirLabel} onPrint={printReport} onReset={resetMirath} printLabel={t.report} gold={gold} silver={silver} kafirSon={heirs.kafirSon || 0}/>
                <SaveCase lang={lang} kind="mirath" title={t.mirath} lines={[`${t.estate}: ${money(estateNum)}`, `${t.remaining}: ${money(remainingForHeirs)}`, ...mirathResult.rows.filter(r => r.status === "inherits").map(r => `${heirLabel(r.key)} ×${r.count}: ${fracText(r.share)} (${r.parts}/${mirathResult.tashih}) = ${money(remainingForHeirs * (r.share.n / r.share.d))}`)]}/></div>
                <details className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950 print:hidden"><summary className="cursor-pointer text-sm font-extrabold">{t.sumEstate}</summary>
                  <p className="text-xs">{t.sumEstate}: {money(estateNum)} · {t.gold}: {gold || "0"} · {t.silver}: {silver || "0"} · {heirTotal} {t.sumHeirs}</p>
                  <ul className="mt-3 space-y-1.5 text-xs">
                    <li className="flex justify-between gap-3"><span>{t.netAfterDebts}</span><span className="font-bold tabular-nums">{money(netEstate)}</span></li>
                    <li className="flex justify-between gap-3"><span>{t.bequestCap}</span><span className="font-bold tabular-nums">{money(bequestCap)}</span></li>
                    <li className="flex justify-between gap-3"><span>{t.bequestCounted}</span><span className="font-bold tabular-nums">{money(bequestCounted)}</span></li>
                    <li className="flex justify-between gap-3 border-t border-amber-200 pt-1.5"><span>{t.remaining}</span><span className="font-bold tabular-nums">{money(remainingForHeirs)}</span></li>
                  </ul>
                  {costsNum > estateNum && <p className="mt-2 text-xs font-bold text-red-700">{t.costsExceed}</p>}
                  {parseAmount(bequest) > bequestCap && <p className="mt-2 text-xs font-bold text-red-700">{t.bequestOver}</p>}
                </details>
                <LandShareView lang={lang} result={mirathResult} heirLabel={heirLabel}/>
              </div>
            </div>
          </div>
  </>);
}

export function MirathForm({ c }: { c: HomeCtx }) {
  const { t, estate, setEstate, gold, setGold, silver, setSilver, funeral, setFuneral, debtsEst, setDebtsEst, bequest, setBequest, lang, gender, chooseGender, setShowDeductions, showDeductions, heirTotal, heirs, updateHeir, heirDisabled, blockInfo, t2, heirLabel, openGroups, setOpenGroups, alertMsg, reviewCase, resetMirath, money, remainingForHeirs } = c;
  return (<>
<div className="space-y-5">
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
              <LandInputCard lang={lang}/>
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
              {alertMsg && <div role="alert" className="sticky bottom-20 z-30 mt-4 flex items-start gap-2 md:bottom-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold leading-6 text-red-800 shadow-lg"><AlertTriangle size={18} className="mt-0.5 shrink-0"/><span>{alertMsg}</span></div>}
              <div className="mt-7 grid gap-3 sm:grid-cols-2 print:hidden">
                <button type="button" onClick={reviewCase} className="flex items-center justify-center gap-2 rounded-2xl bg-deen px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"><Calculator size={18}/>{t2.divide}</button>
                <button type="button" onClick={resetMirath} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"><RotateCcw size={18}/>{t2.reset}</button>
              </div>
              <MirathSpecial lang={lang} gender={gender} heirs={heirs} money={money} distributable={remainingForHeirs}/>
            </div>
          </div>
  </>);
}
