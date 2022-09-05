import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import {
  createContactLogEventComment,
  CreateContactLogEventCommentTriggerType,
} from "~/actions/main-function/guider";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import * as moment from "moment";

/**
 * ReplyThreadDrawerProps
 */
interface NewContactLogEventCommentProps {
  i18n: i18nType;
  contactEventtId: number;
  studentUserEntityId: number;
  createContactLogEventComment: CreateContactLogEventCommentTriggerType;
  closeEditor: () => void;
}

/**
 * NewContactLogEventCommentState
 */
interface NewContactLogEventCommentState {
  text: string;
  locked: boolean;
}

/**
 * CommentContactEvent
 */
class NewContactLogEventComment extends SessionStateComponent<
  NewContactLogEventCommentProps,
  NewContactLogEventCommentState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NewContactLogEventCommentProps) {
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
   * createComment
   */
  createComment = (): void => {
    this.setState({
      locked: true,
    });
    this.props.createContactLogEventComment(
      this.props.studentUserEntityId,
      this.props.contactEventtId,
      /**
       * payload
       */
      {
        commentDate: moment().format(),
        text: this.state.text,
      },
      /**
       * onSuccess
       */
      () => {
        this.clearUp();
        this.handleOnEditorClose();
      }
    );
    this.setState({
      locked: false,
    });
  };

  /**
   * handleOnEditorClose
   */
  handleOnEditorClose = (): void => {
    this.props.closeEditor && this.props.closeEditor();
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const editorTitle = this.props.i18n.text.get(
      "plugin.guider.user.dialog.newComment.title"
    );

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
          onClick={this.createComment}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get("plugin.discussion.createmessage.send")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={this.handleOnEditorClose}
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
                "plugin.guider.user.dialog.newComment.title"
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

/**
 * mapStateToProps
 * @param state state
 * @returns props from state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns dispatch functions
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ createContactLogEventComment }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewContactLogEventComment);
