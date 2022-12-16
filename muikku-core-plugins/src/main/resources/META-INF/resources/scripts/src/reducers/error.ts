import { locales } from "./base/locales";
import status from "./base/status";
import i18nOLD from "./base/i18nOLD";
import { title } from "./base/title";
import { messages } from "./main-function/messages";
import { error } from "~/reducers/base/error";

import { combineReducers } from "redux";

export default combineReducers({
  error,
  i18nOLD,
  locales,
  messages,
  status,
  title,
});
