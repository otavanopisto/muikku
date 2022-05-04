import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import {
  createContactEventComment,
  CreateContactEventCommentTriggerType,
} from "~/actions/main-function/guider";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import moment from "~/lib/moment";

/**
 * ReplyThreadDrawerProps
 */
interface CommentContactEventProps {
  i18n: i18nType;
  contactEventtId: number;
  studentUserEntityId: number;
  createContactEventComment: CreateContactEventCommentTriggerType;
  onClickCancel: () => void;
}

/**
 * CommentContactEventState
 */
interface CommentContactEventState {
  text: string;
  locked: boolean;
}

/**
 * CommentContactEvent
 */
class CommentContactEvent extends SessionStateComponent<
  CommentContactEventProps,
  CommentContactEventState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CommentContactEventProps) {
    super(props, "contact-event-comment");
    this.state = this.getRecoverStoredState(
      {
        locked: false,
        text: "",
      },
      props.contactEventtId + "comment-contact-event"
    );
  }

  /**
   * onCKEditorChange
   * @param text text
   */
  onCKEditorChange = (text: string): void => {
    this.setStateAndStore(
      { text },
      this.props.contactEventtId + "comment-contact-event"
    );
  };

  /**
   * clearUp
   */
  clearUp = (): void => {
    this.setStateAndClear(
      {
        text: "",
      },
      this.props.contactEventtId + "comment-contact-event"
    );
  };

  /**
   * createReply
   */
  createReply = (): void => {
    this.setState({
      locked: true,
    });
    this.props.createContactEventComment(
      this.props.studentUserEntityId,
      this.props.contactEventtId,
      {
        commentDate: moment().format(),
        text: this.state.text,
      }
    );
    this.setState({
      locked: true,
    });
    this.handleOnCancelClick();
  };

  /**
   * handleOnCancelClick
   */
  handleOnCancelClick = (): void => {
    this.props.onClickCancel && this.props.onClickCancel();
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const editorTitle =
      this.props.i18n.text.get("plugin.discussion.answertomessage.topic") +
      " - " +
      this.props.i18n.text.get("plugin.discussion.createmessage.content");

    const content = (
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

    const footer = (
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
              {this.props.i18n.text.get("TODO: kommentoi yhteydenottoa")}
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
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ createContactEventComment }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentContactEvent);
