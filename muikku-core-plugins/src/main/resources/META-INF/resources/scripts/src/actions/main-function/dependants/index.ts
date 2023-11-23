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

export type UPDATE_DEPENDANT_WORKSPACES_STATUS = SpecificActionType<
  "UPDATE_DEPENDANT_WORKSPACES_STATUS",
  DependantWokspaceStatePayloadType
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
  (dependantId: string): AnyActionType;
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
      const payload = dependants.map(
        (dependant) =>
          ({
            ...dependant,
            ...{ workspaces: [], worspacesStatus: "WAITING" },
          } as Dependant)
      );

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
      if (dependant.workspaces.length > 0) {
        return;
      }
      const meApi = MApi.getMeApi();
      try {
        dispatch({
          type: "UPDATE_DEPENDANT_WORKSPACES_STATUS",
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
          type: "UPDATE_DEPENDANT_WORKSPACES",
          payload: payload,
        });
        dispatch({
          type: "UPDATE_DEPENDANT_WORKSPACES_STATUS",
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
              ns: "users",
              context: "students",
            }),
            "error"
          )
        );
        dispatch({
          type: "UPDATE_DEPENDANT_WORKSPACES_STATUS",
          payload: {
            id: dependantId,
            state: "ERROR",
          },
        });
      }
    };
  };

export { loadDependants, loadDependantWorkspaces };
