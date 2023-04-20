import * as React from "react";
import NoteEditor from "./note-editor";
import { NoteBookState, WorkspaceNote } from "~/reducers/notebook/notebook";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
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
import { WorkspaceType } from "~/reducers/workspaces/index";
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
import AnimateHeight from "react-animate-height";

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
  i18n: i18nType;
  status: StatusType;
  currentWorkspace: WorkspaceType;
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
   * handleChoosePositionClick
   * @param position position
   */
  const handleChooseStartOrEndPositionClick = (position: "first" | "last") => {
    updateSelectedNotePosition(position);
  };

  /**
   * Renders note item.
   * If ordering is active note is wrapped with DraggableElement
   *
   * @param note note
   * @param index index
   * @returns note item
   */
  const renderNote = React.useCallback(
    (note: WorkspaceNote, index: number) => {
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
       * @param index index
       */
      const handleChoosePositionClick = (index: number) => {
        updateSelectedNotePosition(index);
      };

      return (
        <>
          {notebook.noteEditorOpen && index > 0 && (
            <AnimateHeight
              height={notebook.noteEditorSelectPosition ? "auto" : 0}
              contentClassName={
                notebook.noteEditedPosition === index
                  ? "notebook__add-note-here-button notebook__add-note-here-button--ACTIVE"
                  : "notebook__add-note-here-button"
              }
              onClick={() => handleChoosePositionClick(index)}
            >
              <p>Luo uusi muistiinpano tähän kohtaan</p>
            </AnimateHeight>
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
        </>
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
      notebook.noteEditorSelectPosition,
      openedItems,
      setOpenedItems,
      toggleNotebookEditor,
      updateSelectedNotePosition,
    ]
  );

  return (
    <div className="notebook">
      <div className="notebook__actions">
        <Dropdown openByHover content={<p>Lisää muistiinpano</p>}>
          <IconButton
            icon="plus"
            buttonModifiers={["notebook-action"]}
            onClick={handleAddNewNoteClick}
            disablePropagation={true}
          />
        </Dropdown>
        <Dropdown openByHover content={<p>Järjestele muistiinpanoja</p>}>
          <IconButton
            icon="move"
            buttonModifiers={["notebook-action"]}
            onClick={handleEditEntriesOrderClick}
            disablePropagation={true}
          />
        </Dropdown>
        <Dropdown openByHover content={<p>Avaa kaikki</p>}>
          <IconButton
            icon="arrow-down"
            buttonModifiers={["notebook-action"]}
            onClick={handleOpenAllClick}
            disablePropagation={true}
          />
        </Dropdown>
        <Dropdown openByHover content={<p>Sulje kaikki</p>}>
          <IconButton
            icon="arrow-up"
            buttonModifiers={["notebook-action"]}
            onClick={handleCloseAllClick}
            disablePropagation={true}
          />
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
            <>
              {notebook.noteEditorOpen && (
                <AnimateHeight
                  height={notebook.noteEditorSelectPosition ? "auto" : 0}
                  onClick={() => handleChooseStartOrEndPositionClick("first")}
                  contentClassName={
                    notebook.noteEditedPosition === "first"
                      ? "notebook__add-note-here-button notebook__add-note-here-button--ACTIVE"
                      : "notebook__add-note-here-button"
                  }
                >
                  <p>Luo uusi muistiinpano tähän kohtaan</p>
                </AnimateHeight>
              )}
              {notes.map((note, index) => renderNote(note, index))}
              {notebook.noteEditorOpen && (
                <AnimateHeight
                  height={notebook.noteEditorSelectPosition ? "auto" : 0}
                  onClick={() => handleChooseStartOrEndPositionClick("last")}
                  contentClassName={
                    notebook.noteEditedPosition === "last"
                      ? "notebook__add-note-here-button notebook__add-note-here-button--ACTIVE"
                      : "notebook__add-note-here-button"
                  }
                >
                  <p>Luo uusi muistiinpano tähän kohtaan</p>
                </AnimateHeight>
              )}
            </>
          ) : (
            <div className="empty">
              <span>Ei muistiinpanoja</span>
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
    i18n: state.i18n,
    notebook: state.notebook,
    status: state.status,
    currentWorkspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
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

export default connect(mapStateToProps, mapDispatchToProps)(NoteBook);
