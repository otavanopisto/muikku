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
import { lang } from "moment";

interface SkillLevelProps {
  language: LanguageProfileLanguage;
}

const SkillLevel = (props: SkillLevelProps) => {
  const { language } = props;
  const initialLanguageSkillLevel: CVLanguage = {
    code: language.code,
    description: "",
    interaction: 0,
    vocal: 0,
    writing: 0,
    reading: 0,
    listening: 0,
    general: "A11",
    samples: [],
  };

  const { t } = useTranslation("languageProfile");
  const dispatch = useDispatch();
  const { cv } = useSelector((state: StateType) => state.languageProfile.data);
  const [languageSkillLevel, setlanguageSkillLevel] =
    React.useState<CVLanguage>(initialLanguageSkillLevel);
  const [sampleUrl, setSampleUrl] = React.useState<string>("");

  // Create a ref to store the timeout ID
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const stars = [...Array(5).keys()];

  React.useEffect(() => {
    if (cv) {
      const currentLanguageSkillLevel = cv.languages.find(
        (l) => l.code === language.code
      );
      if (currentLanguageSkillLevel) {
        setlanguageSkillLevel(currentLanguageSkillLevel);
      }
    }
  }, [cv, language, languageSkillLevel]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    const updatedLanguageSkillLevel = {
      ...languageSkillLevel,
      [name]: value,
    };

    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevel,
    } as ActionType);

    setlanguageSkillLevel(updatedLanguageSkillLevel);
  };

  const handleRadioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    const updatedLanguageSkillLevel = {
      ...languageSkillLevel,
      [name]: value,
    };
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevel,
    } as ActionType);
    setlanguageSkillLevel(updatedLanguageSkillLevel);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    const updatedLanguageSkillLevel = {
      ...languageSkillLevel,
      [name]: value,
    };
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevel,
    } as ActionType);
    setlanguageSkillLevel(updatedLanguageSkillLevel);
  };

  const handleAddSampleLink = () => {
    const value = sampleUrl;
    const updatedLanguageSkillLevel = {
      ...languageSkillLevel,
      samples: [...languageSkillLevel.samples, value],
    };
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
      payload: updatedLanguageSkillLevel,
    } as ActionType);
    setlanguageSkillLevel(updatedLanguageSkillLevel);
  };

  // Debounced field change handler
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

  return (
    <form>
      <div>
        <h2>{language.name}</h2>
        <h3>Taitotaso</h3>
        <div>
          <div>
            <label id="interaction">Vuorovaikutus</label>
            {stars.map((star) => (
              <input
                type="radio"
                aria-labelledby="interaction"
                onChange={(e) => handleRadioInputChange(e)}
                name="interaction"
                key={"star-" + star}
                value={star}
              />
            ))}
          </div>
          <div>
            <label id="vocal">Suullinen tuottaminen</label>
            {stars.map((star) => (
              <input
                type="radio"
                name="vocal"
                aria-labelledby="vocal"
                onChange={(e) => handleRadioInputChange(e)}
                key={"star-" + star}
                value={star}
              />
            ))}
          </div>
          <div>
            <label id="writing">Kirjallinen tuottaminen</label>
            {stars.map((star) => (
              <input
                type="radio"
                name="writing"
                aria-labelledby="writing"
                onChange={(e) => handleRadioInputChange(e)}
                key={"star-" + star}
                value={star}
              />
            ))}
          </div>
          <div>
            <label id="reading">Luetun tulkitseminen</label>
            {stars.map((star) => (
              <input
                type="radio"
                name="reading"
                aria-labelledby="reading"
                onChange={(e) => handleRadioInputChange(e)}
                key={"star-" + star}
                value={star}
              />
            ))}
          </div>
          <div>
            <label id="listening">Kuullun tulkitseminen</label>
            {stars.map((star) => (
              <input
                type="radio"
                name="listening"
                aria-labelledby="listening"
                onChange={(e) => handleRadioInputChange(e)}
                key={"star-" + star}
                value={star}
              />
            ))}
          </div>
          <div>
            <label id="descriptionOfSkillLevel">Arvio kokonaistsosta</label>
            <select
              aria-labelledby="descriptionOfSkillLevel"
              defaultValue={languageSkillLevel?.general || ""}
              name="general"
              className="form-element__select"
              onChange={(e) => handleSelectChange(e)}
            >
              {languageLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <textarea
            aria-labelledby="descriptionOfSkillLevel"
            defaultValue={languageSkillLevel?.description || ""}
            className="form-element__textarea"
            name="description"
            onChange={(e) => handleTextAreaChange(e)}
          />
          {languageSkillLevel?.samples.map((sample, index) => (
            <div key={"sample-link" + index}>
              <label>{sample}</label>
            </div>
          ))}
          <input
            type="text"
            name="sampleUrl"
            onChange={(e) => handleSampleURLFieldChange(e)}
          />
          <Button buttonModifiers={["info"]} onClick={handleAddSampleLink}>
            Lisää linkki
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SkillLevel;
