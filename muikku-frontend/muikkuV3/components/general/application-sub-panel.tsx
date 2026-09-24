import * as React from "react";
import "~/sass/elements/application-sub-panel.scss";

/**
 * SubPanelProps
 */
interface SubPanelProps {
  modifier?: string;
  children?: React.ReactNode;
}

/**
 * ApplicationSubPanelHeaderProps
 */
interface ApplicationSubPanelHeaderProps {
  modifier?: string;
  children?: React.ReactNode;
}

/**
 * ApplicationSubPanelBodyProps
 */
interface ApplicationSubPanelBodyProps {
  modifier?: string;
  children?: React.ReactNode;
}

/**
 * ApplicationSubPanelBodyComponent
 */
type ApplicationSubPanelBodyComponent =
  React.FC<ApplicationSubPanelBodyProps> & {
    Content: React.FC<ApplicationSubPanelBodyContentProps>;
    Aside: React.FC<ApplicationSubPanelBodyAsideProps>;
  };

/**
 * ApplicationSubPanel
 * @param props component props
 * @returns JSX.Element
 * Has child components:
 * ApplicationSubpanel.Header, ApplicationSubpanel.Body, ApplicationSubpanel.ViewHeader
 */
const ApplicationSubPanel: React.FC<SubPanelProps> & {
  Header: React.FC<ApplicationSubPanelHeaderProps>;
  ViewHeader: React.FC<SubPanelViewHeaderProps>;
  Body: ApplicationSubPanelBodyComponent;
} = (props) => {
  const { modifier, children } = props;
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
      {children}
    </div>
  );
};

/**
 * ApplicationSubPanelHeader
 * @param props component props
 * @returns JSX.Element
 */
const ApplicationSubPanelHeader: React.FC<ApplicationSubPanelHeaderProps> = (
  props
) => (
  <div
    className={`application-sub-panel__header ${
      props.modifier ? `application-sub-panel__header--${props.modifier}` : ""
    }`}
    data-de-aria-text="true"
    tabIndex={0}
    role="section"
  >
    {props.children}
  </div>
);

/**
 * SubPanelViewHeaderProps
 */
interface SubPanelViewHeaderProps {
  title: string;
  /**
   * Decoration that comes before the main header (could be an avatar, icon)
   */
  decoration?: JSX.Element;
  /**
   * Additional information for the  title
   */
  titleDetail?: string;
  modifier?: string;
  children?: React.ReactNode;
}

/**
 * ApplicationSubPanelViewHeader
 * @param props SubPanelViewHeaderProps
 * @returns JSX.Element
 */
export const ApplicationSubPanelViewHeader: React.FC<
  SubPanelViewHeaderProps
> = (props) => (
  <div
    className={`application-sub-panel__header ${
      props.modifier ? `application-sub-panel__header--${props.modifier}` : ""
    }`}
  >
    {props.decoration ? props.decoration : null}
    <div className="application-sub-panel__header-main-container">
      <h2
        className={`application-sub-panel__header-main ${
          props.modifier
            ? `application-sub-panel__header-main--${props.modifier}`
            : ""
        } `}
        data-de-aria-text="true"
        tabIndex={0}
        role="section"
      >
        {props.title}
      </h2>
      {props.titleDetail ? (
        <div
          className={`application-sub-panel__header-main-detail ${
            props.modifier
              ? `application-sub-panel__header-main-detail--${props.modifier}`
              : ""
          }`}
          data-de-aria-text="true"
          tabIndex={0}
          role="text"
        >
          {props.titleDetail}
        </div>
      ) : null}
    </div>
    {props.children ? (
      <div className="application-sub-panel__header-aside-container">
        {props.children}
      </div>
    ) : null}
  </div>
);

/**
 * ApplicationSubPanelBodyContentProps
 */
interface ApplicationSubPanelBodyContentProps {
  modifier?: string;
  children?: React.ReactNode;
}

/**
 * ApplicationSubPanelBodyContent
 * @param props component props
 * @returns JSX.Element
 */
const ApplicationSubPanelBodyContent: React.FC<
  ApplicationSubPanelBodyContentProps
> = (props) => (
  <div
    className={`application-sub-panel__body-content ${props.modifier ? `application-sub-panel__body-content--${props.modifier}` : ""}`}
  >
    {props.children}
  </div>
);

/**
 * ApplicationSubPanelBodyAsideProps
 */
interface ApplicationSubPanelBodyAsideProps {
  modifier?: string;
  children?: React.ReactNode;
}

/**
 * ApplicationSubPanelBodyAside
 * @param props component props
 * @returns JSX.Element
 */
const ApplicationSubPanelBodyAside: React.FC<
  ApplicationSubPanelBodyAsideProps
> = (props) => (
  <div
    className={`application-sub-panel__body-aside ${props.modifier ? `application-sub-panel__body-aside--${props.modifier}` : ""}`}
  >
    {props.children}
  </div>
);

/**
 * ApplicationSubpanelBody
 * @param props component props
 * @returns JSX.Element
 */
const ApplicationSubPanelBody: ApplicationSubPanelBodyComponent = Object.assign(
  (props: ApplicationSubPanelBodyProps) => (
    <div
      className={`application-sub-panel__body ${
        props.modifier ? `application-sub-panel__body--${props.modifier}` : ""
      }`}
    >
      {props.children}
    </div>
  ),
  {
    Content: ApplicationSubPanelBodyContent,
    Aside: ApplicationSubPanelBodyAside,
  }
);
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
 * @returns JSX.Element
 *
 *
 * Has child components:
 *
 * ApplicationSubPanelItem.Content, ApplicationSubPanelItem.Subitem
 */
export const ApplicationSubPanelItem: React.FC<SubPanelItemProps> & {
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
const ApplicationSubPanelItemData: React.FC<SubPanelItemDataProps> = (
  props
) => (
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
      {React.Children.map(props.children, (child) => (
        <span className="application-sub-panel__single-entry">{child}</span>
      ))}
    </div>
  </div>
);

/**
 * ApplicationSubPanelSubItem
 * @param props props
 * @returns JSX.Element
 */
const ApplicationSubPanelSubItem: React.FC<{
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

ApplicationSubPanel.Header = ApplicationSubPanelHeader;
ApplicationSubPanel.ViewHeader = ApplicationSubPanelViewHeader;
ApplicationSubPanel.Body = ApplicationSubPanelBody;
ApplicationSubPanelItem.Content = ApplicationSubPanelItemData;
ApplicationSubPanelItem.SubItem = ApplicationSubPanelSubItem;

export default ApplicationSubPanel;
