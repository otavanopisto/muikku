import { easyToUse } from "./easy-to-use-functions/index";
import { notifications } from "./base/notifications";
import { locales } from "./base/locales";
import status from "./base/status";
import { combineReducers } from "redux";

export default combineReducers({
  locales,
  notifications,
  status,
  easyToUse,
});
