import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { MatriculationSubjectCode } from "./matriculation-subject-type";

/**
 * MatriculationSubjectsListProps
 */
interface MatriculationSubjectsListProps {
  subjects: MatriculationSubjectCode[];
  selectedSubjects: SelectedMatriculationSubject[];
  /**
   * onSubjectsChange
   * @param matriculationSubjects matriculationSubjects
   * @param save Whether to save the changes
   */
  onSubjectsChange?: (
    selectedSubjects: SelectedMatriculationSubject[],
    toSave: boolean
  ) => void;
}

/**
 * SelectedMatriculationSubject
 */
export interface SelectedMatriculationSubject {
  subjectCode?: string;
  term?: string;
}

/**
 * MatriculationSubjectsList
 * @param props props
 */
const MatriculationSubjectsList = (props: MatriculationSubjectsListProps) => {
  const { onSubjectsChange, selectedSubjects, subjects } = props;

  const { t } = useTranslation(["hops", "studies", "guider", "common"]);

  /**
   * Finds a matriculation subject name by subject value
   *
   * @param code matriculation subject code
   * @returns subject name or empty string if not found
   */
  const getMatriculationSubjectNameByCode = (code: MatriculationSubjectCode) =>
    t(`matriculationSubjects.${code}`, { ns: "hops" });

  /**
   * Event handler for handling matriculation subject additions
   */
  const handleMatriculationSubjectAdd = () => {
    if (!onSubjectsChange) {
      return;
    }

    const updatedList = [...selectedSubjects, { subjectCode: "", term: "" }];
    onSubjectsChange(updatedList, false);
  };

  /**
   * Event handler for handling matriculation subject removals
   *
   * @param index index number
   */
  const handleMatriculationSubjectRemove =
    (index: number) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (!onSubjectsChange) {
        return;
      }
      const updatedList = [...selectedSubjects];
      updatedList.splice(index, 1);
      onSubjectsChange(updatedList, true);
    };

  /**
   * Event handler for matriculation subject change
   *
   * @param index index
   */
  const handleMatriculationSubjectChange =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!onSubjectsChange) {
        return;
      }
      const { value } = e.target;
      const updatedList = [...selectedSubjects];
      updatedList[index].subjectCode = value;
      onSubjectsChange(updatedList, true);
    };

  /**
   * Event handler for matriculation subject term change
   *
   * @param index index
   */
  const handleMatriculationSubjectTermChange =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!onSubjectsChange) {
        return;
      }
      const { value } = e.target;
      const updatedList = [...selectedSubjects];
      updatedList[index].term = value;
      onSubjectsChange(updatedList, true);
    };

  const matriculationSubjectInputs = selectedSubjects.map((subject, index) => (
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
      >
        <option disabled value="">
          {t("labels.select", { ns: "hops" })}
        </option>
        {subjects.map((s) => (
          <option key={s} value={s}>
            {getMatriculationSubjectNameByCode(s)}
          </option>
        ))}
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
      >
        <option disabled value="">
          {t("labels.select", { ns: "hops" })}
        </option>

        <option key="Syksy2024" value="AUTUMN2024">
          Syksy 2024
        </option>
        <option key="Kevät2025" value="SPRING2025">
          Kevät 2025
        </option>
      </select>
      <Button
        buttonModifiers={["primary-function-content", "remove-subject-row"]}
        onClick={handleMatriculationSubjectRemove(index)}
      >
        {t("actions.remove")}
      </Button>
    </div>
  ));

  return (
    <div className="form-element">
      {matriculationSubjectInputs}
      <div className="form__buttons">
        <Button
          buttonModifiers={["primary-function-content", "add-subject-row"]}
          onClick={handleMatriculationSubjectAdd}
        >
          {t("actions.addSubject", { ns: "studies" })}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(MatriculationSubjectsList);
