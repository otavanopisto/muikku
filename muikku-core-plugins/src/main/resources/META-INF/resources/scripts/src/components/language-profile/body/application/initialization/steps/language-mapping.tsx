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

export const levelMap: Record<number, string> = {
  0: "interaction",
  1: "interpretation",
  2: "production",
};

export const skillMap: Record<number, string> = {
  0: "pronounciation",
  1: "grammar",
  2: "vocabulary",
  3: "variants",
};

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
      label: t("skills.n", {
        ns: "languageProfile",
      }),
      value: "N",
    },
    {
      label: t("skills.e", {
        ns: "languageProfile",
      }),
      value: "E",
    },
    {
      label: t("skills.h", {
        ns: "languageProfile",
      }),
      value: "H",
    },
    {
      label: t("skills.k", {
        ns: "languageProfile",
      }),
      value: "K",
    },
    {
      label: t("skills.v", {
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
        onChange={(option) =>
          handleSkillsSelectChange(option.value, cellId, languageCode)
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
        <div className="language-profile-container__fieldset-description">
          <a
            href="https://www.oph.fi/fi/koulutus-ja-tutkinnot/kehittyvan-kielitaidon-tasojen-kuvausasteikko"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            {t("content.initializationStep2Link1", {
              ns: "languageProfile",
            })}
            <span className="visually-hidden">
              {t("wcag.externalLink", {
                ns: "common",
              })}
            </span>
            <span className="external-link-indicator icon-external-link"></span>
          </a>
        </div>
        <div className="language-profile-container__row">
          <DisplayLanguages
            rows={languages}
            // Could be created with a for loop
            labels={[
              t("labels.languageSkillLevel", {
                ns: "languageProfile",
                context: levelMap[0],
              }),
              t("labels.languageSkillLevel", {
                ns: "languageProfile",
                context: levelMap[1],
              }),
              t("labels.languageSkillLevel", {
                ns: "languageProfile",
                context: levelMap[2],
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

        <div className="language-profile-container__fieldset-description">
          <details className="details details--language-profile">
            <summary className="details__summary">
              {t("labels.languageSkillByCategoryPronunciationLabel", {
                ns: "languageProfile",
              })}
            </summary>
            <div className="details__content">
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryNative",
                    { ns: "languageProfile" }
                  ),
                }}
              />

              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryExcellence",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryGood",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryMediocre",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryBeginger",
                    { ns: "languageProfile" }
                  ),
                }}
              />
            </div>
          </details>

          <details className="details details--language-profile">
            <summary className="details__summary">
              {t("labels.languageSkillByCategoryGrammarLabel", {
                ns: "languageProfile",
              })}
            </summary>
            <div className="details__content">
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryNative",
                    { ns: "languageProfile" }
                  ),
                }}
              />

              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryExcellence",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryGood",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryMediocre",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryBeginger",
                    { ns: "languageProfile" }
                  ),
                }}
              />
            </div>
          </details>

          <details className="details details--language-profile">
            <summary className="details__summary">
              {t("labels.languageSkillByCategoryVocabularyLabel", {
                ns: "languageProfile",
              })}
            </summary>
            <div className="details__content">
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryNative",
                    { ns: "languageProfile" }
                  ),
                }}
              />

              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryExcellence",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryGood",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryMediocre",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryBeginger",
                    { ns: "languageProfile" }
                  ),
                }}
              />
            </div>
          </details>

          <details className="details details--language-profile">
            <summary className="details__summary">
              {t("labels.languageSkillByCategoryLanguageVariantsLabel", {
                ns: "languageProfile",
              })}
            </summary>
            <div className="details__content">
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryNative",
                    { ns: "languageProfile" }
                  ),
                }}
              />

              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryExcellence",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryGood",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryMediocre",
                    { ns: "languageProfile" }
                  ),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    "content.initializationLanguageSkillByCategoryBeginger",
                    { ns: "languageProfile" }
                  ),
                }}
              />
            </div>
          </details>
        </div>

        <div className="language-profile-container__fieldset-description language-profile-container__fieldset-description--table-legend">
          {t("content.initializationStep2Description3", {
            ns: "languageProfile",
          })}
        </div>
        <DisplayLanguages
          rows={languages}
          labels={[
            t("labels.skill", {
              ns: "languageProfile",
              context: skillMap[0],
            }),
            t("labels.skill", {
              ns: "languageProfile",
              context: skillMap[1],
            }),
            t("labels.skill", {
              ns: "languageProfile",
              context: skillMap[2],
            }),
            t("labels.skill", {
              ns: "languageProfile",
              context: skillMap[3],
            }),
          ]}
          cellAction={skillsSelect}
        />
      </fieldset>
    </div>
  );
};

export default LanguageMapping;
