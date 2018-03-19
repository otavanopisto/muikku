import * as React from "react";

import '~/sass/elements/application-list.scss';

interface ApplicationListProps {
  
}

interface ApplicationListState {
  
}

export default class ApplicationList extends React.Component<ApplicationListProps, ApplicationListState> {
  render(){
    return <div className="application-list"><div className="application-list_item-wrapper">
      {this.props.children}
    </div></div>
  }
}

interface ApplicationListItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  
}

interface ApplicationListItemState {
  
}

export class ApplicationListItem extends React.Component<ApplicationListItemProps, ApplicationListItemState> {
  render(){
    return <div className={`application-list__item ${this.props.className ? this.props.className : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemHeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  
}

interface ApplicationListItemHeaderState {
  
}

export class ApplicationListItemHeader extends React.Component<ApplicationListItemHeaderProps, ApplicationListItemHeaderState> {
  render(){
    return <div {...this.props} className={`application-list__item-header ${this.props.className ? this.props.className : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemBodyProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  
}

interface ApplicationListItemBodyState {
  
}

export class ApplicationListItemBody extends React.Component<ApplicationListItemBodyProps, ApplicationListItemBodyState> {
  render(){
    return <div {...this.props} className={`application-list__item-body ${this.props.className ? this.props.className : ""}`}>
      {this.props.children}
    </div>
  }
}

interface ApplicationListItemFooterProps {
  className: string,
  [key: string]: any
}

interface ApplicationListItemFooterState {
  
}

export class ApplicationListItemFooter extends React.Component<ApplicationListItemFooterProps, ApplicationListItemFooterState> {
  render(){
    return <div {...this.props} className={`application-list__item-footer ${this.props.className ? this.props.className : ""}`}>
      {this.props.children}
    </div>
  }
}