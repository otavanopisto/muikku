import * as React from "react";
import AnimateHeight from "react-animate-height";
import { WorkspaceNote } from "~/reducers/notebook/notebook";
import CKEditor from "../ckeditor";
import SessionStateComponent from "../session-state-component";
import Button from "../button";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceType } from "~/reducers/workspaces";
import {
  SaveNewNotebookEntry,
  saveNewNotebookEntry,
  ToggleNotebookEditor,
  toggleNotebookEditor,
  UpdateEditNotebookEntry,
  updateEditedNotebookEntry,
  ToggleNotebookSelectPosition,
  toggleNotebookSelectPosition,
} from "../../../actions/notebook/notebook";

/**
 * NoteBookProps
 */
interface NoteEditorProps {
  i18n: i18nType;
  status: StatusType;
  /**
   * If used in workspace, this is the current workspace
   */
  currentWorkspace: WorkspaceType;
  /**
   * If editor is used
   */
  editorOpen: boolean;
  /**
   * If note is given, editor will be opened with given note
   * otherwise new note will be created
   */
  note: WorkspaceNote;
  /**
   * Default content for new note
   */
  cutContent: string;
  noteEditorSelectPosition: boolean;
  noteEditedPosition: number | "first" | "last";
  saveNewNotebookEntry: SaveNewNotebookEntry;
  updateEditedNotebookEntry: UpdateEditNotebookEntry;
  toggleNotebookEditor: ToggleNotebookEditor;
  toggleNotebookSelectPosition: ToggleNotebookSelectPosition;
}

/**
 *
 */
interface NoteEditorState {
  noteTitle: string;
  noteContent: string;
  draftId: string;
  locked: boolean;
}

/* eslint-disable camelcase */
const ckEditorConfig = {
  autoGrow_onStartup: true,
  mathJaxLib:
    "//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_SVG",
  mathJaxClass: "math-tex", // This CANNOT be changed as cke saves this to database as part of documents html (wraps the formula in a span with specified className). Don't touch it! ... STOP TOUCHING IT!
  toolbar: [
    {
      name: "basicstyles",
      items: ["Bold", "Italic", "Underline", "RemoveFormat"],
    },
    { name: "clipboard", items: ["Cut", "Copy", "Paste", "Undo", "Redo"] },
    { name: "links", items: ["Link"] },
    {
      name: "insert",
      items: ["Smiley", "SpecialChar", "Muikku-mathjax"],
    },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "styles", items: ["Format"] },
    {
      name: "paragraph",
      items: [
        "NumberedList",
        "BulletedList",
        "Outdent",
        "Indent",
        "Blockquote",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
      ],
    },
    { name: "tools", items: ["Maximize"] },
  ],
  removePlugins: "image,exportpdf",
  extraPlugins: "image2,widget,lineutils,autogrow,muikku-mathjax,divarea",
  resize_enabled: true,
};
/* eslint-enable camelcase */

/**
 * Creates NoteEditor component
 */
class NoteEditor extends SessionStateComponent<
  NoteEditorProps,
  NoteEditorState
> {
  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();
  private focusIsUsed = false;
  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: NoteEditorProps) {
    super(props, `note-editor`);

    const { status, currentWorkspace } = props;

    let draftId = `${status.userId}-${currentWorkspace.id}`;

    if (props.note) {
      draftId += `-${props.note.id}`;
    }

    this.state = {
      ...this.getRecoverStoredState({
        noteTitle: props.note?.title || "",
        noteContent: props.note?.workspaceNote || props?.cutContent || "",
      }),
      locked: false,
      draftId,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.inputRef.current.focus();

    this.setState(
      this.getRecoverStoredState(
        {
          noteTitle: this.props.note?.title || "",
          noteContent:
            this.props.note?.workspaceNote || this.props?.cutContent || "",
        },
        this.state.draftId
      )
    );
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   * @param prevState prevState
   */
  componentDidUpdate(
    prevProps: Readonly<NoteEditorProps>,
    prevState: Readonly<NoteEditorState>
  ): void {
    // Focus input if editor is opened, this is done only once for each active editor
    // and is reset when note is changed or editor is closed
    if (this.props.editorOpen && !this.focusIsUsed) {
      this.inputRef.current.focus();
      this.focusIsUsed = true;
    }

    if (prevProps.note?.id !== this.props.note?.id) {
      const { status, currentWorkspace } = this.props;

      let draftId = `${status.userId}-${currentWorkspace.id}`;

      if (this.props.note) {
        draftId += `-${this.props.note.id}`;
      }

      this.setState(
        this.getRecoverStoredState(
          {
            noteTitle: this.props.note?.title || "",
            noteContent:
              this.props.note?.workspaceNote || this.props?.cutContent || "",
            draftId,
          },
          draftId
        )
      );
    }
  }

  /**
   * Handles note title change
   *
   * @param e event
   */
  handleNoteTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setStateAndStore({ noteTitle: e.target.value }, this.state.draftId);
  };

  /**
   * Handles ckeditor change
   *
   * @param e e
   */
  handleCkeditorChange = (e: string) => {
    this.setStateAndStore({ noteContent: e }, this.state.draftId);
  };

  /**
   * Handles toggling notebook editor
   */
  handleToggleNotebookSelectPositionClick = () => {
    this.props.toggleNotebookSelectPosition(
      !this.props.noteEditorSelectPosition
    );
  };

  /**
   * Handles deleting note draft
   *
   */
  handleDeleteDraftClick = () => {
    this.setStateAndClear(
      {
        noteTitle: this.props.note?.title || "",
        noteContent:
          this.props.note?.workspaceNote || this.props?.cutContent || "",
      },
      this.state.draftId
    );
  };

  /**
   * Saves note
   */
  handleSaveClick = () => {
    if (this.props.note) {
      // Update existing note
      this.props.updateEditedNotebookEntry({
        editedEntry: {
          ...this.props.note,
          title: this.state.noteTitle,
          workspaceNote: this.state.noteContent,
        },
        // eslint-disable-next-line jsdoc/require-jsdoc
        success: () => {
          this.setStateAndClear(
            {
              noteTitle: "",
              noteContent: "",
            },
            this.state.draftId
          );

          this.props.toggleNotebookEditor({ open: false });
          this.focusIsUsed = false;
        },
      });
    } else {
      // Saves new note
      this.props.saveNewNotebookEntry({
        newEntry: {
          title: this.state.noteTitle,
          workspaceNote: this.state.noteContent,
          workspaceEntityId: this.props.currentWorkspace.id,
        },
        // eslint-disable-next-line jsdoc/require-jsdoc
        success: () => {
          this.setStateAndClear(
            {
              noteTitle: "",
              noteContent: "",
            },
            this.state.draftId
          );

          this.props.toggleNotebookEditor({ open: false });
          this.focusIsUsed = false;
        },
      });
    }
  };

  /**
   * Handles cancel click
   */
  handleCancelClick = () => {
    this.props.toggleNotebookEditor({
      open: false,
      notePosition: null,
      noteEditorSelectPosition: false,
    });
    this.focusIsUsed = false;
  };

  /**
   * Component render method
   */
  render() {
    const { editorOpen } = this.props;

    return (
      <AnimateHeight duration={500} height={editorOpen ? "auto" : 0}>
        <div className="">
          <div className="form">
            <div className="form__row">
              <div className="form-element">
                <label htmlFor="note-entry-title" className="">
                  {this.props.i18n.text.get(
                    "plugin.workspace.journal.entry.title.label"
                  )}
                </label>

                <input
                  ref={this.inputRef}
                  className="form-element__input form-element__input--note-title"
                  id="note-entry-title"
                  value={this.state.noteTitle}
                  onChange={this.handleNoteTitleChange}
                />
              </div>
            </div>

            <div className="form__row">
              <div className="form-element">
                <label>
                  {this.props.i18n.text.get(
                    "plugin.workspace.journal.entry.content.label"
                  )}
                </label>

                <CKEditor
                  onChange={this.handleCkeditorChange}
                  ancestorHeight={250}
                  configuration={ckEditorConfig}
                >
                  {this.state.noteContent}
                </CKEditor>
              </div>
            </div>

            <div className="form__row">
              <div className="form-element">
                <label>Sijainti</label>

                <p className="notebook__select-position-info">
                  Oletuksena uusi muistiinpano luodaan listan viimeiseksi.
                  Valitse sijainti -nappia painamalla voit itse valita listasta
                  halutun sijainnin
                </p>

                <button
                  style={{
                    width: "100%",
                    height: "40px",
                    color: "white",
                    backgroundColor: this.props.noteEditorSelectPosition
                      ? "red"
                      : "green",
                    border: "none",
                  }}
                  onClick={this.handleToggleNotebookSelectPositionClick}
                >
                  {this.props.noteEditorSelectPosition
                    ? "Peruuta valinta"
                    : "Valitse sijainti"}
                </button>
              </div>
            </div>

            <div className="form__buttons form__buttons--notebook">
              <Button
                className="button button--dialog-execute"
                disabled={this.state.locked}
                onClick={this.handleSaveClick}
              >
                Tallenna
              </Button>
              <Button
                buttonModifiers="dialog-cancel"
                disabled={this.state.locked}
                onClick={this.handleCancelClick}
              >
                Peruuta
              </Button>
              {this.recovered && (
                <Button
                  buttonModifiers="dialog-clear"
                  disabled={this.state.locked}
                  onClick={this.handleDeleteDraftClick}
                >
                  Poista luonnos
                </Button>
              )}
            </div>
          </div>
        </div>
      </AnimateHeight>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    note: state.notebook.noteInTheEditor,
    noteEditorSelectPosition: state.notebook.noteEditorSelectPosition,
    noteEditedPosition: state.notebook.noteEditedPosition,
    currentWorkspace: state.workspaces.currentWorkspace,
    editorOpen: state.notebook.noteEditorOpen,
    cutContent: state.notebook.noteEditorCutContent,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      saveNewNotebookEntry,
      updateEditedNotebookEntry,
      toggleNotebookEditor,
      toggleNotebookSelectPosition,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor);
