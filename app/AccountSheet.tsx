"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, KeyRound, LogIn, Mail, Save, Trash2, UserRound, X, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "../lib/heirs";
import { authConfigured, consumeAuthHash, updatePassword, deleteAllCases, deleteCase, listCases, saveCase, sendCode, sendReset, signIn, signOut, signUp, useSession, verifyCode, type AuthCode, type SavedCase } from "../lib/supa";

// The sign-in part of the site is in English only (on purpose), whatever language the calculators use.
const T = {
  signIn: "Sign in", account: "My account", close: "Close",
  email: "E-mail", emailPh: "you@example.com", password: "Password", passwordPh: "At least 6 characters", newPassword: "New password",
  show: "Show password", hide: "Hide password",
  titleIn: "Sign in", subIn: "Sign in to save your calculations",
  titleUp: "Create account", subUp: "A free account to save your calculations",
  titleCode: "Sign in with a code", subCode: "We will e-mail you a one-time code. No password needed.",
  titleVerify: "Enter the code", subVerify: (e: string) => `We sent a code to ${e}. Check your inbox (and spam).`,
  titleForgot: "Forgot password", subForgot: "We will e-mail you a code to set a new password",
  titleReset: "Set a new password", subReset: (e: string) => `Enter the code we sent to ${e} and choose a new password.`,
  titleNew: "Set a new password", subNew: "Choose a new password for your account",
  btnIn: "Sign in", btnUp: "Create account", btnSend: "Send code", btnVerify: "Verify and sign in", btnReset: "Save new password", btnNew: "Save new password", working: "Please wait...",
  code: "Code", codePh: "Code from the e-mail",
  useCode: "Sign in with an e-mail code instead", forgot: "Forgot password?", toUp: "New here? Create an account", toIn: "Already have an account? Sign in with password", back: "Back", changeEmail: "Use a different e-mail",
  resend: "Send the code again", resendIn: (n: number) => `Send again in ${n}s`, sentAgain: "A new code has been sent.",
  pwChanged: "Password changed. You are signed in.", pwChangedOnly: "Password changed.",
  confirmMail: "Account created. We sent a code to your e-mail. Enter it to finish.",
  errInvalid: "E-mail or password is wrong.", errExists: "This e-mail already has an account. Please sign in.", errWeak: "Password is too short or weak (use at least 6 characters).",
  errRate: "Too many tries. Please wait a minute and try again.", errNetwork: "No internet connection. Please try again.", errUnconfirmed: "Please confirm your e-mail first.",
  errFailed: "Something went wrong. Please try again.", errEmail: "Enter a valid e-mail.", errCode: "Enter the code from the e-mail.",
  errBadCode: "That code is wrong or has expired. Ask for a new code.", notConfigured: "Sign-in is not switched on for this site yet.",
  signedAs: "Signed in as", signOut: "Sign out",
  saved: "My saved calculations", none: "Nothing saved yet. After a calculation, press \"Save\".", loading: "Loading...",
  del: "Delete", lines: "Show details", hideLines: "Hide details",
  deleteAll: "Delete all my saved data", deleteAllAsk: "Delete ALL your saved calculations? This cannot be undone.", deleteAllYes: "Yes, delete", cancel: "Cancel", deleted: "Deleted.",
  privacy: "Your e-mail and saved calculations are kept in a cloud database. Only you can see them. You can delete them at any time. Deleting the whole account from the site is not available yet.",
  save: "Save this calculation", saving: "Saving...", savedOk: "Saved. Find it in \"My account\".", saveFail: "Could not save. Please try again.", signInToSave: "Sign in to save this calculation",
  kinds: { zakat: "Zakat", mirath: "Mirath", other: "Other" } as Record<string, string>
};

const OPEN_EVENT = "deeni-open-account";
export const openAccount = () => { try { window.dispatchEvent(new Event(OPEN_EVENT)); } catch { /* ignore */ } };

const errText = (c: AuthCode): string => ({
  invalid: T.errInvalid, exists: T.errExists, weak: T.errWeak, rate: T.errRate, network: T.errNetwork, unconfirmed: T.errUnconfirmed,
  notConfigured: T.notConfigured, badcode: T.errBadCode, failed: T.errFailed, ok: ""
}[c]);

const field = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-semibold outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10";
const label = "mb-2 block text-xs font-bold text-slate-600";

function Saved() {
  const [rows, setRows] = useState<SavedCase[] | null | undefined>(undefined);
  const [openId, setOpenId] = useState("");
  const [ask, setAsk] = useState(false);
  const [msg, setMsg] = useState("");
  const refresh = async () => setRows(await listCases());
  useEffect(() => { refresh(); }, []);
  const date = (s: string) => { try { return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); } catch { return ""; } };
  return (
    <div className="mt-5">
      <h4 className="text-sm font-extrabold text-deen">{T.saved}</h4>
      {rows === undefined ? <p className="mt-2 text-xs text-slate-400">{T.loading}</p>
        : !rows || rows.length === 0 ? <p className="mt-2 text-xs leading-6 text-slate-500">{T.none}</p>
        : <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-700">{r.title || T.kinds[r.kind]}</div>
                  <div className="text-[11px] text-slate-400">{T.kinds[r.kind] ?? r.kind} · {date(r.created_at)}</div>
                </div>
                <button type="button" aria-label={T.del} onClick={async () => { if (await deleteCase(r.id)) refresh(); }} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
              </div>
              {(r.data?.lines ?? []).length > 0 && <>
                <button type="button" onClick={() => setOpenId(openId === r.id ? "" : r.id)} className="mt-2 flex items-center gap-1 text-[11px] font-bold text-deen">{openId === r.id ? T.hideLines : T.lines}{openId === r.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</button>
                {openId === r.id && <ul className="mt-2 space-y-1 text-[11px] leading-5 text-slate-600">{(r.data?.lines ?? []).map((l, i) => <li key={i}>{l}</li>)}</ul>}
              </>}
            </li>
          ))}
        </ul>}
      {rows && rows.length > 0 && (ask
        ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold leading-6 text-red-800">
          {T.deleteAllAsk}
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={async () => { if (await deleteAllCases()) { setMsg(T.deleted); setAsk(false); refresh(); } }} className="rounded-xl bg-red-600 px-3 py-2.5 text-white">{T.deleteAllYes}</button>
            <button type="button" onClick={() => setAsk(false)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600">{T.cancel}</button>
          </div>
        </div>
        : <button type="button" onClick={() => setAsk(true)} className="mt-4 text-xs font-bold text-red-600 underline">{T.deleteAll}</button>)}
      {msg && <p role="status" className="mt-2 text-xs font-bold text-emerald-800">{msg}</p>}
    </div>
  );
}

type Mode = "in" | "up" | "code" | "forgot";
type Step = "start" | "verify";

function Dialog({ onClose, newPw }: { onClose: () => void; newPw?: boolean }) {
  const session = useSession();
  const [mode, setMode] = useState<Mode>("in");
  const [step, setStep] = useState<Step>("start");
  const [verifyType, setVerifyType] = useState<"email" | "recovery" | "signup">("email");
  const [changing, setChanging] = useState(Boolean(newPw));
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const reset = (m: Mode) => { setMode(m); setStep("start"); setErr(""); setOk(""); setCode(""); setPw(""); setWait(0); };
  const validEmail = () => /^\S+@\S+\.\S+$/.test(email.trim());

  const sendAgain = async () => {
    if (wait > 0 || busy) return;
    setErr(""); setOk(""); setBusy(true);
    const r = mode === "forgot" ? await sendReset(email) : await sendCode(email, true);
    setBusy(false);
    if (!r.ok) { setErr(errText(r.code)); return; }
    setOk(T.sentAgain); setWait(60);
  };

  const go = async (e: FormEvent) => {
    e.preventDefault(); setErr(""); setOk("");
    // A: new password after opening the reset link from an e-mail
    if (changing) {
      if (pw.length < 6) { setErr(T.errWeak); return; }
      setBusy(true); const r = await updatePassword(pw); setBusy(false);
      if (!r.ok) { setErr(errText(r.code)); return; }
      setChanging(false); setPw(""); setOk(T.pwChangedOnly); return;
    }
    if (!validEmail()) { setErr(T.errEmail); return; }

    // B: second step, the code
    if (step === "verify") {
      if (code.replace(/\D/g, "").length < 6) { setErr(T.errCode); return; }
      if (mode === "forgot" && pw.length < 6) { setErr(T.errWeak); return; }
      setBusy(true);
      const v = await verifyCode(email, code, verifyType);
      if (!v.ok) { setBusy(false); setErr(errText(v.code)); return; }
      if (mode === "forgot") {
        const u = await updatePassword(pw); setBusy(false);
        if (!u.ok) { setErr(errText(u.code)); return; }
        setPw(""); setOk(T.pwChanged); return;
      }
      setBusy(false); setCode(""); return;
    }

    // C: first step
    if (mode === "in" || mode === "up") {
      if (pw.length < 6) { setErr(T.errWeak); return; }
      setBusy(true);
      const r = mode === "in" ? await signIn(email, pw) : await signUp(email, pw);
      setBusy(false);
      if (!r.ok) { setErr(errText(r.code)); return; }
      if (r.code === "unconfirmed") { setVerifyType("signup"); setStep("verify"); setOk(T.confirmMail); setWait(60); return; }
      setPw(""); return;
    }
    setBusy(true);
    const r = mode === "forgot" ? await sendReset(email) : await sendCode(email, true);
    setBusy(false);
    if (!r.ok) { setErr(errText(r.code)); return; }
    setVerifyType(mode === "forgot" ? "recovery" : "email"); setStep("verify"); setWait(60);
  };

  const title = changing ? T.titleNew : session ? T.account
    : step === "verify" ? (mode === "forgot" ? T.titleReset : T.titleVerify)
    : mode === "in" ? T.titleIn : mode === "up" ? T.titleUp : mode === "code" ? T.titleCode : T.titleForgot;
  const sub = changing ? T.subNew : session ? ""
    : step === "verify" ? (mode === "forgot" ? T.subReset(email.trim()) : T.subVerify(email.trim()))
    : mode === "in" ? T.subIn : mode === "up" ? T.subUp : mode === "code" ? T.subCode : T.subForgot;
  const btn = changing ? T.btnNew : step === "verify" ? (mode === "forgot" ? T.btnReset : T.btnVerify)
    : mode === "in" ? T.btnIn : mode === "up" ? T.btnUp : T.btnSend;
  const Icon = step === "verify" ? KeyRound : mode === "code" || mode === "forgot" ? Mail : LogIn;
  const needPw = changing || (step === "start" && (mode === "in" || mode === "up")) || (step === "verify" && mode === "forgot");
  const link = "block w-full py-1.5 text-center";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-hidden bg-slate-950/60 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0"><h3 className="text-xl font-extrabold text-deen">{title}</h3>{sub && <p className="mt-1 break-words text-xs leading-5 text-slate-500">{sub}</p>}</div>
          <button type="button" onClick={onClose} aria-label={T.close} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"><X size={16} /></button>
        </div>

        {!authConfigured ? <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">{T.notConfigured}</p>
          : session && !changing ? <>
            {ok && <p role="status" className="mb-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold leading-6 text-emerald-900">{ok}</p>}
            <p className="break-all text-xs text-slate-500">{T.signedAs} <b className="text-slate-700">{session.user.email}</b></p>
            <Saved />
            <button type="button" onClick={async () => { await signOut(); onClose(); }} className="mt-5 w-full rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-extrabold text-slate-600 hover:bg-slate-50">{T.signOut}</button>
          </> : <form onSubmit={go} className="space-y-4" noValidate>
            {!changing && <label className="block"><span className={label}>{T.email}</span>
              <input type="email" inputMode="email" autoComplete="email" autoCapitalize="none" disabled={step === "verify"} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={T.emailPh} dir="ltr" className={`${field} disabled:opacity-60`} /></label>}
            {step === "verify" && <label className="block"><span className={label}>{T.code}</span>
              <input inputMode="numeric" autoComplete="one-time-code" maxLength={10} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder={T.codePh} dir="ltr" className={`${field} text-center text-xl tracking-[.35em]`} /></label>}
            {needPw && <label className="block"><span className={label}>{changing || mode === "forgot" ? T.newPassword : T.password}</span>
              <div className="relative">
                <input type={show ? "text" : "password"} autoComplete={mode === "in" && !changing ? "current-password" : "new-password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder={T.passwordPh} dir="ltr" className={`${field} pe-12`} />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? T.hide : T.show} className="absolute end-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-slate-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div></label>}
            {err && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs font-bold leading-6 text-red-700">{err}</p>}
            {ok && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs font-bold leading-6 text-emerald-900">{ok}</p>}
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-deen py-4 text-base font-extrabold text-white shadow-lg shadow-emerald-900/20 transition active:scale-[.99] hover:bg-emerald-800 disabled:opacity-60">
              <Icon size={18} />{busy ? T.working : btn}
            </button>
            {!changing && <div className="space-y-1 border-t border-slate-100 pt-3 text-xs font-bold">
              {step === "verify" ? <>
                <button type="button" onClick={sendAgain} disabled={wait > 0 || busy} className={`${link} text-deen disabled:text-slate-400`}>{wait > 0 ? T.resendIn(wait) : T.resend}</button>
                <button type="button" onClick={() => reset(mode)} className={`${link} text-slate-500`}>{T.changeEmail}</button>
              </> : <>
                {mode === "in" && <>
                  <button type="button" onClick={() => reset("code")} className={`${link} text-deen`}>{T.useCode}</button>
                  <button type="button" onClick={() => reset("forgot")} className={`${link} text-slate-500`}>{T.forgot}</button>
                  <button type="button" onClick={() => reset("up")} className={`${link} text-deen`}>{T.toUp}</button>
                </>}
                {mode === "up" && <button type="button" onClick={() => reset("in")} className={`${link} text-deen`}>{T.toIn}</button>}
                {(mode === "code" || mode === "forgot") && <button type="button" onClick={() => reset("in")} className={`${link} text-deen`}>{T.back}</button>}
              </>}
            </div>}
          </form>}
        <p className="mt-4 text-[11px] leading-5 text-slate-400">{T.privacy}</p>
      </div>
    </div>
  );
}

/** Header button + the sign-in dialog. Put it once in the page header. (`lang` is kept so page.tsx does not change; sign-in is English only.) */
export function AccountButton(_props: { lang?: Lang }) {
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
      <button type="button" onClick={() => setOpen(true)} aria-label={session ? T.account : T.signIn} className="flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-emerald-900/20 px-3 text-xs font-bold text-deen transition hover:bg-emerald-50 sm:px-4 print:hidden">
        <UserRound size={16} /><span className="hidden sm:inline">{session ? T.account : T.signIn}</span>
      </button>
      {mounted && open && createPortal(<div dir="ltr" lang="en" style={{ fontFamily: "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif" }}><Dialog newPw={recovery} onClose={() => { setOpen(false); setRecovery(false); }} /></div>, document.body)}
    </>
  );
}

/** "Save this calculation" button for a result. Asks to sign in first if needed. */
export function SaveCase({ kind, title, lines }: { lang?: Lang; kind: "zakat" | "mirath" | "other"; title: string; lines: string[] }) {
  const session = useSession();
  const [st, setSt] = useState<"idle" | "busy" | "ok" | "fail">("idle");
  if (!authConfigured) return null;
  const save = async () => {
    if (!session) { openAccount(); return; }
    setSt("busy");
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const ok = await saveCase(kind, `${T.kinds[kind]} — ${date}`.slice(0, 120) || title, { lines, savedAt: new Date().toISOString() });
    setSt(ok ? "ok" : "fail");
  };
  return (
    <div className="mt-3 print:hidden" dir="ltr" lang="en" style={{ fontFamily: "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <button type="button" onClick={save} disabled={st === "busy"} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-deen/30 bg-white px-5 py-3.5 text-sm font-bold text-deen transition hover:bg-emerald-50 disabled:opacity-60">
        <Save size={16} />{st === "busy" ? T.saving : session ? T.save : T.signInToSave}
      </button>
      {st === "ok" && <p role="status" className="mt-2 text-xs font-bold text-emerald-800">{T.savedOk}</p>}
      {st === "fail" && <p role="alert" className="mt-2 text-xs font-bold text-red-700">{T.saveFail}</p>}
    </div>
  );
                                                                                                     }
        
