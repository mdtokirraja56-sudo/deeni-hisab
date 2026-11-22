"use client";

import { useState } from "react";
import { HandCoins } from "lucide-react";
import type { Lang } from "../lib/heirs";
import { copyMore } from "../lib/copyMore";
import { calculateFitr, FITR_RULES, type FitrGrain } from "../lib/fitr";
import { parseAmount, sanitizeDecimal } from "../lib/numbers";
import { Field, Note, ResultBox, Tile } from "./calcUi";
import { SaveCase } from "./AccountPanel";
import { BookNotes } from "./BookNotes";
import { COMMON, Pills, StepHeader, StepNav, YesNo, tr, type L4 } from "./StepKit";

const T = {
  title: { roman: "Sadqa-e-Fitr", en: "Sadaqah al-Fitr", ur: "صدقۂ فطر", hi: "सदक़ा-ए-फ़ित्र" },
  steps: {
    roman: ["Wajib hai?", "Kiske liye", "Kya denge", "Qeemat", "Natija"],
    en: ["Is it due?", "For whom", "What to give", "Price", "Result"],
    ur: ["واجب ہے؟", "کس کی طرف سے", "کیا دیں گے", "قیمت", "نتیجہ"],
    hi: ["वाजिब है?", "किसकी तरफ़ से", "क्या देंगे", "क़ीमत", "नतीजा"]
  } as Record<Lang, string[]>,
  aim: {
    roman: "Maqsad: Ramzan ke roze ki kotahiyon ki talafi aur gareebon ki Eid. Ye Zakat se alag hai: ismein saal guzarna shart nahi.",
    en: "Purpose: to make up for lapses in the fast and to let the poor enjoy Eid. It is separate from Zakat: no full year is required.",
    ur: "مقصد: روزوں کی کوتاہیوں کی تلافی اور غریبوں کی عید۔ یہ زکوٰۃ سے الگ ہے: اس میں سال گزرنا شرط نہیں۔",
    hi: "मक़सद: रोज़ों की कोताहियों की तलाफ़ी और ग़रीबों की ईद। ये ज़कात से अलग है: इसमें साल गुज़रना शर्त नहीं।"
  },
  q1: {
    roman: "Kya aap azad Musalman hain aur hajat-e-asliya (ghar, kapde, bartan, sawari) ke ilawa saade 52 tola chandi ki qeemat ke barabar maal ke maalik hain?",
    en: "Are you a free Muslim who owns wealth worth at least the silver nisab (52.5 tola) beyond basic needs (home, clothes, utensils, vehicle)?",
    ur: "کیا آپ آزاد مسلمان ہیں اور حاجتِ اصلیہ (گھر، کپڑے، برتن، سواری) کے علاوہ ساڑھے باون تولہ چاندی کی قیمت کے برابر مال کے مالک ہیں؟",
    hi: "क्या आप आज़ाद मुसलमान हैं और हाजत-ए-असलिया (घर, कपड़े, बर्तन, सवारी) के अलावा साढ़े बावन तोला चाँदी की क़ीमत के बराबर माल के मालिक हैं?"
  },
  yes: { roman: "Haan", en: "Yes", ur: "جی ہاں", hi: "हाँ" },
  no: { roman: "Nahi / pata nahi", en: "No / not sure", ur: "نہیں / پتا نہیں", hi: "नहीं / पता नहीं" },
  noNote: {
    roman: "Agar nisab nahi to fitra wajib nahi, magar dena sawab hai. Aage badh kar hisab dekh sakte hain.",
    en: "If you do not own nisab, fitra is not wajib, but giving it is rewarded. You may still continue to see the amount.",
    ur: "اگر نصاب نہیں تو فطرہ واجب نہیں مگر دینا ثواب ہے۔ آگے بڑھ کر رقم دیکھ سکتے ہیں۔",
    hi: "अगर निसाब नहीं तो फ़ित्रा वाजिब नहीं, मगर देना सवाब है। आगे बढ़ कर रक़म देख सकते हैं।"
  },
  chk: {
    roman: "Nisab jaanchna chahte hain to (optional):", en: "To check nisab (optional):",
    ur: "نصاب جانچنا چاہیں تو (اختیاری):", hi: "निसाब जाँचना चाहें तो (वैकल्पिक):"
  },
  surplus: { roman: "Hajat se zyada maal (₹)", en: "Wealth beyond basic needs (₹)", ur: "حاجت سے زائد مال (₹)", hi: "हाजत से ज़्यादा माल (₹)" },
  silver: { roman: "Chandi ka bhaav (₹ per gram)", en: "Silver price (₹ per gram)", ur: "چاندی کا بھاؤ (₹ فی گرام)", hi: "चाँदी का भाव (₹ प्रति ग्राम)" },
  selfQ: { roman: "Aap khud ke liye", en: "For yourself", ur: "آپ خود", hi: "आप ख़ुद" },
  minors: { roman: "Nabalig bachche (jinka kharch aap uthate hain)", en: "Minor children (whom you support)", ur: "نابالغ بچے (جن کا خرچ آپ اٹھاتے ہیں)", hi: "नाबालिग़ बच्चे (जिनका ख़र्च आप उठाते हैं)" },
  others: { roman: "Doosre (biwi, baalig aulad, mehman: unki ijazat se)", en: "Others (wife, adult children, guests: with their permission)", ur: "دوسرے (بیوی، بالغ اولاد، مہمان: ان کی اجازت سے)", hi: "दूसरे (बीवी, बालिग़ औलाद, मेहमान: उनकी इजाज़त से)" },
  whoNote: {
    roman: "Aap par apni aur nabalig aulad ki taraf se dena wajib hai. Biwi aur baalig aulad ki taraf se wajib nahi.",
    en: "You must pay for yourself and your minor children. Not wajib for your wife and adult children.",
    ur: "آپ پر اپنی اور نابالغ اولاد کی طرف سے دینا واجب ہے۔ بیوی اور بالغ اولاد کی طرف سے واجب نہیں۔",
    hi: "आप पर अपनी और नाबालिग़ औलाद की तरफ़ से देना वाजिब है। बीवी और बालिग़ औलाद की तरफ़ से वाजिब नहीं।"
  },
  grain: { roman: "Kya dena hai", en: "What to give", ur: "کیا دینا ہے", hi: "क्या देना है" },
  gWheat: { roman: "Gehun / aata / sattu", en: "Wheat / flour / sattu", ur: "گیہوں / آٹا / ستو", hi: "गेहूँ / आटा / सत्तू" },
  gBarley: { roman: "Jau", en: "Barley", ur: "جو", hi: "जौ" },
  gDates: { roman: "Khajoor", en: "Dates", ur: "کھجور", hi: "खजूर" },
  gRaisins: { roman: "Kishmish", en: "Raisins", ur: "کشمش", hi: "किशमिश" },
  gOther: { roman: "Doosra anaaj (qeemat se)", en: "Other grain (by value)", ur: "دوسرا اناج (قیمت سے)", hi: "दूसरा अनाज (क़ीमत से)" },
  wLabel: { roman: "Aadhe saa ka wazan (gehun)", en: "Weight of half sa' (wheat)", ur: "آدھے صاع کا وزن (گیہوں)", hi: "आधे साअ का वज़न (गेहूँ)" },
  w2047: { roman: "2 kg 47 g", en: "2 kg 47 g", ur: "2 کلو 47 گرام", hi: "2 किलो 47 ग्राम" },
  w1633: { roman: "1 kg 633 g", en: "1 kg 633 g", ur: "1 کلو 633 گرام", hi: "1 किलो 633 ग्राम" },
  wNote: {
    roman: "Kitab: gehun aadha saa = taqriban 2 kg 50 g; jau, khajoor, kishmish ek saa = taqriban 4 kg 100 g.",
    en: "Book: wheat half sa' ≈ 2 kg 50 g; barley, dates, raisins one sa' ≈ 4 kg 100 g.",
    ur: "کتاب: گیہوں آدھا صاع ≈ 2 کلو 50 گرام؛ جو، کھجور، کشمش ایک صاع ≈ 4 کلو 100 گرام۔",
    hi: "किताब: गेहूँ आधा साअ ≈ 2 किलो 50 ग्राम; जौ, खजूर, किशमिश एक साअ ≈ 4 किलो 100 ग्राम।"
  },
  otherNote: {
    roman: "Doosre anaaj (chawal, bajra, makka) me gehun ya jau ki miqdar ki qeemat dein. Neeche gehun ka bhaav likhein.",
    en: "For other grains (rice, millet, maize) pay the value of the wheat or barley amount. Enter the wheat price below.",
    ur: "دوسرے اناج (چاول، باجرہ، مکئی) میں گیہوں یا جو کی مقدار کی قیمت دیں۔ نیچے گیہوں کا بھاؤ لکھیں۔",
    hi: "दूसरे अनाज (चावल, बाजरा, मक्का) में गेहूँ या जौ की मिक़दार की क़ीमत दें। नीचे गेहूँ का भाव लिखें।"
  },
  price: { roman: "Bhaav (₹ per kg)", en: "Price (₹ per kg)", ur: "بھاؤ (₹ فی کلو)", hi: "भाव (₹ प्रति किलो)" },
  perP: { roman: "Ek shakhs ka fitra", en: "Fitra per person", ur: "فی کس فطرہ", hi: "प्रति व्यक्ति फ़ित्रा" },
  qty: { roman: "Miqdar (ek shakhs)", en: "Quantity (one person)", ur: "مقدار (ایک شخص)", hi: "मिक़दार (एक व्यक्ति)" },
  tot: { roman: "Kul fitra", en: "Total fitra", ur: "کل فطرہ", hi: "कुल फ़ित्रा" },
  people: { roman: "afraad", en: "people", ur: "افراد", hi: "व्यक्ति" },
  timing: {
    roman: "Eid ki subah sadiq se wajib. Eid ki namaz se pehle dena behtar. Faqeer, miskeen ya qarzdar musta'iq ko dein; Sayyid, walidain aur aulad ko dena jaiz nahi.",
    en: "Due from true dawn of Eid. Better to pay before the Eid prayer. Give to the poor, needy or indebted; not to Sayyids, parents or children.",
    ur: "عید کی صبحِ صادق سے واجب۔ عید کی نماز سے پہلے دینا بہتر۔ فقیر، مسکین یا مقروض مستحق کو دیں؛ سید، والدین اور اولاد کو دینا جائز نہیں۔",
    hi: "ईद की सुब्ह सादिक़ से वाजिब। ईद की नमाज़ से पहले देना बेहतर। फ़क़ीर, मिस्कीन या मक़रूज़ मुस्तहिक़ को दें; सय्यद, वालिदैन और औलाद को देना जाइज़ नहीं।"
  },
  fill: { roman: "Pehle kam az kam ek shakhs aur bhaav likhein.", en: "First enter at least one person and the price.", ur: "پہلے کم از کم ایک شخص اور بھاؤ لکھیں۔", hi: "पहले कम से कम एक व्यक्ति और भाव लिखें।" },
  nisabOk: { roman: "Aapka maal nisab tak hai: fitra wajib.", en: "Your wealth reaches nisab: fitra is wajib.", ur: "آپ کا مال نصاب تک ہے: فطرہ واجب۔", hi: "आपका माल निसाब तक है: फ़ित्रा वाजिब।" },
  nisabNo: { roman: "Aapka maal nisab se kam hai: fitra wajib nahi.", en: "Your wealth is below nisab: fitra is not wajib.", ur: "آپ کا مال نصاب سے کم ہے: فطرہ واجب نہیں۔", hi: "आपका माल निसाब से कम है: फ़ित्रा वाजिब नहीं।" }
} satisfies Record<string, L4 | Record<Lang, string[]>>;

const kg = (n: number) => `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 }).format(n)} kg`;
const ints = (s: string) => sanitizeDecimal(s).replace(/\./g, "");

export function FitrWizard({ lang, money }: { lang: Lang; money: (n: number) => string }) {
  const x = <K extends keyof typeof T>(k: K): string => tr(lang, T[k] as L4);
  const cm = copyMore[lang];
  const [step, setStep] = useState(0);
  const [wajib, setWajib] = useState(true);
  const [surplus, setSurplus] = useState("");
  const [silver, setSilver] = useState("");
  const [self, setSelf] = useState(true);
  const [minors, setMinors] = useState("");
  const [others, setOthers] = useState("");
  const [grain, setGrain] = useState<FitrGrain | "other">("wheat");
  const [wg, setWg] = useState("2047");
  const [price, setPrice] = useState("");

  const persons = (self ? 1 : 0) + (parseInt(minors || "0", 10) || 0) + (parseInt(others || "0", 10) || 0);
  const calcGrain: FitrGrain = grain === "other" ? "wheat" : grain;
  const res = calculateFitr({ persons, grain: calcGrain, wheatGrams: Number(wg), pricePerKg: parseAmount(price), surplusWealth: parseAmount(surplus), silverPricePerGram: parseAmount(silver) });
  const last = 4;
  const go = (n: number) => { setStep(n); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const reset = () => { setStep(0); setWajib(true); setSurplus(""); setSilver(""); setSelf(true); setMinors(""); setOthers(""); setGrain("wheat"); setWg("2047"); setPrice(""); };
  const names = T.steps[lang];

  return (
    <div className="space-y-4">
      <StepHeader icon={<HandCoins size={22} />} title={x("title")} step={step} names={names} ofText={tr(lang, COMMON.of)} />
      <section className="space-y-4 rounded-3xl border border-emerald-900/10 bg-white p-4 shadow-soft">
        {step === 0 && (<>
          <Note>{x("aim")}</Note>
          <YesNo q={x("q1")} on={wajib} set={setWajib} yes={x("yes")} no={x("no")} />
          {!wajib && <Note tone="warn">{x("noNote")}</Note>}
          <details className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-900/5">
            <summary className="cursor-pointer text-xs font-extrabold text-slate-600">{x("chk")}</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label={x("surplus")} value={surplus} setValue={(v) => setSurplus(sanitizeDecimal(v))} prefix="₹" />
              <Field label={x("silver")} value={silver} setValue={(v) => setSilver(sanitizeDecimal(v))} prefix="₹" />
            </div>
          </details>
        </>)}

        {step === 1 && (<>
          <YesNo q={x("selfQ")} on={self} set={setSelf} yes={x("yes")} no={x("no")} />
          <Field label={x("minors")} value={minors} setValue={(v) => setMinors(ints(v))} />
          <Field label={x("others")} value={others} setValue={(v) => setOthers(ints(v))} />
          <Note>{x("whoNote")}</Note>
          <p className="text-xs font-bold text-slate-500">{persons} {x("people")}</p>
        </>)}

        {step === 2 && (<>
          <Pills<FitrGrain | "other"> label={x("grain")} value={grain} onChange={setGrain}
            options={[{ id: "wheat", text: x("gWheat") }, { id: "barley", text: x("gBarley") }, { id: "dates", text: x("gDates") }, { id: "raisins", text: x("gRaisins") }, { id: "other", text: x("gOther") }]} />
          <Pills<string> label={x("wLabel")} value={wg} onChange={setWg}
            options={[{ id: String(FITR_RULES.weightOptions[1]), text: x("w2047") }, { id: String(FITR_RULES.weightOptions[0]), text: x("w1633") }]} />
          <Note>{x("wNote")}</Note>
          {grain === "other" && <Note tone="warn">{x("otherNote")}</Note>}
        </>)}

        {step === 3 && (<>
          <Field label={x("price")} value={price} setValue={(v) => setPrice(sanitizeDecimal(v))} prefix="₹" />
          {res.status === "ok" && <div className="grid grid-cols-2 gap-2"><Tile label={x("qty")} value={kg(res.gramsPerPerson / 1000)} /><Tile label={x("perP")} value={money(res.amountPerPerson)} /></div>}
        </>)}

        {step === 4 && (res.status !== "ok"
          ? <div role="alert" className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800"><p>{x("fill")}</p><button type="button" onClick={() => go(3)} className="rounded-xl bg-red-700 px-4 py-2 text-xs font-extrabold text-white">{tr(lang, COMMON.back)}</button></div>
          : <>
            <ResultBox t={cm} title={x("title")}
              lines={[`${x("qty")}: ${kg(res.gramsPerPerson / 1000)}`, `${x("perP")}: ${money(res.amountPerPerson)}`, `${x("tot")} (${persons} ${x("people")}): ${money(res.total)}`]}
              how={[
                { label: x("qty"), formula: `${wg} g × ${FITR_RULES.multiplier[calcGrain]} = ${res.gramsPerPerson} g` },
                { label: x("perP"), formula: `${res.gramsPerPerson / 1000} kg × ₹${parseAmount(price)} = ${money(res.amountPerPerson)}` },
                { label: x("tot"), formula: `${money(res.amountPerPerson)} × ${persons} = ${money(res.total)}` }
              ]}>
              <div className="mt-3 grid grid-cols-2 gap-2"><Tile label={x("qty")} value={kg(res.gramsPerPerson / 1000)} /><Tile label={x("perP")} value={money(res.amountPerPerson)} /></div>
              <div className="mt-2"><Tile strong label={`${x("tot")} (${persons} ${x("people")})`} value={money(res.total)} /></div>
              <div className="mt-3 space-y-2">
                {res.nisab === "reached" && <Note>{x("nisabOk")}</Note>}
                {res.nisab === "not_reached" && <Note tone="warn">{x("nisabNo")}</Note>}
                <Note>{x("timing")}</Note>
              </div>
              <SaveCase lang={lang} kind="other" title={x("title")} lines={[`${x("tot")}: ${money(res.total)}`]} />
            </ResultBox>
            <BookNotes kind="fitr" lang={lang} />
          </>)}

        <StepNav step={step} last={last} go={go} onReset={reset} next={tr(lang, COMMON.next)} back={tr(lang, COMMON.back)} again={tr(lang, COMMON.again)} />
      </section>
    </div>
  );
            }
        
