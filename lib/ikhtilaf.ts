// lib/ikhtilaf.ts
// The one documented disagreement of Bab al-Awl: the non-Muslim son ("Ibn Kafir").
// Source: As-Sirajiya with Barakat as-Siraj, Bab al-Awl, pp. 51-53 (main text p. 51, footnote 17 on p. 53).
//   Majority (and the fatwa, "wa alayhi al-fatwa"): he is treated as if he did not exist (ka-an lam yakun).
//   Ibn Mas'ud (RA): a barred heir does not inherit but reduces others' fixed shares (hajb nuqsan, not hirman).
// Here the engine runs twice; nothing is invented: the Ibn Mas'ud run only changes the spouse's and the mother's share.
import { calculateMirath, type Counts, type MirathResult } from "./mirath";

const FATHERS = ["father", "paternalGrandfather", "paternalGreatGrandfather"];
type C = Record<string, number>;

export interface BothQauls {
  jumhoor: MirathResult;
  masud: MirathResult | null;
  blockedReason: "father" | null; // Ibn Mas'ud view not shown: the book gives no example for a father / grandfather
  same: boolean;
}

export function hasKafirSon(c: C): boolean { return (c.kafirSon || 0) > 0; }
export function masudAllowed(c: C): boolean { return hasKafirSon(c) && FATHERS.every((k) => !(c[k] > 0)); }

const sig = (r: MirathResult) => r.rows.filter((x) => x.status === "inherits").map((x) => `${x.key}:${x.count}:${x.share.n}/${x.share.d}`).join("|");

export function bothQauls(gender: "male" | "female", counts: Counts): BothQauls | null {
  const c = counts as unknown as C;
  if (!hasKafirSon(c)) return null;
  const jumhoor = calculateMirath(gender, counts, { motherWithGrandfather: "whole" });
  if (!masudAllowed(c)) return { jumhoor, masud: null, blockedReason: "father", same: false };
  const masud = calculateMirath(gender, counts, { motherWithGrandfather: "whole", mahroomHajb: true });
  return { jumhoor, masud, blockedReason: null, same: sig(jumhoor) === sig(masud) && jumhoor.asl === masud.asl && jumhoor.tashih === masud.tashih };
}
