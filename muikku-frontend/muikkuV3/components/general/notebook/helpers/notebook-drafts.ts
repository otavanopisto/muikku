import { NotebookNote, NotebookNoteType } from "~/generated/client";
import { MaterialNotebookNote, WorkspaceNotebookNote } from "./notebook-layout";
import { MaterialHighlight } from "~/components/base/material-loader/types";

export type NotebookContextNoteDraft = {
  clientId: number;
  workspaceEntityId: number;
  workspaceMaterialId: number;
  selectedText: string;
  start: string;
  end: string;
  index: number;
  title?: string;
  text?: string;
};

export type NotebookWorkspaceNoteDraft = {
  clientId: number;
  workspaceEntityId: number;
  position: number | null;
  title?: string;
  text?: string;
};

export type NotebookMaterialNoteDraft = {
  clientId: number;
  workspaceEntityId: number;
  workspaceMaterialId: number;
  title?: string;
  text?: string;
  openNotebookTab?: boolean;
};

export type NotebookV2DraftsState = {
  contextNotes: NotebookContextNoteDraft[];
  workspaceNote: NotebookWorkspaceNoteDraft | null;
  materialNotes: Record<number, NotebookMaterialNoteDraft>;
};

export const EMPTY_NOTEBOOK_V2_DRAFTS: NotebookV2DraftsState = {
  contextNotes: [],
  workspaceNote: null,
  materialNotes: {},
};

/**
 * Client-only draft rows use negative ids.
 * @param id id
 */
export function isNotebookDraftId(id: number): boolean {
  return id < 0;
}

/**
 * Next temp id (always decreasing).
 * @param drafts drafts
 * @returns next temp id
 */
export function nextNotebookDraftClientId(
  drafts: NotebookV2DraftsState
): number {
  const ids: number[] = [
    ...drafts.contextNotes.map((d) => d.clientId),
    ...(drafts.workspaceNote ? [drafts.workspaceNote.clientId] : []),
    ...Object.values(drafts.materialNotes).map((d) => d.clientId),
  ];
  if (!ids.length) {
    return -1;
  }
  return Math.min(...ids) - 1;
}

/**
 * Default title from selected text.
 * @param selectedText selected text
 * @returns default title from selected text
 */
export function draftTitleFromSelection(selectedText: string): string {
  const trimmed = selectedText.trim();
  return trimmed.length <= 60 ? trimmed : `${trimmed.slice(0, 57)}...`;
}

/**
 * Workspace draft to notebook note.
 * @param draft draft
 * @param owner owner
 * @returns workspace draft to notebook note
 */
export function workspaceDraftToNotebookNote(
  draft: NotebookWorkspaceNoteDraft,
  owner: string
): WorkspaceNotebookNote {
  return {
    type: NotebookNoteType.Workspace,
    id: draft.clientId,
    owner,
    workspaceEntityId: draft.workspaceEntityId,
    title: draft.title ?? "",
    text: draft.text ?? "<p></p>",
  };
}

/**
 * Material draft to notebook note.
 * @param draft draft
 * @param owner owner
 * @returns material draft to notebook note
 */
export function materialDraftToNotebookNote(
  draft: NotebookMaterialNoteDraft,
  owner: string
): MaterialNotebookNote {
  return {
    type: NotebookNoteType.WorkspaceMaterial,
    id: draft.clientId,
    owner,
    workspaceEntityId: draft.workspaceEntityId,
    workspaceMaterialId: draft.workspaceMaterialId,
    title: draft.title ?? "",
    text: draft.text ?? "<p></p>",
  };
}

/**
 * Context note draft to notebook note.
 * @param draft draft
 * @param owner owner
 * @returns context note draft to notebook note
 */
export function contextNoteDraftToNotebookNote(
  draft: NotebookContextNoteDraft,
  owner: string
): Extract<
  NotebookNote,
  { type: typeof NotebookNoteType.WorkspaceMaterialContextNote }
> {
  return {
    type: NotebookNoteType.WorkspaceMaterialContextNote,
    id: draft.clientId,
    owner,
    workspaceEntityId: draft.workspaceEntityId,
    workspaceMaterialId: draft.workspaceMaterialId,
    title: draft.title ?? draftTitleFromSelection(draft.selectedText),
    text: draft.text ?? "<p></p>",
    start: draft.start,
    end: draft.end,
    index: draft.index,
  };
}

/**
 * Remove draft by clientId from all draft buckets.
 * @param drafts drafts
 * @param clientId clientId
 * @returns removed draft by clientId from all draft buckets
 */
export function removeDraftByClientId(
  drafts: NotebookV2DraftsState,
  clientId: number
): NotebookV2DraftsState {
  const materialNotes = { ...drafts.materialNotes };
  for (const [pageId, draft] of Object.entries(materialNotes)) {
    if (draft.clientId === clientId) {
      delete materialNotes[Number(pageId)];
    }
  }

  return {
    contextNotes: drafts.contextNotes.filter((d) => d.clientId !== clientId),
    workspaceNote:
      drafts.workspaceNote?.clientId === clientId ? null : drafts.workspaceNote,
    materialNotes,
  };
}

/**
 * MaterialLoader preview for an unsaved context note draft.
 * @param draft draft
 */
export function contextNoteDraftToMaterialHighlight(
  draft: NotebookContextNoteDraft
): MaterialHighlight {
  return {
    id: draft.clientId,
    workspaceMaterialId: draft.workspaceMaterialId,
    fieldName: null,
    start: draft.start,
    end: draft.end,
    index: draft.index,
    kind: "note-draft",
  };
}
/**
 * Preview highlights for context note drafts on one page.
 * @param drafts drafts
 * @param workspaceMaterialId workspaceMaterialId
 * @returns Preview highlights for context note drafts on one page
 */
export function getContextNoteDraftHighlightsForPage(
  drafts: NotebookContextNoteDraft[],
  workspaceMaterialId: number
): MaterialHighlight[] {
  return drafts
    .filter((d) => d.workspaceMaterialId === workspaceMaterialId)
    .map(contextNoteDraftToMaterialHighlight);
}
