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

  const { t } = useTranslation("languageProfile");
  const dispatch = useDispatch();
  const { cv } = useSelector((state: StateType) => state.languageProfile.data);
  const [languageSkillLevels, setlanguageSkillLevels] =
    React.useState<CVLanguage>(initialLanguageSkillLevels);
  const [sampleUrl, setSampleUrl] = React.useState<string>("");
  const [isValidUrl, setIsValidUrl] = React.useState<boolean>(true);

  // Create a ref to store the timeout ID
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (cv) {
      const currentLanguageSkillLevel = cv.languages.find(
        (l) => l.code === language.code
      );
      if (currentLanguageSkillLevel) {
        setlanguageSkillLevels(currentLanguageSkillLevel);
      }
    }
  }, [cv, language, languageSkillLevels]);

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
  const isValidURL = (url: string): boolean => {
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

  /**
   * handleAddSampleLink adds link to sample
   */
  const handleAddSampleLink = () => {
    const value = sampleUrl;
    const updatedLanguageSkillLevels = {
      ...languageSkillLevels,
      samples: [...languageSkillLevels.samples, value],
    };

    if (!isValidURL(value)) {
      setIsValidUrl(false);
      return;
    }

    setIsValidUrl(true);
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevels,
    } as ActionType);
    setlanguageSkillLevels(updatedLanguageSkillLevels);
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

  /**
   * handleSampleURLFieldChange handles changes in the sample URL input field with debounce.
   * @param e React.ChangeEvent<HTMLInputElement>
   */
  const handleSampleURLFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Get the current value
    const value = e.target.value;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setSampleUrl(value);
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
    <div>
      <h2>{language.name}</h2>
      <h3>Taitotaso</h3>
      <div>
        <div>
          <Stars
            label="Vuorovaikutus"
            name="interaction"
            skillLevels={languageSkillLevels}
            onChange={handleRadioInputChange}
          />
        </div>
        <div>
          <Stars
            label="Suullinen tuottaminen"
            name="vocal"
            skillLevels={languageSkillLevels}
            onChange={handleRadioInputChange}
          />
        </div>
        <div>
          <Stars
            label="Kirjallinen tuottaminen"
            name="writing"
            skillLevels={languageSkillLevels}
            onChange={handleRadioInputChange}
          />
        </div>
        <div>
          <Stars
            label="Luetun tulkitseminen"
            name="reading"
            skillLevels={languageSkillLevels}
            onChange={handleRadioInputChange}
          />
        </div>
        <div>
          <Stars
            label="Kuullun tulkitseminen"
            name="listening"
            skillLevels={languageSkillLevels}
            onChange={handleRadioInputChange}
          />
        </div>
        <div>
          <label id="descriptionOfSkillLevel">Arvio kokonaistsosta</label>
          <select
            aria-labelledby="descriptionOfSkillLevel"
            name="general"
            className="form-element__select"
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
        <textarea
          aria-labelledby="descriptionOfSkillLevel"
          defaultValue={languageSkillLevels.description || ""}
          className="form-element__textarea"
          name="description"
          onChange={(e) => handleTextAreaChange(e)}
        />
        <div>
          {languageSkillLevels.samples.map((sample, index) => (
            <div key={"sample-link" + index}>
              <a href={sample} rel="noreferrer" target="_blank">
                {sample}
              </a>
              <a
                className="language-profile__remove-button icon-trash"
                onClick={() => handleRemoveSampleLink(index)}
              ></a>
            </div>
          ))}
        </div>
        <div>
          <input
            type="url"
            name="sampleUrl"
            className={`form-element__input ${isValidUrl ? "" : "INVALID"}`}
            onChange={(e) => handleSampleURLFieldChange(e)}
          />
          <Button
            href={sampleUrl}
            buttonModifiers="primary-function-content"
            openInNewTab="_blank"
            disabled={sampleUrl === ""}
          >
            {t("actions.test", { ns: "profile" })}
          </Button>
        </div>

        <Button buttonModifiers={["info"]} onClick={handleAddSampleLink}>
          Lisää linkki
        </Button>
      </div>
    </div>
  );
};

export default SkillLevel;
