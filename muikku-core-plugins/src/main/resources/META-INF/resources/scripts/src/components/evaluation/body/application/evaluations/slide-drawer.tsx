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
  let drawerClasses = `side-drawer ${
    modifiers ? modifiers.map((m) => `side-drawer--${m}`).join(" ") : ""
  }`;

  if (show) {
    drawerClasses = `side-drawer ${
      modifiers ? modifiers.map((m) => `side-drawer--${m}`).join(" ") : ""
    } open`;
  }

  if (show && onOpen) {
    onOpen();
  }

  return (
    <section className={drawerClasses}>
      <header
        className={`eval-modal-editor-header ${
          modifiers
            ? modifiers.map((m) => `eval-modal-editor-header--${m}`).join(" ")
            : ""
        }`}
      >
        <div className="eval-modal-title">{title}</div>
        <div onClick={onClose} className="eval-modal-close arrow right"></div>
      </header>
      <div className="eval-modal-evaluate-workspace-content">
        {show ? children : null}
      </div>
    </section>
  );
};

export default SlideDrawer;
