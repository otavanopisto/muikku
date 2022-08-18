import * as React from "react";
import { isThisTypeNode } from "typescript";

import "~/sass/elements/buttons.scss";
import Link from "./link";

const REACTIVATION_DELAY = 400;

let reactivationDelayLastCalled = 0;

/**
 * reactivationDelayWrapper
 * @param onClickFn onClickFn
 * @param args args
 */
function reactivationDelayWrapper(
  onClickFn: (...args: any[]) => any,
  ...args: any[]
) {
  const currentCall = new Date().getTime();
  if (currentCall - reactivationDelayLastCalled >= REACTIVATION_DELAY) {
    onClickFn(...args);
  }
  reactivationDelayLastCalled = currentCall;
}

/**
 * ButtonProps
 */
interface ButtonProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  buttonAs?: any;
  buttonModifiers?: string | Array<string>;
  className?: string;
  title?: string;
  disabled?: boolean;
  disablePropagation?: boolean;
  as?: string;
  href?: string;
  to?: string;
  openInNewTab?: string;
  icon?: string;
}

/**
 * ButtonState
 */
interface ButtonState {}

/**
 * Button
 */
export default class Button extends React.Component<ButtonProps, ButtonState> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const Element: any = this.props.buttonAs || Link;
    const elementProps: any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    delete elementProps["icon"];

    const modifiers: Array<string> =
      typeof this.props.buttonModifiers === "string"
        ? [this.props.buttonModifiers]
        : this.props.buttonModifiers;

    return (
      <Element
        tabIndex={!this.props.disabled ? 0 : null}
        {...elementProps}
        onClick={
          this.props.onClick
            ? reactivationDelayWrapper.bind(null, this.props.onClick)
            : null
        }
        className={`button ${
          this.props.icon ? "button--button-has-icon" : ""
        } ${this.props.className ? this.props.className : ""} ${(
          modifiers || []
        )
          .map((s) => `button--${s}`)
          .join(" ")}`}
      >
        {this.props.icon && (
          <span className={`button__icon icon-${this.props.icon}`}></span>
        )}
        {this.props.children}
      </Element>
    );
  }
}

/**
 * ButtonSocial
 */
export class ButtonSocial extends React.Component<ButtonProps, ButtonState> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const Element = this.props.buttonAs || Link;
    const elementProps: any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];

    const modifiers: Array<string> =
      typeof this.props.buttonModifiers === "string"
        ? [this.props.buttonModifiers]
        : this.props.buttonModifiers;

    return (
      <Element
        tabIndex={!this.props.disabled ? 0 : null}
        {...elementProps}
        onClick={
          this.props.onClick
            ? reactivationDelayWrapper.bind(null, this.props.onClick)
            : null
        }
        className={`button-social ${
          this.props.className ? this.props.className : ""
        } ${(modifiers || []).map((s) => `button-social--${s}`).join(" ")}`}
      />
    );
  }
}

/**
 * ButtonPillProps
 */
interface ButtonPillProps extends ButtonProps {
  icon?: string;
  openInNewTab?: string;
}

/**
 * ButtonPill
 */
export class ButtonPill extends React.Component<ButtonPillProps, ButtonState> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const Element = this.props.buttonAs || Link;
    const elementProps: any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    delete elementProps["icon"];

    const modifiers: Array<string> =
      typeof this.props.buttonModifiers === "string"
        ? [this.props.buttonModifiers]
        : this.props.buttonModifiers;

    return (
      <Element
        tabIndex={!this.props.disabled ? 0 : null}
        {...elementProps}
        onClick={
          this.props.onClick
            ? reactivationDelayWrapper.bind(null, this.props.onClick)
            : null
        }
        className={`button-pill ${(modifiers || [])
          .map((s) => `button-pill--${s}`)
          .join(" ")}`}
      >
        {this.props.icon && (
          <span className={`button-pill__icon icon-${this.props.icon}`}></span>
        )}
        {this.props.children}
      </Element>
    );
  }
}

/**
 * IconButtonProps
 */
interface IconButtonProps extends ButtonProps {
  icon: string;
}

/**
 * IconButton
 */
export class IconButton extends React.Component<IconButtonProps, ButtonState> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const Element = this.props.buttonAs || Link;
    const elementProps: any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    delete elementProps["icon"];

    const modifiers: Array<string> =
      typeof this.props.buttonModifiers === "string"
        ? [this.props.buttonModifiers]
        : this.props.buttonModifiers;

    return (
      <Element
        tabIndex={!this.props.disabled ? 0 : null}
        {...elementProps}
        onClick={
          this.props.onClick
            ? reactivationDelayWrapper.bind(null, this.props.onClick)
            : null
        }
        className={`button-icon ${(modifiers || [])
          .map((s) => `button-icon--${s}`)
          .join(" ")}`}
      >
        {this.props.icon && <span className={`icon-${this.props.icon}`}></span>}
        {this.props.children}
      </Element>
    );
  }
}
