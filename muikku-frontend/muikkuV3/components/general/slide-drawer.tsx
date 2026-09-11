import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, Variants } from "framer-motion";
import FocusTrap from "focus-trap-react";
import { IconButton } from "~/components/general/button";
import "~/sass/elements/slide-drawer.scss";
import { useCallback } from "react";

const slideDrawerVariants: Variants = {
  hidden: { x: "110%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const slideDrawerTransition = {
  x: { duration: 0.4, ease: "easeOut" as const },
  opacity: { duration: 0.2, ease: "easeOut" as const },
};

/**
 * SlideDrawer props interface
 */
export interface SlideDrawerProps {
  title: string;
  children?: React.ReactElement;
  modifiers?: string[];
  closeIconModifiers?: string[];
  content: (closePortal: () => void) => React.ReactNode;
  footer?: (closePortal: () => void) => React.ReactNode;
  isOpen?: boolean;
  disableClose?: boolean;
  showWarning?: boolean;
  onOpen?: (element?: HTMLElement) => void;
  onClose?: () => void;
}

/**
 * SlideDrawer component
 * @param props - SlideDrawer props
 * @returns SlideDrawer component
 */
const SlideDrawer: React.FC<SlideDrawerProps> = (props) => {
  const {
    title,
    children,
    modifiers,
    closeIconModifiers,
    content,
    footer,
    isOpen,
    disableClose,
    onOpen,
    onClose,
  } = props;

  const isControlled = isOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = isControlled ? isOpen : uncontrolledOpen;

  /**
   * Set open
   * @param next - Next
   */
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
    },
    [isControlled, setUncontrolledOpen]
  );

  /**
   * Handle open
   */
  const handleOpen = () => {
    setOpen(true);
    onOpen?.();
  };

  /**
   * Handle close
   */
  const handleClose = useCallback(() => {
    if (disableClose) {
      return;
    }
    setOpen(false);
  }, [disableClose, setOpen]);

  // Key down effect
  React.useEffect(() => {
    if (!open) {
      return;
    }

    /**
     * On key down
     * @param e - Keyboard event
     */
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") {
        return;
      }
      e.stopPropagation();
      e.stopImmediatePropagation();
      handleClose();
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, disableClose, handleClose]);

  // Trigger element
  const trigger =
    children &&
    React.cloneElement(children, {
      // eslint-disable-next-line jsdoc/require-jsdoc
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        handleOpen();
      },
    });

  const modifierList = modifiers || [];

  /**
   * With modifiers
   * @param base - Base
   * @param element - Element
   * @returns string
   */
  const withModifiers = (base: string, element?: string) =>
    [
      base,
      ...modifierList.map((m) =>
        element ? `slide-drawer__${element}--${m}` : `slide-drawer--${m}`
      ),
    ].join(" ");

  const drawer = (
    <AnimatePresence onExitComplete={onClose}>
      {open && (
        <motion.section
          key="slide-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={withModifiers("slide-drawer")}
          variants={slideDrawerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={slideDrawerTransition}
        >
          <FocusTrap
            focusTrapOptions={{
              allowOutsideClick: true,
              clickOutsideDeactivates: true,
              preventScroll: true,
            }}
          >
            <div
              className={withModifiers("slide-drawer__container", "container")}
            >
              <header
                className={withModifiers("slide-drawer__header", "header")}
              >
                <div
                  className={withModifiers(
                    "slide-drawer__header-title",
                    "header-title"
                  )}
                >
                  {title}
                </div>
                <IconButton
                  onClick={handleClose}
                  disabled={disableClose}
                  buttonModifiers={closeIconModifiers}
                  icon="arrow-right"
                />
              </header>
              <div
                className={withModifiers("slide-drawer__content", "content")}
              >
                {content(handleClose)}
              </div>
              {footer ? (
                <footer
                  className={withModifiers("slide-drawer__footer", "footer")}
                >
                  {footer(handleClose)}
                </footer>
              ) : null}
            </div>
          </FocusTrap>
        </motion.section>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {trigger}
      {createPortal(drawer, document.body)}
    </>
  );
};

export default SlideDrawer;
