import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  buildNotebookViewModel,
  flattenWorkspaceMaterialPages,
} from "../helpers/notebook-layout";
import { StateType } from "~/reducers";

/**
 * Memoized notebook V2 view model for list rendering.
 */
export function useNotebookViewModel() {
  const notes = useSelector((state: StateType) => state.notebookV2.notes);
  const drafts = useSelector((state: StateType) => state.notebookV2.drafts);
  const workspaceNotesOrder = useSelector(
    (state: StateType) => state.notebookV2.workspaceNotesOrder
  );
  const userId = useSelector((state: StateType) => state.status.userId);
  const currentMaterials = useSelector(
    (state: StateType) => state.workspaces.currentMaterials
  );

  return useMemo(() => {
    const materialPages = flattenWorkspaceMaterialPages(currentMaterials);
    return buildNotebookViewModel(
      notes,
      materialPages,
      drafts,
      String(userId),
      workspaceNotesOrder
    );
  }, [notes, drafts, currentMaterials, userId, workspaceNotesOrder]);
}
