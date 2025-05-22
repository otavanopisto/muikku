import * as React from "react";
import "~/sass/elements/panel.scss";

/**
 * PanelProps
 */
interface PanelProps {
  modifier?: string;
  icon?: string;
  header: string;
}

/**
 * Panel
 * @param props PanelProps
 */
export const Panel: React.FC<PanelProps> & {
  BodyTitle?: React.FC<BodyTitleProps>;
  BodyContent?: React.FC<BodyContentProps>;
} = (props) => {
  const { modifier, children, header, icon } = props;

  return (
    <div className={`panel ${modifier ? "panel--" + modifier : ""}`}>
      <div className="panel__header">
        {icon ? (
          <div
            className={`panel__header-icon ${
              modifier ? "panel__header-icon--" + modifier : ""
            } ${icon}`}
          ></div>
        ) : null}
        <h2 className="panel__header-title">{header}</h2>
      </div>
      <div
        className={`panel__body ${modifier ? "panel__body--" + modifier : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * BodyTitleProps
 */
interface BodyTitleProps {
  modifier?: string;
}

/**
 * Panel body title
 * @param props BodyTitleProps
 * @returns React.JSX.Element
 */
const PanelBodyTitle: React.FC<BodyTitleProps> = (props) => {
  const { children, modifier } = props;
  return (
    <div
      className={`panel__body-title ${
        modifier ? "panel__body-title--" + modifier : ""
      }`}
    >
      {children}
    </div>
  );
};

/**
 * BodyContentProps
 */
interface BodyContentProps {
  modifier?: string;
}

/**
 * Panel body content
 * @param props BodyContentProps
 * @returns React.JSX.Element
 */
const PanelBodyContent: React.FC<BodyContentProps> = (props) => {
  const { modifier, children } = props;
  return (
    <div
      className={`panel__body-content ${
        modifier ? "panel__body-content--" + modifier : ""
      }`}
    >
      {children}
    </div>
  );
};

Panel.BodyTitle = PanelBodyTitle;
Panel.BodyContent = PanelBodyContent;
