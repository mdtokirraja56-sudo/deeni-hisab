"use client";

import { numberWords, useNumLang } from "../lib/numWords";

/** Small line under a number box: the number written in words (in the page language). */
export function NumWords({ value }: { value: string }) {
  const lang = useNumLang();
  const w = numberWords(value, lang);
  if (!w) return null;
  return <span className="mt-1 block text-[11px] font-bold leading-5 text-deen">{w}</span>;
}
