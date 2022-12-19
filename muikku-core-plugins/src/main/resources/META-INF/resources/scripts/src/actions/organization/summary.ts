import actions from "../base/notifications";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import {
  OrganizationSummaryWorkspaceDataType,
  OrganizationSummaryStudentsDataType,
  OrganizationSummaryContactDataType,
} from "~/reducers/organization/summary";

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
  OrganizationSummaryWorkspaceDataType
>;
export type LOAD_STUDENT_SUMMARY = SpecificActionType<
  "LOAD_STUDENT_SUMMARY",
  OrganizationSummaryStudentsDataType
>;
export type LOAD_ORGANIZATION_CONTACTS = SpecificActionType<
  "LOAD_ORGANIZATION_CONTACTS",
  OrganizationSummaryContactDataType
>;
export type UPDATE_SUMMARY_STATUS = SpecificActionType<
  "UPDATE_SUMMARY_STATUS",
  OrganizationSummaryStatusType
>;

// julkaistut/julkaisemattomat kurssit:
// mApi().organizationWorkspaceManagement.overview.read()

// aktiiviset/epäaktiiviset opiskelijat:
// mApi().organizationUserManagement.studentsSummary.read()

// yhteyshenkilöt
// mApi().organizationUserManagement.contactPersons.read()

/**
 * loadOrganizationSummary
 */
const loadOrganizationSummary: LoadSummaryTriggerType =
  function loadOrganizationSummary() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_SUMMARY_STATUS",
          payload: <OrganizationSummaryStatusType>"LOADING",
        });
        dispatch({
          type: "LOAD_WORKSPACE_SUMMARY",
          payload: <OrganizationSummaryWorkspaceDataType>(
            await promisify(
              mApi().organizationWorkspaceManagement.overview.read(),
              "callback"
            )()
          ),
        });
        dispatch({
          type: "LOAD_STUDENT_SUMMARY",
          payload: <OrganizationSummaryStudentsDataType>(
            await promisify(
              mApi().organizationUserManagement.studentsSummary.read(),
              "callback"
            )()
          ),
        });
        dispatch({
          type: "LOAD_ORGANIZATION_CONTACTS",
          payload: <OrganizationSummaryContactDataType>(
            await promisify(
              mApi().organizationUserManagement.contactPersons.read(),
              "callback"
            )()
          ),
        });
        dispatch({
          type: "UPDATE_SUMMARY_STATUS",
          payload: <OrganizationSummaryStatusType>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18nOLD.text.get("todo"),
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
