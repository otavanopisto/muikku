import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { ContactGroup, ContactGroupNames } from "~/reducers/base/contacts";
import { LoadingState } from "~/@types/shared";
import notificationActions from "~/actions/base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";

export type LOAD_CONTACT_GROUP = SpecificActionType<
  "LOAD_CONTACT_GROUP",
  ContactGroupPayload
>;
export type UPDATE_CONTACT_GROUP_STATE = SpecificActionType<
  "UPDATE_CONTACT_GROUP_STATE",
  LoadingStatePayload
>;

/**
 *
 */
export interface ContactGroupPayload {
  data: ContactGroup;
  groupName: ContactGroupNames;
}

/**
 *
 */
export interface LoadingStatePayload {
  state: LoadingState;
  groupName: ContactGroupNames;
}

/**
 * LoadContactGroupTriggerType
 */
export interface LoadContactGroupTriggerType {
  (groupName: ContactGroupNames): AnyActionType;
}

/**
 * loadCredentials
 * @param secret secret
 */
const loadContactGroup: LoadContactGroupTriggerType = function loadContactGroup(
  groupName
) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "UPDATE_CONTACT_GROUP_STATE",
        payload: { groupName: groupName, state: <LoadingState>"LOADING" },
      });
      const data: string[] = (await promisify(
        mApi().me.guidanceCounselors.read(),
        "callback"
      )()) as string[];

      const payload = {
        data: {
          list: data,
          state: <LoadingState>"READY",
        },
        groupName: groupName,
      };
      dispatch({
        type: "LOAD_CONTACT_GROUP",
        payload: payload,
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        return dispatch(
          notificationActions.displayNotification(err.message, "error")
        );
      }
      return dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.forgotpassword.changeCredentials.messages.error.hashLoadFailed",
            err.message
          ),
          "error"
        )
      );
    }
  };
};

export default { loadContactGroup };
export { loadContactGroup };
