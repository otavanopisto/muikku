import actions from "../../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  SummaryDataType,
  SummaryStatusType,
} from "~/reducers/main-function/records/summary";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import MApi, { isMApiError } from "~/api/api";
import { Dispatch, Action } from "redux";
import i18n from "~/locales/i18n";
import { ActivityLogEntry, ActivityLogType } from "~/generated/client";

export type UPDATE_STUDIES_SUMMARY = SpecificActionType<
  "UPDATE_STUDIES_SUMMARY",
  SummaryDataType
>;
export type UPDATE_STUDIES_SUMMARY_STATUS = SpecificActionType<
  "UPDATE_STUDIES_SUMMARY_STATUS",
  SummaryStatusType
>;
/**
 * UpdateSummaryTriggerType
 */
export interface UpdateSummaryTriggerType {
  (studentIdentifier?: string): AnyActionType;
}

/**
 * UpdateSummaryTriggerType
 * @param studentIdentifier student pyramus identifier
 */
const updateSummary: UpdateSummaryTriggerType = function updateSummary(
  studentIdentifier
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const recordsApi = MApi.getRecordsApi();
    const evaluationApi = MApi.getEvaluationApi();
    const userApi = MApi.getUserApi();
    const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();
    const workspaceApi = MApi.getWorkspaceApi();
    const activitylogsApi = MApi.getActivitylogsApi();
    const state = getState();
    try {
      // Get user id
      const pyramusIdentifier = studentIdentifier
        ? studentIdentifier
        : state.status.userSchoolDataIdentifier;

      if (state.summary.status === "READY") {
        return null;
      }

      dispatch({
        type: "UPDATE_STUDIES_SUMMARY_STATUS",
        payload: <SummaryStatusType>"LOADING",
      });

      const eligibility = await recordsApi.getStudentMatriculationEligibility({
        studentIdentifier: pyramusIdentifier,
      });

      const activityLogsHash = await activitylogsApi.getUserActivityLogs({
        userIdentifier: pyramusIdentifier,
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: new Date(),
      });

      // We need returned exercises and evaluated courses
      const assignmentsDone: ActivityLogType[] = [];
      const coursesDone: ActivityLogType[] = [];

      // Student's study time
      const studentsDetails = await userApi.getStudent({
        studentId: pyramusIdentifier,
      });

      // Convert key value pairs to array of array of objects
      const activityArrays: ActivityLogEntry[][] = Object.keys(
        activityLogsHash
      ).map((key) => activityLogsHash[key]);

      // Picking the done exercises and evaluated courses from the objects
      activityArrays.forEach((element) => {
        element.find(function (param) {
          param.type == "MATERIAL_ASSIGNMENTDONE"
            ? assignmentsDone.push(param.type)
            : param.type == "EVALUATION_GOTPASSED"
              ? coursesDone.push(param.type)
              : null;
        });
      });

      const workspaces = (await workspaceApi.getWorkspaces({
        userIdentifier: pyramusIdentifier,
        includeInactiveWorkspaces: true,
      })) as WorkspaceDataType[];

      if (workspaces && workspaces.length) {
        await Promise.all([
          Promise.all(
            workspaces.map(async (workspace, index) => {
              const activity = await evaluationApi.getWorkspaceStudentActivity({
                workspaceId: workspace.id,
                studentEntityId: pyramusIdentifier,
              });
              workspaces[index].activity = activity;
            })
          ),
          Promise.all(
            workspaces.map(async (workspace, index) => {
              const statistics =
                await workspaceDiscussionApi.getWorkspaceDiscussionStatistics({
                  workspaceEntityId: workspace.id,
                  userIdentifier: pyramusIdentifier,
                });

              workspaces[index].forumStatistics = statistics;
            })
          ),
          Promise.all(
            workspaces.map(async (workspace, index) => {
              const courseActivity =
                await activitylogsApi.getWorkspaceActivityLogs({
                  userIdentifier: pyramusIdentifier,
                  workspaceEntityId: workspace.id,
                  from: new Date(new Date().getFullYear() - 2, 0),
                  to: new Date(),
                });

              workspaces[index].activityLogs = courseActivity;
            })
          ),
        ]);
      }

      const graphData = {
        activity: activityLogsHash.general,
        workspaces: workspaces,
      };

      /* Does have matriculation examination in goals? */
      const summaryData: SummaryDataType = {
        eligibilityStatus: eligibility.coursesCompleted,
        activity: activityLogsHash.general.length,
        returnedExercises: assignmentsDone.length,
        coursesDone: coursesDone.length,
        graphData: graphData,
        studentsDetails: studentsDetails,
      };

      dispatch({
        type: "UPDATE_STUDIES_SUMMARY",
        payload: summaryData,
      });

      dispatch({
        type: "UPDATE_STUDIES_SUMMARY_STATUS",
        payload: <SummaryStatusType>"READY",
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        actions.displayNotification(
          i18n.t("notifications.updateError", {
            ns: "studies",
            context: "summary",
          }),
          "error"
        )
      );
    }
  };
};

export default { updateSummary };
export { updateSummary };
