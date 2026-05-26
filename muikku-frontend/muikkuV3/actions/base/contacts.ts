import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { ContactGroupNames, ContactsState } from "~/reducers/base/contacts";
import { LoadingState } from "~/@types/shared";
import notificationActions from "~/actions/base/notifications";
import { Dispatch, Action } from "redux";
import i18n from "~/locales/i18n";
import MApi, { isMApiError } from "~/api/api";
import { Guardian } from "~/generated/client/models/Guardian";
import { UserContact } from "~/generated/client/models/UserContact";

export type CONTACT_UPDATE_GUARDIAN = SpecificActionType<
  "CONTACT_UPDATE_GUARDIAN",
  Guardian
>;
export type CONTACT_UPDATE_CONTACT = SpecificActionType<
  "CONTACT_UPDATE_CONTACT",
  UserContact
>;
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
export type ContactGroupPayload = {
  [GroupName in ContactGroupNames]: {
    data: ContactsState[GroupName];
    groupName: GroupName;
  };
}[ContactGroupNames];

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
 * LoadAllContactGroupsTriggerType
 */
export interface LoadAllContactGroupsTriggerType {
  (userIdentifier?: string): AnyActionType;
}

/**
 * UpdateGuardianContactGroupTriggerType
 */
export interface UpdateGuardianContactGroupTriggerType {
  (
    studentIdentifier: string,
    guardianIdentifier: string,
    continuedViewPermission: boolean
  ): AnyActionType;
}

/**
 * UpdateGuardianContactGroupTriggerType
 */
export interface UpdateOtherContactGroupTriggerType {
  (
    studentIdentifier: string,
    contactId: number,
    continuedViewPermission: boolean
  ): AnyActionType;
}

const userApi = MApi.getUserApi();

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

      switch (groupName) {
        case "counselors": {
          const data = await userApi.getGuidanceCounselors({
            studentIdentifier,
            properties:
              "profile-phone,profile-appointmentCalendar,profile-whatsapp,profile-vacation-start,profile-vacation-end",
          });

          dispatch({
            type: "CONTACT_LOAD_GROUP",
            payload: {
              data: {
                list: data,
                state: <LoadingState>"READY",
              },
              groupName,
            },
          });

          break;
        }

        case "guardians": {
          const data = await userApi.getStudentsGuardians({
            studentIdentifier,
          });

          dispatch({
            type: "CONTACT_LOAD_GROUP",
            payload: {
              data: {
                list: data,
                state: <LoadingState>"READY",
              },
              groupName,
            },
          });

          break;
        }

        case "others": {
          const data = await userApi.getUserContacts({
            userIdentifier: studentIdentifier,
          });

          // remove current user from the payload list when the group is "others"
          // student has no "contactType", so filter is used to remove the user from the list
          const filteredData = data.filter(
            (contact: UserContact) => contact.contactType !== null
          );

          dispatch({
            type: "CONTACT_LOAD_GROUP",
            payload: {
              data: {
                list: filteredData,
                state: <LoadingState>"READY",
              },
              groupName,
            },
          });

          break;
        }

        default:
          break;
      }
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

/**
 * loadAllContactGroups thunk function
 * @param userIdentifier The muikku identifier of the user to be loaded
 */
const loadAllContactGroups: LoadAllContactGroupsTriggerType =
  function loadAllContactGroups(userIdentifier) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const isActiveUser = getState().status.isActiveUser;
      const studentIdentifier = userIdentifier
        ? userIdentifier
        : getState().status.userSchoolDataIdentifier;
      if (!isActiveUser) {
        return;
      }

      try {
        dispatch({
          type: "CONTACT_UPDATE_GROUP_STATE",
          payload: { groupName: "counselors", state: <LoadingState>"LOADING" },
        });
        dispatch({
          type: "CONTACT_UPDATE_GROUP_STATE",
          payload: { groupName: "guardians", state: <LoadingState>"LOADING" },
        });
        dispatch({
          type: "CONTACT_UPDATE_GROUP_STATE",
          payload: { groupName: "others", state: <LoadingState>"LOADING" },
        });

        Promise.all([
          userApi.getGuidanceCounselors({
            studentIdentifier,
            properties:
              "profile-phone,profile-appointmentCalendar,profile-whatsapp,profile-vacation-start,profile-vacation-end",
          }),
          userApi.getStudentsGuardians({
            studentIdentifier,
          }),
          userApi.getUserContacts({
            userIdentifier: studentIdentifier,
          }),
        ]).then(([counselorsData, guardiansData, othersData]) => {
          // remove current user from the payload list when the group is "others"
          // student has no "contactType", so filter is used to remove the user from the list
          const filteredData = othersData.filter(
            (contact: UserContact) => contact.contactType !== null
          );
          dispatch({
            type: "CONTACT_LOAD_GROUP",
            payload: {
              data: {
                list: counselorsData,
                state: <LoadingState>"READY",
              },
              groupName: "counselors",
            },
          });
          dispatch({
            type: "CONTACT_LOAD_GROUP",
            payload: {
              data: {
                list: guardiansData,
                state: <LoadingState>"READY",
              },
              groupName: "guardians",
            },
          });
          dispatch({
            type: "CONTACT_LOAD_GROUP",
            payload: {
              data: {
                list: filteredData,
                state: <LoadingState>"READY",
              },
              groupName: "others",
            },
          });
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
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * updateContactGroupGuardian thunk function
 * @param studentIdentifier the muikku identifier of the student whose guardian is being updated
 * @param guardianIdentifier the muikku identifier of the guardian who is being updated
 * @param continuedViewPermission whether the guardian can see the student's information after the student turns 18
 */
const updateContactGroupGuardian: UpdateGuardianContactGroupTriggerType =
  function updateContactGroupGuardian(
    studentIdentifier,
    guardianIdentifier,
    continuedViewPermission
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        const data = await userApi.updateGuardiansContinuedViewPermission({
          studentIdentifier: studentIdentifier,
          guardianIdentifier: guardianIdentifier,
          body: continuedViewPermission,
        });

        dispatch({
          type: "CONTACT_UPDATE_GUARDIAN",
          payload: data,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          return dispatch(
            notificationActions.displayNotification(err.message, "error")
          );
        }
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", {
              ns: "studies",
              context: "guardian",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * updateContactGroupContact thunk function
 * @param userIdentifier the muikku identifier of the student whose contact is being updated
 * @param contactInfoId the muikku identifier of the contact info being updated
 * @param allowStudyDiscussions whether the contact can discuss the student's studies
 */
const updateContactGroupContact: UpdateOtherContactGroupTriggerType =
  function updateContactGroupContact(
    userIdentifier,
    contactInfoId,
    allowStudyDiscussions
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        const data = await userApi.updateUserContactAllowStudyDiscussions({
          userIdentifier,
          contactInfoId,
          body: allowStudyDiscussions,
        });

        dispatch({
          type: "CONTACT_UPDATE_CONTACT",
          payload: data,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          return dispatch(
            notificationActions.displayNotification(err.message, "error")
          );
        }
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", {
              ns: "studies",
              context: "contact",
            }),
            "error"
          )
        );
      }
    };
  };

export default { loadContactGroup };
export {
  loadContactGroup,
  updateContactGroupGuardian,
  updateContactGroupContact,
  loadAllContactGroups,
};
