import actions from '../base/notifications';
import promisify from '~/util/promisify';
import { AnyActionType, SpecificActionType } from '~/actions';
import mApi, { MApiError } from '~/lib/mApi';
import { StateType } from '~/reducers';
import { OrganizationSummaryWorkspaceDataType, OrganizationSummaryStudentsDataType, OrganizationSummaryContactDataType } from "~/reducers/organization/summary"

export interface LoadSummaryTriggerType {
  (): AnyActionType
}

export type OrganizationSummaryStatusType = "IDLE" | "LOADING" | "READY" | "ERROR";

export interface LOAD_WORKSPACE_SUMMARY extends SpecificActionType<"LOAD_WORKSPACE_SUMMARY", OrganizationSummaryWorkspaceDataType> { }
export interface LOAD_STUDENT_SUMMARY extends SpecificActionType<"LOAD_STUDENT_SUMMARY", OrganizationSummaryStudentsDataType> { }
export interface LOAD_ORGANIZATION_CONTACTS extends SpecificActionType<"LOAD_ORGANIZATION_CONTACTS", OrganizationSummaryContactDataType> { }
export interface UPDATE_SUMMARY_STATUS extends SpecificActionType<"UPDATE_SUMMARY_STATUS", OrganizationSummaryStatusType> { }

// julkaistut/julkaisemattomat kurssit:
// mApi().organizationWorkspaceManagement.overview.read()

// aktiiviset/epäaktiiviset opiskelijat:
// mApi().organizationUserManagement.studentsSummary.read()

// yhteyshenkilöt
// mApi().organizationUserManagement.contactPersons.read()

let loadOrganizationSummary: LoadSummaryTriggerType = function loadOrganizationSummary() {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: 'UPDATE_SUMMARY_STATUS',
        payload: <OrganizationSummaryStatusType>"LOADING"
      });
      dispatch({
        type: 'LOAD_WORKSPACE_SUMMARY',
        payload: <OrganizationSummaryWorkspaceDataType>(await promisify(mApi().organizationWorkspaceManagement.overview.read(), 'callback')())
      });
      dispatch({
        type: 'LOAD_STUDENT_SUMMARY',
        payload: <OrganizationSummaryStudentsDataType>(await promisify(mApi().organizationUserManagement.studentsSummary.read(), 'callback')())
      });
      dispatch({
        type: 'LOAD_ORGANIZATION_CONTACTS',
        payload: <OrganizationSummaryContactDataType>await promisify(mApi().organizationUserManagement.contactPersons.read(), 'callback')()
      });
      dispatch({
        type: 'UPDATE_SUMMARY_STATUS',
        payload: <OrganizationSummaryStatusType>"READY"
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("todo"), 'error'));
      dispatch({
        type: 'UPDATE_SUMMARY_STATUS',
        payload: <OrganizationSummaryStatusType>"ERROR"
      });
    }
  }
}

export default loadOrganizationSummary;
