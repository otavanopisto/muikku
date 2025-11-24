import { Reducer } from "redux";
import { HopsForm } from "~/@types/hops";
import { Course } from "~/@types/shared";
import { ActionType } from "~/actions";
import { CurriculumConfig } from "~/util/curriculum-config";
import {
  HopsLocked,
  MatriculationEligibilityStatus,
  MatriculationExam,
  MatriculationExamChangeLogEntry,
  MatriculationPlan,
  MatriculationResults,
  MatriculationSubject,
  MatriculationSubjectEligibilityOPS2021,
  PlannedCourse,
  StudentInfo,
  HopsHistoryEntry,
  StudentStudyActivity,
  HopsOpsCourse,
  HopsGoals,
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

export type ReducerInitializeStatusType =
  | "INITIALIZING"
  | "INITIALIZED"
  | "INITIALIZATION_FAILED"
  | "IDLE";

/**
 * HopsStudyPlanState
 */
interface HopsStudyPlanState {
  plannedCourses: PlannedCourseWithIdentifier[];
  availableOPSCourses: HopsOpsCourse[];
  studyActivity: StudentStudyActivity[];
  studyOptions: string[];
  goals: HopsGoals;
}

/**
 * StudentDateInfo
 */
export interface StudentDateInfo {
  /**
   * Start date of the study
   */
  studyStartDate: Date;
  /**
   * End date when student study time expires
   */
  studyTimeEnd?: Date | null;
}

/**
 * PlannedCourseWithIdentifier
 */
export interface PlannedCourseWithIdentifier extends PlannedCourse {
  /**
   * Identifier of the planned course. Specifically used within frontend
   * to identify the exiting and newly added planned course in the planner with drag and drop.
   */
  identifier: string;
}

/**
 * Activity-only course item (graded course not in plan)
 * This represents a course that exists only in study activity
 */
export interface PlannerActivityItem {
  identifier: string;
  course: Course & { subjectCode: string };
  studyActivity: StudentStudyActivity; // Required for activity-only items
}

/**
 * Union type for all period items
 */
export type PeriodCourseItem =
  | PlannedCourseWithIdentifier
  | PlannerActivityItem;

/**
 * Type guard for planned course item
 * @param item item
 * @returns true if the item is a planned course item
 */
export const isPeriodCourseItemPlannedCourse = (
  item: PeriodCourseItem
): item is PlannedCourseWithIdentifier =>
  "identifier" in item && item.identifier.startsWith("planned-");

/**
 * Type guard for activity course item
 * @param item item
 * @returns true if the item is an activity course item
 */
export const isPeriodCourseItemActivityCourse = (
  item: PeriodCourseItem
): item is PlannerActivityItem =>
  "identifier" in item && item.identifier.startsWith("activity-");

/**
 * CourseChangeAction
 */
export type CourseChangeAction = "add" | "update" | "delete";

/**
 * Period
 */
export interface PlannedPeriod {
  year: number;
  type: "AUTUMN" | "SPRING";
  items: PeriodCourseItem[];
  isPastPeriod: boolean;
}

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

export type TimeContextSelection =
  | { type: "period-month"; year: number; monthIndex: number }
  | { type: null };

export type SelectedCourse =
  | PlannedCourseWithIdentifier
  | (Course & { subjectCode: string });

/**
 * Type guard for planned course with identifier
 * @param course Course
 */
export const isPlannedCourseWithIdentifier = (
  course: SelectedCourse
): course is PlannedCourseWithIdentifier =>
  "identifier" in course && course.identifier.startsWith("planned-");

/**
 * Type guard for no selection
 * @param selection Selection
 */
export const isNoTimeContextSelection = (
  selection: TimeContextSelection
): selection is { type: null } => selection.type === null;

/**
 * HopsEditingState
 */
export interface HopsEditingState {
  readyToEdit: boolean;
  hopsForm: HopsForm | null;
  matriculationPlan: MatriculationPlan | null;
  plannedCourses: PlannedCourseWithIdentifier[];
  goals: HopsGoals;
  selectedCoursesIds: string[];
  timeContextSelection: TimeContextSelection;
  waitingToBeAllocatedCourses: (Course & { subjectCode: string })[] | null;
}

/**
 * HopsState
 */
export interface HopsState {
  initialized: ReducerInitializeStatusType;

  // CURRENT STUDENT IDENTIFIER
  currentStudentIdentifier?: string;
  currentStudentStudyProgramme?: string;

  // HOPS STUDY PLAN
  hopsStudyPlanStatus: ReducerStateType;
  hopsStudyPlanState: HopsStudyPlanState;

  // HOPS CURRICULUM CONFIG
  hopsCurriculumConfigStatus: ReducerStateType;
  hopsCurriculumConfig: CurriculumConfig | null;

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
  hopsLockedStatus: ReducerStateType;

  // HOPS EDITING STATE
  hopsEditing: HopsEditingState;
}

const initialHopsState: HopsState = {
  initialized: "IDLE",
  hopsStudyPlanStatus: "IDLE",
  hopsStudyPlanState: {
    plannedCourses: [],
    studyActivity: [],
    availableOPSCourses: [],
    studyOptions: [],
    goals: {
      graduationGoal: null,
      studyHours: 0,
    },
  },
  hopsCurriculumConfigStatus: "IDLE",
  hopsCurriculumConfig: null,
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
  hopsLockedStatus: "IDLE",
  hopsEditing: {
    readyToEdit: false,
    hopsForm: null,
    matriculationPlan: {
      plannedSubjects: [],
      goalMatriculationExam: false,
    },
    plannedCourses: [],
    goals: {
      graduationGoal: null,
      studyHours: 0,
    },
    selectedCoursesIds: [],
    timeContextSelection: null,
    waitingToBeAllocatedCourses: null,
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
    case "HOPS_UPDATE_INITIALIZE_STATUS":
      return {
        ...state,
        initialized: action.payload,
      };

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
        initialized: "IDLE",
        hopsMatriculationStatus: "IDLE",
        hopsFormStatus: "IDLE",
        hopsFormHistoryStatus: "IDLE",
        hopsForm: null,
        hopsFormHistory: null,
        hopsFormCanLoadMoreHistory: true,
        studentInfo: null,
        studentInfoStatus: "IDLE",
        hopsCurriculumConfigStatus: "IDLE",
        hopsCurriculumConfig: null,
        hopsStudyPlanStatus: "IDLE",
        hopsStudyPlanState: {
          plannedCourses: [],
          studyActivity: [],
          availableOPSCourses: [],
          studyOptions: [],
          studyMatrix: null,
          goals: {
            graduationGoal: null,
            studyHours: 0,
          },
        },
        hopsMatriculation: {
          exams: [],
          pastExams: [],
          subjects: [],
          eligibility: null,
          subjectsWithEligibility: [],
          plan: null,
          results: [],
        },
        hopsLocked: null,
        hopsLockedStatus: "IDLE",
        hopsMode: "READ",
        hopsEditing: {
          ...state.hopsEditing,
          readyToEdit: false,
          hopsForm: null,
          matriculationPlan: {
            plannedSubjects: [],
            goalMatriculationExam: false,
          },
          goals: {
            graduationGoal: null,
            studyHours: 0,
          },
          plannedCourses: [],
          selectedCourse: null,
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
        hopsForm: action.payload.data || state.hopsForm,
        hopsEditing: {
          ...state.hopsEditing,
          hopsForm: action.payload.data || state.hopsForm,
        },
      };

    case "HOPS_STUDENT_INFO_UPDATE":
      return {
        ...state,
        studentInfoStatus: action.payload.status,
        studentInfo: action.payload.data || state.studentInfo,
      };

    case "HOPS_FORM_HISTORY_UPDATE":
      return {
        ...state,
        hopsFormHistoryStatus: action.payload.status,
        hopsFormHistory: action.payload.data || state.hopsFormHistory,
      };

    case "HOPS_FORM_HISTORY_ENTRY_UPDATE":
      return {
        ...state,
        hopsFormHistory:
          state.hopsFormHistory && action.payload.data
            ? state.hopsFormHistory.map((entry) =>
                entry.id === action.payload.data.id
                  ? action.payload.data
                  : entry
              )
            : state.hopsFormHistory,
        hopsFormHistoryStatus: action.payload.status,
      };

    case "HOPS_FORM_UPDATE_CAN_LOAD_MORE_HISTORY":
      return {
        ...state,
        hopsFormCanLoadMoreHistory: action.payload,
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
          plannedCourses: state.hopsStudyPlanState.plannedCourses,
          goals: state.hopsStudyPlanState.goals,
          selectedCoursesIds: [],
          timeContextSelection: null,
        },
      };

    case "HOPS_UPDATE_EDITING_STUDYPLAN":
      return {
        ...state,
        hopsEditing: {
          ...state.hopsEditing,
          plannedCourses: action.payload,
        },
      };

    case "HOPS_UPDATE_LOCKED":
      return {
        ...state,
        hopsLocked: action.payload.data || state.hopsLocked,
        hopsLockedStatus: action.payload.status,
      };

    case "HOPS_STUDYPLAN_UPDATE_STATUS":
      return {
        ...state,
        hopsStudyPlanStatus: action.payload,
      };

    case "HOPS_STUDYPLAN_UPDATE_PLANNED_COURSES":
      return {
        ...state,
        hopsStudyPlanState: {
          ...state.hopsStudyPlanState,
          plannedCourses: action.payload,
        },
        hopsEditing: {
          ...state.hopsEditing,
          plannedCourses: action.payload,
        },
      };

    case "HOPS_STUDYPLAN_UPDATE_GOALS":
      return {
        ...state,
        hopsStudyPlanState: {
          ...state.hopsStudyPlanState,
          goals: action.payload,
        },
        hopsEditing: {
          ...state.hopsEditing,
          goals: action.payload,
        },
      };

    case "HOPS_SET_TIME_CONTEXT_SELECTION":
      return {
        ...state,
        hopsEditing: {
          ...state.hopsEditing,
          timeContextSelection: action.payload,
        },
      };

    case "HOPS_CLEAR_TIME_CONTEXT_SELECTION":
      return {
        ...state,
        hopsEditing: {
          ...state.hopsEditing,
          timeContextSelection: null,
        },
      };

    case "HOPS_UPDATE_SELECTED_COURSES":
      return {
        ...state,
        hopsEditing: {
          ...state.hopsEditing,
          selectedCoursesIds: action.payload,
        },
      };

    case "HOPS_CLEAR_SELECTED_COURSES":
      return {
        ...state,
        hopsEditing: {
          ...state.hopsEditing,
          selectedCoursesIds: [],
        },
      };

    case "HOPS_UPDATE_EDITING_STUDYPLAN_BATCH":
      return {
        ...state,
        hopsEditing: {
          ...state.hopsEditing,
          plannedCourses: action.payload.plannedCourses,
        },
      };

    case "HOPS_UPDATE_EDITING_GOALS":
      return {
        ...state,
        hopsEditing: {
          ...state.hopsEditing,
          goals: action.payload,
        },
      };

    case "HOPS_UPDATE_CURRICULUM_CONFIG":
      return {
        ...state,
        hopsCurriculumConfigStatus: action.payload.status,
        hopsCurriculumConfig: action.payload.data || state.hopsCurriculumConfig,
      };

    case "HOPS_UPDATE_STUDY_ACTIVITY":
      return {
        ...state,
        hopsStudyPlanState: {
          ...state.hopsStudyPlanState,
          studyActivity: action.payload,
        },
      };

    case "HOPS_UPDATE_AVAILABLE_OPS_COURSES":
      return {
        ...state,
        hopsStudyPlanState: {
          ...state.hopsStudyPlanState,
          availableOPSCourses: action.payload,
        },
      };

    case "HOPS_STUDYPLAN_UPDATE_STUDY_OPTIONS":
      return {
        ...state,
        hopsStudyPlanState: {
          ...state.hopsStudyPlanState,
          studyOptions: action.payload,
        },
      };

    default:
      return state;
  }
};
