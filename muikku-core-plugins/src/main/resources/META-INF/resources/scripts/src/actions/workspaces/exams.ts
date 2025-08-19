import { Action, Dispatch } from "redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import { ExamAttendance } from "~/generated/client";
import { StateType } from "~/reducers";
import { ReducerStateType } from "~/reducers/workspaces/exams";

const examsApi = MApi.getExamApi();

export type EXAMS_INITIALIZE_STATUS = SpecificActionType<
  "EXAMS_INITIALIZE_STATUS",
  ReducerStateType
>;

export type EXAMS_UPDATE_EXAMS = SpecificActionType<
  "EXAMS_UPDATE_EXAMS",
  ExamAttendance[]
>;

export type EXAMS_UPDATE_EXAMS_STATUS = SpecificActionType<
  "EXAMS_UPDATE_EXAMS_STATUS",
  ReducerStateType
>;

export type EXAMS_UPDATE_CURRENT_EXAM = SpecificActionType<
  "EXAMS_UPDATE_CURRENT_EXAM",
  ExamAttendance
>;

export type EXAMS_UPDATE_CURRENT_EXAM_STATUS = SpecificActionType<
  "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
  ReducerStateType
>;

/**
 * LoadExamsTriggerType
 */
interface LoadExamsTriggerType {
  (data: {
    workspaceEntityId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * SelectExamTriggerType
 */
interface StartExamTriggerType {
  (data: {
    workspaceFolderId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadExamsTriggerType
 * @param data data
 * @returns AnyActionType
 */
const loadExams: LoadExamsTriggerType = function loadExams(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();

    if (state.exams.examsStatus === "LOADING") {
      return;
    }

    dispatch({ type: "EXAMS_UPDATE_EXAMS_STATUS", payload: "LOADING" });

    try {
      const exams = await examsApi.getExamAttendances({
        workspaceEntityId: data.workspaceEntityId,
      });

      dispatch({ type: "EXAMS_UPDATE_EXAMS", payload: exams });
      dispatch({ type: "EXAMS_UPDATE_EXAMS_STATUS", payload: "READY" });
    } catch (error) {
      if (!isMApiError(error)) {
        throw error;
      }

      dispatch({ type: "EXAMS_UPDATE_EXAMS_STATUS", payload: "ERROR" });
    }
  };
};

/**
 * SelectExamTriggerType
 * @param data data
 * @returns AnyActionType
 */
const startExam: StartExamTriggerType = function startExam(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const state = getState();

    if (state.exams.currentExamStatus === "LOADING") {
      return;
    }

    try {
      dispatch({
        type: "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
        payload: "LOADING",
      });

      const exam = await examsApi.startExam({
        workspaceFolderId: data.workspaceFolderId,
      });
      dispatch({ type: "EXAMS_UPDATE_CURRENT_EXAM", payload: exam });
      dispatch({ type: "EXAMS_UPDATE_CURRENT_EXAM_STATUS", payload: "READY" });
    } catch (error) {
      if (!isMApiError(error)) {
        throw error;
      }

      // If the exam is already started, redirect to the exam instance
      if (isResponseError(error) && error.response.status === 400) {
        // Find the started exam from the exams list
        const startedExam = state.exams.exams.find(
          (exam) => exam.folderId === data.workspaceFolderId
        );

        // If the exam is found, update that as current exam to state
        if (startedExam) {
          dispatch({ type: "EXAMS_UPDATE_CURRENT_EXAM", payload: startedExam });
          dispatch({
            type: "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
            payload: "READY",
          });
        }
      }
    }
  };
};

export { loadExams, startExam };
