import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { ExamAttendance, MaterialCompositeReply } from "~/generated/client";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * WorkspaceExamsState
 */
export interface ExamsState {
  initializeStatus: ReducerStateType;
  examsStatus: ReducerStateType;
  exams: ExamAttendance[];
  currentExam: ExamAttendance | null;
  currentExamStatus: ReducerStateType;
  examsCompositeReplies: MaterialCompositeReply[];
  examsCompositeRepliesStatus: ReducerStateType;
}

/**
 * initialWorkspaceExamsState
 */
const initialWorkspaceExamsState: ExamsState = {
  initializeStatus: "IDLE",
  examsStatus: "IDLE",
  exams: [],
  currentExam: null,
  currentExamStatus: "IDLE",
  examsCompositeReplies: [],
  examsCompositeRepliesStatus: "IDLE",
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

    case "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES":
      return {
        ...state,
        examsCompositeReplies: action.payload,
      };

    case "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLIES_STATUS":
      return {
        ...state,
        examsCompositeRepliesStatus: action.payload,
      };

    case "EXAMS_UPDATE_EXAMS_COMPOSITE_REPLY_STATE_VIA_ID_NO_ANSWER": {
      let wasUpdated = false;
      let newExamsCompositeReplies = state.examsCompositeReplies.map(
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
      return { ...state, examsCompositeReplies: newExamsCompositeReplies };
    }

    case "EXAMS_UPDATE_CURRENT_EXAM":
      return {
        ...state,
        currentExam: action.payload,
      };

    case "EXAMS_UPDATE_CURRENT_EXAM_STATUS":
      return {
        ...state,
        currentExamStatus: action.payload,
      };

    default:
      return state;
  }
};
