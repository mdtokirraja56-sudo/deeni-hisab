// lib/copyHow.ts - small labels for "How is it calculated?", Share and Save-as-PDF, 4 languages.
import type { Lang } from "./heirs";

const en = {
  howTitle: "How is it calculated?", share: "Share (WhatsApp)", savePdf: "Save as PDF", copied: "Result copied. Paste it anywhere.",
  reportTitle: "Calculation report", date: "Date", linkLine: "Calculated on DEENI HISAB",
  zNet: "Zakat = net wealth × 2.5%", zNisab: "Nisab check"
};
export type CopyHow = typeof en;

export const copyHow: Record<Lang, CopyHow> = {
  en,
  roman: {
    howTitle: "Yeh kaise nikla?", share: "Share (WhatsApp)", savePdf: "PDF mein save karein", copied: "Natija copy ho gaya. Kahin bhi paste karein.",
    reportTitle: "Hisab ki report", date: "Tareekh", linkLine: "DEENI HISAB par hisab kiya gaya",
    zNet: "Zakat = khalis maal × 2.5%", zNisab: "Nisab ki jaanch"
  },
  ur: {
    howTitle: "یہ کیسے نکلا؟", share: "شیئر کریں (واٹس ایپ)", savePdf: "پی ڈی ایف میں محفوظ کریں", copied: "نتیجہ کاپی ہو گیا۔ کہیں بھی پیسٹ کریں۔",
    reportTitle: "حساب کی رپورٹ", date: "تاریخ", linkLine: "دینی حساب پر حساب کیا گیا",
    zNet: "زکوٰۃ = خالص مال × 2.5%", zNisab: "نصاب کی جانچ"
  },
  hi: {
    howTitle: "यह कैसे निकला?", share: "शेयर करें (व्हाट्सऐप)", savePdf: "पीडीएफ़ में सेव करें", copied: "नतीजा कॉपी हो गया। कहीं भी पेस्ट करें।",
    reportTitle: "हिसाब की रिपोर्ट", date: "तारीख़", linkLine: "दीनी हिसाब पर हिसाब किया गया",
    zNet: "ज़कात = ख़ालिस माल × 2.5%", zNisab: "निसाब की जाँच"
  }
};
