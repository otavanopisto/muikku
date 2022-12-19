import { i18nType } from "~/reducers/base/i18nOLD";
import * as React from "react";
import { DiscussionThreadReplyType } from "~/reducers/discussion";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  replyToCurrentDiscussionThread,
  ReplyToCurrentDiscussionThreadTriggerType,
} from "~/actions/discussion";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";

import "~/sass/elements/form.scss";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * ReplyThreadProps
 */
interface ReplyThreadProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  reply?: DiscussionThreadReplyType;
  quote?: string;
  quoteAuthor?: string;
  currentId: number;
  replyToCurrentDiscussionThread: ReplyToCurrentDiscussionThreadTriggerType;
}

/**
 * ReplyThreadState
 */
interface ReplyThreadState {
  text: string;
  locked: boolean;
}

/**
 * ReplyThread
 */
class ReplyThread extends SessionStateComponent<
  ReplyThreadProps,
  ReplyThreadState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ReplyThreadProps) {
    super(props, "discussion-reply-thread");

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.createReply = this.createReply.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.onDialogOpen = this.onDialogOpen.bind(this);

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
            : "",
      },
      props.currentId +
        (props.quote ? "-q" : "") +
        (props.reply ? "-" + props.reply.id : "")
    );
  }

  /**
   * onCKEditorChange
   * @param text onCKEditorChange
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
            : "",
      },
      this.props.currentId +
        (this.props.quote ? "-q" : "") +
        (this.props.reply ? "-" + this.props.reply.id : "")
    );
  }

  /**
   * createReply
   * @param closeDialog closeDialog
   */
  createReply(closeDialog: () => void) {
    this.setState({
      locked: true,
    });
    this.props.replyToCurrentDiscussionThread({
      parentId:
        this.props.reply &&
        (this.props.reply.parentReplyId || this.props.reply.id),
      message: this.state.text,
      /**
       * success
       */
      success: () => {
        closeDialog();
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
            locked: false,
          },
          this.props.currentId +
            (this.props.quote ? "-q" : "") +
            (this.props.reply ? "-" + this.props.reply.id : "")
        );
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
   * onDialogOpen
   */
  onDialogOpen() {
    //Text might have not loaded if quoteAuthor or quote wasn't ready
    if (this.props.quote && this.props.quoteAuthor && !this.state.text) {
      this.setState(
        this.getRecoverStoredState(
          {
            text:
              "<blockquote><p><strong>" +
              this.props.quoteAuthor +
              "</strong></p>" +
              this.props.quote +
              "</blockquote> <p></p>",
          },
          this.props.currentId +
            "-q" +
            (this.props.reply ? "-" + this.props.reply.id : "")
        )
      );
    } else {
      this.checkStoredAgainstThisState(
        {
          text:
            this.props.quote && this.props.quoteAuthor
              ? "<blockquote><p><strong>" +
                this.props.quoteAuthor +
                "</strong></p>" +
                this.props.quote +
                "</blockquote> <p></p>"
              : "",
        },
        this.props.currentId +
          (this.props.quote ? "-q" : "") +
          (this.props.reply ? "-" + this.props.reply.id : "")
      );
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    // TODO: use i18next
    const editorTitle =
      this.props.i18nOLD.text.get("plugin.discussion.reply.topic") +
      " - " +
      this.props.i18nOLD.text.get("plugin.discussion.createmessage.content");

    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => [
      <div className="env-dialog__row env-dialog__row--ckeditor" key="1">
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
     * @returns JSX.Element
     */
    const footer = (closeDialog: () => void) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.createReply.bind(this, closeDialog)}
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
        modifier="reply-thread"
        // TODO: use i18next
        title={this.props.i18nOLD.text.get("plugin.discussion.reply.topic")}
        content={content}
        footer={footer}
        onOpen={this.onDialogOpen}
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
    i18nOLD: state.i18nOLD,
    currentId: state.discussion.current.id,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ replyToCurrentDiscussionThread }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(ReplyThread)
);
