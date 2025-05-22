import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import { useHopsBasicInfo } from "~/context/hops-basic-info-context";
import {
  MatriculationExamTerm,
  MatriculationSubject,
} from "~/generated/client";
import { getNextTermsOptionsByDate } from "~/helper-functions/matriculation-functions";
import { StateType } from "~/reducers";
import { AppDispatch } from "~/reducers/configureStore";

const FINNISH_LANUGAGES = ["ÄI", "S2"];

const SECOND_FINNISH_LANGUAGES = ["RUA", "RUB1"];

const FOREIGN_LANGUAGES = [
  "ENA",
  "ENB3",
  "RAA",
  "RAB3",
  "POB3",
  "LAB3",
  "EAA",
  "EAB3",
  "SAA",
  "SAB3",
  "IAB3",
  "SMB3",
  "VEA",
  "VEB3",
];

const MATHEMATIC_SUBJECTS = ["MAA", "MAB"];

const GENERAL_STUDIES_SUBJECTS = [
  "BI",
  "ET",
  "FI",
  "FY",
  "HI",
  "KE",
  "GE",
  "TE",
  "UE",
  "UO",
  "YH",
  "PS",
];

/**
 * MatriculationSubjectsListProps
 */
interface MatriculationSubjectsListProps {
  disabled: boolean;
  subjects: MatriculationSubject[];
  selectedSubjects: SelectedMatriculationSubject[];
  /**
   * onSubjectsChange
   * @param matriculationSubjects matriculationSubjects
   * @param save Whether to save the changes
   */
  onSubjectsChange?: (selectedSubjects: SelectedMatriculationSubject[]) => void;
}

/**
 * SelectedMatriculationSubject
 */
export interface SelectedMatriculationSubject {
  subjectCode?: string;
  term?: string;
}

/**
 * MatriculationSubjectsList.
 * Has internal state for selected subjects that is initialized once.
 * Notifies parent component about changes in selected subjects that have all values set.
 * @param props props
 */
const MatriculationSubjectsList = (props: MatriculationSubjectsListProps) => {
  const { onSubjectsChange, selectedSubjects, subjects, disabled } = props;

  const { studentInfo } = useHopsBasicInfo();

  const { t } = useTranslation(["hops_new", "studies", "guider", "common"]);

  /**
   * Finds a matriculation subject name by subject value
   *
   * @param code matriculation subject code
   * @returns subject name or empty string if not found
   */
  const getMatriculationSubjectNameByCode = (code: string) =>
    t(`matriculationSubjectsYTL.${code}`, {
      ns: "hops_new",
      defaultValue: code,
    });

  /**
   * Finds a matriculation term name by term value
   *
   * @param term matriculation subject code
   * @param year terms year
   * @returns subject name or empty string if not found
   */
  const getMatriculationTermNameByCode = (
    term: MatriculationExamTerm,
    year: number
  ) => t(`matriculationTerms.${term}`, { ns: "hops_new", year: year });

  /**
   * Method for notifying about matriculation subject changes
   * @param selectedSubjects selected subjects
   */
  const notifyMatriculationSubjectChange = (
    selectedSubjects: SelectedMatriculationSubject[]
  ) => {
    if (!onSubjectsChange) {
      return;
    }
    // Filter out empty values from input array
    onSubjectsChange(selectedSubjects);
  };

  /**
   * Event handler for handling matriculation subject additions
   */
  const handleMatriculationSubjectAdd = () => {
    const updatedList = [...selectedSubjects, { subjectCode: "", term: "" }];
    notifyMatriculationSubjectChange(updatedList);
  };

  /**
   * Event handler for handling matriculation subject removals
   *
   * @param index index number
   */
  const handleMatriculationSubjectRemove =
    (index: number) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const updatedList = [...selectedSubjects];
      updatedList.splice(index, 1);
      notifyMatriculationSubjectChange(updatedList);
    };

  /**
   * Event handler for matriculation subject change
   *
   * @param index index
   */
  const handleMatriculationSubjectChange =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      const updatedList = [...selectedSubjects];
      updatedList[index].subjectCode = value;
      notifyMatriculationSubjectChange(updatedList);
    };

  /**
   * Event handler for matriculation subject term change
   *
   * @param index index
   */
  const handleMatriculationSubjectTermChange =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      const updatedList = [...selectedSubjects];
      updatedList[index].term = value;
      notifyMatriculationSubjectChange(updatedList);
    };

  /**
   * Gets option for term by given term value
   *
   * @param termValue termValue AUTUMN2022 or SPRING2022 etc...
   * @returns JSX.Element
   */
  const getOptionByValue = (termValue: string) => {
    const term = termValue.substring(0, 6) as MatriculationExamTerm;
    const year = parseInt(termValue.substring(6));

    const optionTitle = getMatriculationTermNameByCode(term, year);

    return (
      <option disabled value={termValue}>
        {optionTitle}
      </option>
    );
  };

  // Subject options by groups

  // General studies, also sorted subject name
  const generalStudyOptions = subjects
    .filter((s) => GENERAL_STUDIES_SUBJECTS.includes(s.subjectCode))
    .sort((a, b) => {
      // Note that we need to cast the name to string because the type of the name is that is returned
      // by the getMatriculationSubjectNameByCode function (i18next t function) is never
      const aName = getMatriculationSubjectNameByCode(a.code) as string;
      const bName = getMatriculationSubjectNameByCode(b.code) as string;
      return aName.localeCompare(bName);
    })
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code)}
      </option>
    ));

  const mathOptions = subjects
    .filter((s) => MATHEMATIC_SUBJECTS.includes(s.subjectCode))
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code)}
      </option>
    ));

  const finnishOptions = subjects
    .filter((s) => FINNISH_LANUGAGES.includes(s.subjectCode))
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code)}
      </option>
    ));

  const secondFinnishOptions = subjects
    .filter((s) => SECOND_FINNISH_LANGUAGES.includes(s.subjectCode))
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code)}
      </option>
    ));

  const foreignLanguageOptions = subjects
    .filter((s) => FOREIGN_LANGUAGES.includes(s.subjectCode))
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code)}
      </option>
    ));

  const termOptions = getNextTermsOptionsByDate(studentInfo.studyStartDate, t);

  const matriculationSubjectInputs = selectedSubjects.map((subject, index) => (
    <div className="form__row" key={index}>
      <div className="form-element__dropdown-selection-container form-element__dropdown-selection-container--nowrap">
        <label
          htmlFor={`matriculationSubject` + index}
          className="visually-hidden"
        >
          {t("wcag.select", { ns: "guider" })}
        </label>
        <select
          id={`matriculationSubject` + index}
          className="form-element__select form-element__select--matriculation-exam"
          value={subject.subjectCode || ""}
          onChange={handleMatriculationSubjectChange(index)}
          disabled={disabled}
        >
          <option disabled value="">
            {t("labels.select", { ns: "hops" })}
          </option>

          {generalStudyOptions.length > 0 && (
            <optgroup
              label={t("labels.matriculationPlanGeneralStudies", {
                ns: "hops_new",
              })}
            >
              {generalStudyOptions}
            </optgroup>
          )}
          {mathOptions.length > 0 && (
            <optgroup
              label={t("labels.matriculationPlanMath", {
                ns: "hops_new",
              })}
            >
              {mathOptions}
            </optgroup>
          )}
          {finnishOptions.length > 0 && (
            <optgroup
              label={t("labels.matriculationPlanNativeLng", {
                ns: "hops_new",
              })}
            >
              {finnishOptions}
            </optgroup>
          )}
          {secondFinnishOptions.length > 0 && (
            <optgroup
              label={t("labels.matriculationPlanNativeSecondLng", {
                ns: "hops_new",
              })}
            >
              {secondFinnishOptions}
            </optgroup>
          )}
          {foreignLanguageOptions.length > 0 && (
            <optgroup
              label={t("labels.matriculationPlanForeignLanguages", {
                ns: "hops_new",
              })}
            >
              {foreignLanguageOptions}
            </optgroup>
          )}
        </select>
        <label
          htmlFor={`matriculationSubject` + index}
          className="visually-hidden"
        >
          {t("wcag.select", { ns: "guider" })}
        </label>
        <select
          id={`matriculationSubject` + index}
          className="form-element__select form-element__select--matriculation-exam"
          value={subject.term || ""}
          onChange={handleMatriculationSubjectTermChange(index)}
          disabled={disabled}
        >
          <option disabled value="">
            {t("labels.select", { ns: "hops" })}
          </option>

          {!disabled ? termOptions : getOptionByValue(subject.term)}
        </select>

        {!disabled && (
          <>
            <label
              id="removeMatriculationRowLabelSubject"
              className="visually-hidden"
            >
              {t("actions.remove")}
            </label>
            <Button
              buttonModifiers={["button-has-icon", "remove-extra-row"]}
              onClick={handleMatriculationSubjectRemove(index)}
              icon="trash"
              aria-labelledby="removeMatriculationRowLabelSubject"
            ></Button>
          </>
        )}
      </div>
    </div>
  ));

  return (
    <div className="form-element">
      {matriculationSubjectInputs}
      {!disabled && (
        <div className="form__row">
          <div className="form__buttons">
            <Button
              buttonModifiers={["button-has-icon", "add-extra-row"]}
              onClick={handleMatriculationSubjectAdd}
              icon="plus"
            >
              {t("actions.addSubject", { ns: "studies" })}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(MatriculationSubjectsList));
