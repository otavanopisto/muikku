import { easyToUse } from "./easy-to-use-functions/index";
import { notifications } from "./base/notifications";
import { locales } from "./base/locales";
import status from "./base/status";
import i18nOLD from "./base/i18nOLD";
import { combineReducers } from "redux";

export default combineReducers({
  i18nOLD,
  locales,
  notifications,
  status,
  easyToUse,
});
