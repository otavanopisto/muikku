import { easyToUse } from "./easy-to-use-functions/index";
import { notifications } from "./base/notifications";
import { locales } from "./base/locales";
import status from "./base/status";
import websocket from "./util/websocket";
import { messages } from "./main-function/messages";
import { workspaces } from "./workspaces";
import { announcements } from "./announcements";
import { userIndex } from "./user-index";
import {
  organizationUsers,
  studyprogrammes,
  userSelect,
  userGroups,
} from "./main-function/users";
import { discussion } from "~/reducers/discussion";
import { guider } from "./main-function/guider";
import { profile } from "./main-function/profile";
import { records } from "~/reducers/main-function/records";
import { summary } from "~/reducers/main-function/records/summary";
import { organizationSummary } from "~/reducers/organization/summary";
import { combineReducers } from "redux";
import { evaluations } from "./main-function/evaluation/index";
import { ceepos } from "./main-function/ceepos";
import { organizationWorkspaces } from "./workspaces/organization";
import { contacts } from "./base/contacts";
import { dependants } from "./main-function/dependants";
import { hopsNew } from "./hops/index";
import { languageProfile } from "./main-function/language-profile";
import { notebook } from "./notebook/notebook";
import { journals } from "./workspaces/journals";
import { credentials } from "./base/credentials";
import { exams } from "./workspaces/exams";
import { pedagogySupport } from "./pedagogy-support";
import { studyActivity } from "./study-activity";
import { guardian } from "./main-function/guardian";

export default combineReducers({
  announcements,
  ceepos,
  contacts,
  dependants,
  discussion,
  easyToUse,
  evaluations,
  guider,
  guardian,
  locales,
  messages,
  notifications,
  organizationSummary,
  organizationUsers,
  organizationWorkspaces,
  profile,
  records,
  status,
  studyprogrammes,
  summary,
  userGroups,
  userIndex,
  userSelect,
  websocket,
  workspaces,
  hopsNew,
  languageProfile,
  notebook,
  journals,
  credentials,
  exams,
  pedagogySupport,
  studyActivity,
});
