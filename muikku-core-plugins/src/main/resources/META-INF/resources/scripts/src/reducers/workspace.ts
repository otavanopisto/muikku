import { easyToUse } from "./easy-to-use-functions/index";
import { notifications } from "./base/notifications";
import { locales } from "./base/locales";
import status from "./base/status";
import i18n from "./base/i18n";
import { title } from "./base/title";
import websocket from "./util/websocket";

import { workspaces } from "./workspaces";
import { announcements } from "./announcements";
import { discussion } from "./discussion";
import { userIndex } from "./user-index";
import { evaluations } from "../reducers/main-function/evaluation";
import { profile } from "./main-function/profile";

import { combineReducers } from "redux";
import { journals } from "./workspaces/journals";
import { contacts } from "./base/contacts";

export default combineReducers({
  announcements,
  contacts,
  discussion,
  easyToUse,
  evaluations,
  i18n,
  journals,
  locales,
  notifications,
  profile,
  status,
  title,
  userIndex,
  websocket,
  workspaces,
});
