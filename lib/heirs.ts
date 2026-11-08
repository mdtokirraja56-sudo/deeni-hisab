// lib/heirs.ts
// The complete list of heirs shown in the Mirath form (data entry only).
// NOTE: This file only describes WHO can be entered. It contains NO share rules.
// Share rules (who inherits, who is excluded, fixed shares, residuary) will be
// added only after a qualified Hanafi scholar verifies them.

export type Lang = "ur" | "hi" | "roman" | "en";
type Text = Record<Lang, string>;

export type HeirGroupId = "spouses" | "descendants" | "ascendants" | "siblings" | "otherAsabat" | "distant";

export interface HeirDef {
  key: string;
  group: HeirGroupId;
  // Highest count the form allows. Only facts that are certain are limited:
  // one husband, up to four wives, one father, one mother. Everything else is open (99).
  max: number;
  // Heir can exist only for this gender of the deceased.
  onlyFor?: "male" | "female";
  label: Text;
}

export const HEIR_GROUPS: { id: HeirGroupId; defaultOpen: boolean; title: Text }[] = [
  { id: "spouses", defaultOpen: true, title: { en: "Spouses", roman: "Shohar aur Biwi", ur: "زوجین", hi: "पति-पत्नी" } },
  { id: "descendants", defaultOpen: true, title: { en: "Children & descendants", roman: "Aulaad aur aulaad ki aulaad", ur: "اولاد اور اولادِ اولاد", hi: "संतान और उनकी संतान" } },
  { id: "ascendants", defaultOpen: true, title: { en: "Parents & ancestors", roman: "Walidain aur unse oopar", ur: "والدین اور اصول (اوپر والے)", hi: "माता-पिता और पूर्वज" } },
  { id: "siblings", defaultOpen: true, title: { en: "Brothers & sisters", roman: "Bhai-behen", ur: "بھائی بہن", hi: "भाई-बहन" } },
  { id: "otherAsabat", defaultOpen: false, title: { en: "Other male relatives (father's side)", roman: "Deegar asabaat", ur: "دیگر عصبات", hi: "अन्य अस़बात (पितृ पक्ष के पुरुष)" } },
  { id: "distant", defaultOpen: false, title: { en: "Distant relatives (Dhawil-arham)", roman: "Door ke rishtedaar (Zawil-arham)", ur: "ذوی الارحام", hi: "ज़विल-अरहाम (दूर के रिश्तेदार)" } }
];

export const HEIRS = [
  // ---- Spouses ----
  { key: "husband", group: "spouses", max: 1, onlyFor: "female", label: { en: "Husband", roman: "Shohar", ur: "شوہر", hi: "पति" } },
  { key: "wives", group: "spouses", max: 4, onlyFor: "male", label: { en: "Wives", roman: "Biwiyaan", ur: "بیویاں", hi: "पत्नियाँ" } },

  // ---- Descendants ----
  { key: "son", group: "descendants", max: 99, label: { en: "Son", roman: "Beta", ur: "بیٹا", hi: "बेटा" } },
  { key: "daughter", group: "descendants", max: 99, label: { en: "Daughter", roman: "Beti", ur: "بیٹی", hi: "बेटी" } },
  { key: "sonsSon", group: "descendants", max: 99, label: { en: "Son's son (grandson)", roman: "Pota (bete ka beta)", ur: "پوتا (بیٹے کا بیٹا)", hi: "पोता (बेटे का बेटा)" } },
  { key: "sonsDaughter", group: "descendants", max: 99, label: { en: "Son's daughter (granddaughter)", roman: "Poti (bete ki beti)", ur: "پوتی (بیٹے کی بیٹی)", hi: "पोती (बेटे की बेटी)" } },
  { key: "sonsSonsSon", group: "descendants", max: 99, label: { en: "Grandson's son", roman: "Par-pota (pote ka beta)", ur: "پڑپوتا (پوتے کا بیٹا)", hi: "पड़पोता (पोते का बेटा)" } },
  { key: "sonsSonsDaughter", group: "descendants", max: 99, label: { en: "Grandson's daughter", roman: "Par-poti (pote ki beti)", ur: "پڑپوتی (پوتے کی بیٹی)", hi: "पड़पोती (पोते की बेटी)" } },

  // ---- Ascendants ----
  { key: "father", group: "ascendants", max: 1, label: { en: "Father", roman: "Walid", ur: "والد", hi: "पिता" } },
  { key: "mother", group: "ascendants", max: 1, label: { en: "Mother", roman: "Walida", ur: "والدہ", hi: "माता" } },
  { key: "paternalGrandfather", group: "ascendants", max: 99, label: { en: "Paternal grandfather (father's father)", roman: "Dada (walid ke walid)", ur: "دادا (والد کا والد)", hi: "दादा (पिता के पिता)" } },
  { key: "paternalGreatGrandfather", group: "ascendants", max: 99, label: { en: "Great-grandfather (grandfather's father)", roman: "Par-dada (dada ke walid)", ur: "پردادا (دادا کا والد)", hi: "परदादा (दादा के पिता)" } },
  { key: "paternalGrandmother", group: "ascendants", max: 99, label: { en: "Paternal grandmother (father's mother)", roman: "Dadi (walid ki walida)", ur: "دادی (والد کی والدہ)", hi: "दादी (पिता की माता)" } },
  { key: "paternalGreatGrandmother", group: "ascendants", max: 99, label: { en: "Great-grandmother (grandfather's mother)", roman: "Par-dadi (dada ki walida)", ur: "پردادی (دادا کی والدہ)", hi: "परदादी (दादा की माता)" } },
  { key: "maternalGrandmother", group: "ascendants", max: 99, label: { en: "Maternal grandmother (mother's mother)", roman: "Nani (walida ki walida)", ur: "نانی (والدہ کی والدہ)", hi: "नानी (माता की माता)" } },
  { key: "maternalGreatGrandmother", group: "ascendants", max: 99, label: { en: "Great-grandmother (maternal grandmother's mother)", roman: "Par-nani (nani ki walida)", ur: "پرنانی (نانی کی والدہ)", hi: "परनानी (नानी की माता)" } },

  // ---- Siblings ----
  { key: "fullBrother", group: "siblings", max: 99, label: { en: "Full brother (same father & mother)", roman: "Haqeeqi bhai", ur: "حقیقی بھائی", hi: "सगा भाई" } },
  { key: "fullSister", group: "siblings", max: 99, label: { en: "Full sister (same father & mother)", roman: "Haqeeqi behen", ur: "حقیقی بہن", hi: "सगी बहन" } },
  { key: "consanguineBrother", group: "siblings", max: 99, label: { en: "Half-brother (same father only)", roman: "Allaati bhai (walid ek)", ur: "علاتی بھائی (باپ شریک)", hi: "अल्लाती भाई (पिता एक)" } },
  { key: "consanguineSister", group: "siblings", max: 99, label: { en: "Half-sister (same father only)", roman: "Allaati behen (walid ek)", ur: "علاتی بہن (باپ شریک)", hi: "अल्लाती बहन (पिता एक)" } },
  { key: "uterineBrother", group: "siblings", max: 99, label: { en: "Half-brother (same mother only)", roman: "Akhyafi bhai (walida ek)", ur: "اخیافی بھائی (ماں شریک)", hi: "अख़्याफ़ी भाई (माता एक)" } },
  { key: "uterineSister", group: "siblings", max: 99, label: { en: "Half-sister (same mother only)", roman: "Akhyafi behen (walida ek)", ur: "اخیافی بہن (ماں شریک)", hi: "अख़्याफ़ी बहन (माता एक)" } },

  // ---- Other male relatives on the father's side (asabat) ----
  { key: "fullNephew", group: "otherAsabat", max: 99, label: { en: "Full brother's son", roman: "Haqeeqi bhatija", ur: "حقیقی بھتیجا", hi: "सगे भाई का बेटा (भतीजा)" } },
  { key: "consanguineNephew", group: "otherAsabat", max: 99, label: { en: "Half-brother's son (same father)", roman: "Allaati bhatija", ur: "علاتی بھتیجا", hi: "अल्लाती भाई का बेटा" } },
  { key: "fullUncle", group: "otherAsabat", max: 99, label: { en: "Full paternal uncle", roman: "Haqeeqi chacha", ur: "حقیقی چچا", hi: "सगा चाचा" } },
  { key: "consanguineUncle", group: "otherAsabat", max: 99, label: { en: "Paternal uncle (father's half-brother)", roman: "Allaati chacha", ur: "علاتی چچا", hi: "अल्लाती चाचा" } },
  { key: "fullCousin", group: "otherAsabat", max: 99, label: { en: "Son of full paternal uncle", roman: "Haqeeqi chachazad", ur: "حقیقی چچازاد", hi: "सगे चाचा का बेटा" } },
  { key: "consanguineCousin", group: "otherAsabat", max: 99, label: { en: "Son of half paternal uncle", roman: "Allaati chachazad", ur: "علاتی چچازاد", hi: "अल्लाती चाचा का बेटा" } },

  // ---- Distant relatives (Dhawil-arham) ----
  { key: "daughtersSon", group: "distant", max: 99, label: { en: "Daughter's son", roman: "Nawasa (beti ka beta)", ur: "نواسا (بیٹی کا بیٹا)", hi: "नवासा (बेटी का बेटा)" } },
  { key: "daughtersDaughter", group: "distant", max: 99, label: { en: "Daughter's daughter", roman: "Nawasi (beti ki beti)", ur: "نواسی (بیٹی کی بیٹی)", hi: "नवासी (बेटी की बेटी)" } },
  { key: "maternalGrandfather", group: "distant", max: 99, label: { en: "Maternal grandfather (mother's father)", roman: "Nana (walida ke walid)", ur: "نانا (والدہ کا والد)", hi: "नाना (माता के पिता)" } },
  { key: "sistersSon", group: "distant", max: 99, label: { en: "Sister's son", roman: "Bhanja (behen ka beta)", ur: "بھانجا (بہن کا بیٹا)", hi: "भांजा (बहन का बेटा)" } },
  { key: "sistersDaughter", group: "distant", max: 99, label: { en: "Sister's daughter", roman: "Bhanji (behen ki beti)", ur: "بھانجی (بہن کی بیٹی)", hi: "भांजी (बहन की बेटी)" } },
  { key: "brothersDaughter", group: "distant", max: 99, label: { en: "Brother's daughter", roman: "Bhatiji (bhai ki beti)", ur: "بھتیجی (بھائی کی بیٹی)", hi: "भतीजी (भाई की बेटी)" } },
  { key: "paternalAunt", group: "distant", max: 99, label: { en: "Paternal aunt (father's sister)", roman: "Phuphi (walid ki behen)", ur: "پھوپھی (والد کی بہن)", hi: "बुआ (पिता की बहन)" } },
  { key: "maternalAunt", group: "distant", max: 99, label: { en: "Maternal aunt (mother's sister)", roman: "Khala (walida ki behen)", ur: "خالہ (والدہ کی بہن)", hi: "मौसी (माता की बहन)" } },
  { key: "maternalUncle", group: "distant", max: 99, label: { en: "Maternal uncle (mother's brother)", roman: "Mamu (walida ka bhai)", ur: "ماموں (والدہ کا بھائی)", hi: "मामा (माता का भाई)" } }
] as const satisfies readonly HeirDef[];

export type HeirKey = (typeof HEIRS)[number]["key"];

export const HEIR_DEFS: readonly HeirDef[] = HEIRS;

export const initialHeirs = Object.fromEntries(HEIRS.map((h) => [h.key, 0])) as Record<HeirKey, number>;
