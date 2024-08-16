import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import { useMatriculationSubjects } from "../hooks/use-matriculation-subjects";
import { MatriculationSubjectCode } from "./matriculation-subject-type";

/**
 * MatriculationSubjectsListProps
 */
interface MatriculationSubjectsListProps {
  initialMatriculationSubjects?: string[];
  onMatriculationSubjectsChange?: (matriculationSubjects: string[]) => void;
}

/**
 * MatriculationSubjectsList
 * @param props props
 */
const MatriculationSubjectsList = (props: MatriculationSubjectsListProps) => {
  const { onMatriculationSubjectsChange } = props;

  const { t } = useTranslation(["hops", "studies", "guider", "common"]);

  const [selectedMatriculationSubjects, setSelectedMatriculationSubjects] =
    React.useState<string[]>(props.initialMatriculationSubjects || [""]);
  const { subjects, loading } = useMatriculationSubjects();

  if (loading) {
    return <div>Loading...</div>;
  }

  /**
   * Finds a matriculation subject name by subject value
   *
   * @param code matriculation subject code
   * @returns subject name or empty string if not found
   */
  const getMatriculationSubjectNameByCode = (code: MatriculationSubjectCode) =>
    t(`matriculationSubjects.${code}`, { ns: "hops" });

  /**
   * Method for notifying about matriculation subject changes
   *
   * Method filters out empty values from input array
   *
   * @param selectedSubjects selected subjects
   */
  const notifyMatriculationSubjectChange = (selectedSubjects: string[]) => {
    if (onMatriculationSubjectsChange) {
      onMatriculationSubjectsChange(
        selectedSubjects.filter((selectedSubject) => !!selectedSubject)
      );
    }
  };

  /**
   * Event handler for handling matriculation subject additions
   */
  const handleMatriculationSubjectAdd = () => {
    setSelectedMatriculationSubjects([...selectedMatriculationSubjects, ""]);
  };

  /**
   * Event handler for handling matriculation subject removals
   *
   * @param index index number
   */
  const handleMatriculationSubjectRemove =
    (index: number) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setSelectedMatriculationSubjects((selectedSubjects) => {
        const updatedSelectedSubjects = [...selectedSubjects];

        updatedSelectedSubjects.splice(index, 1);

        notifyMatriculationSubjectChange(updatedSelectedSubjects);
        return updatedSelectedSubjects;
      });
    };

  /**
   * Event handler for matriculation subject change
   *
   * @param index index
   */
  const handleMatriculationSubjectChange =
    (index: number) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;

      setSelectedMatriculationSubjects((selectedSubjects) => {
        const updateSelectedSubjects = [...selectedSubjects];

        updateSelectedSubjects[index] = value;

        notifyMatriculationSubjectChange(updateSelectedSubjects);
        return updateSelectedSubjects;
      });
    };

  const matriculationSubjectInputs = selectedMatriculationSubjects.map(
    (subject, index) => (
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
          value={subject}
          onChange={handleMatriculationSubjectChange(index)}
        >
          <option disabled value="">
            {t("labels.select", { ns: "hops" })}
          </option>
          {subjects.map((subject, index: number) => (
            <option key={index} value={subject.code}>
              {getMatriculationSubjectNameByCode(
                subject.code as MatriculationSubjectCode
              )}
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
          //value={subject}
          //onChange={this.handleMatriculationSubjectChange.bind(this, index)}
        >
          <option disabled value="">
            {t("labels.select", { ns: "hops" })}
          </option>

          <option key="Syksy2024" value="Syksy 2024">
            Syksy 2024
          </option>
          <option key="Kevät2025" value="Kevät 2025">
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
    )
  );

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

export default MatriculationSubjectsList;
