import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  TranscriptOfRecordLocationType,
  CurrentStudentUserAndWorkspaceStatusType,
  CurrentRecordType,
} from "~/reducers/main-function/records";
import { UserFile } from "~/generated/client";
import { Dispatch, Action } from "redux";
import MApi from "~/api/api";

export type UPDATE_RECORDS_LOCATION = SpecificActionType<
  "UPDATE_RECORDS_LOCATION",
  TranscriptOfRecordLocationType
>;
export type UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS =
  SpecificActionType<
    "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS",
    CurrentStudentUserAndWorkspaceStatusType
  >;
export type UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE = SpecificActionType<
  "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE",
  CurrentRecordType
>;
export type UPDATE_RECORDS_SET_FILES = SpecificActionType<
  "UPDATE_RECORDS_SET_FILES",
  UserFile[]
>;

/**
 * SetLocationToStatisticsInTranscriptOfRecordsTriggerType
 */
export interface SetLocationToStatisticsInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
}
/**
 * SetLocationToSummaryInTranscriptOfRecordsTriggerType
 */
export interface SetLocationToSummaryInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
}

/**
 * UpdateAllStudentUsersAndSetViewToRecordsTriggerType
 */
export interface UpdateAllStudentUsersAndSetViewToRecordsTriggerType {
  (userIdentifier?: string): AnyActionType;
}

/**
 * SetCurrentStudentUserViewAndWorkspaceTriggerType
 */
export interface SetCurrentStudentUserViewAndWorkspaceTriggerType {
  (userEntityId: number, userId: string, workspaceId: number): AnyActionType;
}

/**
 * SetLocationToHopsInTranscriptOfRecordsTriggerType
 */
export interface SetLocationToHopsInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
}

/**
 * UpdateTranscriptOfRecordsFilesTriggerType
 */
export interface UpdateTranscriptOfRecordsFilesTriggerType {
  (): AnyActionType;
}

/**
 * updateAllStudentUsersAndSetViewToRecords
 * @param userIdentifier user muikku Identifier
 */
const updateAllStudentUsersAndSetViewToRecords: UpdateAllStudentUsersAndSetViewToRecordsTriggerType =
  function updateAllStudentUsersAndSetViewToRecords(userIdentifier) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "UPDATE_RECORDS_LOCATION",
        payload: <TranscriptOfRecordLocationType>"records",
      });
    };
  };

/**
 * setLocationToStatisticsInTranscriptOfRecords
 */
const setLocationToStatisticsInTranscriptOfRecords: SetLocationToStatisticsInTranscriptOfRecordsTriggerType =
  function setLocationToStatisticsInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"statistics",
    };
  };

/**
 * setLocationToSummaryInTranscriptOfRecords
 */
const setLocationToSummaryInTranscriptOfRecords: SetLocationToSummaryInTranscriptOfRecordsTriggerType =
  function setLocationToSummaryInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"summary",
    };
  };

/**
 * setLocationToPedagogyFormInTranscriptOfRecords
 */
const setLocationToPedagogyFormInTranscriptOfRecords: SetLocationToHopsInTranscriptOfRecordsTriggerType =
  function setLocationToHopsInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"pedagogy-form",
    };
  };

/**
 * setLocationToInfoInTranscriptOfRecords
 */
const setLocationToInfoInTranscriptOfRecords: SetLocationToHopsInTranscriptOfRecordsTriggerType =
  function setLocationToHopsInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"info",
    };
  };

/**
 * updateTranscriptOfRecordsFiles
 */
const updateTranscriptOfRecordsFiles: UpdateTranscriptOfRecordsFilesTriggerType =
  function updateTranscriptOfRecordsFiles() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const guiderApi = MApi.getGuiderApi();

      const files = await guiderApi.getGuiderUserFiles({
        identifier: getState().status.userSchoolDataIdentifier,
      });

      dispatch({
        type: "UPDATE_RECORDS_SET_FILES",
        payload: files,
      });
    };
  };

export {
  updateAllStudentUsersAndSetViewToRecords,
  setLocationToStatisticsInTranscriptOfRecords,
  setLocationToSummaryInTranscriptOfRecords,
  setLocationToInfoInTranscriptOfRecords,
  setLocationToPedagogyFormInTranscriptOfRecords,
  updateTranscriptOfRecordsFiles,
};
