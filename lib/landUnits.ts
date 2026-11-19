// lib/landUnits.ts - names of regional land units. NO sizes here: sizes differ by region,
// so the user enters them from their own land record.
export type Grp = "north" | "east" | "south" | "hills";
export interface LocalUnit { id: string; en: string; ur: string; hi: string; common?: boolean; grp: Grp }
export const LOCAL_UNITS: LocalUnit[] = [
  { id: "bigha", en: "Bigha", ur: "بیگھہ", hi: "बीघा", common: true, grp: "north" },
  { id: "kattha", en: "Kattha", ur: "کٹھا", hi: "कट्ठा", common: true, grp: "north" },
  { id: "dhur", en: "Dhur", ur: "دھُر", hi: "धुर", grp: "north" },
  { id: "pbigha", en: "Pucca Bigha", ur: "پکا بیگھہ", hi: "पक्का बीघा", grp: "north" },
  { id: "kbigha", en: "Kachcha Bigha", ur: "کچا بیگھہ", hi: "कच्चा बीघा", grp: "north" },
  { id: "biswa", en: "Biswa", ur: "بسوہ", hi: "बिस्वा", grp: "north" },
  { id: "biswansi", en: "Biswansi", ur: "بسوانسی", hi: "बिस्वांसी", grp: "north" },
  { id: "dhurki", en: "Dhurki", ur: "دھُرکی", hi: "धुरकी", grp: "north" },
  { id: "kanal", en: "Kanal", ur: "کنال", hi: "कनाल", grp: "north" },
  { id: "marla", en: "Marla", ur: "مرلہ", hi: "मरला", grp: "north" },
  { id: "karam", en: "Karam", ur: "کرم", hi: "करम", grp: "north" },
  { id: "sarsai", en: "Sarsai", ur: "سرسائی", hi: "सरसाई", grp: "north" },
  { id: "killa", en: "Killa", ur: "کِلہ", hi: "किल्ला", grp: "north" },
  { id: "chatak", en: "Chatak", ur: "چھٹاک", hi: "छटाँक", grp: "east" },
  { id: "lessa", en: "Lessa", ur: "لیسہ", hi: "लेसा", grp: "east" },
  { id: "gonda", en: "Gonda", ur: "گنڈا", hi: "गंडा", grp: "east" },
  { id: "kora", en: "Kora", ur: "کوری", hi: "कोरा", grp: "east" },
  { id: "latcha", en: "Latcha", ur: "لچھا", hi: "लच्छा", grp: "east" },
  { id: "guntha", en: "Guntha", ur: "گنٹھا", hi: "गुंठा", grp: "south" },
  { id: "gajam", en: "Gajam", ur: "گجَم", hi: "गजम", grp: "south" },
  { id: "ankanam", en: "Ankanam", ur: "انکانم", hi: "अंकनम", grp: "south" },
  { id: "kuncham", en: "Kuncham", ur: "کنچم", hi: "कुंचम", grp: "south" },
  { id: "ground", en: "Ground", ur: "گراؤنڈ", hi: "ग्राउंड", grp: "south" },
  { id: "nali", en: "Nali", ur: "نالی", hi: "नाली", grp: "hills" },
  { id: "muthi", en: "Muthi", ur: "مُٹھی", hi: "मुट्ठी", grp: "hills" }
];
export const GROUPS: Grp[] = ["north", "east", "south", "hills"];
export const unitName = (u: LocalUnit, lang: string) => (lang === "ur" ? u.ur : lang === "hi" ? u.hi : u.en);
