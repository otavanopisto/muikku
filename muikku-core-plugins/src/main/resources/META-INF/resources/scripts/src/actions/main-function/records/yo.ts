import actions from "../../base/notifications";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  YOEnrollmentType,
  YOStatusType,
  YOEligibilityStatusType,
  YOEligibilityType,
  SubjectEligibilityType,
  SubjectEligibilityListType,
  SubjectEligibilityStatusType,
  EligibleStatusType,
} from "~/reducers/main-function/records/yo";
import { StateType } from "~/reducers";
import { Dispatch } from "react-redux";
import { MatriculationSubject } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import i18n from "~/locales/i18n";

export type UPDATE_STUDIES_YO = SpecificActionType<
  "UPDATE_STUDIES_YO",
  YOEnrollmentType[]
>;
export type UPDATE_STUDIES_YO_ELIGIBILITY_STATUS = SpecificActionType<
  "UPDATE_STUDIES_YO_ELIGIBILITY_STATUS",
  YOEligibilityStatusType
>;
export type UPDATE_STUDIES_YO_ELIGIBILITY = SpecificActionType<
  "UPDATE_STUDIES_YO_ELIGIBILITY",
  YOEligibilityType
>;
export type UPDATE_STUDIES_YO_SUBJECTS = SpecificActionType<
  "UPDATE_STUDIES_YO_SUBJECTS",
  MatriculationSubject[]
>;
export type UPDATE_STUDIES_YO_STATUS = SpecificActionType<
  "UPDATE_STUDIES_YO_STATUS",
  YOStatusType
>;
export type UPDATE_STUDIES_SUBJECT_ELIGIBILITY = SpecificActionType<
  "UPDATE_STUDIES_SUBJECT_ELIGIBILITY",
  SubjectEligibilityListType
>;
export type UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS = SpecificActionType<
  "UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS",
  SubjectEligibilityStatusType
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
          payload: <SubjectEligibilityStatusType>"LOADING",
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

        const subjectEligibilityDataArray: Array<SubjectEligibilityType> = [];

        await Promise.all(
          selectedSubjects.map(async (subject) => {
            try {
              const subjectEligibility =
                await recordsApi.getMatriculationEligibility({
                  subjectCode: subject.subjectCode,
                });

              const subjectEligibilityData = {
                subjectCode: subject.subjectCode,
                code: subject.code,
                eligibility: subjectEligibility.eligible
                  ? <EligibleStatusType>"ELIGIBLE"
                  : <EligibleStatusType>"NOT_ELIGIBLE",
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
          payload: <SubjectEligibilityStatusType>"READY",
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

    try {
      //      let exams:any =  await promisify (mApi().matriculation.exams.read({}), 'callback')();
      //      let now: Number = new Date().getTime();
      const matriculationExamData = (await promisify(
        mApi().matriculation.exams.read({}),
        "callback"
      )()) as YOEnrollmentType[];

      dispatch({
        type: "UPDATE_STUDIES_YO",
        payload: matriculationExamData,
      });

      dispatch({
        type: "UPDATE_STUDIES_YO_STATUS",
        payload: <YOStatusType>"LOADING",
      });

      const subjects = await recordsApi.getMatriculationSubjects({
        matriculationSubjectsLoaded: true,
      });

      dispatch({
        type: "UPDATE_STUDIES_YO_SUBJECTS",
        payload: subjects,
      });

      const eligibility = await recordsApi.getStudentMatriculationEligibility({
        studentIdentifier: state.status.userSchoolDataIdentifier,
      });

      const eligibilityStatus = eligibility.status;
      const eligibilityData: YOEligibilityType = {
        coursesCompleted: eligibility.coursesCompleted,
        coursesRequired: eligibility.coursesRequired,
        creditPoints: eligibility.creditPoints,
        creditPointsRequired: eligibility.creditPointsRequired,
      };

      dispatch({
        type: "UPDATE_STUDIES_YO_ELIGIBILITY_STATUS",
        payload: eligibilityStatus,
      });

      dispatch({
        type: "UPDATE_STUDIES_YO_ELIGIBILITY",
        payload: eligibilityData,
      });

      dispatch({
        type: "UPDATE_STUDIES_YO_STATUS",
        payload: <YOStatusType>"READY",
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        actions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "studies",
            context: "matriculation"
          }),
          "error"
        )
      );
    }
  };
};

export default { updateYO, updateMatriculationSubjectEligibility };
export { updateYO, updateMatriculationSubjectEligibility };
