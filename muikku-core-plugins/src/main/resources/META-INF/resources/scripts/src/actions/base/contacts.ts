import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  ContactGroup,
  ContactGroupNames,
  Contact,
} from "~/reducers/base/contacts";
import { LoadingState } from "~/@types/shared";
import notificationActions from "~/actions/base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { Dispatch } from "react-redux";
import i18n from "~/locales/i18n";

export type CONTACT_LOAD_GROUP = SpecificActionType<
  "CONTACT_LOAD_GROUP",
  ContactGroupPayload
>;
export type CONTACT_UPDATE_GROUP_STATE = SpecificActionType<
  "CONTACT_UPDATE_GROUP_STATE",
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
 * LoadingStatePayload
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
 * loadContactGroup thunk function
 * @param groupName The name of the group to be loaded
 */
const loadContactGroup: LoadContactGroupTriggerType = function loadContactGroup(
  groupName
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const contactsLoaded = getState().contacts[groupName].list.length > 0;

    if (contactsLoaded) {
      return;
    }

    try {
      dispatch({
        type: "CONTACT_UPDATE_GROUP_STATE",
        payload: { groupName: groupName, state: <LoadingState>"LOADING" },
      });
      const data: Contact[] = (await promisify(
        mApi().me.guidanceCounselors.read({
          properties:
            "profile-phone,profile-appointmentCalendar,profile-whatsapp,profile-vacation-start,profile-vacation-end",
        }),
        "callback"
      )()) as Contact[];

      const payload = {
        data: {
          list: data,
          state: <LoadingState>"READY",
        },
        groupName: groupName,
      };
      dispatch({
        type: "CONTACT_LOAD_GROUP",
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
          i18n.t("notifications.loadError", {
            ns: "studies",
            context: groupName,
            defaultValue: "Contact group could not be loaded",
          }),
          "error"
        )
      );
    }
  };
};

export default { loadContactGroup };
export { loadContactGroup };
