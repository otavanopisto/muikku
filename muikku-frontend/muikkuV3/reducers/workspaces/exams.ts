import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { ExamAttendance, MaterialCompositeReply } from "~/generated/client";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * ReducerStateTypeWithMessage
 */
export interface ReducerStateInfo {
  status: ReducerStateType;
  statusCode?: number;
  message?: string;
}

/**
 * WorkspaceExamsState
 */
export interface ExamsState {
  initializeStatus: ReducerStateType;
  examsStatus: ReducerStateType;
  exams: ExamAttendance[];
  currentExam: ExamAttendance | null;
  currentExamStatusInfo: ReducerStateInfo;
  currentExamsActiveNodeId: number | null;
  currentExamCompositeReplies: MaterialCompositeReply[];
}

/**
 * initialWorkspaceExamsState
 */
const initialWorkspaceExamsState: ExamsState = {
  initializeStatus: "IDLE",
  examsStatus: "IDLE",
  exams: [],
  currentExam: null,
  currentExamStatusInfo: {
    status: "IDLE",
  },
  currentExamsActiveNodeId: null,
  currentExamCompositeReplies: [],
};

/**
 * exams
 * @param state state
 * @param action action
 * @returns WorkspaceExamsState
 */
export const exams: Reducer<ExamsState> = (
  state = initialWorkspaceExamsState,
  action: ActionType
) => {
  switch (action.type) {
    case "EXAMS_INITIALIZE_STATUS":
      return {
        ...state,
        initializeStatus: action.payload,
      };

    case "EXAMS_UPDATE_EXAMS":
      return {
        ...state,
        exams: action.payload,
      };

    case "EXAMS_UPDATE_EXAMS_STATUS":
      return {
        ...state,
        examsStatus: action.payload,
      };

    case "EXAMS_UPDATE_CURRENT_EXAM_COMPOSITE_REPLIES":
      return {
        ...state,
        currentExamCompositeReplies: action.payload,
      };

    case "EXAMS_UPDATE_CURRENT_EXAM_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER": {
      let wasUpdated = false;
      let newExamsCompositeReplies = state.currentExamCompositeReplies.map(
        (compositeReplies) => {
          if (
            compositeReplies.workspaceMaterialId ===
            action.payload.workspaceMaterialId
          ) {
            wasUpdated = true;
            return { ...compositeReplies, state: action.payload.state };
          }
          return compositeReplies;
        }
      );
      if (!wasUpdated) {
        newExamsCompositeReplies = newExamsCompositeReplies.concat([
          <MaterialCompositeReply>{ ...action.payload, lock: "NONE" },
        ]);
      }
      return {
        ...state,
        currentExamCompositeReplies: newExamsCompositeReplies,
      };
    }

    case "EXAMS_UPDATE_CURRENT_EXAM":
      return {
        ...state,
        currentExam: action.payload.exam,
        exams: action.payload.updateExamToList
          ? state.exams.map((exam) =>
              exam.folderId === action.payload.exam.folderId
                ? action.payload.exam
                : exam
            )
          : state.exams,
      };

    case "EXAMS_UPDATE_CURRENT_EXAM_STATUS":
      return {
        ...state,
        currentExamStatusInfo: action.payload,
      };

    case "EXAMS_UPDATE_CURRENT_EXAMS_END_EXAM":
      return {
        ...state,
        exams: state.exams.map((exam) =>
          exam.folderId === action.payload.folderId ? action.payload : exam
        ),
        currentExam: action.payload,
      };

    case "EXAMS_RESET_CURRENT_EXAM":
      return {
        ...state,
        currentExam: null,
        currentExamStatusInfo: {
          status: "IDLE",
          statusCode: undefined,
          message: undefined,
        },
        currentExamsActiveNodeId: null,
      };

    case "EXAMS_UPDATE_CURRENT_EXAMS_ACTIVE_NODE_ID":
      return {
        ...state,
        currentExamsActiveNodeId: action.payload,
      };

    default:
      return state;
  }
};
