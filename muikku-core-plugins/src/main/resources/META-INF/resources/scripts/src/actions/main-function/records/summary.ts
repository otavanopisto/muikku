import actions from "../../base/notifications";
import { AppThunkAction, SpecificActionType } from "~/actions";
import {
  SummaryDataType,
  SummaryStatusType,
  SummaryStudyProgress,
} from "~/reducers/main-function/records/summary";
import { WorkspaceDataType } from "~/reducers/workspaces";
import MApi, { isMApiError } from "~/api/api";
import i18n from "~/locales/i18n";
import {
  ActivityLogEntry,
  ActivityLogType,
  StudentStudyActivity,
} from "~/generated/client";
import {
  filterActivityBySubjects,
  LANGUAGE_SUBJECTS_CS,
  OTHER_SUBJECT_OUTSIDE_HOPS_CS,
  SKILL_AND_ART_SUBJECTS_CS,
  filterActivity,
} from "~/helper-functions/study-matrix";

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
  (studentIdentifier?: string): AppThunkAction;
}

/**
 * UpdateStudyProgressTriggerType
 */
export interface UpdateStudyProgressTriggerType {
  (data: { studyProgress: SummaryStudyProgress }): AppThunkAction;
}

/**
 * Interface for the suggested next websocket thunk action creator
 */
export interface RecordsSummarySuggestedNextWebsocketType {
  (data: { websocketData: StudentStudyActivity }): AppThunkAction;
}

/**
 * Interface for the workspace signup websocket thunk action creator
 */
export interface RecordsSummaryWorkspaceSignupWebsocketType {
  (data: {
    websocketData: StudentStudyActivity | StudentStudyActivity[];
  }): AppThunkAction;
}

/**
 * Interface for the alternative study options websocket thunk action creator
 */
export interface RecordsSummaryAlternativeStudyOptionsWebsocketType {
  (data: { websocketData: string[] }): AppThunkAction;
}

const hopsApi = MApi.getHopsApi();

/**
 * UpdateSummaryTriggerType
 * @param studentIdentifier student pyramus identifier
 */
const updateSummary: UpdateSummaryTriggerType = function updateSummary(
  studentIdentifier
) {
  return async (dispatch, getState) => {
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

      /**
       * Study progress promise
       */
      const studyProgressPromise = async () => {
        const studentActivity = await hopsApi.getStudentStudyActivity({
          studentIdentifier: pyramusIdentifier,
        });

        const studentOptions = await hopsApi.getStudentAlternativeStudyOptions({
          studentIdentifier: pyramusIdentifier,
        });

        const skillAndArtCourses = filterActivityBySubjects(
          SKILL_AND_ART_SUBJECTS_CS,
          studentActivity
        );

        const otherLanguageSubjects = filterActivityBySubjects(
          LANGUAGE_SUBJECTS_CS,
          studentActivity
        );

        const otherSubjects = filterActivityBySubjects(
          OTHER_SUBJECT_OUTSIDE_HOPS_CS,
          studentActivity
        );

        const studentActivityByStatus = filterActivity(studentActivity);

        const studyProgress: SummaryStudyProgress = {
          skillsAndArt: skillAndArtCourses,
          otherLanguageSubjects: otherLanguageSubjects,
          otherSubjects: otherSubjects,
          gradedList: studentActivityByStatus.gradedList,
          onGoingList: studentActivityByStatus.onGoingList,
          suggestedNextList: studentActivityByStatus.suggestedNextList,
          transferedList: studentActivityByStatus.transferedList,
          needSupplementationList:
            studentActivityByStatus.needSupplementationList,
          studentChoices: [],
          supervisorOptionalSuggestions: [],
          options: studentOptions,
        };

        return studyProgress;
      };

      const studyProgress = await studyProgressPromise();

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
        studyProgress: studyProgress,
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

/**
 * Thunk action creator for the suggested next websocket
 * @param data data
 */
const recordsSummarySuggestedNextWebsocket: RecordsSummarySuggestedNextWebsocketType =
  function recordsSummarySuggestedNextWebsocket(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const summaryData = state.summary?.data;

      if (!summaryData) {
        return null;
      }

      const { websocketData } = data;

      const { suggestedNextList } = summaryData.studyProgress;

      const updatedSuggestedNextList: StudentStudyActivity[] = [].concat(
        suggestedNextList
      );

      // If course id is null, meaning that delete existing activity course by
      // finding that specific course with subject code and course number and splice it out
      const indexOfCourse = updatedSuggestedNextList.findIndex(
        (item) =>
          item.courseId === websocketData.courseId &&
          websocketData.subject === item.subject
      );

      if (indexOfCourse !== -1) {
        updatedSuggestedNextList.splice(indexOfCourse, 1);
      } else {
        // Add new
        updatedSuggestedNextList.push(websocketData);
      }

      const studyProgress: SummaryStudyProgress = {
        ...summaryData.studyProgress,
        suggestedNextList: updatedSuggestedNextList,
      };

      dispatch({
        type: "UPDATE_STUDIES_SUMMARY",
        payload: {
          ...getState().summary.data,
          studyProgress: studyProgress,
        },
      });
    };
  };

/**
 * Thunk action creator for the workspace signup websocket
 * @param data data
 */
const recordsSummaryWorkspaceSignupWebsocket: RecordsSummaryWorkspaceSignupWebsocketType =
  function recordsSummaryWorkspaceSignupWebsocket(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const summaryData = state.summary?.data;

      if (!summaryData) {
        return null;
      }

      const { websocketData } = data;

      const { studyProgress } = summaryData;
      const { suggestedNextList, onGoingList, gradedList, transferedList } =
        studyProgress;

      // Combine all course lists and filter out the updated course
      let allCourses = [
        ...onGoingList,
        ...gradedList,
        ...transferedList,
        ...suggestedNextList,
      ];
      const courseIdToFilter = Array.isArray(websocketData)
        ? websocketData[0].courseId
        : websocketData.courseId;
      allCourses = allCourses.filter(
        (item) => item.courseId !== courseIdToFilter
      );

      // Add the new course(s)
      allCourses = allCourses.concat(websocketData);

      // Get filtered course lists
      const categorizedCourses = {
        ...filterActivity(allCourses), // This adds suggestedNextList, onGoingList, gradedList, transferedList
      };

      dispatch({
        type: "UPDATE_STUDIES_SUMMARY",
        payload: {
          ...getState().summary.data,
          studyProgress: {
            ...studyProgress,
            ...categorizedCourses,
          },
        },
      });
    };
  };

/**
 * Thunk action creator for the alternative study options websocket
 * @param data data
 */
const recordsSummaryAlternativeStudyOptionsWebsocket: RecordsSummaryAlternativeStudyOptionsWebsocketType =
  function recordsSummaryAlternativeStudyOptionsWebsocket(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const summaryData = state.summary?.data;

      if (!summaryData) {
        return null;
      }

      const { studyProgress } = summaryData;

      dispatch({
        type: "UPDATE_STUDIES_SUMMARY",
        payload: {
          ...getState().summary.data,
          studyProgress: { ...studyProgress, options: data.websocketData },
        },
      });
    };
  };

export default {
  updateSummary,
  recordsSummarySuggestedNextWebsocket,
  recordsSummaryWorkspaceSignupWebsocket,
  recordsSummaryAlternativeStudyOptionsWebsocket,
};
export {
  updateSummary,
  recordsSummarySuggestedNextWebsocket,
  recordsSummaryWorkspaceSignupWebsocket,
  recordsSummaryAlternativeStudyOptionsWebsocket,
};
