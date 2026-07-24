import type { Transition, Variants } from "framer-motion";
import { NAV_V2_LAYOUT } from "./navigationLayout";

export const NAV_V2_TRANSITION: Transition = NAV_V2_LAYOUT.transition;

export const navigationItemVariants: Variants = {
  entering: {
    y: 20,
    opacity: 0,
    transition: NAV_V2_TRANSITION,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: NAV_V2_TRANSITION,
  },
  exiting: {
    y: -8,
    opacity: 0,
    transition: NAV_V2_TRANSITION,
  },
};
