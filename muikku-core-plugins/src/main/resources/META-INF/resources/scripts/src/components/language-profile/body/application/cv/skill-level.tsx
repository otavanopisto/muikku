import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import {
  LanguageProfileLanguage,
  CVLanguage,
} from "~/reducers/main-function/language-profile";
import { languageLevelOptions } from "~/mock/mock-data";
import { ActionType } from "~/actions";
import Button from "~/components/general/button";
import Stars from "./stars";
import Dropdown from "~/components/general/dropdown";

/**
 * SkillLevelProps
 */
interface SkillLevelProps {
  language: LanguageProfileLanguage;
}
/**
 * SkillLevel component
 * @param props SkillLevelProps
 * @returns JSX.Element
 */
const SkillLevel = (props: SkillLevelProps) => {
  const { language } = props;
  const initialLanguageSkillLevels: CVLanguage = {
    code: language.code,
    description: "",
    interaction: "0",
    vocal: "0",
    writing: "0",
    reading: "0",
    listening: "0",
    general: "A11",
    samples: [],
  };

  const { t } = useTranslation(["languageProfile", "profile"]);
  const dispatch = useDispatch();
  const { cv } = useSelector((state: StateType) => state.languageProfile.data);
  const [languageSkillLevels, setlanguageSkillLevels] =
    React.useState<CVLanguage>(initialLanguageSkillLevels);
  const [sampleUrl, setSampleUrl] = React.useState<string>("");
  const [sampleName, setSampleName] = React.useState<string>("");
  const [isValidUrl, setIsValidUrl] = React.useState<boolean>(true);

  /**
   * handleSelectChange handles changes in the select input.
   * @param e event
   */
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    const updatedLanguageSkillLevels = {
      ...languageSkillLevels,
      [name]: value,
    };

    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevels,
    } as ActionType);

    setlanguageSkillLevels(updatedLanguageSkillLevels);
  };

  /**
   * handleRadioInputChange handles changes in the radio inputs.
   * @param e event
   * @param field field name
   */
  const handleRadioInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    const updatedLanguageSkillLevels = {
      ...languageSkillLevels,
      [field]: value,
    };
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevels,
    } as ActionType);
    setlanguageSkillLevels(updatedLanguageSkillLevels);
  };

  /**
   * handleTextAreaChange handles changes in the text area.
   * @param e event
   */
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    const updatedLanguageSkillLevels = {
      ...languageSkillLevels,
      [name]: value,
    };
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevels,
    } as ActionType);
    setlanguageSkillLevels(updatedLanguageSkillLevels);
  };

  /**
   * isValidURL checks if the provided URL is valid.
   * @param url string
   * @returns boolean
   */
  const validateURL = (url: string): boolean => {
    if (!url || url.trim() === "") return false;

    // Comprehensive URL validation regex
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", // fragment locator
      "i" // case-insensitive
    );

    return urlPattern.test(url);
  };

  const handleUrlFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSampleUrl(e.target.value);

    //if (!isValidUrl) {
    //  setIsValidUrl(true);
    //}
  };

  /**
   * handleAddSampleLink adds link to sample
   */
  const handleAddSampleLink = () => {
    const sample = { name: sampleName, url: sampleUrl };
    const updatedLanguageSkillLevels = {
      ...languageSkillLevels,
      samples: [...languageSkillLevels.samples, sample],
    };

    if (!validateURL(sample.url)) {
      setIsValidUrl(false);
      return;
    }

    setIsValidUrl(true);
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevels,
    } as ActionType);
    setlanguageSkillLevels(updatedLanguageSkillLevels);
    setSampleUrl("");
    setSampleName("");
  };

  /**
   * handleRemoveSampleLink
   * @param index number
   */
  const handleRemoveSampleLink = (index: number) => {
    const updatedLanguageSkillLevels = {
      ...languageSkillLevels,
    };
    updatedLanguageSkillLevels.samples.splice(index, 1);

    setIsValidUrl(true);
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevels,
    } as ActionType);
    setlanguageSkillLevels(updatedLanguageSkillLevels);
  };

  React.useEffect(() => {
    if (cv) {
      const currentLanguageSkillLevel = cv.languages.find(
        (l) => l.code === language.code
      );
      if (currentLanguageSkillLevel) {
        setlanguageSkillLevels(currentLanguageSkillLevel);
      }
    }
  }, [cv, language]);

  return (
    <fieldset className="language-profile-container__fieldset">
      <legend className="language-profile-container__subheader">
        {language.name}
      </legend>
      <div className="language-profile-container__secondary-header">
        {t("labels.languageCVSkillLevelTitle", {
          ns: "languageProfile",
        })}
      </div>
      <div className="language-profile-container__row">
        <div className="language-profile__form-element-container">
          <div className="language-profile__input-group-container">
            <Stars
              label={t("labels.skillLevelInteractionStarLabel", {
                ns: "languageProfile",
              })}
              name="interaction"
              skillLevels={languageSkillLevels}
              onChange={handleRadioInputChange}
            />
            <Stars
              label={t("labels.skillLevelVocalStarLabel", {
                ns: "languageProfile",
              })}
              name="vocal"
              skillLevels={languageSkillLevels}
              onChange={handleRadioInputChange}
            />
            <Stars
              label={t("labels.skillLevelWritingStarLabel", {
                ns: "languageProfile",
              })}
              name="writing"
              skillLevels={languageSkillLevels}
              onChange={handleRadioInputChange}
            />
            <Stars
              label={t("labels.skillLevelReadingStarLabel", {
                ns: "languageProfile",
              })}
              name="reading"
              skillLevels={languageSkillLevels}
              onChange={handleRadioInputChange}
            />
            <Stars
              label={t("labels.skillLevelListeningStarLabel", {
                ns: "languageProfile",
              })}
              name="listening"
              skillLevels={languageSkillLevels}
              onChange={handleRadioInputChange}
            />
          </div>
        </div>
      </div>
      <div className="language-profile-container__row">
        <div className="language-profile__form-element-container">
          <label
            htmlFor="estimateOfSkillLevel"
            className="language-profile__label"
          >
            {t("labels.languageCVSkillLevelEstimateLabel", {
              ns: "languageProfile",
            })}
          </label>
          <select
            id="estimateOfSkillLevel"
            name="general"
            className="language-profile__select"
            onChange={(e) => handleSelectChange(e)}
          >
            {languageLevelOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                selected={option.value === languageSkillLevels.general}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="language-profile-container__row">
        <div className="language-profile__form-element-container">
          <label
            htmlFor="descriptionOfSkillLevel"
            className="language-profile__label"
          >
            {t("labels.languageCVDescriptionOfSkillLabel", {
              ns: "languageProfile",
            })}
          </label>
          <div className="language-profile__field-description">
            {t("labels.languageCVDescriptionOfSkillDescription", {
              ns: "languageProfile",
            })}
          </div>
          <textarea
            id="descriptionOfSkillLevel"
            defaultValue={languageSkillLevels.description || ""}
            className="language-profile__textarea"
            name="description"
            onChange={(e) => handleTextAreaChange(e)}
          />
        </div>
      </div>
      <div className="language-profile-container__secondary-header">
        {t("labels.languageCVLinkSamplesTitle", {
          ns: "languageProfile",
        })}
      </div>
      {languageSkillLevels.samples.map((sample, index) => (
        <div
          key={"sample-link" + index}
          className="language-profile-container__row language-profile-container__row--sample "
        >
          <div>
            <a
              href={sample.url}
              rel="noreferrer"
              target="_blank"
              className="language-profile__sample-link"
            >
              {sample.name}
            </a>
          </div>
          <div className="language-profile__sample-buttons">
            <Dropdown
              openByHover={true}
              content={t("actions.removeSample", { ns: "languageProfile" })}
            >
              <Button
                buttonModifiers={["remove-sample"]}
                icon="trash"
                onClick={() => handleRemoveSampleLink(index)}
              />
            </Dropdown>
          </div>
        </div>
      ))}
      <div className="language-profile-container__row language-profile-container__row--new-sample">
        <div className="language-profile__form-element-container">
          <div className="language-profile__field-description">
            {t("labels.languageCVLinkSampleFieldDescription", {
              ns: "languageProfile",
            })}
          </div>
          <label htmlFor="sampleName" className="language-profile__label">
            {t("labels.linkSampleName", {
              ns: "languageProfile",
            })}
          </label>
          <input
            type="text"
            name="sampleName"
            value={sampleName}
            id="sampleName"
            className={`language-profile__input`}
            onChange={(e) => setSampleName(e.target.value)}
          />
          <label htmlFor="sampleUrl" className="language-profile__label">
            {t("labels.linkSampleUrl", {
              ns: "languageProfile",
            })}
          </label>
          <input
            type="url"
            name="sampleUrl"
            value={sampleUrl}
            id="sampleUrl"
            className={`language-profile__input ${isValidUrl ? "" : "INVALID"}`}
            onChange={handleUrlFieldChange}
          />
          <div className="language-profile__sample-buttons language-profile__sample-buttons--add-sample">
            <Button
              href={sampleUrl}
              buttonModifiers={["info"]}
              openInNewTab="_blank"
              disabled={sampleUrl === ""}
            >
              {t("actions.test", { ns: "profile" })}
            </Button>
            <Button
              disabled={sampleName === "" || sampleUrl === ""}
              buttonModifiers={["execute"]}
              onClick={handleAddSampleLink}
              icon="plus"
            >
              {t("actions.addLink", { ns: "languageProfile" })}
            </Button>
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default SkillLevel;
