import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Dispatch, Action } from "redux";
import { StatusType } from "~/reducers/base/status";
import i18n from "~/locales/i18n";
import MApi, { isMApiError } from "~/api/api";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import { Language } from "~/@types/shared";

export type UPDATE_LANGUAGE_PROFILE_VALUES = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_VALUES",
  Partial<LanguageProfileData>
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGES = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
  Language
>;

/**
 * loadLanguageProfileData
 */
export interface loadLanguageProfileData {
  (): AnyActionType;
}

/**
 * saveInitalizationWizardData
 */
export interface saveInitalizationWizardData {
  (): AnyActionType;
}
