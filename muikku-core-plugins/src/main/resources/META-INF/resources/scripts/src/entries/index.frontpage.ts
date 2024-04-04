import { Action } from "redux";
import { loadLocale } from "~/actions/base/locales";
import App from "~/containers/index.frontpage";
import reducer from "~/reducers/index.frontpage";
import runApp from "../run";

runApp(reducer, App, async (store) => {
  // For user that are not logged in, we need to load the locale
  // data
  store.dispatch(<Action>loadLocale());
  // hack to remove the session if it still exists, this might
  // happen if the user session expired and he got to the homepage
  // but the chat was still active
});
