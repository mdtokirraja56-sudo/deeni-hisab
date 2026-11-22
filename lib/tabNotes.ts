// lib/tabNotes.ts - side "important note", different for each tab (so Mirath text does not appear on Zakat / More).
import type { Lang } from "./heirs";

export type NoteTab = "zakat" | "more";
export const tabNotes: Record<NoteTab, Record<Lang, string>> = {
  zakat: {
    roman: "Yeh taleemi interface hai, fatwa nahi. Zakat ka hisaab hawl (qamari saal), nisab, qabil-e-wasooli qarz aur maal ki qism par munhasir hai. Zakat ada karne se pehle apne Aalim se tasdeeq kar lein.",
    en: "This is an educational interface, not a fatwa. Zakat depends on the lunar year (hawl), nisab, recoverable debts and the type of wealth. Please confirm with your scholar before paying.",
    ur: "یہ تعلیمی انٹرفیس ہے، فتویٰ نہیں۔ زکوٰۃ کا حساب حولان (قمری سال)، نصاب، قابلِ وصولی قرض اور مال کی قسم پر منحصر ہے۔ زکوٰۃ ادا کرنے سے پہلے اپنے عالم سے تصدیق کر لیں۔",
    hi: "यह शैक्षिक इंटरफ़ेस है, फ़तवा नहीं। ज़कात का हिसाब हौल (क़मरी साल), निसाब, वसूल होने लायक़ क़र्ज़ और माल की क़िस्म पर मुनहसिर है। ज़कात अदा करने से पहले अपने आलिम से तस्दीक़ कर लें।"
  },
  more: {
    roman: "Yeh taleemi interface hai, fatwa nahi. Sadqa-e-Fitr, Ushr, Fidya, Kaffara jaise har masle ke apne alag ahkaam hain. Raqam ada karne se pehle apne Aalim se tasdeeq kar lein.",
    en: "This is an educational interface, not a fatwa. Sadaqah-e-Fitr, Ushr, Fidya and Kaffarah each have their own rulings. Please confirm with your scholar before paying.",
    ur: "یہ تعلیمی انٹرفیس ہے، فتویٰ نہیں۔ صدقۂ فطر، عشر، فدیہ اور کفارہ ہر ایک کے اپنے الگ احکام ہیں۔ ادا کرنے سے پہلے اپنے عالم سے تصدیق کر لیں۔",
    hi: "यह शैक्षिक इंटरफ़ेस है, फ़तवा नहीं। सदक़ा-ए-फ़ित्र, उश्र, फ़िदया और कफ़्फ़ारा हर एक के अपने अलग अहकाम हैं। अदा करने से पहले अपने आलिम से तस्दीक़ कर लें।"
  }
};
