import actions from "../../base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  YOEnrollmentType,
  YOStatusType,
  YOMatriculationSubjectType,
  YOEligibilityStatusType,
  YOEligibilityType,
  SubjectEligibilityType,
  SubjectEligibilityListType,
  SubjectEligibilityStatusType,
  EligibleStatusType,
} from "~/reducers/main-function/records/yo";
import { StateType } from "~/reducers";

export type UPDATE_STUDIES_YO = SpecificActionType<
  "UPDATE_STUDIES_YO",
  YOEnrollmentType
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
  YOMatriculationSubjectType
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
export interface updateYOTriggerType {
  (): AnyActionType;
}
export interface UpdateMatriculationSubjectEligibilityTriggerType {
  (): AnyActionType;
}

const updateMatriculationSubjectEligibility: UpdateMatriculationSubjectEligibilityTriggerType =
  function updateMatriculationSubjectEligibility() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
    ) => {
      try {
        dispatch({
          type: "UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS",
          payload: <SubjectEligibilityStatusType>"LOADING",
        });

        const state = getState();
        const selectedHOPSSubjects =
          state.hops.value.studentMatriculationSubjects;

        const subjects: Array<YOMatriculationSubjectType> = (await promisify(
          mApi().records.matriculationSubjects.read(),
          "callback",
        )()) as Array<YOMatriculationSubjectType>;
        const selectedSubjects: Array<YOMatriculationSubjectType> = [];

        selectedHOPSSubjects.map((subject) => {
          const match = subjects.find((sub) => sub.code === subject);

          selectedSubjects.push(match ? match : null);
        });

        const subjectEligibilityDataArray: Array<SubjectEligibilityType> = [];

        await Promise.all(
          selectedSubjects.map(async (subject) => {
            try {
              const subjectEligibility: any = await promisify(
                mApi().records.matriculationEligibility.read({
                  subjectCode: subject.subjectCode,
                }),
                "callback",
              )();
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
              if (!(err instanceof MApiError)) {
                throw err.message;
              }
              dispatch(
                actions.displayNotification(
                  getState().i18n.text.get(
                    "plugin.records.yo.errormessage.eligibilityUpdateFailedOnSubject",
                    subject.subjectCode,
                  ),
                  "error",
                ),
              );
            }
          }),
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
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18n.text.get(
              "plugin.records.yo.errormessage.eligibilityUpdateFailed",
            ),
            "error",
          ),
        );
      }
    };
  };

const updateYO: updateYOTriggerType = function updateYO() {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
  ) => {
    try {
      //      let exams:any =  await promisify (mApi().matriculation.exams.read({}), 'callback')();
      //      let now: Number = new Date().getTime();
      const matriculationExamData: any = await promisify(
        mApi().matriculation.exams.read({}),
        "callback",
      )();

      dispatch({
        type: "UPDATE_STUDIES_YO",
        payload: matriculationExamData,
      });

      dispatch({
        type: "UPDATE_STUDIES_YO_STATUS",
        payload: <YOStatusType>"LOADING",
      });

      const subjects: YOMatriculationSubjectType = (await promisify(
        mApi().records.matriculationSubjects.read({
          matriculationSubjectsLoaded: true,
        }),
        "callback",
      )()) as YOMatriculationSubjectType;

      dispatch({
        type: "UPDATE_STUDIES_YO_SUBJECTS",
        payload: subjects,
      });

      const eligibility: any = await promisify(
        mApi().records.studentMatriculationEligibility.read(
          document
            .querySelector('meta[name="muikku:loggedUser"]')
            .getAttribute("value"),
        ),
        "callback",
      )();
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
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        actions.displayNotification(
          getState().i18n.text.get(
            "plugin.records.yo.errormessage.yoUpdateFailed",
          ),
          "error",
        ),
      );
    }
  };
};

export default { updateYO, updateMatriculationSubjectEligibility };
export { updateYO, updateMatriculationSubjectEligibility };
