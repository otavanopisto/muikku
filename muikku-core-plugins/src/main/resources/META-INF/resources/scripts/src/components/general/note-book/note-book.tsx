import * as React from "react";
import NoteEditor from "./note-editor";
import { NoteBookState } from "~/reducers/notebook/notebook";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  LoadNotebookEntries,
  loadNotebookEntries,
  updateNotebookEntriesOrder,
  UpdateNotebookEntriesOrder,
  ToggleNotebookEditor,
  toggleNotebookEditor,
  DeleteNotebookEntry,
  deleteNotebookEntry,
  UpdateSelectedNotePosition,
  updateSelectedNotePosition,
} from "../../../actions/notebook/notebook";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceDataType } from "~/reducers/workspaces/index";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/notebook.scss";
import NoteList, { NoteListItem } from "./note-list";
import {
  MouseTransition,
  MultiBackendOptions,
  TouchTransition,
} from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DraggableElement } from "../react-dnd/draggable-element";
import { IconButton } from "../button";
import { useScroll } from "./hooks/useScroll";
import { useDragDropManager } from "react-dnd";
import Dropdown from "~/components/general/dropdown";
import { useLocalStorage } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import NoteBookPDFDialog from "./notebook-pdf-dialog";
import { WorkspaceNote } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

export const HTML5toTouch: MultiBackendOptions = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

/**
 * NoteBookProps
 */
interface NoteBookProps {
  status: StatusType;
  currentWorkspace: WorkspaceDataType;
  notebook: NoteBookState;
  loadNotebookEntries: LoadNotebookEntries;
  updateNotebookEntriesOrder: UpdateNotebookEntriesOrder;
  toggleNotebookEditor: ToggleNotebookEditor;
  deleteNotebookEntry: DeleteNotebookEntry;
  updateSelectedNotePosition: UpdateSelectedNotePosition;
}

/**
 * Creates NoteBook component
 *
 * @param props props
 */
const NoteBook: React.FC<NoteBookProps> = (props) => {
  const {
    notebook,
    loadNotebookEntries,
    updateNotebookEntriesOrder,
    toggleNotebookEditor,
    deleteNotebookEntry,
    updateSelectedNotePosition,
  } = props;
  const { notes, noteInTheEditor } = notebook;

  const notebookBodyRef = React.useRef<HTMLDivElement>(null);

  const [openedItems, setOpenedItems] = useLocalStorage<number[]>(
    `opened-notes-${props.currentWorkspace.id}-${props.status.userId}`,
    []
  );
  const [editOrder, setEditOrder] = React.useState<boolean>(false);

  const { t } = useTranslation("notebook");

  React.useEffect(() => {
    if (notes === null) {
      loadNotebookEntries();
    }
  }, [loadNotebookEntries, notes]);

  const { updatePosition } = useScroll(notebookBodyRef);

  const dragDropManager = useDragDropManager();
  const monitor = dragDropManager.getMonitor();

  React.useEffect(() => {
    const unsubscribe = monitor.subscribeToOffsetChange(() => {
      const offset = monitor.getSourceClientOffset()?.y as number;
      updatePosition({ position: offset, isScrollAllowed: true });
    });
    return unsubscribe;
  }, [monitor, updatePosition]);

  /**
   * Handles adding new note
   * @param e event
   */
  const handleAddNewNoteClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    toggleNotebookEditor({ open: true });
  };

  /**
   * Handles opening all notes
   * @param e event
   */
  const handleOpenAllClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setOpenedItems(notes.map((note) => note.id));
  };

  /**
   * Handles closing all notes
   * @param e event
   */
  const handleCloseAllClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setOpenedItems([]);
  };

  /**
   * Handles note item reorder
   * @param e event
   */
  const handleEditEntriesOrderClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setEditOrder(!editOrder);
  };

  /**
   * Handles draggable element drag
   *
   * @param dragIndex dragIndex
   * @param hoverIndex hoverIndex
   */
  const handleElementDrag = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      updateNotebookEntriesOrder(dragIndex, hoverIndex, true);
    },
    [updateNotebookEntriesOrder]
  );

  /**
   * handleDropElement
   */
  const handleElementDrop = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      updateNotebookEntriesOrder(dragIndex, hoverIndex, true);
    },
    [updateNotebookEntriesOrder]
  );

  /**
   * Renders note item.
   * If ordering is active note is wrapped with DraggableElement
   *
   * @param note note
   * @param index index
   * @returns note item
   */
  const renderNote = React.useCallback(
    (note: WorkspaceNote, index: number, isLast: boolean) => {
      /**
       * Handles opening/closing note specific note
       *
       * @param noteId noteId
       */
      const handleOpenNoteClick = (noteId: number) => {
        if (openedItems.includes(noteId)) {
          setOpenedItems((prevItems) =>
            prevItems.filter((id) => id !== noteId)
          );
        } else {
          setOpenedItems([...openedItems, noteId]);
        }
      };

      /**
       * Handles note item edit click
       *
       * @param note note
       */
      const handleEditNoteClick = (note: WorkspaceNote) => {
        toggleNotebookEditor({ open: true, note });
      };

      /**
       * Handles note item delete click
       *
       * @param noteId noteId
       */
      const handleDeleteNoteClick = (noteId: number) => {
        deleteNotebookEntry({ workspaceNoteId: noteId });
      };

      /**
       * handleChoosePositionClick
       *
       * @param index of the following note
       */
      const handleChoosePositionClick =
        (index: number) =>
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          updateSelectedNotePosition(index);
        };

      return (
        <div key={note.id}>
          {notebook.noteEditorOpen && index === 0 && (
            <AddHere
              isActive={notebook.noteEditedPosition === 0}
              onClick={handleChoosePositionClick(0)}
            />
          )}

          <DraggableElement
            key={note.id}
            id={note.id}
            index={index}
            active={editOrder}
            onElementDrag={handleElementDrag}
            onElementDrop={handleElementDrop}
          >
            <NoteListItem
              key={note.id}
              note={note}
              open={openedItems.includes(note.id)}
              onOpenClick={handleOpenNoteClick}
              isEdited={noteInTheEditor && noteInTheEditor.id === note.id}
              onEditClick={handleEditNoteClick}
              onDeleteClick={handleDeleteNoteClick}
            />
          </DraggableElement>

          {notebook.noteEditorOpen ? (
            isLast ? (
              <AddHere
                isActive={notebook.noteEditedPosition === null}
                onClick={handleChoosePositionClick(null)}
              />
            ) : (
              <AddHere
                isActive={notebook.noteEditedPosition === index + 1}
                onClick={handleChoosePositionClick(index + 1)}
              />
            )
          ) : null}
        </div>
      );
    },
    [
      deleteNotebookEntry,
      editOrder,
      handleElementDrag,
      handleElementDrop,
      noteInTheEditor,
      notebook.noteEditedPosition,
      notebook.noteEditorOpen,
      openedItems,
      setOpenedItems,
      toggleNotebookEditor,
      updateSelectedNotePosition,
    ]
  );

  return (
    <div className="notebook">
      <div className="notebook__actions">
        <Dropdown openByHover content={<p>{t("actions.add")}</p>}>
          <IconButton
            icon="plus"
            aria-label={t("actions.add")}
            buttonModifiers={["notebook-action"]}
            onClick={handleAddNewNoteClick}
            disablePropagation={true}
          />
        </Dropdown>
        <Dropdown openByHover content={<p>{t("actions.organize")}</p>}>
          <IconButton
            icon="move"
            aria-label={t("actions.organize")}
            buttonModifiers={["notebook-action"]}
            onClick={handleEditEntriesOrderClick}
            disablePropagation={true}
          />
        </Dropdown>
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
        <Dropdown
          openByHover
          content={<p>{t("actions.openPDF", { ns: "common" })}</p>}
        >
          <NoteBookPDFDialog notes={notes} workspace={props.currentWorkspace}>
            <IconButton
              icon="pdf"
              buttonModifiers={["notebook-action"]}
              disablePropagation={true}
            />
          </NoteBookPDFDialog>
        </Dropdown>
      </div>

      <div className="notebook__body" ref={notebookBodyRef}>
        <div
          className={`notebook__editor ${
            notebook.noteEditorOpen ? "state-OPEN" : ""
          }`}
        >
          <NoteEditor />
        </div>
        <NoteList>
          {notebook.state === "LOADING" ? (
            <div className="empty-loader" />
          ) : notes ? (
            notes.map((note, index, array) =>
              renderNote(note, index, array.length - 1 === index)
            )
          ) : (
            <div className="empty">
              <span>{t("content.empty")}</span>
            </div>
          )}
        </NoteList>
      </div>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    notebook: state.notebook,
    status: state.status,
    currentWorkspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      loadNotebookEntries,
      updateNotebookEntriesOrder,
      toggleNotebookEditor,
      deleteNotebookEntry,
      updateSelectedNotePosition,
    },
    dispatch
  );
}

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
 * @returns React.JSX.Element
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

export default connect(mapStateToProps, mapDispatchToProps)(NoteBook);
