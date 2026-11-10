// lib/copy2.ts
// Screen text for the Mirath calculation result, alerts and the mission section (4 languages).
import type { Lang } from "./heirs";
import type { BlockCode, NoteCode, ReasonCode } from "./mirath";

export const en2 = {
  // alerts and form
  alertWives: "Under Shariah a man cannot have more than 4 wives at one time.",
  alertSingle: "Only one is possible here.",
  blockedWord: "Mahjub (does not inherit in this case)",
  deceasedNote: "The list below changes according to the deceased.",
  // buttons and headings
  divide: "Calculate shares", reset: "Start again", resultTitle: "Distribution result",
  betaTag: "Beta", betaNote: "Beta: these rules are being verified by a scholar. Do not distribute an estate on this result alone. Please have it checked by your own scholar (Aalim) first.",
  // table
  colHeir: "Heir", colCount: "Persons", colShare: "Share of estate", colParts: "Parts", colPerPerson: "Each person", colAmount: "Amount", colPercent: "Percent",
  statusBlocked: "Mahjub (excluded)", statusNothing: "Nothing left", inherits: "Inherits", raddMark: "includes radd",
  // steps
  stepAsl: "Base number (asl / makhraj)", stepAwl: "After awl", stepRadd: "After radd", stepMazrub: "Multiplier (tashih)", stepTashih: "Total parts (tashih)", stepNone: "none",
  amountHint: "Enter the estate value above to see rupee amounts.", amountBase: "Amount available for heirs",
  // outcomes
  noHeirs: "Please add at least one surviving heir.",
  invalidTitle: "Please correct the entries:",
  errBadCount: "Invalid number for", errMax: "More than allowed for", errGender: "Not possible for this deceased:",
  unsupportedArham: "This case is for distant relatives (Dhawil-arham). The tool does not calculate it yet. Please ask a qualified mufti.",
  unsupportedBig: "This case is too large for the tool. Please ask a qualified mufti.",
  // mission
  missionTitle: "Our purpose",
  missionText: "To make the Islamic rulings of inheritance and zakat easy to understand for ordinary families. Every answer shows its reason, follows Hanafi fiqh (Al-Sirajiyya), and asks you to confirm with a qualified scholar before acting.",
  principles: [
    "Every share comes with its reason",
    "Hanafi fiqh, following Al-Sirajiyya",
    "Not a fatwa: confirm with a scholar",
    "Private: what you type stays in your browser"
  ],
  howTitle: "How it works",
  how: [
    "Enter the estate and the surviving heirs",
    "The tool finds who is excluded, the fixed shares, the residue, awl and radd",
    "Read the reasons, print the report, and confirm with a scholar"
  ],
  profileHeading: "About the founder",
  reasons: {
    husband_half: "Husband: 1/2 because there are no children or grandchildren",
    husband_quarter: "Husband: 1/4 because there are children or grandchildren",
    wife_quarter: "Wife / wives: 1/4 shared equally, because there are no children",
    wife_eighth: "Wife / wives: 1/8 shared equally, because there are children",
    female_desc_half: "A single daughter (or son's daughter) with no son at her level: 1/2",
    female_desc_two_thirds: "Two or more daughters (or son's daughters) with no son at their level: 2/3 shared equally",
    female_desc_sixth: "Son's daughter(s) with one daughter above: 1/6, which completes the two-thirds",
    male_desc_asaba: "Son / son's son: takes the residue as asaba",
    asaba_with_male: "Becomes asaba with her brother: the male gets double the female",
    father_sixth_male_desc: "Father / grandfather: 1/6 because there is a son or son's son",
    father_sixth_plus_asaba: "Father / grandfather: 1/6, plus the remainder as asaba, because only daughters are present",
    father_asaba: "Father / grandfather: there are no children, so he takes the residue as asaba",
    mother_sixth_children: "Mother: 1/6 because there are children or grandchildren",
    mother_sixth_siblings: "Mother: 1/6 because there are two or more brothers or sisters",
    mother_third: "Mother: 1/3 because there are no children and fewer than two brothers or sisters",
    mother_third_remainder: "Mother: 1/3 of what remains after the spouse's share (the 'Umariyyatayn' case)",
    grandmother_sixth: "Grandmother(s): 1/6 together, divided equally among those who inherit",
    uterine_sixth: "One maternal half-sibling: 1/6",
    uterine_third: "Two or more maternal half-siblings: 1/3 shared equally (male = female)",
    sister_half: "A single sister, with no brother and no children: 1/2",
    sister_two_thirds: "Two or more sisters: 2/3 shared equally",
    cons_sister_sixth: "Half-sister (same father) with one full sister: 1/6, which completes the two-thirds",
    sister_asaba_daughter: "Sister with daughter(s): takes the remainder as asaba (asaba ma'a ghairihi)",
    asaba_remainder: "Takes the residue as asaba (the nearest male relative on the father's side)"
  } as Record<ReasonCode, string>,
  blocks: {
    nearer: "excluded by a nearer or stronger heir",
    intermediary: "excluded because the person through whom he is related is present",
    descendants: "excluded because there are children or grandchildren",
    two_thirds_full: "excluded because the two-thirds share is already complete",
    mother: "excluded by the mother",
    nearer_grandmother: "excluded by a nearer grandmother",
    arham_blocked: "distant relatives (Dhawil-arham) do not inherit while asaba or fixed-share heirs exist"
  } as Record<BlockCode, string>,
  by: "by",
  notes: {
    awl: "The fixed shares add up to more than the whole estate, so the problem is raised ('awl'): every share is reduced in proportion.",
    radd: "Nothing is left for asaba, so the surplus returns (radd) to the fixed-share heirs in proportion to their shares. A husband or wife does not receive radd.",
    tashih: "Some groups cannot divide their parts equally among their members, so the problem is corrected (tashih) by multiplying.",
    umariyyatayn: "Spouse + father + mother only: the mother takes 1/3 of what is left after the spouse (the 'Umariyyatayn' case).",
    asaba_nothing_left: "The fixed shares used up the whole estate, so nothing is left for the asaba (residuary relatives).",
    remainder_unassigned: "Part of the estate is not given to anyone in this list. It goes to relatives not covered here, or to the public treasury. Ask a mufti.",
    mother_third_grandfather: "With a grandfather (not a father), the mother takes 1/3 of the whole estate (Abu Hanifa and Muhammad). Abu Yusuf says 1/3 of the remainder. The scholar will confirm."
  } as Record<NoteCode, string>
};
export type Copy2 = typeof en2;

export const copy2: Record<Lang, Copy2> = {
  en: en2,
  roman: {
    alertWives: "Shariat mein ek waqt mein 4 se zyada biwiyan nahi ho sakti.",
    alertSingle: "Yahan sirf ek hi mumkin hai.",
    blockedWord: "Mahjub (is soorat mein waris nahi)",
    deceasedNote: "Neeche ki list marhoom ke mutabiq badalti hai.",
    divide: "Hisse nikalein", reset: "Naye sire se", resultTitle: "Taqseem ka natija",
    betaTag: "Beta", betaNote: "Beta: in qawaid ki aalim se tasdeeq jaari hai. Sirf is natije par jaidad taqseem na karein. Apne aalim se tasdeeq (check) zaroor karwa lein.",
    colHeir: "Waris", colCount: "Afraad", colShare: "Tarke mein hissa", colParts: "Sihaam", colPerPerson: "Har ek ka", colAmount: "Raqam", colPercent: "Fisad",
    statusBlocked: "Mahjub (mehroom)", statusNothing: "Kuch baqi nahi", inherits: "Waris", raddMark: "radd shamil",
    stepAsl: "Asl masla (makhraj)", stepAwl: "Awl ke baad", stepRadd: "Radd ke baad", stepMazrub: "Zarb (tashih ke liye)", stepTashih: "Tashih-e-masla (kul sihaam)", stepNone: "nahi",
    amountHint: "Rupay dekhne ke liye upar tarka ki raqam likhein.", amountBase: "Wariseen ke liye dastiyab raqam",
    noHeirs: "Kam az kam ek maujood waris shamil karein.",
    invalidTitle: "Barah-e-karam ye durust karein:",
    errBadCount: "Ghalat adad:", errMax: "Hadd se zyada:", errGender: "Is marhoom ke liye mumkin nahi:",
    unsupportedArham: "Ye soorat Zawil-arham ki hai. Tool abhi iska hisaab nahi karta. Mustanad mufti se rujoo karein.",
    unsupportedBig: "Ye masla tool ke liye bohat bada hai. Mustanad mufti se rujoo karein.",
    missionTitle: "Hamara maqsad",
    missionText: "Mirath aur Zakat ke shar'i ahkaam ko aam gharanon ke liye aasaan banana. Har jawab ke saath uski wajah dikhai jaati hai, Fiqh-e-Hanafi (Sirajiyya) ki pairwi ki jaati hai, aur amal se pehle mustanad aalim se tasdeeq ki taakeed ki jaati hai.",
    principles: [
      "Har hisse ke saath uski wajah",
      "Fiqh-e-Hanafi, Sirajiyya ke mutabiq",
      "Fatwa nahi: aalim se tasdeeq karein",
      "Niji: jo aap likhte hain wo aap ke browser mein rehta hai"
    ],
    howTitle: "Ye kaise kaam karta hai",
    how: [
      "Tarka aur maujood wariseen likhein",
      "Tool khud nikalta hai: kaun mahjub hai, muqarrar hisse, baqi, awl aur radd",
      "Wajah padhein, report print karein, aur aalim se tasdeeq karwayein"
    ],
    profileHeading: "Bani ke baare mein",
    reasons: {
      husband_half: "Shohar: 1/2, kyunki aulaad ya pote-poti nahi",
      husband_quarter: "Shohar: 1/4, kyunki aulaad ya pote-poti maujood hain",
      wife_quarter: "Biwi / biwiyaan: 1/4 barabar taqseem, kyunki aulaad nahi",
      wife_eighth: "Biwi / biwiyaan: 1/8 barabar taqseem, kyunki aulaad maujood hai",
      female_desc_half: "Akeli beti (ya poti), us ke darje mein beta nahi: 1/2",
      female_desc_two_thirds: "Do ya zyada betiyaan (ya potiyaan), us darje mein beta nahi: 2/3 barabar taqseem",
      female_desc_sixth: "Poti(yaan) ek beti ke saath: 1/6, jis se do-tihai poori hoti hai",
      male_desc_asaba: "Beta / pota: baqi maal asaba ban kar leta hai",
      asaba_with_male: "Apne bhai ke saath asaba: mard ko aurat se double",
      father_sixth_male_desc: "Walid / dada: 1/6, kyunki beta ya pota maujood hai",
      father_sixth_plus_asaba: "Walid / dada: 1/6 aur baqi bhi asaba ban kar, kyunki sirf betiyaan hain",
      father_asaba: "Walid / dada: aulaad nahi, isliye baqi sab asaba ban kar leta hai",
      mother_sixth_children: "Walida: 1/6, kyunki aulaad ya pote-poti maujood hain",
      mother_sixth_siblings: "Walida: 1/6, kyunki do ya zyada bhai-behen hain",
      mother_third: "Walida: 1/3, kyunki aulaad nahi aur do se kam bhai-behen hain",
      mother_third_remainder: "Walida: shohar/biwi ke baad baqi ka 1/3 ('Umariyyatayn' soorat)",
      grandmother_sixth: "Dadi/Nani: sab milakar 1/6, jo waris hon un mein barabar",
      uterine_sixth: "Ek akhyafi bhai/behen: 1/6",
      uterine_third: "Do ya zyada akhyafi bhai-behen: 1/3 barabar (mard = aurat)",
      sister_half: "Akeli behen, bhai aur aulaad nahi: 1/2",
      sister_two_thirds: "Do ya zyada behnein: 2/3 barabar taqseem",
      cons_sister_sixth: "Allaati behen ek haqeeqi behen ke saath: 1/6, jis se do-tihai poori hoti hai",
      sister_asaba_daughter: "Behen beti ke saath: baqi asaba ban kar (asaba ma'a ghairihi)",
      asaba_remainder: "Baqi asaba ban kar leta hai (walid ki taraf ka sab se qareebi mard)"
    },
    blocks: {
      nearer: "qareeb ya mazboot waris ki wajah se mehroom",
      intermediary: "jis ke zariye rishta hai wo maujood hai, isliye mehroom",
      descendants: "aulaad ya pote-poti maujood hain, isliye mehroom",
      two_thirds_full: "do-tihai pehle hi poori ho chuki, isliye mehroom",
      mother: "walida ki wajah se mehroom",
      nearer_grandmother: "qareeb ki jaddah ki wajah se mehroom",
      arham_blocked: "asaba ya muqarrar hisse wale maujood hon to zawil-arham ko hissa nahi milta"
    },
    by: "ki wajah se",
    notes: {
      awl: "Muqarrar hisse poore tarke se zyada the, isliye masla 'awl' hua: sab ke hisse tanaasub se kam kiye gaye.",
      radd: "Asaba ke liye kuch baqi nahi, isliye bacha hua maal 'radd' ke zariye muqarrar hisse walon par unke hisson ke tanaasub se laut gaya. Shohar ya biwi ko radd nahi milta.",
      tashih: "Kuch guroohon ke hisse unke afraad par barabar taqseem nahi hote the, isliye zarb dekar masla 'tashih' kiya gaya.",
      umariyyatayn: "Sirf shohar/biwi + walid + walida: walida ko shohar/biwi ke baad baqi ka 1/3 milta hai ('Umariyyatayn').",
      asaba_nothing_left: "Muqarrar hisson ne poora tarka le liya, isliye asaba ke liye kuch baqi nahi bacha.",
      remainder_unassigned: "Tarke ka kuch hissa is list mein kisi ko nahi diya gaya. Wo is list se bahar ke rishtedaron ya bait-ul-maal ko jata hai. Mufti se poochhein.",
      mother_third_grandfather: "Dada ke saath (walid nahi) walida ko poore maal ka 1/3 milta hai (Imam Abu Hanifa aur Muhammad). Imam Abu Yusuf ke nazdeek baqi ka 1/3. Aalim tasdeeq karenge."
    }
  },
  ur: {
    alertWives: "شریعت میں ایک وقت میں 4 سے زیادہ بیویاں نہیں ہو سکتیں۔",
    alertSingle: "یہاں صرف ایک ہی ممکن ہے۔",
    blockedWord: "محجوب (اس صورت میں وارث نہیں)",
    deceasedNote: "نیچے کی فہرست مرحوم کے مطابق بدلتی ہے۔",
    divide: "حصے نکالیں", reset: "نئے سرے سے", resultTitle: "تقسیم کا نتیجہ",
    betaTag: "Beta", betaNote: "آزمائشی ورژن: ان قواعد کی عالم سے تصدیق جاری ہے۔ صرف اس نتیجے پر ترکہ تقسیم نہ کریں۔ اپنے عالم سے تصدیق (چیک) کروا لیں۔",
    colHeir: "وارث", colCount: "افراد", colShare: "ترکے میں حصہ", colParts: "سہام", colPerPerson: "ہر ایک کا", colAmount: "رقم", colPercent: "فیصد",
    statusBlocked: "محجوب (محروم)", statusNothing: "کچھ باقی نہیں", inherits: "وارث", raddMark: "رد شامل",
    stepAsl: "اصل مسئلہ (مخرج)", stepAwl: "عول کے بعد", stepRadd: "رد کے بعد", stepMazrub: "ضرب (تصحیح کے لیے)", stepTashih: "تصحیحِ مسئلہ (کل سہام)", stepNone: "نہیں",
    amountHint: "روپے دیکھنے کے لیے اوپر ترکے کی رقم لکھیں۔", amountBase: "ورثاء کے لیے دستیاب رقم",
    noHeirs: "کم از کم ایک موجود وارث شامل کریں۔",
    invalidTitle: "براہِ کرم یہ درست کریں:",
    errBadCount: "غلط عدد:", errMax: "حد سے زیادہ:", errGender: "اس مرحوم کے لیے ممکن نہیں:",
    unsupportedArham: "یہ صورت ذوی الارحام کی ہے۔ ٹول ابھی اس کا حساب نہیں کرتا۔ مستند مفتی سے رجوع کریں۔",
    unsupportedBig: "یہ مسئلہ ٹول کے لیے بہت بڑا ہے۔ مستند مفتی سے رجوع کریں۔",
    missionTitle: "ہمارا مقصد",
    missionText: "میراث اور زکوٰۃ کے شرعی احکام کو عام گھرانوں کے لیے آسان بنانا۔ ہر جواب کے ساتھ اس کی وجہ دکھائی جاتی ہے، فقہِ حنفی (سراجیہ) کی پیروی کی جاتی ہے، اور عمل سے پہلے مستند عالم سے تصدیق کی تاکید کی جاتی ہے۔",
    principles: [
      "ہر حصے کے ساتھ اس کی وجہ",
      "فقہِ حنفی، سراجیہ کے مطابق",
      "فتویٰ نہیں: عالم سے تصدیق کریں",
      "نجی: جو آپ لکھتے ہیں وہ آپ کے براؤزر میں رہتا ہے"
    ],
    howTitle: "یہ کیسے کام کرتا ہے",
    how: [
      "ترکہ اور موجود ورثاء لکھیں",
      "ٹول خود نکالتا ہے: کون محجوب ہے، مقررہ حصے، باقی، عول اور رد",
      "وجہ پڑھیں، رپورٹ پرنٹ کریں، اور عالم سے تصدیق کروائیں"
    ],
    profileHeading: "بانی کے بارے میں",
    reasons: {
      husband_half: "شوہر: 1/2، کیونکہ اولاد یا پوتے پوتی نہیں",
      husband_quarter: "شوہر: 1/4، کیونکہ اولاد یا پوتے پوتی موجود ہیں",
      wife_quarter: "بیوی / بیویاں: 1/4 برابر تقسیم، کیونکہ اولاد نہیں",
      wife_eighth: "بیوی / بیویاں: 1/8 برابر تقسیم، کیونکہ اولاد موجود ہے",
      female_desc_half: "اکیلی بیٹی (یا پوتی)، اس کے درجے میں بیٹا نہیں: 1/2",
      female_desc_two_thirds: "دو یا زیادہ بیٹیاں (یا پوتیاں)، اس درجے میں بیٹا نہیں: 2/3 برابر تقسیم",
      female_desc_sixth: "پوتی (پوتیاں) ایک بیٹی کے ساتھ: 1/6، جس سے دو تہائی پورا ہوتا ہے",
      male_desc_asaba: "بیٹا / پوتا: باقی مال بطور عصبہ لیتا ہے",
      asaba_with_male: "اپنے بھائی کے ساتھ عصبہ: مرد کو عورت سے دگنا",
      father_sixth_male_desc: "والد / دادا: 1/6، کیونکہ بیٹا یا پوتا موجود ہے",
      father_sixth_plus_asaba: "والد / دادا: 1/6 اور باقی بھی بطور عصبہ، کیونکہ صرف بیٹیاں ہیں",
      father_asaba: "والد / دادا: اولاد نہیں، اس لیے باقی سب بطور عصبہ لیتا ہے",
      mother_sixth_children: "والدہ: 1/6، کیونکہ اولاد یا پوتے پوتی موجود ہیں",
      mother_sixth_siblings: "والدہ: 1/6، کیونکہ دو یا زیادہ بھائی بہن ہیں",
      mother_third: "والدہ: 1/3، کیونکہ اولاد نہیں اور دو سے کم بھائی بہن ہیں",
      mother_third_remainder: "والدہ: شوہر/بیوی کے بعد باقی کا 1/3 (عمریتین کی صورت)",
      grandmother_sixth: "دادی / نانی: سب مل کر 1/6، جو وارث ہوں ان میں برابر",
      uterine_sixth: "ایک اخیافی بھائی / بہن: 1/6",
      uterine_third: "دو یا زیادہ اخیافی بھائی بہن: 1/3 برابر (مرد = عورت)",
      sister_half: "اکیلی بہن، بھائی اور اولاد نہیں: 1/2",
      sister_two_thirds: "دو یا زیادہ بہنیں: 2/3 برابر تقسیم",
      cons_sister_sixth: "علاتی بہن ایک حقیقی بہن کے ساتھ: 1/6، جس سے دو تہائی پورا ہوتا ہے",
      sister_asaba_daughter: "بہن بیٹی کے ساتھ: باقی بطور عصبہ (عصبہ مع الغیر)",
      asaba_remainder: "باقی بطور عصبہ لیتا ہے (والد کی طرف کا سب سے قریبی مرد)"
    },
    blocks: {
      nearer: "قریب یا مضبوط وارث کی وجہ سے محروم",
      intermediary: "جس کے واسطے سے رشتہ ہے وہ موجود ہے، اس لیے محروم",
      descendants: "اولاد یا پوتے پوتی موجود ہیں، اس لیے محروم",
      two_thirds_full: "دو تہائی پہلے ہی پورا ہو چکا، اس لیے محروم",
      mother: "والدہ کی وجہ سے محروم",
      nearer_grandmother: "قریب کی جدہ کی وجہ سے محروم",
      arham_blocked: "عصبہ یا مقررہ حصے والے موجود ہوں تو ذوی الارحام کو حصہ نہیں ملتا"
    },
    by: "کی وجہ سے",
    notes: {
      awl: "مقررہ حصے پورے ترکے سے زیادہ تھے، اس لیے مسئلہ 'عول' ہوا: سب کے حصے تناسب سے کم کیے گئے۔",
      radd: "عصبہ کے لیے کچھ باقی نہیں، اس لیے بچا ہوا مال 'رد' کے ذریعے مقررہ حصے والوں پر ان کے حصوں کے تناسب سے لوٹا۔ شوہر یا بیوی کو رد نہیں ملتا۔",
      tashih: "کچھ گروہوں کے حصے ان کے افراد پر برابر تقسیم نہیں ہوتے تھے، اس لیے ضرب دے کر مسئلہ 'تصحیح' کیا گیا۔",
      umariyyatayn: "صرف شوہر/بیوی + والد + والدہ: والدہ کو شوہر/بیوی کے بعد باقی کا 1/3 ملتا ہے (عمریتین)۔",
      asaba_nothing_left: "مقررہ حصوں نے پورا ترکہ لے لیا، اس لیے عصبہ کے لیے کچھ باقی نہیں بچا۔",
      remainder_unassigned: "ترکے کا کچھ حصہ اس فہرست میں کسی کو نہیں دیا گیا۔ وہ اس فہرست سے باہر کے رشتہ داروں یا بیت المال کو جاتا ہے۔ مفتی سے پوچھیں۔",
      mother_third_grandfather: "دادا کے ساتھ (والد نہیں) والدہ کو پورے مال کا 1/3 ملتا ہے (امام ابو حنیفہ اور محمد)۔ امام ابو یوسف کے نزدیک باقی کا 1/3۔ عالم تصدیق کریں گے۔"
    }
  },
  hi: {
    alertWives: "शरीअत में एक वक़्त में 4 से ज़्यादा बीवियाँ नहीं हो सकतीं।",
    alertSingle: "यहाँ सिर्फ़ एक ही मुमकिन है।",
    blockedWord: "महजूब (इस सूरत में वारिस नहीं)",
    deceasedNote: "नीचे की सूची मरहूम के मुताबिक़ बदलती है।",
    divide: "हिस्से निकालें", reset: "नए सिरे से", resultTitle: "बँटवारे का नतीजा",
    betaTag: "Beta", betaNote: "आज़माइशी संस्करण: इन क़वाइद की आलिम से तस्दीक़ जारी है। सिर्फ़ इस नतीजे पर तरका न बाँटें। अपने आलिम से तस्दीक़ (चेक) ज़रूर करवा लें।",
    colHeir: "वारिस", colCount: "लोग", colShare: "तरके में हिस्सा", colParts: "सिहाम", colPerPerson: "हर एक का", colAmount: "रक़म", colPercent: "फ़ीसद",
    statusBlocked: "महजूब (महरूम)", statusNothing: "कुछ बाक़ी नहीं", inherits: "वारिस", raddMark: "रद शामिल",
    stepAsl: "असल मसला (मख़रज)", stepAwl: "औल के बाद", stepRadd: "रद के बाद", stepMazrub: "ज़र्ब (तस्हीह के लिए)", stepTashih: "तस्हीह-ए-मसला (कुल सिहाम)", stepNone: "नहीं",
    amountHint: "रुपये देखने के लिए ऊपर तरके की रक़म लिखें।", amountBase: "वारिसों के लिए उपलब्ध रक़म",
    noHeirs: "कम से कम एक मौजूद वारिस जोड़ें।",
    invalidTitle: "कृपया ये ठीक करें:",
    errBadCount: "ग़लत संख्या:", errMax: "हद से ज़्यादा:", errGender: "इस मरहूम के लिए मुमकिन नहीं:",
    unsupportedArham: "यह सूरत ज़विल-अरहाम की है। टूल अभी इसका हिसाब नहीं करता। मुस्तनद मुफ़्ती से रुजू करें।",
    unsupportedBig: "यह मसला टूल के लिए बहुत बड़ा है। मुस्तनद मुफ़्ती से रुजू करें।",
    missionTitle: "हमारा मक़सद",
    missionText: "मीरास और ज़कात के शरई अहकाम को आम घरानों के लिए आसान बनाना। हर जवाब के साथ उसकी वजह दिखाई जाती है, फ़िक़्ह-ए-हनफ़ी (सिराजिय्या) की पैरवी की जाती है, और अमल से पहले मुस्तनद आलिम से तस्दीक़ की ताकीद की जाती है।",
    principles: [
      "हर हिस्से के साथ उसकी वजह",
      "फ़िक़्ह-ए-हनफ़ी, सिराजिय्या के मुताबिक़",
      "फ़तवा नहीं: आलिम से तस्दीक़ करें",
      "निजी: जो आप लिखते हैं वह आपके ब्राउज़र में रहता है"
    ],
    howTitle: "यह कैसे काम करता है",
    how: [
      "तरका और मौजूद वारिस लिखें",
      "टूल ख़ुद निकालता है: कौन महजूब है, मुक़र्रर हिस्से, बाक़ी, औल और रद",
      "वजह पढ़ें, रिपोर्ट प्रिंट करें, और आलिम से तस्दीक़ कराएँ"
    ],
    profileHeading: "संस्थापक के बारे में",
    reasons: {
      husband_half: "पति: 1/2, क्योंकि औलाद या पोते-पोती नहीं",
      husband_quarter: "पति: 1/4, क्योंकि औलाद या पोते-पोती मौजूद हैं",
      wife_quarter: "पत्नी / पत्नियाँ: 1/4 बराबर बँटवारा, क्योंकि औलाद नहीं",
      wife_eighth: "पत्नी / पत्नियाँ: 1/8 बराबर बँटवारा, क्योंकि औलाद मौजूद है",
      female_desc_half: "अकेली बेटी (या पोती), उसके दर्जे में बेटा नहीं: 1/2",
      female_desc_two_thirds: "दो या ज़्यादा बेटियाँ (या पोतियाँ), उस दर्जे में बेटा नहीं: 2/3 बराबर बँटवारा",
      female_desc_sixth: "पोती (पोतियाँ) एक बेटी के साथ: 1/6, जिससे दो-तिहाई पूरा होता है",
      male_desc_asaba: "बेटा / पोता: बाक़ी माल अस़बा बनकर लेता है",
      asaba_with_male: "अपने भाई के साथ अस़बा: मर्द को औरत से दोगुना",
      father_sixth_male_desc: "पिता / दादा: 1/6, क्योंकि बेटा या पोता मौजूद है",
      father_sixth_plus_asaba: "पिता / दादा: 1/6 और बाक़ी भी अस़बा बनकर, क्योंकि सिर्फ़ बेटियाँ हैं",
      father_asaba: "पिता / दादा: औलाद नहीं, इसलिए बाक़ी सब अस़बा बनकर लेता है",
      mother_sixth_children: "माता: 1/6, क्योंकि औलाद या पोते-पोती मौजूद हैं",
      mother_sixth_siblings: "माता: 1/6, क्योंकि दो या ज़्यादा भाई-बहन हैं",
      mother_third: "माता: 1/3, क्योंकि औलाद नहीं और दो से कम भाई-बहन हैं",
      mother_third_remainder: "माता: पति/पत्नी के बाद बाक़ी का 1/3 (उमरियतैन की सूरत)",
      grandmother_sixth: "दादी / नानी: सब मिलकर 1/6, जो वारिस हों उनमें बराबर",
      uterine_sixth: "एक अख़्याफ़ी भाई / बहन: 1/6",
      uterine_third: "दो या ज़्यादा अख़्याफ़ी भाई-बहन: 1/3 बराबर (मर्द = औरत)",
      sister_half: "अकेली बहन, भाई और औलाद नहीं: 1/2",
      sister_two_thirds: "दो या ज़्यादा बहनें: 2/3 बराबर बँटवारा",
      cons_sister_sixth: "अल्लाती बहन एक सगी बहन के साथ: 1/6, जिससे दो-तिहाई पूरा होता है",
      sister_asaba_daughter: "बहन बेटी के साथ: बाक़ी अस़बा बनकर (अस़बा मअल-ग़ैर)",
      asaba_remainder: "बाक़ी अस़बा बनकर लेता है (पिता की तरफ़ का सबसे क़रीबी मर्द)"
    },
    blocks: {
      nearer: "क़रीबी या मज़बूत वारिस की वजह से महरूम",
      intermediary: "जिसके वास्ते से रिश्ता है वह मौजूद है, इसलिए महरूम",
      descendants: "औलाद या पोते-पोती मौजूद हैं, इसलिए महरूम",
      two_thirds_full: "दो-तिहाई पहले ही पूरा हो चुका, इसलिए महरूम",
      mother: "माता की वजह से महरूम",
      nearer_grandmother: "क़रीब की जद्दा की वजह से महरूम",
      arham_blocked: "अस़बा या मुक़र्रर हिस्से वाले मौजूद हों तो ज़विल-अरहाम को हिस्सा नहीं मिलता"
    },
    by: "की वजह से",
    notes: {
      awl: "मुक़र्रर हिस्से पूरे तरके से ज़्यादा थे, इसलिए मसला 'औल' हुआ: सबके हिस्से अनुपात से घटाए गए।",
      radd: "अस़बा के लिए कुछ बाक़ी नहीं, इसलिए बचा हुआ माल 'रद' के ज़रिये मुक़र्रर हिस्से वालों पर उनके हिस्सों के अनुपात से लौटा। पति या पत्नी को रद नहीं मिलता।",
      tashih: "कुछ गिरोहों के हिस्से उनके लोगों में बराबर नहीं बँटते थे, इसलिए ज़र्ब देकर मसला 'तस्हीह' किया गया।",
      umariyyatayn: "सिर्फ़ पति/पत्नी + पिता + माता: माता को पति/पत्नी के बाद बाक़ी का 1/3 मिलता है (उमरियतैन)।",
      asaba_nothing_left: "मुक़र्रर हिस्सों ने पूरा तरका ले लिया, इसलिए अस़बा के लिए कुछ बाक़ी नहीं बचा।",
      remainder_unassigned: "तरके का कुछ हिस्सा इस सूची में किसी को नहीं दिया गया। वह इस सूची से बाहर के रिश्तेदारों या बैतुलमाल को जाता है। मुफ़्ती से पूछें।",
      mother_third_grandfather: "दादा के साथ (पिता नहीं) माता को पूरे माल का 1/3 मिलता है (इमाम अबू हनीफ़ा और मुहम्मद)। इमाम अबू यूसुफ़ के नज़दीक बाक़ी का 1/3। आलिम तस्दीक़ करेंगे।"
    }
  }
};
