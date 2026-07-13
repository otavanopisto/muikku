import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IconButton } from "../../button";
import Dropdown from "~/components/general/dropdown";
import { DraggableElement } from "../../react-dnd/draggable-element";
import {
  collectWorkspaceNoteIds,
  WorkspaceNotebookNote,
} from "../helpers/notebook-layout";
import { useNotebookOpenItems } from "../hooks/useNotebookOpenItems";
import NotebookNoteItem from "../items/notebook-note-item";
import {
  beginNotebookV2WorkspaceDraft,
  updateNotebookV2WorkspaceNotesOrder,
} from "~/actions/notebook/notebookV2";

/**
 * NotebookWorkspaceSectionProps
 */
interface NotebookWorkspaceSectionProps {
  notes: WorkspaceNotebookNote[];
  workspaceDraftNote: WorkspaceNotebookNote | null;
  storageKey: string;
}

/**
 * Workspace-level notes section with create editor and drag-reorder.
 * @param props props
 * @returns React.ReactNode
 */
const NotebookWorkspaceSection = (props: NotebookWorkspaceSectionProps) => {
  const { notes, workspaceDraftNote, storageKey } = props;
  const { t } = useTranslation("notebook");
  const dispatch = useDispatch();
  const { isOpen, toggle, openAll, closeAll } =
    useNotebookOpenItems(storageKey);

  const [editOrder, setEditOrder] = React.useState(false);

  /**
   * handleOpenAllClick
   */
  const handleOpenAllClick = () => {
    openAll(collectWorkspaceNoteIds(notes));
  };

  /**
   * handleCloseAllClick
   */
  const handleCloseAllClick = () => {
    closeAll();
  };

  /**
   * handleAddClick
   */
  const handleAddClick = () => {
    dispatch(beginNotebookV2WorkspaceDraft());
  };

  /**
   * handleEditEntriesOrderClick
   */
  const handleEditEntriesOrderClick = () => {
    setEditOrder((prev) => !prev);
  };

  /**
   * handleElementDrag
   * @param dragIndex dragIndex
   * @param hoverIndex hoverIndex
   */
  const handleElementDrag = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      dispatch(
        updateNotebookV2WorkspaceNotesOrder(dragIndex, hoverIndex, true)
      );
    },
    [dispatch]
  );

  /**
   * handleElementDrop
   * @param dragIndex dragIndex
   * @param hoverIndex hoverIndex
   */
  const handleElementDrop = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      dispatch(
        updateNotebookV2WorkspaceNotesOrder(dragIndex, hoverIndex, true)
      );
    },
    [dispatch]
  );

  return (
    <section className="notebook__section">
      <div className="notebook__section-header">
        <h3 className="notebook__section-title">
          Työtilan yleiset muistiinpanot
        </h3>
        <div className="notebook__section-actions">
          <Dropdown openByHover content={<p>{t("actions.add")}</p>}>
            <IconButton
              icon="plus"
              aria-label={t("actions.add")}
              buttonModifiers={["notebook-action"]}
              onClick={handleAddClick}
              disablePropagation={true}
            />
          </Dropdown>

          {notes.length >= 2 && (
            <Dropdown openByHover content={<p>{t("actions.organize")}</p>}>
              <IconButton
                icon="move"
                aria-label={t("actions.organize")}
                buttonModifiers={["notebook-action"]}
                className={editOrder ? "state-OPEN" : ""}
                onClick={handleEditEntriesOrderClick}
                disablePropagation={true}
              />
            </Dropdown>
          )}

          {notes.length > 0 && (
            <>
              <Dropdown
                openByHover
                content={<p>{t("actions.openAll", { ns: "common" })}</p>}
              >
                <IconButton
                  icon="arrow-down"
                  aria-label={t("actions.openAll", { ns: "common" })}
                  buttonModifiers={["notebook-action"]}
                  onClick={handleOpenAllClick}
                  disablePropagation={true}
                />
              </Dropdown>
              <Dropdown
                openByHover
                content={<p>{t("actions.closeAll", { ns: "common" })}</p>}
              >
                <IconButton
                  icon="arrow-up"
                  aria-label={t("actions.closeAll", { ns: "common" })}
                  buttonModifiers={["notebook-action"]}
                  onClick={handleCloseAllClick}
                  disablePropagation={true}
                />
              </Dropdown>
            </>
          )}
        </div>
      </div>

      {workspaceDraftNote && (
        <NotebookNoteItem
          key={workspaceDraftNote.id}
          note={workspaceDraftNote}
          isDraft
          open={true}
          onToggle={() => {}}
        />
      )}

      {notes.map((note, index) => {
        const item = (
          <NotebookNoteItem
            note={note}
            open={isOpen(note.id)}
            onToggle={toggle}
          />
        );

        if (!editOrder) {
          return <React.Fragment key={note.id}>{item}</React.Fragment>;
        }

        return (
          <DraggableElement
            key={note.id}
            id={note.id}
            index={index}
            active={editOrder}
            onElementDrag={handleElementDrag}
            onElementDrop={handleElementDrop}
          >
            {item}
          </DraggableElement>
        );
      })}
    </section>
  );
};

export default NotebookWorkspaceSection;
