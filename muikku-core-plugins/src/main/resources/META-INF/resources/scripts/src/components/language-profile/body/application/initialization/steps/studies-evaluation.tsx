import * as React from "react";
import { useTranslation } from "react-i18next";
import DisplayLanguages from "./components/language-profile-data-displayer";
import AddSubject from "./components/language-profile-add-item";
import { StateType } from "~/reducers";
import { ActionType } from "~/actions";
import { useDispatch, useSelector } from "react-redux";
import { LanguageData } from "~/@types/shared";
import { ALL_LANGUAGE_SUBJECTS } from "~/helper-functions/study-matrix";
import { LanguageProfileLanguage } from "~/reducers/main-function/language-profile";

/**
 * AccomplishmentEvaluation component
 * This component displays the accomplishment evaluation for each language
 * @returns JSX element that displays the accomplishment evaluation section
 */
const AccomplishmentEvaluation = () => {
  const { t } = useTranslation("languageProfile");
  const dispatch = useDispatch();
  const { languages } = useSelector(
    (state: StateType) => state.languageProfile.data
  );

  const languageSubjects: LanguageData[] = ALL_LANGUAGE_SUBJECTS.map(
    (subject) => ({
      identifier: subject.toLowerCase(),
      name: subject,
    })
  );

  /**
   * createRows
   * @param language the language profile language
   * @returns an array of rows for the DisplayLanguages component
   */
  const createRows = (language: LanguageProfileLanguage) => {
    const subjects = language.subjects || [];
    return subjects.map((subject, index) => ({
      identifier: language.code + index,
      name: subject.name,
      code: language.code,
    }));
  };
  /**
   * accomplishmentEvaluationSelect
   * @param code the language code
   * @param cellId the cell ID for the radio input
   * @param rowId the row ID for the radio input
   * @param index the index of the evaluation option
   * @returns a radio input for selecting an accomplishment evaluation
   */
  const accomplishmentEvaluationSelect = (
    code: string,
    cellId: string,
    rowId: string,
    index: number
  ) => {
    const isChecked = languages.some(
      (language) =>
        language.code === code &&
        language.subjects?.some(
          (subject) =>
            subject.name === rowId.substring(code.length) &&
            subject.value === (index + 1).toString()
        )
    );
    return (
      <input
        type="radio"
        checked={isChecked}
        onChange={(e) => handleAccomplishmentEvaluation(e, code)}
        name={rowId}
        value={(index + 1).toString()}
      />
    );
  };

  /**
   * handleAccomplishmentEvaluation
   * @param e event
   * @param code language code
   */
  const handleAccomplishmentEvaluation = (
    e: React.ChangeEvent<HTMLInputElement>,
    code: string
  ) => {
    // Extract subject name by removing language code from the beginning
    // Assuming rowId (e.target.name) is formatted as "codeSubjectName"
    // For example: "enreading" or "fi-writing"
    const subjectName = e.target.name.substring(code.length);

    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SUBJECTS",
      payload: {
        code: code,
        identifier: code + subjectName,
        name: subjectName,
        value: e.target.value,
      },
    } as ActionType);
  };

  /**
   * handleAddLanguage
   * @param subject the language to add
   */
  const handleAddLanguageSubject = (subject: LanguageData) => {
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SUBJECTS",
      payload: {
        code: subject.code,
        identifier: subject.code + subject.name,
        name: subject.name,
        value: "",
      },
    } as ActionType);
  };

  return (
    <div className="language-profile-container">
      <fieldset className="language-profile-container__fieldset">
        <legend className="language-profile-container__subheader">
          {t("labels.initializationStep3Title", {
            ns: "languageProfile",
          })}
        </legend>
        <div className="language-profile-container__fieldset-description">
          {t("content.initializationStep3Description", {
            ns: "languageProfile",
          })}
        </div>
        {languages.map((language) => {
          const languageSubjectsWithLanguageCode = languageSubjects.map(
            (workspace) => ({
              ...workspace,
              code: language.code,
            })
          );
          return (
            <div key={language.code}>
              <DisplayLanguages
                key={language.code}
                rows={createRows(language)}
                cellAction={accomplishmentEvaluationSelect}
                labels={Array.from(Array(5).keys()).map((i) =>
                  (i + 1).toString()
                )}
                title={language.name}
              />
              <AddSubject
                allItems={languageSubjectsWithLanguageCode}
                selectedItems={language.subjects || []}
                filterBy="name"
                action={handleAddLanguageSubject}
              />
            </div>
          );
        })}
      </fieldset>
    </div>
  );
};

export default AccomplishmentEvaluation;
