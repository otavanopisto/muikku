import { atom } from "jotai";
import type { NavigationItem } from "../layouts/helpers/navigation";

export const primaryNavOpenedAtom = atom(true);
export const secondaryNavOpenedAtom = atom(true);
export const selectedNavItemAtom = atom<NavigationItem | null>(null);
