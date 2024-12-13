import { EasyToUseFunctionState } from "./easy-to-use-functions/index";
import { LocaleState } from "./base/locales";
import { NotificationState } from "./base/notifications";
import { CredentialsState } from "./base/credentials";
import { StatusType } from "./base/status";
import { WebsocketStateType } from "./util/websocket";
import { AnnouncementsState } from "./announcements";
import { HOPSState } from "./main-function/hops";
import { MessagesState } from "./main-function/messages";
import { WorkspacesState } from "./workspaces";
import {
  UsersState,
  UserGroupsState,
  UsersSelectState,
  StudyprogrammeTypes,
} from "./main-function/users";
import { DiscussionState } from "./discussion";
import { UserIndexState } from "./user-index";
import { GuiderState } from "./main-function/guider";
import { SummaryType } from "./main-function/records/summary";
import { RecordsType } from "./main-function/records";
import { ErrorType } from "./base/error";
import { ProfileState } from "./main-function/profile";
import { OrganizationSummaryType } from "./organization/summary";
import { EvaluationState } from "./main-function/evaluation/index";
import { CeeposState } from "./main-function/ceepos";
import { JournalsState } from "./workspaces/journals";
import { ContactsState } from "./base/contacts";
import { NoteBookState } from "./notebook/notebook";
import { DependantsState } from "./main-function/dependants";
import { HopsState } from "./hops";

/**
 * StateType
 */
export interface StateType {
  notifications: NotificationState;
  locales: LocaleState;
  status: StatusType;
  contacts: ContactsState;
  websocket?: WebsocketStateType;
  credentials?: CredentialsState;
  announcements?: AnnouncementsState;
  hops?: HOPSState;
  summary?: SummaryType;
  studyprogrammes?: StudyprogrammeTypes;
  messages?: MessagesState;
  dependants: DependantsState;
  userIndex?: UserIndexState;
  userSelect?: UsersSelectState;
  userGroups?: UserGroupsState;
  workspaces?: WorkspacesState;
  organizationSummary?: OrganizationSummaryType;
  organizationWorkspaces?: WorkspacesState;
  discussion?: DiscussionState;
  organizationUsers?: UsersState;
  guider?: GuiderState;
  records?: RecordsType;
  error?: ErrorType;
  profile?: ProfileState;
  evaluations?: EvaluationState;
  ceepos?: CeeposState;
  easyToUse?: EasyToUseFunctionState;
  journals?: JournalsState;
  notebook?: NoteBookState;
  hopsNew?: HopsState;
}
