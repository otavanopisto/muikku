import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import {
  editContactLogEventComment,
  EditContactLogEventCommentTriggerType,
} from "~/actions/main-function/guider";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import moment from "moment";
import { StatusType } from "~/reducers/base/status";
import { ContactLogEventComment, ContactType } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * EditContactLogEventCommentStateProps
 */
interface EditContactLogEventCommentProps extends WithTranslation<["common"]> {
  status: StatusType;
  comment: ContactLogEventComment;
  studentUserEntityId: number;
  editContactLogEventComment: EditContactLogEventCommentTriggerType;
  closeEditor: () => void;
}

/**
 * EditContactLogEventCommentState
 */
interface EditContactLogEventCommentState {
  text: string;
  date: Date;
  type: ContactType;
  locked: boolean;
}

/**
 * Editor for the contactLog entry comment
 */
class EditContactLogEventComment extends SessionStateComponent<
  EditContactLogEventCommentProps,
  EditContactLogEventCommentState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: EditContactLogEventCommentProps) {
    super(props, "contact-event-comment");
    this.state = this.getRecoverStoredState(
      {
        locked: false,
        date: new Date(this.props.comment.commentDate),
        text: this.props.comment.text,
      },
      props.comment.id + "-edit-comment"
    );
  }

  /**
   * onCKEditorChange handler
   * @param text text content
   */
  onCKEditorChange = (text: string): void => {
    this.setStateAndStore({ text }, this.props.comment.id + "-edit-comment");
  };

  /**
   * onDateChange handler
   * @param date Date
   */
  onDateChange = (date: Date): void => {
    this.setStateAndStore({ date: date }, this.props.comment.id);
  };
  /**
   * onTypeChange handler
   * @param e event
   */
  onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setStateAndStore(
      { type: e.target.value as ContactType },
      this.props.comment.id + "-edit-comment"
    );
  };

  /**
   * clearUp
   */
  clearUp = (): void => {
    this.setStateAndClear(
      {
        locked: false,
        date: new Date(this.props.comment.commentDate),
        text: this.props.comment.text,
      },
      this.props.comment.id + "-edit-comment"
    );
  };

  /**
   * editContactEventComment
   */
  editContactEventComment = (): void => {
    this.setState({
      locked: true,
    });
    this.props.editContactLogEventComment(
      this.props.studentUserEntityId,
      this.props.comment.entry,
      this.props.comment.id,
      {
        creatorId: this.props.status.userId,
        text: this.state.text,
        commentDate: moment(this.state.date).format(),
      },

      /**
       * onSuccess
       */
      () => {
        this.setState({
          locked: false,
        });
        this.handleOnEditorClose();
      }
    );
  };

  /**
   * handleOnEditorClose
   */
  handleOnEditorClose = (): void => {
    this.props.closeEditor && this.props.closeEditor();
  };

  /**
   * render
   * @returns React.JSX.Element
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
          onClick={this.editContactEventComment}
          disabled={this.state.locked}
        >
          {this.props.i18n.t("actions.send")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={this.handleOnEditorClose}
          disabled={this.state.locked}
        >
          {this.props.i18n.t("actions.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.i18n.t("actions.remove", { context: "draft" })}
          </Button>
        ) : null}
      </div>
    );

    return (
      <div className="env-dialog env-dialog--mainfunction env-dialog--reply-message">
        <section className="env-dialog__wrapper">
          <div className="env-dialog__content">
            <header className="env-dialog__header">
              {this.props.i18n.t("labels.edit", { context: "comment" })}
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns dispatch function
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ editContactLogEventComment }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(EditContactLogEventComment)
);
