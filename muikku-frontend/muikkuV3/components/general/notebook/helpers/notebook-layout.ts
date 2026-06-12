import { NotebookNote, NotebookNoteType } from "~/generated/client";
import {
  isNotebookContextHighlight,
  isNotebookContextNote,
  isNotebookWorkspaceMaterialNote,
  isNotebookWorkspaceNote,
} from "~/helper-functions/notebook";
import {
  contextNoteDraftToNotebookNote,
  EMPTY_NOTEBOOK_V2_DRAFTS,
  isNotebookDraftId,
  materialDraftToNotebookNote,
  NotebookV2DraftsState,
  workspaceDraftToNotebookNote,
} from "./notebook-drafts";
import { MaterialContentNodeWithIdAndLogic } from "~/reducers/workspaces/index";
import { classifyAnnotation, getSearchableFromMaterialHtml } from "~/util/html";

export type WorkspaceNotebookNote = Extract<
  NotebookNote,
  { type: typeof NotebookNoteType.Workspace }
>;

export type MaterialNotebookNote = Extract<
  NotebookNote,
  { type: typeof NotebookNoteType.WorkspaceMaterial }
>;

export type ContextNotebookNote = Extract<
  NotebookNote,
  {
    type:
      | typeof NotebookNoteType.WorkspaceMaterialContextHighlight
      | typeof NotebookNoteType.WorkspaceMaterialContextNote;
  }
>;

export type NotebookMaterialPageRef = {
  workspaceMaterialId: number;
  title: string;
  sortIndex: number;
  html?: string;
};

export type NotebookMaterialPageGroup = {
  page: NotebookMaterialPageRef;
  materialNotes: MaterialNotebookNote[];
  contextItems: ContextNotebookNote[];
};

export type NotebookViewModel = {
  workspaceNotes: WorkspaceNotebookNote[];
  workspaceDraftNote: WorkspaceNotebookNote | null;
  materialGroups: NotebookMaterialPageGroup[];
};

/**
 * Flatten workspace material pages in TOC order.
 * @param materials materials
 * @returns NotebookMaterialPageRef[]
 */
export function flattenWorkspaceMaterialPages(
  materials?: MaterialContentNodeWithIdAndLogic[]
): NotebookMaterialPageRef[] {
  if (!materials?.length) {
    return [];
  }

  const pages: NotebookMaterialPageRef[] = [];
  let sortIndex = 0;

  for (const section of materials) {
    for (const page of section.children ?? []) {
      if (!page.workspaceMaterialId) {
        continue;
      }

      pages.push({
        workspaceMaterialId: page.workspaceMaterialId,
        title: page.title || "",
        sortIndex: sortIndex++,
        html: page.html,
      });
    }
  }

  return pages;
}

/**
 * sortByCreationOrder
 * @param items items
 * @returns T[]
 */
function sortByCreationOrder<T extends { id: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.id - b.id);
}

/**
 * compareMaterialPageOrder
 * @param a a
 * @param b b
 * @param pageById pageById
 * @returns number
 */
function compareMaterialPageOrder(
  a: number,
  b: number,
  pageById: Map<number, NotebookMaterialPageRef>
): number {
  const pageA = pageById.get(a);
  const pageB = pageById.get(b);

  if (pageA && pageB) {
    return pageA.sortIndex - pageB.sortIndex;
  }
  if (pageA) {
    return -1;
  }
  if (pageB) {
    return 1;
  }
  return a - b;
}

type ContextNoteDocumentPosition = {
  start: number;
  end: number;
  id: number;
};

/**
 * Resolved document position for a context highlight / context note.
 * Orphans sort last (start = MAX_SAFE_INTEGER).
 * @param note note
 * @param materialHtml materialHtml
 * @returns ContextNoteDocumentPosition
 */
function getContextNoteDocumentPosition(
  note: ContextNotebookNote,
  materialHtml?: string
): ContextNoteDocumentPosition {
  const fallback: ContextNoteDocumentPosition = {
    start: Number.MAX_SAFE_INTEGER,
    end: Number.MAX_SAFE_INTEGER,
    id: note.id,
  };
  if (!materialHtml) {
    return fallback;
  }
  const searchable = getSearchableFromMaterialHtml(materialHtml);
  const result = classifyAnnotation(
    { start: note.start, end: note.end, index: note.index },
    searchable.text
  );
  if (result.status !== "active") {
    return fallback;
  }
  return {
    start: result.range.start,
    end: result.range.end,
    id: note.id,
  };
}

/**
 * Context highlights + context notes in material reading order.
 * @param items context items for one page
 * @param materialHtml page HTML
 */
function sortContextItemsByDocumentOrder(
  items: ContextNotebookNote[],
  materialHtml?: string
): ContextNotebookNote[] {
  if (items.length <= 1) {
    return items;
  }
  const positionById = new Map(
    items.map((note) => [
      note.id,
      getContextNoteDocumentPosition(note, materialHtml),
    ])
  );
  return [...items].sort((a, b) => {
    const posA = positionById.get(a.id)!;
    const posB = positionById.get(b.id)!;
    if (posA.start !== posB.start) {
      return posA.start - posB.start;
    }
    if (posA.end !== posB.end) {
      return posA.end - posB.end;
    }
    return posA.id - posB.id;
  });
}

/**
 * buildMaterialGroups
 * @param notes notes
 * @param materialPages materialPages
 * @param drafts drafts
 * @param owner owner
 * @returns NotebookMaterialPageGroup[]
 */
function buildMaterialGroups(
  notes: NotebookNote[],
  materialPages: NotebookMaterialPageRef[],
  drafts: NotebookV2DraftsState = EMPTY_NOTEBOOK_V2_DRAFTS,
  owner = ""
): NotebookMaterialPageGroup[] {
  const pageById = new Map(
    materialPages.map((page) => [page.workspaceMaterialId, page])
  );
  const byMaterialId = new Map<
    number,
    {
      materialNotes: MaterialNotebookNote[];
      contextItems: ContextNotebookNote[];
    }
  >();
  for (const note of notes) {
    if (isNotebookWorkspaceMaterialNote(note)) {
      const entry = byMaterialId.get(note.workspaceMaterialId) ?? {
        materialNotes: [],
        contextItems: [],
      };
      entry.materialNotes.push(note);
      byMaterialId.set(note.workspaceMaterialId, entry);
      continue;
    }
    if (isNotebookContextHighlight(note) || isNotebookContextNote(note)) {
      const entry = byMaterialId.get(note.workspaceMaterialId) ?? {
        materialNotes: [],
        contextItems: [],
      };
      entry.contextItems.push(note);
      byMaterialId.set(note.workspaceMaterialId, entry);
    }
  }
  // Draft: page-level notes (one per page)
  for (const draft of Object.values(drafts.materialNotes)) {
    const entry = byMaterialId.get(draft.workspaceMaterialId) ?? {
      materialNotes: [],
      contextItems: [],
    };
    entry.materialNotes.push(materialDraftToNotebookNote(draft, owner));
    byMaterialId.set(draft.workspaceMaterialId, entry);
  }
  // Draft: context notes (multiple)
  for (const draft of drafts.contextNotes) {
    const entry = byMaterialId.get(draft.workspaceMaterialId) ?? {
      materialNotes: [],
      contextItems: [],
    };
    entry.contextItems.push(contextNoteDraftToNotebookNote(draft, owner));
    byMaterialId.set(draft.workspaceMaterialId, entry);
  }
  if (byMaterialId.size === 0) {
    return [];
  }
  const materialIds = [...byMaterialId.keys()].sort((a, b) =>
    compareMaterialPageOrder(a, b, pageById)
  );
  return materialIds.map((workspaceMaterialId) => {
    const entry = byMaterialId.get(workspaceMaterialId)!;
    const knownPage = pageById.get(workspaceMaterialId);
    const page: NotebookMaterialPageRef = knownPage ?? {
      workspaceMaterialId,
      title: `Page ${workspaceMaterialId}`,
      sortIndex: Number.MAX_SAFE_INTEGER,
    };
    const savedMaterialNotes = entry.materialNotes.filter(
      (n) => !isNotebookDraftId(n.id)
    );
    const draftMaterialNotes = entry.materialNotes.filter((n) =>
      isNotebookDraftId(n.id)
    );
    return {
      page,
      materialNotes: [
        ...draftMaterialNotes,
        ...sortByCreationOrder(savedMaterialNotes),
      ],
      contextItems: sortContextItemsByDocumentOrder(
        entry.contextItems,
        page.html
      ),
    };
  });
}

/**
 * Build notebook list view model from flat Redux notes.
 * @param notes notes
 * @param materialPages materialPages
 * @param drafts drafts
 * @param owner owner
 * @returns NotebookViewModel
 */
export function buildNotebookViewModel(
  notes: NotebookNote[] | null,
  materialPages: NotebookMaterialPageRef[] = [],
  drafts: NotebookV2DraftsState = EMPTY_NOTEBOOK_V2_DRAFTS,
  owner = ""
): NotebookViewModel {
  const savedNotes = notes ?? [];
  return {
    workspaceNotes: savedNotes.filter(isNotebookWorkspaceNote),
    workspaceDraftNote: drafts.workspaceNote
      ? workspaceDraftToNotebookNote(drafts.workspaceNote, owner)
      : null,
    materialGroups: buildMaterialGroups(
      savedNotes,
      materialPages,
      drafts,
      owner
    ),
  };
}

/**
 * Collect workspace note ids (for workspace section open-all).
 * @param notes notes
 * @returns number[]
 */
export function collectWorkspaceNoteIds(
  notes: WorkspaceNotebookNote[]
): number[] {
  return notes.map((note) => note.id);
}
/**
 * Collect material + context note ids (for material section open-all).
 * @param groups groups
 * @returns number[]
 */
export function collectMaterialNoteIds(
  groups: NotebookMaterialPageGroup[]
): number[] {
  const ids: number[] = [];
  for (const group of groups) {
    for (const note of group.materialNotes) {
      ids.push(note.id);
    }
    for (const note of group.contextItems) {
      ids.push(note.id);
    }
  }
  return ids;
}
