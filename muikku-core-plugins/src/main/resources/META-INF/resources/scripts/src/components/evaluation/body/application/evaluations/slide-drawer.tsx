import * as React from "react";
import CKEditor from "~/components/general/ckeditor";
import { EvaluationGradeSystem } from "../../../../../@types/evaluation";

type DrawerType = "evaluation" | "supplementation" | "literal";

interface SlideDrawerProps {
  title: string;
  gradeSystem: EvaluationGradeSystem;
  drawerType: DrawerType;
  editorLabel?: string;
  modifiers?: string[];
  show?: boolean;
  onClose?: () => void;
}

const SlideDrawer: React.FC<SlideDrawerProps> = ({
  show,
  children,
  title,
  editorLabel,
  onClose,
  modifiers,
  gradeSystem,
  drawerType,
}) => {
  let drawerClasses = `side-drawer ${
    modifiers ? modifiers.map((m) => `side-drawer--${m}`).join(" ") : ""
  }`;

  if (show) {
    drawerClasses = `side-drawer ${
      modifiers ? modifiers.map((m) => `side-drawer--${m}`).join(" ") : ""
    } open`;
  }

  return (
    <section className={drawerClasses}>
      <header
        className={`eval-modal-editor-header ${
          modifiers
            ? modifiers.map((m) => `eval-modal-editor-header--${m}`).join(" ")
            : ""
        }`}
      >
        <div className="eval-modal-title">{title}</div>
        <div onClick={onClose} className="eval-modal-close arrow right"></div>
      </header>
      <div className="eval-modal-evaluate-workspace-content">
        <div className="editor">
          {editorLabel && (
            <label className="drawer-editor-label">{editorLabel}</label>
          )}
          <CKEditor onChange={(e) => console.log(e)}>Text</CKEditor>
        </div>
        {drawerType === "literal" && (
          <div className="evaluation-modal-evaluate-form-row--radios">
            <label className="evaluation__label">Arviointi</label>
            <div className="evaluation-input-radio-row">
              <div className="evaluation-input-radio">
                <input
                  type="radio"
                  name="assignmentGrading"
                  value="GRADED"
                  id="assignmentGradedButton"
                />
                <span>Arvosana</span>
              </div>
              <div className="evaluation-input-radio">
                <input
                  type="radio"
                  name="assignmentGrading"
                  value="INCOMPLETE"
                  id="assignmentIncompleteButton"
                />
                <span>Täydennettävä</span>
              </div>
            </div>
          </div>
        )}

        {drawerType !== "supplementation" && (
          <div className="evaluation-modal-evaluate-form-row--grade">
            <label className="evaluation__label">Arvosana</label>
            <select className="evaluation__select--grade">
              <optgroup label={gradeSystem.name}>
                {gradeSystem.grades.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        )}

        <div className="evaluation-modal-evaluate-form-row--buttons">
          <div
            className={`eval-modal-evaluate-button ${
              modifiers
                ? modifiers
                    .map((m) => `eval-modal-evaluate-button--${m}`)
                    .join(" ")
                : ""
            }`}
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
      </div>
    </section>
  );
};

export default SlideDrawer;
