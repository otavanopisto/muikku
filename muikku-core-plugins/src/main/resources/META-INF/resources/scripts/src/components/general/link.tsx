/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import { Redirect } from "react-router-dom";
import "~/sass/elements/link.scss";
import { scrollToSection } from "~/util/modifiers";
import { StateType } from "~/reducers";
import { connect } from "react-redux";

import { withTranslation, WithTranslation } from "react-i18next";

/**
 * LinkProps
 */
interface LinkProps
  extends React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    WithTranslation {
  disablePropagation?: boolean;
  disabled?: boolean;
  as?: string;
  href?: string;
  title?: string;
  to?: string;
  className?: string;
  openInNewTab?: string;
  onScrollToSection?: () => any;
  scrollPadding?: number;
  disableScroll?: boolean;
  disableSmoothScroll?: boolean;
}

/**
 * LinkState
 */
interface LinkState {
  active: boolean;
  redirect: boolean;
}

/**
 * Link
 */
export class Link extends React.Component<LinkProps, LinkState> {
  private touchCordX: number | null;
  private touchCordY: number | null;

  /**
   * constructor
   * @param props props
   */
  constructor(props: LinkProps) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      active: false,
      redirect: false,
    };

    this.touchCordX = null;
    this.touchCordY = null;
  }

  /**
   * onClick
   * @param e e
   */
  onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (this.props.disablePropagation) {
      e.stopPropagation();
    }

    if (this.props.disabled) {
      return;
    }

    if (!this.props.to) {
      if (this.props.href && this.props.href[0] === "#") {
        if (this.props.disableScroll) {
          window.location.hash = this.props.href;
        } else {
          scrollToSection(
            this.props.href,
            this.props.onScrollToSection,
            this.props.scrollPadding,
            this.props.disableSmoothScroll
          );
        }
      } else if (this.props.href) {
        if (this.props.openInNewTab) {
          window.open(this.props.href, this.props.openInNewTab).focus();
        } else {
          location.href = this.props.href;
        }
      }
    } else if ((window as any).USES_HISTORY_API) {
      this.setState({ redirect: true });
    } else {
      location.href = this.props.to;
    }

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  /**
   * onTouchStart
   * @param e e
   */
  onTouchStart(e: React.TouchEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (this.props.disablePropagation) {
      e.stopPropagation();
    }

    this.touchCordX = e.changedTouches[0].pageX;
    this.touchCordY = e.changedTouches[0].pageY;

    if (!this.props.disabled) {
      this.setState({ active: true });
      if (this.props.onTouchStart) {
        this.props.onTouchStart(e);
      }
    }
  }

  /**
   * onTouchMove
   * @param e e
   */
  onTouchMove(e: React.TouchEvent<HTMLAnchorElement>) {
    if (this.state.active) {
      const X = e.changedTouches[0].pageX;

      if (
        Math.abs(X - this.touchCordX) >= 5 ||
        Math.abs(X - this.touchCordY) >= 5
      ) {
        this.setState({ active: false });
      }
    }

    if (!this.props.disabled && this.props.onTouchMove) {
      this.props.onTouchMove(e);
    }
  }

  /**
   * onTouchEnd
   * @param e e
   */
  onTouchEnd(e: React.TouchEvent<any>) {
    if (!this.props.disabled) {
      this.setState({ active: false });
    }

    if (this.state.active) {
      this.onClick(e as any);
    }
    if (!this.props.disabled && this.props.onTouchEnd) {
      this.props.onTouchEnd(e);
    }
  }

  /**
   * onKeyDown
   * @param e e
   */
  onKeyDown(e: React.KeyboardEvent) {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e as any);
    } else if (e.key === "Enter") {
      this.onClick(e as any);
    }
  }

  /**
   * renderAccessibilityIndicator
   * @param target target
   * @returns target accessibility indicator
   */
  renderAccessibilityIndicatorByTarget = (target: any) => {
    switch (target) {
      case "_blank":
        return (
          <>
            <span className="visually-hidden">
              {this.props.t("wcag.externalLink")}
            </span>
            <span
              role="presentation"
              className="external-link-indicator icon-external-link"
            ></span>
          </>
        );

      default:
        return null;
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.props.to} />;
    }

    const Element: any = this.props.as || "a";
    const elementProps: LinkProps = Object.assign({}, this.props);
    delete elementProps["disablePropagation"];
    delete elementProps["disabled"];
    delete elementProps["to"];
    delete elementProps["onScrollToSection"];
    delete elementProps["openInNewTab"];
    delete elementProps["scrollPadding"];
    delete elementProps["disableScroll"];
    delete elementProps["as"];
    delete elementProps["disableSmoothScroll"];
    delete elementProps["tReady"];
    delete elementProps["t"];

    if (
      (elementProps.href == null &&
        Element === "a" &&
        typeof elementProps.tabIndex === "undefined") ||
      (typeof elementProps.tabIndex === "undefined" && Element !== "a")
    ) {
      elementProps.tabIndex = 0;
    }

    if (Element === "a") {
      return (
        <Element
          ref="element"
          {...elementProps}
          onKeyDown={this.onKeyDown}
          className={
            (this.props.className || "") +
            (this.state.active ? " active" : "") +
            (this.props.disabled ? " disabled" : "")
          }
          onClick={this.onClick}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
          onTouchMove={this.onTouchMove}
        >
          {elementProps.children}
          {this.props.target ? (
            this.renderAccessibilityIndicatorByTarget(this.props.target)
          ) : this.props.openInNewTab ? (
            <>
              <span className="visually-hidden">
                {this.props.t("wcag.externalLink")}
              </span>
              <span
                role="presentation"
                className="external-link-indicator icon-external-link"
              ></span>
            </>
          ) : null}
        </Element>
      );
    }

    return (
      <Element
        ref="element"
        {...elementProps}
        onKeyDown={this.onKeyDown}
        className={
          (this.props.className || "") +
          (this.state.active ? " active" : "") +
          (this.props.disabled ? " disabled" : "")
        }
        onClick={this.onClick}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onTouchMove={this.onTouchMove}
      />
    );
  }

  /**
   * getElement
   * @returns HTMLElement
   */
  getElement(): HTMLElement {
    return this.refs["element"] as HTMLElement;
  }
}

export default withTranslation("common", { withRef: true })(Link);
