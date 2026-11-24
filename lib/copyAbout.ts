// lib/copyAbout.ts
// About dialog: written in all four app languages. It changes together with the app language.
// No official approval or supervision is claimed: the scholarly-review text only says the rules are subject to review.
import type { Lang } from "./heirs";

export interface AboutCopy {
  menu: string;
  title: string;
  tagline: string;
  aboutLabel: string;
  aboutText: string;
  devLabel: string;
  devName: string;
  devRole: string;
  affilLabel: string;
  affilValue: string;
  reviewLabel: string;
  reviewText: string;
  followLabel: string;
  close: string;
}

const EN: AboutCopy = {
  menu: "About",
  title: "About Deeni Hisab",
  tagline: "Islamic calculators with clear, step-by-step explanations",
  aboutLabel: "About Deeni Hisab",
  aboutText: "Deeni Hisab is an Islamic educational and calculation project designed to help Muslims understand Islamic inheritance (Mirath), Zakat, and other Islamic calculations in a simple, clear, and accessible way.\n\nEach calculation aims to provide a transparent breakdown and explanation of the method used. This is an educational tool, not a fatwa.",
  devLabel: "Developer & Founder",
  devName: "Tauqeer Raza Ashrafi",
  devRole: "Developer & Founder",
  affilLabel: "Academic Affiliation",
  affilValue: "Student — Jamiatur Raza, Bareilly Sharif",
  reviewLabel: "Scholarly Review",
  reviewText: "The Islamic calculation rules are subject to review by qualified Hanafi scholars. Please consult a qualified scholar before acting on any result.",
  followLabel: "Follow",
  close: "Close"
};

const ROMAN: AboutCopy = {
  menu: "Hamare baare mein",
  title: "Deeni Hisab ke baare mein",
  tagline: "Saaf aur tarteeb-war wazahat ke saath Islami hisaab",
  aboutLabel: "Deeni Hisab ke baare mein",
  aboutText: "Deeni Hisab ek Islami taleemi aur hisaabi project hai, jiska maqsad Musalmanon ke liye Mirath, Zakat aur deegar shar'i hisaabaat ko aasan, saaf aur qaabil-e-fahm banana hai.\n\nHar hisaab ke saath uski tafseel aur tareeqa-e-hisaab pesh karne ki koshish ki gayi hai. Yeh ek taleemi zariya hai, fatwa nahi.",
  devLabel: "Developer aur Founder",
  devName: "Tauqeer Raza Ashrafi",
  devRole: "Developer aur Founder",
  affilLabel: "Taleemi nisbat",
  affilValue: "Talib-e-ilm — Jamiatur Raza, Bareilly Sharif",
  reviewLabel: "Ilmi jaiza",
  reviewText: "Islami hisaab ke qawaid ka mustanad Hanafi ulama se jaiza liya jana hai. Kisi bhi natije par amal se pehle kisi mustanad Aalim se zaroor mashwara kar lein.",
  followLabel: "Humein follow karein",
  close: "Band karein"
};

const UR: AboutCopy = {
  menu: "ہمارے بارے میں",
  title: "دینی حساب کے بارے میں",
  tagline: "واضح اور مرحلہ وار وضاحت کے ساتھ اسلامی حسابات",
  aboutLabel: "دینی حساب کے بارے میں",
  aboutText: "دینی حساب ایک اسلامی تعلیمی و حسابی پروجیکٹ ہے، جس کا مقصد مسلمانوں کے لیے میراث، زکوٰۃ اور دیگر شرعی حسابات کو آسان، واضح اور قابلِ فہم بنانا ہے۔\n\nہر حساب کے ساتھ اس کی تفصیل اور طریقۂ حساب پیش کرنے کی کوشش کی گئی ہے۔ یہ ایک تعلیمی ذریعہ ہے، فتویٰ نہیں۔",
  devLabel: "ڈیولپر و بانی",
  devName: "توقیر رضا اشرفی",
  devRole: "ڈیولپر و بانی",
  affilLabel: "علمی نسبت",
  affilValue: "طالب علم — جامعۃ الرضا، بریلی شریف",
  reviewLabel: "علمی جائزہ",
  reviewText: "اسلامی حسابات کے قواعد مستند حنفی علما سے جائزے کے محتاج ہیں۔ کسی بھی نتیجے پر عمل سے پہلے کسی مستند عالم سے ضرور مشورہ کر لیں۔",
  followLabel: "ہمیں فالو کریں",
  close: "بند کریں"
};

const HI: AboutCopy = {
  menu: "हमारे बारे में",
  title: "दीनी हिसाब के बारे में",
  tagline: "साफ़ और क़दम-ब-क़दम वज़ाहत के साथ इस्लामी हिसाब",
  aboutLabel: "दीनी हिसाब के बारे में",
  aboutText: "दीनी हिसाब एक इस्लामी तालीमी और हिसाबी प्रोजेक्ट है, जिसका मक़सद मुसलमानों के लिए मीरास, ज़कात और दूसरे शरई हिसाबात को आसान, साफ़ और समझने के क़ाबिल बनाना है।\n\nहर हिसाब के साथ उसकी तफ़सील और हिसाब का तरीक़ा पेश करने की कोशिश की गई है। यह एक तालीमी ज़रिया है, फ़तवा नहीं।",
  devLabel: "डेवलपर व संस्थापक",
  devName: "तौक़ीर रज़ा अशरफ़ी",
  devRole: "डेवलपर व संस्थापक",
  affilLabel: "इल्मी निस्बत",
  affilValue: "तालिब-ए-इल्म — जामिअतुर्रज़ा, बरेली शरीफ़",
  reviewLabel: "इल्मी जायज़ा",
  reviewText: "इस्लामी हिसाब के क़वाइद का मुस्तनद हनफ़ी उलमा से जायज़ा लिया जाना है। किसी भी नतीजे पर अमल से पहले किसी मुस्तनद आलिम से ज़रूर मशविरा कर लें।",
  followLabel: "हमें फ़ॉलो करें",
  close: "बंद करें"
};

export const copyAbout: Record<Lang, AboutCopy> = { en: EN, roman: ROMAN, ur: UR, hi: HI };
