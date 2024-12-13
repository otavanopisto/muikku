import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { ContactGroup, ContactGroupNames } from "~/reducers/base/contacts";
import { LoadingState } from "~/@types/shared";
import notificationActions from "~/actions/base/notifications";
import { Dispatch, Action } from "redux";
import i18n from "~/locales/i18n";
import MApi, { isMApiError } from "~/api/api";

export type CONTACT_LOAD_GROUP = SpecificActionType<
  "CONTACT_LOAD_GROUP",
  ContactGroupPayload
>;
export type CONTACT_UPDATE_GROUP_STATE = SpecificActionType<
  "CONTACT_UPDATE_GROUP_STATE",
  LoadingStatePayload
>;

/**
 * ContactGroupPayload
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
  (groupName: ContactGroupNames, userIdentifier?: string): AnyActionType;
}

/**
 * loadContactGroup thunk function
 * @param groupName The name of the group to be loaded
 * @param userIdentifier The muikku identifier of the user to be loaded
 */
const loadContactGroup: LoadContactGroupTriggerType = function loadContactGroup(
  groupName,
  userIdentifier
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    const userApi = MApi.getUserApi();

    const contactsLoaded = getState().contacts[groupName].state === "READY";
    const isActiveUser = getState().status.isActiveUser;
    const studentIdentifier = userIdentifier
      ? userIdentifier
      : getState().status.userSchoolDataIdentifier;
    if (contactsLoaded || !isActiveUser) {
      return;
    }

    try {
      dispatch({
        type: "CONTACT_UPDATE_GROUP_STATE",
        payload: { groupName: groupName, state: <LoadingState>"LOADING" },
      });

      const data = await userApi.getGuidanceCounselors({
        studentIdentifier,
        properties:
          "profile-phone,profile-appointmentCalendar,profile-whatsapp,profile-vacation-start,profile-vacation-end",
      });

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
      if (!isMApiError(err)) {
        return dispatch(
          notificationActions.displayNotification(err.message, "error")
        );
      }

      return dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "studies",
            context: groupName,
          }),
          "error"
        )
      );
    }
  };
};

export default { loadContactGroup };
export { loadContactGroup };
