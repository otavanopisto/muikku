import { easyToUse } from "./easy-to-use-functions/index";
import { notifications } from "./base/notifications";
import { locales } from "./base/locales";
import status from "./base/status";
import websocket from "./util/websocket";
import { workspaces } from "./workspaces";
import { announcements } from "./announcements";
import { discussion } from "./discussion";
import { userIndex } from "./user-index";
import { evaluations } from "../reducers/main-function/evaluation";
import { profile } from "./main-function/profile";
import { notebook } from "./notebook/notebook";
import { combineReducers } from "redux";
import { journals } from "./workspaces/journals";
import { contacts } from "./base/contacts";

export default combineReducers({
  announcements,
  contacts,
  discussion,
  easyToUse,
  evaluations,
  journals,
  locales,
  notebook,
  notifications,
  profile,
  status,
  userIndex,
  websocket,
  workspaces,
});
