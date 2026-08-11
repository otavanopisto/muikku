import * as React from "react";
import { StateType } from "~/reducers";
import { useDispatch, useSelector } from "react-redux";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/notebook.scss";
import { NoteList } from "./notebook-notes-list";
import {
  loadNotebookV2Entries,
  clearNotebookV2FocusDraft,
  clearNotebookV2DraftsAll,
  clearNotebookV2ActiveItem,
} from "~/actions/notebook/notebookV2";
import { useNotebookViewModel } from "./hooks/useNotebookViewModel";
import NotebookWorkspaceSection from "./sections/notebook-workspace-section";
import NotebookMaterialSection from "./sections/notebook-material-section";
import { useDragDropManager } from "react-dnd";
import { useScroll } from "./hooks/useScroll";
import { useDismissNotebookActiveItem } from "./hooks/useDismissActiveItem";
import { clearNotebookV2FocusNote } from "~/actions/notebook/notebookV2";
import { scrollToNotebookItem } from "./helpers/notebook-active-item";
import NotebookItemDeleteDialog from "./items/notebook-item-delete-confirm";
import NotebookNoteEditorDialog from "./notebook-note-editor-dialog";

/**
 * NotebookProps
 */
interface NotebookProps {}

/**
 * Notebook V2 shell.
 * @param props props
 * @returns React.ReactNode
 */
const Notebook = (props: NotebookProps) => {
  const dispatch = useDispatch();
  const notebookV2 = useSelector((state: StateType) => state.notebookV2);
  const currentWorkspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );
  const userId = useSelector((state: StateType) => state.status.userId);
  const focusDraftClientId = useSelector(
    (state: StateType) => state.notebookV2.focusDraftClientId
  );
  const activeItemId = useSelector(
    (state: StateType) => state.notebookV2.activeItemId
  );

  const focusNoteId = useSelector(
    (state: StateType) => state.notebookV2.focusNoteId
  );

  const viewModel = useNotebookViewModel();

  const { notes, state, drafts } = notebookV2;

  const workspaceDraftNotePosition = drafts.workspaceNote?.position;

  const workspaceOpenStorageKey = `opened-notes-v2-workspace-${currentWorkspace?.id}-${userId}`;
  const materialOpenStorageKey = `opened-notes-v2-material-${currentWorkspace?.id}-${userId}`;

  // Load notebook entries
  React.useEffect(() => {
    if (!currentWorkspace?.id) {
      return;
    }
    dispatch(clearNotebookV2DraftsAll());
    dispatch(loadNotebookV2Entries());
  }, [dispatch, currentWorkspace?.id]);

  const notebookBodyRef = React.useRef<HTMLDivElement>(null);
  const { updatePosition } = useScroll(notebookBodyRef);
  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();

  // Notebook scroll handling
  React.useEffect(() => {
    const unsubscribe = monitor.subscribeToOffsetChange(() => {
      const offset = monitor.getSourceClientOffset()?.y as number;
      updatePosition({ position: offset, isScrollAllowed: true });
    });
    return unsubscribe;
  }, [monitor, updatePosition]);

  // Focus draft scroll target handling
  React.useEffect(() => {
    if (focusDraftClientId == null) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      const el = document.querySelector(
        `[data-notebook-draft-id="${focusDraftClientId}"]`
      );
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      dispatch(clearNotebookV2FocusDraft());
    });
    return () => window.cancelAnimationFrame(frame);
  }, [dispatch, focusDraftClientId]);

  // Focus note scroll target handling
  React.useEffect(() => {
    if (focusNoteId == null) {
      return;
    }

    // Scroll to focus note and clear focus note after scroll
    const frame = window.requestAnimationFrame(() => {
      scrollToNotebookItem(focusNoteId);
      dispatch(clearNotebookV2FocusNote());
    });
    return () => window.cancelAnimationFrame(frame);
  }, [dispatch, focusNoteId]);

  /**
   * Handle dismiss active item
   */
  const handleDismissActiveItem = React.useCallback(() => {
    dispatch(clearNotebookV2ActiveItem());
  }, [dispatch]);

  useDismissNotebookActiveItem(activeItemId, handleDismissActiveItem);

  const isLoading = state === "LOADING" || notes === null;

  return (
    <div className="notebook">
      <NotebookItemDeleteDialog />
      <NotebookNoteEditorDialog />
      <div className="notebook__body" ref={notebookBodyRef}>
        <NoteList>
          {isLoading ? (
            <div className="empty-loader" />
          ) : (
            <>
              <NotebookWorkspaceSection
                notes={viewModel.workspaceNotes}
                storageKey={workspaceOpenStorageKey}
                workspaceDraftNote={viewModel.workspaceDraftNote}
                workspaceDraftNotePosition={workspaceDraftNotePosition}
              />
              <NotebookMaterialSection
                groups={viewModel.materialGroups}
                storageKey={materialOpenStorageKey}
              />
            </>
          )}
        </NoteList>
      </div>
    </div>
  );
};

export default Notebook;
