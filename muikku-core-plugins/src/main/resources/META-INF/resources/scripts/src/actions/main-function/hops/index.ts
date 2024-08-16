import actions from "../../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Dispatch } from "react-redux";
import MApi, { isMApiError } from "~/api/api";
import {
  MatriculationEligibility,
  MatriculationExam,
  MatriculationSubject,
} from "~/generated/client";
import { ReducerStateType } from "~/reducers/hops";
import i18n from "~/locales/i18n";

// HOPS BACKGROUND ACTIONS TYPES

export type HOPS_BACKGROUND_UPDATE_STATUS = SpecificActionType<
  "HOPS_BACKGROUND_UPDATE_STATUS",
  any
>;

// HOPS STUDY PLAN ACTIONS TYPES

export type HOPS_STUDYPLAN_UPDATE_STATUS = SpecificActionType<
  "HOPS_STUDYPLAN_UPDATE_STATUS",
  any
>;

// HOPS CAREER PLAN ACTIONS TYPES

export type HOPS_CAREERPLAN_UPDATE_STATUS = SpecificActionType<
  "HOPS_CAREERPLAN_UPDATE_STATUS",
  any
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

/**
 * loadExamDataTriggerType
 */
export interface loadMatriculationDataTriggerType {
  (userIdentifier?: string): AnyActionType;
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

      const recordsApi = MApi.getRecordsApi();
      const matriculationApi = MApi.getMatriculationApi();

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
        //If the studentIdentifier is not provided, this is called for you, not someone else.
        // So we go ahead and call exams for you.

        const matriculationExams = await matriculationApi.getStudentExams({
          studentIdentifier,
        });
        dispatch({
          type: "HOPS_MATRICULATION_UPDATE_EXAMS",
          payload: matriculationExams,
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

export { loadMatriculationData };
