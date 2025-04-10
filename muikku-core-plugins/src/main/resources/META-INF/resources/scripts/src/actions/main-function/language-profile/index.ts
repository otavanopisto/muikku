import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Dispatch, Action } from "redux";
import { StatusType } from "~/reducers/base/status";
import notificationActions from "~/actions/base/notifications";
import i18n from "~/locales/i18n";
import MApi, { isMApiError } from "~/api/api";
import {
  LanguageProfileData,
  LanguageProfileLanguage,
  SkillLevels,
  Subjects,
  LanguageLevels,
} from "~/reducers/main-function/language-profile";
import { LoadingState, SaveState } from "~/@types/shared";

export type LanguageProfileLanguagePayload = {
  code: string;
  cellId: string;
  value: LanguageLevels | SkillLevels | Subjects;
};

export type SET_LANGUAGE_PROFILE_LOADING_STATE = SpecificActionType<
  "SET_LANGUAGE_PROFILE_LOADING_STATE",
  LoadingState
>;
export type SET_LANGUAGE_PROFILE_SAVING_STATE = SpecificActionType<
  "SET_LANGUAGE_PROFILE_SAVING_STATE",
  SaveState
>;

export type SET_LANGUAGE_PROFILE = SpecificActionType<
  "SET_LANGUAGE_PROFILE",
  LanguageProfileData
>;

export type UPDATE_LANGUAGE_PROFILE_VALUES = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_VALUES",
  Partial<LanguageProfileData>
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGES = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
  LanguageProfileLanguage
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_LEVELS = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGE_LEVELS",
  { code: string; cellId: string; value: LanguageLevels }
>;

export type UPDATE_LANGUAGE_PROFILE_SKILL_LEVELS = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_SKILL_LEVELS",
  { code: string; cellId: string; value: SkillLevels }
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_SUBJECTS = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SUBJECTS",
  { code: string; cellId: string; value: Subjects }
>;

/**
 * loadLanguageProfileData
 */
export interface loadLanguageProfileTriggerType {
  (id: number, success?: () => void, fail?: () => void): AnyActionType;
}

/**
 * saveInitalizationWizardData
 */
export interface saveLanguageProfileTriggerType {
  (
    userEntityId: number,
    data: LanguageProfileData,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

/**
 * saveLanguageProfileData
 * @param userEntityId student id
 * @param data formData
 * @param success executed on success
 * @param fail executed on faoö
 */
const saveLanguageProfile: saveLanguageProfileTriggerType =
  function saveLanguageProfile(
    userEntityId: number,
    data: LanguageProfileData,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "IN_PROGRESS",
        });
        const LanguageProfileApi = MApi.getLanguageProfile();
        const newLanguageProfile =
          await LanguageProfileApi.createOrUpdateLanguageProfile({
            userEntityId,
            createOrUpdateLanguageProfileRequest: {
              formData: JSON.stringify(data),
            },
          });
        dispatch({
          type: "SET_LANGUAGE_PROFILE",
          payload: JSON.parse(
            newLanguageProfile.formData
          ) as LanguageProfileData,
        });
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "SUCCESS",
        });
        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "FAILED",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              error: err,
              ns: "languageProfile",
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * loadLanguageProfileData
 * @param userEntityId userEntityId
 * @param success success
 * @param fail fail
 */
const loadLanguageProfile: loadLanguageProfileTriggerType =
  function loadLanguageProfile(
    userEntityId: number,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "SET_LANGUAGE_PROFILE_LOADING_STATE",
          payload: "LOADING",
        });
        const LanguageProfileApi = MApi.getLanguageProfile();
        const data = await LanguageProfileApi.getLanguageProfile({
          userEntityId,
        });
        dispatch({
          type: "SET_LANGUAGE_PROFILE",
          payload: JSON.parse(data.formData) as LanguageProfileData,
        });
        dispatch({
          type: "SET_LANGUAGE_PROFILE_LOADING_STATE",
          payload: "READY",
        });
        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch({
          type: "SET_LANGUAGE_PROFILE_LOADING_STATE",
          payload: "ERROR",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              error: err,
              ns: "languageProfile",
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

export { loadLanguageProfile, saveLanguageProfile };
