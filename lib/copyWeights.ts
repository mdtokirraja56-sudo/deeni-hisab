// lib/copyWeights.ts - text for the Tola / Masha / Ratti converter, 4 languages.
import type { Lang } from "./heirs";

const en = {
  chip: "Tola · Masha · Gram",
  title: "Tola, Masha, Ratti converter", sub: "For gold and silver: convert to grams and back",
  mode: "What do you want to convert?", toGrams: "Tola / Masha / Ratti → Gram", toTola: "Gram → Tola / Masha / Ratti",
  tola: "Tola", masha: "Masha", ratti: "Ratti", gram: "Gram",
  fieldHint: "Fill any of the three boxes. Leave the others empty.",
  errEmpty: "Enter at least one value.", errGram: "Enter the weight in grams.",
  rGrams: "Weight in grams", rParts: "In tola, masha, ratti", rDecimal: "In tola (decimal)",
  tolaWord: "tola", mashaWord: "masha", rattiWord: "ratti",
  priceTitle: "Value (optional)", price: "Price per gram", value: "Value",
  tableTitle: "Quick reference",
  refLine: "1 tola = 12 masha · 1 masha = 8 ratti · 1 tola = 11.664 g · 1 masha = 0.972 g · 1 ratti = 0.1215 g",
  nisabGold: "Gold nisab (7.5 tola)", nisabSilver: "Silver nisab (52.5 tola)",
  note: "The tola weight 11.664 g is the commonly used figure. Please have it confirmed by your own scholar (Aalim)."
};
export type CopyWeights = typeof en;

export const copyWeights: Record<Lang, CopyWeights> = {
  en,
  roman: {
    chip: "Tola · Masha · Gram",
    title: "Tola, Masha, Ratti converter", sub: "Sone chaandi ke liye: gram mein badlein aur wapas",
    mode: "Kya badalna hai?", toGrams: "Tola / Masha / Ratti → Gram", toTola: "Gram → Tola / Masha / Ratti",
    tola: "Tola", masha: "Masha", ratti: "Ratti", gram: "Gram",
    fieldHint: "Teeno mein se jo maloom ho woh bharein, baaqi khaali chhod dein.",
    errEmpty: "Kam az kam ek qeemat likhein.", errGram: "Wazan gram mein likhein.",
    rGrams: "Gram mein wazan", rParts: "Tola, masha, ratti mein", rDecimal: "Tola mein (dashmalav)",
    tolaWord: "tola", mashaWord: "masha", rattiWord: "ratti",
    priceTitle: "Qeemat (marzi)", price: "Qeemat fi gram", value: "Qeemat",
    tableTitle: "Fauri hawala",
    refLine: "1 tola = 12 masha · 1 masha = 8 ratti · 1 tola = 11.664 g · 1 masha = 0.972 g · 1 ratti = 0.1215 g",
    nisabGold: "Sone ka nisab (7.5 tola)", nisabSilver: "Chaandi ka nisab (52.5 tola)",
    note: "Tola ka wazan 11.664 g aam taur par istemal hota hai. Apne aalim se tasdeeq karwa lein."
  },
  ur: {
    chip: "تولہ · ماشہ · گرام",
    title: "تولہ، ماشہ، رتی کنورٹر", sub: "سونے چاندی کے لیے: گرام میں بدلیں اور واپس",
    mode: "کیا بدلنا ہے؟", toGrams: "تولہ / ماشہ / رتی ← گرام", toTola: "گرام ← تولہ / ماشہ / رتی",
    tola: "تولہ", masha: "ماشہ", ratti: "رتی", gram: "گرام",
    fieldHint: "تینوں میں سے جو معلوم ہو وہ بھریں، باقی خالی چھوڑ دیں۔",
    errEmpty: "کم از کم ایک قیمت لکھیں۔", errGram: "وزن گرام میں لکھیں۔",
    rGrams: "گرام میں وزن", rParts: "تولہ، ماشہ، رتی میں", rDecimal: "تولہ میں (اعشاریہ)",
    tolaWord: "تولہ", mashaWord: "ماشہ", rattiWord: "رتی",
    priceTitle: "قیمت (اختیاری)", price: "قیمت فی گرام", value: "قیمت",
    tableTitle: "فوری حوالہ",
    refLine: "1 تولہ = 12 ماشہ · 1 ماشہ = 8 رتی · 1 تولہ = 11.664 گرام · 1 ماشہ = 0.972 گرام · 1 رتی = 0.1215 گرام",
    nisabGold: "سونے کا نصاب (7.5 تولہ)", nisabSilver: "چاندی کا نصاب (52.5 تولہ)",
    note: "تولہ کا وزن 11.664 گرام عام طور پر استعمال ہوتا ہے۔ اپنے عالم سے تصدیق کروا لیں۔"
  },
  hi: {
    chip: "तोला · माशा · ग्राम",
    title: "तोला, माशा, रत्ती कन्वर्टर", sub: "सोने-चाँदी के लिए: ग्राम में बदलें और वापस",
    mode: "क्या बदलना है?", toGrams: "तोला / माशा / रत्ती → ग्राम", toTola: "ग्राम → तोला / माशा / रत्ती",
    tola: "तोला", masha: "माशा", ratti: "रत्ती", gram: "ग्राम",
    fieldHint: "तीनों में से जो मालूम हो वह भरें, बाक़ी ख़ाली छोड़ दें।",
    errEmpty: "कम से कम एक क़ीमत लिखें।", errGram: "वज़न ग्राम में लिखें।",
    rGrams: "ग्राम में वज़न", rParts: "तोला, माशा, रत्ती में", rDecimal: "तोला में (दशमलव)",
    tolaWord: "तोला", mashaWord: "माशा", rattiWord: "रत्ती",
    priceTitle: "क़ीमत (वैकल्पिक)", price: "क़ीमत प्रति ग्राम", value: "क़ीमत",
    tableTitle: "त्वरित संदर्भ",
    refLine: "1 तोला = 12 माशा · 1 माशा = 8 रत्ती · 1 तोला = 11.664 ग्राम · 1 माशा = 0.972 ग्राम · 1 रत्ती = 0.1215 ग्राम",
    nisabGold: "सोने का निसाब (7.5 तोला)", nisabSilver: "चाँदी का निसाब (52.5 तोला)",
    note: "तोले का वज़न 11.664 ग्राम आम तौर पर इस्तेमाल होता है। अपने आलिम से तस्दीक़ करवा लें।"
  }
};
