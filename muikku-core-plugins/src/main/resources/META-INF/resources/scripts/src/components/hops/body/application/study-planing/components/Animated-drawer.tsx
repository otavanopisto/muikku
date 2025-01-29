import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Planner card drawer props
 */
interface AnimatedDrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Planner card drawer
 * @param props - Planner card drawer props
 * @returns Planner card drawer
 */
export const AnimatedDrawer = (props: AnimatedDrawerProps) => {
  const {
    isOpen,
    children,
    className = "",
    contentClassName = "",
    onOpen,
    onClose,
  } = props;

  return (
    <AnimatePresence initial={false} onExitComplete={onClose}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            type: "tween",
            duration: 0.2,
          }}
          className={className}
          onAnimationComplete={onOpen}
          style={{ overflow: "hidden" }}
        >
          <div className={contentClassName}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
