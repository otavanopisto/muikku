import { NotebookNote, NotebookNoteType, UserApi } from "~/generated/client";
import { isNotebookWorkspaceNote } from "~/helper-functions/notebook";

type WorkspaceNotebookNote = Extract<
  NotebookNote,
  { type: typeof NotebookNoteType.Workspace }
>;

/**
 * User property key for WORKSPACE note order in one workspace.
 * @param workspaceEntityId workspaceEntityId
 */
export function getWorkspaceNotesOrderPropertyKey(
  workspaceEntityId: number
): string {
  return `workspace-${workspaceEntityId}-workspace-notes-order`;
}

/**
 * Parses stored order value from user property.
 * @param value value
 * @returns number[] | null
 */
export function parseWorkspaceNotesOrder(value: unknown): number[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  if (!value.every((id) => typeof id === "number" && Number.isFinite(id))) {
    return null;
  }

  return value;
}

/**
 * Default fallback: creation order by id.
 * @param notes notes
 * @returns WorkspaceNotebookNote[]
 */
export function sortWorkspaceNotesByCreationOrder(
  notes: WorkspaceNotebookNote[]
): WorkspaceNotebookNote[] {
  return [...notes].sort((a, b) => a.id - b.id);
}

/**
 * Sorts workspace notes using stored order ids.
 * @param notes notes
 * @param orderIds orderIds
 * @returns WorkspaceNotebookNote[]
 */
export function sortWorkspaceNotesByOrder(
  notes: WorkspaceNotebookNote[],
  orderIds: number[]
): WorkspaceNotebookNote[] {
  if (!orderIds.length) {
    return sortWorkspaceNotesByCreationOrder(notes);
  }

  const noteById = new Map(notes.map((note) => [note.id, note]));
  const sorted: WorkspaceNotebookNote[] = [];

  for (const id of orderIds) {
    const note = noteById.get(id);
    if (note) {
      sorted.push(note);
    }
  }

  for (const note of notes) {
    if (!orderIds.includes(note.id)) {
      sorted.push(note);
    }
  }

  return sorted;
}

/**
 * Removes stale ids and appends missing WORKSPACE note ids.
 * @param orderIds orderIds
 * @param workspaceNotes workspaceNotes
 * @returns number[]
 */
export function reconcileWorkspaceNotesOrder(
  orderIds: number[] | null | undefined,
  workspaceNotes: WorkspaceNotebookNote[]
): number[] {
  const validIds = new Set(workspaceNotes.map((note) => note.id));
  const reconciled = (orderIds ?? []).filter((id) => validIds.has(id));

  for (const note of sortWorkspaceNotesByCreationOrder(workspaceNotes)) {
    if (!reconciled.includes(note.id)) {
      reconciled.push(note.id);
    }
  }

  return reconciled;
}

/**
 * Removes a workspace note from the order.
 * @param orderIds orderIds
 * @param noteId noteId
 * @returns number[]
 */
export function removeWorkspaceNoteFromOrder(
  orderIds: number[],
  noteId: number
): number[] {
  return orderIds.filter((id) => id !== noteId);
}

/**
 * Reorders the workspace notes order.
 * @param orderIds orderIds
 * @param dragIndex dragIndex
 * @param hoverIndex hoverIndex
 * @returns number[]
 */
export function reorderWorkspaceNotesOrderIds(
  orderIds: number[],
  dragIndex: number,
  hoverIndex: number
): number[] {
  if (
    dragIndex < 0 ||
    hoverIndex < 0 ||
    dragIndex >= orderIds.length ||
    hoverIndex >= orderIds.length ||
    dragIndex === hoverIndex
  ) {
    return orderIds;
  }

  const reordered = [...orderIds];
  const [moved] = reordered.splice(dragIndex, 1);
  reordered.splice(hoverIndex, 0, moved);
  return reordered;
}

/**
 * Checks if two workspace notes orders are equal.
 * @param a a
 * @param b b
 * @returns boolean
 */
export function areWorkspaceNotesOrdersEqual(
  a: number[],
  b: number[]
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((id, index) => id === b[index]);
}

/**
 * Gets the workspace notes from the notes.
 * @param notes notes
 * @returns WorkspaceNotebookNote[]
 */
export function getWorkspaceNotesFromNotes(
  notes: NotebookNote[] | null | undefined
): WorkspaceNotebookNote[] {
  return (notes ?? []).filter(isNotebookWorkspaceNote);
}

/**
 * Loads the workspace notes order property.
 * @param userApi userApi
 * @param workspaceEntityId workspaceEntityId
 * @returns Promise<number[] | null>
 */
export async function loadWorkspaceNotesOrderProperty(
  userApi: UserApi,
  workspaceEntityId: number
): Promise<number[] | null> {
  try {
    const property = await userApi.getUserProperty({
      key: getWorkspaceNotesOrderPropertyKey(workspaceEntityId),
    });

    return parseWorkspaceNotesOrder(JSON.parse(property.value));
  } catch {
    return null;
  }
}

/**
 * Saves the workspace notes order property.
 * @param userApi userApi
 * @param workspaceEntityId workspaceEntityId
 * @param orderIds orderIds
 * @returns Promise<void>
 */
export async function saveWorkspaceNotesOrderProperty(
  userApi: UserApi,
  workspaceEntityId: number,
  orderIds: number[]
): Promise<void> {
  await userApi.setUserProperty({
    setUserPropertyRequest: {
      key: getWorkspaceNotesOrderPropertyKey(workspaceEntityId),
      value: JSON.stringify(orderIds),
    },
  });
}

/**
 * Inserts a new note id at the given position in the order list.
 * @param orderIds orderIds
 * @param noteId noteId
 * @param position position
 * @returns number[]
 */
export function insertWorkspaceNoteIdAtPosition(
  orderIds: number[],
  noteId: number,
  position: number
): number[] {
  const next = [...orderIds];
  const insertAt = Math.max(0, Math.min(position, next.length));
  next.splice(insertAt, 0, noteId);
  return next;
}
