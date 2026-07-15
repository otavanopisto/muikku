import * as React from "react";
import { NotebookMaterialPageGroup } from "../helpers/notebook-layout";
import NotebookNoteItem from "../items/notebook-note-item";
import { isNotebookDraftId } from "../helpers/notebook-drafts";
import Dropdown from "../../dropdown";
import { IconButton } from "../../button";
import { useDispatch } from "react-redux";
import { beginNotebookV2MaterialNoteDraft } from "~/actions/notebook/notebookV2";
import { useTranslation } from "react-i18next";

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

  const dispatch = useDispatch();
  const { t } = useTranslation("notebook");

  const hasMaterialNotes = materialNotes.length > 0;
  const hasContextItems = contextItems.length > 0;

  const pageExists = page.html !== undefined;

  if (!hasMaterialNotes && !hasContextItems) {
    return null;
  }

  /**
   * Handle add click
   */
  const handleAddClick = () => {
    dispatch(beginNotebookV2MaterialNoteDraft(page.workspaceMaterialId));
  };

  return (
    <div className="notebook__page-group">
      <div className="notebook__page-group-header">
        <h4 className="notebook__page-group-title">
          {page.title} {!pageExists ? "(Page does not exist)" : ""}
        </h4>

        {pageExists && (
          <div className="notebook__page-group-actions">
            <Dropdown openByHover content={<p>{t("actions.add")}</p>}>
              <IconButton
                icon="plus"
                aria-label={t("actions.add")}
                buttonModifiers={["notebook-action"]}
                onClick={handleAddClick}
                disablePropagation={true}
              />
            </Dropdown>
          </div>
        )}
      </div>

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
