import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';
import messages from './main-function/messages';
import workspaces, { organizationWorkspaces } from './workspaces';
import announcements from './announcements';
import userIndex from './user-index';
import organizationUsers, { studyprogrammes, userSelect, userGroups } from './main-function/users';
import discussion from '~/reducers/discussion';
import guider from './main-function/guider';
import profile from './main-function/profile';
import records from '~/reducers/main-function/records';
import vops from '~/reducers/main-function/vops';
import hops from '~/reducers/main-function/hops';
import yo, { eligibilitySubjects } from '~/reducers/main-function/records/yo';
import summary from '~/reducers/main-function/records/summary';
import organizationSummary from '~/reducers/organization/summary';
import { combineReducers } from 'redux';
import evaluations from "./main-function/evaluation/index";

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
  websocket,
  title,
  userIndex,
  records,
  summary,
  yo,
  eligibilitySubjects,
  vops,
  hops,
  announcements,
  workspaces,
  messages,
  studyprogrammes,
  userSelect,
  userGroups,
  organizationWorkspaces,
  organizationUsers,
  organizationSummary,
  discussion,
  guider,
  profile,
  evaluations,
});
