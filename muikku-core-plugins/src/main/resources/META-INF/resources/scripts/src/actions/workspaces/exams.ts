import { Action, Dispatch } from "redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import {
  ExamAttendance,
  MaterialCompositeReply,
  MaterialCompositeReplyStateType,
  MaterialReply,
} from "~/generated/client";
import i18n from "~/locales/i18n";
import { StateType } from "~/reducers";
import { ReducerStateType } from "~/reducers/workspaces/exams";
import { displayNotification } from "../base/notifications";

const examsApi = MApi.getExamApi();
const workspaceApi = MApi.getWorkspaceApi();

export type EXAMS_INITIALIZE_STATUS = SpecificActionType<
  "EXAMS_INITIALIZE_STATUS",
  ReducerStateType
>;

// EXAMS
export type EXAMS_UPDATE_EXAMS = SpecificActionType<
  "EXAMS_UPDATE_EXAMS",
  ExamAttendance[]
>;

export type EXAMS_UPDATE_EXAMS_STATUS = SpecificActionType<
  "EXAMS_UPDATE_EXAMS_STATUS",
  ReducerStateType
>;

// EXAMS_COMPOSITE_REPLIES
export type EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES = SpecificActionType<
  "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES",
  MaterialCompositeReply[]
>;

export type EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES_STATUS = SpecificActionType<
  "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES_STATUS",
  ReducerStateType
>;

export type EXAMS_UPDATE_EXAMS_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER =
  SpecificActionType<
    "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER",
    {
      state: MaterialCompositeReplyStateType;
      workspaceMaterialId: number;
      workspaceMaterialReplyId: number;
    }
  >;

// EXAMS_CURRENT_EXAM
export type EXAMS_UPDATE_CURRENT_EXAM = SpecificActionType<
  "EXAMS_UPDATE_CURRENT_EXAM",
  ExamAttendance
>;

export type EXAMS_UPDATE_CURRENT_EXAM_STATUS = SpecificActionType<
  "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
  ReducerStateType
>;

/**
 * InitializeExamTriggerType
 */
interface InitializeExamsTriggerType {
  (data: {
    workspaceEntityId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

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
 * LoadExamsCompositeRepliesTriggerType
 */
interface LoadExamsCompositeRepliesTriggerType {
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
 * CancelExamTriggerType
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CancelExamTriggerType {
  (): AnyActionType;
}

/**
 * UpdateAssignmentStateTriggerType
 */
interface UpdateAssignmentStateTriggerType {
  (data: {
    successState: MaterialCompositeReplyStateType;
    avoidServerCall: boolean;
    workspaceId: number;
    workspaceMaterialId: number;
    existantReplyId?: number;
    successMessage?: string;
    callback?: () => void;
  }): AnyActionType;
}

/**
 * InitializeExamTriggerType
 * @param data data
 *
 * @returns AnyActionType
 */
const initializeExams: InitializeExamsTriggerType = function initializeExams(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>,
    getState: () => StateType
  ) => {
    dispatch({ type: "EXAMS_INITIALIZE_STATUS", payload: "LOADING" });

    const promises = [
      dispatch(loadExams({ workspaceEntityId: data.workspaceEntityId })),
      dispatch(
        loadExamsCompositeReplies({ workspaceEntityId: data.workspaceEntityId })
      ),
    ];

    await Promise.all(promises);

    dispatch({ type: "EXAMS_INITIALIZE_STATUS", payload: "READY" });
  };
};

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
 * LoadExamsCompositeRepliesTriggerType
 * @param data data
 * @returns AnyActionType
 */
const loadExamsCompositeReplies: LoadExamsCompositeRepliesTriggerType =
  function loadExamsCompositeReplies(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      if (state.exams.examsCompositeRepliesStatus === "LOADING") {
        return;
      }

      dispatch({
        type: "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES_STATUS",
        payload: "LOADING",
      });

      try {
        const compositeReplies =
          await workspaceApi.getWorkspaceCompositeReplies({
            workspaceEntityId: data.workspaceEntityId,
          });

        dispatch({
          type: "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES",
          payload: compositeReplies || [],
        });

        dispatch({
          type: "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES_STATUS",
          payload: "READY",
        });
      } catch (error) {
        if (!isMApiError(error)) {
          throw error;
        }

        dispatch({
          type: "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES_STATUS",
          payload: "ERROR",
        });
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

/**
 * UpdateAssignmentStateTriggerType
 * @param data data
 * @returns AnyActionType
 */
const updateAssignmentState: UpdateAssignmentStateTriggerType =
  function updateAssignmentState(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const {
        successState,
        avoidServerCall,
        workspaceId,
        workspaceMaterialId,
        existantReplyId,
        callback,
      } = data;

      try {
        let replyId: number = existantReplyId;
        if (!avoidServerCall) {
          let replyGenerated: MaterialReply = null;

          if (existantReplyId) {
            replyGenerated = await workspaceApi.updateWorkspaceMaterialReply({
              workspaceEntityId: workspaceId,
              workspaceMaterialId: workspaceMaterialId,
              replyId: existantReplyId,
              updateWorkspaceMaterialReplyRequest: {
                state: successState,
              },
            });
          } else {
            replyGenerated = await workspaceApi.createWorkspaceMaterialReply({
              workspaceEntityId: workspaceId,
              workspaceMaterialId: workspaceMaterialId,
              createWorkspaceMaterialReplyRequest: {
                state: successState,
              },
            });
          }

          replyId = replyGenerated ? replyGenerated.id : existantReplyId;
        }
        if (!replyId) {
          const result = await workspaceApi.getWorkspaceMaterialReplies({
            workspaceEntityId: workspaceId,
            workspaceMaterialId: workspaceMaterialId,
          });

          if (result[0] && result[0].id) {
            replyId = result[0].id;
          }
        }

        dispatch({
          type: "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER",
          payload: {
            workspaceMaterialReplyId: replyId,
            state: successState,
            workspaceMaterialId,
          },
        });

        callback && callback();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "workspace",
              context: "answers",
            }),
            "error"
          )
        );
      }
    };
  };

export { initializeExams, loadExams, startExam, updateAssignmentState };
