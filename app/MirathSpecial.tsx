"use client";

import { useState } from "react";
import { Baby, ChevronDown, ChevronUp } from "lucide-react";
import { HEIR_DEFS, type HeirKey, type Lang } from "../lib/heirs";
import { fracText, type Counts, type Gender } from "../lib/mirath";
import { solveSpecial, type HamalHold, type KhunthaMethod, type SpecialKind, type SpecialResult, type SpecialRole } from "../lib/mirathSpecial";
import { solveBoth, type BothResult } from "../lib/mirathBoth";
import { copySpecial } from "../lib/copySpecial";
import { Choice, Field, Note } from "./calcUi";

type Kind = SpecialKind | "both";
const B: Record<Lang, { mode: string; roleK: string; roleH: string; note: string; cases: string; cK: string; cH: string; boys: string; girls: string; male: string; female: string; least: string }> = {
  en: { mode: "Khuntha AND unborn child together", roleK: "The khuntha stands as", roleH: "The unborn child stands as", note: "Both doubts are solved together: the problem is worked for all 4 cases (khuntha male or female, child boy or girl). Every living heir gets the LEAST he gets in those 4 cases; the child's share and the rest are held back. Beta: needs a scholar's confirmation.", cases: "The 4 cases", cK: "Khuntha", cH: "Child", boys: "boy", girls: "girl", male: "male", female: "female", least: "Least (given now)" },
  roman: { mode: "Khunsa AUR hamal dono saath", roleK: "Khunsa kis jagah hai", roleH: "Hamal (pet ka bachcha) kis jagah hai", note: "Dono shak ek saath hal hote hain: masla 4 suraton mein nikala jaata hai (khunsa mard/aurat, bachcha ladka/ladki). Har zinda waris ko in 4 suraton mein sab se KAM hissa diya jaata hai; bachche ka hissa aur baaqi mauqoof rehta hai. Aazmaishi: kisi Aalim se tasdeeq zaroori.", cases: "Chaaron suratein", cK: "Khunsa", cH: "Bachcha", boys: "ladka", girls: "ladki", male: "mard", female: "aurat", least: "Sab se kam (abhi milega)" },
  ur: { mode: "خنثیٰ اور حمل دونوں ساتھ", roleK: "خنثیٰ کس جگہ ہے", roleH: "حمل (پیٹ کا بچہ) کس جگہ ہے", note: "دونوں شک ایک ساتھ حل ہوتے ہیں: مسئلہ چار صورتوں میں نکالا جاتا ہے (خنثیٰ مرد/عورت، بچہ لڑکا/لڑکی)۔ ہر زندہ وارث کو ان چار صورتوں میں سب سے کم حصہ دیا جاتا ہے؛ بچے کا حصہ اور باقی موقوف رہتا ہے۔ آزمائشی: کسی عالم سے تصدیق ضروری۔", cases: "چاروں صورتیں", cK: "خنثیٰ", cH: "بچہ", boys: "لڑکا", girls: "لڑکی", male: "مرد", female: "عورت", least: "سب سے کم (ابھی ملے گا)" },
  hi: { mode: "खुन्सा और हम्ल दोनों साथ", roleK: "खुन्सा किस जगह है", roleH: "हम्ल (पेट का बच्चा) किस जगह है", note: "दोनों शक एक साथ हल होते हैं: मसला 4 सूरतों में निकाला जाता है (खुन्सा मर्द/औरत, बच्चा लड़का/लड़की)। हर ज़िंदा वारिस को इन 4 सूरतों में सबसे कम हिस्सा दिया जाता है; बच्चे का हिस्सा और बाक़ी मौक़ूफ़ रहता है। आज़माइशी: किसी आलिम से तस्दीक़ ज़रूरी।", cases: "चारों सूरतें", cK: "खुन्सा", cH: "बच्चा", boys: "लड़का", girls: "लड़की", male: "मर्द", female: "औरत", least: "सबसे कम (अभी मिलेगा)" }
};
const num = (v: string) => { const n = parseFloat(v.replace(/,/g, "")); return Number.isFinite(n) && n >= 0 ? n : 0; };

export function MirathSpecial({ lang, gender, heirs, money, distributable }: { lang: Lang; gender: Gender; heirs: Record<HeirKey, number>; money: (n: number) => string; distributable: number }) {
  const t = copySpecial[lang];
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("khuntha");
  const [role2, setRole2] = useState<SpecialRole>("child");
  const [resB, setResB] = useState<BothResult | null>(null);
  const b = B[lang];
  const [role, setRole] = useState<SpecialRole>("child");
  const [method, setMethod] = useState<KhunthaMethod>("least");
  const [hold, setHold] = useState<"1" | "4">("1");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("");
  const [res, setRes] = useState<SpecialResult | null>(null);

  const label = (k: HeirKey) => HEIR_DEFS.find((d) => d.key === k)?.label[lang] ?? k;
  const calc = () => {
    if (kind === "both") { setRes(null); setResB(solveBoth(gender, heirs as Counts, role, role2, Number(hold) as HamalHold)); return; }
    setResB(null);
    setRes(solveSpecial(gender, heirs as Counts, { kind, role, khunthaMethod: method, hamalHold: Number(hold) as HamalHold }));
  };
  const land = num(area);
  const fmt = (n: number) => (Math.round(n * 10000) / 10000).toLocaleString("en-IN");

  return (
    <section className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4 print:hidden">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 text-start">
        <span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-deen"><Baby size={20} /></span><span><span className="block text-base font-extrabold text-deen">{t.title}</span><span className="block text-xs text-slate-500">{t.sub}</span></span></span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="mt-4 space-y-4">
        <Note tone="warn">{t.beta}</Note>
        <Choice label={t.mode} value={kind} onChange={(v) => { setKind(v); setRes(null); setResB(null); }} options={[{ id: "khuntha" as Kind, text: t.modeKhuntha }, { id: "hamal" as Kind, text: t.modeHamal }, { id: "both" as Kind, text: b.mode }]} />
        <Choice label={kind === "both" ? b.roleK : t.role} value={role} onChange={(v) => { setRole(v); setRes(null); setResB(null); }} options={[{ id: "child", text: t.roleChild }, { id: "grandchild", text: t.roleGrandchild }, { id: "fullSibling", text: t.roleFull }, { id: "consanguineSibling", text: t.roleCons }, { id: "uterineSibling", text: t.roleUterine }]} />
        {kind === "both" && <Choice label={b.roleH} value={role2} onChange={(v) => { setRole2(v); setResB(null); }} options={[{ id: "child", text: t.roleChild }, { id: "grandchild", text: t.roleGrandchild }, { id: "fullSibling", text: t.roleFull }, { id: "consanguineSibling", text: t.roleCons }, { id: "uterineSibling", text: t.roleUterine }]} />}
        {kind === "both" ? <Choice label={t.hold} value={hold} onChange={(v) => { setHold(v); setResB(null); }} options={[{ id: "1", text: t.h1 }, { id: "4", text: t.h4 }]} />
          : kind === "khuntha"
          ? <Choice label={t.method} value={method} onChange={(v) => { setMethod(v); setRes(null); }} options={[{ id: "least", text: t.mLeast }, { id: "average", text: t.mAvg }]} />
          : <Choice label={t.hold} value={hold} onChange={(v) => { setHold(v); setRes(null); }} options={[{ id: "1", text: t.h1 }, { id: "4", text: t.h4 }]} />}
        <Note>{kind === "both" ? b.note : kind === "khuntha" ? t.khunthaNote : t.hamalNote}</Note>
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={calc} className="rounded-2xl bg-deen px-5 py-4 text-sm font-extrabold text-white shadow">{t.calc}</button>
          <button type="button" onClick={() => { setRes(null); setResB(null); }} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-extrabold text-slate-600">{t.reset}</button>
        </div>

        {kind === "both" && resB && (resB.status !== "ok" ? <Note tone="warn">{resB.status === "invalid" ? t.invalid : t.unsupported}</Note> : <div className="space-y-3">
          <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-900/5">
            <table className="w-full min-w-[640px] text-start text-xs">
              <thead><tr className="bg-emerald-50 text-slate-600"><th className="p-2 text-start">{t.heir}</th>{resB.caseLabels.map((c, i) => <th key={i} className="p-2">{b.cK} {c[0] === "m" ? b.male : b.female} · {b.cH} {c[1] === "m" ? b.boys : b.girls}</th>)}<th className="p-2">{b.least}</th><th className="p-2">{t.parts}</th><th className="p-2">{t.amount}</th></tr></thead>
              <tbody>
                {resB.rows.map((r, i) => {
                  const held = r.who === "hamal";
                  const name = r.who === "khuntha" ? t.khunthaWord : r.who === "hamal" ? `${t.hamalWord}${r.count > 1 ? ` ×${r.count}` : ""}` : `${label(r.key)}${r.count > 1 ? ` ×${r.count}` : ""}`;
                  return <tr key={i} className="border-t border-slate-100 text-center">
                    <td className="p-2 text-start font-bold">{name}</td>
                    {r.cases.map((c, j) => <td key={j} className="p-2 tabular-nums">{fracText(c)}</td>)}
                    <td className="p-2 font-extrabold tabular-nums text-deen">{held ? t.heldWord : fracText(r.given)}</td>
                    <td className="p-2 tabular-nums">{held ? "—" : `${r.parts}/${resB.total}`}</td>
                    <td className="p-2 tabular-nums">{held ? "—" : money(distributable * (r.given.n / r.given.d))}</td>
                  </tr>;
                })}
                {resB.withheld.n > 0 && <tr className="border-t border-amber-200 bg-amber-50 text-center font-bold">
                  <td className="p-2 text-start">{t.withheld}</td><td className="p-2" colSpan={4}>—</td>
                  <td className="p-2 tabular-nums">{fracText(resB.withheld)}</td><td className="p-2 tabular-nums">{resB.withheldParts}/{resB.total}</td><td className="p-2 tabular-nums">{money(distributable * (resB.withheld.n / resB.withheld.d))}</td>
                </tr>}
              </tbody>
            </table>
          </div>
          <Note tone="warn">{t.asNote}</Note>
        </div>)}

        {res && (res.status !== "ok" ? <Note tone="warn">{res.status === "invalid" ? t.invalid : t.unsupported}</Note> : <div className="space-y-3">
          <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-900/5">
            <table className="w-full min-w-[520px] text-start text-xs">
              <thead><tr className="bg-emerald-50 text-slate-600"><th className="p-2 text-start">{t.heir}</th><th className="p-2">{t.ifMale}</th><th className="p-2">{t.ifFemale}</th><th className="p-2">{t.share}</th><th className="p-2">{t.parts}</th><th className="p-2">{t.amount}</th></tr></thead>
              <tbody>
                {res.rows.map((r, i) => {
                  const special = r.isSpecial;
                  const name = special ? (kind === "khuntha" ? t.khunthaWord : t.hamalWord) : `${label(r.key)}${r.count > 1 ? ` ×${r.count}` : ""}`;
                  const held = special && kind === "hamal";
                  return <tr key={i} className="border-t border-slate-100 text-center">
                    <td className="p-2 text-start font-bold">{name}</td>
                    <td className="p-2 tabular-nums">{fracText(r.ifMale)}</td>
                    <td className="p-2 tabular-nums">{fracText(r.ifFemale)}</td>
                    <td className="p-2 font-extrabold tabular-nums text-deen">{held ? t.heldWord : fracText(r.given)}</td>
                    <td className="p-2 tabular-nums">{held ? "—" : `${r.parts}/${res.total}`}</td>
                    <td className="p-2 tabular-nums">{held ? "—" : money(distributable * (r.given.n / r.given.d))}</td>
                  </tr>;
                })}
                {res.withheld.n > 0 && <tr className="border-t border-amber-200 bg-amber-50 text-center font-bold">
                  <td className="p-2 text-start">{t.withheld}</td><td className="p-2">—</td><td className="p-2">—</td>
                  <td className="p-2 tabular-nums">{fracText(res.withheld)}</td><td className="p-2 tabular-nums">{res.withheldParts}/{res.total}</td><td className="p-2 tabular-nums">{money(distributable * (res.withheld.n / res.withheld.d))}</td>
                </tr>}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 rounded-2xl bg-white p-3 ring-1 ring-slate-900/5">
            <h4 className="text-sm font-extrabold text-deen">{t.landTitle}</h4>
            <div className="grid gap-3 sm:grid-cols-2"><Field label={t.landArea} value={area} setValue={setArea} /><label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">{t.landUnit}</span><input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder={t.landUnitHint} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-sm font-semibold outline-none focus:border-emerald-700" /></label></div>
            {land > 0 && <ul className="space-y-1 text-xs">
              {res.rows.filter((r) => !(r.isSpecial && kind === "hamal")).map((r, i) => <li key={i} className="flex justify-between gap-3"><span>{r.isSpecial ? (kind === "khuntha" ? t.khunthaWord : t.hamalWord) : label(r.key)}</span><span className="font-bold tabular-nums">{fmt(land * (r.given.n / r.given.d))} {unit}</span></li>)}
              {res.withheld.n > 0 && <li className="flex justify-between gap-3 border-t border-amber-200 pt-1 font-bold"><span>{t.withheld}</span><span className="tabular-nums">{fmt(land * (res.withheld.n / res.withheld.d))} {unit}</span></li>}
            </ul>}
            <p className="text-[11px] text-slate-400">{t.landNote}</p>
          </div>
          <Note tone="warn">{t.asNote}</Note>
        </div>)}
      </div>}
    </section>
  );
      }
