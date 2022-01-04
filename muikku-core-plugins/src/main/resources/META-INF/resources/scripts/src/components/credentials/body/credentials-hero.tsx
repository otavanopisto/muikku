import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import "~/sass/elements/credentials.scss";
import { i18nType } from "~/reducers/base/i18n";

interface CredentialsHeroProps {
  modifier?: string;
  i18n: i18nType;
}

interface CredentialsHeroState {
  hash: string;
}

export default class CredentialsHero extends React.Component<
  CredentialsHeroProps,
  CredentialsHeroState
> {
  constructor(props: CredentialsHeroProps) {
    super(props);
  }

  render() {
    return <div className="credentials__hero"></div>;
  }
}
