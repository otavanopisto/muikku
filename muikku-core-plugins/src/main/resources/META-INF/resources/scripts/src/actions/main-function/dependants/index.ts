import { AnyActionType, SpecificActionType } from "~/actions";
import { UserStatusType } from "reducers/main-function/users";
import notificationActions from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { Dispatch } from "react-redux";
import i18n from "~/locales/i18n";
import { StateType } from "~/reducers";
import {
  Dependant,
  DependantWokspacePayloadType,
  DependantWokspaceStatePayloadType,
} from "~/reducers/main-function/dependants";
import { SummaryStatusType } from "~/reducers/main-function/records/summary";
import { AllStudentUsersDataStatusType } from "~/reducers/main-function/records";
import { LoadingState } from "~/@types/shared";
import { HOPSStatusType } from "~/reducers/main-function/hops";
import { MatriculationSubjectEligibilityStatusType } from "~/reducers/main-function/records/yo";

export type DEPENDANTS_UPDATE = SpecificActionType<
  "DEPENDANTS_UPDATE",
  Dependant[]
>;
export type DEPENDANTS_STATUS_UPDATE = SpecificActionType<
  "DEPENDANTS_STATUS_UPDATE",
  UserStatusType
>;
export type DEPENDANT_WORKSPACES_UPDATE = SpecificActionType<
  "DEPENDANT_WORKSPACES_UPDATE",
  DependantWokspacePayloadType
>;
export type DEPENDANT_WORKSPACES_STATUS_UPDATE = SpecificActionType<
  "DEPENDANT_WORKSPACES_STATUS_UPDATE",
  DependantWokspaceStatePayloadType
>;

/**
 * LoadDependantsTriggerType
 */
export interface LoadDependantsTriggerType {
  (): AnyActionType;
}
/**
 * setCurrentDependantTriggerType
 */
export interface setCurrentDependantTriggerType {
  (identifier: string): AnyActionType;
}
/**
 * setCurrentDependantTriggerType
 */
export interface clearDependantTriggerType {
  (): AnyActionType;
}
/**
 * LoadDependantWorkspacesTriggerType
 */
export interface LoadDependantWorkspacesTriggerType {
  (dependantId: string): AnyActionType;
}

/**
 * clearDependantState puts all dependants data states to "WAITING"
 */
const clearDependantState: clearDependantTriggerType =
  function clearDependantState() {
    return (dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>) => {
      dispatch({
        type: "UPDATE_RECORDS_ALL_STUDENT_USERS_DATA_STATUS",
        payload: <AllStudentUsersDataStatusType>"WAITING",
      });
      dispatch({
        type: "UPDATE_STUDIES_SUMMARY_STATUS",
        payload: <SummaryStatusType>"WAITING",
      });
      dispatch({
        type: "CONTACT_UPDATE_GROUP_STATE",
        payload: { groupName: "counselors", state: <LoadingState>"WAITING" },
      });
      dispatch({
        type: "UPDATE_HOPS_STATUS",
        payload: <HOPSStatusType>"WAIT",
      });
      dispatch({
        type: "UPDATE_STUDIES_YO_STATUS",
        payload: "WAIT",
      });
      dispatch({
        type: "UPDATE_STUDIES_SUBJECT_ELIGIBILITY_STATUS",
        payload: <MatriculationSubjectEligibilityStatusType>"WAIT",
      });
      dispatch({
        type: "SET_CURRENT_GUIDER_STUDENT_PROP",
        payload: {
          property: "pedagogyFormState",
          value: <LoadingState>"WAITING",
        },
      });
    };
  };

/**
 * loadDependants thunk function
 */
const loadDependants: LoadDependantsTriggerType = function loadDependants() {
  return async (dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>) => {
    const meApi = MApi.getMeApi();

    try {
      dispatch({
        type: "DEPENDANTS_STATUS_UPDATE",
        payload: <UserStatusType>"LOADING",
      });

      const dependants = await meApi.getGuardiansDependents();
      const payload = dependants.map(
        (dependant) =>
          ({
            ...dependant,
            ...{ workspaces: [], worspacesStatus: "WAITING" },
          } as Dependant)
      );

      dispatch({
        type: "DEPENDANTS_UPDATE",
        payload: payload,
      });

      dispatch({
        type: "DEPENDANTS_STATUS_UPDATE",
        payload: <UserStatusType>"READY",
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "users",
            context: "dependants",
          }),
          "error"
        )
      );
      dispatch({
        type: "DEPENDANTS_STATUS_UPDATE",
        payload: <UserStatusType>"ERROR",
      });
    }
  };
};

/**
 * loadDependantWorkspaces thunk function
 * @param dependantId dependantId
 */
const loadDependantWorkspaces: LoadDependantWorkspacesTriggerType =
  function loadDependantWorkspaces(dependantId: string) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const dependant = getState().dependants.list.find(
        (dependant) => dependant.identifier === dependantId
      );
      if (dependant.worspacesStatus !== "WAITING") {
        return;
      }
      const meApi = MApi.getMeApi();
      try {
        dispatch({
          type: "DEPENDANT_WORKSPACES_STATUS_UPDATE",
          payload: {
            id: dependantId,
            state: "LOADING",
          },
        });
        const workspaces = await meApi.getGuardiansDependentsActiveWorkspaces({
          studentIdentifier: dependantId,
        });
        const payload: DependantWokspacePayloadType = {
          workspaces,
          id: dependantId,
        };

        dispatch({
          type: "DEPENDANT_WORKSPACES_UPDATE",
          payload: payload,
        });
        dispatch({
          type: "DEPENDANT_WORKSPACES_STATUS_UPDATE",
          payload: {
            id: dependantId,
            state: "READY",
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "workspace",
              context: "workspaces",
            }),
            "error"
          )
        );
        dispatch({
          type: "DEPENDANT_WORKSPACES_STATUS_UPDATE",
          payload: {
            id: dependantId,
            state: "ERROR",
          },
        });
      }
    };
  };

export { loadDependants, loadDependantWorkspaces, clearDependantState };
