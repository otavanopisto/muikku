import actions from "../../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Dispatch, Action } from "redux";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import {
  HopsLocked,
  MatriculationExam,
  MatriculationExamChangeLogEntry,
  MatriculationExamStudentStatus,
  MatriculationPlan,
  MatriculationResults,
  MatriculationSubject,
  PlannedCourse,
} from "~/generated/client";
import {
  CourseChangeAction,
  HopsEditingState,
  HopsMode,
  MatriculationEligibilityWithAbistatus,
  MatriculationSubjectWithEligibility,
  PlannedCourseWithIdentifier,
  ReducerStateType,
} from "~/reducers/hops";
import i18n from "~/locales/i18n";
import { abistatus } from "~/helper-functions/abistatus";
import { displayNotification } from "~/actions/base/notifications";
import { OPS2021SubjectCodesInOrder } from "~/mock/mock-data";
import _ from "lodash";
import { plannedCoursesMock } from "~/components/hops/body/application/study-planing/mock";

// Api instances
const hopsApi = MApi.getHopsApi();
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

export type HOPS_STUDYPLAN_UPDATE_PLANNED_COURSES = SpecificActionType<
  "HOPS_STUDYPLAN_UPDATE_PLANNED_COURSES",
  PlannedCourseWithIdentifier[]
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

export type HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER = SpecificActionType<
  "HOPS_UPDATE_CURRENTSTUDENTIDENTIFIER",
  string
>;

export type HOPS_UPDATE_CURRENTSTUDENT_STUDYPROGRAM = SpecificActionType<
  "HOPS_UPDATE_CURRENTSTUDENT_STUDYPROGRAM",
  string
>;

export type HOPS_RESET_DATA = SpecificActionType<"HOPS_RESET_DATA", undefined>;

// Add new action type
export type HOPS_CHANGE_MODE = SpecificActionType<"HOPS_CHANGE_MODE", HopsMode>;

export type HOPS_CANCEL_EDITING = SpecificActionType<
  "HOPS_CANCEL_EDITING",
  undefined
>;

export type HOPS_UPDATE_LOCKED = SpecificActionType<
  "HOPS_UPDATE_LOCKED",
  HopsLocked
>;

// Add new action type
export type HOPS_UPDATE_EDITING = SpecificActionType<
  "HOPS_UPDATE_EDITING",
  Partial<HopsEditingState>
>;

export type HOPS_UPDATE_EDITING_STUDYPLAN = SpecificActionType<
  "HOPS_UPDATE_EDITING_STUDYPLAN",
  PlannedCourseWithIdentifier[]
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
 * EndEditingTriggerType
 */
export interface EndEditingTriggerType {
  (): AnyActionType;
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
export interface ResetMatriculationDataTriggerType {
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
 * UpdateHopsLockedTriggerType
 */
export interface UpdateHopsLockedTriggerType {
  (data: { locked: HopsLocked; studentIdentifier: string }): AnyActionType;
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
      const { userIdentifier } = data;
      const state = getState();

      const studentIdentifier = userIdentifier
        ? userIdentifier
        : state.status.userSchoolDataIdentifier;

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
        // NOTE: This is for registering websocket events and will be refactored when actual HOPS form is implemented
        await hopsApi.getStudentHops({
          studentIdentifier,
        });

        // For now we get locked status information from the Hops API here
        // and later after other hops functions are implemented we will
        // move this to hops thunk specifically
        const hopsLocked = await hopsApi.getStudentHopsLock({
          studentIdentifier,
        });

        dispatch({
          type: "HOPS_UPDATE_LOCKED",
          payload: hopsLocked,
        });

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

        // Check if the current user is the same as the user who has locked the Hops
        // Meaning that the current user is the one who is editing
        if (state.status.userId === hopsLocked.userEntityId) {
          dispatch({
            type: "HOPS_CHANGE_MODE",
            payload: "EDIT",
          });
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
      const { examId } = data;
      const state = getState();
      const studentIdentifier = state.hopsNew.currentStudentIdentifier;

      try {
        await matriculationApi.setStudentExamEnrollmentState({
          examId,
          studentIdentifier,
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
      const { examId } = data;

      const state = getState();
      const studentIdentifier = state.hopsNew.currentStudentIdentifier;

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
            studentIdentifier,
          });

        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAM_HISTORY",
          payload: {
            examId,
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
              examId,
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
      const { plan } = data;
      const state = getState();
      const studentIdentifier = state.hopsNew.currentStudentIdentifier;

      try {
        await matriculationApi.setStudentMatriculationPlan({
          studentIdentifier,
          setStudentMatriculationPlanRequest: plan,
        });

        // After saving the plan, we need to update the eligibility for the subjects
        // if there are any changes in the plan
        const loadEligibilityForNewSubjects: MatriculationSubject[] = [];
        const deleteEligibilityForFollowingSubjects: MatriculationSubject[] =
          [];

        // Check if subjects are removed and add them to the list
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

        // Check if new subjects are added and add them to the list
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
      const studentIdentifier = state.hopsNew.currentStudentIdentifier;

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
 * resetMatriculationData
 */
const resetMatriculationData: ResetMatriculationDataTriggerType =
  function resetMatriculationData() {
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

    // Check matriculation data
    if (state.hopsNew.hopsMatriculationStatus !== "READY") {
      dispatch(
        loadMatriculationData({
          userIdentifier: state.hopsNew.currentStudentIdentifier,
        })
      );
    }

    if (state.hopsNew.hopsBackgroundStatus !== "READY") {
      // TODO: Load background data
    }

    if (state.hopsNew.hopsStudyPlanStatus !== "READY") {
      // TODO: Load study plan data
      dispatch(
        loadStudyPlanData({
          userIdentifier: state.hopsNew.currentStudentIdentifier,
        })
      );
    }

    if (state.hopsNew.hopsCareerPlanStatus !== "READY") {
      // TODO: Load career plan data
    }

    const hopsLocked = await hopsApi.updateStudentHopsLock({
      studentIdentifier: state.hopsNew.currentStudentIdentifier,
      updateStudentHopsLockRequest: {
        locked: true,
      },
    });

    dispatch({
      type: "HOPS_UPDATE_LOCKED",
      payload: hopsLocked,
    });

    // Change mode after ensuring data is loaded
    dispatch({
      type: "HOPS_CHANGE_MODE",
      payload: "EDIT",
    });
  };
};

/**
 * End editing. Saves possible changes and unlocks the HOPS for editing for other users.
 */
const endEditing: EndEditingTriggerType = function endEditing() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();

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

    const studyPlanHasChanges = !_.isEqual(
      state.hopsNew.hopsEditing.plannedCourses,
      state.hopsNew.hopsStudyPlanState.plannedCourses
    );

    if (matriculationPlanHasChanges) {
      dispatch(
        saveMatriculationPlan({
          plan: updatedPlan,
        })
      );
    }

    if (studyPlanHasChanges) {
      dispatch(saveStudyPlanData({}));
    }

    const hopsLocked = await hopsApi.updateStudentHopsLock({
      studentIdentifier: state.hopsNew.currentStudentIdentifier,
      updateStudentHopsLockRequest: {
        locked: false,
      },
    });

    dispatch({
      type: "HOPS_UPDATE_LOCKED",
      payload: hopsLocked,
    });

    dispatch({
      type: "HOPS_CHANGE_MODE",
      payload: "READ",
    });
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

    const hopsLocked = await hopsApi.updateStudentHopsLock({
      studentIdentifier: state.hopsNew.currentStudentIdentifier,
      updateStudentHopsLockRequest: {
        locked: false,
      },
    });

    dispatch({
      type: "HOPS_UPDATE_LOCKED",
      payload: hopsLocked,
    });

    dispatch({
      type: "HOPS_CANCEL_EDITING",
      payload: undefined,
    });
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
      payload: locked,
    });
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

      const hopsLocked = await hopsApi.getStudentHopsLock({
        studentIdentifier,
      });

      dispatch({
        type: "HOPS_UPDATE_LOCKED",
        payload: hopsLocked,
      });

      let plannedCourses = await hopsApi.getStudentPlannedCourses({
        studentIdentifier,
      });

      if (plannedCourses.length === 0) {
        plannedCourses = plannedCoursesMock;
      }

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

      // Check if the current user is the same as the user who has locked the Hops
      // Meaning that the current user is the one who is editing
      if (state.status.userId === hopsLocked.userEntityId) {
        dispatch({
          type: "HOPS_CHANGE_MODE",
          payload: "EDIT",
        });
      }

      dispatch({
        type: "HOPS_STUDYPLAN_UPDATE_STATUS",
        payload: "READY",
      });
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

export {
  loadMatriculationData,
  loadStudyPlanData,
  verifyMatriculationExam,
  loadMatriculationExamHistory,
  saveMatriculationPlan,
  saveStudyPlanData,
  updateMatriculationExamination,
  resetMatriculationData,
  startEditing,
  endEditing,
  cancelEditing,
  updateHopsEditing,
  updateHopsEditingStudyPlan,
  updateMatriculationPlan,
  updateHopsLocked,
};
