import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { DiscussionThreadReplyType } from "~/reducers/discussion";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import {
  modifyReplyFromCurrentThread,
  ModifyReplyFromCurrentThreadTriggerType,
} from "~/actions/discussion";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";

import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";

/**
 * ModifyThreadReplyDrawerProps
 */
interface ModifyThreadReplyDrawerProps {
  i18n: i18nType;
  reply?: DiscussionThreadReplyType;
  modifyReplyFromCurrentThread: ModifyReplyFromCurrentThreadTriggerType;
  onClickCancel: () => void;
}

/**
 * ModifyThreadReplyDrawerState
 */
interface ModifyThreadReplyDrawerState {
  text: string;
  locked: boolean;
}

/**
 * ModifyThreadReplyDrawer
 */
class ModifyThreadReplyDrawer extends SessionStateComponent<
  ModifyThreadReplyDrawerProps,
  ModifyThreadReplyDrawerState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: ModifyThreadReplyDrawerProps) {
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
      props.reply.id,
    );
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState() {
    this.checkStoredAgainstThisState(
      {
        text: this.props.reply.message,
      },
      this.props.reply.id,
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
      this.props.reply.id,
    );
  }

  /**
   * componentWillReceiveProps
   * @param nextProps
   */
  componentWillReceiveProps(nextProps: ModifyThreadReplyDrawerProps) {
    if (nextProps.reply.id !== this.props.reply.id) {
      this.setState(
        this.getRecoverStoredState(
          {
            text: nextProps.reply.message,
          },
          nextProps.reply.id,
        ),
      );
    }
  }

  /**
   * onCKEditorChange
   * @param text
   */
  onCKEditorChange(text: string) {
    this.setStateAndStore({ text }, this.props.reply.id);
  }

  /**
   * modifyReply
   */
  modifyReply() {
    this.setState({
      locked: true,
    });
    this.props.modifyReplyFromCurrentThread({
      reply: this.props.reply,
      message: this.state.text,
      success: () => {
        this.props.onClickCancel && this.props.onClickCancel();
        this.justClear(["text"], this.props.reply.id);
        this.setState({
          locked: false,
        });
      },
      fail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  }

  handleOnCancelClick = () => {
    this.props.onClickCancel && this.props.onClickCancel();
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const editorTitle =
      this.props.i18n.text.get("plugin.discussion.editmessage.topic") +
      " - " +
      this.props.i18n.text.get("plugin.discussion.createmessage.content");

    /**
     * content
     */
    const content = (
      <div className="env-dialog__row env-dialog__row--ckeditor">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.text.get(
              "plugin.discussion.createmessage.content",
            )}
          </label>
          <CKEditor
            editorTitle={editorTitle}
            autofocus
            onChange={this.onCKEditorChange}
          >
            {this.state.text}
          </CKEditor>
        </div>
      </div>
    );

    /**
     * footer
     */
    const footer = (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.modifyReply.bind(this)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get("plugin.discussion.createmessage.send")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={this.handleOnCancelClick}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get("plugin.discussion.createmessage.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.i18n.text.get(
              "plugin.discussion.createmessage.clearDraft",
            )}
          </Button>
        ) : null}
      </div>
    );

    return (
      <div className="env-dialog env-dialog--mainfunction env-dialog--reply-message">
        <section className="env-dialog__wrapper">
          <div className="env-dialog__content">
            <header className="env-dialog__header">
              {this.props.i18n.text.get("plugin.discussion.editmessage.topic")}
            </header>
            <section className="env-dialog__body">{content}</section>
            <footer className="env-dialog__footer">{footer}</footer>
          </div>
        </section>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ modifyReplyFromCurrentThread }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModifyThreadReplyDrawer);
