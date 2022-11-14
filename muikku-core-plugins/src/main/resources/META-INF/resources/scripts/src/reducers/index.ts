import { EasyToUseFunctionState } from "./easy-to-use-functions/index";
import { i18nType } from "./base/i18n";
import { LocaleState } from "./base/locales";
import { NotificationState } from "./base/notifications";
import { CredentialsType } from "./base/credentials";
import { StatusType } from "./base/status";
import { WebsocketStateType } from "./util/websocket";
import { AnnouncementsType } from "./announcements";
import { HOPSType } from "./main-function/hops";
import { MessagesType } from "./main-function/messages";
import { WorkspacesType } from "./workspaces";
import {
  UsersType,
  UserGroupsType,
  UsersSelectType,
  StudyprogrammeTypes,
} from "./main-function/users";
import { UserIndexType } from "./user-index";
import { DiscussionType } from "./discussion";
import { GuiderType } from "./main-function/guider";
import { SummaryType } from "./main-function/records/summary";
import {
  YOType,
  SubjectEligibilitySubjectsType,
} from "./main-function/records/yo";
import { RecordsType } from "./main-function/records";
import { ErrorType } from "./base/error";
import { ProfileType } from "./main-function/profile";
import { OrganizationSummaryType } from "./organization/summary";
import { EvaluationState } from "./main-function/evaluation/index";
import { CeeposState } from "./main-function/ceepos";
import { Calendar } from "./main-function/calendar";
import { JournalsState } from "./workspaces/journals";

/**
 * StateType
 */
export interface StateType {
  notifications: NotificationState;
  i18n: i18nType;
  locales: LocaleState;
  status: StatusType;
  title: string;
  websocket?: WebsocketStateType;
  yo?: YOType;
  eligibilitySubjects?: SubjectEligibilitySubjectsType;
  credentials?: CredentialsType;
  announcements?: AnnouncementsType;
  hops?: HOPSType;
  summary?: SummaryType;
  studyprogrammes?: StudyprogrammeTypes;
  messages?: MessagesType;
  userIndex?: UserIndexType;
  userSelect?: UsersSelectType;
  userGroups?: UserGroupsType;
  workspaces?: WorkspacesType;
  organizationSummary?: OrganizationSummaryType;
  organizationWorkspaces?: WorkspacesType;
  organizationUsers?: UsersType;
  discussion?: DiscussionType;
  guider?: GuiderType;
  records?: RecordsType;
  error?: ErrorType;
  profile?: ProfileType;
  evaluations?: EvaluationState;
  ceepos?: CeeposState;
  calendar?: Calendar;
  easyToUse?: EasyToUseFunctionState;
  journals?: JournalsState;
}
