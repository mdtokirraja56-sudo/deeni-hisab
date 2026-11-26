"use client";

import { masudAllowed } from "../lib/ikhtilaf";
import { useState, useRef, useMemo, useEffect } from "react";
import { Lang, HEIR_GROUPS, initialHeirs, HeirKey, HEIR_DEFS, HeirDef } from "../lib/heirs";
import { NisabBasis, ZAKAT_RULES, ZakatResult, ZakatInput, calculateZakat } from "../lib/zakat";
import { MirathResult, Counts, wouldBeBlocked, calculateMirath, MAX_COUNT, BlockCode } from "../lib/mirath";
import { parseAmount, sanitizeDecimal } from "../lib/numbers";
import { copy } from "../lib/copy";
import { copy2 } from "../lib/copy2";
import { Facebook, Youtube, MessageCircle, Instagram } from "lucide-react";

export type ZakatField = "cash" | "goldGrams" | "silverGrams" | "goldPricePerGram" | "silverPricePerGram" | "businessStock" | "receivables" | "otherZakatable" | "debtsDueNow";

export const initialZakat: Record<ZakatField, string> = {
  cash: "", goldGrams: "", silverGrams: "", goldPricePerGram: "", silverPricePerGram: "",
  businessStock: "", receivables: "", otherZakatable: "", debtsDueNow: ""
};

export const heirLimit = (key: string): number => MAX_COUNT[key] ?? 99;

export type BlockInfo = { by: HeirKey[]; code: BlockCode } | null;

export const LANGS: { id: Lang; label: string }[] = [
  { id: "ur", label: "اردو" },
  { id: "hi", label: "हिन्दी" },
  { id: "roman", label: "Roman" },
  { id: "en", label: "English" }
];

export const HTML_LANG: Record<Lang, string> = { ur: "ur", hi: "hi", roman: "ur-Latn", en: "en" };

export const SOCIAL_LINKS: { label: string; url: string; Icon: typeof Facebook }[] = [
  { label: "Facebook", url: "", Icon: Facebook },
  { label: "YouTube", url: "", Icon: Youtube },
  { label: "WhatsApp", url: "", Icon: MessageCircle },
  { label: "Instagram", url: "", Icon: Instagram }
];

export const COPYRIGHT: Record<Lang, string> = {
  en: "© 2026 DEENI HISAB · Tauqeer Raza Ashrafi · All rights reserved. Do not copy or reuse without permission.",
  roman: "© 2026 DEENI HISAB · Tauqeer Raza Ashrafi · Tamam huqooq mehfooz. Ijazat ke baghair copy ya dobara istemal na karein.",
  ur: "© 2026 دینی حساب · توقیر رضا اشرفی · جملہ حقوق محفوظ۔ اجازت کے بغیر نقل یا دوبارہ استعمال نہ کریں۔",
  hi: "© 2026 दीनी हिसाब · तौक़ीर रज़ा अशरफ़ी · सर्वाधिकार सुरक्षित। अनुमति के बिना नक़ल या दोबारा इस्तेमाल न करें।"
};

export const isLang = (v: string | null): v is Lang => v === "ur" || v === "hi" || v === "roman" || v === "en";

export type LandSys = "bigha" | "biswa" | "kanal";

export const LAND_SYS: Record<LandSys, { major: Record<Lang, string>; minor: Record<Lang, string> }> = {
  bigha: { major: { en: "Bigha", roman: "Bigha", ur: "بیگھہ", hi: "बीघा" }, minor: { en: "Kattha", roman: "Kattha", ur: "کٹھہ", hi: "कट्ठा" } },
  biswa: { major: { en: "Bigha", roman: "Bigha", ur: "بیگھہ", hi: "बीघा" }, minor: { en: "Biswa", roman: "Biswa", ur: "بسوہ", hi: "बिस्वा" } },
  kanal: { major: { en: "Kanal", roman: "Kanal", ur: "کنال", hi: "कनाल" }, minor: { en: "Marla", roman: "Marla", ur: "مرلہ", hi: "मरला" } }
};

export const RT: Record<Lang, { title: string; back: string; landTitle: string; landOpt: string; landSys: string; landRatio: string; landRegion: string; landShare: string; landTotal: string }> = {
  en: { title: "Distribution of the estate", back: "Back to edit", landTitle: "Total land", landOpt: "optional", landSys: "Land measure", landRatio: "How many in one", landRegion: "Bigha size differs by region; only this ratio is used. Leave empty if there is no land.", landShare: "Share of the land", landTotal: "Total land" },
  roman: { title: "Taqseem-e-Tarka", back: "Wapas jaakar badlein", landTitle: "Kul zameen", landOpt: "zaroori nahi", landSys: "Zameen ka naap", landRatio: "Ek mein kitne", landRegion: "Bigha ka size ilaake ke hisab se alag hota hai; yahan sirf ye ratio use hota hai. Zameen na ho to khaali chhodein.", landShare: "Zameen mein har waris ka hissa", landTotal: "Kul zameen" },
  ur: { title: "تقسیمِ ترکہ", back: "واپس جا کر تبدیل کریں", landTitle: "کل زمین", landOpt: "اختیاری", landSys: "زمین کا پیمانہ", landRatio: "ایک میں کتنے", landRegion: "بیگھہ کا سائز علاقے کے لحاظ سے مختلف ہوتا ہے؛ یہاں صرف یہی نسبت استعمال ہوتی ہے۔ زمین نہ ہو تو خالی چھوڑ دیں۔", landShare: "زمین میں ہر وارث کا حصہ", landTotal: "کل زمین" },
  hi: { title: "तक़सीम-ए-तरका", back: "वापस जाकर बदलें", landTitle: "कुल ज़मीन", landOpt: "ज़रूरी नहीं", landSys: "ज़मीन का नाप", landRatio: "एक में कितने", landRegion: "बीघे का साइज़ इलाके के हिसाब से अलग होता है; यहाँ सिर्फ़ यही अनुपात इस्तेमाल होता है। ज़मीन न हो तो खाली छोड़ें।", landShare: "ज़मीन में हर वारिस का हिस्सा", landTotal: "कुल ज़मीन" }
};

export function useHome() {
  const [lang, setLang] = useState<Lang>("ur");
    const [tab, setTab] = useState<"mirath" | "zakat" | "more">("mirath");
    const [estate, setEstate] = useState("0");
    const [gold, setGold] = useState("0");
    const [silver, setSilver] = useState("0");
    const [funeral, setFuneral] = useState("");
    const [debtsEst, setDebtsEst] = useState("");
    const [bequest, setBequest] = useState("");
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => Object.fromEntries(HEIR_GROUPS.map(g => [g.id, g.defaultOpen])));
    const [gender, setGender] = useState<"male" | "female">("male");
    const [heirs, setHeirs] = useState(initialHeirs);
    const [ibnMasud, setIbnMasud] = useState(false); // Ibn Mas'ud option for a non-Muslim son (default: fatwa, ka-an lam yakun)
    const [showDeductions, setShowDeductions] = useState(false);
    const [zk, setZk] = useState(initialZakat);
    const [nisabBasis, setNisabBasis] = useState<NisabBasis>(ZAKAT_RULES.defaultNisabBasis);
    const [hawl, setHawl] = useState(false);
    const [zakatResult, setZakatResult] = useState<ZakatResult | null>(null);
    const [mirathResult, setMirathResult] = useState<MirathResult | null>(null);
    const [alertMsg, setAlertMsg] = useState("");
    const [demoOpen, setDemoOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [landSys, setLandSys] = useState<LandSys>("bigha");
    const [landMajor, setLandMajor] = useState("");
    const [landMinor, setLandMinor] = useState("");
    const [landRatio, setLandRatio] = useState("20");
    const ratioNum = parseAmount(landRatio) > 0 ? parseAmount(landRatio) : 20;
    const landTotal = parseAmount(landMajor) * ratioNum + parseAmount(landMinor); // in the small unit
    const landText = (x: number) => {
      const r = Math.round(x * 100) / 100;
      const major = Math.floor(r / ratioNum + 1e-9);
      const minor = Math.round((r - major * ratioNum) * 100) / 100;
      const L = LAND_SYS[landSys];
      return `${major.toLocaleString("en-IN")} ${L.major[lang]} + ${minor.toLocaleString("en-IN")} ${L.minor[lang]}`;
    };
    const mirathRef = useRef<HTMLDivElement>(null);
    const zakatRef = useRef<HTMLDivElement>(null);
    const t = copy[lang];
    const t2 = copy2[lang];
    const heirLabel = (key: HeirKey): string => HEIR_DEFS.find(d => d.key === key)?.label[lang] ?? key;
    // Live "mahjub" status for every heir, from the same engine that makes the result.
    const blockInfo = useMemo(() => {
      const counts = heirs as Counts;
      const out: Partial<Record<HeirKey, BlockInfo>> = {};
      for (const d of HEIR_DEFS) out[d.key as HeirKey] = wouldBeBlocked(gender, counts, d.key as HeirKey);
      return out;
    }, [gender, heirs]);
    const money = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
    const heirTotal = useMemo(() => Object.values(heirs).reduce((a, b) => a + b, 0), [heirs]);
  
    // Remember the chosen language and keep <html lang> correct.
    useEffect(() => {
      try {
        const saved = localStorage.getItem("deeni-hisab-lang");
        if (isLang(saved)) setLang(saved);
      } catch { /* storage may be blocked; ignore */ }
    }, []);
    useEffect(() => {
      document.documentElement.lang = HTML_LANG[lang];
      try { localStorage.setItem("deeni-hisab-lang", lang); } catch { /* ignore */ }
    }, [lang]);
  
    // As soon as a result is made, bring it into view (the page header is sticky, so the target has a top margin).
    useEffect(() => {
      if (!mirathResult) return;
      // go straight to the result sheet (not the top of the page)
      const id = window.setTimeout(() => { try { mirathRef.current?.scrollIntoView({ behavior: "auto", block: "start" }); } catch { /* ignore */ } }, 60);
      return () => window.clearTimeout(id);
    }, [mirathResult]);
    useEffect(() => {
      if (zakatResult) zakatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [zakatResult]);
  
    useEffect(() => {
      if (!alertMsg) return;
      const id = setTimeout(() => setAlertMsg(""), 4500);
      return () => clearTimeout(id);
    }, [alertMsg]);
  
    const updateHeir = (key: HeirKey, delta: number) => {
      const limit = heirLimit(key);
      if (delta > 0 && heirs[key] >= limit) {
        setAlertMsg(key === "wives" ? t2.alertWives : `${heirLabel(key)}: ${t2.alertSingle}`);
        return;
      }
      setHeirs(prev => ({ ...prev, [key]: Math.max(0, Math.min(limit, prev[key] + delta)) }));
      setMirathResult(null);
    };
    const chooseGender = (g: "male" | "female") => {
      setGender(g);
      // Remove heirs that cannot exist for this deceased gender.
      setHeirs(prev => {
        const next = { ...prev };
        for (const d of HEIR_DEFS) if (d.onlyFor && d.onlyFor !== g) next[d.key as HeirKey] = 0;
        return next;
      });
      setMirathResult(null);
    };
    const heirDisabled = (def: HeirDef) => def.onlyFor !== undefined && def.onlyFor !== gender;
    const reviewCase = () => setMirathResult(calculateMirath(gender, heirs as Counts, { motherWithGrandfather: "whole", mahroomHajb: ibnMasud && masudAllowed(heirs as any) }));
    const pickQaul = (masud: boolean) => { setIbnMasud(masud); setMirathResult(calculateMirath(gender, heirs as Counts, { motherWithGrandfather: "whole", mahroomHajb: masud && masudAllowed(heirs as any) })); };
    // "New masla": clear everything entered (heirs, estate, gold/silver, deductions, land) and go back to the top of the form.
    const resetMirath = () => {
      setHeirs(initialHeirs); setIbnMasud(false); setMirathResult(null); setAlertMsg("");
      setEstate("0"); setGold("0"); setSilver("0"); setFuneral(""); setDebtsEst(""); setBequest(""); setShowDeductions(false);
      setLandMajor(""); setLandMinor("");
      setOpenGroups(Object.fromEntries(HEIR_GROUPS.map(g => [g.id, g.defaultOpen])));
      setTimeout(() => { try { window.scrollTo({ top: 0, behavior: "auto" }); } catch { /* ignore */ } }, 60);
    };
  
    const printReport = () => window.print();
  
    const setZ = (field: ZakatField, v: string) => { setZk(prev => ({ ...prev, [field]: sanitizeDecimal(v) })); setZakatResult(null); };
    const runZakat = () => {
      const input: ZakatInput = {
        goldPricePerGram: parseAmount(zk.goldPricePerGram), silverPricePerGram: parseAmount(zk.silverPricePerGram),
        cash: parseAmount(zk.cash), goldGrams: parseAmount(zk.goldGrams), silverGrams: parseAmount(zk.silverGrams),
        businessStock: parseAmount(zk.businessStock), receivables: parseAmount(zk.receivables),
        otherZakatable: parseAmount(zk.otherZakatable), debtsDueNow: parseAmount(zk.debtsDueNow),
        nisabBasis, hawlComplete: hawl
      };
      setZakatResult(calculateZakat(input));
    };
    const zError = (field: ZakatField): string | undefined => {
      const e = zakatResult?.errors.find(x => x.field === field);
      if (!e) return undefined;
      return e.code === "price_required" ? t.errPrice : e.code === "negative" ? t.errNegative : t.errNumber;
    };
    const assetLabel: Record<string, string> = {
      cash: t.zCash, gold: t.zGoldVal, silver: t.zSilverVal, businessStock: t.zStock, receivables: t.zReceivables, otherZakatable: t.zOther
    };
    const statusText: Record<string, string> = {
      invalid: t.statusInvalid, below_nisab: t.statusBelow, hawl_incomplete: t.statusHawl, due: t.statusDue
    };
    const noteText: Record<string, string> = { scholar_review_required: t.scholarNote, debts_exceed_assets: t.debtsExceed };
  
    const estateNum = parseAmount(estate);
    const costsNum = parseAmount(funeral) + parseAmount(debtsEst);
    const netEstate = Math.max(0, estateNum - costsNum);
    const bequestCap = netEstate / 3;
    const bequestCounted = Math.min(parseAmount(bequest), bequestCap);
    const remainingForHeirs = netEstate - bequestCounted;
    const socials = SOCIAL_LINKS.filter(s => s.url);

  return { pickQaul, ibnMasud, setIbnMasud, lang, setLang, tab, setTab, estate, setEstate, gold, setGold, silver, setSilver, funeral, setFuneral, debtsEst, setDebtsEst, bequest, setBequest, openGroups, setOpenGroups, gender, setGender, heirs, setHeirs, showDeductions, setShowDeductions, zk, setZk, nisabBasis, setNisabBasis, hawl, setHawl, zakatResult, setZakatResult, mirathResult, setMirathResult, alertMsg, setAlertMsg, demoOpen, setDemoOpen, aboutOpen, setAboutOpen, landSys, setLandSys, landMajor, setLandMajor, landMinor, setLandMinor, landRatio, setLandRatio, ratioNum, landTotal, landText, mirathRef, zakatRef, t, t2, heirLabel, blockInfo, money, heirTotal, updateHeir, chooseGender, heirDisabled, reviewCase, resetMirath, printReport, setZ, runZakat, zError, assetLabel, statusText, noteText, estateNum, costsNum, netEstate, bequestCap, bequestCounted, remainingForHeirs, socials };
}

export type HomeCtx = ReturnType<typeof useHome>;
