import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { i18nType } from "reducers/base/i18n";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import equals = require("deep-equal");
import {
  CreateWorkspaceJournalForCurrentWorkspaceTriggerType,
  createWorkspaceJournalForCurrentWorkspace,
  UpdateWorkspaceJournalInCurrentWorkspaceTriggerType,
  updateWorkspaceJournalInCurrentWorkspace,
} from "~/actions/workspaces/journals";
import { WorkspaceJournalWithComments } from "~/reducers/workspaces/journals";

/**
 * NewEditJournalProps
 */
interface NewEditJournalProps {
  children: React.ReactElement<any>;
  i18n: i18nType;
  journal?: WorkspaceJournalWithComments;
  createWorkspaceJournalForCurrentWorkspace: CreateWorkspaceJournalForCurrentWorkspaceTriggerType;
  updateWorkspaceJournalInCurrentWorkspace: UpdateWorkspaceJournalInCurrentWorkspaceTriggerType;
}

/**
 * NewEditJournalState
 */
interface NewEditJournalState {
  text: string;
  title: string;
  locked: boolean;
}

/**
 * NewEditJournal
 */
class NewEditJournal extends SessionStateComponent<
  NewEditJournalProps,
  NewEditJournalState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NewEditJournalProps) {
    super(props, "new-edit-journal");

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.createOrModifyJournal = this.createOrModifyJournal.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);

    this.state = this.getRecoverStoredState(
      {
        text: props.journal ? props.journal.content : "",
        title: props.journal ? props.journal.title : "",
        locked: false,
      },
      props.journal ? props.journal.id : ""
    );
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  componentWillReceiveProps(nextProps: NewEditJournalProps) {
    if (nextProps.journal && !equals(this.props.journal, nextProps.journal)) {
      this.setState(
        this.getRecoverStoredState(
          {
            title: nextProps.journal.title,
            text: nextProps.journal.content,
          },
          nextProps.journal.id
        )
      );
    } else if (!nextProps.journal && this.props.journal) {
      this.setState(
        this.getRecoverStoredState(
          {
            title: "",
            text: "",
          },
          ""
        )
      );
    }
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState() {
    if (this.props.journal) {
      this.checkStoredAgainstThisState(
        {
          title: this.props.journal.title,
          text: this.props.journal.content,
        },
        this.props.journal.id
      );
    } else {
      this.checkStoredAgainstThisState(
        {
          title: "",
          text: "",
        },
        ""
      );
    }
  }

  /**
   * clearUp
   */
  clearUp() {
    /**
     * No existing journal or there is only new unsaved journal
     */
    if (!this.props.journal) {
      /**
       * Clearing state and storage if there is existing unsaved journal
       */
      this.setStateAndClear({ title: "", text: "" });
    } else {
      /**
       * Clearing state and storage if there is existing journal
       */
      this.setStateAndClear(
        { title: this.props.journal.title, text: this.props.journal.content },
        this.props.journal.id
      );
    }
  }

  /**
   * onCKEditorChange
   * @param text text
   */
  onCKEditorChange(text: string) {
    this.setStateAndStore(
      { text },
      this.props.journal ? this.props.journal.id : ""
    );
  }

  /**
   * onTitleChange
   * @param e e
   */
  onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, maxLength } = e.target;
    const title = value.slice(0, maxLength);

    this.setStateAndStore(
      { title },
      this.props.journal ? this.props.journal.id : ""
    );
  }

  /**
   * createOrModifyJournal
   * @param closeDialog closeDialog
   */
  createOrModifyJournal(closeDialog: () => any) {
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
            ""
          );
          closeDialog();
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
            this.props.journal.id
          );
          closeDialog();
        },
        /**
         * fail
         */
        fail: () => {
          this.setState({ locked: false });
        },
      });
    }
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const editorTitle = this.props.journal
      ? this.props.i18n.text.get("plugin.workspace.journal.editEntry.title") +
        " - " +
        this.props.i18n.text.get(
          "plugin.communicator.createmessage.title.content"
        )
      : this.props.i18n.text.get("plugin.workspace.journal.newEntry.title") +
        " - " +
        this.props.i18n.text.get(
          "plugin.communicator.createmessage.title.content"
        );

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => [
      <div className="env-dialog__row" key="2">
        <div className="env-dialog__form-element-container">
          <label htmlFor="journalTitle" className="env-dialog__label">
            {this.props.i18n.text.get(
              "plugin.workspace.journal.entry.title.label"
            )}
          </label>
          <input
            id="journalTitle"
            type="text"
            className="env-dialog__input env-dialog__input--new-edit-journal-title"
            value={this.state.title}
            onChange={this.onTitleChange}
            autoFocus={!this.props.journal}
            maxLength={255}
          />
        </div>
      </div>,
      <div className="env-dialog__row env-dialog__row--ckeditor" key="3">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.text.get(
              "plugin.workspace.journal.entry.content.label"
            )}
          </label>
          <CKEditor editorTitle={editorTitle} onChange={this.onCKEditorChange}>
            {this.state.text}
          </CKEditor>
        </div>
      </div>,
    ];

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="env-dialog__actions">
        <Button
          className="button button--dialog-execute"
          onClick={this.createOrModifyJournal.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.journal.save.button.label"
          )}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.journal.cancel.button.label"
          )}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.i18n.text.get(
              "plugin.announcer.createannouncement.button.clearDraft"
            )}
          </Button>
        ) : null}
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="new-edit-journal"
        onOpen={this.checkAgainstStoredState}
        title={
          this.props.journal
            ? this.props.i18n.text.get(
                "plugin.workspace.journal.editEntry.title"
              )
            : this.props.i18n.text.get(
                "plugin.workspace.journal.newEntry.title"
              )
        }
        content={content}
        footer={footer}
      >
        {this.props.children}
      </EnvironmentDialog>
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
    i18n: state.i18n,
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

export default connect(mapStateToProps, mapDispatchToProps)(NewEditJournal);
