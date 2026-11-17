"use client";

import { copyAbout } from "../lib/copyAbout";
import { Info, Sparkles, Scale, Coins, Calculator, BookOpen } from "lucide-react";
import { AccountButton } from "./AccountSheet";
import { copyMore } from "../lib/copyMore";
import { AboutDialog } from "./AboutDialog";
import { COPYRIGHT, type HomeCtx } from "./homeCore";
import { LangSwitch } from "./HomeBits";

export function HomeHeader({ c }: { c: HomeCtx }) {
  const { t, lang, setLang, setAboutOpen, setDemoOpen, t2 } = c;
  return (<>
<header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/90 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3 md:px-8">
          <a href="#" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img src="/deeni-hisab-logo.webp" alt="" width={44} height={44} className="h-9 w-9 shrink-0 rounded-full shadow-md ring-1 ring-amber-400/60 sm:h-11 sm:w-11"/>
            <div className="min-w-0"><div className="whitespace-nowrap text-base font-extrabold tracking-tight text-deen sm:text-lg">{t.title}</div><div className="hidden text-[10px] font-semibold uppercase tracking-[.22em] text-slate-400 sm:block">DEENI HISAB</div></div>
          </a>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LangSwitch lang={lang} setLang={setLang} label={t.langLabel} className="hidden rounded-full border border-slate-200 bg-white p-1 sm:flex"/>
            <button type="button" onClick={() => setAboutOpen(true)} aria-label={copyAbout[lang].menu} className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-emerald-900/20 px-3 text-xs font-bold text-deen transition hover:bg-emerald-50 sm:px-4"><Info size={16}/><span className="hidden sm:inline">{copyAbout[lang].menu}</span></button>
            <AccountButton lang={lang}/>
            <button type="button" onClick={() => setDemoOpen(true)} className="h-10 shrink-0 whitespace-nowrap rounded-full border border-red-400 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50 sm:px-4">{t.demo}</button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-3 pb-2 sm:hidden">
          <LangSwitch lang={lang} setLang={setLang} label={t.langLabel} className="grid grid-cols-4 gap-1 rounded-2xl border border-slate-200 bg-white p-1"/>
        </div>
      </header>
<section className="relative overflow-hidden bg-deen text-white">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/10"/><div className="absolute -right-20 bottom-[-8rem] h-96 w-96 rounded-full border border-white/10"/>
        <div className="relative mx-auto max-w-7xl px-4 py-6 text-center sm:py-12 md:px-8 md:py-16">
          <div className="mx-auto mb-5 hidden sm:inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-50"><Sparkles size={14}/> {t.chip}</div>
          <p className="mb-2 font-urdu text-xl text-amber-100 sm:mb-3 md:text-2xl">{t.bismillah}</p>
          <p className="mb-3 font-urdu text-sm text-emerald-100 sm:mb-6">{t.durood}</p>
          <img src="/deeni-hisab-logo.webp" alt="DEENI HISAB | دینی حساب" width={320} height={320} className="mx-auto mb-6 hidden h-60 w-60 rounded-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:block sm:h-72 sm:w-72 md:h-80 md:w-80"/>
          <h1 className={`text-3xl font-bold leading-tight sm:text-4xl md:text-6xl ${lang === "hi" ? "font-hindi" : "font-urdu"}`}>{t.title}</h1>
          <p className="mt-2 text-sm text-emerald-100 sm:mt-4 md:text-base">{t.subtitle}</p>
          <p className="mx-auto mt-3 hidden max-w-2xl text-xs leading-6 text-emerald-100/80 sm:block md:text-sm">{t.intro}</p>
        </div>
      </section>
<details className="mx-auto max-w-7xl px-3 pt-4 sm:hidden print:hidden"><summary className="cursor-pointer rounded-2xl bg-white px-4 py-3.5 text-sm font-extrabold text-deen shadow-soft ring-1 ring-slate-900/5">{t2.howTitle}</summary>
        <ol className="mt-3 grid gap-3">
          {t2.how.map((step, i) => (
            <li key={step} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-900/5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-deen text-sm font-black text-white">{i + 1}</span>
              <span className="text-xs font-semibold leading-6 text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </details>
<section aria-label={t2.howTitle} className="mx-auto hidden max-w-7xl px-4 pt-8 sm:block md:px-8 print:hidden">
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
  </>);
}

export function HomeFooter({ c }: { c: HomeCtx }) {
  const { t, lang, tab, setTab, aboutOpen, setAboutOpen, socials, demoOpen, setDemoOpen } = c;
  return (<>
<footer className="border-t border-emerald-900/10 bg-white px-4 py-7 text-center text-xs text-slate-400">{t.footer}<div className="mt-2 font-bold tracking-[.2em] text-deen">DEENI HISAB</div><p className="mx-auto mt-2 max-w-xl text-[11px] leading-5">{COPYRIGHT[lang]}</p></footer>
{/* Phone app bar: the three main screens, always in thumb reach */}
<nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-900/10 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,81,50,.08)] backdrop-blur-xl md:hidden print:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3">
          {([["mirath", t.mirath, Scale], ["zakat", t.zakat, Coins], ["more", copyMore[lang].tab, Calculator]] as const).map(([id, text, Icon]) => (
            <button key={id} type="button" aria-pressed={tab === id} onClick={() => { setTab(id); window.scrollTo({ top: 0, behavior: "auto" }); }} className={`relative flex min-w-0 flex-col items-center gap-0.5 px-1 pb-2 pt-2.5 text-[11px] font-extrabold transition active:scale-95 ${tab === id ? "text-deen" : "text-slate-400"}`}>
              {tab === id && <span aria-hidden className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-deen"/>}
              <span className={`grid h-7 w-12 place-items-center rounded-full transition ${tab === id ? "bg-emerald-50" : ""}`}><Icon size={20}/></span>
              <span className="w-full truncate text-center">{text}</span>
            </button>
          ))}
        </div>
      </nav>
<AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} lang={lang} appName={t.title} closeLabel={t.closeBtn} socials={socials}/>
{demoOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 print:hidden" onClick={() => setDemoOpen(false)}><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}><div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-deen"><BookOpen size={24}/></div><h3 className="text-lg font-extrabold text-deen">{t.demo}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{t.demoText}</p><button type="button" onClick={() => setDemoOpen(false)} className="mt-5 w-full rounded-xl bg-deen py-3 text-sm font-bold text-white">{t.closeBtn}</button></div></div>}
  </>);
}
