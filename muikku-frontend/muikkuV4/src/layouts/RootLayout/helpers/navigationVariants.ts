import type { Variants } from "framer-motion";

export const NAV_TRANSITION = {
  transition: {
    duration: 0.25,
    ease: "easeInOut" as const,
  },
} as const;

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
