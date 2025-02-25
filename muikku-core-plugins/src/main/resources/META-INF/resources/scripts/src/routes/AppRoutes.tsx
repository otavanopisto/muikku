import * as React from "react";
import "~/sass/util/base.scss";
import { Route, Switch } from "react-router-dom";
import { Store } from "redux";
import { StateType } from "~/reducers";
import Websocket from "~/util/websocket";
import MainFunction from "~/containers/main-function";
import Workspace from "~/containers/workspace";

/**
 * AppRoutesProps
 */
interface AppRoutesProps {
  store: Store<StateType>;
  websocket?: Websocket | null;
}

/**
 * AppRoutes
 * @param props props
 * @returns JSX.Element
 */
export default function AppRoutes(props: AppRoutesProps) {
  const { websocket, store } = props;

  return (
    <Switch>
      {/* Workspace Routes */}
      <Route
        path="/workspace"
        render={(props) => (
          <Workspace {...props} store={store} websocket={websocket} />
        )}
      />

      {/* Main Function Routes */}
      <Route
        path="/"
        render={(props) => (
          <MainFunction {...props} store={store} websocket={websocket} />
        )}
      />

      {/* Other routes... */}
      {/* <Route path="*" render={() => <div>404</div>}></Route> */}
    </Switch>
  );
}
