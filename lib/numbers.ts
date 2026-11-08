// lib/numbers.ts
// Helpers so users can type numbers with Urdu, Arabic or Hindi digits.

// Zero-digit code points: Arabic-Indic (٠), Extended Arabic-Indic / Urdu (۰), Devanagari (०)
const ZERO_DIGITS = [0x0660, 0x06f0, 0x0966];

export function toAsciiDigits(input: string): string {
  let out = "";
  for (const ch of input) {
    const code = ch.codePointAt(0) ?? 0;
    let digit = -1;
    for (const zero of ZERO_DIGITS) {
      if (code >= zero && code <= zero + 9) digit = code - zero;
    }
    out += digit >= 0 ? String(digit) : ch;
  }
  return out;
}

// Keeps only digits and ONE decimal point. Commas (thousand separators) are removed.
export function sanitizeDecimal(raw: string): string {
  const cleaned = toAsciiDigits(raw)
    .replace(/[,٬،]/g, "") // , and Arabic thousands/comma separators
    .replace(/٫/g, ".") // Arabic decimal separator
    .replace(/[^\d.]/g, "");
  const firstDot = cleaned.indexOf(".");
  const single =
    firstDot === -1
      ? cleaned
      : cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
  return single.slice(0, 15);
}

export function parseAmount(value: string): number {
  if (value === "" || value === ".") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
