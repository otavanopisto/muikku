import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import { ActionType } from "~/actions";
import { LanguageCode, LanguageData } from "~/@types/shared";
import AddLanguage from "./components/language-profile-add-item";
import LanguageProfileDataDisplayer from "./components/language-profile-data-displayer";
import { availableLanguages } from "~/mock/mock-data";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import PromptDialog from "~/components/general/prompt-dialog";
/**
 * LanguageUsage
 * This component allows users to manage their language usage, learning,
 * and motivation for studying languages.
 */
const LanguageUsage = () => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const dispatch = useDispatch();
  const {
    languages,
    languageUsage,
    languageLearning,
    studyMotivation,
    samples,
    cv,
  } = useSelector((state: StateType) => state.languageProfile.data);

  // Create a ref to store the timeout ID
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  /**
   * handleFieldChange
   * @param e React.ChangeEvent<HTMLTextAreaElement>
   * @param field  field of LanguageProfileData to update
   */
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof LanguageProfileData
  ) => {
    // Get the current value
    const value = e.target.value;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      dispatch({
        type: "UPDATE_LANGUAGE_PROFILE_VALUES",
        payload: { [field]: value },
      } as ActionType);
    }, 500); // 500ms debounce time
  };

  /**
   * getLockedLanguages
   * Retrieves the languages that have data and cannot be removed.
   */
  const getLockedLanguages = () => {
    const lockedLanguageCodes: LanguageCode[] = [];
    languages.forEach((language) => {
      // If the language has skills, subjects, or levels, it is locked
      if (
        (language.skills && language.skills.length > 0) ||
        (language.workspaces && language.workspaces.length > 0) ||
        (language.levels && language.levels.length > 0)
      ) {
        lockedLanguageCodes.push(language.code as LanguageCode);
      }
    });
    // If there are samples language is locked
    if (samples && samples.length > 0) {
      samples.forEach((sample) =>
        lockedLanguageCodes.push(sample.language as LanguageCode)
      );
    }
    // If there is CV data, language is locked
    if (cv.languages) {
      cv.languages.forEach((language) =>
        lockedLanguageCodes.push(language.code as LanguageCode)
      );
    }
    return lockedLanguageCodes;
  };

  /**
   * handleAddLanguage
   * @param language the language to add
   */
  const handleLanguage = (language: LanguageData) => {
    if (getLockedLanguages().includes(language.code)) {
      return;
    }
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
      payload: language,
    } as ActionType);
  };

  // Clean up the timeout when the component unmounts
  React.useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  /**
   * handleRemoveLanguage
   * @param language the language to remove
   */
  const handleRemoveLanguage = (language: LanguageData) => {
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
      payload: language,
    } as ActionType);
  };

  /**
   * removeLanguage
   * @param language the language to remove
   */
  const removeLanguage = (language: LanguageData) => (
    <PromptDialog
      title={t("labels.remove", {
        context: "language",
        language: language.name,
      })}
      content={t("content.removing", {
        context: "language",
      })}
      onExecute={() => handleRemoveLanguage(language)}
    >
      <Button buttonModifiers={["remove-language"]} icon="trash" />
    </PromptDialog>
  );

  return (
    <div className="language-profile-container">
      <fieldset className="language-profile-container__fieldset">
        <legend className="language-profile-container__subheader">
          {t("labels.initializationStep1Title", {
            ns: "languageProfile",
          })}
        </legend>
        <div className="language-profile-container__fieldset-description">
          {t("content.initializationStep1Description", {
            ns: "languageProfile",
          })}
        </div>
        <div className="language-profile-container__row">
          <div className="language-profile__form-element-container">
            <label className="language-profile__label">
              {t("labels.addNewLanguagesTitle", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("labels.addNewLanguagesDescription", {
                ns: "languageProfile",
              })}
            </div>
            <LanguageProfileDataDisplayer
              rows={languages}
              singleColumn={true}
              disabledItems={getLockedLanguages()}
              columnAction={removeLanguage}
            />
            <AddLanguage
              action={handleLanguage}
              filterBy="code"
              allItems={availableLanguages}
              selectedItems={languages}
              placeHolder={t("labels.addLanguageFieldLabel", {
                ns: "languageProfile",
              })}
            />
          </div>
        </div>
        <div className="language-profile-container__row">
          <div className="language-profile__form-element-container">
            <label htmlFor="languageUsage" className="language-profile__label">
              {t("labels.languageUsageUseOfLanguagesLabel", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("labels.languageUsageUseOfLanguagesDescription", {
                ns: "languageProfile",
              })}
            </div>
            <textarea
              id="languageUsage"
              defaultValue={languageUsage || ""}
              className="language-profile__textarea"
              onChange={(e) => handleFieldChange(e, "languageUsage")}
            />
          </div>
        </div>
        <div className="language-profile-container__row">
          <div className="language-profile__form-element-container">
            <label
              htmlFor="studyMotivation"
              className="language-profile__label"
            >
              {t("labels.languageUsageMotivationInStudyingLabel", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("labels.languageUsageMotivationInStudyingDescription", {
                ns: "languageProfile",
              })}
            </div>
            <textarea
              id="studyMotivation"
              defaultValue={studyMotivation || ""}
              className="language-profile__textarea"
              onChange={(e) => handleFieldChange(e, "studyMotivation")}
            />
          </div>
        </div>
        <div className="language-profile-container__row">
          <div className="language-profile__form-element-container">
            <label
              htmlFor="messageForTeacher"
              className="language-profile__label"
            >
              {t("labels.languageUsageLearningLanguagesLabel", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("labels.languageUsageLearningLanguagesDescription", {
                ns: "languageProfile",
              })}
            </div>
            <textarea
              id="messageForTeacher"
              defaultValue={languageLearning || ""}
              className="language-profile__textarea"
              onChange={(e) => handleFieldChange(e, "languageLearning")}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default LanguageUsage;
