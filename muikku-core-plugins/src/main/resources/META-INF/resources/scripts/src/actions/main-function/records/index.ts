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
  RecordWorkspaceActivity,
  AllStudentUsersDataType,
  RecordGroupType,
} from "~/reducers/main-function/records";
import { UserFileType, UserWithSchoolDataType } from "~/reducers/user-index";
import { Dispatch } from "react-redux";

export type UPDATE_RECORDS_ALL_STUDENT_USERS_DATA = SpecificActionType<
  "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA",
  AllStudentUsersDataType[]
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

        const resultingDataNew: AllStudentUsersDataType[] = [];

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
            const creditById: { [key: string]: RecordGroupType } = {};

            const defaultCredits: RecordGroupType = {
              credits: [],
              transferCredits: [],
            };

            const creditIdsOrdered = workspaceWithActivity[
              index
            ].allCredits.map((c) => {
              //so we get the curriculum this workspace belongs to
              const curriculumIdentifier = c.curriculums[0]?.identifier;
              const curriculumName = c.curriculums[0]?.name;

              const isTransfer = c.assessmentStates[0].state === "transferred";

              //if there is none it goes to the default record one
              if (!curriculumIdentifier || !curriculumName) {
                isTransfer
                  ? defaultCredits.transferCredits.push(c)
                  : defaultCredits.credits.push(c);

                //if we don't have it set in the record by id object then we need to create a new record group with that record
              } else if (!creditById[curriculumIdentifier]) {
                creditById[curriculumIdentifier] = {
                  groupCurriculumName: curriculumName,
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

            //now here we need to order, the curriculum identifier of the user always goes first
            //then we add it by the ids given by the workspace and then by the transferred records
            //we need to remove duplicates, this gives us a list of strings of ids of the order of that specific user
            const creditsOrder = [user.curriculumIdentifier]
              .concat(creditIdsOrdered)
              .filter((item, pos, self) => item && self.indexOf(item) == pos);

            //now we need to apply this order for that user, we take the order and return each record group
            //we also need to sort the records by curriculum name
            //we concat it with the default records (at the end as they have no identifier), and then we need
            //to filter, sometimes there might be no record at all eg, the user curriculum identifier has no workspace or
            //transfer credit with that id; or it might be empty, eg, as the default record hold no records at all,
            //we want to filter those cases out
            resultingDataNew[index].records = creditsOrder
              .map(
                (curriculumIdentifier: string) =>
                  creditById[curriculumIdentifier]
              )
              .sort((a, b) => {
                const aName = a.groupCurriculumName.toLowerCase();
                const bName = b.groupCurriculumName.toLowerCase();

                if (aName < bName) {
                  return -1;
                }
                if (aName > bName) {
                  return 1;
                }
                return 0;
              })
              .concat([defaultCredits])
              .filter(
                (record: RecordGroupType) =>
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
  updateTranscriptOfRecordsFiles,
};
