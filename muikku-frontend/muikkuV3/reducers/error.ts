import { locales } from "./base/locales";
import status from "./base/status";
import { messages } from "./main-function/messages";
import { error } from "~/reducers/base/error";

import { combineReducers } from "redux";

export default combineReducers({
  error,
  locales,
  messages,
  status,
});
