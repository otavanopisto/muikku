import { StateType } from "~/reducers";
import { loadCredentials } from "~/actions/base/credentials";
import { Action, Store } from "redux";
import Body from "../components/credentials/body";
import * as React from "react";
import "~/sass/util/base.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { HelmetProvider } from "react-helmet-async";

/**
 * UserCredentialsProps
 */
interface UserCredentialsProps extends WithTranslation {
  store: Store<StateType>;
}

/**
 * UserCredentials
 */
class UserCredentials extends React.Component<
  UserCredentialsProps,
  Record<string, unknown>
> {
  /**
   * componentDidMount
   */
  componentDidMount() {
    const param = new URLSearchParams(location.search);
    const hash: string = param.get("h");
    this.props.store.dispatch(loadCredentials(hash) as Action);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return <Body />;
  }
}

export default withTranslation(["common"])(UserCredentials);
