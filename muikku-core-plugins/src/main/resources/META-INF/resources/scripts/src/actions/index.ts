/* eslint-disable @typescript-eslint/no-explicit-any */
import { UPDATE_CURRENT_GUIDER_STUDENT_HOPS_PHASE } from "./main-function/guider/index";
/**
 * SpecificActionType
 */
export interface SpecificActionType<ActionType, PayloadType> {
  type: ActionType;
  payload: PayloadType | null;
}

type AsyncDeferredAction = (
  dispatch: (arg: AnyActionType) => any,
  getState: () => any
) => Promise<void>;
type DeferredAction = (
  dispatch: (arg: AnyActionType) => any,
  getState: () => any
) => any;

import { LOCALE_SET, LOCALE_UPDATE } from "./base/locales";
import {
  ADD_NOTIFICATION,
  CLOSE_NOTIFICATION_DIALOG,
  HIDE_NOTIFICATION,
  OPEN_NOTIFICATION_DIALOG,
} from "./base/notifications";
import {
  LOGOUT,
  UPDATE_STATUS_WORKSPACEID,
  UPDATE_STATUS_PROFILE,
  UPDATE_STATUS_HAS_IMAGE,
  UPDATE_STATUS,
  UPDATE_STATUS_WORKSPACE_PERMISSIONS,
  UPDATE_STATUS_CHAT_SETTINGS,
} from "./base/status";
import {
  SET_CURRENT_MESSAGE_THREAD,
  UPDATE_MESSAGES_STATE,
  UPDATE_MESSAGES_ALL_PROPERTIES,
  UPDATE_MESSAGE_THREAD_ADD_LABEL,
  UPDATE_MESSAGE_THREAD_DROP_LABEL,
  PUSH_ONE_MESSAGE_THREAD_FIRST,
  LOCK_TOOLBAR,
  UNLOCK_TOOLBAR,
  UPDATE_ONE_MESSAGE_THREAD,
  DELETE_MESSAGE_THREAD,
  UPDATE_MESSAGES_SIGNATURE,
  UPDATE_SELECTED_MESSAGE_THREADS,
  ADD_TO_MESSAGES_SELECTED_THREADS,
  REMOVE_FROM_MESSAGES_SELECTED_THREADS,
  PUSH_MESSAGE_LAST_IN_CURRENT_THREAD,
  TOGGLE_ALL_MESSAGE_ITEMS,
} from "./main-function/messages";
import {
  UPDATE_MESSAGES_NAVIGATION_LABELS,
  ADD_MESSAGES_NAVIGATION_LABEL,
  UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS,
  UPDATE_MESSAGES_NAVIGATION_LABEL,
  DELETE_MESSAGE_THREADS_NAVIGATION_LABEL,
  REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS,
} from "./main-function/messages";
import {
  UPDATE_UNREAD_MESSAGE_THREADS_COUNT,
  UPDATE_MESSAGE_THREADS,
} from "./main-function/messages";

// Do not delete this, organization stuff

import {
  UPDATE_STUDENT_USERS,
  UPDATE_STAFF_USERS,
  UPDATE_USER_GROUPS,
  UPDATE_STUDENT_SELECTOR,
  UPDATE_STAFF_SELECTOR,
  UPDATE_GROUP_SELECTOR,
  CLEAR_USER_SELECTOR,
  UPDATE_USERS_STATE,
  UPDATE_STUDYPROGRAMME_TYPES,
  UPDATE_STUDYPROGRAMME_STATUS_TYPE,
  UPDATE_CURRENT_USER_GROUP,
  UPDATE_USER_GROUPS_STATE,
  UPDATE_HAS_MORE_USERGROUPS,
  SET_CURRENT_PAYLOAD,
  LOAD_MORE_USER_GROUPS,
} from "./main-function/users";

import {
  UPDATE_SUMMARY_STATUS,
  LOAD_WORKSPACE_SUMMARY,
  LOAD_ORGANIZATION_CONTACTS,
  LOAD_STUDENT_SUMMARY,
} from "./organization/summary";

import {
  UPDATE_ANNOUNCEMENTS,
  UPDATE_ANNOUNCEMENTS_STATE,
  UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES,
  UPDATE_SELECTED_ANNOUNCEMENTS,
  ADD_TO_ANNOUNCEMENTS_SELECTED,
  REMOVE_FROM_ANNOUNCEMENTS_SELECTED,
  UPDATE_ONE_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  SET_CURRENT_ANNOUNCEMENT,
} from "./announcements";
import {
  UPDATE_DISCUSSION_AREAS,
  PUSH_DISCUSSION_AREA_LAST,
  UPDATE_DISCUSSION_AREA,
  DELETE_DISCUSSION_AREA,
} from "./discussion";
import {
  UPDATE_SHOW_ONLY_SUBSCRIBED_THREADS,
  UPDATE_SUBSCRIBED_THREAD_LIST,
  UPDATE_SUBSCRIBED_AREA_LIST,
  UPDATE_DISCUSSION_THREADS_STATE,
  UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES,
  PUSH_DISCUSSION_THREAD_FIRST,
  UPDATE_DISCUSSION_CURRENT_THREAD_STATE,
  SET_CURRENT_DISCUSSION_THREAD,
  SET_TOTAL_DISCUSSION_PAGES,
  SET_TOTAL_DISCUSSION_THREAD_PAGES,
  UPDATE_DISCUSSION_THREAD,
  UPDATE_DISCUSSION_THREAD_REPLY,
  SET_DISCUSSION_WORKSPACE_ID,
} from "./discussion";
import {
  SET_USER_GROUP_INDEX,
  SET_USER_BY_SCHOOL_DATA_INDEX,
} from "./user-index";
import {
  UPDATE_USER_WORKSPACES,
  UPDATE_LAST_WORKSPACES,
  SET_CURRENT_WORKSPACE,
  UPDATE_WORKSPACE_ASSESSMENT_STATE,
  UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS,
  UPDATE_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES,
  UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES,
  UPDATE_WORKSPACES_STATE,
  UPDATE_WORKSPACES_ALL_PROPS,
  UPDATE_WORKSPACES_ACTIVE_FILTERS,
  UPDATE_WORKSPACE,
  UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER,
  UPDATE_WORKSPACES_EDIT_MODE_STATE,
  UPDATE_CURRENT_WORKSPACE_ACTIVITY,
  UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS,
  UPDATE_AVAILABLE_CURRICULUMS,
  UPDATE_MATERIALS_ARE_DISABLED,
  UPDATE_WORKSPACE_IS_BEING_EVALUATED,
} from "./workspaces";

import {
  UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS,
  UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES,
  UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS,
  UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL,
  UPDATE_GUIDER_AVAILABLE_FILTER_LABEL,
  UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS,
  DELETE_GUIDER_AVAILABLE_FILTER_LABEL,
  DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS,
  UPDATE_GUIDER_ACTIVE_FILTERS,
  UPDATE_GUIDER_ALL_PROPS,
  UPDATE_GUIDER_STATE,
  ADD_TO_GUIDER_SELECTED_STUDENTS,
  REMOVE_FROM_GUIDER_SELECTED_STUDENTS,
  SET_CURRENT_GUIDER_STUDENT,
  SET_CURRENT_GUIDER_STUDENT_PROP,
  UPDATE_CURRENT_GUIDER_STUDENT_STATE,
  ADD_GUIDER_LABEL_TO_USER,
  REMOVE_GUIDER_LABEL_FROM_USER,
  ADD_FILE_TO_CURRENT_STUDENT,
  REMOVE_FILE_FROM_CURRENT_STUDENT,
  UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS,
  UPDATE_GUIDER_INSERT_PURCHASE_ORDER,
  DELETE_GUIDER_PURCHASE_ORDER,
  UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER,
  TOGGLE_ALL_STUDENTS,
  DELETE_CONTACT_EVENT,
  DELETE_CONTACT_EVENT_COMMENT,
} from "./main-function/guider";
import {
  UPDATE_RECORDS_ALL_STUDENT_USERS_DATA,
  UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS,
  UPDATE_RECORDS_LOCATION,
  UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS,
  UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE,
  UPDATE_RECORDS_SET_FILES,
} from "./main-function/records";

import {
  UPDATE_STUDIES_SUMMARY,
  UPDATE_STUDIES_SUMMARY_STATUS,
} from "./main-function/records/summary";
import {
  UPDATE_STUDIES_STATISTICS,
  UPDATE_STUDIES_STATISTICS_STATUS,
} from "./main-function/records/statistics";
import { LOAD_CREDENTIALS, CREDENTIALS_STATE } from "./base/credentials";
import { UPDATE_ERROR } from "./base/error";
import {
  EVALUATION_SORT_FUNCTION_CHANGE,
  EVALUATION_SELECTED_WORKSPACE_CHANGE,
  EVALUATION_SEARCH_CHANGE,
  EVALUATION_FILTERS_CHANGE,
  EVALUATION_WORKSPACES_LOAD,
  EVALUATION_STATE_UPDATE,
  EVALUATION_OPENED_ASSIGNMENT_UPDATE,
  EVALUATION_NEEDS_RELOAD_REQUESTS_UPDATE,
  EVALUATION_GRADE_SYSTEM_LOAD,
  EVALUATION_BILLED_PRICE_LOAD,
  EVALUATION_UNIMPORTANT_ASSESSMENTS_LOAD,
  EVALUATION_IMPORTANT_ASSESSMENTS_LOAD,
  EVALUATION_IMPORTANCE_UPDATE,
  EVALUATION_COMPOSITE_REPLIES_STATE_UPDATE,
  EVALUATION_COMPOSITE_REPLIES_LOAD,
  EVALUATION_BASE_PRICE_STATE_UPDATE,
  EVALUATION_BASE_PRICE_LOAD,
  EVALUATION_REQUESTS_STATE_UPDATE,
  EVALUATION_REQUESTS_LOAD,
  EVALUATION_ASSESSMENT_UPDATE,
  EVALUATION_ASSESSMENT_EVENTS_STATE_UPDATE,
  EVALUATION_ASSESSMENT_EVENTS_LOAD,
  EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE,
  EVALUATION_ASSESSMENT_ASSIGNMENTS_LOAD,
  EVALUATION_JOURNAL_STATE_UPDATE,
  EVALUATION_JOURNAL_EVENTS_LOAD,
  EVALUATION_JOURNAL_COMMENTS_UPDATE,
  EVALUATION_JOURNAL_COMMENTS_LOAD,
  EVALUATION_JOURNAL_COMMENTS_INITIALIZED,
  EVALUATION_JOURNAL_COMMENTS_DELETE,
  EVALUATION_JOURNAL_COMMENTS_CREATE,
} from "./main-function/evaluation/evaluationActions";
import {
  SET_PROFILE_USER_PROPERTY,
  SET_PROFILE_USERNAME,
  SET_PROFILE_ADDRESSES,
  SET_PROFILE_STUDENT,
  SET_PROFILE_CHAT_SETTINGS,
  SET_PROFILE_LOCATION,
  SET_WORKLIST,
  SET_WORKLIST_TEMPLATES,
  SET_PURCHASE_HISTORY,
  SET_PROFILE_AUTHORIZATIONS,
} from "./main-function/profile";
import {
  WEBSOCKET_EVENT,
  INITIALIZE_WEBSOCKET,
} from "~/reducers/util/websocket";
import {
  UPDATE_CEEPOS_PURCHASE,
  UPDATE_CEEPOS_STATE,
  UPDATE_CEEPOS_PAY_STATUS,
} from "./main-function/ceepos";

// Guidance events are no longer being
import { SET_ACTIVE_EASY_TO_USE_TOOL } from "./easy-to-use-functions";
import { UPDATE_CURRENT_WORKSPACE_INTERIM_EVALUATION_REQUESTS } from "./workspaces/index";
import {
  EVALUATION_JOURNAL_FEEDBACK_CREATE_OR_UPDATE,
  EVALUATION_JOURNAL_FEEDBACK_DELETE,
} from "./main-function/evaluation/evaluationActions";
import {
  EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE,
  EVALUATION_JOURNAL_FEEDBACK_LOAD,
} from "./main-function/evaluation/evaluationActions";
import {
  DEPENDANTS_UPDATE,
  DEPENDANTS_STATUS_UPDATE,
  DEPENDANT_WORKSPACES_UPDATE,
  DEPENDANT_WORKSPACES_STATUS_UPDATE,
} from "./main-function/dependants";
import {
  UPDATE_WORKSPACES_SET_CURRENT_MATERIALS,
  UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID,
  UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES,
  UPDATE_MATERIAL_CONTENT_NODE,
  DELETE_MATERIAL_CONTENT_NODE,
  INSERT_MATERIAL_CONTENT_NODE,
  UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES,
  UPDATE_WORKSPACES_SET_CURRENT_HELP,
  MATERIAL_UPDATE_SHOW_EXTRA_TOOLS,
} from "./workspaces/material";
import {
  UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES,
  UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES,
  UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS,
  UPDATE_ORGANIZATION_WORKSPACES_ALL_PROPS,
  UPDATE_ORGANIZATION_WORKSPACES_ACTIVE_FILTERS,
  UPDATE_ORGANIZATION_WORKSPACES_STATE,
  UPDATE_ORGANIZATION_SELECTED_WORKSPACE,
  UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STAFF_SELECT_STATE,
  UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STUDENT_SELECT_STATE,
  UPDATE_ORGANIZATION_TEMPLATES,
  UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS,
} from "./workspaces/organization";
import {
  JOURNALS_COMMENTS_CREATE,
  JOURNALS_COMMENTS_DELETE,
  JOURNALS_COMMENTS_UPDATE,
  JOURNALS_CREATE,
  JOURNALS_DELETE,
  JOURNALS_SET_CURRENT,
  JOURNALS_UPDATE,
  JOURNALS_LOAD,
  JOURNALS_COMMENTS_LOAD,
  JOURNALS_FILTTERS_CHANGE,
  JOURNALS_FEEDBACK_LOAD,
} from "./workspaces/journals";

import {
  CONTACT_LOAD_GROUP,
  CONTACT_UPDATE_GROUP_STATE,
} from "./base/contacts";
import {
  NOTEBOOK_CREATE_ENTRY,
  NOTEBOOK_DELETE_ENTRY,
  NOTEBOOK_EDIT_ENTRY,
  NOTEBOOK_LOAD_ENTRIES,
  NOTEBOOK_UPDATE_ENTRIES,
  NOTEBOOK_SET_CUT_CONTENT,
  NOTEBOOK_TOGGLE_EDITOR,
  NOTEBOOK_UPDATE_STATE,
  NOTEBOOK_UPDATE_SELECTED_POSITION,
  NOTEBOOK_LOAD_DEFAULT_POSITION,
  NOTEBOOK_UPDATE_DEFAULT_POSITION,
} from "./notebook/notebook";
import {
  HOPS_MATRICULATION_UPDATE_STATUS,
  HOPS_MATRICULATION_UPDATE_EXAMS,
  HOPS_MATRICULATION_UPDATE_SUBJECTS,
  HOPS_MATRICULATION_UPDATE_ELIGIBILITY,
  HOPS_MATRICULATION_UPDATE_EXAM_STATE,
  HOPS_MATRICULATION_UPDATE_EXAM_HISTORY_STATUS,
  HOPS_MATRICULATION_UPDATE_EXAM_HISTORY,
  HOPS_MATRICULATION_UPDATE_PLAN,
  HOPS_MATRICULATION_UPDATE_SUBJECT_ELIGIBILITY,
  HOPS_MATRICULATION_UPDATE_RESULTS,
  HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER,
  HOPS_UPDATE_CURRENTSTUDENT_STUDYPROGRAM,
  HOPS_RESET_DATA,
  HOPS_MATRICULATION_UPDATE_PAST_EXAMS,
  HOPS_FORM_UPDATE,
  HOPS_STUDENT_INFO_UPDATE,
  HOPS_FORM_HISTORY_UPDATE,
  HOPS_FORM_HISTORY_ENTRY_UPDATE,
  HOPS_FORM_UPDATE_CAN_LOAD_MORE_HISTORY,
  HOPS_CHANGE_MODE,
  HOPS_UPDATE_EDITING,
  HOPS_UPDATE_LOCKED,
  HOPS_CANCEL_EDITING,
  HOPS_STUDYPLAN_UPDATE_PLANNED_COURSES,
  HOPS_STUDYPLAN_UPDATE_STATUS,
  HOPS_UPDATE_EDITING_STUDYPLAN,
  HOPS_UPDATE_INITIALIZE_STATUS,
  HOPS_CLEAR_SELECTED_COURSE,
  HOPS_SET_SELECTED_COURSE,
  HOPS_UPDATE_CURRICULUM_CONFIG,
} from "./main-function/hops/";

export type ActionType =
  | SET_CURRENT_MESSAGE_THREAD
  | UPDATE_MESSAGES_STATE
  | UPDATE_MESSAGES_ALL_PROPERTIES
  | UPDATE_MESSAGE_THREAD_ADD_LABEL
  | UPDATE_MESSAGE_THREAD_DROP_LABEL
  | PUSH_ONE_MESSAGE_THREAD_FIRST
  | LOCK_TOOLBAR
  | UNLOCK_TOOLBAR
  | UPDATE_ONE_MESSAGE_THREAD
  | DELETE_MESSAGE_THREAD
  | UPDATE_MESSAGES_SIGNATURE
  | LOCALE_SET
  | LOCALE_UPDATE
  | ADD_NOTIFICATION
  | HIDE_NOTIFICATION
  | LOGOUT
  | UPDATE_SELECTED_MESSAGE_THREADS
  | ADD_TO_MESSAGES_SELECTED_THREADS
  | REMOVE_FROM_MESSAGES_SELECTED_THREADS
  | UPDATE_UNREAD_MESSAGE_THREADS_COUNT
  | UPDATE_LAST_WORKSPACES
  | SET_CURRENT_WORKSPACE
  | UPDATE_USER_WORKSPACES
  | UPDATE_MESSAGE_THREADS
  | UPDATE_ANNOUNCEMENTS
  | UPDATE_MESSAGES_NAVIGATION_LABELS
  | ADD_MESSAGES_NAVIGATION_LABEL
  | UPDATE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS
  | UPDATE_MESSAGES_NAVIGATION_LABEL
  | DELETE_MESSAGE_THREADS_NAVIGATION_LABEL
  | REMOVE_ONE_LABEL_FROM_ALL_MESSAGE_THREADS
  | WEBSOCKET_EVENT
  | INITIALIZE_WEBSOCKET
  | UPDATE_ANNOUNCEMENTS_STATE
  | UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES
  | UPDATE_SELECTED_ANNOUNCEMENTS
  | ADD_TO_ANNOUNCEMENTS_SELECTED
  | REMOVE_FROM_ANNOUNCEMENTS_SELECTED
  | UPDATE_ONE_ANNOUNCEMENT
  | SET_CURRENT_ANNOUNCEMENT
  | DELETE_ANNOUNCEMENT
  | UPDATE_DISCUSSION_AREAS
  | UPDATE_SUBSCRIBED_THREAD_LIST
  | UPDATE_SUBSCRIBED_AREA_LIST
  | UPDATE_DISCUSSION_THREADS_STATE
  | UPDATE_SHOW_ONLY_SUBSCRIBED_THREADS
  | UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES
  | PUSH_DISCUSSION_AREA_LAST
  | UPDATE_DISCUSSION_AREA
  | DELETE_DISCUSSION_AREA
  | PUSH_DISCUSSION_THREAD_FIRST
  | UPDATE_DISCUSSION_CURRENT_THREAD_STATE
  | SET_CURRENT_DISCUSSION_THREAD
  | SET_TOTAL_DISCUSSION_PAGES
  | SET_TOTAL_DISCUSSION_THREAD_PAGES
  | UPDATE_DISCUSSION_THREAD
  | UPDATE_DISCUSSION_THREAD_REPLY
  | PUSH_MESSAGE_LAST_IN_CURRENT_THREAD
  | SET_USER_GROUP_INDEX
  | SET_USER_BY_SCHOOL_DATA_INDEX
  | UPDATE_SUMMARY_STATUS
  | LOAD_WORKSPACE_SUMMARY
  | LOAD_ORGANIZATION_CONTACTS
  | LOAD_STUDENT_SUMMARY
  | UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES
  | UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES
  | UPDATE_ORGANIZATION_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS
  | UPDATE_ORGANIZATION_WORKSPACES_ALL_PROPS
  | UPDATE_ORGANIZATION_WORKSPACES_ACTIVE_FILTERS
  | UPDATE_ORGANIZATION_WORKSPACES_STATE
  | UPDATE_ORGANIZATION_SELECTED_WORKSPACE
  | UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STAFF_SELECT_STATE
  | UPDATE_ORGANIZATION_SELECTED_WORKSPACE_STUDENT_SELECT_STATE
  | UPDATE_ORGANIZATION_TEMPLATES
  | UPDATE_WORKSPACES_AVAILABLE_FILTERS_EDUCATION_TYPES
  | UPDATE_WORKSPACES_AVAILABLE_FILTERS_STATE_TYPES
  | UPDATE_WORKSPACES_AVAILABLE_FILTERS_CURRICULUMS
  | UPDATE_WORKSPACES_STATE
  | UPDATE_WORKSPACES_ALL_PROPS
  | UPDATE_WORKSPACES_ACTIVE_FILTERS
  | UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS
  | UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES
  | UPDATE_GUIDER_AVAILABLE_FILTERS_USERGROUPS
  | UPDATE_GUIDER_ACTIVE_FILTERS
  | UPDATE_GUIDER_ALL_PROPS
  | UPDATE_GUIDER_STATE
  | ADD_TO_GUIDER_SELECTED_STUDENTS
  | TOGGLE_ALL_STUDENTS
  | DELETE_CONTACT_EVENT
  | DELETE_CONTACT_EVENT_COMMENT
  | REMOVE_FROM_GUIDER_SELECTED_STUDENTS
  | SET_CURRENT_GUIDER_STUDENT
  | SET_CURRENT_GUIDER_STUDENT_PROP
  | UPDATE_CURRENT_GUIDER_STUDENT_STATE
  | ADD_GUIDER_LABEL_TO_USER
  | REMOVE_GUIDER_LABEL_FROM_USER
  | UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL
  | UPDATE_GUIDER_AVAILABLE_FILTER_LABEL
  | UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS
  | DELETE_GUIDER_AVAILABLE_FILTER_LABEL
  | DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS
  | ADD_FILE_TO_CURRENT_STUDENT
  | REMOVE_FILE_FROM_CURRENT_STUDENT
  | UPDATE_RECORDS_ALL_STUDENT_USERS_DATA
  | UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS
  | UPDATE_RECORDS_LOCATION
  | UPDATE_RECORDS_SET_FILES
  | UPDATE_STATUS_PROFILE
  | UPDATE_STATUS_HAS_IMAGE
  | UPDATE_STATUS_WORKSPACEID
  | UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS
  | UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE
  | UPDATE_WORKSPACE_ASSESSMENT_STATE
  | UPDATE_STUDIES_SUMMARY
  | UPDATE_STUDIES_SUMMARY_STATUS
  | UPDATE_STUDIES_STATISTICS
  | UPDATE_STUDIES_STATISTICS_STATUS
  | SET_DISCUSSION_WORKSPACE_ID
  | UPDATE_ERROR
  | SET_PROFILE_USER_PROPERTY
  | SET_PROFILE_USERNAME
  | SET_PROFILE_ADDRESSES
  | SET_PROFILE_STUDENT
  | LOAD_CREDENTIALS
  | CREDENTIALS_STATE
  | UPDATE_WORKSPACES_AVAILABLE_FILTERS_ORGANIZATIONS
  | UPDATE_STUDENT_USERS
  | UPDATE_CURRENT_USER_GROUP
  | UPDATE_USER_GROUPS_STATE
  | UPDATE_HAS_MORE_USERGROUPS
  | LOAD_MORE_USER_GROUPS
  | SET_CURRENT_PAYLOAD
  | UPDATE_STAFF_USERS
  | UPDATE_USER_GROUPS
  | UPDATE_STUDENT_SELECTOR
  | UPDATE_STAFF_SELECTOR
  | UPDATE_GROUP_SELECTOR
  | CLEAR_USER_SELECTOR
  | UPDATE_STUDYPROGRAMME_TYPES
  | UPDATE_STUDYPROGRAMME_STATUS_TYPE
  | UPDATE_USERS_STATE
  | SET_CURRENT_WORKSPACE
  | UPDATE_WORKSPACE_ASSESSMENT_STATE
  | UPDATE_WORKSPACE
  | UPDATE_CURRENT_WORKSPACE_INTERIM_EVALUATION_REQUESTS
  | UPDATE_WORKSPACES_SET_CURRENT_MATERIALS
  | UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_ACTIVE_NODE_ID
  | UPDATE_WORKSPACES_SET_CURRENT_MATERIALS_REPLIES
  | UPDATE_CURRENT_COMPOSITE_REPLIES_UPDATE_OR_CREATE_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER
  | UPDATE_MATERIAL_CONTENT_NODE
  | DELETE_MATERIAL_CONTENT_NODE
  | INSERT_MATERIAL_CONTENT_NODE
  | MATERIAL_UPDATE_SHOW_EXTRA_TOOLS
  | UPDATE_PATH_FROM_MATERIAL_CONTENT_NODES
  | UPDATE_WORKSPACES_EDIT_MODE_STATE
  | UPDATE_WORKSPACES_SET_CURRENT_HELP
  | SET_PROFILE_CHAT_SETTINGS
  | SET_PROFILE_LOCATION
  | SET_WORKLIST_TEMPLATES
  | SET_WORKLIST
  | TOGGLE_ALL_MESSAGE_ITEMS
  | UPDATE_STATUS
  | UPDATE_STATUS_CHAT_SETTINGS
  | UPDATE_STATUS_WORKSPACE_PERMISSIONS
  | SET_PURCHASE_HISTORY
  | SET_PROFILE_AUTHORIZATIONS
  | UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS
  | UPDATE_GUIDER_INSERT_PURCHASE_ORDER
  | DELETE_GUIDER_PURCHASE_ORDER
  | UPDATE_GUIDER_COMPLETE_PURCHASE_ORDER
  | UPDATE_CEEPOS_STATE
  | UPDATE_CEEPOS_PAY_STATUS
  | UPDATE_CEEPOS_PURCHASE
  | UPDATE_CURRENT_GUIDER_STUDENT_HOPS_PHASE
  | UPDATE_CURRENT_WORKSPACE_ACTIVITY
  | UPDATE_CURRENT_WORKSPACE_ASESSMENT_REQUESTS
  | UPDATE_AVAILABLE_CURRICULUMS
  | OPEN_NOTIFICATION_DIALOG
  | CLOSE_NOTIFICATION_DIALOG
  | SET_ACTIVE_EASY_TO_USE_TOOL
  | JOURNALS_LOAD
  | JOURNALS_COMMENTS_LOAD
  | JOURNALS_SET_CURRENT
  | JOURNALS_CREATE
  | JOURNALS_UPDATE
  | JOURNALS_DELETE
  | JOURNALS_FILTTERS_CHANGE
  | JOURNALS_COMMENTS_CREATE
  | JOURNALS_COMMENTS_UPDATE
  | JOURNALS_COMMENTS_DELETE
  | JOURNALS_FEEDBACK_LOAD
  | EVALUATION_SORT_FUNCTION_CHANGE
  | EVALUATION_SELECTED_WORKSPACE_CHANGE
  | EVALUATION_SEARCH_CHANGE
  | EVALUATION_FILTERS_CHANGE
  | EVALUATION_WORKSPACES_LOAD
  | EVALUATION_STATE_UPDATE
  | EVALUATION_OPENED_ASSIGNMENT_UPDATE
  | EVALUATION_NEEDS_RELOAD_REQUESTS_UPDATE
  | EVALUATION_GRADE_SYSTEM_LOAD
  | EVALUATION_BILLED_PRICE_LOAD
  | EVALUATION_UNIMPORTANT_ASSESSMENTS_LOAD
  | EVALUATION_IMPORTANT_ASSESSMENTS_LOAD
  | EVALUATION_IMPORTANCE_UPDATE
  | EVALUATION_COMPOSITE_REPLIES_STATE_UPDATE
  | EVALUATION_COMPOSITE_REPLIES_LOAD
  | EVALUATION_BASE_PRICE_STATE_UPDATE
  | EVALUATION_BASE_PRICE_LOAD
  | EVALUATION_REQUESTS_STATE_UPDATE
  | EVALUATION_REQUESTS_LOAD
  | EVALUATION_ASSESSMENT_UPDATE
  | EVALUATION_ASSESSMENT_EVENTS_STATE_UPDATE
  | EVALUATION_ASSESSMENT_EVENTS_LOAD
  | EVALUATION_ASSESSMENT_ASSIGNMENTS_STATE_UPDATE
  | EVALUATION_ASSESSMENT_ASSIGNMENTS_LOAD
  | EVALUATION_JOURNAL_FEEDBACK_STATE_UPDATE
  | EVALUATION_JOURNAL_FEEDBACK_LOAD
  | EVALUATION_JOURNAL_FEEDBACK_CREATE_OR_UPDATE
  | EVALUATION_JOURNAL_FEEDBACK_DELETE
  | EVALUATION_JOURNAL_STATE_UPDATE
  | EVALUATION_JOURNAL_EVENTS_LOAD
  | EVALUATION_JOURNAL_COMMENTS_UPDATE
  | EVALUATION_JOURNAL_COMMENTS_LOAD
  | EVALUATION_JOURNAL_COMMENTS_INITIALIZED
  | EVALUATION_JOURNAL_COMMENTS_DELETE
  | EVALUATION_JOURNAL_COMMENTS_CREATE
  | CONTACT_LOAD_GROUP
  | CONTACT_UPDATE_GROUP_STATE
  | NOTEBOOK_UPDATE_STATE
  | NOTEBOOK_LOAD_ENTRIES
  | NOTEBOOK_UPDATE_ENTRIES
  | NOTEBOOK_CREATE_ENTRY
  | NOTEBOOK_EDIT_ENTRY
  | NOTEBOOK_DELETE_ENTRY
  | NOTEBOOK_TOGGLE_EDITOR
  | NOTEBOOK_SET_CUT_CONTENT
  | NOTEBOOK_UPDATE_SELECTED_POSITION
  | NOTEBOOK_LOAD_DEFAULT_POSITION
  | NOTEBOOK_UPDATE_DEFAULT_POSITION
  | DEPENDANTS_STATUS_UPDATE
  | DEPENDANTS_UPDATE
  | DEPENDANT_WORKSPACES_UPDATE
  | DEPENDANT_WORKSPACES_STATUS_UPDATE
  | HOPS_MATRICULATION_UPDATE_STATUS
  | HOPS_MATRICULATION_UPDATE_EXAMS
  | HOPS_MATRICULATION_UPDATE_PAST_EXAMS
  | HOPS_MATRICULATION_UPDATE_SUBJECTS
  | HOPS_MATRICULATION_UPDATE_ELIGIBILITY
  | HOPS_MATRICULATION_UPDATE_EXAM_STATE
  | HOPS_MATRICULATION_UPDATE_EXAM_HISTORY
  | HOPS_MATRICULATION_UPDATE_EXAM_HISTORY_STATUS
  | HOPS_MATRICULATION_UPDATE_PLAN
  | HOPS_MATRICULATION_UPDATE_SUBJECT_ELIGIBILITY
  | HOPS_MATRICULATION_UPDATE_RESULTS
  | HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER
  | HOPS_UPDATE_CURRENTSTUDENT_STUDYPROGRAM
  | HOPS_STUDENT_INFO_UPDATE
  | HOPS_FORM_UPDATE
  | HOPS_RESET_DATA
  | HOPS_FORM_HISTORY_UPDATE
  | HOPS_FORM_HISTORY_ENTRY_UPDATE
  | HOPS_FORM_UPDATE_CAN_LOAD_MORE_HISTORY
  | HOPS_CHANGE_MODE
  | HOPS_UPDATE_LOCKED
  | HOPS_UPDATE_EDITING
  | HOPS_CANCEL_EDITING
  | HOPS_STUDYPLAN_UPDATE_PLANNED_COURSES
  | HOPS_STUDYPLAN_UPDATE_STATUS
  | HOPS_UPDATE_EDITING_STUDYPLAN
  | HOPS_UPDATE_INITIALIZE_STATUS
  | HOPS_SET_SELECTED_COURSE
  | HOPS_CLEAR_SELECTED_COURSE
  | HOPS_UPDATE_CURRICULUM_CONFIG
  | UPDATE_MATERIALS_ARE_DISABLED
  | UPDATE_WORKSPACE_IS_BEING_EVALUATED;

export type AnyActionType = ActionType | DeferredAction | AsyncDeferredAction;
