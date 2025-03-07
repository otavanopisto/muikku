import * as React from "react";
import "~/sass/util/base.scss";
import { Route, Switch } from "react-router-dom";
import { Store } from "redux";
import { StateType } from "~/reducers";
import Websocket from "~/util/websocket";

// Convert regular imports to lazy imports
const MainFunction = React.lazy(() => import("~/containers/main-function"));
const Workspace = React.lazy(() => import("~/containers/workspace"));

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
    // Wrap Switch with Suspense and provide a fallback UI
    <React.Suspense fallback={<></>}>
      <Switch>
        {/* Workspace Routes */}
        <Route
          path="/workspace"
          render={() => <Workspace store={store} websocket={websocket} />}
        />

        {/* Main Function Routes */}
        <Route
          path="/"
          render={() => <MainFunction store={store} websocket={websocket} />}
        />
      </Switch>
    </React.Suspense>
  );
}
