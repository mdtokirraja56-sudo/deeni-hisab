"use client";

import type { Lang } from "../lib/heirs";
import { fracText, fracValue } from "../lib/mirath";
import type { BothQauls } from "../lib/ikhtilaf";
import type { MirathResult } from "../lib/mirath";

const TXT: Record<Lang, { title: string; sub: string; j: string; m: string; def: string; chosen: string; pick: string; asl: string; awl: string; total: string; same: string; father: string; src: string; none: string; rows: string }> = {
  ur: { title: "ابنِ کافر: دو اقوال کا حساب", sub: "باب العول میں یہی ایک اختلاف ہے۔ دونوں کا حساب الگ الگ ہے؛ جو قول چنیں گے وہی اوپر کی رپورٹ میں آئے گا۔", j: "طریقۂ جمہور (فتویٰ)", m: "قولِ حضرت عبداللہ بن مسعود رضی اللہ عنہ", def: "ڈیفالٹ", chosen: "منتخب", pick: "اس قول پر رپورٹ بنائیں", asl: "اصل مسئلہ", awl: "عول", total: "کل سہام", same: "اس صورت میں دونوں اقوال کا نتیجہ ایک ہی ہے۔", father: "والد یا دادا کی موجودگی میں ابنِ مسعود کے قول کی تفصیل کتاب میں نہیں ملی، اس لیے ان کا حساب نہیں دکھایا۔ عالم سے رجوع کریں۔", src: "حوالہ: السراجیہ مع برکات السراج، باب العول، ص ۵۱ (متن) اور ص ۵۳ (حاشیہ ۱۷)۔ فتویٰ جمہور کے قول پر ہے۔", none: "—", rows: "ورثاء" },
  roman: { title: "Ibn-e-Kafir: do aqwaal ka hisaab", sub: "Bab al-Awl mein yahi ek ikhtilaf hai. Dono ka hisaab alag alag hai; jo qaul chunenge wahi upar ki report mein aayega.", j: "Tareeqa-e-Jumhoor (fatwa)", m: "Qaul Hazrat Abdullah bin Mas'ud (RA)", def: "Default", chosen: "Muntakhab", pick: "Is qaul par report banayein", asl: "Asl masla", awl: "Awl", total: "Kul siham", same: "Is surat mein dono aqwaal ka natija ek hi hai.", father: "Waalid ya dada ki maujoodgi mein Ibn Mas'ud ke qaul ki tafseel kitab mein nahi mili, isliye unka hisaab nahi dikhaya. Aalim se rujoo karein.", src: "Hawala: As-Sirajiya ma'a Barakat as-Siraj, Bab al-Awl, p. 51 (matn) aur p. 53 (hashiya 17). Fatwa jumhoor ke qaul par hai.", none: "—", rows: "Waris" },
  hi: { title: "इब्न-ए-काफ़िर: दो क़ौल का हिसाब", sub: "बाबुल-अवल में यही एक इख़्तिलाफ़ है। दोनों का हिसाब अलग-अलग है; जो क़ौल चुनेंगे वही ऊपर की रिपोर्ट में आएगा।", j: "तरीक़ा-ए-जमहूर (फ़तवा)", m: "क़ौल हज़रत अब्दुल्लाह बिन मसऊद (र.अ.)", def: "डिफ़ॉल्ट", chosen: "चुना हुआ", pick: "इस क़ौल पर रिपोर्ट बनाएँ", asl: "असल मसअला", awl: "अवल", total: "कुल सिहाम", same: "इस सूरत में दोनों क़ौल का नतीजा एक ही है।", father: "वालिद या दादा की मौजूदगी में इब्न मसऊद के क़ौल की तफ़सील किताब में नहीं मिली, इसलिए उनका हिसाब नहीं दिखाया। आलिम से रुजू करें।", src: "हवाला: अस-सिराजिया मअ बरकातिस-सिराज, बाबुल-अवल, पृ. 51 (मत्न) और पृ. 53 (हाशिया 17)। फ़तवा जमहूर के क़ौल पर है।", none: "—", rows: "वारिस" },
  en: { title: "Non-Muslim son: both opinions calculated", sub: "This is the one disagreement in Bab al-Awl. Each opinion is calculated separately; the one you pick goes into the report above.", j: "Majority view (the fatwa)", m: "Opinion of Abdullah ibn Mas'ud (RA)", def: "Default", chosen: "Selected", pick: "Use this opinion for the report", asl: "Base (asl)", awl: "Awl", total: "Total parts", same: "In this case both opinions give the same result.", father: "With a father or grandfather present, the book gives no details of Ibn Mas'ud's calculation, so it is not shown. Please ask a scholar.", src: "Source: As-Sirajiya with Barakat as-Siraj, Bab al-Awl, p. 51 (text) and p. 53 (footnote 17). The fatwa follows the majority.", none: "—", rows: "Heir" }
};

function Col({ r, title, badge, picked, onPick, lang, heirLabel }: { r: MirathResult; title: string; badge: string; picked: boolean; onPick: () => void; lang: Lang; heirLabel: (k: any) => string }) {
  const t = TXT[lang];
  const rows = r.rows.filter((x) => x.status === "inherits");
  return <div className={`min-w-0 rounded-2xl border p-3 ${picked ? "border-deen bg-emerald-50 ring-1 ring-deen/30" : "border-slate-200 bg-white"}`}>
    <div className="text-xs font-extrabold leading-5 text-slate-800">{title}</div>
    <div className="mt-0.5 text-[10px] font-bold text-deen">{badge}</div>
    <dl className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px] text-slate-500">
      <div className="rounded-lg bg-slate-50 p-1"><dt>{t.asl}</dt><dd className="text-sm font-extrabold tabular-nums text-slate-800">{r.asl}</dd></div>
      <div className="rounded-lg bg-slate-50 p-1"><dt>{t.awl}</dt><dd className="text-sm font-extrabold tabular-nums text-slate-800">{r.awl ?? t.none}</dd></div>
      <div className="rounded-lg bg-slate-50 p-1"><dt>{t.total}</dt><dd className="text-sm font-extrabold tabular-nums text-slate-800">{r.tashih}</dd></div>
    </dl>
    <ul className="mt-2 divide-y divide-slate-100">
      {rows.map((x) => <li key={x.key} className="py-1.5">
        <div className="text-[11px] font-bold text-slate-700">{heirLabel(x.key)}{x.count > 1 ? ` ×${x.count}` : ""}</div>
        <div className="flex items-baseline justify-between gap-2 text-[11px] tabular-nums text-slate-600" dir="ltr"><span>{fracText(x.share)} · {x.parts}/{r.tashih}</span><span className="font-bold text-deen">{(Math.round(fracValue(x.share) * 10000) / 100).toString()}%</span></div>
      </li>)}
    </ul>
    <button type="button" onClick={onPick} aria-pressed={picked} className={`mt-2 w-full rounded-xl px-3 py-2 text-xs font-extrabold ${picked ? "bg-deen text-white" : "border border-deen/30 bg-white text-deen"}`}>{picked ? t.chosen : t.pick}</button>
  </div>;
}

export function MirathIkhtilaf({ lang, both, masudPicked, pick, heirLabel }: { lang: Lang; both: BothQauls; masudPicked: boolean; pick: (masud: boolean) => void; heirLabel: (k: any) => string }) {
  const t = TXT[lang];
  return <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3 print:hidden" dir={lang === "ur" ? "rtl" : "ltr"}>
    <h3 className="text-sm font-extrabold text-amber-900">{t.title}</h3>
    <p className="mt-1 text-[11px] leading-5 text-amber-900/80">{t.sub}</p>
    {both.masud ? <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <Col r={both.jumhoor} title={t.j} badge={t.def} picked={!masudPicked} onPick={() => pick(false)} lang={lang} heirLabel={heirLabel} />
      <Col r={both.masud} title={t.m} badge="" picked={masudPicked} onPick={() => pick(true)} lang={lang} heirLabel={heirLabel} />
    </div> : <p className="mt-2 rounded-xl bg-white p-2 text-[11px] font-bold leading-5 text-red-700">{t.father}</p>}
    {both.masud && both.same && <p className="mt-2 text-[11px] font-bold text-deen">{t.same}</p>}
    <p className="mt-2 text-[10px] leading-4 text-amber-900/70">{t.src}</p>
  </section>;
}
