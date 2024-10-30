import actions from "../../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Dispatch, Action } from "redux";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import {
  HopsHistoryEntry,
  MatriculationExam,
  MatriculationExamChangeLogEntry,
  MatriculationExamStudentStatus,
  MatriculationPlan,
  MatriculationResults,
  MatriculationSubject,
  StudentInfo,
} from "~/generated/client";
import {
  MatriculationEligibilityWithAbistatus,
  MatriculationSubjectWithEligibility,
  ReducerStateType,
} from "~/reducers/hops";
import i18n from "~/locales/i18n";
import { abistatus } from "~/helper-functions/abistatus";
import { displayNotification } from "~/actions/base/notifications";
import { OPS2021SubjectCodesInOrder } from "~/mock/mock-data";
import {
  HopsForm,
  initializeCompulsoryStudiesHops,
  initializeSecondaryStudiesHops,
} from "~/@types/hops";

// Api instances
const recordsApi = MApi.getRecordsApi();
const matriculationApi = MApi.getMatriculationApi();
const hopsApi = MApi.getHopsApi();

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

// New action type for updating HOPS form status and data
export type HOPS_FORM_UPDATE = SpecificActionType<
  "HOPS_FORM_UPDATE",
  { status: ReducerStateType; data: HopsForm | null }
>;

// New action type for updating student info status and data
export type HOPS_STUDENT_INFO_UPDATE = SpecificActionType<
  "HOPS_STUDENT_INFO_UPDATE",
  { status: ReducerStateType; data: StudentInfo | null }
>;

// Add this new action type
export type HOPS_FORM_HISTORY_UPDATE = SpecificActionType<
  "HOPS_FORM_HISTORY_UPDATE",
  { status: ReducerStateType; data: HopsHistoryEntry[] | null }
>;

// Add this new action type
export type HOPS_FORM_HISTORY_ENTRY_UPDATE = SpecificActionType<
  "HOPS_FORM_HISTORY_ENTRY_UPDATE",
  { status: ReducerStateType; data: HopsHistoryEntry }
>;

// Add this new action type
export type HOPS_FORM_HISTORY_APPEND = SpecificActionType<
  "HOPS_FORM_HISTORY_APPEND",
  { status: ReducerStateType; data?: HopsHistoryEntry[] | null }
>;

// Add this new action type
export type HOPS_FORM_SAVE = SpecificActionType<
  "HOPS_FORM_SAVE",
  { status: ReducerStateType; data: HopsForm | null }
>;

/**
 * loadExamDataTriggerType
 */
export interface LoadMatriculationDataTriggerType {
  (data: { userIdentifier?: string }): AnyActionType;
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
  (data: { examId: number }): AnyActionType;
}

/**
 * LoadMatriculationExamHistoryTriggerType
 */
export interface LoadMatriculationExamHistoryTriggerType {
  (data: { examId: number; userIdentifier?: string }): AnyActionType;
}

/**
 * SaveMatriculationPlanTriggerType
 */
export interface SaveMatriculationPlanTriggerType {
  (data: { plan: MatriculationPlan }): AnyActionType;
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
 * LoadStudentInfoTriggerType
 */
export interface LoadStudentInfoTriggerType {
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
    updatedEntry: Partial<HopsHistoryEntry>;
    onSuccess?: () => void;
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
  (data: {
    form: HopsForm;
    details?: string;
    onSuccess?: () => void;
  }): AnyActionType;
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

      const studentIdentifier = data.userIdentifier
        ? data.userIdentifier
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
      const studentIdentifier = state.hopsNew.currentStudentIdentifier;

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
      const studentIdentifier = state.hopsNew.currentStudentIdentifier;

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
      const studentIdentifier = state.hopsNew.currentStudentIdentifier;

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
 * Load student HOPS form data thunk
 *
 * @param data data
 */
const loadStudentHopsForm: LoadStudentHopsFormTriggerType =
  function loadStudentHopsForm(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const studentIdentifier = data.userIdentifier
        ? data.userIdentifier
        : state.status.userSchoolDataIdentifier;

      if (state.hopsNew.hopsFormStatus === "READY") {
        return;
      }

      dispatch({
        type: "HOPS_FORM_UPDATE",
        payload: { status: "LOADING", data: null },
      });

      try {
        // Student info is needed for HOPS form
        const studentInfoData = await hopsApi.getStudentInfo({
          studentIdentifier,
        });

        dispatch({
          type: "HOPS_STUDENT_INFO_UPDATE",
          payload: { status: "READY", data: studentInfoData },
        });

        // Form data for HOPS
        const hopsFormData = await hopsApi.getStudentHops({
          studentIdentifier,
        });

        let initializedHopsFormData: HopsForm;

        // If there is no form data, lets only initialize it
        if (hopsFormData === "") {
          if (studentInfoData.studyProgrammeEducationType === "lukio") {
            initializedHopsFormData = {
              type: "secondary",
              ...initializeSecondaryStudiesHops(),
            };
          } else {
            initializedHopsFormData = {
              type: "compulsory",
              ...initializeCompulsoryStudiesHops(),
            };
          }
        }
        // If there is form data, lets merge it with initialized data as there might be new fields or
        // not all fields are filled
        else {
          if (studentInfoData.studyProgrammeEducationType === "lukio") {
            initializedHopsFormData = {
              type: "secondary",
              ...initializeSecondaryStudiesHops(),
              ...hopsFormData,
            };
          } else {
            initializedHopsFormData = {
              type: "compulsory",
              ...initializeCompulsoryStudiesHops(),
              ...hopsFormData,
            };
          }
        }

        dispatch({
          type: "HOPS_FORM_UPDATE",
          payload: { status: "READY", data: initializedHopsFormData },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "HOPS_FORM_UPDATE",
          payload: { status: "ERROR", data: null },
        });

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "studies",
              context: "hopsForm",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Load student info data thunk
 *
 * @param data data
 */
const loadStudentInfo: LoadStudentInfoTriggerType = function loadStudentInfo(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();
    const studentIdentifier = data.userIdentifier
      ? data.userIdentifier
      : state.status.userSchoolDataIdentifier;

    if (state.hopsNew.studentInfoStatus === "READY") {
      return;
    }

    dispatch({
      type: "HOPS_STUDENT_INFO_UPDATE",
      payload: { status: "LOADING", data: null },
    });

    try {
      // Assuming there's an API endpoint to fetch student info
      const studentInfoData = await hopsApi.getStudentInfo({
        studentIdentifier,
      });

      dispatch({
        type: "HOPS_STUDENT_INFO_UPDATE",
        payload: { status: "READY", data: studentInfoData },
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      dispatch({
        type: "HOPS_STUDENT_INFO_UPDATE",
        payload: { status: "ERROR", data: null },
      });

      dispatch(
        actions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "studies",
            context: "studentInfo",
          }),
          "error"
        )
      );
    }
  };
};

/**
 * Load HOPS form history data thunk
 *
 * @param data data
 */
const loadHopsFormHistory: LoadHopsFormHistoryTriggerType =
  function loadHopsFormHistory(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const studentIdentifier = data.userIdentifier
        ? data.userIdentifier
        : state.status.userSchoolDataIdentifier;

      if (state.hopsNew.hopsFormHistoryStatus === "READY") {
        return;
      }

      dispatch({
        type: "HOPS_FORM_HISTORY_UPDATE",
        payload: { status: "LOADING", data: null },
      });

      try {
        const hopsFormHistoryData = await hopsApi.getStudentHopsHistoryEntries({
          studentIdentifier,
        });

        dispatch({
          type: "HOPS_FORM_HISTORY_UPDATE",
          payload: { status: "READY", data: hopsFormHistoryData },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "HOPS_FORM_HISTORY_UPDATE",
          payload: { status: "ERROR", data: null },
        });

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "studies",
              context: "hopsFormHistory",
            }),
            "error"
          )
        );
      }
    };
  };

// Add this new function
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
      const studentIdentifier = state.status.userSchoolDataIdentifier;

      dispatch({
        type: "HOPS_FORM_HISTORY_ENTRY_UPDATE",
        payload: { status: "LOADING", data: null },
      });

      try {
        // Assuming there's an API endpoint to update a HOPS form history entry
        const updatedEntryData = await hopsApi.updateStudentHopsHistoryEntry({
          studentIdentifier,
          entryId: data.entryId,
          updateStudentHopsHistoryEntryRequest: {
            details: data.updatedEntry.details,
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
          payload: { status: "ERROR", data: null },
        });

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.updateError", {
              ns: "studies",
              context: "hopsFormHistoryEntry",
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

      const studentIdentifier = data.userIdentifier
        ? data.userIdentifier
        : state.status.userSchoolDataIdentifier;

      dispatch({
        type: "HOPS_FORM_HISTORY_APPEND",
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
          type: "HOPS_FORM_HISTORY_APPEND",
          payload: { status: "READY", data: moreHopsFormHistoryData },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch({
          type: "HOPS_FORM_HISTORY_APPEND",
          payload: { status: "ERROR", data: null },
        });

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "studies",
              context: "hopsFormHistory",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Save/Update HOPS form data thunk
 *
 * @param data data
 */
const saveHopsForm: SaveHopsFormTriggerType = function saveHopsForm(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const state = getState();
    const studentIdentifier = state.status.userSchoolDataIdentifier;

    dispatch({
      type: "HOPS_FORM_SAVE",
      payload: { status: "LOADING", data: null },
    });

    try {
      // Assuming there's an API endpoint to save/update HOPS form
      const savedFormData = await hopsApi.saveStudentHops({
        studentIdentifier,
        saveStudentHopsRequest: {
          formData: JSON.stringify(data.form),
          historyDetails: data.details,
        },
      });

      const parsedFormData = JSON.parse(savedFormData) as HopsForm;

      dispatch({
        type: "HOPS_FORM_SAVE",
        payload: { status: "READY", data: parsedFormData },
      });

      dispatch(
        actions.displayNotification(
          i18n.t("notifications.saveSuccess", {
            ns: "common",
          }),
          "success"
        )
      );

      data.onSuccess && data.onSuccess();
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      dispatch({
        type: "HOPS_FORM_SAVE",
        payload: { status: "ERROR", data: null },
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

export {
  loadMatriculationData,
  verifyMatriculationExam,
  loadMatriculationExamHistory,
  saveMatriculationPlan,
  updateMatriculationExamination,
  resetMatriculationData,
  loadStudentHopsForm,
  loadStudentInfo,
  loadHopsFormHistory,
  updateHopsFormHistoryEntry,
  loadMoreHopsFormHistory,
  saveHopsForm,
};
