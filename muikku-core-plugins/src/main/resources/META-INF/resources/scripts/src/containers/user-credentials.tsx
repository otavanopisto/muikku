import Notifications from "../components/base/notifications";
import { StateType } from "~/reducers";
import { Store } from "react-redux";
import { loadCredentials } from "~/actions/base/credentials";
import { Action } from "redux";
import Body from "../components/credentials/body";
import * as React from "react";
import "~/sass/util/base.scss";

interface UserCredentialsProps {
  store: Store<StateType>;
}

export default class UserCredentials extends React.Component<
  UserCredentialsProps,
  {}
> {
  componentDidMount() {
    let param = new URLSearchParams(location.search);
    let hash: string = param.get("h");
    this.props.store.dispatch(loadCredentials(hash) as Action);
  }

  render() {
    return (
      <div id="root">
        <Notifications></Notifications>
        <Body></Body>
      </div>
    );
  }
}
