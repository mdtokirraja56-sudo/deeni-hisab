// lib/copyAbout.ts
// Text for the About dialog (4 languages).
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
}

export const copyAbout: Record<Lang, AboutCopy> = {
  en: {
    menu: "About",
    title: "About DEENI HISAB",
    tagline: "Islamic calculators, explained step by step",
    aboutLabel: "About the project",
    aboutText: "DEENI HISAB makes inheritance (Mirath) and zakat easier to understand. Every result shows its reasons and follows Hanafi fiqh. It is an educational tool, not a fatwa.",
    devLabel: "Developer & Founder",
    devName: "Tauqeer Raza Ashrafi",
    devRole: "Developer & Founder",
    affilLabel: "Academic Affiliation",
    affilValue: "Student, Jamiatur Raza, Bareilly Sharif",
    reviewLabel: "Scholarly review",
    reviewText: "The rules are being reviewed by a qualified Hanafi scholar. Until then, please have every result checked by your own scholar (Aalim) before acting on it.",
    followLabel: "Follow"
  },
  roman: {
    menu: "Taaruf",
    title: "DEENI HISAB ka taaruf",
    tagline: "Islami calculators, qadam ba qadam tashreeh ke saath",
    aboutLabel: "Project ke baare mein",
    aboutText: "DEENI HISAB mirath aur zakat ko samajhna aasaan banata hai. Har natija apni wajah ke saath hai aur Fiqh-e-Hanafi ke mutabiq hai. Ye taleemi tool hai, fatwa nahi.",
    devLabel: "Developer aur Bani",
    devName: "Tauqeer Raza Ashrafi",
    devRole: "Developer aur Bani",
    affilLabel: "Taleemi nisbat",
    affilValue: "Student, Jamiatur Raza, Bareilly Sharif",
    reviewLabel: "Ilmi jaiza",
    reviewText: "In qawaid ka mustanad Hanafi aalim se jaiza jaari hai. Tab tak har natija par amal se pehle apne aalim se zaroor check karwa lein.",
    followLabel: "Follow karein"
  },
  ur: {
    menu: "تعارف",
    title: "دینی حساب کا تعارف",
    tagline: "اسلامی کیلکولیٹرز، قدم بہ قدم تشریح کے ساتھ",
    aboutLabel: "پروجیکٹ کے بارے میں",
    aboutText: "دینی حساب میراث اور زکوٰۃ کو سمجھنا آسان بناتا ہے۔ ہر نتیجہ اپنی وجہ کے ساتھ ہے اور فقہِ حنفی کے مطابق ہے۔ یہ تعلیمی ٹول ہے، فتویٰ نہیں۔",
    devLabel: "ڈویلپر اور بانی",
    devName: "توقیر رضا اشرفی",
    devRole: "ڈویلپر اور بانی",
    affilLabel: "تعلیمی نسبت",
    affilValue: "طالبِ علم، جامعۃ الرضا، بریلی شریف",
    reviewLabel: "علمی جائزہ",
    reviewText: "ان قواعد کا مستند حنفی عالم سے جائزہ جاری ہے۔ تب تک ہر نتیجے پر عمل سے پہلے اپنے عالم سے ضرور چیک کروا لیں۔",
    followLabel: "فالو کریں"
  },
  hi: {
    menu: "तआरुफ़",
    title: "दीनी हिसाब का तआरुफ़",
    tagline: "इस्लामी कैलकुलेटर, क़दम-ब-क़दम तशरीह के साथ",
    aboutLabel: "प्रोजेक्ट के बारे में",
    aboutText: "दीनी हिसाब मीरास और ज़कात को समझना आसान बनाता है। हर नतीजा अपनी वजह के साथ है और फ़िक़्ह-ए-हनफ़ी के मुताबिक़ है। यह शैक्षिक टूल है, फ़तवा नहीं।",
    devLabel: "डेवलपर एवं संस्थापक",
    devName: "तौक़ीर रज़ा अशरफ़ी",
    devRole: "डेवलपर एवं संस्थापक",
    affilLabel: "शैक्षिक संबद्धता",
    affilValue: "छात्र, जामिअतुर्रज़ा, बरेली शरीफ़",
    reviewLabel: "इल्मी जायज़ा",
    reviewText: "इन क़वाइद का मुस्तनद हनफ़ी आलिम से जायज़ा जारी है। तब तक हर नतीजे पर अमल से पहले अपने आलिम से ज़रूर चेक करवा लें।",
    followLabel: "फ़ॉलो करें"
  }
};
