import { notifications } from "./base/notifications";
import { locales } from "./base/locales";
import { credentials } from "./base/credentials";
import i18nOLD from "./base/i18nOLD";
import { combineReducers } from "redux";

export default combineReducers({
  credentials,
  i18nOLD,
  locales,
  notifications,
});
