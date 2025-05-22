import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { AnyActionType } from "~/actions";
import { DiscussionState } from "~/reducers/discussion";
import {
  modifyDiscussionThread,
  ModifyDiscussionThreadTriggerType,
} from "~/actions/discussion";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/form.scss";
import { DiscussionThread, DiscussionThreadLock } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * ModifyThreadProps
 */
interface ModifyThreadProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  discussion: DiscussionState;
  thread: DiscussionThread;
  modifyDiscussionThread: ModifyDiscussionThreadTriggerType;
  status: StatusType;
}

/**
 * ModifyThreadState
 */
interface ModifyThreadState {
  text: string;
  title: string;
  locked: boolean;
  threadPinned: boolean;
  threadLock: DiscussionThreadLock | null;
}

/**
 * ModifyThread
 */
class ModifyThread extends SessionStateComponent<
  ModifyThreadProps,
  ModifyThreadState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ModifyThreadProps) {
    super(props, "discussion-modify-thread-dialog");

    this.state = this.getRecoverStoredState(
      {
        text: props.thread.message,
        title: props.thread.title,
        locked: false,
        threadPinned: props.thread.sticky,
        threadLock: props.thread.lock,
      },
      props.thread.id
    );

    this.togglePinned = this.togglePinned.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.onLockChange = this.onLockChange.bind(this);
    this.modifyThread = this.modifyThread.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);
    this.clearUp = this.clearUp.bind(this);
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: ModifyThreadProps) {
    if (nextProps.thread.id !== this.props.thread.id) {
      this.setState(
        this.getRecoverStoredState(
          {
            text: nextProps.thread.message,
            title: nextProps.thread.title,
            threadPinned: nextProps.thread.sticky,
            threadLock: nextProps.thread.lock,
          },
          nextProps.thread.id
        )
      );
    }
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState() {
    this.checkStoredAgainstThisState(
      {
        text: this.props.thread.message,
        title: this.props.thread.title,
        threadPinned: this.props.thread.sticky,
        threadLock: this.props.thread.lock,
      },
      this.props.thread.id
    );
  }

  /**
   * onCKEditorChange
   * @param text text
   */
  onCKEditorChange(text: string) {
    this.setStateAndStore({ text }, this.props.thread.id);
  }

  /**
   * clearUp
   */
  clearUp() {
    this.setStateAndClear(
      {
        text: this.props.thread.message,
        title: this.props.thread.title,
        threadPinned: this.props.thread.sticky,
        threadLock: this.props.thread.lock,
      },
      this.props.thread.id
    );
  }

  /**
   * modifyThread
   * @param closeDialog closeDialog
   */
  modifyThread(closeDialog: () => void) {
    if (this.state.locked) {
      return;
    }
    this.setState({ locked: true });

    this.props.modifyDiscussionThread({
      thread: this.props.thread,
      title: this.state.title,
      message: this.state.text,
      sticky: this.state.threadPinned,
      lock: this.state.threadLock,
      /**
       * success
       */
      success: () => {
        this.justClear(
          ["text", "title", "threadPinned", "threadLock"],
          this.props.thread.id
        );
        this.setState({ locked: false });
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

  /**
   * onTitleChange
   * @param e e
   */
  onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setStateAndStore({ title: e.target.value }, this.props.thread.id);
  }

  /**
   * togglePinned
   */
  togglePinned() {
    this.setStateAndStore(
      { threadPinned: !this.state.threadPinned },
      this.props.thread.id
    );
  }

  /**
   * Handles the change of the lock select
   *
   * @param e e
   */
  onLockChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setStateAndStore(
      { threadLock: e.target.value as DiscussionThreadLock },
      this.props.thread.id
    );
  }

  /**
   * render
   */
  render() {
    const options = [
      {
        value: DiscussionThreadLock.All,
        label: this.props.i18n.t("labels.fromAll", {
          ns: "messaging",
        }),
      },
      {
        value: DiscussionThreadLock.Students,
        label: this.props.i18n.t("labels.fromStudents", {
          ns: "messaging",
        }),
      },
      {
        value: "",
        label: "-",
      },
    ];

    const editorTitle =
      this.props.i18n.t("labels.edit") +
      " - " +
      this.props.i18n.t("labels.content");

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => [
      <div key="1" className="env-dialog__row env-dialog__row--titles">
        <div className="env-dialog__form-element-container">
          <label htmlFor="messageTitle" className="env-dialog__label">
            {this.props.i18n.t("labels.title", {
              ns: "messaging",
              context: "message",
            })}
          </label>
          <input
            id="messageTitle"
            className="env-dialog__input env-dialog__input--new-discussion-thread-title"
            placeholder={this.props.i18n.t("labels.title", {
              ns: "messaging",
              context: "message",
            })}
            value={this.state.title}
            onChange={this.onTitleChange}
            autoFocus
          />
        </div>
      </div>,
      this.props.status.permissions.FORUM_LOCK_STICKY_PERMISSION ? (
        <div key="2" className="env-dialog__row env-dialog__row--options">
          <div className="env-dialog__form-element-container">
            <label htmlFor="messageLock" className="env-dialog__label">
              {this.props.i18n.t("actions.lock", {
                ns: "messaging",
                context: "thread",
              })}
            </label>
            <select
              id="messageLock"
              className="env-dialog__select"
              value={this.state.threadLock || ""}
              onChange={this.onLockChange}
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="env-dialog__form-element-container env-dialog__form-element-container--pinned-thread">
            <input
              id="messagePinned"
              type="checkbox"
              className="env-dialog__input"
              checked={this.state.threadPinned}
              onChange={this.togglePinned}
            />
            <label htmlFor="messagePinned" className="env-dialog__input-label">
              {this.props.i18n.t("labels.pin", { ns: "messaging" })}
            </label>
          </div>
        </div>
      ) : null,
      <div className="env-dialog__row env-dialog__row--ckeditor" key="3">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.content")}
          </label>
          <CKEditor
            editorTitle={editorTitle}
            key="3"
            onChange={this.onCKEditorChange}
          >
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
          buttonModifiers="dialog-execute"
          onClick={this.modifyThread.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.save")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.t("actions.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.t("actions.remove", { context: "draft" })}
          </Button>
        ) : null}
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="modify-message"
        title={this.props.i18n.t("labels.edit")}
        content={content}
        footer={footer}
        onOpen={this.checkAgainstStoredState}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    discussion: state.discussion,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ modifyDiscussionThread }, dispatch);
}

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(ModifyThread)
);
