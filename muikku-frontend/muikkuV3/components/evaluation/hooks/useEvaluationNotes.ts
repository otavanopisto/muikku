// components/evaluation/hooks/useEvaluationNotes.ts
import * as React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import MApi, { isMApiError } from "~/api/api";
import { displayNotification } from "~/actions/base/notifications";
import { EvaluationNote } from "~/generated/client";

const evaluationNotesApi = MApi.getEvaluationNotesApi();

/**
 * Use evaluation notes props
 */
interface UseEvaluationNotesProps {
  userEntityId: number;
  workspaceEntityId: number;
  workspaceUserEntityId: number;
  enabled: boolean;
}

/**
 * Use evaluation notes hook
 * @param props Props
 * @returns Evaluation notes
 */
export const useEvaluationNotes = (props: UseEvaluationNotesProps) => {
  const { userEntityId, workspaceEntityId, workspaceUserEntityId, enabled } =
    props;
  const dispatch = useDispatch();
  const { t } = useTranslation("evaluation");

  const [notes, setNotes] = React.useState<EvaluationNote[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  /**
   * Load evaluation notes
   */
  const loadNotes = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const loaded = await evaluationNotesApi.getEvaluationNotes({
        workspaceEntityId,
        userEntityId,
      });
      setNotes(loaded);
    } catch (err) {
      if (!isMApiError(err)) throw err;
      dispatch(
        displayNotification(
          t("notifications.loadError_evaluationNotes", { error: err.message }),
          "error"
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, t, userEntityId, workspaceEntityId]);

  React.useEffect(() => {
    if (!enabled) return;
    loadNotes();
  }, [enabled, loadNotes]);

  /**
   * Create evaluation note
   * @param noteText Note text
   * @returns Created evaluation note
   */
  const createNote = async (noteText: string) => {
    setIsSaving(true);
    try {
      const created = await evaluationNotesApi.createOrUpdateEvaluationNote({
        createOrUpdateEvaluationNoteRequest: {
          userEntityId,
          workspaceEntityId,
          note: noteText,
        },
      });
      setNotes((prev) => [...prev, created]);

      dispatch({
        type: "EVALUATION_ASSESSMENT_NOTE_COUNT_UPDATE",
        payload: {
          workspaceUserEntityId,
          delta: 1, // create
        },
      });
    } catch (err) {
      if (!isMApiError(err)) throw err;
      dispatch(
        displayNotification(
          t("notifications.saveError_evaluationNote", { error: err.message }),
          "error"
        )
      );
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update evaluation note
   * @param note Evaluation note
   * @param noteText Note text
   */
  const updateNote = async (note: EvaluationNote, noteText: string) => {
    setIsSaving(true);
    try {
      const updated = await evaluationNotesApi.createOrUpdateEvaluationNote({
        createOrUpdateEvaluationNoteRequest: {
          id: note.id,
          userEntityId,
          workspaceEntityId,
          note: noteText,
        },
      });
      setNotes((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err) {
      if (!isMApiError(err)) throw err;
      dispatch(
        displayNotification(
          t("notifications.updateError_evaluationNote", { error: err.message }),
          "error"
        )
      );
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Delete evaluation note
   * @param noteId Note ID
   */
  const deleteNote = async (noteId: number) => {
    setIsSaving(true);
    try {
      await evaluationNotesApi.archiveEvaluationNote({ id: noteId });
      setNotes((prev) => prev.filter((note) => note.id !== noteId));

      dispatch({
        type: "EVALUATION_ASSESSMENT_NOTE_COUNT_UPDATE",
        payload: {
          workspaceUserEntityId,
          delta: -1, // delete
        },
      });
    } catch (err) {
      if (!isMApiError(err)) throw err;
      dispatch(
        displayNotification(
          t("notifications.removeError_evaluationNote", { error: err.message }),
          "error"
        )
      );

      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const firstNote = notes[0]; // API can return several; UI currently supports one

  return {
    notes,
    firstNote,
    isLoading,
    isSaving,
    createNote,
    updateNote,
    deleteNote,
  };
};
