import { AnyActionType, SpecificActionType } from "~/actions";
import { UserStatusType } from "reducers/main-function/users";
import notificationActions from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { Dispatch } from "react-redux";
import i18n from "~/locales/i18n";
import { UserGuardiansDependant } from "~/generated/client/models";

export type UPDATE_DEPENDANTS = SpecificActionType<
  "UPDATE_DEPENDANTS",
  UserGuardiansDependant[]
>;

export type UPDATE_DEPENDANTS_STATUS = SpecificActionType<
  "UPDATE_DEPENDANTS_STATUS",
  UserStatusType
>;

/**
 * LoadUsersTriggerType
 */
export interface LoadDependantsTriggerType {
  (): AnyActionType;
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

      dispatch({
        type: "UPDATE_DEPENDANTS",
        payload: dependants,
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

export { loadDependants };
