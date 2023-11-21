import { AnyActionType, SpecificActionType } from "~/actions";
import { UserStatusType } from "reducers/main-function/users";
import notificationActions from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { Dispatch } from "react-redux";
import i18n from "~/locales/i18n";
import { Dependant, DependantWokspacePayloadType } from "~/reducers/main-function/dependants";

export type UPDATE_DEPENDANTS = SpecificActionType<
  "UPDATE_DEPENDANTS",
  Dependant[]
>;

export type UPDATE_DEPENDANT_WORKSPACES = SpecificActionType<
  "UPDATE_DEPENDANT_WORKSPACES",
  DependantWokspacePayloadType
>;

export type UPDATE_DEPENDANTS_STATUS = SpecificActionType<
  "UPDATE_DEPENDANTS_STATUS",
  UserStatusType
>;

/**
 * LoadDependantsTriggerType
 */
export interface LoadDependantsTriggerType {
  (): AnyActionType;
}

/**
 * LoadDependantWorkspacesTriggerType
 */
export interface LoadDependantWorkspacesTriggerType {
  (dependantId:string): AnyActionType;
}

/**
 * loadDependants thunk function
 */
const loadDependants: LoadDependantsTriggerType = function loadDependants() {
  return async (dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>) => {

    const meApi = MApi.getMeApi();

    try {
      dispatch({
        type: "UPDATE_DEPENDANTS_STATUS",
        payload: <UserStatusType>"LOADING",
      });

      const dependants = await meApi.getGuardiansDependents();
      const payload = dependants.map((dependant) => { 
        return {
          ...dependant,
          workspaces: []
        };  
      });

      dispatch({
        type: "UPDATE_DEPENDANTS",
        payload: payload,
      });

      dispatch({
        type: "UPDATE_DEPENDANTS_STATUS",
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
            context: "students",
          }),
          "error"
        )
      );
      dispatch({
        type: "UPDATE_DEPENDANTS_STATUS",
        payload: <UserStatusType>"ERROR",
      });
    }
  };
};

/**
 * loadDependants thunk function
 */
const loadDependantWorkspaces: LoadDependantWorkspacesTriggerType = function loadDependantWorkspaces(dependantId:string) {
  return async (dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>) => {

    const meApi = MApi.getMeApi();

    try {
      const workspaces = await meApi.getGuardiansDependentsActiveWorkspaces({studentIdentifier:dependantId});
      const payload: DependantWokspacePayloadType = {workspaces, id:dependantId}

      dispatch({
        type: "UPDATE_DEPENDANT_WORKSPACES",
        payload: payload,
      });

    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "users",
            context: "students",
          }),
          "error"
        )
      );
    }
  };
};


export { loadDependants, loadDependantWorkspaces };
