import { atom } from "jotai";
import type { NavigationItem } from "../layouts/helpers/navigation";

export const navOpenedAtom = atom<boolean>(false);
export const asideOpenedAtom = atom<boolean>(false);

export const secondaryNavConfigAtom = atom<{
  config: {
    title?: string;
    subTitle?: string;
    items: NavigationItem[];
  };
  customWidth?: number;
} | null>(null);

export const asideConfigAtom = atom<{
  config: {
    title?: string;
    component: React.ReactNode;
  };
} | null>(null);

export const selectedNavItemAtom = atom<NavigationItem | null>(null);
