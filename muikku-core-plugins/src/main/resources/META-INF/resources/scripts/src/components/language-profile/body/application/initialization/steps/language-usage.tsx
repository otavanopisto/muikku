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

/**
 * LanguageUsage
 * This component allows users to manage their language usage, learning,
 * and motivation for studying languages.
 */
const LanguageUsage = () => {
  const { t } = useTranslation("languageProfile");
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
   * Retrieves the languages that are locked and cannot be modified.
   * If there are submitted samples or existing languages in the CV,
   * the language removal is locked
   */
  const getLockedLanguages = () => {
    const lockedLanguageCodes: LanguageCode[] = [];
    if (samples && samples.length > 0) {
      samples.forEach((sample) =>
        lockedLanguageCodes.push(sample.language as LanguageCode)
      );
    }

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
              onItemClick={handleLanguage}
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
            <label className="language-profile__label">
              {t("labels.languageUsageUseOfLanguagesLabel", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("labels.languageUsageUseOfLanguagesLabel", {
                ns: "languageProfile",
              })}
            </div>
            <div className="form-element__textarea-container">
              <textarea
                id="languageUsage"
                defaultValue={languageUsage || ""}
                className="language-profile__textarea"
                onChange={(e) => handleFieldChange(e, "languageUsage")}
              />
            </div>
          </div>
        </div>
        <div className="language-profile-container__row">
          <div className="language-profile__form-element-container">
            <label className="language-profile__label">
              {t("labels.languageUsageMotivationInStudyingLabel", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("labels.languageUsageMotivationInStudyingDescription", {
                ns: "languageProfile",
              })}
            </div>
            <div className="form-element__textarea-container">
              <textarea
                id="studyMotivation"
                defaultValue={studyMotivation || ""}
                className="language-profile__textarea"
                onChange={(e) => handleFieldChange(e, "studyMotivation")}
              />
            </div>
          </div>
        </div>
        <div className="language-profile-container__row">
          <div className="language-profile__form-element-container">
            <label className="language-profile__label">
              {t("labels.languageUsageLearningLanguagesLabel", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("labels.languageUsageLearningLanguagesDescription", {
                ns: "languageProfile",
              })}
            </div>
            <div className="form-element__textarea-container">
              <textarea
                id="messageForTeacher"
                defaultValue={languageLearning || ""}
                className="language-profile__textarea"
                onChange={(e) => handleFieldChange(e, "languageLearning")}
              />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default LanguageUsage;
