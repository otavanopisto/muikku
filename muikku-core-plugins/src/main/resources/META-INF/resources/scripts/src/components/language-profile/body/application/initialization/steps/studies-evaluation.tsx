import * as React from "react";
import { useTranslation } from "react-i18next";
import DisplayLanguages from "./components/language-profile-data-displayer";
import AddBase from "./components/language-profile-add-item";
import { StateType } from "~/reducers";
import { ActionType } from "~/actions";
import { useDispatch, useSelector } from "react-redux";
import { LanguageData } from "~/@types/shared";

const AccomplishmentEvaluation = () => {
  const { t } = useTranslation("languageProfile");
  const dispatch = useDispatch();
  const { languages } = useSelector(
    (state: StateType) => state.languageProfile.data
  );
  const completedWorkspaces = [
    { identifier: "ai1", name: "ÄI1" },
    { identifier: "ai2", name: "ÄI2" },
    { identifier: "ai3", name: "ÄI3" },
  ];

  const accomplishmentEvaluationSelect = (
    code: string,
    cellId: string,
    index: number
  ) => (
    <input
      type="radio"
      onClick={handleAccomplishmentEvaluation}
      id={cellId}
      name={code}
      value={index + 1}
    />
  );

  const handleAccomplishmentEvaluation = () => {};

  /**
   * handleAddLanguage
   * @param language the language to add
   */
  const handleLanguageSubject = (subject: LanguageData) => {
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SUBJECTS",
      payload: {
        code: subject.code,
        value: subject.name,
      },
    } as ActionType);
  };

  return (
    <div>
      Oppiminen suoritetuilla opintojaksoilla
      {languages.map((language) => (
        <div key={language.code}>
          <DisplayLanguages
            key={language.code}
            rows={[
              { identifier: "ai1", name: "ÄI1", code: language.code },
              { identifier: "ai2", name: "ÄI2", code: language.code },
              { identifier: "ai3", name: "ÄI3", code: language.code },
            ]}
            cellAction={accomplishmentEvaluationSelect}
            labels={Array.from(Array(5).keys()).map((i) => (i + 1).toString())}
            title={language.name}
          />
          <AddBase
            allItems={completedWorkspaces}
            selectedItems={[]}
            action={handleLanguageSubject}
          />
        </div>
      ))}
    </div>
  );
};

export default AccomplishmentEvaluation;
