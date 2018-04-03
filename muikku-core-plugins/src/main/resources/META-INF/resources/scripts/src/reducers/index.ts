import notifications from './base/notifications';
import locales from './base/locales';
import status from './base/status';
import i18n from './base/i18n';
import title from './base/title';
import websocket from './util/websocket';

import messages from './main-function/messages';
import announcements from './main-function/announcements';
import workspaces from './main-function/workspaces';

import {combineReducers} from 'redux';

export default combineReducers({
  notifications,
  i18n,
  locales,
  status,
  websocket,
  title,
  
  announcements,
  workspaces,
  messages
});



//HAD TO PLACE THIS HERE, it should be in a separate file but there's some weird bug that doesn't find .d.ts files
import {i18nType} from './base/i18n';
import {LocaleListType} from './base/locales';
import {NotificationListType} from './base/notifications';
import {StatusType} from './base/status';

import {WebsocketStateType} from './util/websocket';

import { AnnouncementsType } from './main-function/announcements';
import { HOPSType } from './main-function/hops';
import { VOPSType } from './main-function/vops';
import {MessagesType} from './main-function/messages';
import {UserIndexType} from './main-function/user-index';
import {WorkspacesType} from './main-function/workspaces';
import { CoursesType } from './main-function/courses';
import { DiscussionType } from './main-function/discussion';

export interface StateType {
  notifications: NotificationListType,
  i18n: i18nType,
  locales: LocaleListType,
  status: StatusType,
  title: string,
  
  websocket?: WebsocketStateType,
  
  announcements?: AnnouncementsType,
  hops?: HOPSType,
  vops?: VOPSType,
  messages?: MessagesType,
  userIndex?: UserIndexType,
  workspaces?: WorkspacesType,
  courses?: CoursesType,
  discussion?: DiscussionType
}