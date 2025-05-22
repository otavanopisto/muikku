/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "~/containers/app";
import { initApp } from "~/run/init";
import { getStore } from "~/reducers/store";
//import { hot } from "react-hot-loader/root";

// Wrap the App component with hot to enable HMR
//const HotApp = hot(App);

const store = getStore();

/**
 * Renders the root application
 * @param websocketInstance websocketInstance
 */
const renderApp = (websocketInstance: any = null) => {
  const root = createRoot(document.getElementById("app"));

  root.render(<App websocket={websocketInstance} store={store} />);
};

// Initialize the app
(async () => {
  const websocketInstance = await initApp(store);
  renderApp(websocketInstance);

  // This will only work in development where HMR is available
  /* if (module.hot) {
    module.hot.accept();
  } */
})();
