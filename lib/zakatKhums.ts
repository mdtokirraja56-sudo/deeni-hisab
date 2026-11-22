// lib/zakatKhums.ts - "afw" (khums) rule, as stated in Faizan-e-Zakat pp. 27-28.
// Above nisab, only each complete fifth of nisab is counted; a smaller remainder is afw (forgiven).
// Example from the book (gold): 8 tola -> pay on 7.5; 9 tola -> pay on 9; 10 tola -> pay on 9; 10.5 -> pay on 10.5.
// Applied here to the total net wealth in money. The scholar must confirm this use before it is called final.

export interface KhumsResult { base: number; afw: number; zakat: number }
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function zakatOn(net: number, nisab: number, useKhums: boolean, rate = 0.025): KhumsResult {
  if (!(net >= nisab) || !(nisab > 0)) return { base: 0, afw: 0, zakat: 0 };
  if (!useKhums) return { base: round2(net), afw: 0, zakat: round2(net * rate) };
  const step = nisab / 5;
  const steps = Math.floor((net - nisab) / step + 1e-9);
  const base = nisab + steps * step;
  return { base: round2(base), afw: round2(net - base), zakat: round2(base * rate) };
}
