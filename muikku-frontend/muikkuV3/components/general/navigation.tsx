/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */
import Link from "~/components/general/link";
import * as React from "react";
import { ButtonPill } from "~/components/general/button";
import "~/sass/elements/item-list.scss";

/**
 * Navigation
 */
export default class Navigation extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  /**
   * Component render method
   * @returns JSx.Element
   */
  render() {
    return (
      <nav className="menu-wrapper menu-wrapper--aside">
        {this.props.children}
      </nav>
    );
  }
}

/**
 * NavigationTopicProps
 */
interface NavigationTopicProps {
  name: string;
  classModifier?: string;
}

/**
 * NavigationTopicState
 */
interface NavigationTopicState {}

/**
 * NavigationTopic
 */
export class NavigationTopic extends React.Component<
  NavigationTopicProps,
  NavigationTopicState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
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

/**
 * NavigationElementProps
 */
interface NavigationElementProps {
  isActive: boolean;
  className?: string;
  modifiers?: string | Array<string>;
  hash?: number | string;
  id?: string;
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
  editableIcon?: string;
  editableAction?: () => any;
  onScrollToSection?: () => any;
  scrollPadding?: number;
  disableScroll?: boolean;
}

/**
 * NavigationElementState
 */
interface NavigationElementState {}

/**
 * NavigationElement
 */
export class NavigationElement extends React.Component<
  NavigationElementProps,
  NavigationElementState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    let editableComponent: JSX.Element | null = null;
    const modifiers: Array<string> =
      typeof this.props.modifiers === "string"
        ? [this.props.modifiers]
        : this.props.modifiers;

    if (this.props.isEditable && this.props.editableWrapper) {
      const EditableWrapper = this.props.editableWrapper;
      editableComponent = (
        <EditableWrapper {...this.props.editableWrapperArgs}>
          <ButtonPill
            tabIndex={0}
            disablePropagation
            as="span"
            buttonModifiers="navigation-edit-label"
            icon={this.props.editableIcon ? this.props.editableIcon : "pencil"}
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
          icon={this.props.editableIcon ? this.props.editableIcon : "pencil"}
          onClick={this.props.editableAction}
        />
      );
    }

    return (
      <li id={this.props.id ? this.props.id : null} className="menu__item">
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

  /**
   * getElement
   * @returns HTMLElement
   */
  getElement(): HTMLElement {
    return (this.refs["element"] as any).getElement();
  }
}
