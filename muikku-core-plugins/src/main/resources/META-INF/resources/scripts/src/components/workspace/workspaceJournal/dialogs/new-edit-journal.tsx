import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
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
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * NewEditJournalProps
 */
interface NewEditJournalProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
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
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: NewEditJournalProps) {
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
  createOrModifyJournal(closeDialog: () => void) {
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
    const { t } = this.props;

    t("labels.content");

    const editorTitle = this.props.journal
      ? t("labels.edit", { ns: "journal" }) + " - " + t("labels.content")
      : t("labels.create", { ns: "journal" }) +
        " - " +
        t("labels.edit", { ns: "journal" });

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => [
      <div className="env-dialog__row" key="2">
        <div className="env-dialog__form-element-container">
          <label htmlFor="journalTitle" className="env-dialog__label">
            {t("labels.title")}
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
          <label className="env-dialog__label">{t("labels.content")}</label>
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
    const footer = (closeDialog: () => void) => (
      <div className="env-dialog__actions">
        <Button
          className="button button--dialog-execute"
          onClick={this.createOrModifyJournal.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {t("actions.save")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {t("actions.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {t("actions.remove", { context: "draft" })}
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
            ? t("labels.edit", { ns: "journal" })
            : t("labels.create", { ns: "journal" })
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
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      createWorkspaceJournalForCurrentWorkspace,
      updateWorkspaceJournalInCurrentWorkspace,
    },
    dispatch
  );
}

export default withTranslation(["journal", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(NewEditJournal)
);
