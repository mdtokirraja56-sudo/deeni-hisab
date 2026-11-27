// Labels for the Munasakha "naqsha" (book layout: Tarazi / Sharh Siraji pp. 207-217, Sirajiya pp. 85-89 and its Urdu sharh).
import type { Lang } from "../lib/heirs";

const ORD: Record<Lang, string[]> = {
  ur: ["اول", "ثانی", "ثالث", "رابع", "خامس", "سادس", "سابع", "ثامن", "تاسع", "عاشر"],
  hi: ["अव्वल", "सानी", "सालिस", "राबिअ", "ख़ामिस", "सादिस", "साबिअ", "सामिन", "तासिअ", "आशिर"],
  roman: ["awwal", "sani", "salis", "rabi'", "khamis", "sadis", "sabi'", "samin", "tasi'", "ashir"],
  en: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
};
const FR: Record<Lang, Record<string, string>> = {
  ur: { "1/2": "نصف", "1/4": "ربع", "1/8": "ثمن", "2/3": "ثلثان", "1/3": "ثلث", "1/6": "سدس" },
  hi: { "1/2": "निस्फ़", "1/4": "रुबुअ", "1/8": "सुमुन", "2/3": "सुलुसान", "1/3": "सुलुस", "1/6": "सुदुस" },
  roman: { "1/2": "nisf", "1/4": "rub'", "1/8": "sumn", "2/3": "sulusan", "1/3": "sulus", "1/6": "sudus" },
  en: { "1/2": "half", "1/4": "quarter", "1/8": "eighth", "2/3": "two-thirds", "1/3": "third", "1/6": "sixth" },
};
const WAFQ: Record<Lang, string[]> = {
  ur: ["", "", "نصف", "ثلث", "ربع", "خمس", "سدس", "سبع", "ثمن", "تسع", "عشر"],
  hi: ["", "", "निस्फ़", "सुलुस", "रुबुअ", "ख़ुमुस", "सुदुस", "सुबुअ", "सुमुन", "तुसुअ", "उशुर"],
  roman: ["", "", "nisf", "sulus", "rub'", "khums", "sudus", "sub'", "sumn", "tus'", "ushr"],
  en: ["", "", "half", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"],
};
export interface BookText {
  batn: (i: number) => string; masala: string; asabaW: string; thirdOfRest: string; mabalagh: string; ahya: string; maa: string;
  rel: { istiqama: string; mumathala: string; muwafaqa: (g: string) => string; mubayana: string; mudakhala: (g: string) => string };
  frac: (f: string | null) => string; milaan: string; tarkaCol: string; total: string; first: string; dies: string;
  rules: string[]; rulesTitle: string;
  namesTitle: string; namesHint: string; namePh: string; firstDead: string; firstDeadPh: string;
  radd: (r: { A: string; sp: string; baqi: string; B: string; Bp: string; rel: string; zSp: string; zOt: string; total: string }) => string;
  raddRel: { tamathul: string; tawafuq: string; tabayun: string };
}
export const BK: Record<Lang, BookText> = {
  ur: {
    namesTitle: 'سب کے نام (اختیاری)', namesHint: 'کسی کا بھی نام لکھ دیں؛ نتیجے میں یہی نام آئے گا۔ نہ لکھیں تو رشتہ لکھا آئے گا۔', namePh: 'نام', firstDead: 'پہلی میت کا نام', firstDeadPh: 'پہلی میت (نام)',
    radd: (r) => `مسئلہ ردیہ: زوج کا مسئلہ ${r.A} (اسے ${r.sp}، باقی ${r.baqi})؛ من یردعلیہ کا مسئلہ ${r.B} رد سے ${r.Bp}۔ ${r.baqi} اور ${r.Bp} کے درمیان ${r.rel}، لہٰذا زوج کے سہام ×${r.zSp} اور باقی ورثاء کے ×${r.zOt} ← تصحیح ${r.total}`,
    raddRel: { tamathul: "تماثل", tawafuq: "توافق", tabayun: "تباین" },
    batn: (i) => `بطن ${ORD.ur[i - 1] ?? i}`, masala: "مسئلہ", asabaW: "عصبہ", thirdOfRest: "ثلث ما بقی", mabalagh: "المبلغ", ahya: "الأحیاء", maa: "مع",
    rel: { istiqama: "استقامت", mumathala: "تماثل", muwafaqa: (g) => `توافق بال${WAFQ.ur[+g] ?? g}`, mubayana: "تباین", mudakhala: (g) => `تداخل بحکم توافق بال${WAFQ.ur[+g] ?? g}` },
    frac: (f) => (f ? FR.ur[f] ?? f : ""), milaan: "پڑتال", tarkaCol: "ترکہ", total: "کل", first: "میت", dies: "فوت ہوا",
    rulesTitle: "اصولِ مناسخہ (شرح سراجی)",
    rules: ["پہلے میت اول کے مسئلے کی تصحیح کریں اور اس کے ورثہ کو سہام دیں۔", "پھر میت ثانی کے مسئلے کی تصحیح کریں؛ میت ثانی کا حصہ جو میت اول سے ملا اسے ما في اليد کہتے ہیں۔", "ما في اليد اور تصحیح ثانی میں نسبت دیکھیں: تماثل ہو تو کچھ ضرب نہیں؛ توافق ہو تو تصحیح ثانی کے وفق کو تصحیح اول میں ضرب دیں؛ تباین ہو تو کل تصحیح ثانی کو تصحیح اول میں ضرب دیں۔", "جس مسئلے کی تصحیح (یا اس کے وفق) کو ضرب دی، اسی کے ورثہ کے سہام کو ما في اليد (یا اس کے وفق) میں ضرب دیں؛ پچھلے مسئلوں کے ورثہ کے سہام کو مضروب میں ضرب دیں۔", "تیسرا، چوتھا مسئلہ ہو تو مبلغ کو پہلے مسئلے کی جگہ سمجھیں اور یہی عمل دہرائیں۔"],
  },
  hi: {
    namesTitle: 'सबके नाम (ज़रूरी नहीं)', namesHint: 'किसी का भी नाम लिख दें; नतीजे में यही नाम आएगा। न लिखें तो रिश्ता लिखा आएगा।', namePh: 'नाम', firstDead: 'पहली मय्यित का नाम', firstDeadPh: 'पहली मय्यित (नाम)',
    radd: (r) => `मसअला रद्दिया: ज़ौज का मसअला ${r.A} (उसे ${r.sp}, बाक़ी ${r.baqi}); मन यरुद्द अलैहि का मसअला ${r.B}, रद्द से ${r.Bp}। ${r.baqi} और ${r.Bp} के दरमियान ${r.rel}, इसलिए ज़ौज के सिहाम ×${r.zSp} और बाक़ी वारिसों के ×${r.zOt} ← तस्हीह ${r.total}`,
    raddRel: { tamathul: "तमासुल", tawafuq: "तवाफ़ुक़", tabayun: "तबायुन" },
    batn: (i) => `बत्न ${ORD.hi[i - 1] ?? i}`, masala: "मसअला", asabaW: "असबा", thirdOfRest: "सुलुस मा बक़ी", mabalagh: "अल-मब्लग़", ahya: "अल-अहया", maa: "मअ",
    rel: { istiqama: "इस्तिक़ामत", mumathala: "तमासुल", muwafaqa: (g) => `तवाफ़ुक़ बिल-${WAFQ.hi[+g] ?? g}`, mubayana: "तबायुन", mudakhala: (g) => `तदाख़ुल ब-हुक्म तवाफ़ुक़ बिल-${WAFQ.hi[+g] ?? g}` },
    frac: (f) => (f ? FR.hi[f] ?? f : ""), milaan: "पड़ताल", tarkaCol: "तरका", total: "कुल", first: "मय्यित", dies: "फ़ौत हुआ",
    rulesTitle: "उसूल-ए-मुनासख़ा (शरह सिराजी)",
    rules: ["पहले मय्यित अव्वल के मसअले की तस्हीह करें और उसके वारिसों को सिहाम दें।", "फिर मय्यित सानी के मसअले की तस्हीह करें; मय्यित सानी का जो हिस्सा मय्यित अव्वल से मिला उसे मा फ़ी यदिही कहते हैं।", "मा फ़ी यदिही और तस्हीह-ए-सानी में निस्बत देखें: तमासुल हो तो कुछ ज़र्ब नहीं; तवाफ़ुक़ हो तो तस्हीह-ए-सानी के वफ़्क़ को तस्हीह-ए-अव्वल में ज़र्ब दें; तबायुन हो तो पूरी तस्हीह-ए-सानी को तस्हीह-ए-अव्वल में ज़र्ब दें।", "जिस मसअले की तस्हीह (या वफ़्क़) को ज़र्ब दी, उसी के वारिसों के सिहाम को मा फ़ी यदिही (या उसके वफ़्क़) में ज़र्ब दें; पिछले मसअलों के वारिसों के सिहाम को मज़रूब में ज़र्ब दें।", "तीसरा, चौथा मसअला हो तो मब्लग़ को पहले मसअले की जगह समझें और यही अमल दोहराएँ।"],
  },
  roman: {
    namesTitle: 'Sab ke naam (ikhtiyari)', namesHint: 'Kisi ka bhi naam likh dein; nateeje mein wahi naam aayega. Na likhein to rishta likha aayega.', namePh: 'Naam', firstDead: 'Pehli mayyit ka naam', firstDeadPh: 'Pehli mayyit (naam)',
    radd: (r) => `Masla raddiya: zauj ka masla ${r.A} (use ${r.sp}, baqi ${r.baqi}); man yuradd alayhi ka masla ${r.B}, radd se ${r.Bp}. ${r.baqi} aur ${r.Bp} ke darmiyan ${r.rel}, lihaza zauj ke siham ×${r.zSp} aur baqi warison ke ×${r.zOt} → tashih ${r.total}`,
    raddRel: { tamathul: "tamasul", tawafuq: "tawafuq", tabayun: "tabayun" },
    batn: (i) => `Batn ${ORD.roman[i - 1] ?? i}`, masala: "Masla", asabaW: "Asaba", thirdOfRest: "Sulus ma baqi", mabalagh: "Al-Mablagh", ahya: "Al-Ahya", maa: "ma'a",
    rel: { istiqama: "Istiqamat", mumathala: "Tamasul", muwafaqa: (g) => `Tawafuq bil-${WAFQ.roman[+g] ?? g}`, mubayana: "Tabayun", mudakhala: (g) => `Tadakhul ba-hukm Tawafuq bil-${WAFQ.roman[+g] ?? g}` },
    frac: (f) => (f ? FR.roman[f] ?? f : ""), milaan: "Partal", tarkaCol: "Tarka", total: "Kul", first: "Mayyit", dies: "Faut hua",
    rulesTitle: "Usool-e-Munasakha (Sharh Siraji)",
    rules: ["Pehle mayyit awwal ke masle ki tashih karein aur uske warison ko siham dein.", "Phir mayyit sani ke masle ki tashih karein; mayyit sani ka jo hissa mayyit awwal se mila use ma fi yadihi kehte hain.", "Ma fi yadihi aur tashih-e-sani mein nisbat dekhein: tamasul ho to kuch zarb nahi; tawafuq ho to tashih-e-sani ke wafq ko tashih-e-awwal mein zarb dein; tabayun ho to poori tashih-e-sani ko tashih-e-awwal mein zarb dein.", "Jis masle ki tashih (ya wafq) ko zarb di, usi ke warison ke siham ko ma fi yadihi (ya uske wafq) mein zarb dein; pichhle maslon ke warison ke siham ko mazroob mein zarb dein.", "Teesra, chautha masla ho to mablagh ko pehle masle ki jagah samjhein aur yehi amal dohrayein."],
  },
  en: {
    namesTitle: "Everyone's names (optional)", namesHint: 'Type any name; it will be used in the result. If left empty, the relation is shown.', namePh: 'Name', firstDead: 'Name of the first deceased', firstDeadPh: 'First deceased (name)',
    radd: (r) => `Radd masala: the spouse's own masala ${r.A} (he gets ${r.sp}, remainder ${r.baqi}); the masala of those who receive radd is ${r.B}, reduced to ${r.Bp}. Between ${r.baqi} and ${r.Bp}: ${r.rel}; so the spouse's parts ×${r.zSp} and the others' ×${r.zOt} → tasheeh ${r.total}`,
    raddRel: { tamathul: "equal", tawafuq: "common factor", tabayun: "no common factor" },
    batn: (i) => `Generation ${ORD.en[i - 1] ?? i}`, masala: "Masala", asabaW: "Asaba", thirdOfRest: "third of the remainder", mabalagh: "Al-Mablagh (total)", ahya: "Al-Ahya (living heirs)", maa: "with",
    rel: { istiqama: "Istiqama (divides evenly)", mumathala: "Tamathul (equal)", muwafaqa: (g) => `Tawafuq (common factor, ${WAFQ.en[+g] ?? g})`, mubayana: "Tabayun (no common factor)", mudakhala: (g) => `Tadakhul by the rule of tawafuq (${WAFQ.en[+g] ?? g})` },
    frac: (f) => (f ? FR.en[f] ?? f : ""), milaan: "Check", tarkaCol: "Estate", total: "Total", first: "Deceased", dies: "Died",
    rulesTitle: "Rules of Munasakha (Sharh Siraji)",
    rules: ["First solve the 1st deceased's masala to tasheeh and give his heirs their parts.", "Then solve the 2nd deceased's masala; what he received from the 1st is his ma fi yadihi.", "Compare ma fi yadihi with the 2nd tasheeh: equal — nothing to multiply; common factor — multiply the 1st tasheeh by the 2nd tasheeh's wafq; no common factor — multiply it by the whole 2nd tasheeh.", "The heirs of the masala whose tasheeh was multiplied have their parts multiplied by ma fi yadihi (or its wafq); earlier heirs' parts by the multiplier.", "For a 3rd, 4th death the mablagh stands in for the first masala and the same steps repeat."],
  },
};
