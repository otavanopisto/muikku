import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  CredentialsType,
  CredentialsStateType,
} from "~/reducers/base/credentials";
import notificationActions from "~/actions/base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import i18n from "~/locales/i18n";
export type LOAD_CREDENTIALS = SpecificActionType<
  "LOAD_CREDENTIALS",
  CredentialsType
>;
export type CREDENTIALS_STATE = SpecificActionType<
  "CREDENTIALS_STATE",
  CredentialsStateType
>;

/**
 * UpdateCredentialsTriggerType
 */
export interface UpdateCredentialsTriggerType {
  (data: CredentialsType): AnyActionType;
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
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      const data: any = await promisify(
        mApi().forgotpassword.credentialReset.read(secret),
        "callback"
      )();
      dispatch({
        type: "LOAD_CREDENTIALS",
        payload: data,
      });
      dispatch({
        type: "CREDENTIALS_STATE",
        payload: <CredentialsStateType>"READY",
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
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
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        mApi()
          .forgotpassword.credentialReset.create(credentials)
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .callback(() => {});
        dispatch({
          type: "CREDENTIALS_STATE",
          payload: <CredentialsStateType>"CHANGED",
        });

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateSuccess", {
              context: "credentials",
              defaultValue: "Credentials updated successfully",
            }),
            "success"
          )
        );
      } catch (err) {
        if (err) {
          return dispatch(
            notificationActions.displayNotification(err.message, "error")
          );
        }
      }
    };
  };

export default { loadCredentials };
export { loadCredentials, updateCredentials };
