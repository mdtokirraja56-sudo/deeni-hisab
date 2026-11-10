"use client";

import { useEffect } from "react";

// Registers the service worker (production only) so the app can open offline.
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => { /* ignore: the site works without it */ });
  }, []);
  return null;
}
