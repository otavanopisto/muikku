import App from "~/containers/main-function";
import reducer from "~/reducers/main-function";
import runApp from "../run";
import { loadLocale } from "~/actions/base/locales";
import mainFunctionDefault from "~/util/base-main-function";
import tabOrMouse from "~/util/tab-or-mouse";
import { Action } from "redux";

runApp(reducer, App, async (store) => {
  // This is needed, otherwise the locales will default to "fi" on refresh even if they are set to "en"
  store.dispatch(<Action>loadLocale());

  tabOrMouse();

  const websocket = await mainFunctionDefault(store);

  return { websocket };
});
