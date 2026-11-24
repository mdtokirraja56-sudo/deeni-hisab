"use client";

import { useEffect } from "react";
import { GraduationCap, ShieldCheck, User, X } from "lucide-react";
import { copyAbout } from "../lib/copyAbout";
import type { Lang } from "../lib/heirs";

type IconType = typeof User;

interface Props {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  appName: string;
  closeLabel: string;
  socials: { label: string; url: string; Icon: IconType }[];
}

function Row({ Icon, label, value, big }: { Icon: IconType; label: string; value: string; big: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-deen"><Icon size={19} /></span>
      <div className="min-w-0">
        <div className={big ? "text-base font-bold text-slate-400" : "text-[11px] font-bold uppercase tracking-wider text-slate-400"}>{label}</div>
        <div className={`mt-1 font-extrabold text-slate-800 ${big ? "text-xl leading-10" : "text-base leading-7"}`}>{value}</div>
      </div>
    </div>
  );
}

export function AboutDialog({ open, onClose, lang, appName, closeLabel, socials }: Props) {
  const a = copyAbout[lang];
  const rtl = lang === "ur";
  const big = lang === "ur"; // Nastaliq has a small x-height, so the text is set larger
  const face = lang === "ur" ? "font-urdu" : lang === "hi" ? "font-hindi" : "";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/60 sm:place-items-center sm:p-4 print:hidden" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={a.title} dir={rtl ? "rtl" : "ltr"} className={`${face} max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl`} onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-deen px-6 pb-8 pt-6 text-center text-white">
          <button type="button" onClick={onClose} aria-label={a.close || closeLabel} className="absolute end-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><X size={18} /></button>
          <img src="/deeni-hisab-logo.webp" alt={appName} width={128} height={128} className="mx-auto h-32 w-32 rounded-full shadow-lg ring-2 ring-amber-400/70" />
          <h2 className="mt-4 text-2xl font-extrabold">{appName}</h2>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[.22em] text-emerald-100/80">DEENI HISAB</p>
          <p className={`mx-auto mt-3 max-w-xs text-emerald-50 ${big ? "text-base leading-9" : "text-xs leading-6"}`}>{a.tagline}</p>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <section>
            <h3 className={`font-extrabold text-deen ${big ? "text-xl" : "text-sm"}`}>{a.aboutLabel}</h3>
            <p className={`mt-2 whitespace-pre-line text-slate-600 ${big ? "text-lg leading-10" : "text-xs leading-6"}`}>{a.aboutText}</p>
          </section>

          <div className="space-y-3">
            <Row Icon={User} label={a.devLabel} value={a.devName} big={big} />
            <Row Icon={GraduationCap} label={a.affilLabel} value={a.affilValue} big={big} />
          </div>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-900"><ShieldCheck size={16} /><h3 className={`font-extrabold ${big ? "text-lg" : "text-xs"}`}>{a.reviewLabel}</h3></div>
            <p className={`mt-2 text-amber-950 ${big ? "text-lg leading-10" : "text-xs leading-6"}`}>{a.reviewText}</p>
          </section>

          {socials.length > 0 && (
            <section>
              <h3 className={`font-extrabold text-slate-500 ${big ? "text-lg" : "text-xs"}`}>{a.followLabel}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {socials.map(({ label, url, Icon }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-deen transition hover:bg-deen hover:text-white"><Icon size={17} /></a>
                ))}
              </div>
            </section>
          )}

          <button type="button" onClick={onClose} className="w-full rounded-2xl bg-deen py-3 text-sm font-bold text-white transition hover:bg-emerald-800">{a.close || closeLabel}</button>
        </div>
      </div>
    </div>
  );
}
