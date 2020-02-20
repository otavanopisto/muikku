import {i18nType} from './base/i18n';
import {LocaleListType} from './base/locales';
import {NotificationListType} from './base/notifications';
import {CredentialsType} from './base/credentials';
import {StatusType} from './base/status';
import {WebsocketStateType} from './util/websocket';
import { AnnouncementsType } from './main-function/announcements';
import { HOPSType } from './main-function/hops';
import { VOPSType } from './main-function/vops';
import {MessagesType} from './main-function/messages';
import {UserIndexType} from './main-function/user-index';
import {UsersType} from './main-function/users';
import {WorkspacesType} from './workspaces';
import { CoursesType } from './main-function/courses';
import { DiscussionType } from './main-function/discussion';
import { GuiderType } from './main-function/guider';
import { SummaryType } from './main-function/records/summary';
import { YOType, SubjectEligibilitySubjectsType } from './main-function/records/yo';
import { RecordsType } from './main-function/records';
import { ErrorType } from './base/error';
import { ProfileType } from './main-function/profile';



export interface StateType {
  notifications: NotificationListType,
  i18n: i18nType,
  locales: LocaleListType,
  status: StatusType,
  title: string,
  websocket?: WebsocketStateType,
  yo?: YOType,
  eligibilitySubjects?: SubjectEligibilitySubjectsType,
  credentials?: CredentialsType,
  announcements?: AnnouncementsType,
  hops?: HOPSType,
  vops?: VOPSType,
  summary?: SummaryType,
  messages?: MessagesType,
  users: UsersType;
  userIndex?: UserIndexType,
  workspaces?: WorkspacesType,
  courses?: CoursesType,
  discussion?: DiscussionType,
  guider?: GuiderType,
  records?: RecordsType,
  error?: ErrorType,
  profile?: ProfileType
}
