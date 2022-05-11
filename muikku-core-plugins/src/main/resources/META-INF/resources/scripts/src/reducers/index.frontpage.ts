import { notifications } from "./base/notifications";
import { locales } from "./base/locales";
import status from "./base/status";
import i18n from "./base/i18n";
import { combineReducers } from "redux";

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
});
