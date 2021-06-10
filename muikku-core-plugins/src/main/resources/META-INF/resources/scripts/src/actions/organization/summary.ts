import actions from '../base/notifications';
import promisify from '~/util/promisify';
import { AnyActionType, SpecificActionType } from '~/actions';
import mApi, { MApiError } from '~/lib/mApi';
import { StateType } from '~/reducers';
import { SummaryWorkspaceDataType, SummaryStudentsDataType } from "~/reducers/organization/summary"

export interface LoadSummaryTriggerType {
  (): AnyActionType
}

export interface LoadOverviewTriggerType {
  (): AnyActionType
}

export interface LoadStudentSummaryTriggerType {
  (): AnyActionType
}
export type SummaryStatusType = "IDLE" | "LOADING" | "READY" | "ERROR";
export interface LOAD_WORKSPACE_SUMMARY extends SpecificActionType<"LOAD_WORKSPACE_SUMMARY", {}> { }
export interface LOAD_STUDENT_SUMMARY extends SpecificActionType<"LOAD_STUDENT_SUMMARY", {}> { }
export interface UPDATE_SUMMARY_STATUS extends SpecificActionType<"UPDATE_SUMMARY_STATUS", SummaryStatusType> { }


// julkaistut/julkaisemattomat kurssit:
// mApi().organizationWorkspaceManagement.overview.read()

// aktiiviset/epäaktiiviset opiskelijat:
// mApi().organizationUserManagement.studentsSummary.read()

let loadSummary: LoadSummaryTriggerType = function loadSummary() {
  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {
      dispatch({
        type: 'UPDATE_SUMMARY_STATUS',
        payload: <SummaryStatusType>"LOADING"
      });
      dispatch({
        type: 'LOAD_WORKSPACE_SUMMARY',
        payload: <SummaryWorkspaceDataType>(await promisify(mApi().organizationWorkspaceManagement.overview.read(), 'callback')())
      });
      dispatch({
        type: 'LOAD_STUDENT_SUMMARY',
        payload: <SummaryStudentsDataType>(await promisify(mApi().organizationUserManagement.studentsSummary.read(), 'callback')())
      });
      dispatch({
        type: 'UPDATE_SUMMARY_STATUS',
        payload: <SummaryStatusType>"READY"
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.records.vops.errormessage.vopsLoadFailed"), 'error'));
      dispatch({
        type: 'UPDATE_SUMMARY_STATUS',
        payload: <SummaryStatusType>"ERROR"
      });
    }
  }
}

export default { loadSummary };
