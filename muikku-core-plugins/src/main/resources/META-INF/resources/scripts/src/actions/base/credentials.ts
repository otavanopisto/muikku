import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { CredentialsStateType } from "~/reducers/base/credentials";
import notificationActions from "~/actions/base/notifications";
import i18n from "~/locales/i18n";
import MApi, { isMApiError } from "~/api/api";
import { Credentials } from "~/generated/client";
import { Dispatch, Action } from "redux";

export type LOAD_CREDENTIALS = SpecificActionType<
  "LOAD_CREDENTIALS",
  Credentials
>;
export type CREDENTIALS_STATE = SpecificActionType<
  "CREDENTIALS_STATE",
  CredentialsStateType
>;

/**
 * UpdateCredentialsTriggerType
 */
export interface UpdateCredentialsTriggerType {
  (data: Credentials): AnyActionType;
}

/**
 * LoadCrendentialsTriggerType
 */
export interface LoadCrendentialsTriggerType {
  (secret: string): AnyActionType;
}

/**
 * loadCredentials
 * @param secret secret
 */
const loadCredentials: LoadCrendentialsTriggerType = function loadCredentials(
  secret
) {
  return async (dispatch, getState) => {
    const credentialsApi = MApi.getCredentialsApi();

    try {
      const data = await credentialsApi.loadCredentials({
        hash: secret,
      });

      dispatch({
        type: "LOAD_CREDENTIALS",
        payload: data,
      });
      dispatch({
        type: "CREDENTIALS_STATE",
        payload: <CredentialsStateType>"READY",
      });
    } catch (err) {
      if (!isMApiError(err)) {
        return dispatch(
          notificationActions.displayNotification(err.message, "error")
        );
      }

      return dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.loadError", {
            context: "credentials",
            error: err.message,
          }),
          "error"
        )
      );
    }
  };
};

/**
 * updateCredentials
 * @param credentials credentials
 */
const updateCredentials: UpdateCredentialsTriggerType =
  function updateCredentials(credentials) {
    return async (dispatch, getState) => {
      const credentialsApi = MApi.getCredentialsApi();

      try {
        await credentialsApi.updateCredentials({
          credentials: credentials,
        });

        dispatch({
          type: "CREDENTIALS_STATE",
          payload: <CredentialsStateType>"CHANGED",
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateSuccess", {
              context: "credentials",
            }),
            "success"
          )
        );
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        return dispatch(
          notificationActions.displayNotification(err.message, "error")
        );
      }
    };
  };

export default { loadCredentials };
export { loadCredentials, updateCredentials };
