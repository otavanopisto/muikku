import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Planner card drawer props
 */
interface NotebookAnimatedDrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Notebook animated drawer
 * @param props - Notebook animated drawer props
 */
export const NotebookAnimatedDrawer = (props: NotebookAnimatedDrawerProps) => {
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
        >
          <div className={contentClassName}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
