import { atom } from "jotai";
import type {
  NavigationBadgeKey,
  NavigationItem,
} from "../navigation/navigation";

export const navOpenedAtom = atom<boolean>(false);
export const asideOpenedAtom = atom<boolean>(false);

export const asideConfigAtom = atom<{
  config: {
    title?: string;
    component: React.ReactNode;
  };
} | null>(null);

export const navigationBadgesAtom = atom<Record<NavigationBadgeKey, number>>({
  communicatorUnread: 12,
  announcerUnread: 1,
});

export const selectedNavItemAtom = atom<NavigationItem | null>(null);
