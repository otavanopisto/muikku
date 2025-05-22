import * as React from "react";
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
  /**
   * Whether icon initial position is left or right side of element
   * By default is set to "left"
   */
  iconPosition?: "left" | "right";
}

/**
 * ButtonState
 */
interface ButtonState {}

/**
 * Button
 */
export default class Button extends React.Component<ButtonProps, ButtonState> {
  static defaultProps = {
    iconPosition: "left",
  };

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    const Element: any = this.props.buttonAs || Link;
    const elementProps: any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    delete elementProps["icon"];
    delete elementProps["iconPosition"];

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
        role="button"
      >
        {this.props.icon && this.props.iconPosition === "left" && (
          <span
            className={`button__icon icon-${this.props.icon} button__icon--left `}
          />
        )}
        {this.props.children}

        {this.props.icon && this.props.iconPosition === "right" && (
          <span
            className={`button__icon icon-${this.props.icon} button__icon--right`}
          />
        )}
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
   * @returns React.JSX.Element
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
        role="button"
      />
    );
  }
}

/**
 * ButtonPillProps
 */
interface ButtonPillProps extends ButtonProps {
  icon?: string;
}

/**
 * ButtonPill
 */
export class ButtonPill extends React.Component<ButtonPillProps, ButtonState> {
  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    const Element = this.props.buttonAs || Link;
    const elementProps: any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    delete elementProps["icon"];
    delete elementProps["iconPosition"];

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
        role="button"
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
   * @returns React.JSX.Element
   */
  render() {
    const Element = this.props.buttonAs || Link;
    const elementProps: any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    delete elementProps["icon"];
    delete elementProps["iconPosition"];

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
        className={`button-icon ${
          this.props.className ? this.props.className : ""
        } ${(modifiers || []).map((s) => `button-icon--${s}`).join(" ")}`}
        role="button"
      >
        {this.props.icon && <span className={`icon-${this.props.icon}`}></span>}
        {this.props.children}
      </Element>
    );
  }
}
