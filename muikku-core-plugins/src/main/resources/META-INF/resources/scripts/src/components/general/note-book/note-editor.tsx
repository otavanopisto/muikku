import * as React from "react";
import AnimateHeight from "react-animate-height";
import { NoteDefaultLocation } from "~/reducers/notebook/notebook";
import CKEditor from "../ckeditor";
import { MATHJAXSRC } from "~/lib/mathjax";
import SessionStateComponent from "../session-state-component";
import Button from "../button";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceDataType } from "~/reducers/workspaces";
import Select from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import {
  SaveNewNotebookEntry,
  saveNewNotebookEntry,
  ToggleNotebookEditor,
  toggleNotebookEditor,
  UpdateEditNotebookEntry,
  updateEditedNotebookEntry,
} from "../../../actions/notebook/notebook";
import { withTranslation, WithTranslation } from "react-i18next";
import { WorkspaceNote } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * NoteBookProps
 */
interface NoteEditorProps extends WithTranslation {
  status: StatusType;
  /**
   * If used in workspace, this is the current workspace
   */
  currentWorkspace: WorkspaceDataType;
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
   * Default location for new note
   */
  defaultLocation: NoteDefaultLocation;
  noteEditedPosition: number;
  saveNewNotebookEntry: SaveNewNotebookEntry;
  updateEditedNotebookEntry: UpdateEditNotebookEntry;
  toggleNotebookEditor: ToggleNotebookEditor;
}

/**
 *
 */
interface NoteEditorState {
  noteTitle: string;
  noteContent: string;
  draftId: string;
  locked: boolean;
  defaultLocation: NoteDefaultLocation;
}

const options: OptionDefault<NoteDefaultLocation>[] = [
  {
    value: "BOTTOM",
    label: "Viimeinen",
  },
  {
    value: "TOP",
    label: "Ensimmäinen",
  },
];

/* eslint-disable camelcase */
const ckEditorConfig = {
  autoGrow_onStartup: true,
  mathJaxLib: MATHJAXSRC,
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
        noteContent: props.note?.workspaceNote || "",
      }),
      locked: false,
      draftId,
      defaultLocation: props.defaultLocation,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.inputRef.current.focus();

    this.setState({
      ...this.getRecoverStoredState(
        {
          noteTitle: this.props.note?.title || "",
          noteContent: this.props.note?.workspaceNote || "",
        },
        this.state.draftId
      ),
    });
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

    // Because editor is already mounted and only hidden,
    // when editor is opened we need to set default location redux value to state
    if (this.props.editorOpen && !this.state.defaultLocation) {
      this.setState({
        defaultLocation: this.props.defaultLocation,
      });
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
            noteContent: this.props.note?.workspaceNote || "",
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
   * Handles deleting note draft
   *
   */
  handleDeleteDraftClick = () => {
    this.setStateAndClear(
      {
        noteTitle: this.props.note?.title || "",
        noteContent: this.props.note?.workspaceNote || "",
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
        defaultPosition: this.state.defaultLocation,
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
   * Handles default position select change
   *
   * @param e e
   */
  handleDefaultPositionSelectChange = (
    e: OptionDefault<NoteDefaultLocation>
  ) => {
    this.setState({
      defaultLocation: e.value,
    });
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
                <label htmlFor="note-entry-title">
                  {this.props.t("labels.title")}
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
                <label>{this.props.t("labels.content")}</label>

                <CKEditor
                  onChange={this.handleCkeditorChange}
                  ancestorHeight={250}
                  configuration={ckEditorConfig}
                >
                  {this.state.noteContent}
                </CKEditor>
              </div>
            </div>

            {!this.props.note && (
              <div className="form__row">
                <div className="form-element">
                  <label>
                    {this.props.t("labels.defaultPosition", {
                      ns: "notebook",
                    })}
                  </label>

                  <Select
                    className="react-select-override"
                    classNamePrefix="react-select-override"
                    id="selectUsers"
                    options={options}
                    value={options.find(
                      (o) => o.value === this.state.defaultLocation
                    )}
                    onChange={this.handleDefaultPositionSelectChange}
                    styles={{
                      // eslint-disable-next-line jsdoc/require-jsdoc
                      container: (baseStyles, state) => ({
                        ...baseStyles,
                        width: "fit-content",
                      }),
                    }}
                  />
                  <div className="notebook__select-position-info">
                    {this.state.defaultLocation === "BOTTOM" ? (
                      <p>
                        {this.props.t("content.defaultPosition", {
                          ns: "notebook",
                          context: "bottom",
                        })}
                      </p>
                    ) : (
                      <p>
                        {this.props.t("content.defaultPosition", {
                          ns: "notebook",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="form__buttons form__buttons--notebook">
              <Button
                className="button button--dialog-execute"
                disabled={this.state.locked}
                onClick={this.handleSaveClick}
              >
                {this.props.t("actions.save")}
              </Button>
              <Button
                buttonModifiers="dialog-cancel"
                disabled={this.state.locked}
                onClick={this.handleCancelClick}
              >
                {this.props.t("actions.cancel")}
              </Button>

              {this.recovered && (
                <Button
                  buttonModifiers="dialog-clear"
                  disabled={this.state.locked}
                  onClick={this.handleDeleteDraftClick}
                >
                  {this.props.t("actions.remove", {
                    ns: "common",
                    context: "draft",
                  })}
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
    status: state.status,
    note: state.notebook.noteInTheEditor,
    defaultLocation: state.notebook.noteDefaultLocation,
    noteEditedPosition: state.notebook.noteEditedPosition,
    currentWorkspace: state.workspaces.currentWorkspace,
    editorOpen: state.notebook.noteEditorOpen,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      saveNewNotebookEntry,
      updateEditedNotebookEntry,
      toggleNotebookEditor,
    },
    dispatch
  );
}

export default withTranslation("notebook")(
  connect(mapStateToProps, mapDispatchToProps)(NoteEditor)
);
