import * as React from "react";
import Link from "./link";

import "~/sass/elements/buttons.scss";

interface HoverButtonProps {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => any;
  modifier: string;
  icon: string;
  href?: string;
}

interface HoverButtonState {}

export default class HoverButton extends React.Component<
  HoverButtonProps,
  HoverButtonState
> {
  constructor(props: HoverButtonProps) {
    super(props);
  }
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
