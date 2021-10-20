import * as React from "react";

/**
 * SlideDrawerProps
 */
export interface SlideDrawerProps {
  title: string;
  modifiers?: string[];
  show?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

/**
 * SlideDrawer
 * @param param0
 * @returns
 */
const SlideDrawer: React.FC<SlideDrawerProps> = ({
  show,
  children,
  title,
  onClose,
  onOpen,
  modifiers,
}) => {
  let drawerClasses = "evaluation-modal__evaluate-drawer";

  if (show) {
    drawerClasses = "evaluation-modal__evaluate-drawer state-OPEN";
  }

  if (show && onOpen) {
    onOpen();
  }

  return (
    <section className={drawerClasses}>
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
        <div
          onClick={onClose}
          className="evaluation-modal__evaluate-drawer-close icon-arrow-right"
        ></div>
      </header>
      <div className="evaluation-modal__evaluate-drawer-content evaluation-modal__evaluate-drawer-content--workspace">
        {show ? children : null}
      </div>
    </section>
  );
};

export default SlideDrawer;
