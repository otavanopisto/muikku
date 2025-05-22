import * as React from "react";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { Action, bindActionCreators, Dispatch } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  modifyReplyFromCurrentThread,
  ModifyReplyFromCurrentThreadTriggerType,
} from "~/actions/discussion";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";
import { DiscussionThreadReply } from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * ModifyThreadReplyProps
 */
interface ModifyThreadReplyProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  reply?: DiscussionThreadReply;
  modifyReplyFromCurrentThread: ModifyReplyFromCurrentThreadTriggerType;
}

/**
 * ModifyThreadReplyState
 */
interface ModifyThreadReplyState {
  text: string;
  locked: boolean;
}

/**
 * ModifyThreadReply
 */
class ModifyThreadReply extends SessionStateComponent<
  ModifyThreadReplyProps,
  ModifyThreadReplyState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ModifyThreadReplyProps) {
    super(props, "discussion-modify-thread-reply");

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.modifyReply = this.modifyReply.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);

    this.state = this.getRecoverStoredState(
      {
        locked: false,
        text: props.reply.message,
      },
      props.reply.id
    );
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: ModifyThreadReplyProps) {
    if (nextProps.reply.id !== this.props.reply.id) {
      this.setState(
        this.getRecoverStoredState(
          {
            text: nextProps.reply.message,
          },
          nextProps.reply.id
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
        text: this.props.reply.message,
      },
      this.props.reply.id
    );
  }
  /**
   * clearUp
   */
  clearUp() {
    this.setStateAndClear(
      {
        text: this.props.reply.message,
      },
      this.props.reply.id
    );
  }

  /**
   * onCKEditorChange
   * @param text text
   */
  onCKEditorChange(text: string) {
    this.setStateAndStore({ text }, this.props.reply.id);
  }

  /**
   * modifyReply
   * @param closeDialog closeDialog
   */
  modifyReply(closeDialog: () => void) {
    this.setState({
      locked: true,
    });
    this.props.modifyReplyFromCurrentThread({
      reply: this.props.reply,
      message: this.state.text,
      /**
       * success
       */
      success: () => {
        this.justClear(["text"], this.props.reply.id);
        this.setState({
          locked: false,
        });
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
   * render
   */
  render() {
    const editorTitle =
      this.props.i18n.t("labels.edit") +
      " - " +
      this.props.i18n.t("labels.content");

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => [
      <div className="env-dialog__row env-dialog__row--ckeditor" key="3">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.content")}
          </label>
          <CKEditor
            editorTitle={editorTitle}
            autofocus
            key="1"
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
          onClick={this.modifyReply.bind(this, closeDialog)}
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
        modifier="modify-reply-thread"
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
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ modifyReplyFromCurrentThread }, dispatch);
}

export default withTranslation(["messaging"])(
  connect(null, mapDispatchToProps)(ModifyThreadReply)
);
