"use client";

import type { Lang } from "../lib/heirs";

type Kind = "fitr" | "ushr";
interface Sec { h?: string; items: string[] }
interface Pack { title: string; secs: Sec[] }

const P: Record<Kind, Record<Lang, Pack>> = {
  fitr: {
    roman: { title: "Kitab ke zaroori masail (Faizan-e-Zakat)", secs: [{ items: [
      "Wajib us par hai jo azad Musalman ho aur hajat-e-asliya ke ilawa nisab ka maalik ho. Saal guzarna (hawl) aur maal ka barhna shart nahi.",
      "Eid ki subah sadiq se wajib hota hai. Isse pehle ya Eid ke baad bhi de sakte hain, magar Eid ki namaz se pehle dena behtar hai.",
      "Gehun, aata ya sattu: aadha saa (taqriban 2 kg + 50 g). Jau, khajoor ya kishmish: ek saa (taqriban 4 kg + 100 g).",
      "Doosra anaaj (chawal, bajra, makka waghera): unki qeemat us hisab se do jo gehun ya jau ki qeemat ke barabar ho.",
      "Apni taraf se aur apni nabalig aulad ki taraf se dena wajib hai. Baalig aulad aur biwi ki taraf se wajib nahi (agar de den to ijazat se ada ho jayega).",
      "Fitra ki raqam faqeer, miskeen ya qarzdar musta'iq ko di jaye. Sayyid ko aur apne usool-o-furoo (walidain, aulad) ko dena jaiz nahi."] }] },
    en: { title: "Key rules from the book (Faizan-e-Zakat)", secs: [{ items: [
      "Due on every free Muslim who owns nisab beyond basic needs. No full year (hawl) and no growth of wealth is required.",
      "It becomes due at true dawn (subh sadiq) of Eid. It may be paid earlier or later, but paying before the Eid prayer is better.",
      "Wheat, flour or sattu: half a sa' (about 2 kg + 50 g). Barley, dates or raisins: one sa' (about 4 kg + 100 g).",
      "Other grains (rice, millet, maize etc.): pay their value equal to the price of the wheat or barley quantity.",
      "Pay for yourself and your minor children. It is not wajib for adult children or your wife (if you pay with their permission it is valid).",
      "Give it to the poor, needy or indebted who may receive zakat. Not to Sayyids, nor to your parents or children."] }] },
    ur: { title: "کتاب کے ضروری مسائل (فیضانِ زکوٰۃ)", secs: [{ items: [
      "واجب اس پر ہے جو آزاد مسلمان ہو اور حاجتِ اصلیہ کے علاوہ نصاب کا مالک ہو۔ سال گزرنا اور مال کا بڑھنا شرط نہیں۔",
      "عید کی صبحِ صادق سے واجب ہوتا ہے۔ پہلے یا بعد میں بھی دے سکتے ہیں مگر عید کی نماز سے پہلے دینا بہتر ہے۔",
      "گیہوں، آٹا یا ستو: آدھا صاع (تقریباً 2 کلو + 50 گرام)۔ جو، کھجور یا کشمش: ایک صاع (تقریباً 4 کلو + 100 گرام)۔",
      "دوسرا اناج (چاول، باجرہ، مکئی وغیرہ): اس کی قیمت اتنی دیں جتنی گیہوں یا جو کی مقدار کی قیمت ہو۔",
      "اپنی اور اپنی نابالغ اولاد کی طرف سے دینا واجب ہے۔ بالغ اولاد اور بیوی کی طرف سے واجب نہیں (اجازت سے دے دیں تو ادا ہو جائے گا)۔",
      "فقیر، مسکین یا مقروض مستحق کو دیں۔ سید کو اور اپنے والدین و اولاد کو دینا جائز نہیں۔"] }] },
    hi: { title: "किताब के ज़रूरी मसाइल (फ़ैज़ान-ए-ज़कात)", secs: [{ items: [
      "वाजिब उस पर है जो आज़ाद मुसलमान हो और हाजत-ए-असलिया के अलावा निसाब का मालिक हो। साल गुज़रना और माल का बढ़ना शर्त नहीं।",
      "ईद की सुब्ह सादिक़ से वाजिब होता है। पहले या बाद में भी दे सकते हैं, मगर ईद की नमाज़ से पहले देना बेहतर है।",
      "गेहूँ, आटा या सत्तू: आधा साअ (तक़रीबन 2 किलो + 50 ग्राम)। जौ, खजूर या किशमिश: एक साअ (तक़रीबन 4 किलो + 100 ग्राम)।",
      "दूसरा अनाज (चावल, बाजरा, मक्का वग़ैरह): उसकी क़ीमत उतनी दें जितनी गेहूँ या जौ की मिक़दार की क़ीमत हो।",
      "अपनी और अपनी नाबालिग़ औलाद की तरफ़ से देना वाजिब है। बालिग़ औलाद और बीवी की तरफ़ से वाजिब नहीं (इजाज़त से दे दें तो अदा हो जाएगा)।",
      "फ़क़ीर, मिस्कीन या मक़रूज़ मुस्तहिक़ को दें। सय्यद को और अपने वालिदैन व औलाद को देना जाइज़ नहीं।"] }] }
  },
  ushr: {
    roman: { title: "Ushr ke masail (Faizan-e-Zakat, safha 123-139)", secs: [
      { h: "Kis cheez par ushr hai", items: [
        "Zameen ki wo paidawar jisse nafa maqsood ho: anaaj (gehun, jau, chawal, makka, bajra, moong, chana), phal (aam, kela, anar, amrood, angoor, khajoor), sabzi (aalu, pyaaz, lehsun, palak, gobhi) aur masale. Kam ho ya zyada sab par.",
        "Shahad: agar ushri zameen ka ho to us par bhi ushr hai.",
        "Ushr nahi: lakdi, ghaas, bans, naryal ke pate, jhaadi, darakht aur gond. Kapas aur baingan ke podhe par nahi, unki paidawar par hai. Magar agar zameen sirf ghaas ya lakdi ke liye chhodi ho to us par bhi ushr hai.",
        "Ghar ya qabristan ke andar ugi cheezon par ushr nahi. Jo fasal boi hi nahi us par bhi ushr nahi."] },
      { h: "Kitna", items: [
        "Barish, nehar, nala ya bina qeemat ke paani: 10% (daswan hissa). Dol, apna tubewell ya khareeda hua paani: 5% (beeswan hissa).",
        "Kabhi barish kabhi dol ho to jis paani se zyada sinchai hui wahi hukm. Barabar ho to ahtiyat ke liye 10% dein aur Aalim se poochh lein.",
        "Nisab nahi. Saal guzarna shart nahi. Har fasal (kharif, rabi) par alag wajib hai.",
        "Beej, khaad, hal-bail, mazdoori, kataai aur sarkari lagaan nikal kar nahi, poori paidawar par ushr hai."] },
      { h: "Kis par wajib", items: [
        "Jo paidawar ka maalik ho. Baalig ya aaqil hona shart nahi. Shar'i faqeer aur qarzdar par bhi wajib hai.",
        "Batai par ho to har ek apne hisse ka ushr dega. Kiraye par di hui zameen ka ushr kirayedar par hai, maalik par nahi.",
        "Thike par di zameen ka ushr thike par lene wale par hai. Poori fasal bech di to ushr bechne wale par hai."] },
      { h: "Kab aur kaise", items: [
        "Fasal pak kar nafa uthane ke qabil ho jaye to wajib. Kaatne ya todne ke baad hisab laga kar dein.",
        "Fasal ya phal zahir hone ke baad peshgi dena jaiz hai. Boone se pehle dena jaiz nahi.",
        "Anaaj dein ya uski poori qeemat, dono jaiz. Dene se pehle paidawar istemal karna jaiz nahi. Kha li ho to utna ushr ada karna hoga.",
        "Be-wajah der karne wala gunahgar hai. Pichhle saal na diya ho to andaza laga kar ada karein.",
        "Fasal sailaab, aag, pala ya aasmani aafat se tabah ho jaye to ushr saqit hai, jo bacha uska ushr dein. Janwar kha jayein to saqit nahi.",
        "Ushr unhi ko dein jinhe zakat di ja sakti hai."] }
    ] },
    en: { title: "Ushr rules (Faizan-e-Zakat, pp. 123-139)", secs: [
      { h: "What it is due on", items: [
        "Any produce of the land grown for benefit: grains (wheat, barley, rice, maize, millet, gram), fruits (mango, banana, pomegranate, guava, grapes, dates), vegetables (potato, onion, garlic, spinach, cauliflower) and spices. Little or much.",
        "Honey: due as well if the land is ushri.",
        "Not due on: wood, grass, reeds, bamboo, coconut leaves, bushes, trees and gum. Not on cotton or aubergine plants, but on their produce. If land was left only for grass or wood, ushr is due on that too.",
        "Not on things growing inside a house or graveyard. Not if nothing was sown."] },
      { h: "How much", items: [
        "Rain, river, canal or free water: 10%. Bucket, own tube-well or purchased water: 5%.",
        "If sometimes rain and sometimes bucket/tube-well, the water that irrigated for the greater part decides. If equal, pay 10% to be safe and ask your scholar.",
        "No nisab. No full year needed. Due on every harvest (kharif and rabi) separately.",
        "Costs (seed, fertiliser, ploughing, labour, harvesting, land revenue) are not deducted: ushr is on the whole produce."] },
      { h: "Who pays", items: [
        "The owner of the produce. Need not be an adult or sane. Even a shar'i poor person or a debtor must pay.",
        "In sharecropping (batai) each pays on his own share. On rented land the tenant pays, not the landlord.",
        "On contract (thika) land, the one who took the contract. If the whole crop was sold, the seller pays."] },
      { h: "When and how", items: [
        "Due when the crop is ripe and usable. Calculate after harvest or picking.",
        "Advance payment is allowed once the crop or fruit has appeared. Not before sowing.",
        "May be paid in grain or in full value. Do not use the produce before paying; if you ate some, pay for it.",
        "Delaying without reason is a sin. For earlier unpaid years, estimate and pay.",
        "If the crop is destroyed by flood, fire, frost or a natural calamity, ushr falls for that part; pay on what remains. If animals ate it, it does not fall.",
        "Give it only to those who may receive zakat."] }
    ] },
    ur: { title: "عشر کے مسائل (فیضانِ زکوٰۃ، صفحہ 123 تا 139)", secs: [
      { h: "کس چیز پر عشر ہے", items: [
        "زمین کی وہ پیداوار جس سے نفع مقصود ہو: اناج (گیہوں، جو، چاول، مکئی، باجرہ، مونگ، چنا)، پھل (آم، کیلا، انار، امرود، انگور، کھجور)، سبزیاں (آلو، پیاز، لہسن، پالک، گوبھی) اور مسالے۔ کم ہو یا زیادہ سب پر۔",
        "شہد: اگر عشری زمین کا ہو تو اس پر بھی عشر ہے۔",
        "عشر نہیں: لکڑی، گھاس، بانس، ناریل کے پتے، جھاڑی، درخت اور گوند۔ کپاس اور بینگن کے پودوں پر نہیں، ان کی پیداوار پر ہے۔ مگر زمین صرف گھاس یا لکڑی کے لیے چھوڑی ہو تو اس پر بھی عشر ہے۔",
        "گھر یا قبرستان کے اندر اگنے والی چیزوں پر عشر نہیں۔ جو فصل بوئی ہی نہ ہو اس پر بھی نہیں۔"] },
      { h: "کتنا", items: [
        "بارش، نہر، نالے یا بلا قیمت پانی: 10% (دسواں حصہ)۔ ڈول، اپنا ٹیوب ویل یا خریدا ہوا پانی: 5% (بیسواں حصہ)۔",
        "کبھی بارش کبھی ڈول ہو تو جس پانی سے زیادہ سینچائی ہوئی وہی حکم۔ برابر ہو تو احتیاطاً 10% دیں اور عالم سے پوچھ لیں۔",
        "نصاب نہیں۔ سال گزرنا شرط نہیں۔ ہر فصل (خریف، ربیع) پر الگ واجب ہے۔",
        "بیج، کھاد، ہل بیل، مزدوری، کٹائی اور سرکاری لگان نکال کر نہیں، پوری پیداوار پر عشر ہے۔"] },
      { h: "کس پر واجب", items: [
        "جو پیداوار کا مالک ہو۔ بالغ یا عاقل ہونا شرط نہیں۔ شرعی فقیر اور مقروض پر بھی واجب ہے۔",
        "بٹائی پر ہو تو ہر ایک اپنے حصے کا عشر دے گا۔ کرائے پر دی ہوئی زمین کا عشر کرایہ دار پر ہے، مالک پر نہیں۔",
        "ٹھیکے پر دی زمین کا عشر ٹھیکے پر لینے والے پر ہے۔ پوری فصل بیچ دی تو عشر بیچنے والے پر ہے۔"] },
      { h: "کب اور کیسے", items: [
        "فصل پک کر نفع اٹھانے کے قابل ہو جائے تو واجب۔ کاٹنے یا توڑنے کے بعد حساب لگا کر دیں۔",
        "فصل یا پھل ظاہر ہونے کے بعد پیشگی دینا جائز ہے۔ بونے سے پہلے دینا جائز نہیں۔",
        "اناج دیں یا اس کی پوری قیمت، دونوں جائز۔ دینے سے پہلے پیداوار استعمال کرنا جائز نہیں۔ کھا لی ہو تو اتنا عشر ادا کرنا ہوگا۔",
        "بلا وجہ دیر کرنے والا گنہگار ہے۔ پچھلے سال نہ دیا ہو تو اندازہ لگا کر ادا کریں۔",
        "فصل سیلاب، آگ، پالا یا آسمانی آفت سے تباہ ہو جائے تو عشر ساقط ہے، جو بچا اس کا عشر دیں۔ جانور کھا جائیں تو ساقط نہیں۔",
        "عشر انہی کو دیں جنہیں زکوٰۃ دی جا سکتی ہے۔"] }
    ] },
    hi: { title: "उश्र के मसाइल (फ़ैज़ान-ए-ज़कात, सफ़्हा 123 से 139)", secs: [
      { h: "किस चीज़ पर उश्र है", items: [
        "ज़मीन की वो पैदावार जिससे नफ़ा मक़सूद हो: अनाज (गेहूँ, जौ, चावल, मक्का, बाजरा, मूँग, चना), फल (आम, केला, अनार, अमरूद, अंगूर, खजूर), सब्ज़ियाँ (आलू, प्याज़, लहसुन, पालक, गोभी) और मसाले। कम हो या ज़्यादा सब पर।",
        "शहद: अगर उश्री ज़मीन का हो तो उस पर भी उश्र है।",
        "उश्र नहीं: लकड़ी, घास, बाँस, नारियल के पत्ते, झाड़ी, दरख़्त और गोंद। कपास और बैंगन के पौधों पर नहीं, उनकी पैदावार पर है। मगर ज़मीन सिर्फ़ घास या लकड़ी के लिए छोड़ी हो तो उस पर भी उश्र है।",
        "घर या क़ब्रिस्तान के अंदर उगने वाली चीज़ों पर उश्र नहीं। जो फ़सल बोई ही न हो उस पर भी नहीं।"] },
      { h: "कितना", items: [
        "बारिश, नहर, नाले या बिना क़ीमत के पानी: 10% (दसवाँ हिस्सा)। डोल, अपना ट्यूबवेल या ख़रीदा हुआ पानी: 5% (बीसवाँ हिस्सा)।",
        "कभी बारिश कभी डोल हो तो जिस पानी से ज़्यादा सिंचाई हुई वही हुक्म। बराबर हो तो एहतियातन 10% दें और आलिम से पूछ लें।",
        "निसाब नहीं। साल गुज़रना शर्त नहीं। हर फ़सल (ख़रीफ़, रबी) पर अलग वाजिब है।",
        "बीज, खाद, हल-बैल, मज़दूरी, कटाई और सरकारी लगान निकाल कर नहीं, पूरी पैदावार पर उश्र है।"] },
      { h: "किस पर वाजिब", items: [
        "जो पैदावार का मालिक हो। बालिग़ या आक़िल होना शर्त नहीं। शरई फ़क़ीर और मक़रूज़ पर भी वाजिब है।",
        "बटाई पर हो तो हर एक अपने हिस्से का उश्र देगा। किराये पर दी हुई ज़मीन का उश्र किरायेदार पर है, मालिक पर नहीं।",
        "ठेके पर दी ज़मीन का उश्र ठेके पर लेने वाले पर है। पूरी फ़सल बेच दी तो उश्र बेचने वाले पर है।"] },
      { h: "कब और कैसे", items: [
        "फ़सल पक कर नफ़ा उठाने के क़ाबिल हो जाए तो वाजिब। काटने या तोड़ने के बाद हिसाब लगा कर दें।",
        "फ़सल या फल ज़ाहिर होने के बाद पेशगी देना जाइज़ है। बोने से पहले देना जाइज़ नहीं।",
        "अनाज दें या उसकी पूरी क़ीमत, दोनों जाइज़। देने से पहले पैदावार इस्तेमाल करना जाइज़ नहीं। खा ली हो तो उतना उश्र अदा करना होगा।",
        "बिला वजह देर करने वाला गुनहगार है। पिछले साल न दिया हो तो अंदाज़ा लगा कर अदा करें।",
        "फ़सल सैलाब, आग, पाला या आसमानी आफ़त से तबाह हो जाए तो उश्र साक़ित है, जो बचा उसका उश्र दें। जानवर खा जाएँ तो साक़ित नहीं।",
        "उश्र उन्हीं को दें जिन्हें ज़कात दी जा सकती है।"] }
    ] }
  }
};

export function BookNotes({ kind, lang }: { kind: Kind; lang: Lang }) {
  const p = P[kind][lang];
  return (
    <details className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
      <summary className="cursor-pointer text-sm font-extrabold text-deen">{p.title}</summary>
      {p.secs.map((sec, k) => (
        <div key={k} className="mt-3">
          {sec.h && <h5 className="text-xs font-extrabold text-emerald-800">{sec.h}</h5>}
          <ul className="mt-1 list-disc space-y-2 ps-5 text-xs leading-6 text-slate-600">
            {sec.items.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      ))}
    </details>
  );
}
