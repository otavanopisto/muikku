import { i18nType } from "~/reducers/base/i18nOLD";
import * as React from "react";
import { DiscussionThreadReplyType } from "~/reducers/discussion";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  modifyReplyFromCurrentThread,
  ModifyReplyFromCurrentThreadTriggerType,
} from "~/actions/discussion";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";

import "~/sass/elements/form.scss";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * ModifyThreadReplyProps
 */
interface ModifyThreadReplyProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  reply?: DiscussionThreadReplyType;
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
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  componentWillReceiveProps(nextProps: ModifyThreadReplyProps) {
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
    // TODO: use i18next
    const editorTitle =
      this.props.i18nOLD.text.get("plugin.discussion.reply.edit.topic") +
      " - " +
      this.props.i18nOLD.text.get("plugin.discussion.createmessage.content");

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => [
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
          {this.props.t("common:actions.save")}
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
        modifier="modify-reply-thread"
        // TODO: use i18next
        title={this.props.i18nOLD.text.get(
          "plugin.discussion.reply.edit.topic"
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
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ modifyReplyFromCurrentThread }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(ModifyThreadReply)
);
