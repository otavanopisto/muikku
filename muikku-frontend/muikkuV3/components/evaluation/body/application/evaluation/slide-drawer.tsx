import * as React from "react";
import WarningDialog from "../../../dialogs/close-warning";
import { IconButton } from "../../../../general/button";
import FocusTrap from "focus-trap-react";

/**
 * SlideDrawerProps
 */
export interface SlideDrawerProps {
  title: string;
  disableClose?: boolean;
  showWarning?: boolean;
  closeIconModifiers?: string[];
  modifiers?: string[];
  show?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const defaultProps = {
  showWarning: false,
  disableCloseButtons: false,
};

/**
 * SlideDrawer
 *
 * @param props props
 * @returns JSX.Element
 */
const SlideDrawer = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<SlideDrawerProps>
>((props, ref) => {
  props = { ...defaultProps, ...props };

  const {
    show,
    children,
    title,
    onClose,
    onOpen,
    closeIconModifiers,
    modifiers,
    showWarning,
    disableClose,
  } = props;

  let drawerClasses = "evaluation-modal__evaluate-drawer";

  if (show) {
    drawerClasses = "evaluation-modal__evaluate-drawer state-OPEN";
  }

  if (show && onOpen) {
    onOpen();
  }

  return (
    <FocusTrap
      active={show}
      focusTrapOptions={{
        allowOutsideClick: true,
        clickOutsideDeactivates: true,
        preventScroll: true,
      }}
    >
      <section
        ref={ref}
        className={`${drawerClasses} ${
          modifiers
            ? modifiers
                .map((m) => `evaluation-modal__evaluate-drawer--${m}`)
                .join(" ")
            : ""
        }`}
      >
        <header className="evaluation-modal__evaluate-drawer-header">
          <div className="evaluation-modal__evaluate-drawer-header-title">
            {title}
          </div>
          {showWarning ? (
            <WarningDialog onContinueClick={onClose}>
              <IconButton
                onClick={onClose}
                disabled={disableClose}
                buttonModifiers={closeIconModifiers}
                icon="arrow-right"
              ></IconButton>
            </WarningDialog>
          ) : (
            <IconButton
              onClick={onClose}
              disabled={disableClose}
              buttonModifiers={closeIconModifiers}
              icon="arrow-right"
            ></IconButton>
          )}
        </header>
        <div className="evaluation-modal__evaluate-drawer-content evaluation-modal__evaluate-drawer-content--workspace">
          {show ? children : null}
        </div>
      </section>
    </FocusTrap>
  );
});

SlideDrawer.displayName = "SlideDrawer";

export default SlideDrawer;
