import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import {
  DiscussionThreadType,
  DiscussionThreadReplyType
} from "~/reducers/discussion";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import Link from "~/components/general/link";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  replyToCurrentDiscussionThread,
  ReplyToCurrentDiscussionThreadTriggerType
} from "~/actions/discussion";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";

import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";

/**
 * ReplyThreadDrawerProps
 */
interface ReplyThreadDrawerProps {
  i18n: i18nType;
  reply?: DiscussionThreadReplyType;
  quote?: string;
  quoteAuthor?: string;
  currentId: number;
  replyToCurrentDiscussionThread: ReplyToCurrentDiscussionThreadTriggerType;
  onClickCancel: () => void;
}

/**
 * ReplyThreadDrawerState
 */
interface ReplyThreadDrawerState {
  text: string;
  locked: boolean;
}

/**
 * ReplyThreadDrawer
 */
class ReplyThreadDrawer extends SessionStateComponent<
  ReplyThreadDrawerProps,
  ReplyThreadDrawerState
> {
  constructor(props: ReplyThreadDrawerProps) {
    super(props, "discussion-reply-thread");

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.createReply = this.createReply.bind(this);
    this.clearUp = this.clearUp.bind(this);

    this.state = this.getRecoverStoredState(
      {
        locked: false,
        text:
          props.quote && props.quoteAuthor
            ? "<blockquote><p><strong>" +
              props.quoteAuthor +
              "</strong></p>" +
              props.quote +
              "</blockquote> <p></p>"
            : ""
      },
      props.currentId +
        (props.quote ? "-q" : "") +
        (props.reply ? "-" + props.reply.id : "")
    );
  }

  /**
   * onCKEditorChange
   * @param text
   */
  onCKEditorChange(text: string) {
    this.setStateAndStore(
      { text },
      this.props.currentId +
        (this.props.quote ? "-q" : "") +
        (this.props.reply ? "-" + this.props.reply.id : "")
    );
  }

  /**
   * clearUp
   */
  clearUp() {
    this.setStateAndClear(
      {
        text:
          this.props.quote && this.props.quoteAuthor
            ? "<blockquote><p><strong>" +
              this.props.quoteAuthor +
              "</strong></p>" +
              this.props.quote +
              "</blockquote> <p></p>"
            : ""
      },
      this.props.currentId +
        (this.props.quote ? "-q" : "") +
        (this.props.reply ? "-" + this.props.reply.id : "")
    );
  }

  /**
   * createReply
   * @param closeDialog
   */
  createReply() {
    this.setState({
      locked: true
    });
    this.props.replyToCurrentDiscussionThread({
      parentId:
        this.props.reply &&
        (this.props.reply.parentReplyId || this.props.reply.id),
      message: this.state.text,
      success: () => {
        this.props.onClickCancel && this.props.onClickCancel();
        this.setStateAndClear(
          {
            text:
              this.props.quote && this.props.quoteAuthor
                ? "<blockquote><p><strong>" +
                  this.props.quoteAuthor +
                  "</strong></p>" +
                  this.props.quote +
                  "</blockquote> <p></p>"
                : "",
            locked: false
          },
          this.props.currentId +
            (this.props.quote ? "-q" : "") +
            (this.props.reply ? "-" + this.props.reply.id : "")
        );
      },
      fail: () => {
        this.setState({
          locked: false
        });
      }
    });
  }

  /**
   * handleOnCancelClick
   */
  handleOnCancelClick = () => {
    this.props.onClickCancel && this.props.onClickCancel();
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    let editorTitle =
      this.props.i18n.text.get("plugin.discussion.answertomessage.topic") +
      " - " +
      this.props.i18n.text.get("plugin.discussion.createmessage.content");

    let content = (
      <div className="env-dialog__row env-dialog__row--ckeditor">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.text.get(
              "plugin.discussion.createmessage.content"
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

    let footer = (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.createReply.bind(this)}
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
              "plugin.discussion.createmessage.clearDraft"
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
              {this.props.i18n.text.get(
                "plugin.discussion.answertomessage.topic"
              )}
            </header>
            <section className="env-dialog__body">{content}</section>
            <footer className="env-dialog__footer">{footer}</footer>
          </div>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    currentId: state.discussion.current.id
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ replyToCurrentDiscussionThread }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplyThreadDrawer);
