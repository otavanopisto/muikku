import actions from "../../base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  SummaryDataType,
  SummaryStatusType
} from "~/reducers/main-function/records/summary";
import {
  WorkspaceStudentActivityType,
  WorkspaceForumStatisticsType,
  ActivityLogType
} from "~/reducers/workspaces";
import { StateType } from "~/reducers";

export interface UPDATE_STUDIES_SUMMARY
  extends SpecificActionType<"UPDATE_STUDIES_SUMMARY", SummaryDataType> {}
export interface UPDATE_STUDIES_SUMMARY_STATUS
  extends SpecificActionType<
    "UPDATE_STUDIES_SUMMARY_STATUS",
    SummaryStatusType
  > {}
export interface UpdateSummaryTriggerType {
  (): AnyActionType;
}

let updateSummary: UpdateSummaryTriggerType = function updateSummary() {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "UPDATE_STUDIES_SUMMARY_STATUS",
        payload: <SummaryStatusType>"LOADING"
      });

      /* Get user id */
      let pyramusId = getState().status.userSchoolDataIdentifier;

      /* We need completed courses from Eligibility */
      let eligibility: any = await promisify(
        mApi().records.studentMatriculationEligibility.read(pyramusId),
        "callback"
      )();

      /* We need past month activity */
      let activityLogs: any = await promisify(
        mApi().activitylogs.user.read(pyramusId, {
          from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          to: new Date()
        }),
        "callback"
      )();

      /* We need returned exercises and evaluated courses */
      let assignmentsDone: any = [];
      let coursesDone: any = [];

      /* Student's study time */
      let studentsDetails: any = await promisify(
        mApi().user.students.read(pyramusId),
        "callback"
      )();

      /* Student's user groups */
      let studentsUserGroups: any = await promisify(
        mApi().usergroup.groups.read({ userIdentifier: pyramusId }),
        "callback"
      )();

      let studentsStudentCouncelors: any = [];

      /*
        We need to filter student's usergroups that are guidance groups, then we fetch guidance councelors
        of those usergroups and push the result to studentsGuidanceCouncelors array
      */
      if (studentsUserGroups && studentsUserGroups.length) {
        studentsUserGroups
          .filter(
            (studentsUserGroup: any) =>
              studentsUserGroup.isGuidanceGroup == true
          )
          .forEach(function (studentsUserGroup: any) {
            mApi()
              .usergroup.groups.staffMembers.read(studentsUserGroup.id, {
                properties:
                  "profile-phone,profile-vacation-start,profile-vacation-end"
              })
              .callback(function (err: any, result: any) {
                result.forEach(function (studentsStudentCouncelor: any) {
                  if (
                    !studentsStudentCouncelors.some(
                      (existingStudentCouncelor: any) =>
                        existingStudentCouncelor.userEntityId ==
                        studentsStudentCouncelor.userEntityId
                    )
                  ) {
                    studentsStudentCouncelors.push(studentsStudentCouncelor);
                    studentsStudentCouncelors.sort(function (x: any, y: any) {
                      let a = x.lastName.toUpperCase(),
                        b = y.lastName.toUpperCase();
                      return a == b ? 0 : a > b ? 1 : -1;
                    });
                  }
                });
              });
          });
      }

      /* Getting past the object with keys */
      let activityArrays: any = Object.keys(activityLogs).map(
        (key) => activityLogs[key]
      );

      /* Picking the done exercises and evaluated courses from the objects */
      activityArrays.forEach(function (element: any) {
        element.find(function (param: any) {
          param["type"] == "MATERIAL_ASSIGNMENTDONE"
            ? assignmentsDone.push(param["type"])
            : param["type"] == "EVALUATION_GOTPASSED"
            ? coursesDone.push(param["type"])
            : null;
        });
      });

      /* User workspaces */
      let workspaces: any = await promisify(
        mApi().workspace.workspaces.read({
          userIdentifier: pyramusId,
          includeInactiveWorkspaces: true
        }),
        "callback"
      )();

      if (workspaces && workspaces.length) {
        await Promise.all([
          Promise.all(
            workspaces.map(async (workspace: any, index: any) => {
              let activity: WorkspaceStudentActivityType = <
                WorkspaceStudentActivityType
              >await promisify(
                mApi().guider.workspaces.studentactivity.read(
                  workspace.id,
                  pyramusId
                ),
                "callback"
              )();
              workspaces[index].studentActivity = activity;
            })
          ),
          Promise.all(
            workspaces.map(async (workspace: any, index: any) => {
              let statistics: WorkspaceForumStatisticsType = <
                WorkspaceForumStatisticsType
              >await promisify(
                mApi().workspace.workspaces.forumStatistics.read(workspace.id, {
                  userIdentifier: pyramusId
                }),
                "callback"
              )();
              workspaces[index].forumStatistics = statistics;
            })
          ),
          Promise.all(
            workspaces.map(async (workspace: any, index: any) => {
              let courseActivity: ActivityLogType[] = <ActivityLogType[]>(
                await promisify(
                  mApi().activitylogs.user.workspace.read(pyramusId, {
                    workspaceEntityId: workspace.id,
                    from: new Date(new Date().getFullYear() - 2, 0),
                    to: new Date()
                  }),
                  "callback"
                )()
              );
              workspaces[index].activityLogs = courseActivity;
            })
          )
        ]);
      }

      let graphData = {
        activity: activityLogs.general,
        workspaces: workspaces
      };

      /* Does have matriculation examination in goals? */
      let summaryData = {
        eligibilityStatus: eligibility.coursesCompleted,
        activity: activityLogs.general.length,
        returnedExercises: assignmentsDone.length,
        coursesDone: coursesDone.length,
        graphData: graphData,
        studentsDetails: studentsDetails,
        studentsStudentCouncelors: studentsStudentCouncelors
      };

      dispatch({
        type: "UPDATE_STUDIES_SUMMARY",
        payload: summaryData
      });

      dispatch({
        type: "UPDATE_STUDIES_SUMMARY_STATUS",
        payload: <SummaryStatusType>"READY"
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        actions.displayNotification(
          getState().i18n.text.get(
            "plugin.records.summary.errormessage.summaryUpdateFailed"
          ),
          "error"
        )
      );
    }
  };
};

export default { updateSummary };
export { updateSummary };
