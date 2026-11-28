// lib/oldWeights.ts
// Old shar'i weights and coins, as listed in the table of the fatwa of Mufti Muhammad Saleh Qadri Noori Bareilvi,
// "Muntakhab Fatawe" (Auzan-e-Jadeeda se muta'alliq), pp. 23-24 and 28. Everything is derived from ONE base:
//   1 ratti (habba / surkh) = 0.1296 g, 1 masha = 8 ratti, 1 tola = 12 masha = 96 ratti.
// Each row stores only its size in ratti, so tola / masha / rupee-weight / gram figures can never disagree.
import type { Lang } from "./heirs";

export const RATTI_G = 0.1296;
export interface OldWeightRow { id: string; ratti: number; name: Record<Lang, string>; note?: Record<Lang, string> }

const N = (en: string, roman: string, ur: string, hi: string): Record<Lang, string> => ({ en, roman, ur, hi });

export const OLD_WEIGHTS: OldWeightRow[] = [
  { id: "ratti", ratti: 1, name: N("Ratti (habba / surkh)", "Ratti (habba / surkh)", "رتی (حبہ / سرخ)", "रत्ती (हब्बा / सुर्ख़)") },
  { id: "masha", ratti: 8, name: N("Masha", "Masha", "ماشہ", "माशा") },
  { id: "tola", ratti: 96, name: N("Tola (old Indian)", "Tola (shahi daur ka)", "تولہ (شاہی دور کا)", "तोला (शाही दौर का)") },
  { id: "rupee", ratti: 90, name: N("Rupee (English silver coin)", "Rupaya (angrezi daur ka chandi ka sikka)", "روپیہ (انگریزی دور کا چاندی کا سکہ)", "रुपया (अंग्रेज़ी दौर का चाँदी का सिक्का)"), note: N("11¼ masha. Different from the tola.", "Sawa gyarah masha. Tola se alag.", "سوا گیارہ ماشے۔ تولہ سے الگ۔", "सवा ग्यारह माशा। तोला से अलग।") },
  { id: "qirat", ratti: 1.8, name: N("Qirat", "Qirat", "قیراط", "क़ीरात"), note: N("1 habba + ⅘ habba", "Ek habba aur chaar-khams habba", "ایک حبہ اور چار خمس حبہ", "एक हब्बा और चार-ख़ुम्स हब्बा") },
  { id: "dirham", ratti: 25.2, name: N("Shar'i dirham (silver)", "Dirham shar'i (chandi)", "درہم شرعی (چاندی)", "दिरहम शरई (चाँदी)"), note: N("3 masha + 1⅕ ratti", "3 masha, ek ratti aur ratti ka paanchwan hissa", "تین ماشے ایک رتی اور رتی کا پانچواں حصہ", "3 माशा, 1 रत्ती और रत्ती का पाँचवाँ हिस्सा") },
  { id: "dirham10", ratti: 252, name: N("10 dirham (minimum mahr)", "10 dirham (aqall mahr)", "دس درہم (مہر کی اقل مقدار)", "10 दिरहम (महर की न्यूनतम मात्रा)") },
  { id: "mithqal", ratti: 36, name: N("Mithqal / shar'i dinar", "Mithqal ya dinar shar'i", "مثقال یا دینار شرعی", "मिस्क़ाल या दीनार शरई"), note: N("20 qirat = 4½ masha", "20 qirat = saare chaar masha", "بیس قیراط = ساڑھے چار ماشے", "20 क़ीरात = साढ़े चार माशा") },
  { id: "istar", ratti: 162, name: N("Istar", "Istar", "استار", "इस्तार"), note: N("4½ mithqal", "Saare chaar mithqal", "ساڑھے چار مثقال", "साढ़े चार मिस्क़ाल") },
  { id: "ratl", ratti: 3240, name: N("Ratl", "Ratl", "رطل", "रत्ल"), note: N("20 istar (book: 405 masha)", "20 istar (kitab: 405 masha)", "بیس استار (کتاب: ۴۰۵ ماشے)", "20 इस्तार (किताब: 405 माशा)") },
  { id: "awqiya", ratti: 1008, name: N("Awqiya (40 dirham)", "Auqiya (40 dirham)", "اوقیہ (چالیس درہم)", "औक़िया (40 दिरहम)"), note: N("126 masha = 11⅕ rupees", "126 masha = 11 rupay aur khams", "۱۲۶ ماشے = ۱۱ روپے اور خمس", "126 माशा = 11 रुपये और ख़ुम्स") },
  { id: "mann", ratti: 6480, name: N("Mann shar'i / Mudd", "Mann shar'i ya Mudd", "من شرعی یا مُد", "मन शरई या मुद्द"), note: N("2 ratl", "Do ratl", "دو رطل", "दो रत्ल") },
  { id: "saaH", ratti: 17280, name: N("Sa' Hijazi", "Saa' Hijazi", "صاع حجازی", "साअ हिजाज़ी"), note: N("5⅓ ratl", "Paanch ratl aur tihai ratl", "پانچ رطل اور تہائی رطل", "पाँच रत्ल और तिहाई रत्ल") },
  { id: "saaI", ratti: 25920, name: N("Sa' Iraqi", "Saa' Iraqi", "صاع عراقی", "साअ इराक़ी"), note: N("8 ratl", "Aath ratl", "آٹھ رطل", "आठ रत्ल") },
  { id: "fatimi", ratti: 14400, name: N("Mahr-e-Fatimi (400 mithqal silver)", "Mahr-e-Fatimi (400 mithqal chandi)", "مہرِ فاطمی (۴۰۰ مثقال چاندی)", "महर-ए-फ़ातिमी (400 मिस्क़ाल चाँदी)"), note: N("150 tola = 160 rupees", "150 tola = 160 rupay", "۱۵۰ تولے = ۱۶۰ روپے", "150 तोला = 160 रुपये") },
  { id: "nisabG", ratti: 720, name: N("Zakat nisab of gold (7½ tola)", "Sone ka nisab (saade saat tola)", "سونے کا زکاتی نصاب (ساڑھے ۷ تولے)", "सोने का ज़कात निसाब (साढ़े 7 तोला)") },
  { id: "nisabS", ratti: 5040, name: N("Zakat nisab of silver (52½ tola)", "Chandi ka nisab (saade bawan tola)", "چاندی کا زکاتی نصاب (ساڑھے ۵۲ تولے)", "चाँदी का ज़कात निसाब (साढ़े 52 तोला)") }
];

const r1 = (n: number) => Math.round(n * 10) / 10;
export function ratti2parts(R: number) {
  const tola = Math.floor(R / 96); let rem = R - tola * 96;
  const masha = Math.floor(rem / 8); rem = r1(rem - masha * 8);
  return { tola, masha, ratti: rem };
}
export const rattiToGrams = (R: number) => Math.round(R * RATTI_G * 10000) / 10000;
export const rattiToRupee = (R: number) => R / 90;
