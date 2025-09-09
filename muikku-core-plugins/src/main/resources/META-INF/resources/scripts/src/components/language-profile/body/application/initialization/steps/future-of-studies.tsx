import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "~/actions";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import { StateType } from "~/reducers";

/**
 * FutureOfStudies component
 * @returns JSX element that displays the future of studies section
 */
const FutureOfStudies = () => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const dispatch = useDispatch();
  const { learningFactors, futureUsage, skillGoals } = useSelector(
    (state: StateType) => state.languageProfile.data
  );

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  /**
   * Debounced field change handler
   *  @param e React.ChangeEvent<HTMLTextAreaElement>
   *  @param field  field of LanguageProfileData to update
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
        type: "LANGUAGE_PROFILE_UPDATE_VALUES",
        payload: { [field]: value },
      } as ActionType);
    }, 300); // 300ms debounce time
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
          {t("labels.futureOfStudies", {
            ns: "languageProfile",
          })}
        </legend>
        <div className="language-profile-container__fieldset-description">
          {t("content.futureOfStudies", {
            ns: "languageProfile",
          })}
        </div>
        <div className="language-profile-container__row">
          <div className="language-profile__form-element-container">
            <label
              htmlFor="learningFactors"
              className="language-profile__label"
            >
              {t("labels.studyAffectingFactors", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("content.studyAffectingFactors", {
                ns: "languageProfile",
              })}
            </div>
            <textarea
              id="learningFactors"
              defaultValue={learningFactors || ""}
              onChange={(e) => handleFieldChange(e, "learningFactors")}
              className="language-profile__textarea"
            />
          </div>
        </div>
        <div className="language-profile-container__row">
          <div className="language-profile__form-element-container">
            <label htmlFor="futureUsage" className="language-profile__label">
              {t("labels.futureUsage", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("content.futureUsage", {
                ns: "languageProfile",
              })}
            </div>
            <textarea
              id="futureUsage"
              defaultValue={futureUsage || ""}
              onChange={(e) => handleFieldChange(e, "futureUsage")}
              className="language-profile__textarea"
            />
          </div>
        </div>
        <div className="language-profile-container__row">
          <div className="language-profile__form-element-container">
            <label htmlFor="skillGoals" className="language-profile__label">
              {t("labels.languageGoals", {
                ns: "languageProfile",
              })}
            </label>
            <div className="language-profile__field-description">
              {t("content.languageGoals", {
                ns: "languageProfile",
              })}
            </div>
            <textarea
              id="skillGoals"
              defaultValue={skillGoals || ""}
              onChange={(e) => handleFieldChange(e, "skillGoals")}
              className="language-profile__textarea"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default FutureOfStudies;
