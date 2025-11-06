import * as React from "react";
import "~/sass/elements/application-list.scss";
import CkeditorLoaderContent from "../base/ckeditor-loader/content";

/**
 * ApplicationListProps
 */
interface ApplicationListProps {
  modifiers?: string | Array<string>;
  className?: string;
  contentState?: string;
  sortKey?: string;
  sortData?: any;
  footer?: React.ReactElement<any>;
}

/**
 * ApplicationListState
 */
interface ApplicationListState {
  sortOrder: string;
}

/**
 * ApplicationList
 */
export default class ApplicationList extends React.Component<
  ApplicationListProps,
  ApplicationListState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`application-list ${
          this.props.className ? this.props.className : ""
        } ${
          this.props.modifiers
            ? modifiers.map((m) => `application-list--${m}`).join(" ")
            : ""
        }`}
      >
        <div
          className={`application-list__content ${
            this.props.modifiers
              ? modifiers
                  .map((m) => `application-list__content--${m}`)
                  .join(" ")
              : ""
          } ${this.props.contentState ? this.props.contentState : ""}`}
        >
          {this.props.children}
        </div>
        {this.props.footer ? (
          <div
            className={`application-list__footer ${
              this.props.modifiers
                ? modifiers
                    .map((m) => `application-list__footer--${m}`)
                    .join(" ")
                : ""
            }`}
          >
            {this.props.footer}
          </div>
        ) : null}
      </div>
    );
  }
}

/**
 * ApplicationListItemProps
 */
interface ApplicationListItemProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string | Array<string>;
  classState?: string;
}

/**
 * ApplicationListItemState
 */
interface ApplicationListItemState {}

/**
 * ApplicationListItem
 */
export class ApplicationListItem extends React.Component<
  ApplicationListItemProps,
  ApplicationListItemState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const newProps: ApplicationListItemProps = Object.assign({}, this.props);
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    delete newProps["modifiers"];
    delete newProps["classState"];
    return (
      <div
        tabIndex={0}
        {...newProps}
        className={`application-list__item ${
          this.props.className ? this.props.className : ""
        } ${
          this.props.modifiers
            ? modifiers.map((m) => `application-list__item--${m}`).join(" ")
            : ""
        } ${
          this.props.classState
            ? "state-" + this.props.classState.toUpperCase()
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * ApplicationListItemDateProps
 */
interface ApplicationListItemDateProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string | Array<string>;
  startDate: string;
  endDate: string;
}

/**
 * ApplicationListItemDateState
 */
interface ApplicationListItemDateState {}

/**
 * ApplicationListItemDate
 */
export class ApplicationListItemDate extends React.Component<
  ApplicationListItemDateProps,
  ApplicationListItemDateState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`application-list__item-dates ${
          this.props.modifiers
            ? modifiers
                .map((m) => `application-list__item-header--${m}`)
                .join(" ")
            : ""
        }`}
      >
        <span className="glyph icon-clock"></span>
        <span className="application-list__item-date-container">
          {this.props.startDate} - {this.props.endDate}
        </span>
      </div>
    );
  }
}

/**
 * ApplicationListItemHeaderProps
 */
interface ApplicationListItemHeaderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string | Array<string>;
  primary?: React.ReactElement<any>;
  secondary?: React.ReactElement<any>;
}

/**
 * ApplicationListItemHeaderState
 */
interface ApplicationListItemHeaderState {}

/**
 * ApplicationListItemHeader
 */
export class ApplicationListItemHeader extends React.Component<
  ApplicationListItemHeaderProps,
  ApplicationListItemHeaderState
> {
  /**
   * Component render method
   * @returns JSX.Elemenet
   */
  render() {
    const newProps: ApplicationListItemHeaderProps = Object.assign(
      {},
      this.props
    );
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    delete newProps["modifiers"];

    return (
      <div
        {...newProps}
        className={`application-list__item-header ${
          this.props.className ? this.props.className : ""
        } ${
          this.props.modifiers
            ? modifiers
                .map((m) => `application-list__item-header--${m}`)
                .join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * ApplicationListHeaderPrimaryProps
 */
interface ApplicationListHeaderPrimaryProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string | Array<string>;
}

/**
 * ApplicationListHeaderPrimaryState
 */
interface ApplicationListHeaderPrimaryState {}

/**
 * ApplicationListHeaderPrimary
 */
export class ApplicationListHeaderPrimary extends React.Component<
  ApplicationListHeaderPrimaryProps,
  ApplicationListHeaderPrimaryState
> {
  /**
   * Component render method
   * @returns JSX.Elemeent
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`application-list__header-primary ${
          this.props.className ? this.props.className : ""
        } ${
          this.props.modifiers
            ? modifiers
                .map((m) => `application-list__header-primary--${m}`)
                .join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * ApplicationListItemBodyProps
 */
interface ApplicationListItemBodyProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string | Array<string>;
  header?: string;
  content?: string;
}

/**
 * ApplicationListItemBodyState
 */
interface ApplicationListItemBodyState {}

/**
 * ApplicationListItemBody
 */
export class ApplicationListItemBody extends React.Component<
  ApplicationListItemBodyProps,
  ApplicationListItemBodyState
> {
  /**
   * Component render method
   * @returns JSX.Elemeent
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    const newProps: ApplicationListItemHeaderProps = Object.assign(
      {},
      this.props
    );
    delete newProps["modifiers"];
    return (
      <div
        {...newProps}
        className={`application-list__item-body ${
          this.props.className ? this.props.className : ""
        } ${
          this.props.modifiers
            ? modifiers
                .map((m) => `application-list__item-body--${m}`)
                .join(" ")
            : ""
        }`}
      >
        {this.props.header ? (
          <header
            className={`application-list__item-content-header ${
              this.props.modifiers
                ? modifiers
                    .map((m) => `application-list__item-content-header--${m}`)
                    .join(" ")
                : ""
            }`}
          >
            {this.props.header}
          </header>
        ) : null}
        {this.props.content ? (
          <section
            className={`application-list__item-content-body rich-text ${
              this.props.modifiers
                ? modifiers
                    .map((m) => `application-list__item-content-body--${m}`)
                    .join(" ")
                : ""
            }`}
          >
            <CkeditorLoaderContent html={this.props.content} />
          </section>
        ) : null}
        {this.props.children}
      </div>
    );
  }
}

/**
 * ApplicationListItemFooterProps
 */
interface ApplicationListItemFooterProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string | Array<string>;
}

/**
 * ApplicationListItemFooterState
 */
interface ApplicationListItemFooterState {}

/**
 * ApplicationListItemFooter
 */
export class ApplicationListItemFooter extends React.Component<
  ApplicationListItemFooterProps,
  ApplicationListItemFooterState
> {
  /**
   * Component render method
   * @returns JSX.Elemeent
   */
  render() {
    const newProps: ApplicationListItemHeaderProps = Object.assign(
      {},
      this.props
    );
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    delete newProps["modifiers"];
    return (
      <div
        {...newProps}
        className={`application-list__item-footer ${
          this.props.className ? this.props.className : ""
        } ${
          this.props.modifiers
            ? modifiers
                .map((m) => `application-list__item-footer--${m}`)
                .join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * ApplicationListItemContentContainerProps
 */
interface ApplicationListItemContentContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string | Array<string>;
}

/**
 * ApplicationListItemContentContainerState
 */
interface ApplicationListItemContentContainerState {}

/**
 * ApplicationListItemContentContainer
 */
export class ApplicationListItemContentContainer extends React.Component<
  ApplicationListItemContentContainerProps,
  ApplicationListItemContentContainerState
> {
  /**
   * Component render method
   * @returns JSX.Elemeent
   */
  render() {
    const newProps: ApplicationListItemHeaderProps = Object.assign(
      {},
      this.props
    );
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    delete newProps["modifiers"];
    return (
      <div
        {...newProps}
        className={`application-list__item-content-container ${
          this.props.className ? this.props.className : ""
        } ${
          this.props.modifiers
            ? modifiers
                .map((m) => `application-list__item-content-container--${m}`)
                .join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * ApplicationListItemContentWrapperProps
 */
interface ApplicationListItemContentWrapperProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string | Array<string>;
  customClassName?: string;
  actionModifiers?: string | Array<string>;
  asideModifiers?: string | Array<string>;
  mainModifiers?: string | Array<string>;
  actions?: React.ReactElement<any>;
  aside?: React.ReactElement<any>;
}

/**
 * ApplicationListItemContentWrapperState
 */
interface ApplicationListItemContentWrapperState {}

/**
 * ApplicationListItemContentWrapper
 */
export class ApplicationListItemContentWrapper extends React.Component<
  ApplicationListItemContentWrapperProps,
  ApplicationListItemContentWrapperState
> {
  /**
   * Component render method
   * @returns JSX.Elemeent
   */
  render() {
    const newProps: ApplicationListItemHeaderProps = Object.assign(
      {},
      this.props
    );
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    const asideModifiers =
      this.props.asideModifiers && this.props.asideModifiers instanceof Array
        ? this.props.asideModifiers
        : [this.props.asideModifiers];
    const mainModifiers =
      this.props.mainModifiers && this.props.mainModifiers instanceof Array
        ? this.props.mainModifiers
        : [this.props.mainModifiers];

    delete (newProps as any)["modifiers"];
    delete (newProps as any)["asideModifiers"];
    delete (newProps as any)["mainModifiers"];
    delete (newProps as any)["aside"];
    delete (newProps as any)["actionModifiers"];
    delete (newProps as any)["actions"];

    return (
      <div
        {...newProps}
        className={`application-list__item-content-wrapper ${
          this.props.className ? this.props.className : ""
        } ${
          this.props.modifiers
            ? modifiers
                .map((m) => `application-list__item-content-wrapper--${m}`)
                .join(" ")
            : ""
        }`}
      >
        <div
          className={`application-list__item-content-aside ${
            this.props.asideModifiers
              ? asideModifiers
                  .map((m) => `application-list__item-content-aside--${m}`)
                  .join(" ")
              : ""
          }`}
        >
          {this.props.aside}
        </div>
        <div
          className={`application-list__item-content-main ${
            this.props.mainModifiers
              ? mainModifiers
                  .map((m) => `application-list__item-content-main--${m}`)
                  .join(" ")
              : ""
          }`}
        >
          {this.props.children}
        </div>
        {this.props.actions ? (
          <div className="application-list__item-content-actions">
            {this.props.actions}
          </div>
        ) : null}
      </div>
    );
  }
}

// These are designed to be placed inside ApplicationListeItemContentWrapper

/**
 * ApplicationListItemContentActionsProps
 */
interface ApplicationListItemContentActionsProps {
  modifiers?: string | Array<string>;
}

/**
 * ApplicationListItemContentActions
 */
export class ApplicationListItemContentActions extends React.Component<ApplicationListItemContentActionsProps> {
  /**
   * Component render method
   * @returns JSX.Elemeent
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`application-list__item-content-actions ${
          this.props.modifiers
            ? modifiers
                .map((m) => `application-list__item-content-actions--${m}`)
                .join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * ApplicationListItemContentDataProps
 */
interface ApplicationListItemContentDataProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  modifiers?: string | Array<string>;
}

/**
 * ApplicationListItemContentDataState
 */
interface ApplicationListItemContentDataState {}

/**
 * ApplicationListItemContentData
 */
export class ApplicationListItemContentData extends React.Component<
  ApplicationListItemContentDataProps,
  ApplicationListItemContentDataState
> {
  /**
   * Component render method
   * @returns JSX.Elemeent
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`application-list__item-content ${
          this.props.className ? this.props.className : ""
        } ${
          this.props.modifiers
            ? modifiers
                .map((m) => `application-list__item-content--${m}`)
                .join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}
