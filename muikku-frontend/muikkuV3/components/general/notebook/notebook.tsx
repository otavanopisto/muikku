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
  const viewModel = useNotebookViewModel();
  const { notes, state } = notebookV2;

  const workspaceOpenStorageKey = `opened-notes-v2-workspace-${currentWorkspace?.id}-${userId}`;
  const materialOpenStorageKey = `opened-notes-v2-material-${currentWorkspace?.id}-${userId}`;

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

  React.useEffect(() => {
    const unsubscribe = monitor.subscribeToOffsetChange(() => {
      const offset = monitor.getSourceClientOffset()?.y as number;
      updatePosition({ position: offset, isScrollAllowed: true });
    });
    return unsubscribe;
  }, [monitor, updatePosition]);

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
