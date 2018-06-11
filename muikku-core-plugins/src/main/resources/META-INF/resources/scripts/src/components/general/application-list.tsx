import * as React from "react";

import '~/sass/elements/application-list.scss';

interface ApplicationListProps {
  modifiers?: Array<string>
}

interface ApplicationListState {

}

export default class ApplicationList extends React.Component<ApplicationListProps, ApplicationListState> {
  render() {
    return <div className={`application-list ${this.props.modifiers ? this.props.modifiers.map( m => `application-list--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: Array<string>
}

interface ApplicationListItemState {

}

export class ApplicationListItem extends React.Component<ApplicationListItemProps, ApplicationListItemState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item ${this.props.className ? this.props.className : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemHeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: Array<string>
}

interface ApplicationListItemHeaderState {

}

export class ApplicationListItemHeader extends React.Component<ApplicationListItemHeaderProps, ApplicationListItemHeaderState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-header ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? this.props.modifiers.map( m => `application-list__item-header--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemBodyProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: Array<string>
}

interface ApplicationListItemBodyState {

}

export class ApplicationListItemBody extends React.Component<ApplicationListItemBodyProps, ApplicationListItemBodyState> {
  render() {
    return <div {...this.props} className={`application-list__item-body ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? this.props.modifiers.map( m => `application-list__item-body--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemFooterProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: Array<string>
}

interface ApplicationListItemFooterState {

}

export class ApplicationListItemFooter extends React.Component<ApplicationListItemFooterProps, ApplicationListItemFooterState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-footer ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? this.props.modifiers.map( m => `application-list__item-header--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemContentContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: Array<string>
}

interface ApplicationListItemContentContainerState {

}

export class ApplicationListItemContentContainer extends React.Component<ApplicationListItemContentContainerProps, ApplicationListItemContentContainerState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-content-container ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? this.props.modifiers.map( m => `application-list__item-header--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemContentWrapperProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  modifiers?: Array<string>
}

interface ApplicationListItemContentWrapperState {

}

export class ApplicationListItemContentWrapper extends React.Component<ApplicationListItemContentWrapperProps, ApplicationListItemContentWrapperState> {
  render() {
    let newProps: ApplicationListItemHeaderProps = Object.assign( {}, this.props );
    delete newProps["modifiers"];
    return <div {...newProps} className={`application-list__item-content-wrapper ${this.props.className ? this.props.className : ""} ${this.props.modifiers ? this.props.modifiers.map( m => `application-list__item-header--${m}` ).join( " " ) : ""}`}>
      {this.props.children}
    </div>
  }
}