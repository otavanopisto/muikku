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
import { LanguageCode } from "./components/language-profile-data-displayer";
import { StateType } from "~/reducers";
import { ActionType } from "~/actions";

const LanguageMapping = () => {
  const { t } = useTranslation("languageProfile");
  const dispatch = useDispatch();
  const { data } = useSelector((state: StateType) => state.languageProfile);
  const { languages } = useSelector(
    (state: StateType) => state.languageProfile.data
  );

  const languageLevelOptions: OptionDefault<LanguageLevels>[] = [
    { label: "A1.1", value: "A11" },
    { label: "A1.2", value: "A12" },
    { label: "A1.3", value: "A13" },
    { label: "A2.1", value: "A21" },
    { label: "A2.2", value: "A22" },
    { label: "B1.1", value: "B11" },
    { label: "B1.2", value: "B12" },
    { label: "B2.1", value: "B21" },
    { label: "C1.1", value: "C11" },
  ];

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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        posuere ligula rutrum, egestas nunc non, bibendum dolor. Praesent
        tristique quis purus eu fermentum. Vivamus et volutpat urna. Donec vel
        purus eu neque pulvinar porttitor at ac nisi. Aenean aliquam auctor
        arcu, ac tristique odio maximus at. Pellentesque habitant morbi
        tristique senectus et netus et malesuada fames ac turpis egestas. Cras
        ullamcorper lacinia metus nec molestie. Class aptent taciti sociosqu ad
        litora torquent per conubia nostra, per inceptos himenaeos. Cras
        scelerisque arcu vel consectetur sagittis. Integer et est a eros laoreet
        pretium sed ac orci. Aliquam sagittis ex id velit tincidunt, at laoreet
        odio placerat. Aenean dignissim tellus leo, a ultricies tortor euismod
        consequa
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
      <h1>Kielitaidon tasot</h1>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        posuere ligula rutrum, egestas nunc non, bibendum dolor. Praesent
        tristique quis purus eu fermentum. Vivamus et volutpat urna. Donec vel
        purus eu neque pulvinar porttitor at ac nisi. Aenean aliquam auctor
        arcu, ac tristique odio maximus at. Pellentesque habitant morbi
        tristique senectus et netus et malesuada fames ac turpis egestas. Cras
        ullamcorper lacinia metus nec molestie. Class aptent taciti sociosqu ad
        litora torquent per conubia nostra, per inceptos himenaeos. Cras
        scelerisque arcu vel consectetur sagittis. Integer et est a eros laoreet
        pretium sed ac orci. Aliquam sagittis ex id velit tincidunt, at laoreet
        odio placerat. Aenean dignissim tellus leo, a ultricies tortor euismod
        consequa
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
