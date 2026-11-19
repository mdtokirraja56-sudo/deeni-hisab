"use client";

import { useEffect, useState } from "react";
import type { CopyMore } from "../lib/copyMore";
import { copyLand } from "../lib/copyLand";
import { LAND_UNITS, FACTOR, area, fromBase, localFactor, parseExact, toBase, type LandUnit } from "../lib/land";
import { LOCAL_UNITS, GROUPS, unitName, type LocalUnit } from "../lib/landUnits";
import type { Lang } from "../lib/heirs";
import { sanitizeDecimal } from "../lib/numbers";
import { Field, Choice, Note, Actions, Tile } from "./calcUi";

type Q = { n: bigint; d: bigint };
type Row = { size: string; unit: string }; // unit: an exact unit, or "P:<id>" = "1 <parent> equals <size> of this"
const KEY = "deeni-land-local-v2";
const sel = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-sm font-semibold text-slate-800";
const show = (s: string) => { const [w, f] = s.split("."); return w.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (f ? "." + f : ""); };
const blank = (): Row => ({ size: "", unit: "sqft" });

export function LandConverter({ t, lang }: { t: CopyMore; lang: Lang }) {
  const c = copyLand[lang];
  const [mode, setMode] = useState<"area" | "lw">("area");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState<string>("acre");
  const [len, setLen] = useState(""); const [wid, setWid] = useState("");
  const [lu, setLu] = useState<"ft" | "yd" | "m">("ft");
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [go, setGo] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) { const v = JSON.parse(r); if (v && typeof v === "object") setRows(v); } } catch { /* optional */ } }, []);
  const row = (id: string): Row => rows[id] || blank();
  const setRow = (id: string, p: Partial<Row>) => { const v = { ...rows, [id]: { ...row(id), ...p } }; setRows(v); setGo(false); try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* optional */ } };
  const up = (set: (v: string) => void) => (v: string) => { set(sanitizeDecimal(v)); setGo(false); setMsg(""); };

  // Resolve sizes: first the units defined in exact terms, then the "1 parent equals N of this" ones.
  const fac: Record<string, Q> = {};
  for (const u of LOCAL_UNITS) { const r = row(u.id); const x = parseExact(r.size); if (x && (LAND_UNITS as string[]).includes(r.unit)) { const f = localFactor(x, r.unit as LandUnit); if (f) fac[u.id] = f; } }
  for (const u of LOCAL_UNITS) { const r = row(u.id); const x = parseExact(r.size); if (x && x.n > 0n && r.unit.startsWith("P:")) { const p = fac[r.unit.slice(2)]; if (p && r.unit.slice(2) !== u.id) fac[u.id] = { n: p.n * x.d, d: p.d * x.n }; } }
  const defined = LOCAL_UNITS.filter((u) => fac[u.id]);
  const exactOnly = LOCAL_UNITS.filter((u) => { const r = row(u.id); const x = parseExact(r.size); return x && (LAND_UNITS as string[]).includes(r.unit) && localFactor(x, r.unit as LandUnit); });

  let base: Q | null = null; let err = "";
  if (go) {
    if (mode === "area") {
      const q = parseExact(qty); const f = unit.startsWith("L:") ? fac[unit.slice(2)] : FACTOR[unit as LandUnit];
      if (!q || !f) err = c.errNum; else base = toBase(q, f);
    } else { const a = parseExact(len), b = parseExact(wid); if (!a || !b) err = c.errLw; else base = area(a, b, lu); }
  }
  const rowsOut = base ? [...LAND_UNITS.map((u) => ({ label: c[u], v: fromBase(base!, FACTOR[u], u === "sqft" || u === "sqyd" || u === "sqm" ? 4 : 6) })), ...defined.map((u) => ({ label: unitName(u, lang), v: fromBase(base!, fac[u.id], 6) }))] : [];
  const text = rowsOut.map((r) => `${r.label}: ${show(r.v)}`).join("\n") + "\n\nDEENI HISAB";
  const copy = async () => { try { await navigator.clipboard.writeText(text); setMsg(c.copied); } catch { setMsg(""); } };
  const share = async () => { try { if (navigator.share) await navigator.share({ text }); else await copy(); } catch { /* cancelled */ } };

  const editor = (u: LocalUnit) => {
    const r = row(u.id);
    return (
      <div key={u.id} className="rounded-2xl border border-slate-100 bg-white p-3">
        <div className="mb-2 text-sm font-extrabold text-deen">{unitName(u, lang)}</div>
        <div className="grid grid-cols-2 gap-2">
          <Field label={c.localSize} value={r.size} setValue={(v) => setRow(u.id, { size: sanitizeDecimal(v) })} />
          <label className="block"><span className="mb-1 block text-[11px] font-bold text-slate-500">{c.unit}</span>
            <select value={r.unit} onChange={(e) => setRow(u.id, { unit: e.target.value })} className={sel}>
              {LAND_UNITS.map((x) => <option key={x} value={x}>{c[x]}</option>)}
              {exactOnly.filter((p) => p.id !== u.id).map((p) => <option key={p.id} value={"P:" + p.id}>{c.partOf.replace("{p}", unitName(p, lang))}</option>)}
            </select></label>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <details className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
        <summary className="cursor-pointer text-sm font-extrabold text-deen">{c.howTitle}</summary>
        <ol className="mt-3 list-decimal space-y-2 ps-5 text-xs leading-6 text-slate-700">{c.how.map((s) => <li key={s}>{s}</li>)}</ol>
      </details>

      <Choice value={mode} onChange={(v) => { setMode(v); setGo(false); }} label={c.title} options={[{ id: "area", text: c.modeArea }, { id: "lw", text: c.modeLw }]} />
      {mode === "area" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={c.qty} value={qty} setValue={up(setQty)} error={err && go ? err : undefined} />
          <label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">{c.unit}</span>
            <select value={unit} onChange={(e) => { setUnit(e.target.value); setGo(false); }} className={sel}>
              {LAND_UNITS.map((u) => <option key={u} value={u}>{c[u]}</option>)}
              {defined.map((u) => <option key={u.id} value={"L:" + u.id}>{unitName(u, lang)}</option>)}
            </select></label>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={c.length} value={len} setValue={up(setLen)} />
          <Field label={c.width} value={wid} setValue={up(setWid)} error={err && go ? err : undefined} />
          <label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">{c.lenUnit}</span>
            <select value={lu} onChange={(e) => { setLu(e.target.value as "ft" | "yd" | "m"); setGo(false); }} className={sel}>
              <option value="ft">{c.ft}</option><option value="yd">{c.yd}</option><option value="m">{c.m}</option>
            </select></label>
        </div>
      )}

      <details className="rounded-2xl border border-slate-200 p-4">
        <summary className="cursor-pointer text-sm font-extrabold text-deen">{c.localTitle}</summary>
        <p className="mt-2 text-[11px] leading-6 text-slate-500">{c.localHint}</p>
        <div className="mt-3 space-y-3">{LOCAL_UNITS.filter((u) => u.common).map(editor)}</div>
        <details className="mt-4 rounded-2xl border border-slate-200 p-3">
          <summary className="cursor-pointer text-sm font-extrabold text-slate-700">{c.moreUnits}</summary>
          <div className="mt-3 space-y-4">
            {GROUPS.map((g) => (
              <div key={g}>
                <div className="mb-2 text-xs font-extrabold text-slate-500">{c["g_" + g as "g_north"]}</div>
                <div className="space-y-3">{LOCAL_UNITS.filter((u) => !u.common && u.grp === g).map(editor)}</div>
              </div>
            ))}
          </div>
        </details>
      </details>

      <Actions t={t} onCalc={() => { setGo(true); setMsg(""); }} onReset={() => { setQty(""); setLen(""); setWid(""); setGo(false); setMsg(""); }} />

      {rowsOut.length > 0 && (
        <div className="space-y-3 rounded-2xl bg-emerald-50/60 p-4 ring-1 ring-emerald-100">
          <div className="text-sm font-extrabold text-deen">{c.result}</div>
          <div className="grid grid-cols-2 gap-2" dir="ltr">
            {rowsOut.map((r) => <Tile key={r.label} label={r.label} value={<span className="tabular-nums">{show(r.v)}</span>} />)}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={copy} className="flex-1 rounded-2xl border border-deen px-4 py-3 text-sm font-extrabold text-deen">{c.copy}</button>
            <button type="button" onClick={share} className="flex-1 rounded-2xl bg-deen px-4 py-3 text-sm font-extrabold text-white">{c.share}</button>
          </div>
          {msg && <p role="status" className="text-[11px] font-bold text-deen">{msg}</p>}
        </div>
      )}
      <Note tone="warn">{c.note}</Note>
    </div>
  );
        }
