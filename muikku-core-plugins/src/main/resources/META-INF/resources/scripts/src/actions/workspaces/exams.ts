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
import {
  ReducerStateInfo,
  ReducerStateType,
} from "~/reducers/workspaces/exams";
import { displayNotification } from "../base/notifications";
import _ from "lodash";
import { ExamTimerRegistry } from "~/util/exam-timer";

const examsApi = MApi.getExamApi();
const workspaceApi = MApi.getWorkspaceApi();

// OVERALL EXAM STATUS
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
  { exam: ExamAttendance; updateExamToList: boolean }
>;

export type EXAMS_UPDATE_CURRENT_EXAM_STATUS = SpecificActionType<
  "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
  ReducerStateInfo
>;

export type EXAMS_UPDATE_CURRENT_EXAMS_END_EXAM = SpecificActionType<
  "EXAMS_UPDATE_CURRENT_EXAMS_END_EXAM",
  ExamAttendance
>;

export type EXAMS_RESET_CURRENT_EXAM = SpecificActionType<
  "EXAMS_RESET_CURRENT_EXAM",
  void
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
 * EndExamTriggerType
 */
interface EndExamTriggerType {
  (data: { onSuccess?: () => void; onFail?: () => void }): AnyActionType;
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
 * Initializes exams. Loads exams and exams composite replies.
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
    const state = getState();

    if (
      state.exams.initializeStatus === "LOADING" ||
      state.exams.initializeStatus === "READY"
    ) {
      return;
    }

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
 * Loads exams. Sets also timers for exams that are already started.
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

      // Start timers for exams that meet our conditions
      const timerRegistry = ExamTimerRegistry.getInstance();
      for (const exam of exams) {
        // Start timer if exam has started, not marked as ended and has duration
        if (!exam.ended && exam.started && exam.minutes > 0) {
          timerRegistry.startTimer(exam.folderId, exam.started, exam.minutes);
        }
      }

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
 * Loads exams composite replies.
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
 * Start exam. Post request to start the exam and update the current exam.
 * If exam data is returned even if the exam is already started, update the current exam.
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

    if (state.exams.currentExamStatusInfo.status === "LOADING") {
      return;
    }

    try {
      dispatch({
        type: "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
        payload: {
          status: "LOADING",
        },
      });

      const updatedExam = await examsApi.startExam({
        workspaceFolderId: data.workspaceFolderId,
      });

      // Variable whether to update the exams list also
      let updateExamToList = false;

      // Check if the exam data has changed
      for (const exam of state.exams.exams) {
        if (exam.folderId === updatedExam.folderId) {
          if (!_.isEqual(exam, updatedExam)) {
            updateExamToList = true;
          }
        }
      }

      dispatch({
        type: "EXAMS_UPDATE_CURRENT_EXAM",
        payload: {
          exam: updatedExam,
          updateExamToList,
        },
      });
      dispatch({
        type: "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
        payload: {
          status: "READY",
        },
      });
    } catch (error) {
      if (!isMApiError(error)) {
        throw error;
      }

      //If trying to start an exam that user has not access
      if (isResponseError(error) && error.response.status === 403) {
        dispatch({
          type: "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
          payload: {
            status: "ERROR",
            statusCode: error.response.status,
          },
        });
      }
    }
  };
};

/**
 * Ends the exam. Post request to end the exam and update the current exam.
 * Stops the timer for the exam.
 * @param data data
 * @returns AnyActionType
 */
const endExam: EndExamTriggerType = function endExam(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();

    const currentExam = state.exams.currentExam;

    if (!currentExam) {
      return;
    }

    try {
      dispatch({
        type: "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
        payload: {
          status: "LOADING",
        },
      });

      const exam = await examsApi.endExam({
        workspaceFolderId: currentExam.folderId,
      });

      // Stop timer for the exam
      const timerRegistry = ExamTimerRegistry.getInstance();
      timerRegistry.stopTimer(currentExam.folderId);

      dispatch({
        type: "EXAMS_UPDATE_CURRENT_EXAMS_END_EXAM",
        payload: exam,
      });

      dispatch({
        type: "EXAMS_UPDATE_CURRENT_EXAM_STATUS",
        payload: {
          status: "READY",
        },
      });

      data.onSuccess && data.onSuccess();
    } catch (error) {
      if (!isMApiError(error)) {
        throw error;
      }

      data.onFail && data.onFail();
    }
  };
};

/**
 * Updates the state of an assignment.
 * If the assignment is not answered, creates a new reply.
 * If the assignment is already answered, updates the existing reply.
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

export {
  initializeExams,
  loadExams,
  startExam,
  endExam,
  updateAssignmentState,
};
