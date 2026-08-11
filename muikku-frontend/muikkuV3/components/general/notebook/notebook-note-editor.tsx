import * as React from "react";
import { useTranslation } from "react-i18next";
import CKEditor from "../ckeditor";
import { ckEditorConfig } from "./helpers/notebook-editor";
import Button from "../button";

/**
 * Props for the NotebookNoteEditor component.
 */
export interface NotebookNoteEditorProps {
  mode: "create" | "edit";
  initialTitle?: string;
  initialText?: string;
  onSave: (title: string, text: string) => void;
  onCancel: () => void;
}

/**
 * Local-state notebook editor (one instance per mount).
 * @param props props
 * @returns React.ReactNode
 */
const NotebookNoteEditor = (props: NotebookNoteEditorProps) => {
  const { mode, initialTitle = "", initialText = "", onSave, onCancel } = props;
  const { t } = useTranslation(["notebook", "common"]);

  const [noteTitle, setNoteTitle] = React.useState(initialTitle);
  const [noteContent, setNoteContent] = React.useState(initialText);

  React.useEffect(() => {
    setNoteTitle(initialTitle);
    setNoteContent(initialText);
  }, [initialTitle, initialText, mode]);

  /**
   * handleSave
   */
  const handleSave = () => {
    onSave(noteTitle, noteContent);
  };

  return (
    <div className="notebook__note-editor form">
      <div className="form__row">
        <div className="form-element">
          <label htmlFor={`notebook-note-editor-title-${mode}`}>
            {t("labels.title", { ns: "common" })}
          </label>
          <input
            className="form-element__input form-element__input--note-title"
            id={`notebook-note-editor-title-${mode}`}
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
        </div>
      </div>

      <div className="form__row">
        <div className="form-element">
          <label>{t("labels.content", { ns: "common" })}</label>
          <CKEditor onChange={setNoteContent} configuration={ckEditorConfig}>
            {noteContent}
          </CKEditor>
        </div>
      </div>

      <div className="form__buttons form__buttons--notebook">
        <Button className="button button--dialog-execute" onClick={handleSave}>
          {t("actions.save", { ns: "common" })}
        </Button>
        <Button buttonModifiers="dialog-cancel" onClick={onCancel}>
          {t("actions.cancel", { ns: "common" })}
        </Button>
      </div>
    </div>
  );
};

export default NotebookNoteEditor;
