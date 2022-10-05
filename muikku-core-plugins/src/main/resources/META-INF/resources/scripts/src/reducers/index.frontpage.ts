import { easyToUse } from "./easy-to-use-functions/index";
import { notifications } from "./base/notifications";
import { locales } from "./base/locales";
import status from "./base/status";
import i18n from "./base/i18n";
import { combineReducers } from "redux";

export default combineReducers({
  i18n,
  locales,
  notifications,
  status,
  easyToUse,
});
