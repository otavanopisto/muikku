import { AnyActionType, SpecificActionType } from "~/actions";
import {
  UserStatusType,
  UserGroupsStateType,
  UserPayloadType,
} from "reducers/main-function/users";
import notificationActions from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import MApi, { isMApiError } from "~/api/api";
import { Dispatch } from "react-redux";
import { UserSearchResult } from "~/generated/client";
import i18n from "~/locales/i18n";

export type SET_CURRENT_PAYLOAD = SpecificActionType<
  "SET_CURRENT_PAYLOAD",
  UserPayloadType
>;
export type UPDATE_USER_GROUPS_STATE = SpecificActionType<
  "UPDATE_USER_GROUPS_STATE",
  UserGroupsStateType
>;

/**
 * LoadUsersTriggerType
 */
export interface LoadDependantsTriggerType {
  (data: {
    payload: UserPayloadType;
    success?: (result: UserSearchResult) => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * delay
 * @param ms ms
 */
function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * loadStudents
 * @param data data
 */
const loadDependants: LoadDependantsTriggerType = function loadDependants(
  data
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const meApi = MApi.getMeApi();

    try {
      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null,
      });

      const dependents = await meApi.getGuardiansDependents();

      // dispatch({
      //   type: "UPDATE_STUDENT_USERS",
      //   payload: {
      //     ...users,
      //     searchString: data.payload.q,
      //   },
      // });

      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
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
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR",
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null,
      });
    }
  };
};

export { loadDependants };
