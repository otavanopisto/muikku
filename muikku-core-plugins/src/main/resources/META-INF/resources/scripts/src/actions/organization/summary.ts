import actions from "../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import MApi from "~/api/api";
import {
  OrganizationContact,
  OrganizationStudentsSummary,
  OrganizationWorkspaceSummary,
} from "~/generated/client";
import { Dispatch } from "react-redux";

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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const organizationtApi = MApi.getOrganizationApi();

      try {
        dispatch({
          type: "UPDATE_SUMMARY_STATUS",
          payload: <OrganizationSummaryStatusType>"LOADING",
        });
        /* dispatch({
          type: "LOAD_WORKSPACE_SUMMARY",
          payload: <OrganizationSummaryWorkspaceDataType>(
            await promisify(
              mApi().organizationWorkspaceManagement.overview.read(),
              "callback"
            )()
          ),
        }); */
        dispatch({
          type: "LOAD_WORKSPACE_SUMMARY",
          payload: await organizationtApi.getOrganizationWorkspaceOverview(),
        });
        /* dispatch({
          type: "LOAD_STUDENT_SUMMARY",
          payload: <OrganizationSummaryStudentsDataType>(
            await promisify(
              mApi().organizationUserManagement.studentsSummary.read(),
              "callback"
            )()
          ),
        }); */
        dispatch({
          type: "LOAD_STUDENT_SUMMARY",
          payload: await organizationtApi.getOrganizationStudentsSummary(),
        });
        /* dispatch({
          type: "LOAD_ORGANIZATION_CONTACTS",
          payload: <OrganizationSummaryContactDataType>(
            await promisify(
              mApi().organizationUserManagement.contactPersons.read(),
              "callback"
            )()
          ),
        }); */
        dispatch({
          type: "LOAD_ORGANIZATION_CONTACTS",
          payload: await organizationtApi.getContactPersons(),
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
          actions.displayNotification(getState().i18n.text.get("todo"), "error")
        );
        dispatch({
          type: "UPDATE_SUMMARY_STATUS",
          payload: <OrganizationSummaryStatusType>"ERROR",
        });
      }
    };
  };

export default loadOrganizationSummary;
