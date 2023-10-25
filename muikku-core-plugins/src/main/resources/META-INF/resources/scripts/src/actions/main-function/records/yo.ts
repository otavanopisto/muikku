import actions from "../../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  MatriculationStatusType,
  MatriculationSubjectWithEligibilityStatus,
  MatriculationSubjectEligibilityStatusType,
} from "~/reducers/main-function/records/yo";
import { StateType } from "~/reducers";
import { Dispatch } from "react-redux";
import {
  MatriculationEligibility,
  MatriculationEnrollment,
  MatriculationEligibilityStatus,
  MatriculationSubject,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import i18n from "~/locales/i18n";

export type UPDATE_STUDIES_YO = SpecificActionType<
  "UPDATE_STUDIES_YO",
  MatriculationEnrollment[]
>;
export type UPDATE_STUDIES_YO_ELIGIBILITY_STATUS = SpecificActionType<
  "UPDATE_STUDIES_YO_ELIGIBILITY_STATUS",
  MatriculationEligibilityStatus
>;
export type UPDATE_STUDIES_YO_ELIGIBILITY = SpecificActionType<
  "UPDATE_STUDIES_YO_ELIGIBILITY",
  MatriculationEligibility
>;
export type UPDATE_STUDIES_YO_SUBJECTS = SpecificActionType<
  "UPDATE_STUDIES_YO_SUBJECTS",
  MatriculationSubject[]
>;
export type UPDATE_STUDIES_YO_STATUS = SpecificActionType<
  "UPDATE_STUDIES_YO_STATUS",
  MatriculationStatusType
>;
export type UPDATE_STUDIES_SUBJECT_ELIGIBILITY = SpecificActionType<
  "UPDATE_STUDIES_SUBJECT_ELIGIBILITY",
  MatriculationSubjectWithEligibilityStatus[]
>;
export type UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS = SpecificActionType<
  "UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS",
  MatriculationSubjectEligibilityStatusType
>;
/**
 * updateYOTriggerType
 */
export interface updateYOTriggerType {
  (): AnyActionType;
}
/**
 * UpdateMatriculationSubjectEligibilityTriggerType
 */
export interface UpdateMatriculationSubjectEligibilityTriggerType {
  (): AnyActionType;
}

/**
 * updateMatriculationSubjectEligibility
 */
const updateMatriculationSubjectEligibility: UpdateMatriculationSubjectEligibilityTriggerType =
  function updateMatriculationSubjectEligibility() {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const recordsApi = MApi.getRecordsApi();

      try {
        dispatch({
          type: "UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS",
          payload: <MatriculationSubjectEligibilityStatusType>"LOADING",
        });

        const state = getState();
        const selectedHOPSSubjects =
          state.hops.value.studentMatriculationSubjects;

        const subjects = await recordsApi.getMatriculationSubjects();

        const selectedSubjects: MatriculationSubject[] = [];

        selectedHOPSSubjects.map((subject) => {
          const match = subjects.find((sub) => sub.code === subject);

          selectedSubjects.push(match ? match : null);
        });

        const subjectEligibilityDataArray: MatriculationSubjectWithEligibilityStatus[] =
          [];

        await Promise.all(
          selectedSubjects.map(async (subject) => {
            try {
              const subjectEligibility =
                await recordsApi.getMatriculationSubjectEligibility({
                  subjectCode: subject.subjectCode,
                });

              const subjectEligibilityData: MatriculationSubjectWithEligibilityStatus =
                {
                  subjectCode: subject.subjectCode,
                  code: subject.code,
                  eligibility: subjectEligibility.eligible
                    ? "ELIGIBLE"
                    : "NOT_ELIGIBLE",
                  requiredCount: subjectEligibility.requirePassingGrades,
                  acceptedCount:
                    subjectEligibility.acceptedCourseCount +
                    subjectEligibility.acceptedTransferCreditCount,
                  loading: false,
                };
              subjectEligibilityDataArray.push(subjectEligibilityData);
            } catch (err) {
              if (!isMApiError(err)) {
                throw err.message;
              }
              dispatch(
                actions.displayNotification(
                  i18n.t("notifications.updateError", {
                    ns: "studies",
                    context: "matriculationEligibility",
                    subject: subject.subjectCode,
                  }),
                  "error"
                )
              );
            }
          })
        );

        dispatch({
          type: "UPDATE_STUDIES_SUBJECT_ELIGIBILITY",
          payload: subjectEligibilityDataArray,
        });

        dispatch({
          type: "UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS",
          payload: <MatriculationSubjectEligibilityStatusType>"READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.updateError", {
              ns: "studies",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * updateYO
 */
const updateYO: updateYOTriggerType = function updateYO() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const state = getState();
    const recordsApi = MApi.getRecordsApi();
    const matriculationApi = MApi.getMatriculationApi();

    try {
      const matriculationExamData = await matriculationApi.getExams();

      dispatch({
        type: "UPDATE_STUDIES_YO",
        payload: matriculationExamData,
      });

      dispatch({
        type: "UPDATE_STUDIES_YO_STATUS",
        payload: "LOADING",
      });

      const subjects = await recordsApi.getMatriculationSubjects();

      dispatch({
        type: "UPDATE_STUDIES_YO_SUBJECTS",
        payload: subjects,
      });

      const eligibility = await recordsApi.getStudentMatriculationEligibility({
        studentIdentifier: state.status.userSchoolDataIdentifier,
      });

      dispatch({
        type: "UPDATE_STUDIES_YO_ELIGIBILITY_STATUS",
        payload: eligibility.status,
      });

      dispatch({
        type: "UPDATE_STUDIES_YO_ELIGIBILITY",
        payload: eligibility,
      });

      dispatch({
        type: "UPDATE_STUDIES_YO_STATUS",
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
          }),
          "error"
        )
      );
    }
  };
};

export default { updateYO, updateMatriculationSubjectEligibility };
export { updateYO, updateMatriculationSubjectEligibility };
