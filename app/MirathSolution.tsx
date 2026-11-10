"use client";

import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { fracText, fracValue, type HeirRow, type MirathResult } from "../lib/mirath";
import type { Copy2 } from "../lib/copy2";
import type { Copy3 } from "../lib/copy3";
import type { HeirKey } from "../lib/heirs";

interface Props {
  result: MirathResult;
  t2: Copy2;
  t3: Copy3;
  money: (n: number) => string;
  distributable: number;
  heirLabel: (key: HeirKey) => string;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
const pct = (v: number) => `${(Math.round(v * 10000) / 100).toString()}%`;

// "1/6" -> {n:1,d:6}
const parseFard = (s: string | undefined): { n: number; d: number } | null => {
  if (!s) return null;
  const [n, d] = s.split("/").map(Number);
  if (!Number.isFinite(n) || !Number.isFinite(d) || d <= 0) return null;
  return { n, d };
};
const ASABA_CODES = new Set(["male_desc_asaba", "asaba_with_male", "father_asaba", "father_sixth_plus_asaba", "asaba_remainder", "sister_asaba_daughter"]);

function Step({ no, title, word, children }: { no: number; title: string; word: string; children: ReactNode }) {
  return (
    <section className="relative rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-deen text-sm font-black text-white">{no}</span>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{word} {no}</div>
          <h4 className="text-sm font-extrabold text-deen">{title}</h4>
        </div>
      </div>
      <div className="space-y-3 text-xs leading-6 text-slate-600">{children}</div>
    </section>
  );
}

function Table({ head, rows, foot }: { head: string[]; rows: ReactNode[][]; foot?: ReactNode[] }) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[320px] border-collapse text-center text-xs">
        <thead>
          <tr className="bg-deen text-white">
            {head.map((h, i) => <th key={i} className="border border-emerald-900/20 px-2 py-2 text-[11px] font-bold first:text-start">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-emerald-50/40" : "bg-white"}>
              {r.map((c, j) => <td key={j} className="border border-slate-200 px-2 py-2 tabular-nums first:text-start first:font-bold first:text-slate-800">{c}</td>)}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot>
            <tr className="bg-amber-50 font-extrabold text-amber-950">
              {foot.map((c, j) => <td key={j} className="border border-amber-200 px-2 py-2 tabular-nums first:text-start">{c}</td>)}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

const L = ({ children }: { children: ReactNode }) => <span dir="ltr" className="inline-block tabular-nums">{children}</span>;

export function MirathSolution({ result, t2, t3, money, distributable, heirLabel }: Props) {
  const inheriting = result.rows.filter((r) => r.status === "inherits");
  const others = result.rows.filter((r) => r.status !== "inherits");
  const hasAmount = distributable > 0;
  const stText = (r: HeirRow) => (r.status === "inherits" ? t3.stInherits : r.status === "blocked" ? t3.stBlocked : t3.stNothing);

  // fixed share of each heir (first reason that has a fard)
  const fardOf = (r: HeirRow) => parseFard(r.reasons.find((x) => x.fard)?.fard);
  const fardRows = inheriting.filter((r) => fardOf(r) !== null);
  const asabaRows = inheriting.filter((r) => r.reasons.some((x) => ASABA_CODES.has(x.code)));

  // step 3: LCM of the denominators
  const denoms = Array.from(new Set(fardRows.map((r) => fardOf(r)!.d))).sort((a, b) => a - b);
  const lcmAll = denoms.reduce((a, d) => lcm(a, d), 1);
  const showLcm = denoms.length > 0 && lcmAll === result.asl;

  // step 4: parts of the base number
  const baseParts = (r: HeirRow) => { const f = fardOf(r); return f ? f.n * (result.asl / f.d) : 0; };
  const fardTotal = fardRows.reduce((s, r) => s + baseParts(r), 0);
  const left = result.asl - fardTotal;

  // step 9: checks
  const sumParts = inheriting.reduce((s, r) => s + r.parts, 0);
  const sumShare = inheriting.reduce((s, r) => s + fracValue(r.share), 0);
  const sumMoney = inheriting.reduce((s, r) => s + fracValue(r.share) * distributable, 0);
  const unassigned = result.notes.includes("remainder_unassigned");
  const checks: { label: string; ok: boolean }[] = [
    { label: t3.chkParts, ok: sumParts === result.tashih || (unassigned && sumParts < result.tashih) },
    { label: t3.chkEach, ok: inheriting.every((r) => r.perHeadParts * r.count === r.parts) },
    { label: t3.chkShares, ok: Math.abs(sumShare - 1) < 1e-9 || unassigned }
  ];
  if (hasAmount) checks.push({ label: t3.chkMoney, ok: Math.abs(sumMoney - distributable) < 0.005 * Math.max(1, inheriting.length) || unassigned });
  const allOk = checks.every((c) => c.ok);

  return (
    <div className="mt-4 space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-deen">{t3.solutionTitle}</h3>
        <p className="mt-1 text-xs leading-6 text-slate-500">{t3.solutionIntro}</p>
      </div>

      {/* 1 */}
      <Step no={1} title={t3.s1Title} word={t3.stepWord}>
        <p>{t3.s1Text}</p>
        <Table
          head={[t3.colHeir, t3.colPersons, t3.colStatus]}
          rows={[...inheriting, ...others].map((r) => [heirLabel(r.key), r.count, <span key="s" className={r.status === "inherits" ? "font-bold text-deen" : "text-slate-400"}>{stText(r)}</span>])}
        />
      </Step>

      {/* 2 */}
      <Step no={2} title={t3.s2Title} word={t3.stepWord}>
        <p>{t3.s2Text}</p>
        {fardRows.length === 0 ? <p className="font-semibold text-slate-700">{t3.s2None}</p> : (
          <ul className="space-y-2">
            {fardRows.map((r) => (
              <li key={r.key} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-slate-800">{heirLabel(r.key)}</strong>
                  <L><span className="text-base font-black text-deen">{fracText({ n: fardOf(r)!.n, d: fardOf(r)!.d })}</span></L>
                </div>
                {r.reasons.filter((x) => x.fard).slice(0, 1).map((x, i) => <p key={i} className="mt-1 text-[11px] text-slate-500">{t2.reasons[x.code]}</p>)}
              </li>
            ))}
          </ul>
        )}
      </Step>

      {/* 3 */}
      <Step no={3} title={t3.s3Title} word={t3.stepWord}>
        <p>{t3.s3Text}</p>
        <p className="rounded-xl bg-emerald-50 p-3 text-center text-base font-black text-deen"><L>{showLcm ? t3.s3Lcm(denoms.join(", "), result.asl) : t3.s3Only(result.asl)}</L></p>
      </Step>

      {/* 4 */}
      <Step no={4} title={t3.s4Title} word={t3.stepWord}>
        <p>{t3.s4Text}</p>
        <Table
          head={[t3.colHeir, t3.colFard, t3.colBase]}
          rows={[
            ...fardRows.map((r) => [heirLabel(r.key), <L key="f">{fracText({ n: fardOf(r)!.n, d: fardOf(r)!.d })}</L>, baseParts(r)]),
            ...(left > 0 && asabaRows.length > 0 ? asabaRows.filter((r) => !fardOf(r)).map((r) => [heirLabel(r.key), t3.s4Asaba, left]) : [])
          ]}
          foot={[t3.s4Total, "", fardTotal]}
        />
        {left > 0 && <p className="font-semibold text-slate-700">{t3.s4Left}: <L>{left}</L></p>}
      </Step>

      {/* 5 */}
      <Step no={5} title={t3.s5Title} word={t3.stepWord}>
        {asabaRows.length === 0 ? <p className="font-semibold text-slate-700">{t3.s5None}</p> : (
          <>
            <p>{t3.s5Text}</p>
            <ul className="space-y-2">
              {asabaRows.map((r) => (
                <li key={r.key} className="rounded-xl bg-slate-50 p-3">
                  <strong className="text-slate-800">{heirLabel(r.key)}</strong>
                  {r.reasons.filter((x) => ASABA_CODES.has(x.code)).map((x, i) => <p key={i} className="mt-1 text-[11px] text-slate-500">{t2.reasons[x.code]}</p>)}
                </li>
              ))}
            </ul>
          </>
        )}
      </Step>

      {/* 6 */}
      <Step no={6} title={t3.s6Title} word={t3.stepWord}>
        {result.awl !== null ? <p className="rounded-xl bg-amber-50 p-3 font-semibold text-amber-950">{t3.s6Awl(result.asl, result.awl)}</p>
          : result.raddBase !== null ? <p className="rounded-xl bg-amber-50 p-3 font-semibold text-amber-950">{t3.s6Radd(result.raddBase)}</p>
          : <p className="font-semibold text-slate-700">{t3.s6None}</p>}
      </Step>

      {/* 7 */}
      <Step no={7} title={t3.s7Title} word={t3.stepWord}>
        {result.mazrub > 1
          ? <p className="rounded-xl bg-emerald-50 p-3 font-semibold text-emerald-950">{t3.s7Text(result.baseNumber, result.mazrub, result.tashih)}</p>
          : <p className="font-semibold text-slate-700">{t3.s7None(result.tashih)}</p>}
      </Step>

      {/* 8 */}
      <Step no={8} title={t3.s8Title} word={t3.stepWord}>
        <p>{t3.s8Text(result.tashih)}</p>
        <Table
          head={[t3.colHeir, t3.colPersons, t3.colShare, t3.colFinal, t3.colEach, t3.colPercent, ...(hasAmount ? [t3.colAmount] : [])]}
          rows={inheriting.map((r) => [
            heirLabel(r.key), r.count, <L key="s">{fracText(r.share)}</L>, r.parts, r.perHeadParts, pct(fracValue(r.share)),
            ...(hasAmount ? [money(fracValue(r.share) * distributable)] : [])
          ])}
          foot={[t3.total, inheriting.reduce((s, r) => s + r.count, 0), "", sumParts, "", pct(sumShare), ...(hasAmount ? [money(sumMoney)] : [])]}
        />
        {hasAmount && <p className="text-slate-500">{t3.amountBase}: <strong className="tabular-nums text-deen">{money(distributable)}</strong></p>}
      </Step>

      {/* 9 */}
      <Step no={9} title={t3.s9Title} word={t3.stepWord}>
        <p>{t3.s9Text}</p>
        <ul className="space-y-1.5">
          {checks.map((c) => (
            <li key={c.label} className="flex items-start gap-2">
              {c.ok ? <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-700" /> : <AlertTriangle size={15} className="mt-1 shrink-0 text-red-600" />}
              <span className={c.ok ? "" : "font-bold text-red-700"}>{c.label}</span>
            </li>
          ))}
        </ul>
        <p role={allOk ? undefined : "alert"} className={`rounded-xl p-3 font-bold ${allOk ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"}`}>{allOk ? t3.chkOk : t3.chkFail}</p>
      </Step>

      <p className="text-[11px] leading-5 text-slate-400">{t3.basis}</p>
    </div>
  );
      }
