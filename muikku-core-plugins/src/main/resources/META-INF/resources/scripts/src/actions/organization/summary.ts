import actions from "../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import MApi, { isMApiError } from "~/api/api";
import {
  OrganizationContact,
  OrganizationStudentsSummary,
  OrganizationWorkspaceSummary,
} from "~/generated/client";
import i18n from "~/locales/i18n";

/**
 * LoadSummaryTriggerType
 */
export interface LoadSummaryTriggerType {
  (): AnyActionType;
}

export type OrganizationSummaryStatusType =
  | "IDLE"
  | "LOADING"
  | "READY"
  | "ERROR";

export type LOAD_WORKSPACE_SUMMARY = SpecificActionType<
  "LOAD_WORKSPACE_SUMMARY",
  OrganizationWorkspaceSummary
>;
export type LOAD_STUDENT_SUMMARY = SpecificActionType<
  "LOAD_STUDENT_SUMMARY",
  OrganizationStudentsSummary
>;
export type LOAD_ORGANIZATION_CONTACTS = SpecificActionType<
  "LOAD_ORGANIZATION_CONTACTS",
  OrganizationContact[]
>;
export type UPDATE_SUMMARY_STATUS = SpecificActionType<
  "UPDATE_SUMMARY_STATUS",
  OrganizationSummaryStatusType
>;

/**
 * loadOrganizationSummary
 */
const loadOrganizationSummary: LoadSummaryTriggerType =
  function loadOrganizationSummary() {
    return async (dispatch, getState) => {
      const organizationtApi = MApi.getOrganizationApi();

      try {
        dispatch({
          type: "UPDATE_SUMMARY_STATUS",
          payload: <OrganizationSummaryStatusType>"LOADING",
        });

        dispatch({
          type: "LOAD_WORKSPACE_SUMMARY",
          payload: await organizationtApi.getOrganizationWorkspaceOverview(),
        });

        dispatch({
          type: "LOAD_STUDENT_SUMMARY",
          payload: await organizationtApi.getOrganizationStudentsSummary(),
        });

        dispatch({
          type: "LOAD_ORGANIZATION_CONTACTS",
          payload: await organizationtApi.getContactPersons(),
        });
        dispatch({
          type: "UPDATE_SUMMARY_STATUS",
          payload: <OrganizationSummaryStatusType>"READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "organization",
              context: "summary",
            }),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_SUMMARY_STATUS",
          payload: <OrganizationSummaryStatusType>"ERROR",
        });
      }
    };
  };

export default loadOrganizationSummary;
