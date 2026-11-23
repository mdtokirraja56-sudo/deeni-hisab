// lib/numWords.ts - writes a number in words (Indian system: hazar, lakh, crore) in the chosen language.
import { useSyncExternalStore } from "react";
import type { Lang } from "./heirs";

const split = (s: string) => s.split(" ");
const T: Record<Lang, string[]> = {
  roman: split("sifar ek do teen chaar paanch chhe saat aath nau das gyarah barah terah chaudah pandrah solah satrah atharah unnees bees ikkees baees teyees chaubees pachchees chhabbees sattaees atthaees untees tees ikatees battees taintees chauntees paintees chhattees saintees adtees untalees chalees iktalees bayalees taintalees chauwalees paintalees chhiyalees saintalees adtalees unchaas pachaas ikyawan bawan tirpan chauwan pachpan chhappan sattawan atthawan unsath saath iksath baasath tirsath chausath painsath chhiyasath sarsath adsath unhattar sattar ikhattar bahattar tihattar chauhattar pachhattar chhihattar sathattar athhattar unaasi assi ikyaasi bayaasi tiraasi chaurasi pachaasi chhiyaasi sattaasi athaasi nawaasi nabbe ikyaanwe baanwe tiraanwe chauraanwe pachaanwe chhiyaanwe sattaanwe athaanwe ninyaanwe"),
  ur: split("صفر ایک دو تین چار پانچ چھ سات آٹھ نو دس گیارہ بارہ تیرہ چودہ پندرہ سولہ سترہ اٹھارہ انیس بیس اکیس بائیس تئیس چوبیس پچیس چھبیس ستائیس اٹھائیس انتیس تیس اکتیس بتیس تینتیس چونتیس پینتیس چھتیس سینتیس اڑتیس انتالیس چالیس اکتالیس بیالیس تینتالیس چوالیس پینتالیس چھیالیس سینتالیس اڑتالیس انچاس پچاس اکاون باون ترپن چون پچپن چھپن ستاون اٹھاون انسٹھ ساٹھ اکسٹھ باسٹھ تریسٹھ چونسٹھ پینسٹھ چھیاسٹھ سڑسٹھ اڑسٹھ انہتر ستر اکہتر بہتر تہتر چوہتر پچھتر چھہتر ستتر اٹھہتر اناسی اسی اکیاسی بیاسی تراسی چوراسی پچاسی چھیاسی ستاسی اٹھاسی نواسی نوے اکیانوے بانوے ترانوے چورانوے پچانوے چھیانوے ستانوے اٹھانوے ننانوے"),
  hi: split("शून्य एक दो तीन चार पाँच छह सात आठ नौ दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस बीस इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस उनतीस तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस चालीस इकतालीस बयालीस तैंतालीस चौवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन उनसठ साठ इकसठ बासठ तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर उनासी अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी नवासी नब्बे इक्यानवे बानवे तिरानवे चौरानवे पचानवे छियानवे सत्तानवे अट्ठानवे निन्यानवे"),
  en: []
};
const ONES = split("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen");
const TENS = split("- - twenty thirty forty fifty sixty seventy eighty ninety");
for (let i = 0; i < 100; i++) T.en.push(i < 20 ? ONES[i] : TENS[Math.floor(i / 10)] + (i % 10 ? "-" + ONES[i % 10] : ""));

const U: Record<Lang, { hundred: string; thousand: string; lakh: string; crore: string }> = {
  roman: { hundred: "sau", thousand: "hazar", lakh: "lakh", crore: "crore" },
  en: { hundred: "hundred", thousand: "thousand", lakh: "lakh", crore: "crore" },
  ur: { hundred: "سو", thousand: "ہزار", lakh: "لاکھ", crore: "کروڑ" },
  hi: { hundred: "सौ", thousand: "हज़ार", lakh: "लाख", crore: "करोड़" }
};

function words(n: number, lang: Lang): string {
  const t = T[lang], u = U[lang];
  if (n === 0) return t[0];
  const out: string[] = [];
  const crore = Math.floor(n / 1e7); let rem = n % 1e7;
  const lakh = Math.floor(rem / 1e5); rem %= 1e5;
  const th = Math.floor(rem / 1e3); rem %= 1e3;
  const h = Math.floor(rem / 100); const r = rem % 100;
  if (crore) out.push(words(crore, lang), u.crore);
  if (lakh) out.push(t[lakh], u.lakh);
  if (th) out.push(t[th], u.thousand);
  if (h) out.push(t[h], u.hundred);
  if (r) out.push(t[r]);
  return out.join(" ");
}

/** "500000" -> "paanch lakh". Returns "" for small, empty or invalid values. */
export function numberWords(value: string, lang: Lang, min = 1000): string {
  const m = /^\s*(\d{1,15})(?:\.\d*)?\s*$/.exec(value.replace(/[,،٬]/g, ""));
  if (!m) return "";
  const n = Number(m[1]);
  if (!isFinite(n) || n < min) return "";
  return words(n, lang);
}

// the page language, so every number box knows which language to write in
let cur: Lang = "ur";
const subs = new Set<() => void>();
export function setNumLang(l: Lang) { if (l !== cur) { cur = l; subs.forEach((f) => f()); } }
export function useNumLang(): Lang {
  return useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => cur, () => "ur" as Lang);
}
