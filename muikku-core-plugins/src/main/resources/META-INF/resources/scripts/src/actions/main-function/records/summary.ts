import actions from "../../base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  SummaryDataType,
  SummaryStatusType,
} from "~/reducers/main-function/records/summary";
import { ActivityLogType, WorkspaceDataType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import MApi from "~/api/api";
import { Dispatch } from "react-redux";
import i18n from "~/locales/i18n";

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
  (): AnyActionType;
}

/**
 * UpdateSummaryTriggerType
 */
const updateSummary: UpdateSummaryTriggerType = function updateSummary() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const recordsApi = MApi.getRecordsApi();
    const evaluationApi = MApi.getEvaluationApi();
    const userApi = MApi.getUserApi();
    const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();
    const workspaceApi = MApi.getWorkspaceApi();

    try {
      dispatch({
        type: "UPDATE_STUDIES_SUMMARY_STATUS",
        payload: <SummaryStatusType>"LOADING",
      });

      /* Get user id */
      const pyramusId = getState().status.userSchoolDataIdentifier;

      /* We need completed courses from Eligibility */
      const eligibility = await recordsApi.getStudentMatriculationEligibility({
        studentIdentifier: pyramusId,
      });

      /* We need past month activity */
      const activityLogs: any = await promisify(
        mApi().activitylogs.user.read(pyramusId, {
          from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          to: new Date(),
        }),
        "callback"
      )();

      /* We need returned exercises and evaluated courses */
      const assignmentsDone: Record<string, unknown>[] = [];
      const coursesDone: Record<string, unknown>[] = [];

      /* Student's study time */
      const studentsDetails = await userApi.getStudent({
        studentId: pyramusId,
      });

      /* Getting past the object with keys */
      const activityArrays: Record<string, unknown>[] = Object.keys(
        activityLogs
      ).map((key) => activityLogs[key]);

      /* Picking the done exercises and evaluated courses from the objects */
      activityArrays.forEach((element: any) => {
        element.find(function (param: any) {
          param["type"] == "MATERIAL_ASSIGNMENTDONE"
            ? assignmentsDone.push(param["type"])
            : param["type"] == "EVALUATION_GOTPASSED"
            ? coursesDone.push(param["type"])
            : null;
        });
      });

      const workspaces = (await workspaceApi.getWorkspaces({
        userIdentifier: pyramusId,
        includeInactiveWorkspaces: true,
      })) as WorkspaceDataType[];

      if (workspaces && workspaces.length) {
        await Promise.all([
          Promise.all(
            workspaces.map(async (workspace, index) => {
              const activity = await evaluationApi.getWorkspaceStudentActivity({
                workspaceId: workspace.id,
                studentEntityId: pyramusId,
              });
              workspaces[index].activity = activity;
            })
          ),
          Promise.all(
            workspaces.map(async (workspace, index) => {
              const statistics =
                await workspaceDiscussionApi.getWorkspaceDiscussionStatistics({
                  workspaceEntityId: workspace.id,
                  userIdentifier: pyramusId,
                });

              workspaces[index].forumStatistics = statistics;
            })
          ),
          Promise.all(
            workspaces.map(async (workspace, index) => {
              const courseActivity: ActivityLogType[] = <ActivityLogType[]>(
                await promisify(
                  mApi().activitylogs.user.workspace.read(pyramusId, {
                    workspaceEntityId: workspace.id,
                    from: new Date(new Date().getFullYear() - 2, 0),
                    to: new Date(),
                  }),
                  "callback"
                )()
              );
              workspaces[index].activityLogs = courseActivity;
            })
          ),
        ]);
      }

      const graphData = {
        activity: activityLogs.general,
        workspaces: workspaces,
      };

      /* Does have matriculation examination in goals? */
      const summaryData: SummaryDataType = {
        eligibilityStatus: eligibility.coursesCompleted,
        activity: activityLogs.general.length,
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
      if (!(err instanceof MApiError)) {
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
