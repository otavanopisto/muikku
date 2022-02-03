import * as React from "react";
import WarningDialog from "../../../dialogs/close-warning";

/**
 * SlideDrawerProps
 */
export interface SlideDrawerProps {
  title: string;
  showWarning?: boolean;
  modifiers?: string[];
  show?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const defaultProps = {
  showWarning: false,
};

/**
 * SlideDrawer
 * @param props props
 * @returns JSX.Element
 */
const SlideDrawer: React.FC<SlideDrawerProps> = (props) => {
  props = { ...defaultProps, ...props };

  const { show, children, title, onClose, onOpen, modifiers, showWarning } =
    props;

  let drawerClasses = "evaluation-modal__evaluate-drawer";

  if (show) {
    drawerClasses = "evaluation-modal__evaluate-drawer state-OPEN";
  }

  if (show && onOpen) {
    onOpen();
  }

  return (
    <section
      className={`${drawerClasses} ${
        modifiers
          ? modifiers
              .map((m) => `evaluation-modal__evaluate-drawer--${m}`)
              .join(" ")
          : ""
      }`}
    >
      <header
        className={`evaluation-modal__evaluate-drawer-header ${
          modifiers
            ? modifiers
                .map((m) => `evaluation-modal__evaluate-drawer-header--${m}`)
                .join(" ")
            : ""
        }`}
      >
        <div className="evaluation-modal__evaluate-drawer-header-title">
          {title}
        </div>
        {showWarning ? (
          <WarningDialog onContinueClick={onClose}>
            <div className="evaluation-modal__evaluate-drawer-close icon-arrow-right"></div>
          </WarningDialog>
        ) : (
          <div
            onClick={onClose}
            className="evaluation-modal__evaluate-drawer-close icon-arrow-right"
          ></div>
        )}
      </header>
      <div className="evaluation-modal__evaluate-drawer-content evaluation-modal__evaluate-drawer-content--workspace">
        {show ? children : null}
      </div>
    </section>
  );
};

export default SlideDrawer;
