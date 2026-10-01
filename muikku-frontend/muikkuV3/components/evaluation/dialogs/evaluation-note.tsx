import * as React from "react";
import { useTranslation } from "react-i18next";
import Link from "~/components/general/link";
import {
  EvaluationAssessmentRequest,
  EvaluationNote,
} from "~/generated/client";
import { useEvaluationNotes } from "../hooks/useEvaluationNotes";
import CkeditorContentLoader from "~/components/base/ckeditor-loader/content";
import Dialog from "~/components/general/dialog";
import CKEditor from "~/components/general/ckeditor";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { CKEditorConfig } from "../helper";
import { localize } from "~/locales/i18n";

/**
 * Evaluation note dialog props
 */
interface EvaluationNoteDialogProps {
  evaluationAssessmentRequest: EvaluationAssessmentRequest;
  children: React.ReactElement;
}

/**
 * Evaluation note dialog
 * @param props Props
 * @returns Evaluation note dialog
 */
const EvaluationNoteDialog: React.FC<EvaluationNoteDialogProps> = (props) => {
  const { evaluationAssessmentRequest, children } = props;
  const { t } = useTranslation(["evaluation", "common"]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [mode, setMode] = React.useState<
    "readonly" | "edit" | "new" | "delete"
  >("readonly");

  const { firstNote, isLoading, isSaving, createNote, updateNote, deleteNote } =
    useEvaluationNotes({
      userEntityId: evaluationAssessmentRequest.userEntityId,
      workspaceEntityId: evaluationAssessmentRequest.workspaceEntityId,
      enabled: isOpen,
    });

  /**
   * Handle open
   */
  const handleOpen = () => {
    setMode("readonly");
    setIsOpen(true);
  };

  /**
   * Handle close
   */
  const handleClose = () => {
    setIsOpen(false);
    setMode("readonly");
  };

  /**
   * Get content
   * @returns Content
   */
  const content = () => {
    if (isLoading) {
      return <div className="evaluation-note__loader empty-loader" />;
    }
    switch (mode) {
      case "edit":
      case "new":
        return (
          <EvaluationNoteDialogEditor
            key={mode}
            mode={mode}
            evaluationNote={mode === "edit" ? firstNote : undefined}
            locked={isSaving}
            onSave={async (noteText) => {
              if (mode === "new") await createNote(noteText);
              else if (firstNote) await updateNote(firstNote, noteText);
              setMode("readonly");
            }}
            onCancel={() => setMode("readonly")}
          />
        );
      case "delete":
        return (
          <EvaluationNoteDeleteView
            locked={isSaving}
            onConfirm={async () => {
              if (!firstNote) return;
              await deleteNote(firstNote.id);
              setMode("readonly");
            }}
            onCancel={() => setMode("readonly")}
          />
        );
      default:
        return firstNote ? (
          <EvaluationNoteReadonlyView
            note={firstNote}
            onEdit={() => setMode("edit")}
            onDelete={() => setMode("delete")}
          />
        ) : (
          <EvaluationNoteEmptyView onAdd={() => setMode("new")} />
        );
    }
  };

  return (
    <Dialog
      modifier="evaluation-note"
      title={t("labels.evaluationNote", { ns: "evaluation" })}
      content={content}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      {children}
    </Dialog>
  );
};

/**
 * Evaluation note dialog editor props
 */
interface EvaluationNoteDialogEditorProps {
  mode: "edit" | "new";
  evaluationNote?: EvaluationNote;
  locked: boolean;
  onSave: (noteText: string) => Promise<void>;
  onCancel: () => void;
}

/**
 * Evaluation note dialog editor
 * @param props Props
 * @returns Evaluation note dialog editor
 */
const EvaluationNoteDialogEditor: React.FC<EvaluationNoteDialogEditorProps> = (
  props
) => {
  const { mode, evaluationNote, locked, onSave, onCancel } = props;
  const { t } = useTranslation(["evaluation", "common"]);
  const locale = useSelector((state: StateType) => state.locales.current);
  const [noteText, setNoteText] = React.useState(
    mode === "edit" ? (evaluationNote?.note ?? "") : ""
  );

  /**
   *
   */
  const handleSaveClick = async () => {
    try {
      await onSave(noteText);
    } catch {
      // Hook already shows the notification; stay in edit/new
    }
  };
  return (
    <div className="evaluation-note evaluation-note--editor">
      <div className="form" role="form">
        <div className="form__row">
          <div className="form-element">
            <label>{t("labels.content")}</label>
            <CKEditor
              onChange={setNoteText}
              configuration={{
                ...CKEditorConfig(locale),
                height: 240,
              }}
            >
              {noteText}
            </CKEditor>
          </div>
        </div>
      </div>
      <div className="form__buttons form__buttons--evaluation-note">
        <Button
          buttonModifiers="dialog-execute"
          onClick={handleSaveClick}
          disabled={locked}
        >
          {t("actions.save")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={onCancel}
          disabled={locked}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    </div>
  );
};

/**
 * Evaluation note empty view props
 */
interface EvaluationNoteEmptyViewProps {
  onAdd: () => void;
}
/**
 * Evaluation note empty view
 * @param props props
 * @returns Evaluation note empty view
 */
const EvaluationNoteEmptyView: React.FC<EvaluationNoteEmptyViewProps> = (
  props
) => {
  const { onAdd } = props;
  const { t } = useTranslation(["evaluation", "common"]);
  return (
    <div className="evaluation-note">
      <div className="evaluation-note__body">
        <p>
          {t("content.empty", {
            ns: "evaluation",
            context: "evaluationNote",
          })}
        </p>
      </div>
      <div className="evaluation-note__actions">
        <Link className="evaluation-note__link" onClick={onAdd}>
          {t("actions.addEvaluationNote", { ns: "evaluation" })}
        </Link>
      </div>
    </div>
  );
};

/**
 * Evaluation note readonly view props
 */
interface EvaluationNoteReadonlyViewProps {
  note: EvaluationNote;
  onEdit: () => void;
  onDelete: () => void;
}
/**
 * Evaluation note readonly view
 * @param props props
 * @returns Evaluation note readonly view
 */
const EvaluationNoteReadonlyView: React.FC<EvaluationNoteReadonlyViewProps> = (
  props
) => {
  const { note, onEdit, onDelete } = props;
  const { t } = useTranslation(["evaluation", "common"]);
  return (
    <div className="evaluation-note">
      <div className="evaluation-note__body rich-text">
        <CkeditorContentLoader html={note.note} />
      </div>
      <div className="evaluation-note__meta">
        <div className="evaluation-note__meta-item">
          <span className="evaluation-note__meta-label">
            {t("labels.evaluationNoteCreationDate", { ns: "evaluation" })}
          </span>
          <span className="evaluation-note__meta-data">
            {localize.date(note.created)}
          </span>
        </div>
        {note.lastModified && note.lastModifierName && (
          <div className="evaluation-note__meta-item">
            <span className="evaluation-note__meta-label">
              {t("labels.evaluationNoteLastModified", { ns: "evaluation" })}
            </span>
            <span className="evaluation-note__meta-data">
              {`${localize.date(note.lastModified)} ${note.lastModifierName}`}
            </span>
          </div>
        )}
      </div>
      <div className="evaluation-note__actions evaluation-note__actions--end">
        <Link className="evaluation-note__link" onClick={onEdit}>
          {t("actions.edit", { ns: "common" })}
        </Link>
        <Link
          className="evaluation-note__link evaluation-note__link--delete"
          onClick={onDelete}
        >
          {t("actions.remove", { ns: "common" })}
        </Link>
      </div>
    </div>
  );
};

/**
 * Evaluation note delete view props
 */
interface EvaluationNoteDeleteViewProps {
  locked: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}
/**
 * Evaluation note delete view
 * @param props props
 * @returns Evaluation note delete view
 */
const EvaluationNoteDeleteView: React.FC<EvaluationNoteDeleteViewProps> = (
  props
) => {
  const { locked, onConfirm, onCancel } = props;
  const { t } = useTranslation(["evaluation", "common"]);
  /**
   * Handle confirm click
   */
  const handleConfirmClick = async () => {
    try {
      await onConfirm();
    } catch {
      // Hook already shows the notification; stay in delete
    }
  };
  return (
    <div className="evaluation-note evaluation-note--confirm">
      <p className="evaluation-note__confirm-text">
        {t("content.removing", {
          ns: "evaluation",
          context: "evaluationNote",
        })}
      </p>
      <div className="evaluation-note__actions">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          disabled={locked}
          onClick={handleConfirmClick}
        >
          {t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          disabled={locked}
          onClick={onCancel}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    </div>
  );
};

export default EvaluationNoteDialog;
