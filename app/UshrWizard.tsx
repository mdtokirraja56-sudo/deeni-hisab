"use client";

import { useState } from "react";
import { Sprout } from "lucide-react";
import type { Lang } from "../lib/heirs";
import { copyMore } from "../lib/copyMore";
import { calculateUshr, type Irrigation, type UshrUnit } from "../lib/ushr";
import { parseAmount, sanitizeDecimal } from "../lib/numbers";
import { Field, Note, ResultBox, Tile } from "./calcUi";
import { SaveCase } from "./AccountPanel";
import { BookNotes } from "./BookNotes";
import { COMMON, Pills, StepHeader, StepNav, tr, type L4 } from "./StepKit";

type Crop = "grain" | "fruit" | "veg" | "spice" | "honey" | "none";
type Land = "own" | "batai" | "rent" | "thika";

const T = {
  title: { roman: "Ushr (Fasal ki zakat)", en: "Ushr (zakat on crops)", ur: "عشر (فصل کی زکوٰۃ)", hi: "उश्र (फ़सल की ज़कात)" },
  steps: {
    roman: ["Kya paida hua", "Zameen kiski", "Paani", "Paidawar", "Natija"],
    en: ["What grew", "Whose land", "Water", "Produce", "Result"],
    ur: ["کیا پیدا ہوا", "زمین کس کی", "پانی", "پیداوار", "نتیجہ"],
    hi: ["क्या पैदा हुआ", "ज़मीन किसकी", "पानी", "पैदावार", "नतीजा"]
  } as Record<Lang, string[]>,
  aim: {
    roman: "Maqsad: zameen ki paidawar ki zakat. Ye Zakat se alag hai: ismein nisab aur saal guzarna shart nahi, har fasal par wajib hai.",
    en: "Purpose: zakat on the produce of the land. It is separate from Zakat: no nisab and no full year; it is due on every harvest.",
    ur: "مقصد: زمین کی پیداوار کی زکوٰۃ۔ یہ زکوٰۃ سے الگ ہے: اس میں نصاب اور سال گزرنا شرط نہیں، ہر فصل پر واجب ہے۔",
    hi: "मक़सद: ज़मीन की पैदावार की ज़कात। ये ज़कात से अलग है: इसमें निसाब और साल गुज़रना शर्त नहीं, हर फ़सल पर वाजिब है।"
  },
  cropQ: { roman: "Kya paida hua?", en: "What was produced?", ur: "کیا پیدا ہوا؟", hi: "क्या पैदा हुआ?" },
  grain: { roman: "Anaaj (gehun, chawal, makka...)", en: "Grain (wheat, rice, maize...)", ur: "اناج (گیہوں، چاول، مکئی...)", hi: "अनाज (गेहूँ, चावल, मक्का...)" },
  fruit: { roman: "Phal", en: "Fruit", ur: "پھل", hi: "फल" },
  veg: { roman: "Sabzi", en: "Vegetables", ur: "سبزی", hi: "सब्ज़ी" },
  spice: { roman: "Masale", en: "Spices", ur: "مسالے", hi: "मसाले" },
  honey: { roman: "Shahad", en: "Honey", ur: "شہد", hi: "शहद" },
  none: { roman: "Lakdi / ghaas / bans / darakht", en: "Wood / grass / bamboo / trees", ur: "لکڑی / گھاس / بانس / درخت", hi: "लकड़ी / घास / बाँस / दरख़्त" },
  noneNote: {
    roman: "In cheezon par ushr wajib nahi (kitab p.127-129). Sirf wo zameen jo ghaas ya lakdi ke liye hi chhodi ho, uska ushr hai: Aalim se poochh lein.",
    en: "Ushr is not due on these (book pp.127-129). Only land left purely for grass or wood is different: ask your scholar.",
    ur: "ان چیزوں پر عشر واجب نہیں (کتاب ص 127 تا 129)۔ صرف وہ زمین جو گھاس یا لکڑی ہی کے لیے چھوڑی ہو اس کا حکم الگ ہے: عالم سے پوچھ لیں۔",
    hi: "इन चीज़ों पर उश्र वाजिब नहीं (किताब स. 127 से 129)। सिर्फ़ वो ज़मीन जो घास या लकड़ी ही के लिए छोड़ी हो उसका हुक्म अलग है: आलिम से पूछ लें।"
  },
  landQ: { roman: "Zameen kis tarah ki hai?", en: "What kind of land is it?", ur: "زمین کس طرح کی ہے؟", hi: "ज़मीन किस तरह की है?" },
  own: { roman: "Meri apni", en: "My own", ur: "میری اپنی", hi: "मेरी अपनी" },
  batai: { roman: "Batai (hissa)", en: "Sharecropping (share)", ur: "بٹائی (حصہ)", hi: "बटाई (हिस्सा)" },
  rent: { roman: "Kiraye par li", en: "Rented", ur: "کرائے پر لی", hi: "किराये पर ली" },
  thika: { roman: "Thike par li", en: "Taken on contract", ur: "ٹھیکے پر لی", hi: "ठेके पर ली" },
  share: { roman: "Aapka hissa (%)", en: "Your share (%)", ur: "آپ کا حصہ (%)", hi: "आपका हिस्सा (%)" },
  landNote: {
    roman: "Batai me har ek apne hisse ka ushr dega. Kiraye ya thike par li zameen ka ushr lene wale par hai, maalik par nahi.",
    en: "In sharecropping each pays on his own share. On rented or contract land the one who farms it pays, not the owner.",
    ur: "بٹائی میں ہر ایک اپنے حصے کا عشر دے گا۔ کرائے یا ٹھیکے پر لی زمین کا عشر لینے والے پر ہے، مالک پر نہیں۔",
    hi: "बटाई में हर एक अपने हिस्से का उश्र देगा। किराये या ठेके पर ली ज़मीन का उश्र लेने वाले पर है, मालिक पर नहीं।"
  },
  waterQ: { roman: "Sinchai kis paani se hui?", en: "How was it watered?", ur: "سینچائی کس پانی سے ہوئی؟", hi: "सिंचाई किस पानी से हुई?" },
  rain: { roman: "Barish / nehar / nala (bina kharch) → 10%", en: "Rain / river / canal (free) → 10%", ur: "بارش / نہر / نالہ (بلا خرچ) → 10%", hi: "बारिश / नहर / नाला (बिना ख़र्च) → 10%" },
  paid: { roman: "Dol / tubewell / khareeda paani → 5%", en: "Bucket / tube-well / bought water → 5%", ur: "ڈول / ٹیوب ویل / خریدا ہوا پانی → 5%", hi: "डोल / ट्यूबवेल / ख़रीदा हुआ पानी → 5%" },
  mixed: { roman: "Dono tarah ka", en: "Both kinds", ur: "دونوں طرح کا", hi: "दोनों तरह का" },
  paidShare: { roman: "Kitni muddat kharch wale paani se sinchai hui (%)", en: "Share of the season watered with cost (%)", ur: "کتنی مدت خرچ والے پانی سے سینچائی ہوئی (%)", hi: "कितनी मुद्दत ख़र्च वाले पानी से सिंचाई हुई (%)" },
  equal: { roman: "Bilkul barabar (50%) ho to Aalim se poochhein.", en: "If exactly equal (50%), ask your scholar.", ur: "بالکل برابر (50%) ہو تو عالم سے پوچھیں۔", hi: "बिल्कुल बराबर (50%) हो तो आलिम से पूछें।" },
  qty: { roman: "Kul paidawar", en: "Total produce", ur: "کل پیداوار", hi: "कुल पैदावार" },
  unit: { roman: "Ikai", en: "Unit", ur: "اکائی", hi: "इकाई" },
  kg: { roman: "Kilo", en: "kg", ur: "کلو", hi: "किलो" },
  qtl: { roman: "Quintal", en: "Quintal", ur: "کوئنٹل", hi: "क्विंटल" },
  lost: { roman: "Aasmani aafat se tabah hui miqdar (agar koi)", en: "Amount destroyed by a calamity (if any)", ur: "آسمانی آفت سے تباہ شدہ مقدار (اگر کوئی)", hi: "आसमानी आफ़त से तबाह मिक़दार (अगर कोई)" },
  lostHint: { roman: "Sailaab, aag, pala wagairah. Janwar kha jayein to ghatana nahi hai.", en: "Flood, fire, frost etc. Do not enter what animals ate.", ur: "سیلاب، آگ، پالا وغیرہ۔ جانور کھا جائیں تو نہ گھٹائیں۔", hi: "सैलाब, आग, पाला वग़ैरह। जानवर खा जाएँ तो न घटाएँ।" },
  price: { roman: "Bhaav (₹ per kg, optional)", en: "Price (₹ per kg, optional)", ur: "بھاؤ (₹ فی کلو، اختیاری)", hi: "भाव (₹ प्रति किलो, वैकल्पिक)" },
  yours: { roman: "Aapki paidawar", en: "Your produce", ur: "آپ کی پیداوار", hi: "आपकी पैदावार" },
  rate: { roman: "Sharah", en: "Rate", ur: "شرح", hi: "शरह" },
  dueQty: { roman: "Ushr ki miqdar", en: "Ushr quantity", ur: "عشر کی مقدار", hi: "उश्र की मिक़दार" },
  dueVal: { roman: "Ushr ki qeemat", en: "Ushr value", ur: "عشر کی قیمت", hi: "उश्र की क़ीमत" },
  remain: { roman: "Baqi", en: "Remaining", ur: "باقی", hi: "बाक़ी" },
  fill: { roman: "Pehle paidawar likhein (aur batai ho to hissa).", en: "First enter the produce (and your share if sharecropping).", ur: "پہلے پیداوار لکھیں (اور بٹائی ہو تو حصہ)۔", hi: "पहले पैदावार लिखें (और बटाई हो तो हिस्सा)।" },
  when: {
    roman: "Fasal pakne par wajib. Kaatne ke baad hisab lagayein. Dene se pehle paidawar istemal na karein. Zakat ke mustahiqeen ko dein.",
    en: "Due when the crop ripens. Calculate after harvest. Do not use the produce before paying. Give to those entitled to zakat.",
    ur: "فصل پکنے پر واجب۔ کاٹنے کے بعد حساب لگائیں۔ دینے سے پہلے پیداوار استعمال نہ کریں۔ زکوٰۃ کے مستحقین کو دیں۔",
    hi: "फ़सल पकने पर वाजिब। काटने के बाद हिसाब लगाएँ। देने से पहले पैदावार इस्तेमाल न करें। ज़कात के मुस्तहिक़ीन को दें।"
  },
  nonisab: {
    roman: "Nisab nahi, aur beej, khaad, mazdoori ya sarkari lagaan nikale nahi jate.",
    en: "No nisab, and seed, fertiliser, labour or land revenue are not deducted.",
    ur: "نصاب نہیں، اور بیج، کھاد، مزدوری یا سرکاری لگان نکالے نہیں جاتے۔",
    hi: "निसाब नहीं, और बीज, खाद, मज़दूरी या सरकारी लगान निकाले नहीं जाते।"
  },
  r10: { roman: "10% (daswan)", en: "10% (one tenth)", ur: "10% (دسواں)", hi: "10% (दसवाँ)" },
  r5: { roman: "5% (beeswan)", en: "5% (one twentieth)", ur: "5% (بیسواں)", hi: "5% (बीसवाँ)" }
} satisfies Record<string, L4 | Record<Lang, string[]>>;

const kgf = (n: number) => `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 }).format(n)} kg`;

export function UshrWizard({ lang, money }: { lang: Lang; money: (n: number) => string }) {
  const x = <K extends keyof typeof T>(k: K): string => tr(lang, T[k] as L4);
  const cm = copyMore[lang];
  const [step, setStep] = useState(0);
  const [crop, setCrop] = useState<Crop>("grain");
  const [land, setLand] = useState<Land>("own");
  const [share, setShare] = useState("50");
  const [irr, setIrr] = useState<Irrigation>("rain");
  const [paidShare, setPaidShare] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState<UshrUnit>("kg");
  const [lost, setLost] = useState("");
  const [price, setPrice] = useState("");

  const pct = land === "batai" ? parseAmount(share) : 100;
  const net = Math.max(0, (parseAmount(qty) - parseAmount(lost)) * (pct / 100));
  const res = calculateUshr({ quantity: net, unit, pricePerKg: parseAmount(price), irrigation: irr, paidSharePercent: parseAmount(paidShare) });
  const last = 4;
  const noUshr = crop === "none";
  const go = (n: number) => { setStep(n); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const reset = () => { setStep(0); setCrop("grain"); setLand("own"); setShare("50"); setIrr("rain"); setPaidShare(""); setQty(""); setUnit("kg"); setLost(""); setPrice(""); };
  const names = T.steps[lang];
  const u = unit === "kg" ? "kg" : "qtl";

  return (
    <div className="space-y-4">
      <StepHeader icon={<Sprout size={22} />} title={x("title")} step={step} names={names} ofText={tr(lang, COMMON.of)} />
      <section className="space-y-4 rounded-3xl border border-emerald-900/10 bg-white p-4 shadow-soft">
        {step === 0 && (<>
          <Note>{x("aim")}</Note>
          <Pills<Crop> label={x("cropQ")} value={crop} onChange={setCrop}
            options={[{ id: "grain", text: x("grain") }, { id: "fruit", text: x("fruit") }, { id: "veg", text: x("veg") }, { id: "spice", text: x("spice") }, { id: "honey", text: x("honey") }, { id: "none", text: x("none") }]} />
          {noUshr && <Note tone="warn">{x("noneNote")}</Note>}
        </>)}

        {step === 1 && (<>
          <Pills<Land> label={x("landQ")} value={land} onChange={setLand}
            options={[{ id: "own", text: x("own") }, { id: "batai", text: x("batai") }, { id: "rent", text: x("rent") }, { id: "thika", text: x("thika") }]} />
          {land === "batai" && <Field label={x("share")} value={share} setValue={(v) => setShare(sanitizeDecimal(v))} suffix="%" />}
          <Note>{x("landNote")}</Note>
        </>)}

        {step === 2 && (<>
          <Pills<Irrigation> label={x("waterQ")} value={irr} onChange={setIrr}
            options={[{ id: "rain", text: x("rain") }, { id: "paid", text: x("paid") }, { id: "mixed", text: x("mixed") }]} />
          {irr === "mixed" && (<><Field label={x("paidShare")} value={paidShare} setValue={(v) => setPaidShare(sanitizeDecimal(v))} suffix="%" /><Note>{x("equal")}</Note></>)}
        </>)}

        {step === 3 && (<>
          <Field label={x("qty")} value={qty} setValue={(v) => setQty(sanitizeDecimal(v))} suffix={u} />
          <Pills<UshrUnit> label={x("unit")} value={unit} onChange={setUnit} options={[{ id: "kg", text: x("kg") }, { id: "quintal", text: x("qtl") }]} />
          <Field label={x("lost")} value={lost} setValue={(v) => setLost(sanitizeDecimal(v))} suffix={u} hint={x("lostHint")} />
          <Field label={x("price")} value={price} setValue={(v) => setPrice(sanitizeDecimal(v))} prefix="₹" />
        </>)}

        {step === 4 && (noUshr
          ? <Note tone="warn">{x("noneNote")}</Note>
          : res.status === "invalid"
            ? <div role="alert" className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800"><p>{x("fill")}</p><button type="button" onClick={() => go(3)} className="rounded-xl bg-red-700 px-4 py-2 text-xs font-extrabold text-white">{tr(lang, COMMON.back)}</button></div>
            : res.status === "needs_ruling"
              ? <Note tone="warn">{x("equal")}</Note>
              : <>
                <ResultBox t={cm} title={x("title")}
                  lines={[`${x("yours")}: ${kgf(res.produceKg)}`, `${x("rate")}: ${res.rate === 0.1 ? "10%" : "5%"}`, `${x("dueQty")}: ${kgf(res.ushrKg)}`, ...(res.hasPrice ? [`${x("dueVal")}: ${money(res.ushrValue)}`] : [])]}
                  how={[
                    { label: x("yours"), formula: `(${parseAmount(qty)} − ${parseAmount(lost)}) ${u} × ${pct}% = ${kgf(res.produceKg)}` },
                    { label: x("dueQty"), formula: `${kgf(res.produceKg)} × ${res.rate === 0.1 ? "1/10" : "1/20"} = ${kgf(res.ushrKg)}` },
                    ...(res.hasPrice ? [{ label: x("dueVal"), formula: `${kgf(res.ushrKg)} × ₹${parseAmount(price)} = ${money(res.ushrValue)}` }] : [])
                  ]}>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Tile label={x("yours")} value={kgf(res.produceKg)} />
                    <Tile label={x("rate")} value={res.rate === 0.1 ? x("r10") : x("r5")} />
                    <Tile strong label={x("dueQty")} value={kgf(res.ushrKg)} />
                    {res.hasPrice ? <Tile strong label={x("dueVal")} value={money(res.ushrValue)} /> : <Tile label={x("remain")} value={kgf(res.remainingKg)} />}
                  </div>
                  <div className="mt-3 space-y-2"><Note>{x("nonisab")}</Note><Note>{x("when")}</Note></div>
                  <SaveCase lang={lang} kind="other" title={x("title")} lines={[`${x("dueQty")}: ${kgf(res.ushrKg)}`]} />
                </ResultBox>
                <BookNotes kind="ushr" lang={lang} />
              </>)}

        <StepNav step={step} last={last} go={go} onReset={reset} next={tr(lang, COMMON.next)} back={tr(lang, COMMON.back)} again={tr(lang, COMMON.again)} />
      </section>
    </div>
  );
    }
          
