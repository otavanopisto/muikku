import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import { i18nType } from "reducers/base/i18nOLD";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import {
  CreateWorkspaceJournalForCurrentWorkspaceTriggerType,
  createWorkspaceJournalForCurrentWorkspace,
  UpdateWorkspaceJournalInCurrentWorkspaceTriggerType,
  updateWorkspaceJournalInCurrentWorkspace,
} from "~/actions/workspaces/journals";
import { WorkspaceJournalWithComments } from "~/reducers/workspaces/journals";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * NewEditJournalProps
 */
interface WorkspaceJournalEditorProps extends WithTranslation<["common"]> {
  type?: "new" | "edit";
  i18nOLD: i18nType;
  journal?: WorkspaceJournalWithComments;
  createWorkspaceJournalForCurrentWorkspace: CreateWorkspaceJournalForCurrentWorkspaceTriggerType;
  updateWorkspaceJournalInCurrentWorkspace: UpdateWorkspaceJournalInCurrentWorkspaceTriggerType;
  onClose?: () => void;
}

/**
 * NewEditJournalState
 */
interface WorkspaceJournalEditorState {
  text: string;
  title: string;
  locked: boolean;
  draftId: string;
}

/**
 * NewEditJournal
 */
class WorkspaceJournalEditor extends SessionStateComponent<
  WorkspaceJournalEditorProps,
  WorkspaceJournalEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceJournalEditorProps) {
    /**
     * This is wierd one, setting namespace and identificated type for it from props...
     */
    super(props, `journal-${props.type ? props.type : "new"}`);

    const { journal } = props;
    const { userEntityId, workspaceEntityId, id } = journal;

    /**
     * When there is not existing event data we use only user id and workspace id as
     * draft id. There must be at least user id and workspace id, so if making changes to multiple workspace
     * that have same user evaluations, so draft won't class together
     */
    let draftId = `${userEntityId}-${workspaceEntityId}`;

    if (props.journal) {
      draftId = `${userEntityId}-${workspaceEntityId}-${id}`;
    }

    this.state = {
      ...this.getRecoverStoredState(
        {
          text: props.journal ? props.journal.content : "",
          title: props.journal ? props.journal.title : "",
          draftId,
        },
        draftId
      ),
      locked: false,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.setState(
      this.getRecoverStoredState(
        {
          title: this.props.journal ? this.props.journal.title : "",
          text: this.props.journal ? this.props.journal.content : "",
        },
        this.state.draftId
      )
    );
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    this.setStateAndClear(
      {
        title: this.props.journal ? this.props.journal.title : "",
        text: this.props.journal ? this.props.journal.content : "",
      },
      this.state.draftId
    );
  };

  /**
   * onCKEditorChange
   * @param e e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ text: e }, this.state.draftId);
  };

  /**
   * onTitleChange
   * @param e e
   */
  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, maxLength } = e.target;
    const title = value.slice(0, maxLength);

    this.setStateAndStore({ title: title }, this.state.draftId);
  };

  /**
   * createOrModifyJournal
   */
  handleSaveJournalClick = () => {
    this.setState({ locked: true });
    if (!this.props.journal) {
      this.props.createWorkspaceJournalForCurrentWorkspace({
        title: this.state.title,
        content: this.state.text,
        /**
         * success
         */
        success: () => {
          this.setStateAndClear(
            {
              title: "",
              text: "",
              locked: false,
            },
            this.state.draftId,
            () => {
              this.justClear(["title", "content"], this.state.draftId);
              this.props.onClose();
            }
          );
        },
        /**
         * fail
         */
        fail: () => {
          this.setState({ locked: false });
        },
      });
    } else {
      this.props.updateWorkspaceJournalInCurrentWorkspace({
        journal: this.props.journal,
        title: this.state.title,
        content: this.state.text,
        /**
         * success
         */
        success: () => {
          this.setStateAndClear(
            {
              ...this.state,
              locked: false,
            },
            this.props.journal.id,
            () => {
              this.justClear(["title", "content"], this.state.draftId);
              this.props.onClose();
            }
          );
        },
        /**
         * fail
         */
        fail: () => {
          this.setState({ locked: false });
        },
      });
    }
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const editorTitle = this.props.journal
      ? this.props.i18nOLD.text.get(
          "plugin.workspace.journal.editEntry.title"
        ) +
        " - " +
        this.props.i18nOLD.text.get(
          "plugin.workspace.journal.entry.content.label"
        )
      : this.props.i18nOLD.text.get("plugin.workspace.journal.newEntry.title") +
        " - " +
        this.props.i18nOLD.text.get(
          "plugin.workspace.journal.entry.content.label"
        );

    return (
      <div className="form" role="form">
        <div className="env-dialog env-dialog--mainfunction env-dialog--edit-journal-entry">
          <section className="env-dialog__wrapper">
            <div className="env-dialog__content">
              <header className="env-dialog__header">
                {this.props.i18nOLD.text.get(
                  "plugin.workspace.journal.editEntry.title"
                )}
              </header>
              <section className="env-dialog__body">
                <div
                  className="env-dialog__row env-dialog__row--titles"
                  key="2"
                >
                  <div className="env-dialog__form-element-container">
                    <label htmlFor="journalTitle" className="env-dialog__label">
                      {this.props.i18nOLD.text.get(
                        "plugin.workspace.journal.entry.title.label"
                      )}
                    </label>
                    <input
                      id="journalTitle"
                      type="text"
                      className="env-dialog__input env-dialog__input--new-edit-journal-title"
                      value={this.state.title}
                      onChange={this.handleTitleChange}
                      autoFocus={!this.props.journal}
                      maxLength={255}
                      disabled={this.props.journal.isMaterialField}
                    />
                  </div>
                </div>

                <div
                  className="env-dialog__row env-dialog__row--ckeditor"
                  key="3"
                >
                  <div className="env-dialog__form-element-container">
                    <label className="env-dialog__label">
                      {this.props.i18nOLD.text.get(
                        "plugin.workspace.journal.entry.content.label"
                      )}
                    </label>
                    <CKEditor
                      editorTitle={editorTitle}
                      onChange={this.handleCKEditorChange}
                    >
                      {this.state.text}
                    </CKEditor>
                  </div>
                </div>
              </section>
              <footer className="env-dialog__footer">
                <div className="env-dialog__actions">
                  <Button
                    buttonModifiers="dialog-execute"
                    onClick={this.handleSaveJournalClick}
                    disabled={this.state.locked}
                  >
                    {this.props.i18nOLD.text.get(
                      "plugin.workspace.journal.save.button.label"
                    )}
                  </Button>
                  <Button
                    onClick={this.props.onClose}
                    disabled={this.state.locked}
                    buttonModifiers="dialog-cancel"
                  >
                    {this.props.i18nOLD.text.get(
                      "plugin.workspace.journal.cancel.button.label"
                    )}
                  </Button>
                  {this.recovered && (
                    <Button
                      buttonModifiers="dialog-clear"
                      disabled={this.state.locked}
                      onClick={this.handleDeleteEditorDraft}
                    >
                      {this.props.i18nOLD.text.get(
                        "plugin.workspace.journal.deleteDraft.button.label"
                      )}
                    </Button>
                  )}
                </div>
              </footer>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      createWorkspaceJournalForCurrentWorkspace,
      updateWorkspaceJournalInCurrentWorkspace,
    },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceJournalEditor)
);
