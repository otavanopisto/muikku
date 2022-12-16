import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18nOLD";
import { DiscussionType } from "~/reducers/discussion";
import {
  createDiscussionThread,
  CreateDiscussionThreadTriggerType,
} from "~/actions/discussion";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";

import "~/sass/elements/form.scss";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * DicussionNewThreadProps
 */
interface DicussionNewThreadProps extends WithTranslation<["common"]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  i18nOLD: i18nType;
  discussion: DiscussionType;
  createDiscussionThread: CreateDiscussionThreadTriggerType;
  status: StatusType;
}

/**
 * DicussionNewThreadState
 */
interface DicussionNewThreadState {
  text: string;
  title: string;
  locked: boolean;
  threadPinned: boolean;
  threadLocked: boolean;
  threadSubscribed: boolean;
  selectedAreaId: number;
}

/**
 * DicussionNewThread
 */
class DicussionNewThread extends SessionStateComponent<
  DicussionNewThreadProps,
  DicussionNewThreadState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DicussionNewThreadProps) {
    super(props, "discussion-new-thread");

    this.state = this.getRecoverStoredState(
      {
        text: "",
        title: "",
        locked: false,
        threadPinned: false,
        threadLocked: false,
        selectedAreaId:
          props.discussion.areaId ||
          (props.discussion.areas[0] && props.discussion.areas[0].id),
      },
      props.discussion.areaId ||
        (props.discussion.areas[0] && props.discussion.areas[0].id)
    );

    this.togglePinned = this.togglePinned.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.toggleSubscribeThread = this.toggleSubscribeThread.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.onAreaChange = this.onAreaChange.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  componentWillReceiveProps(nextProps: DicussionNewThreadProps) {
    if (
      (nextProps.discussion.areaId !== this.state.selectedAreaId &&
        nextProps.discussion.areaId) ||
      !this.state.selectedAreaId
    ) {
      this.setState(
        this.getRecoverStoredState(
          {
            text: "",
            title: "",
            locked: false,
            threadPinned: false,
            threadLocked: false,
            selectedAreaId:
              nextProps.discussion.areaId ||
              (nextProps.discussion.areas[0] &&
                nextProps.discussion.areas[0].id),
          },
          nextProps.discussion.areaId ||
            (nextProps.discussion.areas[0] && nextProps.discussion.areas[0].id)
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
        text: "",
        title: "",
        threadPinned: false,
        threadLocked: false,
      },
      this.state.selectedAreaId
    );
  }

  /**
   * clearUp
   */
  clearUp() {
    this.setStateAndClear(
      {
        text: "",
        title: "",
        threadPinned: false,
        threadLocked: false,
      },
      this.state.selectedAreaId
    );
  }

  /**
   * onCKEditorChange
   * @param text text
   */
  onCKEditorChange(text: string) {
    this.setStateAndStore({ text }, this.state.selectedAreaId);
  }

  /**
   * createThread
   * @param closeDialog closeDialog
   */
  createThread(closeDialog: () => void) {
    this.setState({
      locked: true,
    });
    this.props.createDiscussionThread({
      forumAreaId: this.state.selectedAreaId,
      locked: this.state.threadLocked,
      sticky: this.state.threadPinned,
      subscribe: this.state.threadSubscribed,
      message: this.state.text,
      title: this.state.title,
      /**
       * success
       */
      success: () => {
        this.setStateAndClear(
          {
            text: "",
            title: "",
            locked: false,
            threadLocked: false,
            threadPinned: false,
          },
          this.state.selectedAreaId
        );
        closeDialog();
      },
      /**
       * fail
       */
      fail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  }

  /**
   * onTitleChange
   * @param e e
   */
  onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setStateAndStore({ title: e.target.value }, this.state.selectedAreaId);
  }

  /**
   * togglePinned
   */
  togglePinned() {
    this.setStateAndStore(
      { threadPinned: !this.state.threadPinned },
      this.state.selectedAreaId
    );
  }

  /**
   * toggleLocked
   */
  toggleLocked() {
    this.setStateAndStore(
      { threadLocked: !this.state.threadLocked },
      this.state.selectedAreaId
    );
  }

  /**
   * toggleLocked
   */
  toggleSubscribeThread() {
    this.setStateAndStore(
      { threadSubscribed: !this.state.threadSubscribed },
      this.state.selectedAreaId
    );
  }

  /**
   * onAreaChange
   * @param e e
   */
  onAreaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSelectedAreaId = parseInt(e.target.value);
    this.justClear(
      ["text", "title", "threadPinned", "threadLocked"],
      this.state.selectedAreaId
    );
    this.setStateAndStore(
      this.getRecoverStoredState(
        {
          text: this.state.text,
          title: this.state.title,
          threadPinned: this.state.threadPinned,
          threadLocked: this.state.threadLocked,
        },
        newSelectedAreaId
      ),
      newSelectedAreaId
    );
    this.setState({
      selectedAreaId: newSelectedAreaId,
    });
  }

  /**
   * render
   */
  render() {
    // TODO: use i18next
    const editorTitle =
      this.props.i18nOLD.text.get("plugin.discussion.createmessage.topic") +
      " - " +
      this.props.i18nOLD.text.get("plugin.discussion.createmessage.content");

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => [
      <div key="1" className="env-dialog__row env-dialog__row--titles">
        <div className="env-dialog__form-element-container">
          <label htmlFor="messageTitle" className="env-dialog__label">
            {
              // TODO: use i18next
              this.props.i18nOLD.text.get(
                "plugin.discussion.createmessage.title"
              )
            }
          </label>
          <input
            id="messageTitle"
            className="env-dialog__input env-dialog__input--new-discussion-thread-title"
            value={this.state.title}
            onChange={this.onTitleChange}
            autoFocus
          />
        </div>
        <div className="env-dialog__form-element-container">
          <label htmlFor="messageArea" className="env-dialog__label">
            {
              // TODO: use i18next
              this.props.i18nOLD.text.get(
                "plugin.discussion.createmessage.area"
              )
            }
          </label>
          <select
            id="messageArea"
            className="env-dialog__select"
            value={this.state.selectedAreaId}
            onChange={this.onAreaChange}
          >
            {this.props.discussion.areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
      </div>,
      this.props.status.permissions.FORUM_LOCK_STICKY_PERMISSION ? (
        <div key="2" className="env-dialog__row env-dialog__row--options">
          <div className="env-dialog__form-element-container env-dialog__form-element-container--pinned-thread">
            <input
              id="messagePinned"
              type="checkbox"
              className="env-dialog__input"
              checked={this.state.threadPinned}
              onChange={this.togglePinned}
            />
            <label htmlFor="messagePinned" className="env-dialog__input-label">
              {
                // TODO: use i18next
                this.props.i18nOLD.text.get(
                  "plugin.discussion.createmessage.pinned"
                )
              }
            </label>
          </div>
          <div className="env-dialog__form-element-container env-dialog__form-element-container--locked-thread">
            <input
              id="messageLocked"
              type="checkbox"
              className="env-dialog__input"
              checked={this.state.threadLocked}
              onChange={this.toggleLocked}
            />
            <label htmlFor="messageLocked" className="env-dialog__input-label">
              {
                // TODO: use i18next
                this.props.i18nOLD.text.get(
                  "plugin.discussion.createmessage.locked"
                )
              }
            </label>
          </div>
          <div className="env-dialog__form-element-container env-dialog__form-element-container--locked-thread">
            <input
              id="messageLocked"
              type="checkbox"
              className="env-dialog__input"
              checked={this.state.threadSubscribed}
              onChange={this.toggleSubscribeThread}
            />
            <label htmlFor="messageLocked" className="env-dialog__input-label">
              {
                // TODO: use i18next
                this.props.i18nOLD.text.get(
                  "plugin.discussion.createmessage.subscribe"
                )
              }
            </label>
          </div>
        </div>
      ) : (
        <div key="2" className="env-dialog__row env-dialog__row--options" />
      ),
      <div className="env-dialog__row env-dialog__row--ckeditor" key="3">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {
              // TODO: use i18next
              this.props.i18nOLD.text.get(
                "plugin.discussion.createmessage.content"
              )
            }
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
          onClick={this.createThread.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("common:actions.send")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.t("common:actions.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.t("common:actions.remove_draft")}
          </Button>
        ) : null}
      </div>
    );
    return (
      <EnvironmentDialog
        modifier="new-message"
        // TODO: use i18next
        title={this.props.i18nOLD.text.get(
          "plugin.discussion.createmessage.topic"
        )}
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
    i18nOLD: state.i18nOLD,
    discussion: state.discussion,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ createDiscussionThread }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(DicussionNewThread)
);
