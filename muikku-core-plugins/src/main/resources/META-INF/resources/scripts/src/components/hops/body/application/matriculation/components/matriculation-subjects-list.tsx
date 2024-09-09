import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import Button from "~/components/general/button";
import {
  MatriculationExamTerm,
  MatriculationSubject,
} from "~/generated/client";
import { getNextTermsOptionsByDate } from "~/helper-functions/matriculation-functions";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import { MatriculationSubjectCode } from "./matriculation-subject-type";

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
  "GE",
  "HI",
  "KE",
  "TE",
  "UE",
  "UO",
  "YH",
];

/**
 * MatriculationSubjectsListProps
 */
interface MatriculationSubjectsListProps {
  status: StatusType;
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
  const { onSubjectsChange, selectedSubjects, subjects, status, disabled } =
    props;
  const [selectedSubjects2, setSelectedSubjects2] =
    React.useState<SelectedMatriculationSubject[]>(selectedSubjects);

  const { t } = useTranslation(["hops_new", "studies", "guider", "common"]);

  /**
   * Finds a matriculation subject name by subject value
   *
   * @param code matriculation subject code
   * @returns subject name or empty string if not found
   */
  const getMatriculationSubjectNameByCode = (code: MatriculationSubjectCode) =>
    t(`matriculationSubjectsYTL.${code}`, { ns: "hops_new" });

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
    onSubjectsChange(selectedSubjects.filter((s) => s.subjectCode));
  };

  /**
   * Event handler for handling matriculation subject additions
   */
  const handleMatriculationSubjectAdd = () => {
    const updatedList = [...selectedSubjects2, { subjectCode: "", term: "" }];
    setSelectedSubjects2(updatedList);
  };

  /**
   * Event handler for handling matriculation subject removals
   *
   * @param index index number
   */
  const handleMatriculationSubjectRemove =
    (index: number) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const updatedList = [...selectedSubjects2];
      updatedList.splice(index, 1);
      notifyMatriculationSubjectChange(updatedList);
      setSelectedSubjects2(updatedList);
    };

  /**
   * Event handler for matriculation subject change
   *
   * @param index index
   */
  const handleMatriculationSubjectChange =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      const updatedList = [...selectedSubjects2];
      updatedList[index].subjectCode = value;
      notifyMatriculationSubjectChange(updatedList);
      setSelectedSubjects2(updatedList);
    };

  /**
   * Event handler for matriculation subject term change
   *
   * @param index index
   */
  const handleMatriculationSubjectTermChange =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      const updatedList = [...selectedSubjects2];
      updatedList[index].term = value;
      notifyMatriculationSubjectChange(updatedList);
      setSelectedSubjects2(updatedList);
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

  const generalStudyOptions = subjects
    .filter((s) => GENERAL_STUDIES_SUBJECTS.includes(s.subjectCode))
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code as MatriculationSubjectCode)}
      </option>
    ));

  const mathOptions = subjects
    .filter((s) => MATHEMATIC_SUBJECTS.includes(s.subjectCode))
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code as MatriculationSubjectCode)}
      </option>
    ));

  const finnishOptions = subjects
    .filter((s) => FINNISH_LANUGAGES.includes(s.subjectCode))
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code as MatriculationSubjectCode)}
      </option>
    ));

  const secondFinnishOptions = subjects
    .filter((s) => SECOND_FINNISH_LANGUAGES.includes(s.subjectCode))
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code as MatriculationSubjectCode)}
      </option>
    ));

  const foreignLanguageOptions = subjects
    .filter((s) => FOREIGN_LANGUAGES.includes(s.subjectCode))
    .map((s) => (
      <option key={s.code} value={s.code}>
        {getMatriculationSubjectNameByCode(s.code as MatriculationSubjectCode)}
      </option>
    ));

  const termOptions = getNextTermsOptionsByDate(
    status.profile.studyStartDate,
    t
  );

  const matriculationSubjectInputs = selectedSubjects2.map((subject, index) => (
    <div className="form-element__dropdown-selection-container" key={index}>
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
            label={t("label.matriculationPlanGeneralStudies", {
              ns: "hops_new",
            })}
          >
            {generalStudyOptions}
          </optgroup>
        )}
        {mathOptions.length > 0 && (
          <optgroup
            label={t("label.matriculationPlanMath", {
              ns: "hops_new",
            })}
          >
            {mathOptions}
          </optgroup>
        )}
        {finnishOptions.length > 0 && (
          <optgroup
            label={t("label.matriculationPlanNativeLng", {
              ns: "hops_new",
            })}
          >
            {finnishOptions}
          </optgroup>
        )}
        {secondFinnishOptions.length > 0 && (
          <optgroup
            label={t("label.matriculationPlanNativeSecondLng", {
              ns: "hops_new",
            })}
          >
            {secondFinnishOptions}
          </optgroup>
        )}
        {foreignLanguageOptions.length > 0 && (
          <optgroup
            label={t("label.matriculationPlanForeignLanguages", {
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
        <Button
          buttonModifiers={["primary-function-content", "remove-subject-row"]}
          onClick={handleMatriculationSubjectRemove(index)}
        >
          {t("actions.remove")}
        </Button>
      )}
    </div>
  ));

  return (
    <div className="form-element">
      {matriculationSubjectInputs}
      {!disabled && (
        <div className="form__buttons">
          <Button
            buttonModifiers={["primary-function-content", "add-subject-row"]}
            onClick={handleMatriculationSubjectAdd}
          >
            {t("actions.addSubject", { ns: "studies" })}
          </Button>
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
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(MatriculationSubjectsList));
