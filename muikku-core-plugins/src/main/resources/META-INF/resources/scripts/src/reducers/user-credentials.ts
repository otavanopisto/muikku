import notifications from "./base/notifications";
import locales from "./base/locales";
import credentials from "./base/credentials";
import i18n from "./base/i18n";
import { combineReducers } from "redux";

export default combineReducers({
  credentials,
  notifications,
  i18n,
  locales
});
