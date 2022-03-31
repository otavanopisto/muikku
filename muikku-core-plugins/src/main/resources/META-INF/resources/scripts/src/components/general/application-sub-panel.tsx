import * as React from "react";
import "~/sass/elements/application-sub-panel.scss";

/**
 * SubPanelProps
 */
interface SubPanelProps {
  modifier?: string;
  bodyModifier?: string;
  title: string;
}

/**
 * SubPanelState
 */
interface SubPanelState {}

/**
 * ApplicationSubPanel
 */
const ApplicationSubPanel: React.FC<SubPanelProps> = (props) => {
  const { modifier, bodyModifier, title, children } = props;
  /**
   * Component render method
   * @returns JSX.Element
   */
  return (
    <div
      className={`application-sub-panel ${
        modifier ? `application-sub-panel--${modifier}` : ""
      }`}
    >
      <div
        className={`application-sub-panel__header ${
          modifier ? `application-sub-panel__header--${modifier}` : ""
        }`}
      >
        {title}
      </div>
      <div
        className={`application-sub-panel__body ${
          modifier ? `application-sub-panel__body--${modifier}` : ""
        } ${
          bodyModifier ? `application-sub-panel__body--${bodyModifier}` : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * SubPanelItemDataProps
 */
interface SubPanelItemDataProps {
  modifier?: string;
  label?: string;
}

/**
 * SubPanelItemProps
 */
interface SubPanelItemProps {
  modifier?: string;
  title: string | JSX.Element;
}

/**
 * ApplicationSubPanelItem
 * @param props props
 * @returns JSX.Elemeent
 */
export const ApplicationSubPanelItem: React.FunctionComponent<SubPanelItemProps> & {
  Content?: React.FunctionComponent<SubPanelItemDataProps>;
  SubItem?: React.FunctionComponent<{ modifier?: string }>;
} = (props) => (
  <div
    className={`application-sub-panel__item ${
      props.modifier ? `application-sub-panel__item--${props.modifier}` : ""
    }`}
  >
    <div
      className={`application-sub-panel__item-title ${
        props.modifier
          ? `application-sub-panel__item-title--${props.modifier}`
          : ""
      }`}
    >
      {props.title}
    </div>
    <div
      className={`application-sub-panel__item-data-container ${
        props.modifier
          ? `application-sub-panel__item-data-container--${props.modifier}`
          : ""
      }`}
    >
      {props.children}
    </div>
  </div>
);

/**
 * ApplicationSubPanelItemData
 * @param props props
 * @returns JSX.Elemenet
 */
const ApplicationSubPanelItemData: React.FunctionComponent<
  SubPanelItemDataProps
> = (props) => (
  <div
    className={`application-sub-panel__item-data ${
      props.modifier
        ? `application-sub-panel__item-data--${props.modifier}`
        : ""
    }`}
  >
    {props.label ? (
      <div
        className={`application-sub-panel__item-data-label ${
          props.modifier
            ? `application-sub-panel__item-data-label--${props.modifier}`
            : ""
        }`}
      >
        {props.label}
      </div>
    ) : null}
    <div
      className={`application-sub-panel__item-data-content ${
        props.modifier
          ? `application-sub-panel__item-data-content--${props.modifier}`
          : ""
      }`}
    >
      {props.children}
    </div>
  </div>
);

/**
 * ApplicationSubPanelSubItem
 * @param props props
 * @returns JSX.Elemenet
 */
const ApplicationSubPanelSubItem: React.FunctionComponent<{
  modifier?: string;
}> = (props) => (
  <div
    className={`application-sub-panel__item-sub-item ${
      props.modifier
        ? `application-sub-panel__item-sub-item--${props.modifier}`
        : ""
    }`}
  >
    {props.children}
  </div>
);

ApplicationSubPanelItem.Content = ApplicationSubPanelItemData;
ApplicationSubPanelItem.SubItem = ApplicationSubPanelSubItem;
export default ApplicationSubPanel;
