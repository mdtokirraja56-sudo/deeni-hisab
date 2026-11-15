// lib/copySpecial.ts — words for the Khunsa / Hamal / Zameen panel (4 languages).
import type { Lang } from "./heirs";

export interface CopySpecial {
  title: string; sub: string; beta: string;
  mode: string; modeKhuntha: string; modeHamal: string;
  role: string; roleChild: string; roleGrandchild: string; roleFull: string; roleCons: string; roleUterine: string;
  method: string; mLeast: string; mAvg: string;
  hold: string; h1: string; h4: string;
  calc: string; reset: string;
  heir: string; ifMale: string; ifFemale: string; share: string; parts: string; amount: string;
  khunthaWord: string; hamalWord: string; heldWord: string;
  withheld: string; ofTotal: string;
  khunthaNote: string; hamalNote: string; asNote: string; unsupported: string; invalid: string;
  landTitle: string; landArea: string; landUnit: string; landUnitHint: string; landNote: string; landEach: string;
}

export const copySpecial: Record<Lang, CopySpecial> = {
  ur: {
    title: "خنثیٰ، حمل اور زمین", sub: "السراجیہ کی بنیاد پر۔ پہلے اوپر وارث درج کریں، پھر یہاں خنثیٰ یا حمل شامل کریں۔", beta: "آزمائشی — کسی مستند عالم/مفتی سے ضرور تصدیق کروائیں۔",
    mode: "کیا شامل کرنا ہے؟", modeKhuntha: "خنثیٰ مشکل (ایک وارث)", modeHamal: "حمل (پیٹ میں بچہ)",
    role: "وہ میت کا کیا لگتا ہے؟", roleChild: "اولاد (بیٹا/بیٹی)", roleGrandchild: "پوتا/پوتی", roleFull: "حقیقی بھائی/بہن", roleCons: "علاتی بھائی/بہن (باپ شریک)", roleUterine: "اخیافی بھائی/بہن (ماں شریک)",
    method: "خنثیٰ کا حصہ کس قول پر؟", mLeast: "دونوں میں کم حصہ، باقی روک کر (امام ابوحنیفہ اور صاحبین — فتویٰ)", mAvg: "دونوں کا آدھا (شعبی/ابن عباس، امام محمد کی تخریج)",
    hold: "حمل میں کتنے بچوں کا حصہ روکا جائے؟", h1: "ایک بچے کا (ابو یوسف بروایت خصاف — کتاب: وعلیہ الفتویٰ)", h4: "چار بچوں کا (امام ابوحنیفہ کی روایت — کتاب کی مثال)",
    calc: "حصے نکالیں", reset: "صاف کریں",
    heir: "وارث", ifMale: "مرد ہو تو", ifFemale: "عورت ہو تو", share: "ابھی ملنے والا حصہ", parts: "سہام", amount: "رقم",
    khunthaWord: "خنثیٰ", hamalWord: "حمل", heldWord: "موقوف",
    withheld: "موقوف (ظاہر ہونے تک روکا جائے)", ofTotal: "کل سہام",
    khunthaNote: "خنثیٰ مشکل کو دونوں حالتوں (مرد/عورت) میں سے کم حصہ ملتا ہے، اور باقی ورثہ کو بھی ان کا کم حصہ؛ بقیہ موقوف رہتا ہے۔",
    hamalNote: "حمل کا حصہ موقوف رہتا ہے؛ باقی ورثہ کو وہ حصہ ملتا ہے جو دونوں صورتوں (لڑکا/لڑکی) میں کم ہو۔ میت کی بیوہ کا بچہ میت کی موت سے زیادہ سے زیادہ دو سال کے اندر پیدا ہو تو وارث ہے؛ کسی اور کے حمل کا بچہ چھ ماہ کے اندر۔ بچہ زندہ پیدا ہو (اکثر حصہ نکلتے وقت زندہ) تب وارث ہے۔ مفتیان کے مطابق ضامن (کفیل) لینا بھی ہے۔",
    asNote: "نتیجہ صرف رہنمائی ہے۔ حتمی فیصلہ اپنے عالم/مفتی سے کروائیں۔",
    unsupported: "اس صورت کا حساب یہاں نہیں ہو سکتا۔ کسی عالم سے رجوع کریں۔", invalid: "وارثوں کی تعداد درست نہیں۔",
    landTitle: "زمین کی تقسیم", landArea: "کل زمین (مقدار)", landUnit: "پیمانہ (اپنی مرضی کا نام)", landUnitHint: "مثلاً بیگھہ، کٹھہ، ڈسمل، ایکڑ، گز", landNote: "یہ صرف ہر وارث کے حصے کے مطابق زمین بانٹتا ہے۔ پیمانوں میں تبدیلی نہیں ہوتی؛ جو پیمانہ لکھیں اسی میں جواب آئے گا۔",
    landEach: "کل زمین میں سے"
  },
  hi: {
    title: "खुन्सा, हम्ल और ज़मीन", sub: "अस-सिराजिय्या की बुनियाद पर। पहले ऊपर वारिस भरें, फिर यहाँ खुन्सा या हम्ल जोड़ें।", beta: "आज़माइशी — किसी प्रामाणिक आलिम/मुफ़्ती से ज़रूर तसदीक़ करवाएँ।",
    mode: "क्या जोड़ना है?", modeKhuntha: "खुन्सा मुश्किल (एक वारिस)", modeHamal: "हम्ल (पेट में बच्चा)",
    role: "वह मय्यत का क्या लगता है?", roleChild: "औलाद (बेटा/बेटी)", roleGrandchild: "पोता/पोती", roleFull: "सगा भाई/बहन", roleCons: "अल्लाती भाई/बहन (बाप शरीक)", roleUterine: "अख़्याफ़ी भाई/बहन (माँ शरीक)",
    method: "खुन्सा का हिस्सा किस क़ौल पर?", mLeast: "दोनों में कम हिस्सा, बाक़ी रोककर (इमाम अबू हनीफ़ा और साहिबैन — फ़तवा)", mAvg: "दोनों का आधा (शअबी/इब्ने अब्बास, इमाम मुहम्मद की तख़रीज)",
    hold: "हम्ल में कितने बच्चों का हिस्सा रोका जाए?", h1: "एक बच्चे का (अबू यूसुफ़ ब-रिवायते ख़स्साफ़ — किताब: व-अलैहिल फ़तवा)", h4: "चार बच्चों का (इमाम अबू हनीफ़ा की रिवायत — किताब की मिसाल)",
    calc: "हिस्से निकालें", reset: "साफ़ करें",
    heir: "वारिस", ifMale: "मर्द हो तो", ifFemale: "औरत हो तो", share: "अभी मिलने वाला हिस्सा", parts: "सहाम", amount: "रक़म",
    khunthaWord: "खुन्सा", hamalWord: "हम्ल", heldWord: "मौक़ूफ़",
    withheld: "मौक़ूफ़ (ज़ाहिर होने तक रोका जाए)", ofTotal: "कुल सहाम",
    khunthaNote: "खुन्सा मुश्किल को दोनों हालतों (मर्द/औरत) में से कम हिस्सा मिलता है, और बाक़ी वारिसों को भी उनका कम हिस्सा; बाक़ी मौक़ूफ़ रहता है।",
    hamalNote: "हम्ल का हिस्सा मौक़ूफ़ रहता है; बाक़ी वारिसों को वह हिस्सा मिलता है जो दोनों सूरतों (लड़का/लड़की) में कम हो। मय्यत की बेवा का बच्चा मय्यत की मौत से ज़्यादा से ज़्यादा दो साल के अंदर पैदा हो तो वारिस है; किसी और के हम्ल का बच्चा छह माह के अंदर। बच्चा ज़िंदा पैदा हो (ज़्यादातर हिस्सा निकलते वक़्त ज़िंदा) तब वारिस है। ज़मानती (कफ़ील) लेना भी बताया गया है।",
    asNote: "नतीजा सिर्फ़ रहनुमाई है। आख़िरी फ़ैसला अपने आलिम/मुफ़्ती से करवाएँ।",
    unsupported: "इस सूरत का हिसाब यहाँ नहीं हो सकता। किसी आलिम से रुजू करें।", invalid: "वारिसों की गिनती सही नहीं।",
    landTitle: "ज़मीन की तक़सीम", landArea: "कुल ज़मीन (मिक़दार)", landUnit: "पैमाना (अपनी मर्ज़ी का नाम)", landUnitHint: "जैसे बीघा, कट्ठा, डिसमिल, एकड़, गज़", landNote: "यह सिर्फ़ हर वारिस के हिस्से के मुताबिक़ ज़मीन बाँटता है। पैमानों की तब्दीली नहीं होती; जो पैमाना लिखें उसी में जवाब आएगा।",
    landEach: "कुल ज़मीन में से"
  },
  roman: {
    title: "Khunsa, Hamal aur Zameen", sub: "As-Sirajiyya ki bunyaad par. Pehle upar waris darj karein, phir yahan khunsa ya hamal jodein.", beta: "Aazmaishi — kisi mustanad Aalim/Mufti se zaroor tasdeeq karwayein.",
    mode: "Kya jodna hai?", modeKhuntha: "Khunsa mushkil (ek waris)", modeHamal: "Hamal (pet mein bachcha)",
    role: "Woh mayyit ka kya lagta hai?", roleChild: "Aulaad (beta/beti)", roleGrandchild: "Pota/Poti", roleFull: "Haqeeqi bhai/behen", roleCons: "Allaati bhai/behen (baap shareek)", roleUterine: "Akhyafi bhai/behen (maa shareek)",
    method: "Khunsa ka hissa kis qaul par?", mLeast: "Dono mein kam hissa, baaqi rokkar (Imam Abu Hanifa aur Sahibain — fatwa)", mAvg: "Dono ka aadha (Sha'bi/Ibn Abbas, Imam Muhammad ki takhreej)",
    hold: "Hamal mein kitne bachchon ka hissa roka jaaye?", h1: "Ek bachche ka (Abu Yusuf ba-riwayat Khassaf — kitab: wa-alayhil fatwa)", h4: "Chaar bachchon ka (Imam Abu Hanifa ki riwayat — kitab ki misaal)",
    calc: "Hisse nikalein", reset: "Saaf karein",
    heir: "Waris", ifMale: "Mard ho to", ifFemale: "Aurat ho to", share: "Abhi milne wala hissa", parts: "Siham", amount: "Raqam",
    khunthaWord: "Khunsa", hamalWord: "Hamal", heldWord: "Mauqoof",
    withheld: "Mauqoof (zaahir hone tak roka jaaye)", ofTotal: "Kul siham",
    khunthaNote: "Khunsa mushkil ko dono haalaton (mard/aurat) mein se kam hissa milta hai, aur baaqi waris ko bhi unka kam hissa; baaqi mauqoof rehta hai.",
    hamalNote: "Hamal ka hissa mauqoof rehta hai; baaqi waris ko woh hissa milta hai jo dono suraton (ladka/ladki) mein kam ho. Mayyit ki bewa ka bachcha mayyit ki maut se zyada se zyada do saal ke andar paida ho to waris hai; kisi aur ke hamal ka bachcha chhe maah ke andar. Bachcha zinda paida ho (aksar hissa nikalte waqt zinda) tab waris hai. Zaamin (kafeel) lena bhi bataya gaya hai.",
    asNote: "Nateeja sirf rehnumai hai. Aakhri faisla apne Aalim/Mufti se karwayein.",
    unsupported: "Is soorat ka hisaab yahan nahi ho sakta. Kisi Aalim se rujoo karein.", invalid: "Waris ki ginti theek nahi.",
    landTitle: "Zameen ki taqseem", landArea: "Kul zameen (miqdaar)", landUnit: "Paimana (apni marzi ka naam)", landUnitHint: "jaise bigha, katha, decimal, acre, gaz", landNote: "Yeh sirf har waris ke hisse ke mutabiq zameen baantta hai. Paimane ki tabdeeli nahi hoti; jo paimana likhein usi mein jawab aayega.",
    landEach: "Kul zameen mein se"
  },
  en: {
    title: "Khuntha, Pregnancy and Land", sub: "Based on Al-Sirajiyya. Enter the heirs above first, then add a khuntha or an unborn child here.", beta: "Beta — please have a qualified scholar/mufti confirm.",
    mode: "What to add?", modeKhuntha: "Khuntha mushkil (one heir)", modeHamal: "Unborn child (pregnancy)",
    role: "How is this person related to the deceased?", roleChild: "Child (son/daughter)", roleGrandchild: "Grandchild (via son)", roleFull: "Full brother/sister", roleCons: "Half-sibling, same father", roleUterine: "Half-sibling, same mother",
    method: "Which opinion for the khuntha's share?", mLeast: "The lesser of the two, the rest held back (Abu Hanifa and his companions — the fatwa)", mAvg: "Half of the two (Sha'bi/Ibn Abbas, as Imam Muhammad derives it)",
    hold: "How many children's share is held back?", h1: "One child (Abu Yusuf via Khassaf — the book: \"the fatwa is on it\")", h4: "Four children (Abu Hanifa's narration — the book's worked example)",
    calc: "Calculate", reset: "Clear",
    heir: "Heir", ifMale: "If male", ifFemale: "If female", share: "Share now", parts: "Parts", amount: "Amount",
    khunthaWord: "Khuntha", hamalWord: "Unborn child", heldWord: "Held",
    withheld: "Held back (until it is clear)", ofTotal: "Total parts",
    khunthaNote: "A khuntha mushkil gets the lesser of the two cases (male/female), and the other heirs get their lesser share too; the rest is held back.",
    hamalNote: "The unborn child's share is held back; the other heirs get the lesser of the two cases (boy/girl). The widow's child inherits if born within two years of the death; a child of another woman within six months. It inherits only if born alive (most of the body out while alive). The books also mention taking a guarantor (kafil).",
    asNote: "The result is guidance only. Have your scholar/mufti decide the final matter.",
    unsupported: "This case cannot be worked out here. Please ask a scholar.", invalid: "The number of heirs is not valid.",
    landTitle: "Land division", landArea: "Total land (amount)", landUnit: "Unit (any name you like)", landUnitHint: "e.g. bigha, katha, decimal, acre, gaz", landNote: "This only divides the land by each heir's share. No unit conversion is done; the answer comes in the unit you write.",
    landEach: "Out of the total land"
  }
};
