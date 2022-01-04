import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/application-sub-panel.scss";

interface SubPanelProps {
  modifier?: string;
  bodyModifier?: string;
  i18n: i18nType;
  title: string;
}

interface SubPanelState {}

export default class ApplicationSubPanel extends React.Component<
  SubPanelProps,
  SubPanelState
> {
  render() {
    return (
      <div
        className={`application-sub-panel ${
          this.props.modifier
            ? `application-sub-panel--${this.props.modifier}`
            : ""
        }`}
      >
        <div
          className={`application-sub-panel__header ${
            this.props.modifier
              ? `application-sub-panel__header--${this.props.modifier}`
              : ""
          }`}
        >
          {this.props.title}
        </div>
        <div
          className={`application-sub-panel__body ${
            this.props.modifier
              ? `application-sub-panel__body--${this.props.modifier}`
              : ""
          } ${
            this.props.bodyModifier
              ? `application-sub-panel__body--${this.props.bodyModifier}`
              : ""
          }`}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

interface SubPanelItemDataProps {
  modifier?: string;
  label?: string;
}

interface SubPanelItemProps {
  modifier?: string;
  title: string;
}

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
