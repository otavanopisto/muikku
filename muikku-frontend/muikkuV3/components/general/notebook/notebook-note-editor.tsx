import * as React from "react";
import { useTranslation } from "react-i18next";
import CKEditor from "../ckeditor";
import { MATHJAXSRC } from "~/lib/mathjax";
import Button from "../button";

/* eslint-disable camelcase */
const ckEditorConfig = {
  autoGrow_onStartup: true,
  mathJaxLib: MATHJAXSRC,
  mathJaxClass: "math-tex",
  toolbar: [
    {
      name: "basicstyles",
      items: ["Bold", "Italic", "Underline", "RemoveFormat"],
    },
    { name: "clipboard", items: ["Cut", "Copy", "Paste", "Undo", "Redo"] },
    { name: "links", items: ["Link"] },
    {
      name: "insert",
      items: ["Smiley", "SpecialChar", "Muikku-mathjax"],
    },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "styles", items: ["Format"] },
    {
      name: "paragraph",
      items: [
        "NumberedList",
        "BulletedList",
        "Outdent",
        "Indent",
        "Blockquote",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
      ],
    },
    { name: "tools", items: ["Maximize"] },
  ],
  removePlugins: "image,exportpdf",
  extraPlugins: "image2,widget,lineutils,autogrow,muikku-mathjax,divarea",
  resize_enabled: true,
};
/* eslint-enable camelcase */

/**
 * NotebookNoteEditorProps
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
          <CKEditor
            onChange={setNoteContent}
            ancestorHeight={250}
            configuration={ckEditorConfig}
          >
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
