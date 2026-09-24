import * as React from "react";
import { NotebookNote, NotebookNoteType } from "~/generated/client";
import {
  NotebookContextHighlightItem,
  NotebookContextNoteItem,
  NotebookMaterialNoteItem,
  NotebookWorkspaceNoteItem,
} from "./variants";

/**
 * NotebookNoteItemProps
 */
export interface NotebookNoteItemProps {
  note: NotebookNote;
  open: boolean;
  onToggle: (noteId: number) => void;
  materialHtml?: string;
  isDraft?: boolean;
}

/**
 * NotebookNoteItem
 * @param props props
 * @returns React.ReactNode
 */
const NotebookNoteItem = (props: NotebookNoteItemProps) => {
  const { note } = props;
  switch (note.type) {
    case NotebookNoteType.Workspace:
      return <NotebookWorkspaceNoteItem {...props} note={note} />;
    case NotebookNoteType.WorkspaceMaterial:
      return <NotebookMaterialNoteItem {...props} note={note} />;
    case NotebookNoteType.WorkspaceMaterialContextNote:
      return <NotebookContextNoteItem {...props} note={note} />;
    case NotebookNoteType.WorkspaceMaterialContextHighlight:
      return <NotebookContextHighlightItem {...props} note={note} />;
    default:
      null;
  }
};

export default NotebookNoteItem;
