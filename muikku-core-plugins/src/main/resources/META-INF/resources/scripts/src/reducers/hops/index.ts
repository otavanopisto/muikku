import { Reducer } from "redux";
import { HopsForm } from "~/@types/hops";
import { ActionType } from "~/actions";
import {
  HopsLocked,
  MatriculationEligibilityStatus,
  MatriculationExam,
  MatriculationExamChangeLogEntry,
  MatriculationPlan,
  MatriculationResults,
  MatriculationSubject,
  MatriculationSubjectEligibilityOPS2021,
  StudentInfo,
  HopsHistoryEntry,
} from "~/generated/client";
import { MatriculationAbistatus } from "~/helper-functions/abistatus";

/**
 * MatriculationSubjectWithEligibilityStatus
 */
export interface MatriculationSubjectWithEligibilityStatus {
  subjectCode: string;
  code: string;
  eligibility: MatriculationEligibilityStatus;
  requiredCount: number;
  acceptedCount: number;
  loading: boolean;
}

export type ReducerStateType = "LOADING" | "ERROR" | "READY" | "IDLE";

/**
 * HopsStudyPlanState
 */
interface HopsStudyPlanState {}

/**
 * MatriculationExamWithHistory
 */
export interface MatriculationExamWithHistory extends MatriculationExam {
  status: ReducerStateType;
  changeLogs: MatriculationExamChangeLogEntry[];
}

/**
 * MatriculationSubjectWithEligibility
 */
export interface MatriculationSubjectWithEligibility
  extends MatriculationSubjectEligibilityOPS2021 {
  subject: MatriculationSubject;
}

/**
 * MatriculationEligibility
 */
export interface MatriculationEligibilityWithAbistatus
  extends MatriculationAbistatus {
  personHasCourseAssessments: boolean;
}

/**
 * hopsMatriculation
 */
interface hopsMatriculation {
  exams: MatriculationExamWithHistory[];
  pastExams: MatriculationExamWithHistory[];
  subjects: MatriculationSubject[];
  subjectsWithEligibility: MatriculationSubjectWithEligibility[];
  eligibility: MatriculationEligibilityWithAbistatus | null;
  plan: MatriculationPlan | null;
  results: MatriculationResults[];
}

/**
 * HopsMode type
 */
export type HopsMode = "READ" | "EDIT";

/**
 * HopsEditingState
 */
export interface HopsEditingState {
  readyToEdit: boolean;
  hopsForm: HopsForm | null;
  matriculationPlan: MatriculationPlan | null;
}

/**
 * HopsState
 */
export interface HopsState {
  // CURRENT STUDENT IDENTIFIER
  currentStudentIdentifier: string | null;
  currentStudentStudyProgramme: string | null;

  // HOPS STUDY PLAN
  hopsStudyPlanStatus: ReducerStateType;
  hopsStudyPlanState: HopsStudyPlanState;

  // HOPS EXAMINATION
  hopsMatriculationStatus: ReducerStateType;
  hopsMatriculation: hopsMatriculation;

  // STUDENT INFO
  studentInfoStatus: ReducerStateType;
  studentInfo: StudentInfo | null;

  // HOPS FORM
  hopsFormStatus: ReducerStateType;
  hopsForm: HopsForm | null;

  // HOPS FORM HISTORY
  hopsFormHistoryStatus: ReducerStateType;
  hopsFormHistory: HopsHistoryEntry[] | null;
  hopsFormCanLoadMoreHistory: boolean;
  // HOPS MODE
  hopsMode: HopsMode;

  // HOPS LOCKED STATE
  hopsLocked: HopsLocked | null;

  // HOPS EDITING STATE
  hopsEditing: HopsEditingState;
}

const initialHopsState: HopsState = {
  currentStudentIdentifier: null,
  currentStudentStudyProgramme: null,
  hopsStudyPlanStatus: "READY",
  hopsStudyPlanState: {},
  hopsMatriculationStatus: "IDLE",
  hopsMatriculation: {
    exams: [],
    pastExams: [],
    subjects: [],
    eligibility: null,
    subjectsWithEligibility: [],
    plan: null,
    results: [],
  },
  studentInfoStatus: "IDLE",
  studentInfo: null,
  hopsFormStatus: "IDLE",
  hopsForm: null,
  hopsFormHistoryStatus: "IDLE",
  hopsFormHistory: null,
  hopsFormCanLoadMoreHistory: true,
  hopsMode: "READ",
  hopsLocked: null,
  hopsEditing: {
    readyToEdit: false,
    hopsForm: null,
    matriculationPlan: {
      plannedSubjects: [],
      goalMatriculationExam: false,
    },
  },
};

/**
 * Reducer function for hopsNew
 *
 * @param state state
 * @param action action
 */
export const hopsNew: Reducer<HopsState> = (
  state = initialHopsState,
  action: ActionType
) => {
  switch (action.type) {
    case "HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER":
      return {
        ...state,
        currentStudentIdentifier: action.payload,
      };

    case "HOPS_MATRICULATION_UPDATE_STATUS":
      return {
        ...state,
        hopsMatriculationStatus: action.payload,
        hopsEditing: {
          ...state.hopsEditing,
          readyToEdit:
            action.payload === "READY" && state.hopsStudyPlanStatus === "READY",
        },
      };

    case "HOPS_MATRICULATION_UPDATE_EXAMS":
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          exams: action.payload.map<MatriculationExamWithHistory>((exam) => ({
            ...exam,
            status: "IDLE",
            changeLogs: [],
          })),
        },
      };

    case "HOPS_MATRICULATION_UPDATE_PAST_EXAMS":
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          pastExams: action.payload.map<MatriculationExamWithHistory>(
            (exam) => ({
              ...exam,
              status: "IDLE",
              changeLogs: [],
            })
          ),
        },
      };

    case "HOPS_MATRICULATION_UPDATE_SUBJECTS":
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          subjects: action.payload,
        },
      };

    case "HOPS_MATRICULATION_UPDATE_ELIGIBILITY":
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          eligibility: action.payload,
        },
      };

    case "HOPS_MATRICULATION_UPDATE_EXAM_STATE": {
      const updatedExams = state.hopsMatriculation.exams.map((exam) => {
        if (exam.id === action.payload.examId) {
          return {
            ...exam,
            studentStatus: action.payload.newState,
          };
        }
        return exam;
      });

      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          exams: updatedExams,
        },
      };
    }

    case "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY_STATUS": {
      const updatedExams = state.hopsMatriculation.exams.map((exam) => {
        if (exam.id === action.payload.examId) {
          return {
            ...exam,
            status: action.payload.status,
          };
        }
        return exam;
      });

      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          exams: updatedExams,
        },
      };
    }

    case "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY": {
      if (action.payload.past) {
        const updatedExams = state.hopsMatriculation.pastExams.map((exam) => {
          if (exam.id === action.payload.examId) {
            return {
              ...exam,
              changeLogs: action.payload.history,
              status: action.payload.status,
            };
          }
          return exam;
        });

        return {
          ...state,
          hopsMatriculation: {
            ...state.hopsMatriculation,
            pastExams: updatedExams,
          },
        };
      }

      const updatedExams = state.hopsMatriculation.exams.map((exam) => {
        if (exam.id === action.payload.examId) {
          return {
            ...exam,
            changeLogs: action.payload.history,
            status: action.payload.status,
          };
        }
        return exam;
      });

      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          exams: updatedExams,
        },
      };
    }

    case "HOPS_MATRICULATION_UPDATE_PLAN": {
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          plan: action.payload,
        },
        hopsEditing: {
          ...state.hopsEditing,
          matriculationPlan: action.payload,
        },
      };
    }

    case "HOPS_MATRICULATION_UPDATE_SUBJECT_ELIGIBILITY": {
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          subjectsWithEligibility: action.payload,
        },
      };
    }

    case "HOPS_MATRICULATION_UPDATE_RESULTS": {
      return {
        ...state,
        hopsMatriculation: {
          ...state.hopsMatriculation,
          results: action.payload,
        },
      };
    }

    case "HOPS_RESET_DATA": {
      return {
        ...state,
        hopsMatriculationStatus: "IDLE",
        hopsFormStatus: "IDLE",
        hopsFormHistoryStatus: "IDLE",
        hopsForm: null,
        hopsFormHistory: null,
        hopsFormCanLoadMoreHistory: true,
        hopsMatriculation: {
          exams: [],
          pastExams: [],
          subjects: [],
          eligibility: null,
          subjectsWithEligibility: [],
          plan: null,
          results: [],
        },
        hopsEditing: {
          ...state.hopsEditing,
          readyToEdit: false,
          hopsForm: null,
          matriculationPlan: {
            plannedSubjects: [],
            goalMatriculationExam: false,
          },
        },
      };
    }

    case "HOPS_UPDATE_CURRENTSTUDENT_STUDYPROGRAM":
      return {
        ...state,
        currentStudentStudyProgramme: action.payload,
      };

    case "HOPS_FORM_UPDATE":
      return {
        ...state,
        hopsFormStatus: action.payload.status,
        hopsForm: action.payload.data,
        hopsEditing: {
          ...state.hopsEditing,
          hopsForm: action.payload.data,
        },
      };

    case "HOPS_STUDENT_INFO_UPDATE":
      return {
        ...state,
        studentInfoStatus: action.payload.status,
        studentInfo: action.payload.data,
      };

    case "HOPS_FORM_HISTORY_UPDATE":
      return {
        ...state,
        hopsFormHistoryStatus: action.payload.status,
        hopsFormHistory: action.payload.data,
      };

    case "HOPS_FORM_HISTORY_APPEND":
      return {
        ...state,
        hopsFormHistoryStatus: action.payload.status,
        hopsFormHistory:
          state.hopsFormHistory && action.payload.data
            ? action.payload.appendPosition === "start"
              ? [...action.payload.data, ...state.hopsFormHistory]
              : [...state.hopsFormHistory, ...action.payload.data]
            : state.hopsFormHistory,
      };

    case "HOPS_FORM_HISTORY_ENTRY_UPDATE":
      return {
        ...state,
        hopsFormHistory: state.hopsFormHistory
          ? state.hopsFormHistory.map((entry) =>
              entry.id === action.payload.data.id ? action.payload.data : entry
            )
          : null,
      };

    case "HOPS_FORM_UPDATE_CAN_LOAD_MORE_HISTORY":
      return {
        ...state,
        hopsFormCanLoadMoreHistory: action.payload,
      };

    case "HOPS_FORM_SAVE":
      return {
        ...state,
        hopsForm: action.payload,
      };

    case "HOPS_FORM_STATUS_UPDATE":
      return {
        ...state,
        hopsFormStatus: action.payload,
      };

    case "HOPS_CHANGE_MODE":
      return {
        ...state,
        hopsMode: action.payload,
      };

    case "HOPS_UPDATE_EDITING":
      return {
        ...state,
        hopsEditing: {
          ...state.hopsEditing,
          ...action.payload,
        },
      };

    case "HOPS_CANCEL_EDITING":
      return {
        ...state,
        hopsMode: "READ",
        hopsEditing: {
          ...state.hopsEditing,
          hopsForm: state.hopsForm,
          matriculationPlan: state.hopsMatriculation.plan,
        },
      };

    case "HOPS_UPDATE_LOCKED":
      return {
        ...state,
        hopsLocked: action.payload,
      };

    default:
      return state;
  }
};
