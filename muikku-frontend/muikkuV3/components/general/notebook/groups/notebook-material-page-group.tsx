import * as React from "react";
import { NotebookMaterialPageGroup } from "../helpers/notebook-layout";
import NotebookNoteItem from "../items/notebook-note-item";
import { isNotebookDraftId } from "../helpers/notebook-drafts";

/**
 * NotebookMaterialPageGroupProps
 */
interface NotebookMaterialPageGroupProps {
  group: NotebookMaterialPageGroup;
  isOpen: (noteId: number) => boolean;
  onToggle: (noteId: number) => void;
}

/**
 * One material page: page-level notes first, then context items.
 * @param props props
 * @returns React.ReactNode
 */
const NotebookMaterialPageGroupView = (
  props: NotebookMaterialPageGroupProps
) => {
  const { group, isOpen, onToggle } = props;
  const { page, materialNotes, contextItems } = group;

  const hasMaterialNotes = materialNotes.length > 0;
  const hasContextItems = contextItems.length > 0;

  if (!hasMaterialNotes && !hasContextItems) {
    return null;
  }

  return (
    <div className="notebook__page-group">
      <h4 className="notebook__page-group-title">{page.title}</h4>

      {hasMaterialNotes &&
        materialNotes.map((note) => (
          <NotebookNoteItem
            key={note.id}
            note={note}
            open={isOpen(note.id)}
            onToggle={onToggle}
            materialHtml={page.html}
            isDraft={isNotebookDraftId(note.id)}
          />
        ))}

      {hasMaterialNotes && hasContextItems && (
        <div className="notebook__page-group-divider" />
      )}

      {hasContextItems &&
        contextItems.map((note) => (
          <NotebookNoteItem
            key={note.id}
            note={note}
            open={isOpen(note.id)}
            onToggle={onToggle}
            materialHtml={page.html}
            isDraft={isNotebookDraftId(note.id)}
          />
        ))}
    </div>
  );
};

export default NotebookMaterialPageGroupView;
