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
} from "~/reducers/main-function/records";
import { UserFileType, UserWithSchoolDataType } from "~/reducers/user-index";
import {
  WorkspaceType,
  WorkspaceStudentAssessmentStateType,
  WorkspaceStudentActivityType,
  WorkspaceJournalListType,
  MaterialContentNodeType,
  MaterialEvaluationType,
  MaterialAssignmentType,
  WorkspaceStudentAssessmentsType,
  MaterialCompositeRepliesType,
} from "~/reducers/workspaces";

export type UPDATE_RECORDS_ALL_STUDENT_USERS_DATA = SpecificActionType<
  "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA",
  AllStudentUsersDataType
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

export interface SetLocationToStatisticsInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
}
export interface SetLocationToSummaryInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
}

export interface SetLocationToYoInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
}

export interface UpdateAllStudentUsersAndSetViewToRecordsTriggerType {
  (): AnyActionType;
}

export interface SetCurrentStudentUserViewAndWorkspaceTriggerType {
  (userEntityId: number, userId: string, workspaceId: number): AnyActionType;
}

export interface SetLocationToVopsInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
}

export interface SetLocationToHopsInTranscriptOfRecordsTriggerType {
  (): AnyActionType;
}

export interface UpdateTranscriptOfRecordsFilesTriggerType {
  (): AnyActionType;
}

let updateAllStudentUsersAndSetViewToRecords: UpdateAllStudentUsersAndSetViewToRecordsTriggerType =
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
        let userId: number = getState().status.userId;

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

        //Now we get the workspaces that each one of those users was in, so that mean is an array of an array of workspaces for each
        //user
        let workspaces: Array<Array<WorkspaceType>> = (await Promise.all(
          users.map((user) =>
            promisify(
              mApi().records.workspaces.read({
                userIdentifier: user.id,
              }),
              "callback"
            )()
          )
        )) as Array<Array<WorkspaceType>>;
        //Now there's this weird thing that it won't give you an empty array if there are no workspaces found, it will instead
        //Give a no response, so we check wheter there was a no response aka undefined and we replace that with an emtpy array
        workspaces = workspaces.map((workspaceSet) =>
          !workspaceSet ? [] : workspaceSet
        );

        //the same way we get all the transfer credits for each user, which is an array of array of transfer credits
        let transferCredits: Array<Array<TransferCreditType>> =
          (await Promise.all(
            users.map((user) =>
              promisify(
                mApi().user.students.transferCredits.read(user.id),
                "callback"
              )()
            )
          )) as Array<Array<TransferCreditType>>;

        //now this is kinna funny here we need to get the workspace evaluation data, wheter it's the final or current data
        //for that we need to look through each workspaceSet that means the workspaceSet is an array of workspaces for an specific user
        //of the same index, this uses Promise.all which means it's completely async it loops all at once
        /*  await Promise.all(workspaces.map(async (workspaceSet, index) => {
        let user = users[index];

        //Now we need to get into one by one workspace per that specific user
        await Promise.all(workspaceSet.map(async (workspace) => {
          workspace.studentAssessmentState = <WorkspaceStudentAssessmentStateType>await promisify(mApi().workspace.workspaces
            .students.assessmentstate.read(workspace.id, user.id), 'callback')();
          workspace.studentActivity = <WorkspaceStudentActivityType>await promisify(mApi().guider.workspaces.activity
            .read(workspace.id), 'callback')();
        }));
      }));
 */
        //so now we are here, we need to get the data and order it, this is the weird part
        let resultingData: AllStudentUsersDataType = [];

        //ok so we loop for user
        users.forEach((user, index) => {
          //we add that user to the resulting array, in such order
          resultingData[index] = {
            user,
            records: null,
          };

          //we get the results we got from the serveh
          let givenWorkspacesByServer = workspaces[index];
          let givenTransferCreditsByServer = transferCredits[index];

          //if the user does not have a curriculum identifier then the order is the workspaces is fairly irrelevant
          //we will just display them as they came from the server and don't tag them to belong to any curriculum
          if (!user.curriculumIdentifier) {
            resultingData[index].records = [
              {
                workspaces: givenWorkspacesByServer,
                transferCredits: givenTransferCreditsByServer,
              },
            ];

            //here we need that and we need to order and group them
          } else {
            //we create this helper index variable
            //of records
            let recordById: { [key: string]: RecordGroupType } = {};

            //and this will be the default group
            let defaultRecords: RecordGroupType = {
              workspaces: [],
              transferCredits: [],
            };

            //so we start with the workspace, we need each id as ordered
            let workspaceIdsOrdered = givenWorkspacesByServer.map(
              (workspace) => {
                //so we get the curriculum this workspace belongs to
                let curriculumIdentifier: string =
                  workspace.curriculumIdentifiers[0];

                //if there is none it goes to the default record one
                if (!curriculumIdentifier) {
                  defaultRecords.workspaces.push(workspace);

                  //if we don't have it set in the record by id object then we need to create a new record group with that record
                } else if (!recordById[curriculumIdentifier]) {
                  recordById[curriculumIdentifier] = {
                    groupCurriculumIdentifier: curriculumIdentifier,
                    workspaces: [workspace],
                    transferCredits: [],
                  };

                  //otherwise we add that record to the record group
                } else {
                  recordById[curriculumIdentifier].workspaces.push(workspace);
                }

                //We fetch the given id
                return curriculumIdentifier;
              }
            );

            //we do virtually the same for the transfer credits
            let recordsIdsOrdered = givenTransferCreditsByServer.map(
              (transferCredit) => {
                let curriculumIdentifier: string =
                  transferCredit.curriculumIdentifier;
                if (!curriculumIdentifier) {
                  defaultRecords.transferCredits.push(transferCredit);
                } else if (!recordById[curriculumIdentifier]) {
                  recordById[curriculumIdentifier] = {
                    groupCurriculumIdentifier: curriculumIdentifier,
                    workspaces: [],
                    transferCredits: [transferCredit],
                  };
                } else {
                  recordById[curriculumIdentifier].transferCredits.push(
                    transferCredit
                  );
                }
                return curriculumIdentifier;
              }
            );

            //now here we need to order, the curriculum identifier of the user always goes first
            //then we add it by the ids given by the workspace and then by the transferred records
            //we need to remove duplicates, this gives us a list of strings of ids of the order of that specific user
            let workspaceOrder = [user.curriculumIdentifier]
              .concat(workspaceIdsOrdered)
              .concat(recordsIdsOrdered)
              .filter((item, pos, self) => {
                return self.indexOf(item) == pos;
              });

            //now we need to apply this order for that user, we take the order and return each record group
            //we concat it with the default records (at the end as they have no identifier), and then we need
            //to filter, sometimes there might be no record at all eg, the user curriculum identifier has no workspace or
            //transfer credit with that id; or it might be empty, eg, as the default record hold no records at all,
            //we want to filter those cases out
            resultingData[index].records = workspaceOrder
              .map((curriculumIdentifier: string) => {
                return recordById[curriculumIdentifier];
              })
              .concat([defaultRecords])
              .filter(
                (record: RecordGroupType) =>
                  record &&
                  record.workspaces.length + record.transferCredits.length
              );
          }
        });

        //and that should do it, it should give us the precious data we need in the order we need it to be
        dispatch({
          type: "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA",
          payload: resultingData,
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

let setCurrentStudentUserViewAndWorkspace: SetCurrentStudentUserViewAndWorkspaceTriggerType =
  function setCurrentStudentUserViewAndWorkspace(
    userEntityId,
    userId,
    workspaceId
  ) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_RECORDS_LOCATION",
          payload: <TranscriptOfRecordLocationType>"records",
        });
        dispatch({
          type: "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS",
          payload: <CurrentStudentUserAndWorkspaceStatusType>"LOADING",
        });

        let userData: AllStudentUsersDataType = getState().records.userData;

        let [workspace, journals, materials, compositeReplies] =
          await Promise.all([
            (async () => {
              let workspace: WorkspaceType;
              let wasFoundInMemory = userData.find((dataPoint) => {
                return !!dataPoint.records.find((record: RecordGroupType) => {
                  return !!record.workspaces.find(
                    (workspaceSearch: WorkspaceType) => {
                      if (workspaceSearch.id === workspaceId) {
                        workspace = workspaceSearch;
                        return true;
                      }
                      return false;
                    }
                  );
                });
              });

              if (!wasFoundInMemory) {
                workspace = <WorkspaceType>(
                  await promisify(
                    mApi().records.workspaces.read(workspaceId),
                    "callback"
                  )()
                );
                workspace.studentAssessmentState = <
                  WorkspaceStudentAssessmentStateType
                >await promisify(
                  mApi().workspace.workspaces.students.assessmentstate.read(
                    workspace.id,
                    userId
                  ),
                  "callback"
                )();
                workspace.studentActivity = <WorkspaceStudentActivityType>(
                  await promisify(
                    mApi().guider.workspaces.activity.read(workspace.id),
                    "callback"
                  )()
                );
              }

              return workspace;
            })(),

            (async () => {
              let journals = <WorkspaceJournalListType>await promisify(
                mApi().workspace.workspaces.journal.read(workspaceId, {
                  userEntityId,
                  firstResult: 0,
                  maxResults: 512,
                }),
                "callback"
              )();
              return journals;
            })(),

            (async () => {
              let assignments = <Array<MaterialAssignmentType>>await promisify(
                  mApi().workspace.workspaces.materials.read(workspaceId, {
                    assignmentType: "EVALUATED",
                  }),
                  "callback"
                )() || [];

              let materials: Array<MaterialContentNodeType>;
              let evaluations: Array<MaterialEvaluationType>;
              [materials, evaluations] = <any>await Promise.all([
                Promise.all(
                  assignments.map((assignment) => {
                    return promisify(
                      mApi().materials.html.read(assignment.materialId),
                      "callback"
                    )();
                  })
                ),
                Promise.all(
                  assignments.map((assignment) => {
                    return promisify(
                      mApi().workspace.workspaces.materials.evaluations.read(
                        workspaceId,
                        assignment.id,
                        {
                          userEntityId,
                        }
                      ),
                      "callback"
                    )().then((evaluations: Array<MaterialEvaluationType>) => {
                      return evaluations[0];
                    });
                  })
                ),
              ]);

              return materials.map((material, index) => {
                return <MaterialContentNodeType>Object.assign(material, {
                  evaluation: evaluations[index],
                  assignment: assignments[index],
                  path: assignments[index].path,
                });
              });
            })(),

            (async () => {
              const compositeRepliesList =
                <MaterialCompositeRepliesType[]>await promisify(
                  mApi().workspace.workspaces.compositeReplies.read(
                    workspaceId,
                    {
                      userEntityId,
                    }
                  ),
                  "callback"
                )() || [];

              return compositeRepliesList;
            })(),
          ]);

        dispatch({
          type: "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE",
          payload: {
            workspace,
            journals,
            materials,
            compositeReplies,
          },
        });
        dispatch({
          type: "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS",
          payload: <CurrentStudentUserAndWorkspaceStatusType>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18n.text.get(
              "plugin.records.errormessage.userWorkspaceLoadFailed"
            ),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_RECORDS_CURRENT_STUDENT_AND_WORKSPACE_STATUS",
          payload: <CurrentStudentUserAndWorkspaceStatusType>"ERROR",
        });
      }
    };
  };

let setLocationToStatisticsInTranscriptOfRecords: SetLocationToStatisticsInTranscriptOfRecordsTriggerType =
  function setLocationToStatisticsInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"statistics",
    };
  };

let setLocationToSummaryInTranscriptOfRecords: SetLocationToSummaryInTranscriptOfRecordsTriggerType =
  function setLocationToSummaryInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"summary",
    };
  };

let setLocationToYoInTranscriptOfRecords: SetLocationToYoInTranscriptOfRecordsTriggerType =
  function setLocationToYoInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"yo",
    };
  };

let setLocationToVopsInTranscriptOfRecords: SetLocationToVopsInTranscriptOfRecordsTriggerType =
  function setLocationToVopsInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"vops",
    };
  };

let setLocationToHopsInTranscriptOfRecords: SetLocationToHopsInTranscriptOfRecordsTriggerType =
  function setLocationToHopsInTranscriptOfRecords() {
    return {
      type: "UPDATE_RECORDS_LOCATION",
      payload: <TranscriptOfRecordLocationType>"hops",
    };
  };

let updateTranscriptOfRecordsFiles: UpdateTranscriptOfRecordsFilesTriggerType =
  function updateTranscriptOfRecordsFiles() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      let files: Array<UserFileType> = <Array<UserFileType>>(
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
  setCurrentStudentUserViewAndWorkspace,
  setLocationToVopsInTranscriptOfRecords,
  setLocationToStatisticsInTranscriptOfRecords,
  setLocationToYoInTranscriptOfRecords,
  setLocationToHopsInTranscriptOfRecords,
  setLocationToSummaryInTranscriptOfRecords,
  updateTranscriptOfRecordsFiles,
};
