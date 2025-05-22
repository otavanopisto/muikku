import * as React from "react";
import "~/sass/elements/notes.scss";

/**
 * SlideDrawerProps
 */
export interface SlideDrawerProps {
  title?: string;
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
 * @returns React.JSX.Element
 */
const SlideDrawer: React.FC<SlideDrawerProps> = (props) => {
  props = { ...defaultProps, ...props };

  const { show, children, title, onClose, onOpen, modifiers } = props;

  let drawerClasses = "journal-center-modal__create-drawer";

  if (show) {
    drawerClasses = `${drawerClasses} state-OPEN`;
  }

  if (show && onOpen) {
    onOpen();
  }

  return (
    <section
      className={`${drawerClasses} ${
        modifiers
          ? modifiers
              .map((m) => `journal-center-modal__create-drawer--${m}`)
              .join(" ")
          : ""
      }`}
    >
      <header
        className={`journal-center-modal__create-drawer-header ${
          modifiers
            ? modifiers
                .map((m) => `evaluation-modal__create-drawer-header--${m}`)
                .join(" ")
            : ""
        }`}
      >
        <div className="journal-center-modal__create-drawer-header-title">
          {title}
        </div>
        <div
          onClick={onClose}
          className="journal-center-modal__create-drawer-close icon-arrow-right"
        ></div>
      </header>
      <div className="journal-center-modal__create-drawer-content">
        {show ? children : null}
      </div>
    </section>
  );
};

export default SlideDrawer;
