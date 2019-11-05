import Link from "~/components/general/link";
import * as React from "react";
import { ButtonPill } from "~/components/general/button";
import "~/sass/elements/item-list.scss";

interface NavigationProps {

}

interface NavigationState {

}

export default class Navigation extends React.Component<NavigationProps, NavigationState> {
  render() {
    return <div className="item-list item-list--aside-navigation">
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
  render() {
    return <div className={this.props.className}>
      {this.props.name ? <span className="item-list__title">
        {this.props.icon ? <span className={`item-list__icon icon icon-${this.props.icon}`} /> : null}
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
  onClick?: () => any,
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
  editableAction?: () => any,
  onScrollToSection?: () => any,
  scrollPadding?: number,
  disableScroll?: boolean
}

interface NavigationElementState {

}

export class NavigationElement extends React.Component<NavigationElementProps, NavigationElementState> {
  render() {
    let editableComponent = null;
    if ( this.props.isEditable && this.props.editableWrapper ) {
      let EditableWrapper = this.props.editableWrapper;
      let args = this.props.editableWrapperArgs || {};
      editableComponent = <EditableWrapper {...this.props.editableWrapperArgs}>
        <ButtonPill disablePropagation as="span" buttonModifiers="navigation-edit-label" icon="pencil" />
      </EditableWrapper>
    } else if ( this.props.isEditable ) {
      editableComponent = <ButtonPill disablePropagation as="span" buttonModifiers="navigation-edit-label"
        icon="pencil" onClick={this.props.editableAction} />
    }

    return <Link className={`item-list__item ${this.props.isActive ? "active" : ""} ${this.props.className ? this.props.className : ""} ${this.props.modifier ? "item-list__item--" + this.props.modifier : ""}`}
      onScrollToSection={this.props.onScrollToSection}
      scrollPadding={this.props.scrollPadding} disableScroll={this.props.disableScroll}
      href={this.props.hash ? "#" + this.props.hash : null} to={this.props.href} onClick={this.props.onClick} ref="element">
      {this.props.icon ? <span title={this.props.iconTitle} className={`item-list__icon icon-${this.props.icon}`} style={{ color: this.props.iconColor }}></span> : null}
      <span className="item-list__text-body">
        {this.props.children}
      </span>
      {this.props.iconAfter ? <span title={this.props.iconAfterTitle}
        className={`item-list__icon icon-${this.props.iconAfter}`} style={{ color: this.props.iconAfterColor }}></span> : null}
      {editableComponent}
    </Link>
  }
  getElement(): HTMLElement {
    return ( this.refs["element"] as Link ).getElement();
  }
}