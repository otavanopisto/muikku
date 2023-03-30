import actions from "../../base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  AllStudentUsersDataType,
  AllStudentUsersDataStatusType,
  TranscriptOfRecordLocationType,
  CurrentStudentUserAndWorkspaceStatusType,
  CurrentRecordType,
  TransferCreditType,
  RecordGroupType,
  RecordWorkspaceActivity,
  AllStudentUsersDataType2,
  RecordGroupType2,
} from "~/reducers/main-function/records";
import { UserFileType, UserWithSchoolDataType } from "~/reducers/user-index";
import {
  WorkspaceType,
  WorkspaceJournalListType,
  MaterialContentNodeType,
  MaterialEvaluationType,
  MaterialAssignmentType,
  MaterialCompositeRepliesType,
  WorkspaceActivityType,
} from "~/reducers/workspaces";

export type UPDATE_RECORDS_ALL_STUDENT_USERS_DATA = SpecificActionType<
  "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA",
  AllStudentUsersDataType2[]
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
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
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
          if (a.id < b.id) {
            return 1;
          }
          if (a.id > b.id) {
            return -1;
          }
          return 0;
        });

        //////// NEW CODE

        const workspaceWithActivity: {
          user: UserWithSchoolDataType;
          allCredits: RecordWorkspaceActivity[];
        }[] = await Promise.all(
          users.map(async (user) => {
            const workspacesWithActivity = (await promisify(
              mApi().records.users.workspaceActivity.read(user.id, {
                includeTransferCredits: "true",
                includeAssignmentStatistics: "true",
              }),
              "callback"
            )()) as RecordWorkspaceActivity[];

            return {
              user,
              allCredits: workspacesWithActivity,
            };
          })
        );

        const resultingDataNew: AllStudentUsersDataType2[] = [];

        users.forEach((user, index) => {
          // Intiliaze list of data for each user
          resultingDataNew[index] = {
            user,
            records: null,
          };

          // If user has no curriculum, just add all credits to the list
          if (!user.curriculumIdentifier) {
            resultingDataNew[index].records = [
              {
                credits: workspaceWithActivity[index].allCredits.filter(
                  (c) => c.assessmentStates[0].state !== "transferred"
                ),
                transferCredits: workspaceWithActivity[index].allCredits.filter(
                  (c) => c.assessmentStates[0].state === "transferred"
                ),
              },
            ];
          } else {
            const creditById: { [key: string]: RecordGroupType2 } = {};

            const defaultCredits: RecordGroupType2 = {
              credits: [],
              transferCredits: [],
            };

            const creditIdsOrdered = workspaceWithActivity[
              index
            ].allCredits.map((c) => {
              //so we get the curriculum this workspace belongs to
              const curriculumIdentifier = c.curriculums[0].identifier;

              const isTransfer = c.assessmentStates[0].state === "transferred";

              //if there is none it goes to the default record one
              if (!curriculumIdentifier) {
                isTransfer
                  ? defaultCredits.transferCredits.push(c)
                  : defaultCredits.credits.push(c);

                //if we don't have it set in the record by id object then we need to create a new record group with that record
              } else if (!creditById[curriculumIdentifier]) {
                creditById[curriculumIdentifier] = {
                  groupCurriculumIdentifier: curriculumIdentifier,
                  credits: [],
                  transferCredits: [],
                };

                isTransfer
                  ? creditById[curriculumIdentifier].transferCredits.push(c)
                  : creditById[curriculumIdentifier].credits.push(c);

                //otherwise we add that record to the record group
              } else {
                isTransfer
                  ? creditById[curriculumIdentifier].transferCredits.push(c)
                  : creditById[curriculumIdentifier].credits.push(c);
              }

              //We fetch the given id
              return curriculumIdentifier;
            });

            const creditsOrder = [user.curriculumIdentifier]
              .concat(creditIdsOrdered)
              .filter((item, pos, self) => self.indexOf(item) == pos);

            resultingDataNew[index].records = creditsOrder
              .map(
                (curriculumIdentifier: string) =>
                  creditById[curriculumIdentifier]
              )
              .concat([defaultCredits])
              .filter(
                (record: RecordGroupType2) =>
                  record &&
                  record.credits.length + record.transferCredits.length
              );
          }
        });

        //and that should do it, it should give us the precious data we need in the order we need it to be
        dispatch({
          type: "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA",
          payload: resultingDataNew,
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
            getState().i18n.text.get(
              "plugin.records.errormessage.recordsLoadFailed "
            ),
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
      dispatch: (arg: AnyActionType) => any,
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
  /* setCurrentStudentUserViewAndWorkspace, */
  setLocationToVopsInTranscriptOfRecords,
  setLocationToStatisticsInTranscriptOfRecords,
  setLocationToYoInTranscriptOfRecords,
  setLocationToHopsInTranscriptOfRecords,
  setLocationToSummaryInTranscriptOfRecords,
  setLocationToInfoInTranscriptOfRecords,
  updateTranscriptOfRecordsFiles,
};
