import * as React from "react";
import { NoteBookState, WorkspaceNote } from "~/reducers/notebook/notebook";
import { DraggableElement } from "../react-dnd/draggable-element";
import { IconButton } from "../button";
import AnimateHeight from "react-animate-height";
import {
  UpdateNotebookEntriesOrder,
  DeleteNotebookEntry,
  ToggleNotebookEditor,
  updateNotebookEntriesOrder,
  toggleNotebookEditor,
  deleteNotebookEntry,
} from "../../../actions/notebook/notebook";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import CkeditorContentLoader from "../../base/ckeditor-loader/content";

/**
 * NoteBookProps
 */
interface NoteListProps {
  i18n: i18nType;
  notebook: NoteBookState;
  updateNotebookEntriesOrder: UpdateNotebookEntriesOrder;
  toggleNotebookEditor: ToggleNotebookEditor;
  deleteNotebookEntry: DeleteNotebookEntry;
}

/**
 * Creates NoteList component
 *
 * @param props props
 */
export const NoteList: React.FC<NoteListProps> = (props) => {
  const {
    toggleNotebookEditor,
    deleteNotebookEntry,
    updateNotebookEntriesOrder,
    notebook,
  } = props;

  const { notes, noteInTheEditor } = notebook;

  const [openedItems, setOpenedItems] = React.useState<number[]>([]);
  const [editOrder, setEditOrder] = React.useState<boolean>(false);

  /**
   * Handles opening all notes
   */
  const handleOpenAllClick = () => {
    setOpenedItems(notes.map((note) => note.id));
  };

  /**
   * Handles closing all notes
   */
  const handleCloseAllClick = () => {
    setOpenedItems([]);
  };

  /**
   * Handles note item reorder
   */
  const handleEditEntriesOrderClick = () => {
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

      return (
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
      );
    },
    [
      deleteNotebookEntry,
      editOrder,
      handleElementDrag,
      handleElementDrop,
      noteInTheEditor,
      openedItems,
      toggleNotebookEditor,
    ]
  );

  /**
   * Handles adding new note
   */
  const handleAddNewNoteClick = () => {
    toggleNotebookEditor({ open: true });
  };

  return (
    <div className="notebook__items">
      <div className="notebook__items-actions">
        <div className="notebook__items-actions-primary">
          <IconButton
            icon="plus"
            buttonModifiers={["notebook-action"]}
            onClick={handleAddNewNoteClick}
          />
          <IconButton
            icon="move"
            buttonModifiers={["notebook-action"]}
            onClick={handleEditEntriesOrderClick}
          />
        </div>
        <div className="notebook__items-actions-secondary">
          <IconButton
            icon="arrow-down"
            buttonModifiers={["notebook-action"]}
            onClick={handleOpenAllClick}
          />
          <IconButton
            icon="arrow-up"
            buttonModifiers={["notebook-action"]}
            onClick={handleCloseAllClick}
          />
        </div>
      </div>
      <div className="notebook__items-list">
        {notebook.state === "LOADING" ? (
          <div className="empty-loader" />
        ) : notes ? (
          notes.map((note, index) => renderNote(note, index))
        ) : (
          <div className="empty">
            <span>Ei muistiinpanoja</span>
          </div>
        )}
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
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      updateNotebookEntriesOrder,
      toggleNotebookEditor,
      deleteNotebookEntry,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);

/////////  //  ////  ///     /////     ///////     ////////     /////
/////////  //  ////  ///  //  ////  //  /////  ///  ///////    //////
/////////      ////  ///     /////     /////  /////  //////   ///////
/////////  //  ////  ///  ////////  ///////  //  ///  ///////////////
/////////  //  ////  ///  ////////  //////  /////////  ////  ////////

/**
 * NoteListItemProps
 */
interface NoteListItemProps {
  note: WorkspaceNote;
  isEdited: boolean;
  open: boolean;
  onOpenClick?: (noteId: number) => void;
  onEditClick?: (note: WorkspaceNote) => void;
  onDeleteClick?: (noteId: number) => void;
}

/**
 * Creates NoteListItem component
 *
 * @param props props
 * @returns JSX.Element
 */
export const NoteListItem: React.FC<NoteListItemProps> = (props) => {
  const { open, onOpenClick, note } = props;

  const [showContent, setShowContent] = React.useState<boolean>(false);

  React.useEffect(() => {
    setShowContent(open);
  }, [open]);

  /**
   * Shows diary content
   */
  const handleOpenClick = () => {
    if (onOpenClick) {
      onOpenClick(note.id);
    }

    setShowContent(!showContent);
  };

  /**
   * Handles edit click
   */
  const handleEditClick = () => {
    if (props.onEditClick) {
      props.onEditClick(props.note);
    }
  };

  /**
   * Handles delete click
   */
  const handleDeleteClick = () => {
    if (props.onDeleteClick) {
      props.onDeleteClick(props.note.id);
    }
  };

  return (
    <div className="notebook__item" key={props.note.id}>
      <div className="notebook__item-header">
        <div className="notebook__item-actions">
          <IconButton
            icon="pencil"
            onClick={handleEditClick}
            disabled={props.isEdited}
            buttonModifiers={["notebook-action"]}
          />

          <IconButton
            icon="trash"
            onClick={handleDeleteClick}
            disabled={props.isEdited}
            buttonModifiers={["notebook-action"]}
          />
        </div>
      </div>
      <div className="notebook__item-title" onClick={handleOpenClick}>
        {props.note.title}
      </div>

      <AnimateHeight height={showContent ? "auto" : 28}>
        <article className="notebook__item-body rich-text">
          <CkeditorContentLoader html={props.note.workspaceNote} />
        </article>
      </AnimateHeight>
    </div>
  );
};
