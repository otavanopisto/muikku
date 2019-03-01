import Link from "~/components/general/link";
import * as React from "react";
import { ButtonPill } from "~/components/general/button";
import "~/sass/elements/item-list.scss";

interface NavigationProps {
  
}

interface NavigationState {
  
}

export default class Navigation extends React.Component<NavigationProps, NavigationState> {
  render(){
    return <div className="toc toc--workspace-material-navigation">
      {this.props.children}
    </div>
  }
}

interface NavigationTopicProps {
  name?: string,
  icon?: string,
  className?: string
}

interface NavigationTopicState {
  
}

export class NavigationTopic extends React.Component<NavigationTopicProps, NavigationTopicState> {
  render(){
    return <div className={this.props.className}>
      {this.props.name ? <span className="toc__section-title">
        {this.props.name}
      </span> : null}
      {this.props.children}
    </div>
  }
}

interface NavigationElementProps {
  isActive: boolean,
  className?: string,
  modifier?: string,
  hash?: number | string,
  href?: string,
  onClick?: ()=>any,
  children: string,
  icon?: string,
  iconTitle?: string,
  iconColor?: string,
  iconAfter?: string,
  iconAfterTitle?: string,
  iconAfterColor?: string,
  isEditable?: boolean,
  editableWrapper?: any,
  editableWrapperArgs?: any,
  editableAction?: ()=>any,
  onScrollToSection?: ()=>any,
  scrollPadding?: number,
  disableScroll?: boolean
}

interface NavigationElementState {
  
}

export class NavigationElement extends React.Component<NavigationElementProps, NavigationElementState> {
  render(){
    return <Link className={`toc__item ${this.props.isActive ? "active" : ""} ${this.props.className ? this.props.className : ""} ${this.props.modifier ? "toc__item--" + this.props.modifier : ""}`}
      onScrollToSection={this.props.onScrollToSection}
      scrollPadding={this.props.scrollPadding} disableScroll={this.props.disableScroll}
      href={this.props.hash ? "#" + this.props.hash : null} to={this.props.href} onClick={this.props.onClick} ref="element">
      <span className="toc__text-body">
        {this.props.children}
      </span>
      {this.props.iconAfter ? <span title={this.props.iconAfterTitle}
          className={`toc__icon icon-${this.props.iconAfter}`} style={{color: this.props.iconAfterColor}}></span> : null}
    </Link>
  }
  getElement():HTMLElement {
    return (this.refs["element"] as Link).getElement();
  }
}