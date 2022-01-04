import Link from "~/components/general/link";
import * as React from "react";
import { ButtonPill } from "~/components/general/button";
import "~/sass/elements/item-list.scss";

interface NavigationProps {}

interface NavigationState {}

export default class Navigation extends React.Component<
  NavigationProps,
  NavigationState
> {
  render() {
    return (
      <nav className="menu-wrapper menu-wrapper--aside">
        {this.props.children}
      </nav>
    );
  }
}

interface NavigationTopicProps {
  name: string;
  classModifier?: string;
}

interface NavigationTopicState {}

export class NavigationTopic extends React.Component<
  NavigationTopicProps,
  NavigationTopicState
> {
  render() {
    const listClassNameModifier = this.props.classModifier
      ? "menu--" + this.props.classModifier
      : "";

    return (
      <ul className={`menu ${listClassNameModifier}`}>
        <li className="menu__title">
          {this.props.name ? this.props.name : null}
        </li>
        {this.props.children}
      </ul>
    );
  }
}

interface NavigationElementProps {
  isActive: boolean;
  className?: string;
  modifiers?: string | Array<string>;
  hash?: number | string;
  href?: string;
  onClick?: (parameter?: any) => any;
  children: string;
  icon?: string;
  iconTitle?: string;
  iconColor?: string;
  iconAfter?: string;
  iconAfterTitle?: string;
  iconAfterColor?: string;
  isEditable?: boolean;
  editableWrapper?: any;
  editableWrapperArgs?: any;
  editableAction?: () => any;
  onScrollToSection?: () => any;
  scrollPadding?: number;
  disableScroll?: boolean;
}

interface NavigationElementState {}

export class NavigationElement extends React.Component<
  NavigationElementProps,
  NavigationElementState
> {
  render() {
    let editableComponent = null;

    let modifiers: Array<string> =
      typeof this.props.modifiers === "string"
        ? [this.props.modifiers]
        : this.props.modifiers;

    if (this.props.isEditable && this.props.editableWrapper) {
      let EditableWrapper = this.props.editableWrapper;
      editableComponent = (
        <EditableWrapper {...this.props.editableWrapperArgs}>
          <ButtonPill
            tabIndex={0}
            disablePropagation
            as="span"
            buttonModifiers="navigation-edit-label"
            icon="pencil"
          />
        </EditableWrapper>
      );
    } else if (this.props.isEditable) {
      editableComponent = (
        <ButtonPill
          tabIndex={0}
          disablePropagation
          as="span"
          buttonModifiers="navigation-edit-label"
          icon="pencil"
          onClick={this.props.editableAction}
        />
      );
    }

    return (
      <li className="menu__item">
        <Link
          className={`menu__item-link ${this.props.isActive ? "active" : ""} ${
            this.props.className ? this.props.className : ""
          } ${(modifiers || []).map((s) => `menu__item-link--${s}`).join(" ")}`}
          onScrollToSection={this.props.onScrollToSection}
          scrollPadding={this.props.scrollPadding}
          disableScroll={this.props.disableScroll}
          href={this.props.hash ? "#" + this.props.hash : null}
          to={this.props.href}
          onClick={this.props.onClick}
          ref="element"
        >
          {this.props.icon ? (
            <span
              title={this.props.iconTitle}
              className={`menu__item-link-icon icon-${this.props.icon}`}
              style={{ color: this.props.iconColor }}
            ></span>
          ) : null}
          <span className="menu__item-link-text">{this.props.children}</span>
          {this.props.iconAfter ? (
            <span
              title={this.props.iconAfterTitle}
              className={`menu__item-link-icon icon-${this.props.iconAfter}`}
              style={{ color: this.props.iconAfterColor }}
            ></span>
          ) : null}
          {editableComponent}
        </Link>
      </li>
    );
  }
  getElement(): HTMLElement {
    return (this.refs["element"] as Link).getElement();
  }
}
