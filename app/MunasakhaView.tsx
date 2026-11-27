"use client";

import { Letterhead, ResultSheet } from "./ResultSheet";
import { MUN } from "./MunasakhaText";
import { BK } from "./MunasakhaBook";
import type { Lang, HeirKey } from "../lib/heirs";
import type { MunResult } from "../lib/munasakha";

const pct = (n: bigint, d: bigint) => (Number((n * BigInt(10000)) / d) / 100).toString();
const parseTarka = (raw: string): number => {
  let x = raw.trim().replace(/½/g, " 1/2").replace(/¼/g, " 1/4").replace(/¾/g, " 3/4").replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632)).replace(/,/g, "");
  const m = x.match(/^(\d+(?:\.\d+)?)?\s*(?:(\d+)\s*\/\s*(\d+))?$/);
  if (!m || (!m[1] && !m[2])) return 0;
  const whole = m[1] ? parseFloat(m[1]) : 0; const fr = m[2] && m[3] && Number(m[3]) > 0 ? Number(m[2]) / Number(m[3]) : 0;
  return whole + fr;
};
const fmtAmt = (n: number, unit: string) => `${(Math.round(n * 10000) / 10000).toLocaleString("en-IN", { maximumFractionDigits: 4 })}${unit ? " " + unit : ""}`;
interface Props { res: MunResult; lang: Lang; nameOf: (id: string) => string; firstName: string; tarka: string; unit: string; remainingForHeirs: number; money: (n: number) => string; nSteps: number }

// The naqsha of the book (Tarazi / Sharh Siraji): one block per batn, then al-mablagh and al-ahya, then the printable result sheet.
export function MunView(props: Props) {
  const { res, lang, nameOf, firstName, tarka, unit, remainingForHeirs, money, nSteps } = props;
  const t = MUN[lang]; const bk = BK[lang]; const steps = { length: nSteps };
  // The book writes, under each heir, his siham, then the product after this masala's multiplier, then after every later multiplier (e.g. 2 / 4 / 16).
  // A person who dies in a later batn keeps only his boxed share in this batn (the book ends his line where he dies); living heirs carry the full multiplier line.
  const diesLater = (k: number, id: string) => !!(res && res.ok && res.steps.some((x) => x.index > k && x.dead === id));
  const boxOf = (st: any, p: { id: string; parts: bigint; asaba: boolean; fard: string | null }): string[] => {
    const rd = st.radd as any;
    if (!p.asaba && p.fard) { const [a, b] = p.fard.split("/"); const n = BigInt(a), d = BigInt(b || "1");
      if (rd) { if (st.per[0] && p.fard && rd.sp !== undefined && st.per.some((q: any) => q.id === p.id && (q.key === "husband" || q.key === "wives"))) return [String(rd.sp), String(rd.A)]; return [String((n * rd.B) / d), String(rd.B)]; }
      return [String(n), String(d)]; }
    return [String(p.parts), String(st.tasheeh)];
  };
  const chainOf = (k: number, parts: bigint): string[] => {
    const st = res && res.ok ? res.steps : []; const out = [String(parts)]; let v = parts;
    if (k > 1 && st[k - 1] && st[k - 1].zarbSecond! !== BigInt(1)) { v = v * st[k - 1].zarbSecond!; out.push(String(v)); }
    for (let j = k; j < st.length; j++) { const z = st[j].zarbFirst!; if (z !== BigInt(1)) { v = v * z; out.push(String(v)); } }
    if (out.length === 1) out.push(String(v));
    return out;
  };

  const sheet = res && res.ok ? (() => {
    const tk = parseTarka(tarka); const showMoney = tk > 0 || remainingForHeirs > 0;
    const total = tk > 0 ? tk : remainingForHeirs; const fmt = (v: number) => (tk > 0 ? fmtAmt(v, unit) : money(v));
    const head = [t.person, t.siham, t.share, t.pct, ...(showMoney ? [t.amount] : [])];
    const rows = res.final.map((f) => [nameOf(f.id), `${f.parts}/${res.mablagh}`, `${f.parts / res.ikhtisar}/${res.reduced}`, `${pct(f.parts, res.mablagh)}%`, ...(showMoney ? [fmt(total * Number(f.parts) / Number(res.mablagh))] : [])]);
    const notes = [t.checked, t.source, ...(res.ikhtisar > BigInt(1) ? [t.ikhtisar(String(res.mablagh), String(res.reduced))] : []), ...(res.noChange ? [t.noChange] : [])];
    return { lang, title: t.finalTitle, meta: [[t.meta1, steps.length ? `${steps.length} · ${t.deathCount}` : "—"] as [string, string]], head, rows, foot: ["Σ", String(res.mablagh), "1", "100%", ...(showMoney ? [fmt(total)] : [])], verdictLabel: t.verdict, verdictValue: res.ikhtisar > BigInt(1) ? `${res.mablagh} → ${res.reduced}` : String(res.mablagh), notes };
  })() : null;

  return <>
    {res && res.ok && <div className="print-area-wrap">
      <div className="print-area">
        <Letterhead lang={lang} className="hidden print:block" />
        {res.steps.map((s) => {
          const relTxt = s.index === 1 ? "" : s.relation === "mubayana" ? bk.rel.mubayana : s.relation === "mumathala" ? bk.rel.mumathala : s.relation === "istiqama" ? bk.rel.istiqama : s.mudakhala ? bk.rel.mudakhala(String(s.g)) : bk.rel.muwafaqa(String(s.g));
          const label = (p: { key: HeirKey; asaba: boolean; fard: string | null; code: string | null }) => p.code === "mother_third_remainder" ? bk.thirdOfRest : p.asaba ? bk.asabaW : bk.frac(p.fard);
          return <div key={s.index} className="mt-3 rounded-2xl border border-slate-300 bg-white p-3 text-xs text-slate-700 print:mt-1 print:break-inside-avoid print:p-1.5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 border-b-2 border-deen pb-1 text-deen">
              <span className="text-sm font-extrabold">{bk.batn(s.index)}: {bk.first} {s.dead ? nameOf(s.dead) : firstName} <span className="font-bold">· {bk.masala} {s.asl}{s.awl ? ` → ${s.awl}` : ""}{String(s.tasheeh) !== String(s.asl) ? ` → ${String(s.tasheeh)}` : ""}</span></span>
              <span className="text-center text-xs font-bold">{s.index > 1 ? `( ${relTxt} )` : ""}</span>
              <span className="text-xs font-bold" dir="ltr" style={{ textAlign: lang === "ur" ? "left" : "right" }}>{s.index > 1 ? <>{nameOf(s.dead!)} {bk.maa} {String(s.mafiyad)}</> : res.steps.length > 1 ? res.steps.map((x) => String(x.mablagh)).filter((v, i, a) => i === 0 || v !== a[i - 1]).join(" → ") : ""}</span>
            </div>
            {s.index > 1 && <div className="mt-1 text-center text-[11px] text-slate-500" dir="ltr">{t.zFirst}: ×{String(s.zarbFirst)} · {t.zSecond}: ×{String(s.zarbSecond)} → {String(s.mablagh)}</div>}
            {s.radd && <div className="mt-2 rounded-lg bg-amber-50 p-2 text-[11px] leading-5 text-amber-900">{bk.radd({ A: String(s.radd.A), sp: String(s.radd.sp), baqi: String(s.radd.baqi), B: String(s.radd.B), Bp: String(s.radd.Bp), rel: bk.raddRel[s.radd.rel], zSp: String(s.radd.zSp), zOt: String(s.radd.zOt), total: String(s.radd.total) })}</div>}
            <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">{s.per.map((p) => <div key={p.id} className="rounded-xl border border-slate-200 bg-emerald-50/50 p-2 text-center">
              <div className="font-extrabold">{nameOf(p.id)}</div>
              <div className="text-[11px] text-slate-500">{label(p)}{p.fard && !p.asaba && p.code !== "mother_third_remainder" ? <span dir="ltr"> ({p.fard})</span> : null}</div>
              {diesLater(s.index, p.id)
                ? <div className="mx-auto mt-1 inline-flex min-w-[40px] flex-col rounded-lg border-2 border-deen px-2 font-extrabold text-deen" dir="ltr">{boxOf(s, p).map((v, i, a) => <span key={i} className={`block text-center ${i < a.length - 1 ? "border-b border-deen" : ""}`}>{v}</span>)}</div>
                : <div className="mx-auto mt-1 inline-flex min-w-[40px] flex-col font-extrabold text-deen" dir="ltr">{chainOf(s.index, p.parts).map((v, i, a) => <span key={i} className={`block text-center ${i < a.length - 1 ? "border-b border-deen/60" : ""}`}>{v}</span>)}</div>}
            </div>)}</div>
          </div>;
        })}
        <div className="mt-3 rounded-2xl border border-slate-300 bg-white p-3 text-center print:mt-1 print:break-inside-avoid">
          <div className="text-base font-extrabold text-deen">{bk.mabalagh} <span dir="ltr">{String(res.mablagh)}</span></div>
          <div className="mt-2 border-b-2 border-deen pb-1 text-sm font-extrabold text-deen">{bk.ahya}</div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">{res.final.map((f) => <div key={f.id} className="min-w-[64px] rounded-xl border border-slate-200 px-2 py-1 text-xs"><div className="font-bold">{nameOf(f.id)}</div><div className="text-base font-extrabold text-deen" dir="ltr">{String(f.parts)}</div></div>)}</div>
          <div className="mt-2 text-[11px] text-slate-500" dir="ltr">{res.final.map((f) => String(f.parts)).join(" + ")} = {String(res.final.reduce((a, f) => a + f.parts, BigInt(0)))} ✓ {bk.milaan}</div>
        </div>
        <div className="mt-3 print:mt-1">{sheet && <ResultSheet d={sheet} />}</div>
      </div>
    </div>}

  </>;
            }
