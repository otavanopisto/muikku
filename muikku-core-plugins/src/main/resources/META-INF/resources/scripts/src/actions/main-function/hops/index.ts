import actions, { hideNotification } from "../../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Dispatch, Action } from "redux";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import {
  HopsHistoryEntry,
  HopsLocked,
  HopsOpsCourse,
  MatriculationExam,
  MatriculationExamChangeLogEntry,
  MatriculationExamStudentStatus,
  MatriculationPlan,
  MatriculationResults,
  MatriculationSubject,
  PlannedCourse,
  StudentInfo,
  StudentStudyActivity,
} from "~/generated/client";
import {
  CourseChangeAction,
  HopsEditingState,
  HopsMode,
  MatriculationEligibilityWithAbistatus,
  MatriculationSubjectWithEligibility,
  PlannedCourseWithIdentifier,
  ReducerInitializeStatusType,
  ReducerStateType,
  TimeContextSelection,
} from "~/reducers/hops";
import i18n from "~/locales/i18n";
import { abistatus } from "~/helper-functions/abistatus";
import { displayNotification } from "~/actions/base/notifications";
import { OPS2021SubjectCodesInOrder } from "~/mock/mock-data";
import {
  CompulsoryStudiesHops,
  HopsForm,
  initializeCompulsoryStudiesHops,
  initializeCompulsoryStudiesHopsFromOld,
  initializeSecondaryStudiesHops,
  isCompulsoryStudiesHopsOld,
  SecondaryStudiesHops,
} from "~/@types/hops";
import _ from "lodash";
import { getEditedHopsFields } from "~/components/hops/body/application/wizard/helpers";
import {
  CurriculumConfig,
  getCurriculumConfig,
} from "~/util/curriculum-config";
import { Course } from "~/@types/shared";

// Api instances
const hopsApi = MApi.getHopsApi();
const recordsApi = MApi.getRecordsApi();
const matriculationApi = MApi.getMatriculationApi();

// HOPS STATUS
export type HOPS_UPDATE_INITIALIZE_STATUS = SpecificActionType<
  "HOPS_UPDATE_INITIALIZE_STATUS",
  ReducerInitializeStatusType
>;

// HOPS FORM ACTIONS TYPES
export type HOPS_FORM_HISTORY_UPDATE = SpecificActionType<
  "HOPS_FORM_HISTORY_UPDATE",
  { status: ReducerStateType; data?: HopsHistoryEntry[] | null }
>;

export type HOPS_FORM_HISTORY_ENTRY_UPDATE = SpecificActionType<
  "HOPS_FORM_HISTORY_ENTRY_UPDATE",
  { status: ReducerStateType; data?: HopsHistoryEntry | null }
>;

export type HOPS_FORM_UPDATE_CAN_LOAD_MORE_HISTORY = SpecificActionType<
  "HOPS_FORM_UPDATE_CAN_LOAD_MORE_HISTORY",
  boolean
>;

export type HOPS_FORM_UPDATE = SpecificActionType<
  "HOPS_FORM_UPDATE",
  { status: ReducerStateType; data?: HopsForm | null }
>;

export type HOPS_CHANGE_MODE = SpecificActionType<"HOPS_CHANGE_MODE", HopsMode>;

// HOPS STUDY PLAN ACTIONS TYPES

export type HOPS_STUDYPLAN_UPDATE_STATUS = SpecificActionType<
  "HOPS_STUDYPLAN_UPDATE_STATUS",
  ReducerStateType
>;

export type HOPS_STUDYPLAN_UPDATE_PLANNED_COURSES = SpecificActionType<
  "HOPS_STUDYPLAN_UPDATE_PLANNED_COURSES",
  PlannedCourseWithIdentifier[]
>;

export type HOPS_STUDYPLAN_UPDATE_STUDY_OPTIONS = SpecificActionType<
  "HOPS_STUDYPLAN_UPDATE_STUDY_OPTIONS",
  string[]
>;

export type HOPS_UPDATE_STUDY_ACTIVITY = SpecificActionType<
  "HOPS_UPDATE_STUDY_ACTIVITY",
  StudentStudyActivity[]
>;

export type HOPS_UPDATE_AVAILABLE_OPS_COURSES = SpecificActionType<
  "HOPS_UPDATE_AVAILABLE_OPS_COURSES",
  HopsOpsCourse[]
>;

// HOPS CAREER PLAN ACTIONS TYPES

export type HOPS_CAREERPLAN_UPDATE_STATUS = SpecificActionType<
  "HOPS_CAREERPLAN_UPDATE_STATUS",
  ReducerStateType
>;

// HOPS MATRICULATION ACTIONS TYPES

export type HOPS_MATRICULATION_UPDATE_STATUS = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_STATUS",
  ReducerStateType
>;

export type HOPS_MATRICULATION_UPDATE_EXAMS = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_EXAMS",
  MatriculationExam[]
>;

export type HOPS_MATRICULATION_UPDATE_PAST_EXAMS = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_PAST_EXAMS",
  MatriculationExam[]
>;

export type HOPS_MATRICULATION_UPDATE_SUBJECTS = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_SUBJECTS",
  MatriculationSubject[]
>;

export type HOPS_MATRICULATION_UPDATE_ELIGIBILITY = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_ELIGIBILITY",
  MatriculationEligibilityWithAbistatus
>;

export type HOPS_MATRICULATION_UPDATE_EXAM_STATE = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_EXAM_STATE",
  { examId: number; newState: MatriculationExamStudentStatus }
>;

export type HOPS_MATRICULATION_UPDATE_EXAM_HISTORY = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY",
  {
    examId: number;
    status: ReducerStateType;
    past: boolean;
    history: MatriculationExamChangeLogEntry[];
  }
>;

export type HOPS_MATRICULATION_UPDATE_EXAM_HISTORY_STATUS = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY_STATUS",
  { examId: number; status: ReducerStateType }
>;

export type HOPS_MATRICULATION_UPDATE_PLAN = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_PLAN",
  MatriculationPlan
>;

export type HOPS_MATRICULATION_UPDATE_SUBJECT_ELIGIBILITY = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_SUBJECT_ELIGIBILITY",
  MatriculationSubjectWithEligibility[]
>;

export type HOPS_MATRICULATION_UPDATE_RESULTS = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_RESULTS",
  MatriculationResults[]
>;

// HOPS OTHER ACTIONS TYPES

export type HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER = SpecificActionType<
  "HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER",
  string
>;

export type HOPS_UPDATE_CURRENTSTUDENT_STUDYPROGRAM = SpecificActionType<
  "HOPS_UPDATE_CURRENTSTUDENT_STUDYPROGRAM",
  string
>;

export type HOPS_RESET_DATA = SpecificActionType<"HOPS_RESET_DATA", undefined>;

export type HOPS_STUDENT_INFO_UPDATE = SpecificActionType<
  "HOPS_STUDENT_INFO_UPDATE",
  { status: ReducerStateType; data?: StudentInfo | null }
>;

export type HOPS_CANCEL_EDITING = SpecificActionType<
  "HOPS_CANCEL_EDITING",
  undefined
>;

export type HOPS_UPDATE_LOCKED = SpecificActionType<
  "HOPS_UPDATE_LOCKED",
  { status: ReducerStateType; data?: HopsLocked | null }
>;

export type HOPS_UPDATE_EDITING = SpecificActionType<
  "HOPS_UPDATE_EDITING",
  Partial<HopsEditingState>
>;

export type HOPS_UPDATE_CURRICULUM_CONFIG = SpecificActionType<
  "HOPS_UPDATE_CURRICULUM_CONFIG",
  { status: ReducerStateType; data?: CurriculumConfig | null }
>;

export type HOPS_UPDATE_EDITING_STUDYPLAN = SpecificActionType<
  "HOPS_UPDATE_EDITING_STUDYPLAN",
  PlannedCourseWithIdentifier[]
>;

export type HOPS_UPDATE_EDITING_STUDYPLAN_BATCH = SpecificActionType<
  "HOPS_UPDATE_EDITING_STUDYPLAN_BATCH",
  {
    plannedCourses: PlannedCourseWithIdentifier[];
  }
>;

export type HOPS_SET_TIME_CONTEXT_SELECTION = SpecificActionType<
  "HOPS_SET_TIME_CONTEXT_SELECTION",
  TimeContextSelection | null
>;

export type HOPS_CLEAR_TIME_CONTEXT_SELECTION = SpecificActionType<
  "HOPS_CLEAR_TIME_CONTEXT_SELECTION",
  undefined
>;

export type HOPS_UPDATE_SELECTED_COURSES = SpecificActionType<
  "HOPS_UPDATE_SELECTED_COURSES",
  string[]
>;

export type HOPS_CLEAR_SELECTED_COURSES = SpecificActionType<
  "HOPS_CLEAR_SELECTED_COURSES",
  undefined
>;

export type HOPS_UPDATE_ADD_TO_PERIOD = SpecificActionType<
  "HOPS_UPDATE_ADD_TO_PERIOD",
  (Course & { subjectCode: string })[]
>;

export type HOPS_CLEAR_ADD_TO_PERIOD = SpecificActionType<
  "HOPS_CLEAR_ADD_TO_PERIOD",
  undefined
>;

/**
 * UpdateHopsEditingTriggerType
 */
export interface UpdateHopsEditingTriggerType {
  (data: { updates: Partial<HopsEditingState> }): AnyActionType;
}

/**
 * UpdateHopsEditingStudyPlanTriggerType
 */
export interface UpdateHopsEditingStudyPlanTriggerType {
  (data: {
    updatedCourse: PlannedCourseWithIdentifier;
    action: CourseChangeAction;
  }): AnyActionType;
}

/**
 * StartEditingTriggerType
 */
export interface StartEditingTriggerType {
  (): AnyActionType;
}

/**
 * SaveHopsTriggerType
 */
export interface SaveHopsTriggerType {
  (data: {
    details: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * CancelEditingTriggerType
 */
export interface CancelEditingTriggerType {
  (): AnyActionType;
}

/**
 * loadExamDataTriggerType
 */
export interface LoadMatriculationDataTriggerType {
  (data: {
    userIdentifier?: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * resetMatriculationDataTriggerType
 */
export interface ResetHopsDataTriggerType {
  (): AnyActionType;
}

/**
 * verifyMatriculationEligibilityTriggerType
 */
export interface VerifyMatriculationExamTriggerType {
  (data: {
    examId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadMatriculationExamHistoryTriggerType
 */
export interface LoadMatriculationExamHistoryTriggerType {
  (data: {
    examId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * SaveMatriculationPlanTriggerType
 */
export interface SaveMatriculationPlanTriggerType {
  (data: {
    plan: MatriculationPlan;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateMatriculationExaminationTriggerType
 */
export interface UpdateMatriculationExaminationTriggerType {
  (data: {
    examId: number;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadStudentHopsFormTriggerType
 */
export interface LoadStudentHopsFormTriggerType {
  (data: { userIdentifier?: string }): AnyActionType;
}

/**
 * Trigger type for loading HOPS form history
 */
export interface LoadHopsFormHistoryTriggerType {
  (data: { userIdentifier?: string }): AnyActionType;
}

/**
 * UpdateHopsFormHistoryEntryTriggerType
 */
export interface UpdateHopsFormHistoryEntryTriggerType {
  (data: {
    entryId: number;
    originalEntry: HopsHistoryEntry;
    updatedEntry: Partial<HopsHistoryEntry>;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateMatriculationPlanTriggerType
 */
export interface UpdateMatriculationPlanTriggerType {
  (data: {
    plan: MatriculationPlan;
    studentIdentifier: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * Load more HOPS form history data trigger type
 */
export interface LoadMoreHopsFormHistoryTriggerType {
  (data: { userIdentifier?: string }): AnyActionType;
}

/**
 * Save HOPS form trigger type
 */
export interface SaveHopsFormTriggerType {
  (data: { details: string; editedFields: string[] }): AnyActionType;
}

/**
 * UpdateHopsLockedTriggerType
 */
export interface UpdateHopsLockedTriggerType {
  (data: { locked: HopsLocked }): AnyActionType;
}

/**
 * UpdateHopsFormTriggerType
 */
export interface UpdateHopsFormTriggerType {
  (data: { form: HopsForm }): AnyActionType;
}

/**
 * UpdateHopsHistoryTriggerType
 */
export interface UpdateHopsHistoryTriggerType {
  (data: { history: HopsHistoryEntry }): AnyActionType;
}

/**
 * InitializeHopsLockedTriggerType
 */
export interface InitializeHopsTriggerType {
  (data: {
    userIdentifier: string;
    onSuccess?: (
      currentUserIsEditing: boolean,
      uppersecondary: boolean
    ) => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadStudyPlanDataTriggerType
 */
export interface LoadStudyPlanDataTriggerType {
  (data: {
    userIdentifier: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * SaveStudyPlanDataTriggerType
 */
export interface SaveStudyPlanDataTriggerType {
  (data: { onSuccess?: () => void; onFail?: () => void }): AnyActionType;
}

/**
 * SetSelectionTriggerType
 */
export interface UpdateTimeContextSelectionTriggerType {
  (data: { selection: TimeContextSelection | null }): AnyActionType;
}

/**
 * ClearSelectionTriggerType
 */
export interface ClearTimeContextSelectionTriggerType {
  (): AnyActionType;
}

/**
 * UpdateSelectedCoursesTriggerType
 */
export interface UpdateSelectedCoursesTriggerType {
  (data: { courseIdentifier: string }): AnyActionType;
}

/**
 * ClearSelectedCoursesTriggerType
 */
export interface ClearSelectedCoursesTriggerType {
  (): AnyActionType;
}

/**
 * UpdateEditingStudyPlanBatchTriggerType
 */
export interface UpdateEditingStudyPlanBatchTriggerType {
  (data: { plannedCourses: PlannedCourseWithIdentifier[] }): AnyActionType;
}

/**
 * UpdateSelectedCoursesToStateTriggerType
 */
export interface UpdateTriggerType {
  (data: { selectedCourses: PlannedCourseWithIdentifier[] }): AnyActionType;
}

/**
 * Load matriculation exam data thunk
 *
 * @param data data
 */
const loadMatriculationData: LoadMatriculationDataTriggerType =
  function loadMatriculationData(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Student identifier is either user identifier from props or current student identifier or user school data identifier from current user
      const studentIdentifier =
        data.userIdentifier ||
        state.hopsNew.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      if (state.hopsNew.hopsMatriculationStatus === "READY") {
        return;
      }

      // If the student identifier has changed, update it
      if (state.hopsNew.currentStudentIdentifier !== studentIdentifier) {
        dispatch({
          type: "HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER",
          payload: studentIdentifier,
        });

        dispatch({
          type: "HOPS_UPDATE_CURRENTSTUDENT_STUDYPROGRAM",
          payload: state.status.profile.studyProgrammeName,
        });
      }

      dispatch({
        type: "HOPS_MATRICULATION_UPDATE_STATUS",
        payload: "LOADING",
      });

      try {
        const matriculationPlan =
          await matriculationApi.getStudentMatriculationPlan({
            studentIdentifier,
          });

        if (matriculationPlan.goalMatriculationExam === null) {
          matriculationPlan.goalMatriculationExam = false;
        }

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_PLAN",
          payload: matriculationPlan,
        });

        // Load and dispatch examination subjects
        const matriculationSubjects =
          await recordsApi.getMatriculationSubjects();

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_SUBJECTS",
          payload: matriculationSubjects,
        });

        // Load and dispatch student matriculation eligibility
        const eligibility = await recordsApi.getStudentMatriculationEligibility(
          {
            studentIdentifier,
          }
        );

        // Load and dispatch student matriculation subject eligibility and Abistatus
        // Those are related to the planned subjects in the matriculation plan
        // So they are handled together
        if (matriculationPlan.plannedSubjects) {
          try {
            const subjectsToFetch: MatriculationSubject[] = [];

            matriculationPlan.plannedSubjects.map((s) => {
              const match = matriculationSubjects.find(
                (sub) => sub.code === s.subject
              );

              if (match) {
                subjectsToFetch.push(match);
              }
            });

            const subjectEligibilityDataArray =
              await Promise.all<MatriculationSubjectWithEligibility>(
                subjectsToFetch.map(async (s) => {
                  const subjectEligibility =
                    await matriculationApi.getMatriculationSubjectEligibility({
                      studentIdentifier,
                      subjectCode: s.subjectCode,
                    });

                  return {
                    ...subjectEligibility,
                    subject: s,
                  };
                })
              );

            // Sort the subjects eligibility data by OPS order that is separted list of subject codes
            const sortedByOpsOrder = subjectEligibilityDataArray.sort(
              (a, b) =>
                OPS2021SubjectCodesInOrder.indexOf(a.subject.subjectCode) -
                OPS2021SubjectCodesInOrder.indexOf(b.subject.subjectCode)
            );

            const abistatusData = abistatus(
              sortedByOpsOrder,
              eligibility.creditPoints,
              eligibility.creditPointsRequired
            );

            // Merge eligibility and abistatus data single object
            const eligibilityWithAbistatus: MatriculationEligibilityWithAbistatus =
              {
                ...abistatusData,
                personHasCourseAssessments:
                  eligibility.personHasCourseAssessments,
              };

            dispatch({
              type: "HOPS_MATRICULATION_UPDATE_SUBJECT_ELIGIBILITY",
              payload: sortedByOpsOrder,
            });

            dispatch({
              type: "HOPS_MATRICULATION_UPDATE_ELIGIBILITY",
              payload: eligibilityWithAbistatus,
            });
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }

            dispatch(
              actions.displayNotification(
                "Virhe ilmoittautumis- ja osallistumisoikeustietojen latauksessa",
                "error"
              )
            );
          }
        }

        // Load and dispatch student matriculation results
        const results = await matriculationApi.getStudentMatriculationResults({
          studentIdentifier,
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_RESULTS",
          payload: results,
        });

        // Load student matriculation exams
        const matriculationEligibleExams =
          await matriculationApi.getStudentExams({
            studentIdentifier,
            filter: "ELIGIBLE",
          });

        // Load student past matriculation exams
        const matriculationPastExams = await matriculationApi.getStudentExams({
          studentIdentifier,
          filter: "PAST",
        });

        // And dispatch them
        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAMS",
          payload: matriculationEligibleExams,
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_PAST_EXAMS",
          payload: matriculationPastExams,
        });

        // If there are eligible exams, load exams history for those
        if (matriculationEligibleExams.length > 0) {
          // Load history for every exam that is eligible
          await Promise.all(
            matriculationEligibleExams.map(async (exam) => {
              try {
                dispatch({
                  type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY_STATUS",
                  payload: {
                    examId: exam.id,
                    status: "LOADING",
                  },
                });

                const entryLogs =
                  await matriculationApi.getStudentExamEnrollmentChangeLog({
                    examId: exam.id,
                    studentIdentifier,
                  });

                dispatch({
                  type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY",
                  payload: {
                    examId: exam.id,
                    history: entryLogs,
                    status: "READY",
                    past: false,
                  },
                });
              } catch (err) {
                if (!isMApiError(err)) {
                  throw err;
                }

                if (isResponseError(err) && err.response.status === 404) {
                  dispatch({
                    type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY",
                    payload: {
                      examId: exam.id,
                      history: [],
                      status: "READY",
                      past: false,
                    },
                  });
                }
              }
            })
          );
        }

        // All done
        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_STATUS",
          payload: "READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "studies",
              context: "matriculation",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Verify matriculation exam
 * @param data data
 */
const verifyMatriculationExam: VerifyMatriculationExamTriggerType =
  function cancelMatriculationExam(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Student identifier is either current student identifier or user school data identifier from current user
      const studentIdentifier =
        state.hopsNew.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      try {
        await matriculationApi.setStudentExamEnrollmentState({
          examId: data.examId,
          studentIdentifier,
          setStudentExamEnrollmentStateRequest: {
            state: "CONFIRMED",
          },
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAM_STATE",
          payload: {
            examId: data.examId,
            newState: "CONFIRMED",
          },
        });

        dispatch(
          displayNotification("Lomakkeen varmistaminen onnistui", "success")
        );
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification("Virhe lomakkeen varmistamisessa", "error")
        );
      }
    };
  };

/**
 * Load matriculation exam history
 * @param data data
 */
const loadMatriculationExamHistory: LoadMatriculationExamHistoryTriggerType =
  function loadMatriculationExamHistoryTriggerType(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Student identifier is either current student identifier or user school data identifier from current user
      const studentIdentifier =
        state.hopsNew.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      dispatch({
        type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY_STATUS",
        payload: {
          examId: data.examId,
          status: "LOADING",
        },
      });

      try {
        const entryLogs =
          await matriculationApi.getStudentExamEnrollmentChangeLog({
            examId: data.examId,
            studentIdentifier,
          });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY",
          payload: {
            examId: data.examId,
            history: entryLogs,
            status: "READY",
            past: true,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        // If there is no history, api responds with 404 and we can just set the history to empty
        if (isResponseError(err) && err.response.status === 404) {
          dispatch({
            type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY",
            payload: {
              examId: data.examId,
              history: [],
              status: "READY",
              past: true,
            },
          });
          return;
        }

        dispatch(
          displayNotification(i18n.t("notifications.loadError"), "error")
        );
      }
    };
  };

/**
 * saveMatriculationPlan
 * @param data data
 */
const saveMatriculationPlan: SaveMatriculationPlanTriggerType =
  function saveMatriculationPlan(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Student identifier is either current student identifier or user school data identifier from current user
      const studentIdentifier =
        state.hopsNew.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      try {
        await matriculationApi.setStudentMatriculationPlan({
          studentIdentifier,
          setStudentMatriculationPlanRequest: data.plan,
        });

        // After saving the plan, we need to update the eligibility for the subjects
        // if there are any changes in the plan
        const loadEligibilityForNewSubjects: MatriculationSubject[] = [];
        const deleteEligibilityForFollowingSubjects: MatriculationSubject[] =
          [];

        // Check if subjects are removed and add them to the list
        state.hopsNew.hopsMatriculation.plan.plannedSubjects.forEach((s) => {
          const match = data.plan.plannedSubjects.find(
            (ns) => ns.subject === s.subject
          );

          if (!match) {
            const subject = state.hopsNew.hopsMatriculation.subjects.find(
              (sub) => sub.code === s.subject
            );
            deleteEligibilityForFollowingSubjects.push(subject);
          }
        });

        // Check if new subjects are added and add them to the list
        data.plan.plannedSubjects.forEach((s) => {
          const match =
            state.hopsNew.hopsMatriculation.plan.plannedSubjects.find(
              (ns) => ns.subject === s.subject
            );

          if (!match) {
            const subject = state.hopsNew.hopsMatriculation.subjects.find(
              (sub) => sub.code === s.subject
            );
            loadEligibilityForNewSubjects.push(subject);
          }
        });

        // Copy the current list of eligibility
        let updatedListOfEligibility = [
          ...state.hopsNew.hopsMatriculation.subjectsWithEligibility,
        ];

        // Remove subjects that are not in the plan anymore with helper list
        if (deleteEligibilityForFollowingSubjects.length) {
          deleteEligibilityForFollowingSubjects.forEach((s) => {
            const index = updatedListOfEligibility.findIndex(
              (el) => el.subject.code === s.code
            );

            if (index !== -1) {
              updatedListOfEligibility.splice(index, 1);
            }
          });
        }

        // Initialize new array for newly added subjects
        let newSubjectEligibilityDataArray: MatriculationSubjectWithEligibility[] =
          [];

        // Load eligibility for newly added subjects if there are any
        if (loadEligibilityForNewSubjects.length) {
          newSubjectEligibilityDataArray =
            await Promise.all<MatriculationSubjectWithEligibility>(
              loadEligibilityForNewSubjects.map(async (s) => {
                const subjectEligibility =
                  await matriculationApi.getMatriculationSubjectEligibility({
                    studentIdentifier,
                    subjectCode: s.subjectCode,
                  });

                return {
                  ...subjectEligibility,
                  subject: s,
                };
              })
            );
        }

        updatedListOfEligibility = [
          ...updatedListOfEligibility,
          ...newSubjectEligibilityDataArray,
        ];

        // Sort the subjects eligibility data by OPS order that is separted list of subject codes
        updatedListOfEligibility = updatedListOfEligibility.sort(
          (a, b) =>
            OPS2021SubjectCodesInOrder.indexOf(a.subject.subjectCode) -
            OPS2021SubjectCodesInOrder.indexOf(b.subject.subjectCode)
        );

        // Calculate updated abistatus with new eligibility data
        const abistatusData = abistatus(
          updatedListOfEligibility,
          state.hopsNew.hopsMatriculation.eligibility.credits,
          state.hopsNew.hopsMatriculation.eligibility.creditsRequired
        );

        // Merge eligibility and abistatus data single object
        const eligibilityWithAbistatus: MatriculationEligibilityWithAbistatus =
          {
            ...abistatusData,
            personHasCourseAssessments:
              state.hopsNew.hopsMatriculation.eligibility
                .personHasCourseAssessments,
          };

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_PLAN",
          payload: data.plan,
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_SUBJECT_ELIGIBILITY",
          payload: updatedListOfEligibility,
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_ELIGIBILITY",
          payload: eligibilityWithAbistatus,
        });

        dispatch(
          displayNotification(
            "Yo-tutkintosuunnitelma päivitetty onnistuneesti",
            "success"
          )
        );
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(i18n.t("notifications.updateError"), "error")
        );
      }
    };
  };

/**
 * Updates matriculation examination
 * @param data data
 */
const updateMatriculationExamination: UpdateMatriculationExaminationTriggerType =
  function updateMatriculationExamination(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const studentIdentifier =
        state.hopsNew.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      try {
        // Load the updated exam enrollment
        const updatedExam = await matriculationApi.getStudentExamEnrollment({
          studentIdentifier,
          examId: data.examId,
        });

        const updatedChangeLog =
          await matriculationApi.getStudentExamEnrollmentChangeLog({
            examId: data.examId,
            studentIdentifier,
          });

        // copy the exams array
        const updatedExams = [...state.hopsNew.hopsMatriculation.exams];

        // find the index of the exam to update
        const examIndex = updatedExams.findIndex(
          (exam) => exam.id === data.examId
        );

        // if the exam is not found, end here
        if (examIndex === -1) {
          return;
        }

        // update student status and enrollment with the new data
        updatedExams[examIndex].studentStatus = updatedExam.state;
        updatedExams[examIndex].enrollment = updatedExam;

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAMS",
          payload: updatedExams,
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY",
          payload: {
            examId: data.examId,
            history: updatedChangeLog,
            status: "READY",
            past: false,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          displayNotification(i18n.t("notifications.updateError"), "error")
        );
      }
    };
  };

/**
 * resetHopsData
 */
const resetHopsData: ResetHopsDataTriggerType = function resetHopsData() {
  return (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
  ) => {
    dispatch({
      type: "HOPS_RESET_DATA",
      payload: undefined,
    });
  };
};

/**
 * Start editing. Locks the HOPS for editing for other users.
 */
const startEditing: StartEditingTriggerType = function startEditing() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();

    const studentInfo = state.hopsNew.studentInfo;

    // Check matriculation data
    if (
      state.hopsNew.hopsMatriculationStatus === "IDLE" &&
      studentInfo.studyProgrammeEducationType === "lukio"
    ) {
      dispatch(
        loadMatriculationData({
          userIdentifier: state.hopsNew.currentStudentIdentifier,
        })
      );
    }

    if (state.hopsNew.hopsStudyPlanStatus === "IDLE") {
      // TODO: Load study plan data
      dispatch(
        loadStudyPlanData({
          userIdentifier: state.hopsNew.currentStudentIdentifier,
        })
      );
    }

    try {
      const hopsLocked = await hopsApi.updateStudentHopsLock({
        studentIdentifier: state.hopsNew.currentStudentIdentifier,
        updateStudentHopsLockRequest: {
          locked: true,
        },
      });

      dispatch({
        type: "HOPS_UPDATE_LOCKED",
        payload: { status: "READY", data: hopsLocked },
      });

      // Change mode after ensuring data is at least loading and hops is locked
      dispatch({
        type: "HOPS_CHANGE_MODE",
        payload: "EDIT",
      });

      dispatch(
        displayNotification(
          i18n.t("notifications.editingModePersistentInfo", {
            ns: "hops_new",
          }),
          "persistent-info",
          undefined,
          "hops-editing-mode-notification"
        )
      );
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      dispatch(
        displayNotification(
          i18n.t("notifications.startEditingError", {
            ns: "hops_new",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * Cancel editing. Discards any changes and returns to read mode.
 */
const cancelEditing: CancelEditingTriggerType = function cancelEditing() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();

    try {
      const hopsLocked = await hopsApi.updateStudentHopsLock({
        studentIdentifier: state.hopsNew.currentStudentIdentifier,
        updateStudentHopsLockRequest: {
          locked: false,
        },
      });

      dispatch({
        type: "HOPS_UPDATE_LOCKED",
        payload: { status: "READY", data: hopsLocked },
      });

      dispatch({
        type: "HOPS_CANCEL_EDITING",
        payload: undefined,
      });

      const hopsNotification = getState().notifications.notifications.find(
        (notification) => notification.id === "hops-editing-mode-notification"
      );

      if (hopsNotification) {
        dispatch(hideNotification(hopsNotification));
      }
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      dispatch(
        displayNotification(
          i18n.t("notifications.cancelEditingError", {
            ns: "hops_new",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * End editing. Saves possible changes and unlocks the HOPS for editing for other users.
 * @param data data
 */
const saveHops: SaveHopsTriggerType = function saveHops(data) {
  return async (
    dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>,
    getState: () => StateType
  ) => {
    const state = getState();

    const isUpperSecondary =
      state.hopsNew.studentInfo.studyProgrammeEducationType === "lukio";

    // Filter out empty subjects
    const updatedPlan = {
      ...state.hopsNew.hopsEditing.matriculationPlan,
      plannedSubjects:
        state.hopsNew.hopsEditing.matriculationPlan.plannedSubjects.filter(
          (subject) => subject.subject
        ),
    };

    // Check if the matriculation plan has changes
    // specifically after filtering out empty subjects
    const matriculationPlanHasChanges = !_.isEqual(
      state.hopsNew.hopsMatriculation.plan,
      updatedPlan
    );

    // Check if the HOPS form has changes
    const hopsFormHasChanges = !_.isEqual(
      state.hopsNew.hopsForm,
      state.hopsNew.hopsEditing.hopsForm
    );

    const studyPlanHasChanges = !_.isEqual(
      state.hopsNew.hopsEditing.plannedCourses,
      state.hopsNew.hopsStudyPlanState.plannedCourses
    );

    const allPromises = [];

    // Save hops form if there are changes. This because hops details are saved through
    // hops form endpoint. So if there are or are not changes to the form, we need to save it.
    if (hopsFormHasChanges || matriculationPlanHasChanges) {
      const editedFields = getEditedHopsFields(
        state.hopsNew.hopsForm,
        state.hopsNew.hopsEditing.hopsForm
      );

      allPromises.push(
        dispatch(
          saveHopsForm({
            details: data.details,
            editedFields: editedFields,
          })
        )
      );
    }

    // Save matriculation plan if there are changes
    if (isUpperSecondary && matriculationPlanHasChanges) {
      allPromises.push(
        dispatch(
          saveMatriculationPlan({
            plan: updatedPlan,
          })
        )
      );
    }

    if (studyPlanHasChanges) {
      allPromises.push(dispatch(saveStudyPlanData({})));
    }

    try {
      // Wait for all update promises to resolve
      await Promise.all(allPromises);

      // Then unlock the HOPS
      const hopsLocked = await hopsApi.updateStudentHopsLock({
        studentIdentifier: state.hopsNew.currentStudentIdentifier,
        updateStudentHopsLockRequest: {
          locked: false,
        },
      });

      data.onSuccess && data.onSuccess();

      dispatch({
        type: "HOPS_UPDATE_LOCKED",
        payload: { status: "READY", data: hopsLocked },
      });

      dispatch({
        type: "HOPS_CHANGE_MODE",
        payload: "READ",
      });

      const hopsNotification = getState().notifications.notifications.find(
        (notification) => notification.id === "hops-editing-mode-notification"
      );

      if (hopsNotification) {
        dispatch(hideNotification(hopsNotification));
      }
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      dispatch(
        displayNotification(
          i18n.t("notifications.updateError", {
            ns: "hops_new",
            context: "saveHops",
          }),
          "error"
        )
      );

      data.onFail && data.onFail();
    }
  };
};

/**
 * Update HOPS editing state
 * @param data Data containing partial updates to apply to editing state
 */
const updateHopsEditing: UpdateHopsEditingTriggerType =
  function updateHopsEditing(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "HOPS_UPDATE_EDITING",
        payload: data.updates,
      });
    };
  };

/**
 * Update HOPS editing study plan
 * @param data Data containing partial updates to apply to editing state
 */
const updateHopsEditingStudyPlan: UpdateHopsEditingStudyPlanTriggerType =
  function updateHopsEditingStudyPlan(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const updatedList = [...state.hopsNew.hopsEditing.plannedCourses];

      const index = updatedList.findIndex(
        (c) => c.identifier === data.updatedCourse.identifier
      );

      if (data.action === "add" && index === -1) {
        updatedList.push(data.updatedCourse);
      } else if (data.action === "delete" && index !== -1) {
        updatedList.splice(index, 1);
      } else if (data.action === "update" && index !== -1) {
        updatedList[index] = data.updatedCourse;
      }

      dispatch({
        type: "HOPS_UPDATE_EDITING",
        payload: {
          plannedCourses: updatedList,
        },
      });
    };
  };

/**
 * Update matriculation plan
 * @param data Data containing partial updates to apply to matriculation plan
 */
const updateMatriculationPlan: UpdateMatriculationPlanTriggerType =
  function updateMatriculationPlan(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const { plan, studentIdentifier } = data;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      // matriculation data is not ready aka not loaded, do nothing
      if (state.hopsNew.hopsMatriculationStatus !== "READY") {
        return;
      }

      try {
        // Calculate which subjects need eligibility updates
        const loadEligibilityForNewSubjects: MatriculationSubject[] = [];
        const deleteEligibilityForFollowingSubjects: MatriculationSubject[] =
          [];

        // Check for removed subjects
        state.hopsNew.hopsMatriculation.plan.plannedSubjects.forEach((s) => {
          const match = plan.plannedSubjects.find(
            (ns) => ns.subject === s.subject
          );
          if (!match) {
            const subject = state.hopsNew.hopsMatriculation.subjects.find(
              (sub) => sub.code === s.subject
            );
            deleteEligibilityForFollowingSubjects.push(subject);
          }
        });

        // Check for new subjects
        plan.plannedSubjects.forEach((s) => {
          const match =
            state.hopsNew.hopsMatriculation.plan.plannedSubjects.find(
              (ns) => ns.subject === s.subject
            );
          if (!match) {
            const subject = state.hopsNew.hopsMatriculation.subjects.find(
              (sub) => sub.code === s.subject
            );
            loadEligibilityForNewSubjects.push(subject);
          }
        });

        // Start with current eligibility list
        let updatedListOfEligibility = [
          ...state.hopsNew.hopsMatriculation.subjectsWithEligibility,
        ];

        // Remove subjects no longer in plan
        deleteEligibilityForFollowingSubjects.forEach((s) => {
          const index = updatedListOfEligibility.findIndex(
            (el) => el.subject.code === s.code
          );
          if (index !== -1) {
            updatedListOfEligibility.splice(index, 1);
          }
        });

        // Load eligibility for new subjects
        if (loadEligibilityForNewSubjects.length) {
          const newSubjectEligibilityDataArray =
            await Promise.all<MatriculationSubjectWithEligibility>(
              loadEligibilityForNewSubjects.map(async (s) => {
                const subjectEligibility =
                  await matriculationApi.getMatriculationSubjectEligibility({
                    studentIdentifier,
                    subjectCode: s.subjectCode,
                  });
                return {
                  ...subjectEligibility,
                  subject: s,
                };
              })
            );
          updatedListOfEligibility = [
            ...updatedListOfEligibility,
            ...newSubjectEligibilityDataArray,
          ];
        }

        // Sort by OPS order
        updatedListOfEligibility = updatedListOfEligibility.sort(
          (a, b) =>
            OPS2021SubjectCodesInOrder.indexOf(a.subject.subjectCode) -
            OPS2021SubjectCodesInOrder.indexOf(b.subject.subjectCode)
        );

        // Calculate new abistatus
        const abistatusData = abistatus(
          updatedListOfEligibility,
          state.hopsNew.hopsMatriculation.eligibility.credits,
          state.hopsNew.hopsMatriculation.eligibility.creditsRequired
        );

        // Create final eligibility object
        const eligibilityWithAbistatus: MatriculationEligibilityWithAbistatus =
          {
            ...abistatusData,
            personHasCourseAssessments:
              state.hopsNew.hopsMatriculation.eligibility
                .personHasCourseAssessments,
          };

        // Dispatch updates
        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_PLAN",
          payload: plan,
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_SUBJECT_ELIGIBILITY",
          payload: updatedListOfEligibility,
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_ELIGIBILITY",
          payload: eligibilityWithAbistatus,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          displayNotification(i18n.t("notifications.updateError"), "error")
        );
      }
    };
  };

/**
 * Update Hops locked
 * @param data Data containing partial updates to apply to Hops locked
 */
const updateHopsLocked: UpdateHopsLockedTriggerType = function updateHopsLocked(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const { locked } = data;

    const state = getState();

    // Hops locked is not loaded, do nothing
    if (state.hopsNew.hopsLocked === null) {
      return;
    }

    // Check if the current user is the same as the user who has locked the Hops
    // Meaning that the current user is the one who is editing
    if (
      locked.locked &&
      state.status.userId === locked.userEntityId &&
      state.hopsNew.hopsMode !== "EDIT"
    ) {
      dispatch({
        type: "HOPS_CHANGE_MODE",
        payload: "EDIT",
      });
    }
    // Check if current user is not same as the user who has locked the Hops
    // And that the Hops is not already in read mode
    else if (
      locked.locked &&
      state.status.userId !== locked.userEntityId &&
      state.hopsNew.hopsMode !== "READ"
    ) {
      dispatch({
        type: "HOPS_CHANGE_MODE",
        payload: "READ",
      });
    }

    dispatch({
      type: "HOPS_UPDATE_LOCKED",
      payload: { status: "READY", data: locked },
    });
  };
};

/**
 * Update Hops form
 * @param data Data containing partial updates to apply to Hops form
 */
const updateHopsForm: UpdateHopsFormTriggerType = function updateHopsForm(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    dispatch({
      type: "HOPS_FORM_UPDATE",
      payload: { status: "READY", data: data.form },
    });
  };
};

/**
 * Update Hops history
 * @param data Data containing partial updates to apply to Hops history
 */
const updateHopsHistory: UpdateHopsHistoryTriggerType =
  function updateHopsHistory(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      const updatedHistory = [...state.hopsNew.hopsFormHistory];

      //Check if the history is already in the state...
      const historyIndex = updatedHistory.findIndex(
        (h) => h.id === data.history.id
      );

      // ...if it is, update it
      if (historyIndex !== -1) {
        updatedHistory[historyIndex] = data.history;

        dispatch({
          type: "HOPS_FORM_HISTORY_UPDATE",
          payload: { status: "READY", data: updatedHistory },
        });
      }
      // ...otherwise append it
      else {
        dispatch({
          type: "HOPS_FORM_HISTORY_UPDATE",
          payload: {
            status: "READY",
            data: [data.history, ...updatedHistory],
          },
        });
      }
    };
  };

/**
 * Update HOPS form history entry thunk
 *
 * @param data data
 */
const updateHopsFormHistoryEntry: UpdateHopsFormHistoryEntryTriggerType =
  function updateHopsFormHistoryEntry(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Student identifier is either current student identifier or user school data identifier from current user
      const studentIdentifier =
        state.hopsNew.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      dispatch({
        type: "HOPS_FORM_HISTORY_ENTRY_UPDATE",
        payload: { status: "LOADING" },
      });

      try {
        // Update details and keep changes as it is in original entry
        const updatedEntryData = await hopsApi.updateStudentHopsHistoryEntry({
          studentIdentifier,
          entryId: data.entryId,
          updateStudentHopsHistoryEntryRequest: {
            details: data.updatedEntry.details,
            changes: data.originalEntry.changes,
          },
        });

        dispatch({
          type: "HOPS_FORM_HISTORY_ENTRY_UPDATE",
          payload: { status: "READY", data: updatedEntryData },
        });

        data.onSuccess && data.onSuccess();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "HOPS_FORM_HISTORY_ENTRY_UPDATE",
          payload: { status: "ERROR" },
        });

        dispatch(
          displayNotification(
            i18n.t("notifications.updateError", {
              ns: "common",
              context: "hopsEntry",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Load more HOPS form history data thunk
 *
 * @param data data
 */
const loadMoreHopsFormHistory: LoadMoreHopsFormHistoryTriggerType =
  function loadMoreHopsFormHistory(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Student identifier is either user identifier from props or current student identifier or user school data identifier from current user
      const studentIdentifier =
        data.userIdentifier ||
        state.hopsNew.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      dispatch({
        type: "HOPS_FORM_HISTORY_UPDATE",
        payload: { status: "LOADING" },
      });

      try {
        const moreHopsFormHistoryData =
          await hopsApi.getStudentHopsHistoryEntries({
            studentIdentifier,
            firstResult: 6,
            maxResults: 999,
          });

        dispatch({
          type: "HOPS_FORM_HISTORY_UPDATE",
          payload: {
            status: "READY",
            data: [
              ...state.hopsNew.hopsFormHistory,
              ...moreHopsFormHistoryData,
            ],
          },
        });

        dispatch({
          type: "HOPS_FORM_UPDATE_CAN_LOAD_MORE_HISTORY",
          payload: false,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "HOPS_FORM_HISTORY_UPDATE",
          payload: { status: "ERROR" },
        });

        dispatch(
          displayNotification(
            i18n.t("notifications.loadError", {
              ns: "hops_new",
              context: "hopsHistory",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Save/Update HOPS form data thunk
 * @param data data
 */
const saveHopsForm: SaveHopsFormTriggerType = function saveHopsForm(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();

    // Student identifier is either current student identifier or user school data identifier from current user
    const studentIdentifier =
      state.hopsNew.currentStudentIdentifier ||
      state.status.userSchoolDataIdentifier;

    // Only PYRAMUS students are supported
    if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
      throw new Error("Invalid student identifier");
    }

    dispatch({
      type: "HOPS_FORM_UPDATE",
      payload: { status: "LOADING" },
    });

    try {
      const savedFormData = await hopsApi.saveStudentHops({
        studentIdentifier,
        saveStudentHopsRequest: {
          formData: JSON.stringify(state.hopsNew.hopsEditing.hopsForm),
          historyDetails: data.details,
          historyChanges: data.editedFields.join(","),
        },
      });

      dispatch({
        type: "HOPS_FORM_UPDATE",
        payload: { status: "READY", data: JSON.parse(savedFormData.formData) },
      });

      dispatch({
        type: "HOPS_FORM_HISTORY_UPDATE",
        payload: {
          status: "READY",
          data: [savedFormData.latestChange, ...state.hopsNew.hopsFormHistory],
        },
      });

      dispatch(
        actions.displayNotification(
          i18n.t("notifications.saveSuccess", {
            ns: "common",
          }),
          "success"
        )
      );
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      dispatch({
        type: "HOPS_FORM_UPDATE",
        payload: { status: "ERROR" },
      });

      dispatch(
        actions.displayNotification(
          i18n.t("notifications.saveError", {
            ns: "common",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * Save study plan data
 * @param data Data containing partial updates to apply to study plan
 */
const saveStudyPlanData: SaveStudyPlanDataTriggerType =
  function saveStudyPlanData(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Without identifier
      const plannedCourses: PlannedCourse[] =
        state.hopsNew.hopsEditing.plannedCourses.map(
          ({ identifier, ...rest }) => rest
        );

      const updatedList = await hopsApi.updateStudentPlannedCourses({
        studentIdentifier: state.hopsNew.currentStudentIdentifier,
        updateStudentPlannedCoursesRequest: {
          plannedCourses,
        },
      });

      // Add identifier to planned courses
      const plannedCoursesWithIdentifier: PlannedCourseWithIdentifier[] =
        updatedList.map((course) => ({
          ...course,
          identifier: "planned-course-" + course.id,
        }));

      dispatch({
        type: "HOPS_STUDYPLAN_UPDATE_PLANNED_COURSES",
        payload: plannedCoursesWithIdentifier,
      });
    };
  };

/**
 * Initialize HOPS data thunk. This is used to load all necessary data for HOPS.
 * Important thing is that hops locked status is loaded first, as it triggers
 * loading of other data based on if current user is editing or not.
 * @param data data
 */
const initializeHops: InitializeHopsTriggerType = function initializeHops(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>,
    getState: () => StateType
  ) => {
    const state = getState();

    // Get student identifier
    const studentIdentifier =
      data.userIdentifier ||
      state.hopsNew.currentStudentIdentifier ||
      state.status.userSchoolDataIdentifier;

    // Just throw error if trying to initialize HOPS with invalid student identifier
    if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
      throw new Error("Invalid student identifier");
    }

    // If not IDLE we know that it is already initialized, or being initialized
    // Just call onSuccess and end method.
    if (state.hopsNew.initialized !== "IDLE") {
      const currentUserIsEditing =
        state.hopsNew.hopsLocked &&
        state.status.userId === state.hopsNew.hopsLocked.userEntityId;

      const isUppersecondary =
        state.hopsNew.studentInfo.studyProgrammeEducationType === "lukio";

      data.onSuccess && data.onSuccess(currentUserIsEditing, isUppersecondary);

      return;
    }

    dispatch({
      type: "HOPS_UPDATE_INITIALIZE_STATUS",
      payload: "INITIALIZING",
    });

    // Update identifier if changed
    if (state.hopsNew.currentStudentIdentifier !== studentIdentifier) {
      dispatch({
        type: "HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER",
        payload: studentIdentifier,
      });
    }

    // Set mode to READ by default
    dispatch({
      type: "HOPS_CHANGE_MODE",
      payload: "READ",
    });

    try {
      // 1. Get student info to determine form type
      const studentInfo = await initializeStudentInfo(
        studentIdentifier,
        dispatch,
        getState
      );

      // 2. Initialize HOPS form based on student type. In case if info is ready or loading
      // studentInfo will be undefined and this will not be executed
      studentInfo &&
        (await initializeHopsForms(
          studentIdentifier,
          studentInfo.studyProgrammeEducationType === "lukio",
          dispatch,
          getState
        ));

      // 3. Load HOPS form history as they are part of the form data
      await initializeHopsFormHistory(studentIdentifier, dispatch, getState);

      // 4. Initialize HOPS curriculum config
      await initializeHopsCurriculumConfig(dispatch, getState);

      // 5. Check lock status
      const hopsLocked = await initializeHopsLocked(
        studentIdentifier,
        dispatch,
        getState
      );

      const currentUserIsEditing =
        hopsLocked && state.status.userId === hopsLocked.userEntityId;

      const isUppersecondary =
        studentInfo.studyProgrammeEducationType === "lukio";

      // 5. Handle edit mode if user is the one who has locked HOPS
      // Here is loaded any missing data that is needed for edit mode
      // In case if hopsLocked is ready or loading, this will not be executed

      if (currentUserIsEditing) {
        // This will grow as we add more data to load for edit mode later on

        const promises = [];

        if (isUppersecondary) {
          promises.push(
            dispatch(
              loadMatriculationData({ userIdentifier: studentIdentifier })
            )
          );
        }

        promises.push(
          dispatch(loadStudyPlanData({ userIdentifier: studentIdentifier }))
        );

        await Promise.all(promises);

        dispatch({ type: "HOPS_CHANGE_MODE", payload: "EDIT" });

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.editingModePersistentInfo", {
              ns: "hops_new",
            }),
            "persistent-info",
            undefined,
            "hops-editing-mode-notification"
          )
        );
      }

      dispatch({
        type: "HOPS_UPDATE_INITIALIZE_STATUS",
        payload: "INITIALIZED",
      });

      data.onSuccess && data.onSuccess(currentUserIsEditing, isUppersecondary);
    } catch (err) {
      if (!isMApiError(err)) throw err;
      dispatch({
        type: "HOPS_UPDATE_INITIALIZE_STATUS",
        payload: "INITIALIZATION_FAILED",
      });

      dispatch(
        actions.displayNotification(
          i18n.t("notifications.initilizationError", {
            ns: "hops_new",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * Load study plan data
 * @param data Data containing partial updates to apply to study plan
 */
const loadStudyPlanData: LoadStudyPlanDataTriggerType =
  function loadStudyPlanData(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      const { userIdentifier } = data;

      const studentIdentifier = userIdentifier
        ? userIdentifier
        : state.status.userSchoolDataIdentifier;

      if (state.hopsNew.hopsStudyPlanStatus === "READY") {
        return;
      }

      dispatch({
        type: "HOPS_STUDYPLAN_UPDATE_STATUS",
        payload: "LOADING",
      });

      // If the student identifier has changed, update it
      if (state.hopsNew.currentStudentIdentifier !== studentIdentifier) {
        dispatch({
          type: "HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER",
          payload: studentIdentifier,
        });

        dispatch({
          type: "HOPS_UPDATE_CURRENTSTUDENT_STUDYPROGRAM",
          payload: state.status.profile.studyProgrammeName,
        });
      }

      const plannedCourses = await hopsApi.getStudentPlannedCourses({
        studentIdentifier,
      });

      const studyActivity = await hopsApi.getStudentStudyActivity({
        studentIdentifier,
      });

      const studyOptions = await hopsApi.getStudentAlternativeStudyOptions({
        studentIdentifier,
      });

      const educationTypeCode =
        state.hopsNew.studentInfo.studyProgrammeEducationType;

      const studentOps = state.hopsNew.studentInfo.curriculumName;

      const availableOPSCourses = await hopsApi.getOpsCourses({
        ops: studentOps,
        educationTypeCode,
      });

      // Add identifier to planned courses because
      const plannedCoursesWithIdentifier: PlannedCourseWithIdentifier[] =
        plannedCourses.map((course) => ({
          ...course,
          identifier: "planned-course-" + course.id,
        }));

      dispatch({
        type: "HOPS_STUDYPLAN_UPDATE_PLANNED_COURSES",
        payload: plannedCoursesWithIdentifier,
      });

      dispatch({
        type: "HOPS_UPDATE_STUDY_ACTIVITY",
        payload: studyActivity,
      });

      dispatch({
        type: "HOPS_UPDATE_AVAILABLE_OPS_COURSES",
        payload: availableOPSCourses,
      });

      dispatch({
        type: "HOPS_STUDYPLAN_UPDATE_STUDY_OPTIONS",
        payload: studyOptions,
      });

      dispatch({
        type: "HOPS_STUDYPLAN_UPDATE_STATUS",
        payload: "READY",
      });
    };
  };

/**
 * Set selected course
 * @param data Data containing course to set
 */
const updateTimeContextSelection: UpdateTimeContextSelectionTriggerType =
  function updateTimeContextSelection(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      if (data === null) {
        dispatch({
          type: "HOPS_CLEAR_TIME_CONTEXT_SELECTION",
          payload: null,
        });
      } else {
        dispatch({
          type: "HOPS_SET_TIME_CONTEXT_SELECTION",
          payload: data.selection,
        });
      }
    };
  };

/**
 * Update selected courses
 * @param data Data containing courses to add to period
 */
const updateSelectedCourses: UpdateSelectedCoursesTriggerType =
  function updateSelectedCourses(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      const updatedCoursesIds = [
        ...state.hopsNew.hopsEditing.selectedCoursesIds,
      ];

      const index = updatedCoursesIds.findIndex((courseIdentifier) => {
        if (courseIdentifier === data.courseIdentifier) {
          return true;
        }
        return false;
      });

      if (index !== -1) {
        updatedCoursesIds.splice(index, 1);
      } else {
        updatedCoursesIds.push(data.courseIdentifier);
      }

      dispatch({
        type: "HOPS_UPDATE_SELECTED_COURSES",
        payload: updatedCoursesIds,
      });
    };
  };

/**
 * Clear selected courses
 */
const clearSelectedCourses: ClearSelectedCoursesTriggerType =
  function clearSelectedCourses() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "HOPS_CLEAR_SELECTED_COURSES",
        payload: null,
      });
    };
  };

/**
 * Update editing study plan batch
 * @param data Data containing planned courses to update
 */
const updateEditingStudyPlanBatch: UpdateEditingStudyPlanBatchTriggerType =
  function updateEditingStudyPlanBatch(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({ type: "HOPS_UPDATE_EDITING_STUDYPLAN_BATCH", payload: data });
    };
  };

/**
 * Initialize student info
 * @param studentIdentifier student identifier
 * @param dispatch dispatch
 * @param getState getState
 * @returns student info
 */
const initializeStudentInfo = async (
  studentIdentifier: string,
  dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>,
  getState: () => StateType
) => {
  const state = getState();

  if (state.hopsNew.studentInfoStatus !== "IDLE") {
    return;
  }

  dispatch({
    type: "HOPS_STUDENT_INFO_UPDATE",
    payload: { status: "LOADING" },
  });
  const studentInfo = await hopsApi.getStudentInfo({ studentIdentifier });
  dispatch({
    type: "HOPS_STUDENT_INFO_UPDATE",
    payload: { status: "READY", data: studentInfo },
  });

  return studentInfo;
};

/**
 * Initialize HOPS form
 * @param studentIdentifier student identifier
 * @param isSecondary is secondary studies
 * @param dispatch dispatch
 * @param getState getState
 */
const initializeHopsForms = async (
  studentIdentifier: string,
  isSecondary: boolean,
  dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>,
  getState: () => StateType
) => {
  const state = getState();

  if (state.hopsNew.hopsFormStatus !== "IDLE") {
    return;
  }

  const hopsFormData = await hopsApi.getStudentHops({ studentIdentifier });

  // Initialize HOPS form based on student type and existing data
  const initializedHopsFormData = initializeHopsForm(hopsFormData, isSecondary);

  // Dispatch initialized HOPS form data to state
  dispatch({
    type: "HOPS_FORM_UPDATE",
    payload: { status: "READY", data: initializedHopsFormData },
  });
};

/**
 * Initialize HOPS form history
 * @param studentIdentifier student identifier
 * @param dispatch dispatch
 * @param getState getState
 */
const initializeHopsFormHistory = async (
  studentIdentifier: string,
  dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>,
  getState: () => StateType
) => {
  const state = getState();

  if (state.hopsNew.hopsFormHistoryStatus !== "IDLE") {
    return;
  }

  dispatch({
    type: "HOPS_FORM_HISTORY_UPDATE",
    payload: { status: "LOADING" },
  });
  const hopsFormHistory = await hopsApi.getStudentHopsHistoryEntries({
    studentIdentifier,
    maxResults: 6,
  });

  // Update the state with the first 5 entries
  const updatedToState = hopsFormHistory.slice(0, 5);
  dispatch({
    type: "HOPS_FORM_HISTORY_UPDATE",
    payload: { status: "READY", data: updatedToState },
  });

  // Check if there are more history entries to load
  const canLoadMoreHistory = hopsFormHistory.length > 5;
  dispatch({
    type: "HOPS_FORM_UPDATE_CAN_LOAD_MORE_HISTORY",
    payload: canLoadMoreHistory,
  });
};

/**
 * Initialize HOPS locked status
 * @param studentIdentifier student identifier
 * @param dispatch dispatch
 * @param getState getState
 * @returns hops locked
 */
const initializeHopsLocked = async (
  studentIdentifier: string,
  dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>,
  getState: () => StateType
) => {
  const state = getState();

  if (state.hopsNew.hopsLockedStatus !== "IDLE") {
    return;
  }

  dispatch({ type: "HOPS_UPDATE_LOCKED", payload: { status: "LOADING" } });
  const hopsLocked = await hopsApi.getStudentHopsLock({
    studentIdentifier,
  });
  dispatch({
    type: "HOPS_UPDATE_LOCKED",
    payload: { status: "READY", data: hopsLocked },
  });

  return hopsLocked;
};

/**
 * Helper function to initialize HOPS form
 * @param existingData existing data
 * @param isSecondary is secondary studies
 * @returns initialized HOPS form
 */
function initializeHopsForm(
  existingData: HopsForm | string,
  isSecondary: boolean
): HopsForm {
  const baseForm = isSecondary
    ? { ...initializeSecondaryStudiesHops() }
    : { ...initializeCompulsoryStudiesHops() };

  // If there is no existing data or it is empty string, return base initial form
  if (!existingData || existingData === "") return baseForm;

  const existingDataForm = existingData as HopsForm;

  // If there is existing data, but it is old compulsory studies form, return initialized compulsory studies form
  // that is initialized from old data
  if (!isSecondary && isCompulsoryStudiesHopsOld(existingDataForm)) {
    return {
      ...(baseForm as CompulsoryStudiesHops),
      ...initializeCompulsoryStudiesHopsFromOld(existingDataForm),
    };
  }

  // By default return initialized secondary studies form that is initialized from existing data
  return {
    ...(baseForm as SecondaryStudiesHops),
    ...(existingDataForm as SecondaryStudiesHops),
  };
}

/**
 * Initialize HOPS curriculum config
 * @param dispatch dispatch
 * @param getState getState
 */
async function initializeHopsCurriculumConfig(
  dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>,
  getState: () => StateType
) {
  const state = getState();

  if (state.hopsNew.hopsCurriculumConfigStatus !== "IDLE") {
    return;
  }

  dispatch({
    type: "HOPS_UPDATE_CURRICULUM_CONFIG",
    payload: { status: "LOADING" },
  });

  const curriculumConfig: CurriculumConfig = getCurriculumConfig(
    state.hopsNew.studentInfo
  );

  dispatch({
    type: "HOPS_UPDATE_CURRICULUM_CONFIG",
    payload: { status: "READY", data: curriculumConfig },
  });
}

export {
  startEditing,
  cancelEditing,
  initializeHops,
  loadMatriculationData,
  loadMatriculationExamHistory,
  loadMoreHopsFormHistory,
  loadStudyPlanData,
  resetHopsData,
  saveHops,
  saveHopsForm,
  saveMatriculationPlan,
  updateHopsEditing,
  updateHopsFormHistoryEntry,
  updateHopsLocked,
  updateHopsForm,
  updateHopsHistory,
  updateMatriculationExamination,
  updateMatriculationPlan,
  verifyMatriculationExam,
  updateHopsEditingStudyPlan,
  saveStudyPlanData,
  updateTimeContextSelection,
  updateSelectedCourses,
  clearSelectedCourses,
  updateEditingStudyPlanBatch,
};
