import actions from "../../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Dispatch } from "react-redux";
import MApi, { isMApiError } from "~/api/api";
import {
  MatriculationEligibility,
  MatriculationExam,
  MatriculationExamChangeLogEntry,
  MatriculationExamStudentStatus,
  MatriculationPlan,
  MatriculationSubject,
} from "~/generated/client";
import {
  MatriculationSubjectWithEligibility,
  ReducerStateType,
} from "~/reducers/hops";
import i18n from "~/locales/i18n";

// Api instances
const recordsApi = MApi.getRecordsApi();
const matriculationApi = MApi.getMatriculationApi();

// HOPS BACKGROUND ACTIONS TYPES

export type HOPS_BACKGROUND_UPDATE_STATUS = SpecificActionType<
  "HOPS_BACKGROUND_UPDATE_STATUS",
  ReducerStateType
>;

// HOPS STUDY PLAN ACTIONS TYPES

export type HOPS_STUDYPLAN_UPDATE_STATUS = SpecificActionType<
  "HOPS_STUDYPLAN_UPDATE_STATUS",
  ReducerStateType
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

export type HOPS_MATRICULATION_UPDATE_SUBJECTS = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_SUBJECTS",
  MatriculationSubject[]
>;

export type HOPS_MATRICULATION_UPDATE_ELIGIBILITY = SpecificActionType<
  "HOPS_MATRICULATION_UPDATE_ELIGIBILITY",
  MatriculationEligibility
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

/**
 * loadExamDataTriggerType
 */
export interface loadMatriculationDataTriggerType {
  (userIdentifier?: string): AnyActionType;
}

/**
 * verifyMatriculationEligibilityTriggerType
 */
export interface VerifyMatriculationExamTriggerType {
  (examId: number): AnyActionType;
}

/**
 * LoadMatriculationExamHistoryTriggerType
 */
export interface LoadMatriculationExamHistoryTriggerType {
  (examId: number): AnyActionType;
}

/**
 * SaveMatriculationPlanTriggerType
 */
export interface SaveMatriculationPlanTriggerType {
  (plan: MatriculationPlan): AnyActionType;
}

/**
 * Load matriculation exam data thunk
 *
 * @param userIdentifier userIdentifier
 */
const loadMatriculationData: loadMatriculationDataTriggerType =
  function loadMatriculationData(userIdentifier) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      const studentIdentifier = userIdentifier
        ? userIdentifier
        : state.status.userSchoolDataIdentifier;

      if (state.hopsNew.hopsMatriculationStatus === "READY") {
        return;
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
                    await recordsApi.getMatriculationSubjectEligibility({
                      studentIdentifier,
                      subjectCode: s.subjectCode,
                    });

                  return {
                    ...subjectEligibility,
                    subject: s,
                  };
                })
              );

            dispatch({
              type: "HOPS_MATRICULATION_UPDATE_SUBJECT_ELIGIBILITY",
              payload: subjectEligibilityDataArray,
            });
          } catch (err) {
            // FIX: ADD ERROR HANDLING
            if (!isMApiError(err)) {
              throw err;
            }
          }
        }

        //If the studentIdentifier is not provided, this is called for you, not someone else.
        // So we go ahead and call exams for you.

        const matriculationExams = await matriculationApi.getStudentExams({
          studentIdentifier,
        });
        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAMS",
          payload: matriculationExams,
        });

        // Load and dispatch student matriculation eligibility
        const eligibility = await recordsApi.getStudentMatriculationEligibility(
          {
            studentIdentifier,
          }
        );

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_ELIGIBILITY",
          payload: eligibility,
        });

        // All done
        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_STATUS",
          payload: "READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        // FIX: ADD ERROR HANDLING
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
 * @param examId examId
 */
const verifyMatriculationExam: VerifyMatriculationExamTriggerType =
  function cancelMatriculationExam(examId) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        await matriculationApi.setStudentExamEnrollmentState({
          examId,
          studentIdentifier: getState().status.userSchoolDataIdentifier,
          setStudentExamEnrollmentStateRequest: {
            state: "CONFIRMED",
          },
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAM_STATE",
          payload: {
            examId,
            newState: "CONFIRMED",
          },
        });
      } catch (err) {
        // FIX: ADD ERROR HANDLING
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };
  };

/**
 * Load matriculation exam history
 * @param examId examId
 */
const loadMatriculationExamHistory: LoadMatriculationExamHistoryTriggerType =
  function matriculationExamHistoryTriggerType(examId) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY_STATUS",
        payload: {
          examId,
          status: "LOADING",
        },
      });

      try {
        const entryLogs =
          await matriculationApi.getStudentExamEnrollmentChangeLog({
            examId,
            studentIdentifier: getState().status.userSchoolDataIdentifier,
          });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY",
          payload: {
            examId,
            history: entryLogs,
            status: "READY",
          },
        });
      } catch (err) {
        // FIX: ADD ERROR HANDLING
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };
  };

/**
 * saveMatriculationPlan
 * @param plan plan
 */
const saveMatriculationPlan: SaveMatriculationPlanTriggerType =
  function saveMatriculationPlan(plan) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const studentIdentifier = getState().status.userSchoolDataIdentifier;

      try {
        await matriculationApi.setStudentMatriculationPlan({
          studentIdentifier,
          setStudentMatriculationPlanRequest: plan,
        });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_PLAN",
          payload: plan,
        });
      } catch (err) {
        // FIX: ADD ERROR HANDLING
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };
  };

export {
  loadMatriculationData,
  verifyMatriculationExam,
  loadMatriculationExamHistory,
  saveMatriculationPlan,
};
