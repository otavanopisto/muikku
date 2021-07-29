import * as React from "react";
import CKEditor from "~/components/general/ckeditor";
import { EvaluationGradeSystem } from "../../../../../@types/evaluation";
import "~/sass/elements/evaluation.scss";

/**
 * AssignmentEditorProps
 */
interface AssignmentEditorProps {
  gradeSystem: EvaluationGradeSystem;
  editorLabel?: string;
  modifiers?: string[];
  onClose?: () => void;
}

/**
 * AssignmentEditor
 * @param param0
 * @returns
 */
const AssignmentEditor: React.FC<AssignmentEditorProps> = ({
  gradeSystem,
  modifiers,
  onClose,
}) => {
  const [literalEvaluation, setLiteralEvaluation] = React.useState("");
  const [assignmentEvaluationType, setassignmentEvaluationType] =
    React.useState("GRADED");
  const [grade, setGrade] = React.useState("4");

  /**
   * handleCKEditorChange
   * @param e
   */
  const handleCKEditorChange = (e: string) => {
    setLiteralEvaluation(e);
  };

  /**
   * handleAssignmentEvaluationChange
   * @param e
   */
  const handleAssignmentEvaluationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setassignmentEvaluationType(e.target.value);
  };

  /**
   * handleSelectGradeChange
   * @param e
   */
  const handleSelectGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.currentTarget.value);
  };

  return (
    <>
      <div className="editor">
        <label className="drawer-editor-label">
          Opintojakson sanallinen arviointi
        </label>

        <CKEditor onChange={handleCKEditorChange}>{literalEvaluation}</CKEditor>
      </div>

      <div className="evaluation-modal-evaluate-form-row--radios">
        <label className="evaluation__label">Arviointi</label>
        <div className="evaluation-input-radio-row">
          <div className="evaluation-input-radio">
            <input
              type="radio"
              name="assignmentEvaluationType"
              value="GRADED"
              checked={assignmentEvaluationType === "GRADED"}
              onChange={handleAssignmentEvaluationChange}
            />
            <span>Arvosana</span>
          </div>
          <div className="evaluation-input-radio">
            <input
              type="radio"
              name="assignmentEvaluationType"
              value="INCOMPLETE"
              checked={assignmentEvaluationType === "INCOMPLETE"}
              onChange={handleAssignmentEvaluationChange}
            />
            <span>Täydennettävä</span>
          </div>
        </div>
      </div>
      <div className="evaluation-modal-evaluate-form-row--grade">
        <label className="evaluation__label">Arvosana</label>
        <select
          className="evaluation__select--grade"
          value={grade}
          onChange={handleSelectGradeChange}
          disabled={assignmentEvaluationType === "INCOMPLETE"}
        >
          <optgroup label={gradeSystem.name}>
            {gradeSystem.grades.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="evaluation-modal-evaluate-form-row--buttons">
        <div
          className={`eval-modal-evaluate-button eval-modal-evaluate-button--literal`}
        >
          Tallenna
        </div>
        <div
          onClick={onClose}
          className="eval-modal-evaluate-button button-cancel"
        >
          Peruuta
        </div>
      </div>
    </>
  );
};

export default AssignmentEditor;
