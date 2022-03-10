import * as React from "react";
import "~/sass/elements/credentials.scss";
import { i18nType } from "~/reducers/base/i18n";

/**
 * CredentialsHeroProps
 */
interface CredentialsHeroProps {
  modifier?: string;
  i18n: i18nType;
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
    return <div className="credentials__hero"></div>;
  }
}
