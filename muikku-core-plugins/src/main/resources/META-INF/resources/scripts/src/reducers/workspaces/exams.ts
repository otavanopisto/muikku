import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { ExamAttendance } from "~/generated/client";

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * WorkspaceExamsState
 */
export interface ExamsState {
  examsStatus: ReducerStateType;
  exams: ExamAttendance[];
  currentExam: ExamAttendance | null;
  currentExamStatus: ReducerStateType;
}

/**
 * initialWorkspaceExamsState
 */
const initialWorkspaceExamsState: ExamsState = {
  examsStatus: "IDLE",
  exams: [],
  currentExam: null,
  currentExamStatus: "IDLE",
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
        examsStatus: action.payload,
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
