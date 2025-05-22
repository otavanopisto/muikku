import { promisifyNewConstructor } from "~/util/promisify";
import actions from "../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import { UserChatSettingsType } from "~/reducers/user-index";
import { StateType } from "~/reducers";
import { resize } from "~/util/modifiers";
import {
  updateStatusProfile,
  updateStatusHasImage,
} from "~/actions/base/status";
import {
  ProfileAuthorizations,
  ProfileProperty,
  WorklistSection,
} from "~/reducers/main-function/profile";
import moment from "moment";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import { Dispatch, Action } from "redux";
import {
  CeeposOrder,
  StudentCard,
  UserStudentAddress,
  UserWithSchoolData,
  WorklistBillingStateType,
  WorklistItem,
  WorklistSummary,
  WorklistTemplate,
} from "~/generated/client";
import i18n, { localize } from "~/locales/i18n";

/**
 * LoadProfilePropertiesSetTriggerType
 */
export interface LoadProfilePropertiesSetTriggerType {
  (): AnyActionType;
}

/**
 * SaveProfilePropertyTriggerType
 */
export interface SaveProfilePropertyTriggerType {
  (data: {
    key: string;
    value: string;
    success: () => any;
    fail: () => any;
  }): AnyActionType;
}

/**
 * LoadProfileUsernameTriggerType
 */
export interface LoadProfileUsernameTriggerType {
  (): AnyActionType;
}

/**
 * LoadProfileAddressTriggerType
 */
export interface LoadProfileAddressTriggerType {
  (): AnyActionType;
}

/**
 * LoadProfilePurchasesTriggerType
 */
export interface LoadProfilePurchasesTriggerType {
  (): AnyActionType;
}

/**
 * LoadProfileAuthorizationsTriggerType
 */
export interface LoadProfileAuthorizationsTriggerType {
  (): AnyActionType;
}

/**
 * UpdateProfileAuthorizationsStudentCardTriggerType
 */
export interface UpdateProfileAuthorizationsTriggerType {
  (data: {
    current: ProfileAuthorizations;
    updated: Partial<ProfileAuthorizations>;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadProfileStudentCardInfoTriggerType
 */
export interface LoadProfileStudentCardInfoTriggerType {
  (): AnyActionType;
}

/**
 * UpdateProfileAddressTriggerType
 */
export interface UpdateProfileAddressTriggerType {
  (data: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
    municipality: string;
    success: () => any;
    fail: () => any;
  }): AnyActionType;
}

/**
 * LoadProfileChatSettingsTriggerType
 */
export interface LoadProfileChatSettingsTriggerType {
  (): AnyActionType;
}

/**
 * UpdateProfileChatSettingsTriggerType
 */
export interface UpdateProfileChatSettingsTriggerType {
  (data: {
    visibility: string;
    nick?: string;
    success: () => any;
    fail: () => any;
  }): AnyActionType;
}

/**
 * UploadProfileImageTriggerType
 */
export interface UploadProfileImageTriggerType {
  (data: {
    croppedB64: string;
    originalB64?: string;
    file?: File;
    success: () => any;
    fail: () => any;
  }): AnyActionType;
}

/**
 * DeleteProfileImageTriggerType
 */
export interface DeleteProfileImageTriggerType {
  (): AnyActionType;
}

export type SET_PROFILE_USER_PROPERTY = SpecificActionType<
  "SET_PROFILE_USER_PROPERTY",
  {
    key: string;
    value: string;
  }
>;

/**
 * SetProfileLocationTriggerType
 */
export interface SetProfileLocationTriggerType {
  (location: string): AnyActionType;
}

/**
 * LoadProfileWorklistTemplatesTriggerType
 */
export interface LoadProfileWorklistTemplatesTriggerType {
  (): AnyActionType;
}

/**
 * LoadProfileWorklistSectionsTriggerType
 */
export interface LoadProfileWorklistSectionsTriggerType {
  (cb?: (d: Array<WorklistSection>) => void): AnyActionType;
}

/**
 * InsertProfileWorklistItemTriggerType
 */
export interface InsertProfileWorklistItemTriggerType {
  (data: {
    templateId: number;
    description: string;
    entryDate: string;
    price: number;
    factor: number;
    billingNumber: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteProfileWorklistItemTriggerType
 */
export interface DeleteProfileWorklistItemTriggerType {
  (data: {
    item: WorklistItem;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * EditProfileWorklistItemTriggerType
 */
export interface EditProfileWorklistItemTriggerType {
  (data: {
    item: WorklistItem;
    description: string;
    entryDate: string;
    price: number;
    factor: number;
    billingNumber: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateProfileWorklistItemsStateTriggerType
 */
export interface UpdateProfileWorklistItemsStateTriggerType {
  (data: {
    beginDate: string;
    endDate: string;
    state: WorklistBillingStateType;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadProfileWorklistSectionTriggerType
 */
export interface LoadProfileWorklistSectionTriggerType {
  (index: number, refresh?: boolean): AnyActionType;
}

export type SET_PROFILE_USERNAME = SpecificActionType<
  "SET_PROFILE_USERNAME",
  string
>;
export type SET_PROFILE_LOCATION = SpecificActionType<
  "SET_PROFILE_LOCATION",
  string
>;
export type SET_PROFILE_ADDRESSES = SpecificActionType<
  "SET_PROFILE_ADDRESSES",
  UserStudentAddress[]
>;
export type SET_PROFILE_STUDENT = SpecificActionType<
  "SET_PROFILE_STUDENT",
  UserWithSchoolData
>;
export type SET_PROFILE_CHAT_SETTINGS = SpecificActionType<
  "SET_PROFILE_CHAT_SETTINGS",
  UserChatSettingsType
>;
export type SET_WORKLIST_TEMPLATES = SpecificActionType<
  "SET_WORKLIST_TEMPLATES",
  WorklistTemplate[]
>;
export type SET_WORKLIST = SpecificActionType<
  "SET_WORKLIST",
  Array<WorklistSection>
>;
export type SET_PURCHASE_HISTORY = SpecificActionType<
  "SET_PURCHASE_HISTORY",
  Array<CeeposOrder>
>;

export type SET_PROFILE_AUTHORIZATIONS = SpecificActionType<
  "SET_PROFILE_AUTHORIZATIONS",
  ProfileAuthorizations
>;

/**
 * LoadProfilePropertiesSetTriggerType
 */
const loadProfilePropertiesSet: LoadProfilePropertiesSetTriggerType =
  function loadProfilePropertiesSet() {
    return async (dispatch, getState) => {
      const state = getState();
      const userApi = MApi.getUserApi();

      try {
        const properties = (await userApi.getUserProperties({
          userEntityId: state.status.userId,
          properties:
            "profile-phone,profile-appointmentCalendar,profile-extraInfo,profile-whatsapp,profile-vacation-start,profile-vacation-end,communicator-auto-reply,communicator-auto-reply-msg,communicator-auto-reply-subject",
        })) as ProfileProperty[];

        properties.forEach((property: ProfileProperty) => {
          dispatch({
            type: "SET_PROFILE_USER_PROPERTY",
            payload: {
              key: property.key,
              value: property.value,
            },
          });
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };
  };

/**
 * SaveProfilePropertyTriggerType
 * @param data data
 */
const saveProfileProperty: SaveProfilePropertyTriggerType =
  function saveProfileProperty(data) {
    return async (dispatch) => {
      const userApi = MApi.getUserApi();

      try {
        const prop = { key: data.key, value: data.value };

        await userApi.setUserProperty({
          setUserPropertyRequest: {
            key: data.key,
            value: data.value,
          },
        });

        dispatch({
          type: "SET_PROFILE_USER_PROPERTY",
          payload: prop,
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        data.fail && data.fail();
      }
    };
  };

/**
 * loadProfileUsername
 */
const loadProfileUsername: LoadProfileUsernameTriggerType =
  function loadProfileUsername() {
    return async (dispatch) => {
      const userpluginApi = MApi.getUserpluginApi();

      try {
        const credentials = await userpluginApi.getUserPluginCredentials();

        if (credentials && credentials.username) {
          dispatch({
            type: "SET_PROFILE_USERNAME",
            payload: credentials.username,
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };
  };

/**
 * loadProfileAddress
 */
const loadProfileAddress: LoadProfileAddressTriggerType =
  function loadProfileAddress() {
    return async (dispatch, getState) => {
      const state = getState();
      const userApi = MApi.getUserApi();

      try {
        const identifier = state.status.userSchoolDataIdentifier;

        const addresses = await userApi.getStudentAddresses({
          studentId: identifier,
        });

        const student = await userApi.getStudent({
          studentId: identifier,
        });

        dispatch({
          type: "SET_PROFILE_ADDRESSES",
          payload: addresses,
        });

        dispatch({
          type: "SET_PROFILE_STUDENT",
          payload: student,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };
  };

/**
 * updateProfileAddress
 * @param data data
 */
const updateProfileAddress: UpdateProfileAddressTriggerType =
  function updateProfileAddress(data) {
    return async (dispatch, getState) => {
      const state = getState();
      const userApi = MApi.getUserApi();

      try {
        if (data.municipality && data.municipality !== "") {
          const student = { ...state.profile.student };
          student.municipality = data.municipality;

          const updatedStudent = await userApi.updateStudent({
            studentId: student.id,
            userWithSchoolData: student,
          });

          dispatch({
            type: "SET_PROFILE_STUDENT",
            payload: updatedStudent,
          });
        }

        let address = state.profile.addresses.find((a) => a.defaultAddress);
        if (!address) {
          address = state.profile.addresses[0];
        }

        const nAddress = {
          ...address,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode,
          street: data.street,
        };

        const nAddressAsSaidFromServer = await userApi.updateStudentAddress({
          studentId: state.status.userSchoolDataIdentifier,
          addressId: nAddress.identifier,
          userStudentAddress: nAddress,
        });

        const newAddresses = state.profile.addresses.map((a) =>
          a.identifier === nAddressAsSaidFromServer.identifier
            ? nAddressAsSaidFromServer
            : a
        );

        dispatch({
          type: "SET_PROFILE_ADDRESSES",
          payload: newAddresses,
        });

        dispatch(
          updateStatusProfile({
            ...state.status.profile,
            addresses: newAddresses.map(
              (address) =>
                (address.street ? address.street + " " : "") +
                (address.postalCode ? address.postalCode + " " : "") +
                (address.city ? address.city + " " : "") +
                (address.country ? address.country + " " : "")
            ),
          })
        );

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        data.fail && data.fail();
      }
    };
  };

/**
 * updateProfileChatSettings
 * @param data data
 */
const updateProfileChatSettings: UpdateProfileChatSettingsTriggerType =
  function updateProfileChatSettings(data) {
    return async (dispatch) => {
      try {
        const request = await fetch("/rest/chat/settings", {
          method: "PUT",
          body: JSON.stringify({
            visibility: data.visibility,
            nick: data.nick,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const status = request.status;
        if (status === 200) {
          const json = <UserChatSettingsType>await request.json();

          dispatch({
            type: "SET_PROFILE_CHAT_SETTINGS",
            payload: <UserChatSettingsType>json,
          });

          data.success && data.success();
        } else {
          const message = await request.text();
          dispatch(actions.displayNotification(message, "error"));
          data.fail && data.fail();
        }
      } catch (err) {
        // Commented out for now and will replaced with ne
        // after the new chat is implemented
        /* if (!(err instanceof MApiError)) {
          throw err;
        } */

        data.fail && data.fail();
      }
    };
  };

const imageSizes = [96, 256];

/**
 * uploadProfileImage
 * @param data data
 */
const uploadProfileImage: UploadProfileImageTriggerType =
  function uploadProfileImage(data) {
    return async (dispatch, getState) => {
      const userApi = MApi.getUserApi();

      try {
        if (data.originalB64) {
          await userApi.createFile({
            createFileRequest: {
              contentType: data.file.type,
              base64Data: data.originalB64,
              identifier: "profile-image-original",
              name: data.file.name,
              visibility: "PUBLIC",
            },
          });
        }

        const image: HTMLImageElement = <HTMLImageElement>(
          await promisifyNewConstructor(Image, "onload", "onerror", {
            src: data.croppedB64,
          })()
        );

        for (let i = 0; i < imageSizes.length; i++) {
          const size = imageSizes[i];

          await userApi.createFile({
            createFileRequest: {
              contentType: "image/jpeg",
              base64Data: resize(image, size),
              identifier: "profile-image-" + size,
              name: "profile-" + size + ".jpg",
              visibility: "PUBLIC",
            },
          });
        }

        dispatch(updateStatusHasImage(true));
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.saveSuccess", { ns: "users" }),
            "success"
          )
        );

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.saveError", { ns: "users" }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * deleteProfileImage
 */
const deleteProfileImage: DeleteProfileImageTriggerType =
  function deleteProfileImage() {
    return async (dispatch, getState) => {
      const userApi = MApi.getUserApi();

      const state = getState();
      const allImagesToDelete = ["original", ...imageSizes];

      try {
        for (let i = 0; i < allImagesToDelete.length; i++) {
          const identifier = `profile-image-${allImagesToDelete[i]}`;

          await userApi.deleteFile({
            userEntityId: state.status.userId,
            identifier: identifier,
          });
        }

        dispatch(updateStatusHasImage(false));
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.removeError", { ns: "users" }),
            "error"
          )
        );
      }
    };
  };

/**
 * setProfileLocation
 * @param location location
 */
const setProfileLocation: SetProfileLocationTriggerType =
  function setProfileLocation(location: string) {
    return {
      type: "SET_PROFILE_LOCATION",
      payload: location,
    };
  };

/**
 * insertProfileWorklistItem
 * @param data data
 */
const insertProfileWorklistItem: InsertProfileWorklistItemTriggerType =
  function insertProfileWorklistItem(data) {
    return async (dispatch, getState) => {
      const worklistApi = MApi.getWorklistApi();

      const state = getState();

      if (!state.profile || !state.profile.worklist) {
        return;
      }

      try {
        const worklistItem = await worklistApi.createWorklistItem({
          createWorklistItemRequest: {
            templateId: data.templateId,
            billingNumber: data.billingNumber,
            description: data.description,
            entryDate: data.entryDate,
            factor: data.factor,
            price: data.price,
          },
        });

        let displayName = localize.date(worklistItem.entryDate, "MMMM YYYY");
        displayName = displayName[0].toUpperCase() + displayName.substr(1);

        const expectedSummary: WorklistSummary = {
          beginDate: moment(worklistItem.entryDate)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endDate: moment(worklistItem.entryDate)
            .endOf("month")
            .format("YYYY-MM-DD"),
          displayName,
          count: 1,
        };

        const currWorklist = getState().profile.worklist;
        const matchingSummaryIndex = currWorklist.findIndex(
          (f) => f.summary.beginDate === expectedSummary.beginDate
        );
        if (matchingSummaryIndex === -1) {
          const newWorklist = [...currWorklist];
          const entryDate = moment(worklistItem.entryDate).startOf("month");
          const itemWithMoreIndex = newWorklist.findIndex((p) =>
            moment(p.summary.beginDate).isAfter(entryDate)
          );

          // we can add it here right away because not finding
          // the worklist summary thing means that it was just
          // created so we can add its single item right away
          if (itemWithMoreIndex === -1) {
            newWorklist.push({
              summary: expectedSummary,
              items: [worklistItem],
            });
          } else {
            newWorklist.splice(itemWithMoreIndex, 0, {
              summary: expectedSummary,
              items: [worklistItem],
            });
          }

          dispatch({
            type: "SET_WORKLIST",
            payload: newWorklist,
          });
        } else {
          const newSummary = { ...currWorklist[matchingSummaryIndex] };
          newSummary.summary.count++;

          // on the other hand here we should only add the worklist
          // item if there are items already rather than null
          // in which case it hasn't been loaded
          if (newSummary.items) {
            const itemWithMoreIndex = newSummary.items.findIndex((p) =>
              moment(p.entryDate).isAfter(worklistItem.entryDate)
            );

            if (itemWithMoreIndex === -1) {
              newSummary.items = [...newSummary.items, worklistItem];
            } else {
              newSummary.items.splice(itemWithMoreIndex, 0, worklistItem);
            }
          }

          const newWorklist = [...currWorklist];
          newWorklist[matchingSummaryIndex] = newSummary;

          dispatch({
            type: "SET_WORKLIST",
            payload: newWorklist,
          });
        }
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.createError", { ns: "worklist" }),
            "error"
          )
        );
      }
    };
  };

/**
 * deleteProfileWorklistItem
 * @param data data
 */
const deleteProfileWorklistItem: DeleteProfileWorklistItemTriggerType =
  function deleteProfileWorklistItem(data) {
    return async (dispatch, getState) => {
      const worklistApi = MApi.getWorklistApi();

      const state = getState();

      if (!state.profile || !state.profile.worklist) {
        return;
      }

      try {
        await worklistApi.deleteWorklistItem({
          worklistItemId: data.item.id,
        });
        const expectedSummaryBeginDate = moment(data.item.entryDate)
          .startOf("month")
          .format("YYYY-MM-DD");

        const currWorklist = getState().profile.worklist;
        const matchingSummaryIndex = currWorklist.findIndex(
          (f) => f.summary.beginDate === expectedSummaryBeginDate
        );
        if (matchingSummaryIndex !== -1) {
          const newSummary = { ...currWorklist[matchingSummaryIndex] };
          newSummary.summary.count--;

          if (newSummary.items) {
            newSummary.items = newSummary.items.filter(
              (i) => i.id !== data.item.id
            );
          }

          let newWorklist: WorklistSection[];
          if (newSummary.summary.count === 0) {
            newWorklist = currWorklist.filter(
              (i, index) => index !== matchingSummaryIndex
            );
          } else {
            newWorklist = [...currWorklist];
            newWorklist[matchingSummaryIndex] = newSummary;
          }

          dispatch({
            type: "SET_WORKLIST",
            payload: newWorklist,
          });
        }
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.removeError", { ns: "worklist" }),
            "error"
          )
        );
      }
    };
  };

/**
 * editProfileWorklistItem
 * @param data data
 */
const editProfileWorklistItem: EditProfileWorklistItemTriggerType =
  function deleteProfileWorklistItem(data) {
    return async (dispatch, getState) => {
      if (
        data.description === data.item.description &&
        data.entryDate === data.item.entryDate &&
        data.factor === data.item.factor &&
        data.price === data.item.price &&
        data.billingNumber === data.item.billingNumber
      ) {
        data.success && data.success();
        return;
      }

      const worklistApi = MApi.getWorklistApi();

      const state = getState();

      if (!state.profile || !state.profile.worklist) {
        return;
      }

      try {
        const updatedWorklistItem = await worklistApi.updateWorklistItem({
          worklistItemId: data.item.id,
          updateWorklistItemRequest: {
            id: data.item.id,
            entryDate: data.entryDate,
            description: data.description,
            price: data.price,
            factor: data.factor,
            billingNumber: data.billingNumber,
          },
        });

        const expectedSummaryBeginDate = moment(updatedWorklistItem.entryDate)
          .startOf("month")
          .format("YYYY-MM-DD");

        const currWorklist = getState().profile.worklist;
        const matchingSummaryIndex = currWorklist.findIndex(
          (f) => f.summary.beginDate === expectedSummaryBeginDate
        );
        if (
          matchingSummaryIndex !== -1 &&
          currWorklist[matchingSummaryIndex].items
        ) {
          const newSummary = { ...currWorklist[matchingSummaryIndex] };

          let newItems = newSummary.items.filter((i) => {
            if (i.id === data.item.id) {
              return false;
            }

            return true;
          });

          const itemWithMoreIndex = newItems.findIndex((p) =>
            moment(p.entryDate).isAfter(updatedWorklistItem.entryDate)
          );

          if (itemWithMoreIndex === -1) {
            newItems = [...newItems, updatedWorklistItem];
          } else {
            newItems.splice(itemWithMoreIndex, 0, updatedWorklistItem);
          }

          newSummary.items = newItems;

          const newWorklist = [...currWorklist];
          newWorklist[matchingSummaryIndex] = newSummary;

          dispatch({
            type: "SET_WORKLIST",
            payload: newWorklist,
          });
        }
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        data.fail && data.fail();
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.updateError", { ns: "worklist" }),
            "error"
          )
        );
      }
    };
  };

/**
 * loadProfileWorklistTemplates
 */
const loadProfileWorklistTemplates: LoadProfileWorklistTemplatesTriggerType =
  function loadProfileWorklistTemplates() {
    return async (dispatch, getState) => {
      const worklistApi = MApi.getWorklistApi();

      const state = getState();

      if (state.profile && state.profile.worklistTemplates) {
        return;
      }

      try {
        const templates = await worklistApi.getWorklistTemplates();

        dispatch({
          type: "SET_WORKLIST_TEMPLATES",
          payload: templates,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "worklist",
              context: "templates",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * loadProfileWorklistSections
 * @param cb cb
 */
const loadProfileWorklistSections: LoadProfileWorklistSectionsTriggerType =
  function loadProfileWorklistSections(
    cb?: (d: Array<WorklistSection>) => void
  ) {
    return async (dispatch, getState) => {
      const worklistApi = MApi.getWorklistApi();

      const state = getState();

      if (state.profile && state.profile.worklist) {
        return;
      }

      try {
        const summaries = await worklistApi.getWorklistSummary({
          owner: state.status.userSchoolDataIdentifier,
        });

        const payload = summaries.map<WorklistSection>((s) => ({
          summary: s,
          items: null,
        }));
        dispatch({
          type: "SET_WORKLIST",
          payload,
        });
        cb && cb(payload);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "worklist",
              context: "section",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * loadProfileWorklistSection
 * @param index index
 * @param refresh refresh
 */
const loadProfileWorklistSection: LoadProfileWorklistSectionTriggerType =
  function loadProfileWorklistSection(index: number, refresh?: boolean) {
    return async (dispatch, getState) => {
      const worklistApi = MApi.getWorklistApi();

      const state = getState();

      if (
        !state.profile ||
        !state.profile.worklist ||
        !state.profile.worklist[index] ||
        (state.profile.worklist[index].items && !refresh)
      ) {
        return;
      }

      try {
        const summary = state.profile.worklist[index].summary;

        const items = await worklistApi.getWorklistItems({
          owner: state.status.userSchoolDataIdentifier,
          beginDate: summary.beginDate,
          endDate: summary.endDate,
        });

        const newWorkList = [...getState().profile.worklist];
        newWorkList[index] = { ...newWorkList[index], items };

        dispatch({
          type: "SET_WORKLIST",
          payload: newWorkList,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "worklist",
              context: "section",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * updateProfileWorklistItemsState
 * @param data data
 */
const updateProfileWorklistItemsState: UpdateProfileWorklistItemsStateTriggerType =
  function updateProfileWorklistItemsState(data) {
    return async (dispatch, getState) => {
      const worklistApi = MApi.getWorklistApi();

      const state = getState();

      if (!state.profile || !state.profile.worklist) {
        return;
      }

      try {
        const updatedItems = await worklistApi.updateWorklistItemsState({
          updateWorklistItemsStateRequest: {
            userIdentifier: state.status.userSchoolDataIdentifier,
            beginDate: data.beginDate,
            endDate: data.endDate,
            state: data.state,
          },
        });

        // create a new worklist where we would replace the old worklist items with
        const newWorkList = getState().profile.worklist.map((worklistGroup) => {
          const newWorklistGroup = { ...worklistGroup };
          if (newWorklistGroup.items) {
            newWorklistGroup.items = newWorklistGroup.items.map((i) => {
              const foundInUpdate = updatedItems.find(
                (updatedItem) => updatedItem.id === i.id
              );

              if (foundInUpdate) {
                return { ...i, ...foundInUpdate };
              }

              return i;
            });
          }
          return newWorklistGroup;
        });

        dispatch({
          type: "SET_WORKLIST",
          payload: newWorkList,
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.updateError", {
              ns: "worklist",
            }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * loadProfilePurchases
 */
const loadProfilePurchases: LoadProfilePurchasesTriggerType =
  function loadProfilePurchases() {
    return async (dispatch, getState) => {
      const state = getState();
      const ceeposApi = MApi.getCeeposApi();

      try {
        const studentId = state.status.userSchoolDataIdentifier;

        const orderHistory: CeeposOrder[] = await ceeposApi.getCeeposUserOrders(
          {
            userIdentifier: studentId,
          }
        );

        dispatch({
          type: "SET_PURCHASE_HISTORY",
          payload: orderHistory,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "orders",
              context: "orders",
            }),
            "error"
          )
        );
      }
    };
  };

/**
 * Thunk function to load profile authorizations data. Can be expanded to load more data in the future.
 * Currently only student card data is loaded.
 */
const loadProfileAuthorizations: LoadProfileAuthorizationsTriggerType =
  function loadProfileAuthorizations() {
    return async (dispatch, getState) => {
      const studentCardApi = MApi.getStudentCardApi();

      const status = getState().status;

      /**
       * Callback helper function to get student card data
       * @returns Student card data or null if not found
       */
      const getStudentCardCallback = async () => {
        if (status.isStudent) {
          try {
            return await studentCardApi.getStudentCard({
              studentIdentifier: status.userSchoolDataIdentifier,
            });
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }

            // In case the student card is not found, we don't want to throw an error
            // but we want to handle it as null value
            if (isResponseError(err) && err.response.status === 404) {
              return null;
            }
          }
        }
        return null;
      };

      try {
        let studentCard: StudentCard = null;

        [studentCard] = await Promise.all([await getStudentCardCallback()]);

        let authorizations: ProfileAuthorizations;

        if (studentCard) {
          authorizations = {
            studentCard,
            studentCardActive: studentCard.activity === "ACTIVE",
          };
        }

        dispatch({
          type: "SET_PROFILE_AUTHORIZATIONS",
          payload: authorizations,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };
  };

/**
 * updateProfileAuthorizations
 * @param data data
 */
const updateProfileAuthorizations: UpdateProfileAuthorizationsTriggerType =
  function updateProfileAuthorizationStudentCard(data) {
    return async (dispatch, getState) => {
      const studentCardApi = MApi.getStudentCardApi();

      const currentAuthorizationData = data.current;
      const newAuthorizationData = data.updated;

      const updatedAuthorizations: ProfileAuthorizations = {
        ...currentAuthorizationData,
      };

      try {
        // As endpoint only uses boolean value and not whole object but returns the whole object
        // thats why studentCardActive is used to store the boolean value
        if (newAuthorizationData.studentCardActive !== undefined) {
          const studentCard = await studentCardApi.updateStudentCard({
            studentIdentifier: getState().status.userSchoolDataIdentifier,
            studentCardId: currentAuthorizationData.studentCard.id,
            active: newAuthorizationData.studentCardActive,
          });

          updatedAuthorizations.studentCard = studentCard;
          updatedAuthorizations.studentCardActive =
            studentCard.activity === "ACTIVE";
        }

        dispatch({
          type: "SET_PROFILE_AUTHORIZATIONS",
          payload: updatedAuthorizations,
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        data.fail && data.fail();
      }
    };
  };

export {
  loadProfilePropertiesSet,
  saveProfileProperty,
  loadProfileUsername,
  loadProfileAddress,
  updateProfileAddress,
  updateProfileChatSettings,
  uploadProfileImage,
  deleteProfileImage,
  setProfileLocation,
  loadProfileWorklistTemplates,
  loadProfileWorklistSections,
  loadProfileWorklistSection,
  insertProfileWorklistItem,
  deleteProfileWorklistItem,
  editProfileWorklistItem,
  updateProfileWorklistItemsState,
  loadProfilePurchases,
  loadProfileAuthorizations,
  updateProfileAuthorizations,
};
