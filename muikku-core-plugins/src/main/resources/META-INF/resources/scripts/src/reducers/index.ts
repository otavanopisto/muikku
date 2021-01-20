import { i18nType } from './base/i18n';
import { LocaleListType } from './base/locales';
import { NotificationListType } from './base/notifications';
import { CredentialsType } from './base/credentials';
import { StatusType } from './base/status';
import { WebsocketStateType } from './util/websocket';
import { AnnouncementsType } from './announcements';
import { HOPSType } from './main-function/hops';
import { VOPSType } from './main-function/vops';
import { MessagesType } from './main-function/messages';
import { WorkspacesType } from './workspaces';
import { UsersType, UsersSelectType, StudyprogrammeTypes } from './main-function/users';
import { UserIndexType } from './user-index';
import { DiscussionType } from './discussion';
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
  studyprogrammes?: StudyprogrammeTypes,
  messages?: MessagesType,
  userIndex?: UserIndexType,
  userSelect?: UsersSelectType,
  workspaces?: WorkspacesType,
  organizationWorkspaces?: WorkspacesType,
  organizationUsers?: UsersType,
  discussion?: DiscussionType,
  guider?: GuiderType,
  records?: RecordsType,
  error?: ErrorType,
  profile?: ProfileType
}
