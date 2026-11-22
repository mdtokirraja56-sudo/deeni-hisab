// lib/copyZakatWiz.ts - texts of the step-by-step Zakat screen (4 languages).
import type { Lang } from "./heirs";

export interface CopyZakatWiz {
  steps: string[]; of: string; next: string; back: string; again: string; yes: string; no: string;
  gate: string[]; running: string; assets: string; debts: string; pricesFirst: string; goPrices: string;
  tradeNote: string; recvNote: string; debtNote: string; goldNote: string;
  khumsTitle: string; khumsOn: string; khumsInfo: string; base: string; afw: string; hawlHead: string; fillFirst: string;
}

export const copyZakatWiz: Record<Lang, CopyZakatWiz> = {
  en: {
    steps: ["Prices", "Cash", "Gold & silver", "Business", "Money owed to you", "Your debts", "Result"],
    of: "of", next: "Next", back: "Back", again: "Start again", yes: "Yes", no: "No",
    gate: ["", "", "Do you own gold or silver (including jewellery)?", "Do you do business or hold goods for sale?", "Does anyone owe you money, or do you have a provident fund or committee?", "Do you owe money to anyone?"],
    running: "So far", assets: "Wealth", debts: "Debts", pricesFirst: "Enter the silver price first (nisab is worked out from silver).", goPrices: "Go to prices",
    tradeNote: "A plot or vehicle counts only if you bought it to sell. A shop, a rented building and household goods are not counted; count the rent you received instead (Faizan-e-Zakat pp. 42-45).",
    recvNote: "Zakat is due on these every year, but it becomes payable once at least one fifth of nisab is received (pp. 48-55). Do not add money you have no hope of getting back.",
    debtNote: "Subtract only debts that a person can demand, taken before the year ended. Deferred mehr, vow (nazr) and kaffara are not subtracted (pp. 52-53).",
    goldNote: "Zakat is due on worn jewellery too. Diamonds and pearls are not counted unless held for trade (pp. 34-38).",
    khumsTitle: "Extra above nisab", khumsOn: "Count only each full fifth of nisab above nisab (Faizan-e-Zakat pp. 27-28)", khumsInfo: "Above nisab, a smaller remainder than one fifth of nisab is forgiven (afw). Untick to apply 2.5% on everything.",
    base: "Wealth zakat is charged on", afw: "Forgiven (afw)", hawlHead: "One lunar year", fillFirst: "Please fill in the missing price."
  },
  roman: {
    steps: ["Qeemat", "Naqd", "Sona-Chandi", "Tijarat", "Jo dusron ke paas hai", "Aap par qarz", "Natija"],
    of: "/", next: "Aage", back: "Peeche", again: "Dobara shuru", yes: "Haan", no: "Nahi",
    gate: ["", "", "Kya aap ke paas sona ya chandi hai (zewar bhi)?", "Kya aap tijarat karte hain ya bechne ka maal hai?", "Kya kisi ke paas aap ka paisa hai, ya PF ya committee hai?", "Kya aap par kisi ka qarz hai?"],
    running: "Abhi tak", assets: "Maal", debts: "Qarz", pricesFirst: "Pehle chandi ki qeemat likhein (nisab chandi se banta hai).", goPrices: "Qeemat par jayein",
    tradeNote: "Plot ya gaadi tabhi gino jab bechne ki niyat se khareedi ho. Dukaan, kiraye ki imaarat aur ghar ka saman nahi ginte; kiraye ki jo raqam mili wo gino (Faizan-e-Zakat safha 42-45).",
    recvNote: "In par zakat har saal farz hai, lekin ada tab jab nisab ka kam az kam panchva hissa wasool ho (safha 48-55). Jis raqam ki wapsi ki umeed nahi wo mat jodein.",
    debtNote: "Sirf wo qarz minus karein jo banda maang sakta ho aur saal poora hone se pehle ka ho. Mehr-e-muwakhkhar, nazr aur kaffara minus nahi hote (safha 52-53).",
    goldNote: "Pehne hue zewar par bhi zakat hai. Heera aur moti tijarat ke ilawa nahi ginte (safha 34-38).",
    khumsTitle: "Nisab se zyada maal", khumsOn: "Nisab ke upar sirf poora panchva hissa ginein (Faizan-e-Zakat safha 27-28)", khumsInfo: "Nisab ke upar agar nisab ke panchve hisse se kam bacha ho to wo maaf (afw) hai. Tick hata dein to poore maal par 2.5% lagega.",
    base: "Jis maal par zakat lagi", afw: "Maaf (afw)", hawlHead: "Ek qamari saal", fillFirst: "Chandi ki qeemat likhein."
  },
  ur: {
    steps: ["قیمت", "نقد", "سونا چاندی", "تجارت", "جو دوسروں کے پاس ہے", "آپ پر قرض", "نتیجہ"],
    of: "/", next: "آگے", back: "پیچھے", again: "دوبارہ شروع", yes: "ہاں", no: "نہیں",
    gate: ["", "", "کیا آپ کے پاس سونا یا چاندی ہے (زیور بھی)؟", "کیا آپ تجارت کرتے ہیں یا بیچنے کا مال ہے؟", "کیا کسی کے پاس آپ کا پیسہ ہے، یا پراویڈنٹ فنڈ یا کمیٹی ہے؟", "کیا آپ پر کسی کا قرض ہے؟"],
    running: "اب تک", assets: "مال", debts: "قرض", pricesFirst: "پہلے چاندی کی قیمت لکھیں (نصاب چاندی سے بنتا ہے)۔", goPrices: "قیمت پر جائیں",
    tradeNote: "پلاٹ یا گاڑی تبھی گنیں جب بیچنے کی نیت سے خریدی ہو۔ دکان، کرائے کی عمارت اور گھر کا سامان نہیں گنتے؛ کرائے کی جو رقم ملی وہ گنیں (فیضانِ زکوٰۃ صفحہ 42 تا 45)۔",
    recvNote: "ان پر زکوٰۃ ہر سال فرض ہے، لیکن ادا تب ہو گی جب نصاب کا کم از کم پانچواں حصہ وصول ہو (صفحہ 48 تا 55)۔ جس رقم کی واپسی کی امید نہ ہو وہ نہ جوڑیں۔",
    debtNote: "صرف وہ قرض منہا کریں جس کا بندہ مطالبہ کر سکتا ہو اور سال پورا ہونے سے پہلے کا ہو۔ مہرِ مؤخر، نذر اور کفارہ منہا نہیں ہوتے (صفحہ 52 تا 53)۔",
    goldNote: "پہنے ہوئے زیور پر بھی زکوٰۃ ہے۔ ہیرا اور موتی تجارت کے علاوہ نہیں گنتے (صفحہ 34 تا 38)۔",
    khumsTitle: "نصاب سے زیادہ مال", khumsOn: "نصاب کے اوپر صرف پورا پانچواں حصہ گنیں (فیضانِ زکوٰۃ صفحہ 27 تا 28)", khumsInfo: "نصاب کے اوپر اگر نصاب کے پانچویں حصے سے کم بچا ہو تو وہ معاف (عفو) ہے۔ نشان ہٹا دیں تو پورے مال پر 2.5% لگے گا۔",
    base: "جس مال پر زکوٰۃ لگی", afw: "معاف (عفو)", hawlHead: "ایک قمری سال", fillFirst: "چاندی کی قیمت لکھیں۔"
  },
  hi: {
    steps: ["क़ीमत", "नक़द", "सोना-चाँदी", "तिजारत", "जो दूसरों के पास है", "आप पर क़र्ज़", "नतीजा"],
    of: "/", next: "आगे", back: "पीछे", again: "दोबारा शुरू", yes: "हाँ", no: "नहीं",
    gate: ["", "", "क्या आपके पास सोना या चाँदी है (ज़ेवर भी)?", "क्या आप तिजारत करते हैं या बेचने का माल है?", "क्या किसी के पास आपका पैसा है, या PF या कमेटी है?", "क्या आप पर किसी का क़र्ज़ है?"],
    running: "अब तक", assets: "माल", debts: "क़र्ज़", pricesFirst: "पहले चाँदी की क़ीमत लिखें (निसाब चाँदी से बनता है)।", goPrices: "क़ीमत पर जाएँ",
    tradeNote: "प्लॉट या गाड़ी तभी गिनें जब बेचने की नीयत से ख़रीदी हो। दुकान, किराए की इमारत और घर का सामान नहीं गिनते; किराए की जो रक़म मिली वो गिनें (फ़ैज़ान-ए-ज़कात सफ़्हा 42-45)।",
    recvNote: "इन पर ज़कात हर साल फ़र्ज़ है, लेकिन अदा तब होगी जब निसाब का कम से कम पाँचवाँ हिस्सा वसूल हो (सफ़्हा 48-55)। जिस रक़म की वापसी की उम्मीद नहीं वो न जोड़ें।",
    debtNote: "सिर्फ़ वो क़र्ज़ घटाएँ जिसका बंदा मुतालबा कर सकता हो और साल पूरा होने से पहले का हो। मेह्र-ए-मुअख़्ख़र, नज़्र और कफ़्फ़ारा नहीं घटते (सफ़्हा 52-53)।",
    goldNote: "पहने हुए ज़ेवर पर भी ज़कात है। हीरा और मोती तिजारत के अलावा नहीं गिनते (सफ़्हा 34-38)।",
    khumsTitle: "निसाब से ज़्यादा माल", khumsOn: "निसाब के ऊपर सिर्फ़ पूरा पाँचवाँ हिस्सा गिनें (फ़ैज़ान-ए-ज़कात सफ़्हा 27-28)", khumsInfo: "निसाब के ऊपर अगर निसाब के पाँचवें हिस्से से कम बचा हो तो वो माफ़ (अफ़्व) है। निशान हटा दें तो पूरे माल पर 2.5% लगेगा।",
    base: "जिस माल पर ज़कात लगी", afw: "माफ़ (अफ़्व)", hawlHead: "एक क़मरी साल", fillFirst: "चाँदी की क़ीमत लिखें।"
  }
};

