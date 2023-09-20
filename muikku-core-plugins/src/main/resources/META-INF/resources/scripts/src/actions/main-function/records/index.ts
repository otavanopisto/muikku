import actions from "../../base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  AllStudentUsersDataStatusType,
  TranscriptOfRecordLocationType,
  CurrentStudentUserAndWorkspaceStatusType,
  CurrentRecordType,
  RecordWorkspaceActivityByLine,
  RecordWorkspaceActivitiesWithLineCategory,
} from "~/reducers/main-function/records";
import { UserFileType, UserWithSchoolDataType } from "~/reducers/user-index";
import i18n from "~/locales/i18n";
import { Dispatch } from "react-redux";
import MApi from "~/api/api";
import { RecordWorkspaceActivityInfo } from "~/generated/client";

export type UPDATE_RECORDS_ALL_STUDENT_USERS_DATA = SpecificActionType<
  "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA",
  RecordWorkspaceActivitiesWithLineCategory[]
>;
export type UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS = SpecificActionType<
  "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS",
  AllStudentUsersDataStatusType
>;
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
  Array<UserFileType>
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
 * SetLocationToYoInTranscriptOfRecordsTriggerType
 */
export interface SetLocationToYoInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
}

/**
 * UpdateAllStudentUsersAndSetViewToRecordsTriggerType
 */
export interface UpdateAllStudentUsersAndSetViewToRecordsTriggerType {
  (): AnyActionType;
}

/**
 * SetCurrentStudentUserViewAndWorkspaceTriggerType
 */
export interface SetCurrentStudentUserViewAndWorkspaceTriggerType {
  (userEntityId: number, userId: string, workspaceId: number): AnyActionType;
}

/**
 * SetLocationToVopsInTranscriptOfRecordsTriggerType
 */
export interface SetLocationToVopsInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
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
 */
const updateAllStudentUsersAndSetViewToRecords: UpdateAllStudentUsersAndSetViewToRecordsTriggerType =
  function updateAllStudentUsersAndSetViewToRecords() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const recordsApi = MApi.getRecordsApi();

      try {
        dispatch({
          type: "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE",
          payload: null,
        });
        dispatch({
          type: "UPDATE_RECORDS_LOCATION",
          payload: <TranscriptOfRecordLocationType>"records",
        });

        if (getState().records.userDataStatus !== "WAIT") {
          return;
        }

        dispatch({
          type: "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS",
          payload: <AllStudentUsersDataStatusType>"LOADING",
        });

        //OK let me try to explain this :<

        //We get the current used id this user is supposedly a student
        const userId: number = getState().status.userId;

        //we get the users that represent that userId
        let users: Array<UserWithSchoolDataType> = (await promisify(
          mApi().user.students.read({
            userEntityId: userId,
            includeInactiveStudents: true,
            maxResults: 20,
          }),
          "callback"
        )()) as Array<UserWithSchoolDataType>;

        //Then we sort them, alphabetically, using the id, these ids are like PYRAMUS-1 PYRAMUS-42 we want
        //The bigger number to be first
        users = users.sort((a, b) => {
          const aId = a.id.split("-")[2];
          const bId = b.id.split("-")[2];

          return parseInt(bId) - parseInt(aId);
        });

        // Get workspaces aka activities with line and category
        const workspaceWithActivity: RecordWorkspaceActivityInfo[] =
          await Promise.all(
            users.map(async (user) => {
              const workspacesWithActivity =
                await recordsApi.getWorkspaceActivity({
                  userIdentifier: user.id,
                  includeTransferCredits: "true",
                  includeAssignmentStatistics: "true",
                });

              return workspacesWithActivity;
            })
          );

        // Get active category index
        const activeCategoryIndex = workspaceWithActivity.findIndex(
          (a) => a.defaultLine
        );

        // Filter out default line and sort by line category (alphabetically)
        let sortedWorkspaceActivityData = workspaceWithActivity
          .filter((a) => !a.defaultLine)
          .sort((a, b) => {
            if (a.lineCategory > b.lineCategory) {
              return 1;
            }
            if (a.lineCategory < a.lineCategory) {
              return -1;
            }
            return 0;
          });

        // Add default line to the beginning of the array
        // and then sorted array of non default lines
        sortedWorkspaceActivityData = [
          workspaceWithActivity[activeCategoryIndex],
          ...sortedWorkspaceActivityData,
        ];

        // Helper object to hold category specific data
        const helperObject: {
          [category: string]: {
            credits: RecordWorkspaceActivityByLine[];
            transferedCredits: RecordWorkspaceActivityByLine[];
          };
        } = {};

        // Loop through workspaces and add them to helper object
        // by category
        sortedWorkspaceActivityData.forEach((workspaceActivity) => {
          const allCredits: RecordWorkspaceActivityByLine[] =
            workspaceActivity.activities.map((a) => ({
              lineName: workspaceActivity.lineName,
              activity: a,
            }));

          const credits: RecordWorkspaceActivityByLine[] = allCredits.filter(
            (a) => a.activity.assessmentStates[0].state !== "transferred"
          );

          const transferedCredits: RecordWorkspaceActivityByLine[] =
            allCredits.filter(
              (a) => a.activity.assessmentStates[0].state === "transferred"
            );

          // If category exists in helper object, add credits to it
          if (helperObject[workspaceActivity.lineCategory]) {
            helperObject[workspaceActivity.lineCategory].credits =
              helperObject[workspaceActivity.lineCategory].credits.concat(
                credits
              );

            helperObject[workspaceActivity.lineCategory].transferedCredits =
              helperObject[
                workspaceActivity.lineCategory
              ].transferedCredits.concat(transferedCredits);
          } else {
            // If category does not exist in helper object, create it
            helperObject[workspaceActivity.lineCategory] = {
              credits: [],
              transferedCredits: [],
            };

            helperObject[workspaceActivity.lineCategory].credits = credits;
            helperObject[workspaceActivity.lineCategory].transferedCredits =
              transferedCredits;
          }
        });

        // Convert helper object to array of objects
        const data: RecordWorkspaceActivitiesWithLineCategory[] =
          Object.entries(helperObject).map((a) => ({
            lineCategory: a[0],
            credits: a[1].credits,
            transferCredits: a[1].transferedCredits,
          }));

        //and that should do it, it should give us the precious data we need in the order we need it to be
        dispatch({
          type: "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA",
          payload: data,
        });
        dispatch({
          type: "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS",
          payload: <AllStudentUsersDataStatusType>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "studies",
              context: "studies",
            }),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS",
          payload: <AllStudentUsersDataStatusType>"ERROR",
        });
      }
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
 * setLocationToYoInTranscriptOfRecords
 */
const setLocationToYoInTranscriptOfRecords: SetLocationToYoInTranscriptOfRecordsTriggerType =
  function setLocationToYoInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"yo",
    };
  };

/**
 * setLocationToVopsInTranscriptOfRecords
 */
const setLocationToVopsInTranscriptOfRecords: SetLocationToVopsInTranscriptOfRecordsTriggerType =
  function setLocationToVopsInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"vops",
    };
  };

/**
 * setLocationToHopsInTranscriptOfRecords
 */
const setLocationToHopsInTranscriptOfRecords: SetLocationToHopsInTranscriptOfRecordsTriggerType =
  function setLocationToHopsInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"hops",
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const files: Array<UserFileType> = <Array<UserFileType>>(
        await promisify(
          mApi().guider.users.files.read(
            getState().status.userSchoolDataIdentifier
          ),
          "callback"
        )()
      );

      dispatch({
        type: "UPDATE_RECORDS_SET_FILES",
        payload: files,
      });
    };
  };

export {
  updateAllStudentUsersAndSetViewToRecords,
  setLocationToVopsInTranscriptOfRecords,
  setLocationToStatisticsInTranscriptOfRecords,
  setLocationToYoInTranscriptOfRecords,
  setLocationToHopsInTranscriptOfRecords,
  setLocationToSummaryInTranscriptOfRecords,
  setLocationToInfoInTranscriptOfRecords,
  setLocationToPedagogyFormInTranscriptOfRecords,
  updateTranscriptOfRecordsFiles,
};
