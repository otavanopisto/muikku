import Link from "~/components/general/link";
import * as React from "react";
import { ButtonPill } from "~/components/general/button";
import "~/sass/elements/item-list.scss";

interface NavigationProps {
  classModifier?: string;
}

interface NavigationState {}

export default class Navigation extends React.Component<
  NavigationProps,
  NavigationState
> {
  render() {
    return (
      <div className={`menu__extras ${this.props.classModifier}`}>
        {this.props.children}
      </div>
    );
  }
}

interface NavigationTopicProps {
  name?: string;
  icon?: string;
  /**
   * If className is given, by default its "menu__items"
   */
  className?: string;
  classModifier?: string;
}

interface NavigationTopicState {}

export class NavigationTopic extends React.Component<
  NavigationTopicProps,
  NavigationTopicState
> {
  render() {
    return (
      <ul className={`menu__items ${this.props.classModifier}`}>
        {this.props.name ? (
          <span className="item-list__title">
            {this.props.icon ? (
              <span
                className={`item-list__icon icon icon-${this.props.icon}`}
              />
            ) : null}
            {this.props.name}
          </span>
        ) : null}
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
      <li className="menu__item--extra">
        <Link
          className={`item-list__item item-list__item--aside-navigation ${
            this.props.isActive ? "active" : ""
          } ${this.props.className ? this.props.className : ""} ${(
            modifiers || []
          )
            .map((s) => `item-list__item--${s}`)
            .join(" ")}`}
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
              className={`item-list__icon icon-${this.props.icon}`}
              style={{ color: this.props.iconColor }}
            ></span>
          ) : null}
          <span className="item-list__text-body">{this.props.children}</span>
          {this.props.iconAfter ? (
            <span
              title={this.props.iconAfterTitle}
              className={`item-list__icon icon-${this.props.iconAfter}`}
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
