import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import {
  replyToCurrentDiscussionThread,
  ReplyToCurrentDiscussionThreadTriggerType,
} from "~/actions/discussion";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";
import { DiscussionThreadReply } from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * TODO: maybe make this more generic,
 * since there is need for this kind of a reply outside discussion,
 * for example in the communicator and the guider
 */

/**
 * ReplyThreadDrawerProps
 */
interface ReplyThreadDrawerProps extends WithTranslation {
  reply?: DiscussionThreadReply;
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
  /**
   * constructor
   * @param props props
   */
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
            : "",
      },
      props.currentId +
        (props.quote ? "-q" : "") +
        (props.reply ? "-" + props.reply.id : "")
    );
  }

  /**
   * onCKEditorChange
   * @param text text
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
   */
  createReply() {
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
    const editorTitle =
      this.props.i18n.t("labels.reply", { ns: "messaging" }) +
      " - " +
      this.props.i18n.t("labels.content");

    const content = (
      <div className="env-dialog__row env-dialog__row--ckeditor">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.t("labels.content")}
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

    const footer = (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.createReply.bind(this)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.save")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={this.handleOnCancelClick}
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
      <div className="env-dialog env-dialog--mainfunction env-dialog--reply-message">
        <section className="env-dialog__wrapper">
          <div className="env-dialog__content">
            <header className="env-dialog__header">
              {this.props.i18n.t("labels.reply", { ns: "messaging" })}
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
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    currentId: state.discussion.current.id,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ replyToCurrentDiscussionThread }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(ReplyThreadDrawer)
);
