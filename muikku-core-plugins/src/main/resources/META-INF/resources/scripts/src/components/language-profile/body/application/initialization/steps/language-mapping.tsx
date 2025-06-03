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
  const { t } = useTranslation("languageProfile");
  const dispatch = useDispatch();
  const { data } = useSelector((state: StateType) => state.languageProfile);
  const { languages } = useSelector(
    (state: StateType) => state.languageProfile.data
  );

  const skillsOptions: OptionDefault<SkillLevels>[] = [
    { label: "Natiivi", value: "N" },
    { label: "Erinomainen", value: "E" },
    { label: "Hyvä", value: "H" },
    { label: "Kohtalainen", value: "K" },
    { label: "Vasta-alkaja", value: "V" },
  ];

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
    <div>
      <h1>Kielitaidon tasot</h1>
      <div>
        Arvioi omaa kielitaitoasi alla olevan asteikon avulla. Pohdi
        kielitaitoasi eri osaamisalueiden kannalta, ja merkitse taulukkoon se
        taitotaso (esim. A2.1), jonka kuvaus vastaa mielestäsi parhaiten
        tämänhetkistä tilannettasi kunkin kielen kohdalla.
      </div>
      <DisplayLanguages
        rows={languages}
        labels={[
          "Taito toimia vuorovaikutuksessa",
          "Taito tulkita tekstejä",
          "Taito tuottaa tekstejä",
        ]}
        cellAction={languageLevelsSelect}
      />
      <h1>Taidot osa-alueittain</h1>
      <div>
        Kuinka kuvailisit taitojasi eri kielissä ääntämisen, kieliopin, sanaston
        ja kielellisten varianttien suhteen?
      </div>
      <DisplayLanguages
        rows={languages}
        labels={["Ääntäminen", "Kielioppi", "Sanasto", "Variantit"]}
        cellAction={skillsSelect}
      />
    </div>
  );
};

export default LanguageMapping;
