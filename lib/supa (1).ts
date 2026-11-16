// lib/supa.ts — tiny Supabase client (no package needed): email + password sign-in and "saved calculations".
// Only the PUBLISHABLE key is used here (it is meant to be public). Never put a secret / service_role key in this project.
// Safety lives in the database: Row Level Security lets every user see and change only his own rows.

import { useEffect, useState } from "react";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const authConfigured = Boolean(URL_ && KEY);

const STORE = "deeni-hisab-session";

export interface Session { access_token: string; refresh_token: string; expires_at: number; user: { id: string; email: string } }
export type AuthCode = "ok" | "invalid" | "exists" | "weak" | "rate" | "network" | "unconfirmed" | "notConfigured" | "badcode" | "failed";
export interface AuthResult { ok: boolean; code: AuthCode }

let session: Session | null = null;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = localStorage.getItem(STORE); if (raw) session = JSON.parse(raw) as Session; } catch { /* storage may be blocked */ }
}
function setSession(s: Session | null) {
  session = s;
  try { if (s) localStorage.setItem(STORE, JSON.stringify(s)); else localStorage.removeItem(STORE); } catch { /* ignore */ }
  emit();
}

export function useSession(): Session | null {
  const [s, setS] = useState<Session | null>(null);
  useEffect(() => {
    load(); setS(session);
    const on = () => setS(session);
    listeners.add(on);
    return () => { listeners.delete(on); };
  }, []);
  return s;
}

async function call(path: string, init: RequestInit & { token?: string } = {}) {
  const { token, ...rest } = init;
  return fetch(`${URL_}${path}`, { ...rest, headers: { apikey: KEY, Authorization: `Bearer ${token || KEY}`, "Content-Type": "application/json", ...(rest.headers || {}) } });
}

const toSession = (j: any): Session | null => {
  if (!j || !j.access_token || !j.user) return null;
  return { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (Number(j.expires_in) || 3600), user: { id: j.user.id, email: j.user.email } };
};

function codeFrom(status: number, j: any): AuthCode {
  const c = String(j?.error_code || j?.code || "");
  const m = String(j?.msg || j?.message || j?.error_description || "").toLowerCase();
  if (status === 429 || c.includes("rate_limit")) return "rate";
  if (c === "otp_expired" || m.includes("expired or is invalid") || m.includes("token has expired")) return "badcode";
  if (c === "invalid_credentials" || m.includes("invalid login")) return "invalid";
  if (c === "email_not_confirmed" || m.includes("not confirmed")) return "unconfirmed";
  if (c === "user_already_exists" || m.includes("already")) return "exists";
  if (c === "weak_password" || m.includes("password")) return "weak";
  return "failed";
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  if (!authConfigured) return { ok: false, code: "notConfigured" };
  try {
    const r = await call("/auth/v1/signup", { method: "POST", body: JSON.stringify({ email: email.trim(), password }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, code: codeFrom(r.status, j) };
    const s = toSession(j);
    if (s) { setSession(s); return { ok: true, code: "ok" }; }
    return { ok: true, code: "unconfirmed" }; // the project asks for e-mail confirmation first
  } catch { return { ok: false, code: "network" }; }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!authConfigured) return { ok: false, code: "notConfigured" };
  try {
    const r = await call("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email: email.trim(), password }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, code: codeFrom(r.status, j) };
    const s = toSession(j);
    if (!s) return { ok: false, code: "failed" };
    setSession(s); return { ok: true, code: "ok" };
  } catch { return { ok: false, code: "network" }; }
}

export async function sendReset(email: string): Promise<AuthResult> {
  if (!authConfigured) return { ok: false, code: "notConfigured" };
  try {
    const r = await call("/auth/v1/recover", { method: "POST", body: JSON.stringify({ email: email.trim() }) });
    if (r.status === 429) return { ok: false, code: "rate" };
    return { ok: r.ok, code: r.ok ? "ok" : "failed" };
  } catch { return { ok: false, code: "network" }; }
}

/** E-mail a one-time code. createUser=true lets a new person sign in with just a code. */
export async function sendCode(email: string, createUser: boolean): Promise<AuthResult> {
  if (!authConfigured) return { ok: false, code: "notConfigured" };
  try {
    const r = await call("/auth/v1/otp", { method: "POST", body: JSON.stringify({ email: email.trim(), create_user: createUser }) });
    if (r.ok) return { ok: true, code: "ok" };
    return { ok: false, code: codeFrom(r.status, await r.json().catch(() => ({}))) };
  } catch { return { ok: false, code: "network" }; }
}

/** Check the code from the e-mail. type "email" = sign in, "recovery" = forgot password, "signup" = confirm a new account. */
export async function verifyCode(email: string, token: string, type: "email" | "recovery" | "signup"): Promise<AuthResult> {
  if (!authConfigured) return { ok: false, code: "notConfigured" };
  try {
    const r = await call("/auth/v1/verify", { method: "POST", body: JSON.stringify({ type, email: email.trim(), token: token.replace(/\s/g, "") }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, code: codeFrom(r.status, j) === "failed" ? "badcode" : codeFrom(r.status, j) };
    const s = toSession(j);
    if (!s) return { ok: false, code: "failed" };
    setSession(s); return { ok: true, code: "ok" };
  } catch { return { ok: false, code: "network" }; }
}

export async function signOut() {
  const s = session;
  setSession(null);
  if (s && authConfigured) { try { await call("/auth/v1/logout", { method: "POST", token: s.access_token }); } catch { /* already signed out locally */ } }
}

async function token(): Promise<string | null> {
  load();
  if (!session) return null;
  if (session.expires_at - 60 > Date.now() / 1000) return session.access_token;
  try {
    const r = await call("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: session.refresh_token }) });
    const s = r.ok ? toSession(await r.json()) : null;
    if (!s) { setSession(null); return null; }
    setSession(s); return s.access_token;
  } catch { return session.access_token; }
}

export interface SavedCase { id: string; kind: "zakat" | "mirath" | "other"; title: string; data: { lines?: string[]; savedAt?: string }; created_at: string }

export async function saveCase(kind: SavedCase["kind"], title: string, data: object): Promise<boolean> {
  const t = await token(); if (!t) return false;
  try {
    const r = await call("/rest/v1/saved_cases", { method: "POST", token: t, headers: { Prefer: "return=minimal" }, body: JSON.stringify({ kind, title: title.slice(0, 120), data }) });
    return r.ok;
  } catch { return false; }
}

export async function listCases(): Promise<SavedCase[] | null> {
  const t = await token(); if (!t) return null;
  try {
    const r = await call("/rest/v1/saved_cases?select=id,kind,title,data,created_at&order=created_at.desc&limit=50", { token: t });
    return r.ok ? ((await r.json()) as SavedCase[]) : null;
  } catch { return null; }
}

export async function deleteCase(id: string): Promise<boolean> {
  const t = await token(); if (!t) return false;
  try { return (await call(`/rest/v1/saved_cases?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", token: t })).ok; } catch { return false; }
}

export async function deleteAllCases(): Promise<boolean> {
  const t = await token(); if (!t || !session) return false;
  try { return (await call(`/rest/v1/saved_cases?user_id=eq.${encodeURIComponent(session.user.id)}`, { method: "DELETE", token: t })).ok; } catch { return false; }
}

/** After an e-mail link (password reset / confirmation) the site opens with tokens in the address. Take them and sign in. */
export async function consumeAuthHash(): Promise<"recovery" | "signedIn" | null> {
  if (typeof window === "undefined" || !authConfigured) return null;
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const at = h.get("access_token"); const type = h.get("type");
  if (!at || !type) return null;
  try {
    const r = await call("/auth/v1/user", { token: at });
    const u = await r.json().catch(() => ({}));
    if (!r.ok || !u?.id) return null;
    load();
    setSession({ access_token: at, refresh_token: h.get("refresh_token") || "", expires_at: Math.floor(Date.now() / 1000) + (Number(h.get("expires_in")) || 3600), user: { id: u.id, email: u.email } });
    try { window.history.replaceState(null, "", window.location.pathname + window.location.search); } catch { /* ignore */ }
    return type === "recovery" ? "recovery" : "signedIn";
  } catch { return null; }
}

export async function updatePassword(password: string): Promise<AuthResult> {
  const t = await token(); if (!t) return { ok: false, code: "failed" };
  try {
    const r = await call("/auth/v1/user", { method: "PUT", token: t, body: JSON.stringify({ password }) });
    if (r.ok) return { ok: true, code: "ok" };
    return { ok: false, code: codeFrom(r.status, await r.json().catch(() => ({}))) };
  } catch { return { ok: false, code: "network" }; }
}
