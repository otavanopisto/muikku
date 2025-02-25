import { StateType } from "~/reducers";
import { loadCredentials } from "~/actions/base/credentials";
import { Action, Store } from "redux";
import Body from "../components/credentials/body";
import * as React from "react";
import "~/sass/util/base.scss";

/**
 * UserCredentialsProps
 */
interface UserCredentialsProps {
  store: Store<StateType>;
}

/**
 * UserCredentials
 */
export default class UserCredentials extends React.Component<
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
