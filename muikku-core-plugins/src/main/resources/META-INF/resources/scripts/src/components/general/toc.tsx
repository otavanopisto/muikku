/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import Link from "~/components/general/link";
import "~/sass/elements/toc.scss";

/**
 * TocProps
 */
interface TocProps {
  tocTitle?: string;
}

/**
 * Toc
 */
export default class Toc extends React.Component<
  TocProps,
  Record<string, unknown>
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="toc">
        {this.props.tocTitle ? (
          <h2 className="toc__title">{this.props.tocTitle}</h2>
        ) : null}
        {this.props.children}
      </div>
    );
  }
}

/**
 * TocTopicProps
 */
interface TocTopicProps {
  name?: string;
  icon?: string;
  className?: string;
  isHidden: boolean;
  hash?: number | string;
  iconAfter?: string;
  iconAfterTitle?: string;
  iconAfterColor?: string;
}

/**
 * TocTopicState
 */
interface TocTopicState {}

/**
 * TocTopic
 */
export class TocTopic extends React.Component<TocTopicProps, TocTopicState> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className={this.props.className}>
        {this.props.name ? (
          <Link
            className={`toc__section-title ${
              this.props.isHidden ? "hidden" : ""
            }`}
            href={this.props.hash ? "#" + this.props.hash : null}
            disableSmoothScroll={true}
          >
            <span className="toc__text-body">{this.props.name}</span>
            {this.props.iconAfter ? (
              <span
                title={this.props.iconAfterTitle}
                className={`toc__icon icon-${this.props.iconAfter}`}
                style={{ color: this.props.iconAfterColor }}
              ></span>
            ) : null}
          </Link>
        ) : null}
        {this.props.children}
      </div>
    );
  }
}

/**
 * TocElementProps
 */
interface TocElementProps {
  isActive: boolean;
  isHidden: boolean;
  className?: string;
  modifier?: string;
  hash?: number | string;
  href?: string;
  onClick?: () => any;
  children: string;
  iconAfter?: string;
  iconAfterTitle?: string;
  iconAfterColor?: string;
  onScrollToSection?: () => any;
  scrollPadding?: number;
  disableScroll?: boolean;
}

/**
 * TocElementState
 */
interface TocElementState {}

/**
 * TocElement
 */
export class TocElement extends React.Component<
  TocElementProps,
  TocElementState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <Link
        className={`toc__item ${this.props.isActive ? "active" : ""} ${
          this.props.className ? this.props.className : ""
        } ${this.props.isHidden ? "hidden" : ""} ${
          this.props.modifier ? "toc__item--" + this.props.modifier : ""
        }`}
        onScrollToSection={this.props.onScrollToSection}
        scrollPadding={this.props.scrollPadding}
        disableScroll={this.props.disableScroll}
        href={this.props.hash ? "#" + this.props.hash : null}
        to={this.props.href}
        onClick={this.props.onClick}
        ref="element"
      >
        <span className="toc__text-body">{this.props.children}</span>
        {this.props.iconAfter ? (
          <span
            title={this.props.iconAfterTitle}
            className={`toc__icon icon-${this.props.iconAfter}`}
            style={{ color: this.props.iconAfterColor }}
          ></span>
        ) : null}
      </Link>
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
