import * as React from "react";
import '~/sass/elements/application-list.scss';


interface ApplicationListProps {
  modifiers?: string | Array<string>,
  className?: string,
  contentState?: string,
  sortKey?: string,
  sortData?: any
  footer?: React.ReactElement<any>,
}

interface ApplicationListState {
  sortOrder: string
}

export default class ApplicationList extends React.Component<ApplicationListProps, ApplicationListState> {
  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return <div className={`application-list ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m => `application-list--${m}`).join(" ") : ""}`}>
      <div className={`application-list__content ${this.props.modifiers ? modifiers.map(m => `application-list__content--${m}`).join(" ") : ""} ${this.props.contentState ? this.props.contentState : null}`}>{this.props.children}</div>
      {this.props.footer ? <div className={`application-list__footer ${this.props.modifiers ? modifiers.map(m => `application-list__footer--${m}`).join(" ") : ""}`}>{this.props.footer}</div> : null}
    </div>
  }
}


interface ApplicationListItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>
  classState?: string,
}

interface ApplicationListItemState {

}

export class ApplicationListItem extends React.Component<ApplicationListItemProps, ApplicationListItemState> {
  render() {
    let newProps: ApplicationListItemProps = Object.assign({}, this.props);
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    delete newProps["modifiers"];
    delete newProps["classState"];
    return <div tabIndex={0} {...newProps} className={`application-list__item ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m => `application-list__item--${m}`).join(" ") : ""} ${this.props.classState ? "state-" + this.props.classState.toUpperCase() : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemDateProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>,
  startDate: string,
  endDate: string
}

interface ApplicationListItemDateState {
}

export class ApplicationListItemDate extends React.Component<ApplicationListItemDateProps, ApplicationListItemDateState> {
  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return <div className={`application-list__item-dates ${this.props.modifiers ? modifiers.map(m => `application-list__item-header--${m}`).join(" ") : ""}`}>
      <span className="glyph icon-clock"></span>
      <span className="application-list__item-date-container">
        {this.props.startDate} - {this.props.endDate}
      </span>
    </div>
  }
}

interface ApplicationListItemHeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>,
  primary?: React.ReactElement<any>,
  secondary?: React.ReactElement<any>
}

interface ApplicationListItemHeaderState {
}

export class ApplicationListItemHeader extends React.Component<ApplicationListItemHeaderProps, ApplicationListItemHeaderState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign({}, this.props);
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    delete newProps["modifiers"];

    return <div {...newProps} className={`application-list__item-header ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m => `application-list__item-header--${m}`).join(" ") : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListHeaderPrimaryProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>
}

interface ApplicationListHeaderPrimaryState {
}

export class ApplicationListHeaderPrimary extends React.Component<ApplicationListHeaderPrimaryProps, ApplicationListHeaderPrimaryState> {
  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return <div className={`application-list__header-primary ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m => `application-list__header-primary--${m}`).join(" ") : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemBodyProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>,
  header?: string,
  content?: string
}

interface ApplicationListItemBodyState {
}

export class ApplicationListItemBody extends React.Component<ApplicationListItemBodyProps, ApplicationListItemBodyState> {
  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    let newProps: ApplicationListItemHeaderProps = Object.assign({}, this.props);
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-body ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m => `application-list__item-body--${m}`).join(" ") : ""}`}>
      {this.props.header ? <header className={`application-list__item-content-header ${this.props.modifiers ? modifiers.map(m => `application-list__item-content-header--${m}`).join(" ") : ""}`}>{this.props.header}</header> : null}
      {this.props.content ? <section className={`application-list__item-content-body rich-text ${this.props.modifiers ? modifiers.map(m => `application-list__item-content-body--${m}`).join(" ") : ""}`} dangerouslySetInnerHTML={{ __html: this.props.content }}></section> : null}
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemFooterProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>
}

interface ApplicationListItemFooterState {
}

export class ApplicationListItemFooter extends React.Component<ApplicationListItemFooterProps, ApplicationListItemFooterState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign({}, this.props);
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-footer ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m => `application-list__item-footer--${m}`).join(" ") : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemContentContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>
}

interface ApplicationListItemContentContainerState {
}

export class ApplicationListItemContentContainer extends React.Component<ApplicationListItemContentContainerProps, ApplicationListItemContentContainerState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign({}, this.props);
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-content-container ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m => `application-list__item-content-container--${m}`).join(" ") : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemContentWrapperProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>,
  actionModifiers?: string | Array<string>,
  asideModifiers?: string | Array<string>,
  mainModifiers?: string | Array<string>,
  actions?: React.ReactElement<any>,
  aside?: React.ReactElement<any>
}

interface ApplicationListItemContentWrapperState {
}

export class ApplicationListItemContentWrapper extends React.Component<ApplicationListItemContentWrapperProps, ApplicationListItemContentWrapperState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign({}, this.props);
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    let asideModifiers = this.props.asideModifiers && this.props.asideModifiers instanceof Array ? this.props.asideModifiers : [this.props.asideModifiers];
    let mainModifiers = this.props.mainModifiers && this.props.mainModifiers instanceof Array ? this.props.mainModifiers : [this.props.mainModifiers];
    let actionModifiers = this.props.actionModifiers && this.props.actionModifiers instanceof Array ? this.props.actionModifiers : [this.props.actionModifiers];

    delete (newProps as any)["modifiers"];
    delete (newProps as any)["asideModifiers"];
    delete (newProps as any)["mainModifiers"];
    delete (newProps as any)["aside"];
    delete (newProps as any)["actionModifiers"];
    delete (newProps as any)["actions"];

    return <div {...newProps} className={`application-list__item-content-wrapper ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m => `application-list__item-content-wrapper--${m}`).join(" ") : ""}`}>
      <div className={`application-list__item-content-aside ${this.props.asideModifiers ? asideModifiers.map(m => `application-list__item-content-aside--${m}`).join(" ") : ""}`}>
        {this.props.aside}
      </div>
      <div className={`application-list__item-content-main ${this.props.mainModifiers ? mainModifiers.map(m => `application-list__item-content-main--${m}`).join(" ") : ""}`}>
        {this.props.children}
      </div>
      {this.props.actions ?
        <div className="application-list__item-content-actions">{this.props.actions}</div>
        : null}
    </div>
  }
}

// These are designed to be placed inside ApplicationListeItemContentWrapper

interface ApplicationListItemContentActionsProps {
  modifiers?: string | Array<string>,
}

export class ApplicationListItemContentActions extends React.Component<ApplicationListItemContentActionsProps> {
  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return <div className={`application-list__item-content-actions ${this.props.modifiers ? modifiers.map(m => `application-list__item-content-actions--${m}`).join(" ") : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemContentDataProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>,
}

interface ApplicationListItemContentDataState {

}
export class ApplicationListItemContentData extends React.Component<ApplicationListItemContentDataProps, ApplicationListItemContentDataState> {
  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return <div className={`application-list__item-content ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m => `application-list__item-content--${m}`).join(" ") : ""}`}>{this.props.children}</div>
  }
}
