import { AnyActionType, SpecificActionType } from "~/actions";
import {
  CurrentDependant,
  ReducerStateType,
} from "~/reducers/main-function/guardian";
import {
  UserGuardiansDependant,
  UserGuardiansDependantWorkspace,
} from "~/generated/client/models";
import notificationActions from "~/actions/base/notifications";
import { Action, Dispatch } from "redux";
import MApi, { isMApiError } from "~/api/api";
import { StateType } from "~/reducers";
import i18n from "~/locales/i18n";

const meApi = MApi.getMeApi();

// GUARDIAN DEPENDANTS ACTIONS
export type GUARDIAN_UPDATE_DEPENDANTS = SpecificActionType<
  "GUARDIAN_UPDATE_DEPENDANTS",
  UserGuardiansDependant[]
>;

export type GUARDIAN_UPDATE_DEPENDANTS_STATUS = SpecificActionType<
  "GUARDIAN_UPDATE_DEPENDANTS_STATUS",
  ReducerStateType
>;

// GUARDIAN DEPENDANT WORKSPACES ACTIONS
export type GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS =
  SpecificActionType<
    "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS",
    {
      identifier: string;
      status: ReducerStateType;
    }
  >;

export type GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_WORKSPACES =
  SpecificActionType<
    "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_WORKSPACES",
    {
      identifier: string;
      workspaces: UserGuardiansDependantWorkspace[];
    }
  >;

// GUARDIAN CURRENT DEPENDANT ACTIONS
export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_IDENTIFIER = SpecificActionType<
  "GUARDIAN_UPDATE_CURRENT_DEPENDANT_IDENTIFIER",
  string
>;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT_STATUS = SpecificActionType<
  "GUARDIAN_UPDATE_CURRENT_DEPENDANT_STATUS",
  ReducerStateType
>;

export type GUARDIAN_UPDATE_CURRENT_DEPENDANT = SpecificActionType<
  "GUARDIAN_UPDATE_CURRENT_DEPENDANT",
  CurrentDependant
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
  (dependantIdentifier: string): AnyActionType;
}

/**
 * Thunk function to load dependants
 * @returns Thunk function to load dependants
 */
const loadDependants: LoadDependantsTriggerType = function loadDependants() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "GUARDIAN_UPDATE_DEPENDANTS_STATUS",
        payload: "LOADING",
      });

      const dependants = await meApi.getGuardiansDependents();

      dispatch({
        type: "GUARDIAN_UPDATE_DEPENDANTS",
        payload: dependants,
      });
    } catch (error) {
      if (!isMApiError(error)) {
        throw error;
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
        payload: "ERROR",
      });
    }
  };
};

/**
 * Thunk function to load dependant workspaces
 * @param dependantIdentifier dependantIdentifier
 * @returns Thunk function to load dependant workspaces
 */
const loadDependantWorkspaces: LoadDependantWorkspacesTriggerType =
  function loadDependantWorkspaces(dependantIdentifier: string) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      let dependantWorkspaces =
        state.guardian.workspacesByDependantIdentifier[dependantIdentifier];

      // If the dependant workspaces are not found, we initialize them
      // with empty workspaces and IDLE status
      if (!dependantWorkspaces) {
        dependantWorkspaces = {
          workspaces: [],
          status: "IDLE",
        };
      }

      if (
        dependantWorkspaces.status === "READY" ||
        dependantWorkspaces.status === "LOADING"
      ) {
        return;
      }

      try {
        dispatch({
          type: "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS",
          payload: {
            identifier: dependantIdentifier,
            status: "LOADING",
          },
        });

        const workspaces = await meApi.getGuardiansDependentsActiveWorkspaces({
          studentIdentifier: dependantIdentifier,
        });

        dispatch({
          type: "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_WORKSPACES",
          payload: {
            identifier: dependantIdentifier,
            workspaces: workspaces,
          },
        });

        dispatch({
          type: "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS",
          payload: {
            identifier: dependantIdentifier,
            status: "READY",
          },
        });
      } catch (error) {
        if (!isMApiError(error)) {
          throw error;
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
          type: "GUARDIAN_UPDATE_WORKSPACES_BY_DEPENDANT_IDENTIFIER_STATUS",
          payload: {
            identifier: dependantIdentifier,
            status: "ERROR",
          },
        });
      }
    };
  };

export { loadDependants, loadDependantWorkspaces };
