import * as React from "react";
import Link from "./link";

import "~/sass/elements/buttons.scss";

/**
 * HoverButtonProps
 */
interface HoverButtonProps {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => any;
  modifier: string;
  icon: string;
  href?: string;
}

/**
 * HoverButtonState
 */
interface HoverButtonState {}

/**
 * HoverButton
 */
export default class HoverButton extends React.Component<
  HoverButtonProps,
  HoverButtonState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: HoverButtonProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    return (
      <Link
        href={this.props.href}
        onClick={this.props.onClick}
        className={`button-pill button-pill--floating button-pill--${this.props.modifier}`}
      >
        <span className={`button-pill__icon icon-${this.props.icon}`}></span>
      </Link>
    );
  }
}
