import * as React from "react";
import NoteEditor from "./note-editor";
import { IconButton } from "../button";
import { NoteBookState } from "~/reducers/notebook/notebook";
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
} from "../../../actions/notebook/notebook";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceType } from "~/reducers/workspaces/index";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/notebook.scss";
import NoteList from "./note-list";

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
}

/**
 * Creates NoteBook component
 *
 * @param props props
 */
const NoteBook: React.FC<NoteBookProps> = (props) => {
  const { notebook, loadNotebookEntries, toggleNotebookEditor } = props;

  const { notes } = notebook;

  React.useEffect(() => {
    if (notes === null) {
      loadNotebookEntries();
    }
  }, [loadNotebookEntries, notes]);

  /**
   * Handles adding new note
   */
  const handleAddNewNoteClick = () => {
    toggleNotebookEditor({ open: true });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>Muistiinpanot</h1>
        {!notebook.noteEditorOpen && (
          <IconButton icon="plus" onClick={handleAddNewNoteClick} />
        )}
      </div>

      <div
        style={{
          position: "sticky",
          top: "-10px",
          backgroundColor: "white",
          zIndex: "50",
        }}
      >
        <NoteEditor />
      </div>

      <NoteList />
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
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteBook);
