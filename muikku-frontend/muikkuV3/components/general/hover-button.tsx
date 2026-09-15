import * as React from "react";
import Link from "./link";

import "~/sass/elements/buttons.scss";

/**
 * HoverButtonProps
 */
interface HoverButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
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
   * @returns JSX.Element
   */
  render() {
    const { modifier, icon, ...linkProps } = this.props;

    return (
      <Link
        {...linkProps}
        className={`button-pill button-pill--floating button-pill--${modifier}`}
      >
        <span className={`button-pill__icon icon-${icon}`}></span>
      </Link>
    );
  }
}
