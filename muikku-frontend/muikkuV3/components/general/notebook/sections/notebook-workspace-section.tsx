/* eslint-disable no-console */
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
  setNotebookV2WorkspaceDraftPosition,
  updateNotebookV2WorkspaceNotesOrder,
} from "~/actions/notebook/notebookV2";

/**
 * NotebookWorkspaceSectionProps
 */
interface NotebookWorkspaceSectionProps {
  notes: WorkspaceNotebookNote[];
  workspaceDraftNote: WorkspaceNotebookNote | null;
  workspaceDraftNotePosition: number | null;
  storageKey: string;
}

/**
 * Workspace-level notes section with create editor and drag-reorder.
 * @param props props
 * @returns React.ReactNode
 */
const NotebookWorkspaceSection = (props: NotebookWorkspaceSectionProps) => {
  const { notes, workspaceDraftNote, workspaceDraftNotePosition, storageKey } =
    props;
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
   * handleSetDraftPosition
   * @param position position
   */
  const handleSetDraftPosition = React.useCallback(
    (position: number) => {
      dispatch(setNotebookV2WorkspaceDraftPosition(position));
    },
    [dispatch]
  );

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

      {notes.map((note, index, array) => {
        const isFirst = index === 0;
        const isLast = index === array.length - 1;

        const item = (
          <>
            {workspaceDraftNote && isFirst && (
              <AddHere
                isActive={workspaceDraftNotePosition === 0}
                onClick={() => handleSetDraftPosition(0)}
              />
            )}

            <NotebookNoteItem
              note={note}
              open={isOpen(note.id)}
              onToggle={toggle}
            />

            {workspaceDraftNote &&
              (isLast ? (
                <AddHere
                  isActive={workspaceDraftNotePosition === array.length}
                  onClick={() => handleSetDraftPosition(array.length)}
                />
              ) : (
                <AddHere
                  isActive={workspaceDraftNotePosition === index + 1}
                  onClick={() => handleSetDraftPosition(index + 1)}
                />
              ))}
          </>
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

/**
 * AddHereProps
 */
interface AddHereProps {
  isActive: boolean;
  onClick: React.MouseEventHandler<unknown>;
}

/**
 * AddHere
 * @param props props
 * @returns JSX.Element
 */
const AddHere = (props: AddHereProps) => {
  const { isActive, onClick } = props;

  const handleIconClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      onClick(e);
    },
    [onClick]
  );

  return (
    <div
      className={
        isActive
          ? "notebook__set-note-location notebook__set-note-location--selected"
          : "notebook__set-note-location"
      }
    >
      <span
        className="notebook__set-note-location-icon icon-list-add"
        onClick={handleIconClick}
      />
    </div>
  );
};

export default NotebookWorkspaceSection;
