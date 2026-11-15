"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, LogIn, Save, Trash2, UserRound, X, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../lib/heirs";
import { copyAccount, type CopyAccount } from "../lib/copyAccount";
import { authConfigured, consumeAuthHash, updatePassword, deleteAllCases, deleteCase, listCases, saveCase, sendReset, signIn, signOut, signUp, useSession, type AuthCode, type SavedCase } from "../lib/supa";

const OPEN_EVENT = "deeni-open-account";
export const openAccount = () => { try { window.dispatchEvent(new Event(OPEN_EVENT)); } catch { /* ignore */ } };

const errText = (a: CopyAccount, c: AuthCode): string => ({
  invalid: a.errInvalid, exists: a.errExists, weak: a.errWeak, rate: a.errRate, network: a.errNetwork, unconfirmed: a.errUnconfirmed,
  notConfigured: a.notConfigured, failed: a.errFailed, ok: ""
}[c]);

const field = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10";

function Saved({ a, lang }: { a: CopyAccount; lang: Lang }) {
  const [rows, setRows] = useState<SavedCase[] | null | undefined>(undefined);
  const [openId, setOpenId] = useState("");
  const [ask, setAsk] = useState(false);
  const [msg, setMsg] = useState("");
  const refresh = async () => setRows(await listCases());
  useEffect(() => { refresh(); }, []);
  const date = (s: string) => { try { return new Date(s).toLocaleDateString(lang === "en" ? "en-GB" : "en-IN", { day: "2-digit", month: "short", year: "numeric" }); } catch { return ""; } };
  return (
    <div className="mt-5">
      <h4 className="text-sm font-extrabold text-deen">{a.saved}</h4>
      {rows === undefined ? <p className="mt-2 text-xs text-slate-400">{a.loading}</p>
        : !rows || rows.length === 0 ? <p className="mt-2 text-xs leading-6 text-slate-500">{a.none}</p>
        : <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-700">{r.title || a.kinds[r.kind]}</div>
                  <div className="text-[11px] text-slate-400">{a.kinds[r.kind] ?? r.kind} · {date(r.created_at)}</div>
                </div>
                <button type="button" aria-label={a.del} onClick={async () => { if (await deleteCase(r.id)) refresh(); }} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
              </div>
              {Array.isArray(r.data?.lines) && r.data.lines.length > 0 && <>
                <button type="button" onClick={() => setOpenId(openId === r.id ? "" : r.id)} className="mt-2 flex items-center gap-1 text-[11px] font-bold text-deen">{openId === r.id ? a.hideLines : a.lines}{openId === r.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</button>
                {openId === r.id && <ul className="mt-2 space-y-1 text-[11px] leading-5 text-slate-600">{r.data.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>}
              </>}
            </li>
          ))}
        </ul>}
      {rows && rows.length > 0 && (ask
        ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold leading-6 text-red-800">
          {a.deleteAllAsk}
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={async () => { if (await deleteAllCases()) { setMsg(a.deleted); setAsk(false); refresh(); } }} className="rounded-xl bg-red-600 px-3 py-2 text-white">{a.deleteAllYes}</button>
            <button type="button" onClick={() => setAsk(false)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-600">{a.cancel}</button>
          </div>
        </div>
        : <button type="button" onClick={() => setAsk(true)} className="mt-4 text-xs font-bold text-red-600 underline">{a.deleteAll}</button>)}
      {msg && <p role="status" className="mt-2 text-xs font-bold text-emerald-800">{msg}</p>}
    </div>
  );
}

function Dialog({ lang, onClose, newPw }: { lang: Lang; onClose: () => void; newPw?: boolean }) {
  const a = copyAccount[lang];
  const session = useSession();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [changing, setChanging] = useState(Boolean(newPw));
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const go = async (e: FormEvent) => {
    e.preventDefault(); setErr(""); setOk("");
    if (!changing && !/^\S+@\S+\.\S+$/.test(email.trim())) { setErr(a.errEmail); return; }
    if (changing) { if (pw.length < 6) { setErr(a.errWeak); return; } }
    else if (mode !== "forgot" && pw.length < 6) { setErr(a.errWeak); return; }
    setBusy(true);
    if (changing) { const r = await updatePassword(pw); setBusy(false); if (!r.ok) { setErr(errText(a, r.code)); return; } setChanging(false); setPw(""); setOk(a.pwChanged); return; }
    const r = mode === "in" ? await signIn(email, pw) : mode === "up" ? await signUp(email, pw) : await sendReset(email);
    setBusy(false);
    if (!r.ok) { setErr(errText(a, r.code)); return; }
    if (mode === "forgot") { setOk(a.resetSent); return; }
    if (r.code === "unconfirmed") { setOk(a.confirmMail); setMode("in"); return; }
    setPw("");
  };

  const title = changing ? a.newPwTitle : session ? a.account : mode === "in" ? a.signInTitle : mode === "up" ? a.signUpTitle : a.forgotTitle;
  const sub = changing ? a.newPwSub : session ? "" : mode === "in" ? a.signInSub : mode === "up" ? a.signUpSub : a.forgotSub;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-slate-950/60 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div><h3 className="text-xl font-extrabold text-deen">{title}</h3>{sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}</div>
          <button type="button" onClick={onClose} aria-label={a.close} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"><X size={16} /></button>
        </div>

        {!authConfigured ? <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">{a.notConfigured}</p>
          : session && !changing ? <>
            <p className="text-xs text-slate-500">{a.signedAs} <b className="text-slate-700" dir="ltr">{session.user.email}</b></p>
            <Saved a={a} lang={lang} />
            <button type="button" onClick={async () => { await signOut(); onClose(); }} className="mt-5 w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-extrabold text-slate-600 hover:bg-slate-50">{a.signOut}</button>
          </> : <form onSubmit={go} className="space-y-4" noValidate>
            {!changing && <label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">{a.email}</span>
              <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={a.emailPh} dir="ltr" className={field} /></label>}
            {(changing || mode !== "forgot") && <label className="block"><span className="mb-2 block text-xs font-bold text-slate-600">{a.password}</span>
              <div className="relative">
                <input type={show ? "text" : "password"} autoComplete={mode === "in" && !changing ? "current-password" : "new-password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder={a.passwordPh} dir="ltr" className={`${field} pe-12`} />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? a.hide : a.show} className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div></label>}
            {err && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs font-bold leading-6 text-red-700">{err}</p>}
            {ok && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs font-bold leading-6 text-emerald-900">{ok}</p>}
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-deen py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:opacity-60">
              <LogIn size={17} />{busy ? a.working : changing ? a.newPwBtn : mode === "in" ? a.signInBtn : mode === "up" ? a.signUpBtn : a.sendReset}
            </button>
            {!changing && <div className="space-y-2 border-t border-slate-100 pt-3 text-center text-xs font-bold">
              {mode === "in" && <><button type="button" onClick={() => { setMode("up"); setErr(""); setOk(""); }} className="block w-full text-deen">{a.toSignUp}</button>
                <button type="button" onClick={() => { setMode("forgot"); setErr(""); setOk(""); }} className="block w-full text-slate-500">{a.toForgot}</button></>}
              {mode === "up" && <button type="button" onClick={() => { setMode("in"); setErr(""); setOk(""); }} className="block w-full text-deen">{a.toSignIn}</button>}
              {mode === "forgot" && <button type="button" onClick={() => { setMode("in"); setErr(""); setOk(""); }} className="block w-full text-deen">{a.back}</button>}
            </div>}
          </form>}
        <p className="mt-4 text-[11px] leading-5 text-slate-400">{a.privacy}</p>
      </div>
    </div>
  );
}

/** Header button + the sign-in dialog. Put it once in the page header. */
export function AccountButton({ lang }: { lang: Lang }) {
  const a = copyAccount[lang];
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [recovery, setRecovery] = useState(false);
  useEffect(() => {
    setMounted(true);
    consumeAuthHash().then((r) => { if (r === "recovery") { setRecovery(true); setOpen(true); } });
    const on = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, on);
    return () => window.removeEventListener(OPEN_EVENT, on);
  }, []);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={session ? a.account : a.menu} className="flex items-center gap-1.5 rounded-full border border-emerald-900/20 px-3 py-2.5 text-xs font-bold text-deen transition hover:bg-emerald-50 sm:px-4 sm:py-2 print:hidden">
        <UserRound size={15} /><span className="hidden sm:inline">{session ? a.account : a.menu}</span>
      </button>
      {mounted && open && createPortal(<div dir={lang === "ur" ? "rtl" : "ltr"} className={lang === "hi" ? "font-hindi" : lang === "ur" ? "font-urdu" : ""}><Dialog lang={lang} newPw={recovery} onClose={() => { setOpen(false); setRecovery(false); }} /></div>, document.body)}
    </>
  );
}

/** "Save this calculation" button for a result. Asks to sign in first if needed. */
export function SaveCase({ lang, kind, title, lines }: { lang: Lang; kind: "zakat" | "mirath" | "other"; title: string; lines: string[] }) {
  const a = copyAccount[lang];
  const session = useSession();
  const [st, setSt] = useState<"idle" | "busy" | "ok" | "fail">("idle");
  if (!authConfigured) return null;
  const save = async () => {
    if (!session) { openAccount(); return; }
    setSt("busy");
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const ok = await saveCase(kind, `${a.kinds[kind]} — ${date}`.slice(0, 120) || title, { lines, savedAt: new Date().toISOString() });
    setSt(ok ? "ok" : "fail");
  };
  return (
    <div className="mt-3 print:hidden">
      <button type="button" onClick={save} disabled={st === "busy"} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-deen/30 bg-white px-5 py-3 text-sm font-bold text-deen transition hover:bg-emerald-50 disabled:opacity-60">
        <Save size={16} />{st === "busy" ? a.saving : session ? a.save : a.signInToSave}
      </button>
      {st === "ok" && <p role="status" className="mt-2 text-xs font-bold text-emerald-800">{a.savedOk}</p>}
      {st === "fail" && <p role="alert" className="mt-2 text-xs font-bold text-red-700">{a.saveFail}</p>}
    </div>
  );
}
