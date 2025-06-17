import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import DisplayLanguages from "./components/language-profile-data-displayer";
import Select from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import {
  LanguageLevels,
  SkillLevels,
} from "~/reducers/main-function/language-profile";
import { LanguageCode } from "~/@types/shared";
import { StateType } from "~/reducers";
import { ActionType } from "~/actions";
import { languageLevelOptions } from "~/mock/mock-data";

/**
 * LanguageMapping component
 * @returns JSX element that displays language mapping options
 */
const LanguageMapping = () => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const dispatch = useDispatch();
  const { data } = useSelector((state: StateType) => state.languageProfile);
  const { languages } = useSelector(
    (state: StateType) => state.languageProfile.data
  );

  const skillsOptions: OptionDefault<SkillLevels>[] = [
    {
      label: t("labels.languageSkillNative", {
        ns: "languageProfile",
      }),
      value: "N",
    },
    {
      label: t("labels.languageSkillExcellence", {
        ns: "languageProfile",
      }),
      value: "E",
    },
    {
      label: t("labels.languageSkillGood", {
        ns: "languageProfile",
      }),
      value: "H",
    },
    {
      label: t("labels.languageSkillMediocre", {
        ns: "languageProfile",
      }),
      value: "K",
    },
    {
      label: t("labels.languageSkillBeginger", {
        ns: "languageProfile",
      }),
      value: "V",
    },
  ];

  /**
   * @param value Language levels value
   * @param cellId The ID of the cell
   * @param code Language code
   */
  const handleLanguageLevelsSelectChange = (
    value: LanguageLevels,
    cellId: string,
    code: string
  ) => {
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGE_LEVELS",
      payload: {
        code,
        cellId,
        value,
      },
    } as ActionType);
  };

  /**
   * Generates a select component for language levels.
   * @param languageCode The code of the language.
   * @param cellId The ID of the cell to update.
   * @returns A Select component for choosing language levels.
   */
  const languageLevelsSelect = (languageCode: LanguageCode, cellId: string) => {
    const language = data.languages.find((lang) => lang.code === languageCode);
    const level = language?.levels?.find((lvl) => lvl[cellId]);
    const cellValue = level?.[cellId];

    const selectedValue = languageLevelOptions.find(
      (option) => option.value === cellValue
    );

    return (
      <Select
        className="react-select-override react-select-override--language-profile-form"
        classNamePrefix="react-select-override"
        value={selectedValue}
        onChange={(value) =>
          handleLanguageLevelsSelectChange(value.value, cellId, languageCode)
        }
        options={languageLevelOptions}
      />
    );
  };

  /**
   * skillsSelect
   * @param languageCode the code of the language
   * @param cellId the ID of the cell to update
   * @returns a JSX element representing a select input for skills
   */
  const skillsSelect = (languageCode: LanguageCode, cellId: string) => {
    const language = data.languages.find((lang) => lang.code === languageCode);
    const skills = language?.skills?.find((skill) => skill[cellId]);
    const cellValue = skills?.[cellId];

    const selectedValue = skillsOptions.find(
      (option) => option.value === cellValue
    );

    return (
      <Select
        className="react-select-override react-select-override--language-profile-form"
        classNamePrefix="react-select-override"
        value={selectedValue}
        onChange={(value) =>
          handleSkillsSelectChange(value.value, cellId, languageCode)
        }
        options={skillsOptions}
      />
    );
  };

  /**
   * handleSkillsSelectChange
   * @param value the selected skill level
   * @param cellId the ID of the cell to update
   * @param code the code of the language
   */
  const handleSkillsSelectChange = (
    value: SkillLevels,
    cellId: string,
    code: string
  ) => {
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_SKILL_LEVELS",
      payload: {
        code,
        cellId,
        value,
      },
    } as ActionType);
  };

  return (
    <div className="language-profile-container">
      <fieldset className="language-profile-container__fieldset">
        <legend className="language-profile-container__subheader">
          {t("labels.initializationStep2Title1", {
            ns: "languageProfile",
          })}
        </legend>
        <div className="language-profile-container__fieldset-description">
          {t("content.initializationStep2Description1", {
            ns: "languageProfile",
          })}
        </div>
        <div className="language-profile-container__row">
          <DisplayLanguages
            rows={languages}
            labels={[
              t("labels.languageSkillLevelInteractionLabel", {
                ns: "languageProfile",
              }),
              t("labels.languageSkillLevelinterpretationLabel", {
                ns: "languageProfile",
              }),
              t("labels.languageSkillLevelProduceLabel", {
                ns: "languageProfile",
              }),
            ]}
            cellAction={languageLevelsSelect}
          />
        </div>
      </fieldset>
      <fieldset className="language-profile-container__fieldset">
        <legend className="language-profile-container__subheader">
          {t("labels.initializationStep2Title2", {
            ns: "languageProfile",
          })}
        </legend>
        <div className="language-profile-container__fieldset-description">
          {t("content.initializationStep2Description2", {
            ns: "languageProfile",
          })}
        </div>
        <div className="language-profile-container__row">
          <DisplayLanguages
            rows={languages}
            labels={[
              t("labels.languageSkillByCategoryPronunciationLabel", {
                ns: "languageProfile",
              }),
              t("labels.languageSkillByCategoryGrammarLabel", {
                ns: "languageProfile",
              }),
              t("labels.languageSkillByCategoryVocabularyLabel", {
                ns: "languageProfile",
              }),
              t("labels.languageSkillByCategoryLanguageVariantsLabel", {
                ns: "languageProfile",
              }),
            ]}
            cellAction={skillsSelect}
          />
        </div>
      </fieldset>
    </div>
  );
};

export default LanguageMapping;
