import { atom } from "jotai";
import type { NavigationItem } from "../layouts/helpers/navigation";

export const primaryNavOpenedAtom = atom(true);
export const secondaryNavOpenedAtom = atom(true);

export const secondaryNavConfigAtom = atom<{
  config: {
    title?: string;
    subTitle?: string;
    items: NavigationItem[];
  };
  customWidth?: number;
} | null>(null);

export const selectedNavItemAtom = atom<NavigationItem | null>(null);
