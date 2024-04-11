import App from "~/containers/main-function";
import reducer from "~/reducers/main-function";
import runApp from "../run";
import tabOrMouse from "~/util/tab-or-mouse";

import mainFunctionDefault from "~/util/base-main-function";

runApp(reducer, App, async (store) => {
  tabOrMouse();

  const websocket = await mainFunctionDefault(store);

  return { websocket };
});
