import * as React from "react";
import "~/sass/elements/credentials.scss";

/**
 * CredentialsHeroProps
 */
interface CredentialsHeroProps {
  modifier?: string;
}

/**
 * CredentialsHeroState
 */
interface CredentialsHeroState {
  hash: string;
}

/**
 * CredentialsHero
 */
export default class CredentialsHero extends React.Component<
  CredentialsHeroProps,
  CredentialsHeroState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: CredentialsHeroProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    return (
      <div className="credentials__hero">
        <img
          className="credentials__hero-muikku-logo"
          src="/gfx/oo-branded-site-logo.png"
          role="presentation"
        ></img>
        <span className="credentials__hero-muikku-logo-text">Muikku</span>
      </div>
    );
  }
}
