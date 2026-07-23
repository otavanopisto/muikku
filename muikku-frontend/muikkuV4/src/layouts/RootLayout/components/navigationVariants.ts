import type { Transition, Variants } from "framer-motion";
import { NAV_LAYOUT } from "./navigationLayout";

export const NAV_TRANSITION: Transition = NAV_LAYOUT.transition;

export const navigationItemVariants: Variants = {
  entering: {
    y: 20,
    opacity: 0,
    transition: NAV_TRANSITION,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: NAV_TRANSITION,
  },
  exiting: {
    y: -8,
    opacity: 0,
    transition: NAV_TRANSITION,
  },
};

export const mainNavWidthVariants = {
  expanded: NAV_LAYOUT.mainExpanded,
  collapsed: NAV_LAYOUT.mainCollapsed,
};
