import actions from '../../base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import { AnyActionType, SpecificActionType } from '~/actions';
import { YOEnrollmentType, YOStatusType, YOMatriculationSubjectType, YOEligibilityStatusType, YOEligibilityType, SubjectEligibilityType, SubjectEligibilityListType, SubjectEligibilityStatusType, EligibleStatusType } from '~/reducers/main-function/records/yo';
import { HOPSDataType, HOPSStatusType } from '~/reducers/main-function/hops';
import { StateType } from '~/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

export interface UPDATE_STUDIES_YO extends SpecificActionType<"UPDATE_STUDIES_YO", YOEnrollmentType> { }
export interface UPDATE_STUDIES_YO_ELIGIBILITY_STATUS extends SpecificActionType<"UPDATE_STUDIES_YO_ELIGIBILITY_STATUS", YOEligibilityStatusType> { }
export interface UPDATE_STUDIES_YO_ELIGIBILITY extends SpecificActionType<"UPDATE_STUDIES_YO_ELIGIBILITY", YOEligibilityType> { }
export interface UPDATE_STUDIES_YO_SUBJECTS extends SpecificActionType<"UPDATE_STUDIES_YO_SUBJECTS", YOMatriculationSubjectType> { }
export interface UPDATE_STUDIES_YO_STATUS extends SpecificActionType<"UPDATE_STUDIES_YO_STATUS", YOStatusType> { }
export interface UPDATE_STUDIES_SUBJECT_ELIGIBILITY extends SpecificActionType<"UPDATE_STUDIES_SUBJECT_ELIGIBILITY", SubjectEligibilityListType> { }
export interface UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS extends SpecificActionType<"UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS", SubjectEligibilityStatusType> { }
export interface updateYOTriggerType {
  (): AnyActionType
}
export interface UpdateMatriculationSubjectEligibilityTriggerType {
  (): AnyActionType
}

let updateMatriculationSubjectEligibility: UpdateMatriculationSubjectEligibilityTriggerType = function updateMatriculationSubjectEligibility() {

  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {
    try {

      dispatch({
        type: 'UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS',
        payload: <SubjectEligibilityStatusType>"LOADING"
      });

      let state = getState();
      let selectedHOPSSubjects = state.hops.value.studentMatriculationSubjects;

      let subjects: Array<YOMatriculationSubjectType> = await promisify(mApi().records.matriculationSubjects.read(), 'callback')() as Array<YOMatriculationSubjectType>;
      let selectedSubjects: Array<YOMatriculationSubjectType> = [];

      selectedHOPSSubjects.map((subject) => {
        let match = subjects.find((sub) => {
          return sub.code === subject;
        });

        selectedSubjects.push(match ? match : null);

      });

      let subjectEligibilityDataArray: Array<SubjectEligibilityType> = [];

      await Promise.all(selectedSubjects.map(async (subject) => {
        try {
          let subjectEligibility: any = await promisify(mApi().records.matriculationEligibility.read({ "subjectCode": subject.subjectCode }), "callback")();
          let subjectEligibilityData = {
            subjectCode: subject.subjectCode,
            code: subject.code,
            eligibility: subjectEligibility.eligible ? <EligibleStatusType>"ELIGIBLE" : <EligibleStatusType>"NOT_ELIGIBLE",
            requiredCount: subjectEligibility.requirePassingGrades,
            acceptedCount: subjectEligibility.acceptedCourseCount + subjectEligibility.acceptedTransferCreditCount,
            loading: false
          }
          subjectEligibilityDataArray.push(subjectEligibilityData);
        } catch (err) {
          if (!(err instanceof MApiError)) {
            throw err.message;
          }
          dispatch(actions.displayNotification(getState().i18n.text.get("plugin.records.yo.errormessage.eligibilityUpdateFailedOnSubject", subject.subjectCode), 'error'));

        }
      }));

      dispatch({
        type: 'UPDATE_STUDIES_SUBJECT_ELIGIBILITY',
        payload: subjectEligibilityDataArray
      })

      dispatch({
        type: 'UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS',
        payload: <SubjectEligibilityStatusType>"READY"
      });
    }

    catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.records.yo.errormessage.eligibilityUpdateFailed"), 'error'));
    }
  }
}

let updateYO: updateYOTriggerType = function updateYO() {

  return async (dispatch: (arg: AnyActionType) => any, getState: () => StateType) => {

    try {

      //      let exams:any =  await promisify (mApi().matriculation.exams.read({}), 'callback')();
      //      let now: Number = new Date().getTime();
      let matriculationExamData: any = await promisify(mApi().matriculation.exams.read({}), 'callback')();

      dispatch({
        type: 'UPDATE_STUDIES_YO',
        payload: matriculationExamData
      });

      dispatch({
        type: 'UPDATE_STUDIES_YO_STATUS',
        payload: <YOStatusType>"LOADING"
      });

      let subjects: YOMatriculationSubjectType = await promisify(mApi().records.matriculationSubjects.read({
        matriculationSubjectsLoaded: true
      }), 'callback')() as YOMatriculationSubjectType;

      dispatch({
        type: 'UPDATE_STUDIES_YO_SUBJECTS',
        payload: subjects
      });

      let eligibility: any = await promisify(mApi().records.studentMatriculationEligibility
        .read(document.querySelector('meta[name="muikku:loggedUser"]').getAttribute("value")), 'callback')();
      let eligibilityStatus = eligibility.status;
      let eligibilityData: YOEligibilityType = {
        coursesCompleted: eligibility.coursesCompleted,
        coursesRequired: eligibility.coursesRequired
      }

      dispatch({
        type: 'UPDATE_STUDIES_YO_ELIGIBILITY_STATUS',
        payload: eligibilityStatus
      });

      dispatch({
        type: 'UPDATE_STUDIES_YO_ELIGIBILITY',
        payload: eligibilityData
      });

      dispatch({
        type: 'UPDATE_STUDIES_YO_STATUS',
        payload: <YOStatusType>"READY"
      });
    }
    catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.records.yo.errormessage.yoUpdateFailed"), 'error'));
    }
  }
}

export default { updateYO, updateMatriculationSubjectEligibility };
export { updateYO, updateMatriculationSubjectEligibility };
