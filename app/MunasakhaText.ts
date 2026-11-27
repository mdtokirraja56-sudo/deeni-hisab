import type { Lang } from "../lib/heirs";
import type { Halt, Relation } from "../lib/munasakha";

export interface MunText {
  title: string; sub: string; start: string; close: string; needHeirs: string; firstTitle: string; firstNote: string;
  who: string; whoHint: string; died: string; heirsOf: (n: string) => string; linkTitle: string; linkHint: string; none: string;
  newHeirs: string; calc: string; cancel: string; undo: string; more: string; stepWord: string; asl: string; awl: string; tasheeh: string;
  mafiyad: string; relation: string; zFirst: string; zSecond: string; mablagh: string; table: string; person: string; siham: string; share: string; pct: string; amount: string; tarkaTitle: string; tarkaHint: string; tarkaUnit: string; tarkaPh: string; tarkaFirst: string;
  rel: Record<Relation, { name: string; rule: string }>; mudakhala: string;
  finalTitle: string; ikhtisar: (a: string, b: string) => string; noChange: string; source: string; checked: string; print: string; dec: string; inc: string; na: string;
  verdict: string; deathCount: string; meta1: string; halt: Record<Halt, string>;
}

const R = (n: string, r: string) => ({ name: n, rule: r });

export const MUN: Record<Lang, MunText> = {
  ur: {
    tarkaTitle: 'ترکہ (اختیاری)', tarkaHint: 'مثلاً 17½ یا 17.5 یا 17 1/2 — جتنا میت چھوڑ کر مرا۔ لکھنے پر ہر وارث کا حصہ اسی مقدار میں نکلے گا۔', tarkaUnit: 'اکائی (روپیہ، دینار، بیگھہ وغیرہ)', tarkaPh: '17½', tarkaFirst: 'ترکہ',
    title: "مناسخہ", sub: "کوئی وارث ترکہ کی تقسیم سے پہلے فوت ہو جائے تو اس کا حصہ اس کے ورثاء میں تقسیم کریں۔", start: "مناسخہ شروع کریں", close: "بند کریں", needHeirs: "پہلے اوپر میتِ اول کے ورثاء چنیں۔",
    firstTitle: "میتِ اول", firstNote: "اوپر چنے ہوئے ورثاء کی بنیاد پر۔", who: "کون سا وارث تقسیم سے پہلے فوت ہوا؟", whoHint: "جس کے نام پر دبائیں گے، اس کا اپنا مسئلہ الگ بنے گا۔", died: "فوت ہوا",
    heirsOf: (n) => `${n} کے ورثاء`, linkTitle: "پہلے سے موجود افراد جو اس میت کے بھی وارث ہیں", linkHint: "جو شخص اوپر کی فہرست میں پہلے سے ہے اور اس میت کا بھی وارث ہے، اس کا رشتہ چنیں تاکہ اس کے حصے جمع ہوں۔", none: "—",
    newHeirs: "نئے ورثاء", calc: "حساب کریں", cancel: "منسوخ", undo: "آخری مرحلہ ہٹائیں", more: "اگر کوئی اور وارث بھی تقسیم سے پہلے فوت ہوا تو اوپر اس کے نام پر دبائیں۔", stepWord: "مرحلہ", asl: "اصل مسئلہ", awl: "عول", tasheeh: "تصحیح",
    mafiyad: "میت کے پاس پہلے سے سہام (ما في يده)", relation: "نسبت", zFirst: "پچھلے مجموعے کے ورثاء میں ضرب", zSecond: "اس میت کے ورثاء میں ضرب", mablagh: "مبلغ (جامعہ)", table: "اس مرحلے کے بعد", person: "نام", siham: "سہام", share: "حصہ", pct: "فیصد", amount: "رقم",
    rel: {
      istiqama: R("استقامت", "ما في يده تصحیحِ ثانی پر پورا تقسیم ہو جاتا ہے، ضرب کی ضرورت نہیں۔"),
      mumathala: R("مماثلت", "ما في يده اور تصحیحِ ثانی برابر ہیں، ضرب کی ضرورت نہیں۔"),
      muwafaqa: R("موافقت", "دونوں میں مشترک عدد ہے، اس لیے تصحیحِ ثانی کا وفق پچھلے مجموعے میں ضرب ہوگا۔"),
      mubayana: R("مبایَنت", "دونوں میں کوئی مشترک عدد نہیں، پوری تصحیحِ ثانی پچھلے مجموعے میں ضرب ہوگی۔")
    },
    mudakhala: "(مداخلت: کتاب میں موافقت ہی کے حکم میں ہے)",
    finalTitle: "رپورٹ مناسخہ", ikhtisar: (a, b) => `اختصار: ${a} کو مشترک عدد سے کم کرنے پر ${b} بنتا ہے۔`,
    noChange: "اس صورت میں باقی ورثاء کے حصوں کی نسبت وہی ہے جو میتِ اول کے مسئلے میں تھی، یعنی ورثاء کی تقسیم میں تبدیلی نہیں ہوئی۔ مناسخہ کی ضرورت نہیں، ایک ہی بار تقسیم ہو جاتی ہے (حاشیہ ۳)۔",
    source: "حوالہ: السراجیہ مع برکات السراج، باب المناسخۃ، ص ۸۵ تا ۸۹؛ فتاویٰ رضویہ ج ۱۰ ص ۴۵۸، ۴۷۲۔", checked: "نتیجہ دو طریقوں سے ملایا گیا: سہام کا مجموعہ اور ترکہ کے کسور۔ دونوں برابر ہیں۔",
    print: "رپورٹ پرنٹ / PDF", dec: "کم", inc: "زیادہ", na: "لاگو نہیں", verdict: "مبلغ (جامعہ)", deathCount: "تقسیم سے پہلے فوت ہونے والے", meta1: "میتِ اول",
    halt: {
      no_heirs: "اس میت کا کوئی وارث نہیں چنا گیا، اس لیے حساب نہیں ہو سکتا۔", invalid: "ورثاء کی تعداد یا ترتیب درست نہیں، ایپ نے حساب روک دیا۔", zawil_arham: "اس مسئلے میں ذوی الارحام آتے ہیں۔ یہ صورت ایپ میں ابھی شامل نہیں، عالم سے رجوع کریں۔",
      dead_no_share: "یہ شخص پہلے مسئلے میں محروم تھا (اس کے پاس سہام نہیں)، اس لیے اس کی وفات سے تقسیم پر اثر نہیں پڑتا۔", dead_unknown: "فوت ہونے والے کا حصہ پچھلے حساب میں نہیں ملا۔ حساب روک دیا گیا۔", mismatch: "دو طریقوں کے نتیجے میں فرق آیا، اس لیے حساب نہیں دکھایا جا رہا۔ عالم سے رجوع کریں۔", empty_heirs: "اس میت کے ورثاء چنیں۔"
    }
  },
  roman: {
    tarkaTitle: 'Tarka (ikhtiyari)', tarkaHint: 'Maslan 17½ ya 17.5 ya 17 1/2 — jitna mayyit chhod kar mara. Likhne par har waris ka hissa isi miqdar mein niklega.', tarkaUnit: 'Ikai (rupaya, dinar, bigha wagaira)', tarkaPh: '17½', tarkaFirst: 'Tarka',
    title: "Munasakha", sub: "Koi waaris tarka ki taqseem se pehle faut ho jaye to uska hissa uske apne waris mein taqseem hota hai.", start: "Munasakha shuru karein", close: "Band karein", needHeirs: "Pehle upar mayyit-e-awwal ke waris chunein.",
    firstTitle: "Mayyit-e-awwal", firstNote: "Upar chune hue waris ki buniyad par.", who: "Kaun sa waaris taqseem se pehle faut hua?", whoHint: "Jis ke naam par dabayenge, uska apna masla alag banega.", died: "Faut hua",
    heirsOf: (n) => `${n} ke waris`, linkTitle: "Pehle se maujood afraad jo is mayyit ke bhi waris hain", linkHint: "Jo shakhs upar ki list mein hai aur is mayyit ka bhi waris hai, uska rishta chunein taake uske hisse jama hon.", none: "—",
    newHeirs: "Naye waris", calc: "Hisaab karein", cancel: "Radd karein", undo: "Aakhri marhala hatayein", more: "Agar koi aur waaris bhi taqseem se pehle faut hua ho to upar uske naam par dabayein.", stepWord: "Marhala", asl: "Asl masla", awl: "Awl", tasheeh: "Tasheeh",
    mafiyad: "Mayyit ke paas pehle se siham (ma fi yadihi)", relation: "Nisbat", zFirst: "Pichle majmoo'e ke waris mein zarb", zSecond: "Is mayyit ke waris mein zarb", mablagh: "Mablagh (jami'a)", table: "Is marhale ke baad", person: "Naam", siham: "Siham", share: "Hissa", pct: "Percent", amount: "Raqam",
    rel: {
      istiqama: R("Istiqama", "Ma fi yad tasheeh-e-saani par poora bat'ta hai, zarb ki zaroorat nahi."),
      mumathala: R("Mumathala", "Ma fi yad aur tasheeh-e-saani barabar hain, zarb ki zaroorat nahi."),
      muwafaqa: R("Muwafaqa", "Dono mein mushtarak adad hai, isliye tasheeh-e-saani ka wafq pichle majmoo'e mein zarb hoga."),
      mubayana: R("Mubayana", "Dono mein koi mushtarak adad nahi, poori tasheeh-e-saani pichle majmoo'e mein zarb hogi.")
    },
    mudakhala: "(Mudakhala: kitab mein muwafaqa hi ke hukm mein hai)",
    finalTitle: "Munasakha ki report", ikhtisar: (a, b) => `Ikhtisar: ${a} ko mushtarak adad se kam karne par ${b} banta hai.`,
    noChange: "Is surat mein baqi waris ke hisson ki nisbat wahi hai jo mayyit-e-awwal ke masle mein thi, yani taqseem mein koi tabdeeli nahi aayi. Munasakha ki zaroorat nahi, ek hi baar taqseem ho jati hai (hashiya 3).",
    source: "Hawala: As-Sirajiya ma'a Barakat as-Siraj, Bab al-Munasakha, pp. 85–89; Fatawa Razaviyya j. 10 pp. 458, 472.", checked: "Natija do tareeqon se milaya gaya: siham ka majmoo'a aur tarka ke kasoor. Dono barabar hain.",
    print: "Report print / PDF", dec: "Kam", inc: "Zyada", na: "Lagu nahi", verdict: "Mablagh (jami'a)", deathCount: "Taqseem se pehle faut hone wale", meta1: "Mayyit-e-awwal",
    halt: {
      no_heirs: "Is mayyit ka koi waaris nahi chuna gaya, isliye hisaab nahi ho sakta.", invalid: "Waris ki ta'daad ya tarteeb durust nahi, app ne hisaab rok diya.", zawil_arham: "Is masle mein zawil-arham aate hain. Ye surat app mein abhi shamil nahi, aalim se rujoo karein.",
      dead_no_share: "Ye shakhs pehle masle mein mehroom tha (uske paas siham nahi), isliye uski wafaat se taqseem par asar nahi padta.", dead_unknown: "Faut hone wale ka hissa pichle hisaab mein nahi mila. Hisaab rok diya gaya.", mismatch: "Do tareeqon ke natije mein farq aaya, isliye hisaab nahi dikhaya ja raha. Aalim se rujoo karein.", empty_heirs: "Is mayyit ke waris chunein."
    }
  },
  hi: {
    tarkaTitle: 'तरका (ज़रूरी नहीं)', tarkaHint: 'मसलन 17½ या 17.5 या 17 1/2 — जितना मय्यित छोड़कर मरा। लिखने पर हर वारिस का हिस्सा इसी मिक़दार में निकलेगा।', tarkaUnit: 'इकाई (रुपया, दीनार, बीघा वग़ैरह)', tarkaPh: '17½', tarkaFirst: 'तरका',
    title: "मुनासख़ा", sub: "कोई वारिस तरके की तक़सीम से पहले फ़ौत हो जाए तो उसका हिस्सा उसके अपने वारिसों में तक़सीम होता है।", start: "मुनासख़ा शुरू करें", close: "बंद करें", needHeirs: "पहले ऊपर मय्यित-ए-अव्वल के वारिस चुनें।",
    firstTitle: "मय्यित-ए-अव्वल", firstNote: "ऊपर चुने हुए वारिसों की बुनियाद पर।", who: "कौन सा वारिस तक़सीम से पहले फ़ौत हुआ?", whoHint: "जिसके नाम पर दबाएँगे, उसका अपना मसअला अलग बनेगा।", died: "फ़ौत हुआ",
    heirsOf: (n) => `${n} के वारिस`, linkTitle: "पहले से मौजूद लोग जो इस मय्यित के भी वारिस हैं", linkHint: "जो शख़्स ऊपर की सूची में है और इस मय्यित का भी वारिस है, उसका रिश्ता चुनें ताकि उसके हिस्से जमा हों।", none: "—",
    newHeirs: "नए वारिस", calc: "हिसाब करें", cancel: "रद्द करें", undo: "आख़िरी मरहला हटाएँ", more: "अगर कोई और वारिस भी तक़सीम से पहले फ़ौत हुआ हो तो ऊपर उसके नाम पर दबाएँ।", stepWord: "मरहला", asl: "असल मसअला", awl: "अवल", tasheeh: "तसहीह",
    mafiyad: "मय्यित के पास पहले से सिहाम (मा फ़ी यदिही)", relation: "निस्बत", zFirst: "पिछले मजमूअ के वारिसों में ज़र्ब", zSecond: "इस मय्यित के वारिसों में ज़र्ब", mablagh: "मब्लग़ (जामिआ)", table: "इस मरहले के बाद", person: "नाम", siham: "सिहाम", share: "हिस्सा", pct: "प्रतिशत", amount: "रक़म",
    rel: {
      istiqama: R("इस्तिक़ामा", "मा फ़ी यद तसहीह-ए-सानी पर पूरा बँट जाता है, ज़र्ब की ज़रूरत नहीं।"),
      mumathala: R("मुमासला", "मा फ़ी यद और तसहीह-ए-सानी बराबर हैं, ज़र्ब की ज़रूरत नहीं।"),
      muwafaqa: R("मुवाफ़क़त", "दोनों में मुश्तरक अदद है, इसलिए तसहीह-ए-सानी का वफ़्क़ पिछले मजमूअ में ज़र्ब होगा।"),
      mubayana: R("मुबायनत", "दोनों में कोई मुश्तरक अदद नहीं, पूरी तसहीह-ए-सानी पिछले मजमूअ में ज़र्ब होगी।")
    },
    mudakhala: "(मुदाख़ला: किताब में मुवाफ़क़त ही के हुक्म में है)",
    finalTitle: "मुनासख़ा की रिपोर्ट", ikhtisar: (a, b) => `इख़्तिसार: ${a} को मुश्तरक अदद से कम करने पर ${b} बनता है।`,
    noChange: "इस सूरत में बाक़ी वारिसों के हिस्सों की निस्बत वही है जो मय्यित-ए-अव्वल के मसअले में थी, यानी तक़सीम में कोई तब्दीली नहीं आई। मुनासख़ा की ज़रूरत नहीं, एक ही बार तक़सीम हो जाती है (हाशिया 3)।",
    source: "हवाला: अस-सिराजिया मअ बरकातिस-सिराज, बाबुल-मुनासख़ा, पृ. 85–89; फ़तावा रज़विय्या ज. 10 पृ. 458, 472।", checked: "नतीजा दो तरीक़ों से मिलाया गया: सिहाम का मजमूअ और तरके के कुसूर। दोनों बराबर हैं।",
    print: "रिपोर्ट प्रिंट / PDF", dec: "कम", inc: "ज़्यादा", na: "लागू नहीं", verdict: "मब्लग़ (जामिआ)", deathCount: "तक़सीम से पहले फ़ौत होने वाले", meta1: "मय्यित-ए-अव्वल",
    halt: {
      no_heirs: "इस मय्यित का कोई वारिस नहीं चुना गया, इसलिए हिसाब नहीं हो सकता।", invalid: "वारिसों की तादाद या तरतीब दुरुस्त नहीं, ऐप ने हिसाब रोक दिया।", zawil_arham: "इस मसअले में ज़विल-अरहाम आते हैं। यह सूरत ऐप में अभी शामिल नहीं, आलिम से रुजू करें।",
      dead_no_share: "यह शख़्स पहले मसअले में महरूम था (उसके पास सिहाम नहीं), इसलिए उसकी वफ़ात से तक़सीम पर असर नहीं पड़ता।", dead_unknown: "फ़ौत होने वाले का हिस्सा पिछले हिसाब में नहीं मिला। हिसाब रोक दिया गया।", mismatch: "दो तरीक़ों के नतीजे में फ़र्क़ आया, इसलिए हिसाब नहीं दिखाया जा रहा। आलिम से रुजू करें।", empty_heirs: "इस मय्यित के वारिस चुनें।"
    }
  },
  en: {
    tarkaTitle: 'Estate (optional)', tarkaHint: "E.g. 17½ or 17.5 or 17 1/2 — what the deceased left. Each heir's share is then worked out in the same measure.", tarkaUnit: 'Unit (rupee, dinar, bigha, etc.)', tarkaPh: '17½', tarkaFirst: 'Estate',
    title: "Munasakha", sub: "When an heir dies before the estate is divided, his or her share is divided among that person's own heirs.", start: "Start munasakha", close: "Close", needHeirs: "First choose the heirs of the first deceased above.",
    firstTitle: "First deceased", firstNote: "Based on the heirs chosen above.", who: "Which heir died before the division?", whoHint: "Tap a name to build that person's own masala.", died: "Died",
    heirsOf: (n) => `Heirs of ${n}`, linkTitle: "People already listed who are also heirs of this deceased", linkHint: "If a person already in the list is also an heir of this deceased, choose the relation so the shares are added together.", none: "—",
    newHeirs: "New heirs", calc: "Calculate", cancel: "Cancel", undo: "Remove last stage", more: "If another heir also died before the division, tap that name above.", stepWord: "Stage", asl: "Base (asl)", awl: "Awl", tasheeh: "Tasheeh",
    mafiyad: "Parts the deceased already holds (ma fi yadihi)", relation: "Relation", zFirst: "Multiplier for the earlier total's people", zSecond: "Multiplier for this deceased's heirs", mablagh: "Mablagh (jami'a)", table: "After this stage", person: "Name", siham: "Parts", share: "Share", pct: "Percent", amount: "Amount",
    rel: {
      istiqama: R("Istiqama", "What he holds divides evenly by the second tasheeh, so no multiplication is needed."),
      mumathala: R("Mumathala", "What he holds equals the second tasheeh, so no multiplication is needed."),
      muwafaqa: R("Muwafaqa", "They share a common factor, so the wafq of the second tasheeh is multiplied into the earlier total."),
      mubayana: R("Mubayana", "They share no common factor, so the whole second tasheeh is multiplied into the earlier total.")
    },
    mudakhala: "(Mudakhala is treated as muwafaqa in the book)",
    finalTitle: "Munasakha report", ikhtisar: (a, b) => `Ikhtisar: reducing ${a} by the common factor gives ${b}.`,
    noChange: "Here the remaining heirs keep the same proportions as in the first deceased's masala, so the division did not change. Munasakha is not needed; one division is enough (footnote 3).",
    source: "Source: As-Sirajiya with Barakat as-Siraj, Bab al-Munasakha, pp. 85–89; Fatawa Razaviyya vol. 10 pp. 458, 472.", checked: "The result was verified two ways: the total of the parts and the exact fractions of the estate. Both agree.",
    print: "Print / PDF report", dec: "Decrease", inc: "Increase", na: "N/A", verdict: "Mablagh (jami'a)", deathCount: "Died before the division", meta1: "First deceased",
    halt: {
      no_heirs: "No heir was chosen for this deceased, so nothing can be calculated.", invalid: "The number or combination of heirs is not valid; the app stopped the calculation.", zawil_arham: "This masala involves zawil-arham, which the app does not cover yet. Please ask a scholar.",
      dead_no_share: "This person was barred in the earlier masala (holds no parts), so the death does not change the division.", dead_unknown: "The deceased's share was not found in the earlier calculation. The calculation was stopped.", mismatch: "The two checks disagreed, so no result is shown. Please ask a scholar.", empty_heirs: "Choose the heirs of this deceased."
    }
  }
};
      
