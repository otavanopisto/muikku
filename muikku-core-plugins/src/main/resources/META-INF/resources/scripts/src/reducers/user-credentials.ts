import { notifications } from "./base/notifications";
import { locales } from "./base/locales";
import { credentials } from "./base/credentials";
import { combineReducers } from "redux";

export default combineReducers({
  credentials,
  locales,
  notifications,
});
