import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import EnvironmentDialog from "~/components/general/environment-dialog";
import Button from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import { ckEditorConfig } from "./helpers/notebook-editor";
import { NotebookNote, NotebookNoteType } from "~/generated/client";
import { StateType } from "~/reducers";
import {
  cancelNotebookV2Draft,
  cancelNotebookV2NoteEdit,
  cancelNotebookV2ContextHighlightUpgrade,
  saveNotebookV2ContextNoteDraft,
  saveNotebookV2MaterialDraft,
  updateEditedNotebookV2Entry,
  upgradeNotebookV2ContextHighlight,
} from "~/actions/notebook/notebookV2";
import {
  buildEditedNotebookNote,
  getNotebookNoteBodyHtml,
  getNotebookNoteListTitle,
} from "./helpers/notebook-display";
import {
  contextNoteDraftToNotebookNote,
  materialDraftToNotebookNote,
  workspaceDraftToNotebookNote,
  NotebookV2DraftsState,
} from "./helpers/notebook-drafts";
import { getContextHighlightUpgradeEditorDefaults } from "./helpers/notebook-context-upgrade";
import {
  isNotebookContextHighlight,
  isNotebookWorkspaceNote,
} from "~/helper-functions/notebook";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import "~/sass/elements/form.scss";

type EditorSession =
  | { kind: "draft"; note: NotebookNote }
  | { kind: "edit"; note: NotebookNote }
  | {
      kind: "upgrade";
      note: NotebookNote;
      initialTitle: string;
      initialText: string;
    };

/**
 * Finds note id for a given UI mode.
 * @param noteUiById noteUiById
 * @param kind kind
 */
function findNoteUiId(
  noteUiById: StateType["notebookV2"]["noteUiById"],
  kind: "editing" | "upgrading"
): number | null {
  for (const key of Object.keys(noteUiById)) {
    const noteId = parseInt(key);
    if (noteUiById[noteId]?.kind === kind) {
      return noteId;
    }
  }
  return null;
}

/**
 * Resolves draft note by client id.
 * @param drafts drafts
 * @param clientId clientId
 * @param owner owner
 */
function draftNoteByClientId(
  drafts: NotebookV2DraftsState,
  clientId: number,
  owner: string
): NotebookNote | null {
  if (drafts.workspaceNote?.clientId === clientId) {
    return workspaceDraftToNotebookNote(drafts.workspaceNote, owner);
  }
  for (const draft of Object.values(drafts.materialNotes)) {
    if (draft.clientId === clientId) {
      return materialDraftToNotebookNote(draft, owner);
    }
  }
  const contextDraft = drafts.contextNotes.find((d) => d.clientId === clientId);
  if (contextDraft) {
    return contextNoteDraftToNotebookNote(contextDraft, owner);
  }
  return null;
}

/**
 * Picks first available draft client id.
 * @param drafts drafts
 */
function firstDraftClientId(drafts: NotebookV2DraftsState): number | null {
  // Workspace drafts use the inline editor — ignore them here.
  const material = Object.values(drafts.materialNotes)[0];
  if (material) {
    return material.clientId;
  }
  if (drafts.contextNotes[0]) {
    return drafts.contextNotes[0].clientId;
  }
  return null;
}

/**
 * Resolves current create/edit/upgrade session from Redux.
 * With exceptions for workspace notes that are handled by the inline editor.
 * @param state state
 * @param owner owner
 */
function resolveEditorSession(
  state: StateType["notebookV2"],
  owner: string
): EditorSession | null {
  // Find the context highlight upgrade session.
  const upgradingId = findNoteUiId(state.noteUiById, "upgrading");
  if (upgradingId != null) {
    const note = state.notes?.find((n) => n.id === upgradingId);
    if (note && isNotebookContextHighlight(note)) {
      const defaults = getContextHighlightUpgradeEditorDefaults(note);
      return {
        kind: "upgrade",
        note,
        initialTitle: defaults.title,
        initialText: defaults.text,
      };
    }
  }

  // Find the editing session.
  const editingId = findNoteUiId(state.noteUiById, "editing");
  if (editingId != null) {
    const note = state.notes?.find((n) => n.id === editingId);
    if (note && !isNotebookWorkspaceNote(note)) {
      return { kind: "edit", note };
    }
  }

  // Find the draft session.
  const draftClientId =
    state.focusDraftClientId ?? firstDraftClientId(state.drafts);
  if (draftClientId != null) {
    // Inline editor handles workspace create drafts.
    if (state.drafts.workspaceNote?.clientId === draftClientId) {
      return null;
    }
    const note = draftNoteByClientId(state.drafts, draftClientId, owner);
    if (note) {
      return { kind: "draft", note };
    }
  }
  return null;
}

/**
 * Controlled EnvironmentDialog for notebook create / edit / upgrade.
 */
const NotebookNoteEditorDialog = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["notebook", "common"]);
  const notebookV2 = useSelector((state: StateType) => state.notebookV2);
  const owner = useSelector((state: StateType) =>
    String(state.status.userId ?? "")
  );

  // Resolve the editor session.
  const session = React.useMemo(
    () => resolveEditorSession(notebookV2, owner),
    [notebookV2, owner]
  );

  const isOpen = session != null;
  const [locked, setLocked] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [text, setText] = React.useState("");

  const sessionKey = session ? `${session.kind}-${session.note.id}` : "closed";

  // Session changed, update the dialog state.
  React.useEffect(() => {
    unstable_batchedUpdates(() => {
      if (!session) {
        setLocked(false);
        return;
      }
      if (session.kind === "upgrade") {
        setTitle(session.initialTitle);
        setText(session.initialText);
        return;
      }
      setTitle(getNotebookNoteListTitle(session.note));
      setText(getNotebookNoteBodyHtml(session.note));
    });
  }, [session]);

  /**
   * Handles closing the dialog.
   */
  const handleClose = React.useCallback(() => {
    if (!session || locked) {
      return;
    }
    if (session.kind === "draft") {
      dispatch(cancelNotebookV2Draft(session.note.id));
      return;
    }
    if (session.kind === "edit") {
      dispatch(cancelNotebookV2NoteEdit(session.note.id));
      return;
    }
    dispatch(cancelNotebookV2ContextHighlightUpgrade(session.note.id));
  }, [dispatch, locked, session]);

  /**
   * Handles saving the note.
   * @param closeDialog closeDialog
   */
  const handleSave = React.useCallback(
    (closeDialog: () => void) =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!session) {
          return;
        }
        setLocked(true);

        // eslint-disable-next-line jsdoc/require-jsdoc
        const onDone = (ok: boolean) => {
          setLocked(false);
          if (ok) {
            closeDialog();
          }
        };

        if (session.kind === "draft") {
          const payload = {
            clientId: session.note.id,
            title,
            text,
            // eslint-disable-next-line jsdoc/require-jsdoc
            success: () => onDone(true),
            // eslint-disable-next-line jsdoc/require-jsdoc
            fail: () => onDone(false),
          };
          if (session.note.type === NotebookNoteType.WorkspaceMaterial) {
            dispatch(saveNotebookV2MaterialDraft(payload));
          }
          if (
            session.note.type === NotebookNoteType.WorkspaceMaterialContextNote
          ) {
            dispatch(saveNotebookV2ContextNoteDraft(payload));
          }
          return;
        }

        if (session.kind === "edit") {
          const editedEntry = buildEditedNotebookNote(
            session.note,
            title,
            text
          );
          if (!editedEntry) {
            setLocked(false);
            return;
          }
          dispatch(
            updateEditedNotebookV2Entry({
              editedEntry,
              // eslint-disable-next-line jsdoc/require-jsdoc
              success: () => onDone(true),
              // eslint-disable-next-line jsdoc/require-jsdoc
              fail: () => onDone(false),
            })
          );
          return;
        }

        dispatch(
          upgradeNotebookV2ContextHighlight({
            highlightId: session.note.id,
            title,
            text,
            // eslint-disable-next-line jsdoc/require-jsdoc
            success: () => onDone(true),
            // eslint-disable-next-line jsdoc/require-jsdoc
            fail: () => onDone(false),
          })
        );
      },
    [dispatch, session, text, title]
  );

  /**
   * Handles changing the title.
   * @param e e
   */
  const handleTitleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

  /**
   * Handles changing the CKEditor content.
   * @param value value
   */
  const handleCKEditorChange = React.useCallback((value: string) => {
    setText(value);
  }, []);

  const dialogTitle =
    session?.kind === "draft"
      ? t("actions.add", { ns: "notebook" })
      : session?.kind === "upgrade"
        ? t("actions.addComment", {
            ns: "notebook",
            defaultValue: "Upgrade to note",
          })
        : t("actions.edit", { ns: "notebook" });

  /**
   * Dialog content.
   */
  const content = () => [
    <div className="env-dialog__row" key="notebook-note-editor-title">
      <div className="env-dialog__form-element-container">
        <label
          htmlFor="notebook-note-editor-title"
          className="env-dialog__label"
        >
          {t("labels.title", { ns: "common" })}
        </label>
        <input
          id="notebook-note-editor-title"
          className="env-dialog__input"
          value={title}
          onChange={handleTitleChange}
          autoFocus
        />
      </div>
    </div>,
    <div
      className="env-dialog__row env-dialog__row--ckeditor"
      key="notebook-note-editor-content"
    >
      <div className="env-dialog__form-element-container">
        <label className="env-dialog__label">
          {t("labels.content", { ns: "common" })}
        </label>
        <CKEditor
          onChange={handleCKEditorChange}
          configuration={ckEditorConfig}
        >
          {text}
        </CKEditor>
      </div>
    </div>,
  ];

  /**
   * Dialog footer.
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="env-dialog__actions">
      <Button
        className="button button--dialog-execute"
        disabled={locked}
        onClick={handleSave(closeDialog)}
      >
        {t("actions.save", { ns: "common" })}
      </Button>
      <Button
        buttonModifiers="dialog-cancel"
        disabled={locked}
        onClick={closeDialog}
      >
        {t("actions.cancel", { ns: "common" })}
      </Button>
    </div>
  );

  return (
    <EnvironmentDialog
      key={sessionKey}
      modifier="notebook-note-editor"
      title={dialogTitle}
      content={content}
      footer={footer}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
};

export default NotebookNoteEditorDialog;
