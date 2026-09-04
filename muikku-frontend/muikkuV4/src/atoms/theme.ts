import { atom } from "jotai";
import type { brandRegistry } from "../theme/brands";

export const brandIdAtom = atom<keyof typeof brandRegistry>("muikkuDefault");
