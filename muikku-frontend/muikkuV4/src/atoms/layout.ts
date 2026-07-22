import { atom } from "jotai";
import type { NavigationItem } from "../navigation/navigation";

export const navOpenedAtom = atom<boolean>(false);
export const asideOpenedAtom = atom<boolean>(false);

export const asideConfigAtom = atom<{
  config: {
    title?: string;
    component: React.ReactNode;
  };
} | null>(null);

export const selectedNavItemAtom = atom<NavigationItem | null>(null);
