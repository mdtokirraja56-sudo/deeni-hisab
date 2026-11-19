// lib/copyLand.ts - text for the land converter, 4 languages.
import type { Lang } from "./heirs";

const en = {
  chip: "Land (Zameen)", title: "Land area converter", sub: "Exact units, plus your own local bigha / kattha",
  modeArea: "Convert an area", modeLw: "Length × width",
  qty: "Amount of land", unit: "Unit", length: "Length", width: "Width", lenUnit: "Measured in",
  ft: "Feet", yd: "Yards", m: "Metres",
  sqft: "Square feet", sqyd: "Square yards", sqm: "Square metres", decimal: "Decimal (Cent)", acre: "Acre", hectare: "Hectare", are: "Are",
  localTitle: "My local units (optional)", localName: "Name", localSize: "1 unit equals", localHint: "Bigha, kattha, biswa, kanal, marla… differ by region. Enter the size from your own land record; it is saved on this phone only.",
  localName1: "Bigha", localName2: "Kattha",
  result: "Result", areaIs: "Area", copy: "Copy", share: "Share", copied: "Copied",
  errNum: "Enter a valid number.", errLw: "Enter both length and width.",
  moreUnits: "More units (all regions)", g_north: "North India", g_east: "East India", g_south: "South & West India", g_hills: "Hill regions",
  partOf: "1 {p} equals", howTitle: "How to use",
  how: ["Type the amount of land and choose its unit (acre, decimal, square yard, square feet…).", "Press Calculate: the same land is shown in every unit.", "For bigha, kattha, dhur and other local units, open 'My local units' and write the size from your land record once, for example 1 bigha = 27000 sq ft. Or say how many small units make a bigger one: choose '1 Bigha equals' and type 20 for kattha. It stays on this phone only.", "Units with a size then appear in the result and in the unit list.", "If you only know the plot's sides, use Length × width."],
  note: "Square feet, yards, metres, decimal, acre, hectare and are are fixed definitions (1 decimal = 1/100 acre = 435.6 sq ft). Local units are only as correct as the value you enter; confirm it from your land record (khasra/khatauni) or revenue office, and confirm any inheritance use with your Aalim."
};
export type CopyLand = typeof en;

export const copyLand: Record<Lang, CopyLand> = {
  en,
  roman: {
    chip: "Zameen", title: "Zameen ka rakba converter", sub: "Pakke units aur aapka apna bigha / kattha",
    modeArea: "Rakba badlein", modeLw: "Lambai × chaudai",
    qty: "Zameen ki miqdar", unit: "Unit", length: "Lambai", width: "Chaudai", lenUnit: "Naap",
    ft: "Foot", yd: "Gaz", m: "Meter",
    sqft: "Square foot", sqyd: "Square gaz", sqm: "Square meter", decimal: "Decimal (Cent)", acre: "Acre", hectare: "Hectare", are: "Are",
    localTitle: "Meri maqami ikaiyan (ikhtiyari)", localName: "Naam", localSize: "1 ikai barabar", localHint: "Bigha, kattha, biswa, kanal, marla… ilaake ke hisaab se alag hote hain. Apne zameen ke record se size likhein; ye sirf is phone mein save hota hai.",
    localName1: "Bigha", localName2: "Kattha",
    result: "Natija", areaIs: "Rakba", copy: "Copy", share: "Share", copied: "Copy ho gaya",
    errNum: "Sahi number likhein.", errLw: "Lambai aur chaudai dono likhein.",
    moreUnits: "Aur units (sab ilaake)", g_north: "Shimali Hindustan", g_east: "Mashriqi Hindustan", g_south: "Junubi aur Maghribi Hindustan", g_hills: "Pahadi ilaake",
    partOf: "1 {p} barabar", howTitle: "Kaise istemal karein",
    how: ["Zameen ki miqdar likhein aur uski ikai chunein (acre, decimal, square gaz, square foot…).", "Calculate dabayein: wahi zameen har ikai mein dikhegi.", "Bigha, kattha, dhur jaisi maqami ikaiyon ke liye 'Meri maqami ikaiyan' kholein aur apne record se size ek baar likhein, jaise 1 bigha = 27000 sq ft. Ya ye likhein ki kitni chhoti ikaiyan milkar badi banti hain: '1 Bigha barabar' chun kar kattha ke liye 20 likhein. Ye sirf is phone mein rehta hai.", "Jis ikai ka size likha ho wo natije aur ikai ki fehrist mein aa jati hai.", "Sirf plot ki taraf (side) maloom hon to Lambai × chaudai use karein."],
    note: "Square foot, gaz, meter, decimal, acre, hectare aur are tay shuda paimane hain (1 decimal = 1/100 acre = 435.6 sq ft). Maqami ikaiyan utni hi durust hain jitni aapki likhi hui value; apne zameen ke record (khasra/khatauni) ya revenue office se confirm karein, aur wirasat mein istemal apne Aalim se confirm karwayein."
  },
  ur: {
    chip: "زمین", title: "زمین کے رقبے کا کنورٹر", sub: "مستند اکائیاں، اور آپ کی اپنی مقامی بیگھہ / کٹھا",
    modeArea: "رقبہ تبدیل کریں", modeLw: "لمبائی × چوڑائی",
    qty: "زمین کی مقدار", unit: "اکائی", length: "لمبائی", width: "چوڑائی", lenUnit: "پیمائش",
    ft: "فٹ", yd: "گز", m: "میٹر",
    sqft: "مربع فٹ", sqyd: "مربع گز", sqm: "مربع میٹر", decimal: "ڈسمل (سینٹ)", acre: "ایکڑ", hectare: "ہیکٹر", are: "آر",
    localTitle: "میری مقامی اکائیاں (اختیاری)", localName: "نام", localSize: "1 اکائی برابر", localHint: "بیگھہ، کٹھا، بسوہ، کنال، مرلہ وغیرہ علاقے کے لحاظ سے مختلف ہوتے ہیں۔ اپنے زمین کے ریکارڈ سے سائز درج کریں؛ یہ صرف اسی فون میں محفوظ ہوتا ہے۔",
    localName1: "بیگھہ", localName2: "کٹھا",
    result: "نتیجہ", areaIs: "رقبہ", copy: "کاپی", share: "شیئر", copied: "کاپی ہو گیا",
    errNum: "درست نمبر لکھیں۔", errLw: "لمبائی اور چوڑائی دونوں لکھیں۔",
    moreUnits: "مزید اکائیاں (تمام علاقے)", g_north: "شمالی ہندوستان", g_east: "مشرقی ہندوستان", g_south: "جنوبی و مغربی ہندوستان", g_hills: "پہاڑی علاقے",
    partOf: "1 {p} برابر", howTitle: "استعمال کا طریقہ",
    how: ["زمین کی مقدار لکھیں اور اس کی اکائی چنیں (ایکڑ، ڈسمل، مربع گز، مربع فٹ…)۔", "حساب کریں دبائیں: وہی زمین ہر اکائی میں دکھائی دے گی۔", "بیگھہ، کٹھا، دھُر جیسی مقامی اکائیوں کے لیے 'میری مقامی اکائیاں' کھولیں اور اپنے ریکارڈ سے سائز ایک بار لکھیں، جیسے 1 بیگھہ = 27000 مربع فٹ۔ یا یہ لکھیں کہ کتنی چھوٹی اکائیاں مل کر بڑی بنتی ہیں: '1 بیگھہ برابر' چن کر کٹھا کے لیے 20 لکھیں۔ یہ صرف اسی فون میں رہتا ہے۔", "جس اکائی کا سائز لکھا ہو وہ نتیجے اور اکائی کی فہرست میں آ جاتی ہے۔", "صرف پلاٹ کی اطراف معلوم ہوں تو لمبائی × چوڑائی استعمال کریں۔"],
    note: "مربع فٹ، گز، میٹر، ڈسمل، ایکڑ، ہیکٹر اور آر طے شدہ پیمانے ہیں (1 ڈسمل = 1/100 ایکڑ = 435.6 مربع فٹ)۔ مقامی اکائیاں اتنی ہی درست ہیں جتنی آپ کی لکھی ہوئی قیمت؛ اسے اپنے زمین کے ریکارڈ (خسرہ/کھتونی) یا ریونیو آفس سے تصدیق کریں، اور وراثت میں استعمال اپنے عالم سے تصدیق کروائیں۔"
  },
  hi: {
    chip: "ज़मीन", title: "ज़मीन के रकबे का कन्वर्टर", sub: "पक्की इकाइयाँ, और आपकी अपनी स्थानीय बीघा / कट्ठा",
    modeArea: "रकबा बदलें", modeLw: "लंबाई × चौड़ाई",
    qty: "ज़मीन की मात्रा", unit: "इकाई", length: "लंबाई", width: "चौड़ाई", lenUnit: "नाप",
    ft: "फ़ुट", yd: "गज़", m: "मीटर",
    sqft: "वर्ग फ़ुट", sqyd: "वर्ग गज़", sqm: "वर्ग मीटर", decimal: "डिसमिल (सेंट)", acre: "एकड़", hectare: "हेक्टेयर", are: "आर",
    localTitle: "मेरी स्थानीय इकाइयाँ (वैकल्पिक)", localName: "नाम", localSize: "1 इकाई बराबर", localHint: "बीघा, कट्ठा, बिस्वा, कनाल, मरला आदि इलाके के हिसाब से अलग होते हैं। अपने ज़मीन के रिकॉर्ड से साइज़ लिखें; यह सिर्फ़ इसी फ़ोन में सेव होता है।",
    localName1: "बीघा", localName2: "कट्ठा",
    result: "नतीजा", areaIs: "रकबा", copy: "कॉपी", share: "शेयर", copied: "कॉपी हो गया",
    errNum: "सही नंबर लिखें।", errLw: "लंबाई और चौड़ाई दोनों लिखें।",
    moreUnits: "और इकाइयाँ (सभी इलाके)", g_north: "उत्तर भारत", g_east: "पूर्वी भारत", g_south: "दक्षिण और पश्चिम भारत", g_hills: "पहाड़ी इलाके",
    partOf: "1 {p} बराबर", howTitle: "इस्तेमाल का तरीक़ा",
    how: ["ज़मीन की मात्रा लिखें और उसकी इकाई चुनें (एकड़, डिसमिल, वर्ग गज़, वर्ग फ़ुट…)।", "हिसाब करें दबाएँ: वही ज़मीन हर इकाई में दिखेगी।", "बीघा, कट्ठा, धुर जैसी स्थानीय इकाइयों के लिए 'मेरी स्थानीय इकाइयाँ' खोलें और अपने रिकॉर्ड से साइज़ एक बार लिखें, जैसे 1 बीघा = 27000 वर्ग फ़ुट। या लिखें कि कितनी छोटी इकाइयाँ मिलकर बड़ी बनती हैं: '1 बीघा बराबर' चुनकर कट्ठा के लिए 20 लिखें। यह सिर्फ़ इसी फ़ोन में रहता है।", "जिस इकाई का साइज़ लिखा हो वह नतीजे और इकाई की सूची में आ जाती है।", "सिर्फ़ प्लॉट की भुजाएँ पता हों तो लंबाई × चौड़ाई इस्तेमाल करें।"],
    note: "वर्ग फ़ुट, गज़, मीटर, डिसमिल, एकड़, हेक्टेयर और आर तय पैमाने हैं (1 डिसमिल = 1/100 एकड़ = 435.6 वर्ग फ़ुट)। स्थानीय इकाइयाँ उतनी ही सही हैं जितनी आपकी लिखी क़ीमत; इसे अपने ज़मीन के रिकॉर्ड (खसरा/खतौनी) या राजस्व कार्यालय से पक्का करें, और विरासत में इस्तेमाल अपने आलिम से पक्का करवाएँ।"
  }
};
    
