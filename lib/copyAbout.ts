// lib/copyAbout.ts
// About dialog: English only, in every language mode.
import type { Lang } from "./heirs";

export interface AboutCopy {
  menu: string;
  title: string;
  tagline: string;
  aboutLabel: string;
  aboutText: string;
  devLabel: string;
  devName: string;
  devRole: string;
  affilLabel: string;
  affilValue: string;
  reviewLabel: string;
  reviewText: string;
  followLabel: string;
}

const EN: AboutCopy = {
  menu: "About",
  title: "About DEENI HISAB",
  tagline: "Islamic calculators with clear, step-by-step explanations",
  aboutLabel: "About the project",
  aboutText: "DEENI HISAB helps families understand inheritance (Mirath) and zakat. Each result is shown together with its reasoning and follows Hanafi fiqh. It is an educational tool and not a fatwa.",
  devLabel: "Developer & Founder",
  devName: "Tauqeer Raza Ashrafi",
  devRole: "Developer & Founder",
  affilLabel: "Academic affiliation",
  affilValue: "Student, Jamia Al-Raza, Bareilly Sharif",
  reviewLabel: "Scholarly review",
  reviewText: "The rules are under review by a qualified Hanafi scholar. Until that review is complete, please have every result confirmed by your own scholar (Aalim) before acting on it.",
  followLabel: "Follow"
};

export const copyAbout: Record<Lang, AboutCopy> = { en: EN, roman: EN, ur: EN, hi: EN };
