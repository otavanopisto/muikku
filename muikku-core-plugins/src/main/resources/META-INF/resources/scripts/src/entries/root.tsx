/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "~/containers/app";
import { initApp } from "~/run/init";
import { getStore } from "~/reducers/store";

const store = getStore();

/**
 * Renders the root application
 * @param websocketInstance websocketInstance
 */
const renderApp = (websocketInstance: any = null) => {
  ReactDOM.render(
    <>
      <App websocket={websocketInstance} store={store} />
    </>,
    document.getElementById("app")
  );
};

// Initialize the app
(async () => {
  const websocketInstance = await initApp(store);
  renderApp(websocketInstance);
})();
