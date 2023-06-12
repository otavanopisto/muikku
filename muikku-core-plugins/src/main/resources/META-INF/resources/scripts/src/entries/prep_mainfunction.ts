import App from "~/containers/main-function";
import reducer from "~/reducers/main-function";
import { prepareApp } from "~/run";

import mainFunctionDefault from "~/util/base-main-function";
import tabOrMouse from "~/util/tab-or-mouse";

export function renderMainFunction() {
  return prepareApp(reducer, App, async (store) => {
    tabOrMouse();

    const websocket = await mainFunctionDefault(store);
  
    return { websocket };
  });  
}