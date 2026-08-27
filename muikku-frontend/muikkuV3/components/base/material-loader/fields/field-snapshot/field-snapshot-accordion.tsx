import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

/**
 * Snapshot accordion props
 */
interface FieldSnapshotAccordionProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Field snapshot accordion
 * @param props - Field snapshot accordion props
 * @returns Field snapshot accordion
 */
export const FieldSnapshotAccordion = (props: FieldSnapshotAccordionProps) => {
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
