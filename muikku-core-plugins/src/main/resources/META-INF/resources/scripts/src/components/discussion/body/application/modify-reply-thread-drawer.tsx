import * as React from "react";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { Action, bindActionCreators, Dispatch } from "redux";
import CKEditor from "~/components/general/ckeditor";
import {
  modifyReplyFromCurrentThread,
  ModifyReplyFromCurrentThreadTriggerType,
} from "~/actions/discussion";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";
import { DiscussionThreadReply } from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * ModifyThreadReplyDrawerProps
 */
interface ModifyThreadReplyDrawerProps extends WithTranslation {
  reply?: DiscussionThreadReply;
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
   * @param props props
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
      props.reply.id
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
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: ModifyThreadReplyDrawerProps) {
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
   * onCKEditorChange
   * @param text text
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
      /**
       * success
       */
      success: () => {
        this.props.onClickCancel && this.props.onClickCancel();
        this.justClear(["text"], this.props.reply.id);
        this.setState({
          locked: false,
        });
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
   *
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
      this.props.i18n.t("labels.edit", { ns: "messaging" }) +
      " - " +
      this.props.i18n.t("labels.content");

    /**
     * content
     */
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
              {this.props.i18n.t("labels.edit", { ns: "messaging" })}
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
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ modifyReplyFromCurrentThread }, dispatch);
}

export default withTranslation(["messaging"])(
  connect(null, mapDispatchToProps)(ModifyThreadReplyDrawer)
);
