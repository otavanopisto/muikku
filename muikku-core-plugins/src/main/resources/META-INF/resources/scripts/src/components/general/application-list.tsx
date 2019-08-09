import * as React from "react";

import '~/sass/elements/application-list.scss';

interface ApplicationListProps {
  modifiers?: string | Array<string>,
  className?: string
}

interface ApplicationListState {

}

export default class ApplicationList extends React.Component<ApplicationListProps, ApplicationListState> {
  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return <div className={`application-list ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map( m => `application-list--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>
}

interface ApplicationListItemState {

}

export class ApplicationListItem extends React.Component<ApplicationListItemProps, ApplicationListItemState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map( m => `application-list__item--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemHeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>
}

interface ApplicationListItemHeaderState {

}

export class ApplicationListItemHeader extends React.Component<ApplicationListItemHeaderProps, ApplicationListItemHeaderState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-header ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map( m => `application-list__item-header--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemBodyProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>
}

interface ApplicationListItemBodyState {

}

export class ApplicationListItemBody extends React.Component<ApplicationListItemBodyProps, ApplicationListItemBodyState> {
  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-body ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map(m=>`application-list__item-body--${m}` ).join( " " ) : ""}`}>
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
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-footer ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map( m => `application-list__item-footer--${m}` ).join( " " ) : ""}`}>
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
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-content-container ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map( m => `application-list__item-content-container--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemContentWrapperProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: string | Array<string>,
  asideModifiers?: string | Array<string>,
  mainModifiers?: string | Array<string>,
  aside: React.ReactElement<any>
}

interface ApplicationListItemContentWrapperState {

}

export class ApplicationListItemContentWrapper extends React.Component<ApplicationListItemContentWrapperProps, ApplicationListItemContentWrapperState> {
  render() {
    let newProps:ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    let asideModifiers = this.props.asideModifiers && this.props.asideModifiers instanceof Array ? this.props.asideModifiers : [this.props.asideModifiers];
    let mainModifiers = this.props.mainModifiers && this.props.mainModifiers instanceof Array ? this.props.mainModifiers : [this.props.mainModifiers];
    delete (newProps as any)["modifiers"];
    delete (newProps as any)["asideModifiers"];
    delete (newProps as any)["mainModifiers"];
    delete (newProps as any)["aside"];
    return <div {...newProps} className={`application-list__item-content-wrapper ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? modifiers.map( m => `application-list__item-content-wrapper--${m}` ).join( " " ) : ""}`}>
      <div className={`application-list__item-content-aside ${this.props.asideModifiers ? asideModifiers.map( m => `application-list__item-content-aside--${m}` ).join( " " ) : ""}`}>
        {this.props.aside}
      </div>
      <div className={`application-list__item-content-main ${this.props.mainModifiers ? mainModifiers.map( m => `application-list__item-content-main--${m}` ).join( " " ) : ""}`}>
        {this.props.children}
      </div>
    </div>
  }
}