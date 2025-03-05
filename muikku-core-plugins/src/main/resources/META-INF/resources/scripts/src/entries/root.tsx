/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "~/containers/app";
import { initApp } from "~/run/init";
import { hot } from "react-hot-loader/root";
import { getStore } from "~/reducers/store";

// Create HotApp wrapper here instead of in App component
// this is for hot reloading to work
const HotApp = hot(App);

// Get store. Note this refrence must be passed from the root level
// So all other components uses same refrence
const store = getStore();

/**
 * Renders the root application
 * @param websocketInstance websocketInstance
 */
const renderApp = (websocketInstance: any = null) => {
  ReactDOM.render(
    <>
      <HotApp websocket={websocketInstance} store={store} />
    </>,
    document.getElementById("app")
  );
};

// Initialize the app
(async () => {
  const websocketInstance = await initApp(store);
  renderApp(websocketInstance);

  if (module.hot) {
    module.hot.accept();
  }
})();
