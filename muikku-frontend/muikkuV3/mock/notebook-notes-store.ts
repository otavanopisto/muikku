import { NotebookNote, NotebookNoteType } from "~/generated/client";
import { MOCK_NOTEBOOK_NOTES } from "~/mock/notebook-notes";

let mockNotes: NotebookNote[] = [...MOCK_NOTEBOOK_NOTES];

/**
 * In-memory notebook store for dev until API is ready.
 */
export function getMockNotebookStore(): NotebookNote[] {
  return mockNotes;
}

/**
 * Sets the mock notebook store
 * @param notes - Notebook notes to set
 */
export function setMockNotebookStore(notes: NotebookNote[]): void {
  mockNotes = [...notes];
}
/**
 * Gets the mock notebook notes by workspace entity id
 * @param workspaceEntityId - Workspace entity id
 * @returns Mock notebook notes by workspace entity id
 */
export function getMockNotebookNotesByWorkspace(
  workspaceEntityId: number
): NotebookNote[] {
  return mockNotes.filter((n) => n.workspaceEntityId === workspaceEntityId);
}
/**
 * Gets all mock notebook notes
 * @returns All mock notebook notes
 */
export function getMockNotebookNotesAll(): NotebookNote[] {
  return [...mockNotes];
}

/**
 * Upserts a mock notebook note
 * @param note - Notebook note to upsert
 * @returns Upserted mock notebook note
 */
export function upsertMockNotebookNote(note: NotebookNote): NotebookNote[] {
  const index = mockNotes.findIndex((n) => n.id === note.id);
  if (index >= 0) {
    mockNotes = [
      ...mockNotes.slice(0, index),
      note,
      ...mockNotes.slice(index + 1),
    ];
  } else {
    mockNotes = [...mockNotes, note];
  }
  return [...mockNotes];
}

/**
 * Removes a mock notebook note
 * @param id - Notebook note id to remove
 * @returns Removed mock notebook note
 */
export function removeMockNotebookNote(id: number): NotebookNote[] {
  mockNotes = mockNotes.filter((n) => n.id !== id);
  return [...mockNotes];
}

/**
 * Reorders mock notebook notes
 * @param dragIndex - Index of the note to drag
 * @param hoverIndex - Index to hover over
 * @returns Reordered mock notebook notes
 */
export function reorderMockNotebookNotes(
  dragIndex: number,
  hoverIndex: number
): NotebookNote[] {
  const next = [...mockNotes];
  const [moved] = next.splice(dragIndex, 1);
  next.splice(hoverIndex, 0, moved);
  mockNotes = next;
  return [...mockNotes];
}

/**
 * Reorder WORKSPACE notes for one workspace only.
 * Other note types keep their positions in the global mock array.
 * @param workspaceEntityId - Workspace entity id
 * @param dragIndex - Index of the note to drag
 * @param hoverIndex - Index to hover over
 * @returns Reordered mock workspace notes
 */
export function reorderMockWorkspaceNotesForWorkspace(
  workspaceEntityId: number,
  dragIndex: number,
  hoverIndex: number
): NotebookNote[] {
  const workspaceNotes = mockNotes.filter(
    (n) =>
      n.workspaceEntityId === workspaceEntityId &&
      n.type === NotebookNoteType.Workspace
  );

  if (
    dragIndex < 0 ||
    hoverIndex < 0 ||
    dragIndex >= workspaceNotes.length ||
    hoverIndex >= workspaceNotes.length ||
    dragIndex === hoverIndex
  ) {
    return [...mockNotes];
  }

  const reordered = [...workspaceNotes];
  const [moved] = reordered.splice(dragIndex, 1);
  reordered.splice(hoverIndex, 0, moved);

  let workspaceIndex = 0;
  mockNotes = mockNotes.map((note) => {
    if (
      note.workspaceEntityId === workspaceEntityId &&
      note.type === NotebookNoteType.Workspace
    ) {
      const next = reordered[workspaceIndex];
      workspaceIndex += 1;
      return next;
    }
    return note;
  });

  return [...mockNotes];
}

/**
 * Creates a next mock notebook id
 * @returns Next mock notebook id
 */
export function createNextMockNotebookId(): number {
  const maxId = mockNotes.reduce((max, n) => Math.max(max, n.id), 0);
  return maxId + 1;
}

export type CreateMockWorkspaceNotebookNoteInput = {
  owner: string;
  workspaceEntityId: number;
  title: string;
  text: string;
};

/**
 * Creates a mock workspace notebook note
 * @param input - Input data for the mock workspace notebook note
 * @returns Created mock workspace notebook note
 */
export function createMockWorkspaceNotebookNote(
  input: CreateMockWorkspaceNotebookNoteInput
): NotebookNote {
  const note: NotebookNote = {
    type: NotebookNoteType.Workspace,
    id: createNextMockNotebookId(),
    owner: input.owner,
    workspaceEntityId: input.workspaceEntityId,
    title: input.title,
    text: input.text,
  };
  mockNotes = [...mockNotes, note];
  return note;
}

export type CreateMockWorkspaceMaterialNotebookNoteInput = {
  owner: string;
  workspaceEntityId: number;
  workspaceMaterialId: number;
  title: string;
  text: string;
};
/**
 * Creates a mock workspace material (page-level) notebook note
 * @param input - Input data for the mock workspace material notebook note
 * @returns Created mock workspace material notebook note
 */
export function createMockWorkspaceMaterialNotebookNote(
  input: CreateMockWorkspaceMaterialNotebookNoteInput
): NotebookNote {
  const note: NotebookNote = {
    type: NotebookNoteType.WorkspaceMaterial,
    id: createNextMockNotebookId(),
    owner: input.owner,
    workspaceEntityId: input.workspaceEntityId,
    workspaceMaterialId: input.workspaceMaterialId,
    title: input.title,
    text: input.text,
  };
  mockNotes = [...mockNotes, note];
  return note;
}

export type CreateMockContextHighlightInput = {
  owner: string;
  workspaceEntityId: number;
  workspaceMaterialId: number;
  text: string;
  start: string;
  end: string;
  index: number;
};

/**
 * Creates a mock workspace material context highlight
 * @param input - Input data for the mock workspace material context highlight
 * @returns Created mock workspace material context highlight
 */
export function createMockContextHighlight(
  input: CreateMockContextHighlightInput
): NotebookNote {
  const note: NotebookNote = {
    type: NotebookNoteType.WorkspaceMaterialContextHighlight,
    id: createNextMockNotebookId(),
    owner: input.owner,
    workspaceEntityId: input.workspaceEntityId,
    workspaceMaterialId: input.workspaceMaterialId,
    text: input.text,
    start: input.start,
    end: input.end,
    index: input.index,
  };
  mockNotes = [...mockNotes, note];
  return note;
}

export type CreateMockContextNoteInput = {
  owner: string;
  workspaceEntityId: number;
  workspaceMaterialId: number;
  title: string;
  text: string;
  start: string;
  end: string;
  index: number;
};

/**
 * Creates a mock workspace material context note
 * @param input - Input data for the mock workspace material context note
 * @returns Created mock workspace material context note
 */
export function createMockContextNote(
  input: CreateMockContextNoteInput
): NotebookNote {
  const note: NotebookNote = {
    type: NotebookNoteType.WorkspaceMaterialContextNote,
    id: createNextMockNotebookId(),
    owner: input.owner,
    workspaceEntityId: input.workspaceEntityId,
    workspaceMaterialId: input.workspaceMaterialId,
    title: input.title,
    text: input.text,
    start: input.start,
    end: input.end,
    index: input.index,
  };
  mockNotes = [...mockNotes, note];
  return note;
}
