import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { DiscussionThreadReplyType } from "~/reducers/discussion";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import {
  editContactEventComment,
  EditContactEventCommentTriggerType,
} from "~/actions/main-function/guider";
import {
  ContactTypes,
  contactTypesArray,
} from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import DatePicker from "react-datepicker";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import moment from "~/lib/moment";
import { StatusType } from "~/reducers/base/status";
import { IContactEventComment } from "~/reducers/main-function/guider";

/**
 * TODO: maybe make this more generic,
 * since there is need for this kind of a reply outside discussion,
 * for example in the communicator and the guider
 * */

/**
 * EditContactEventCommentStateProps
 */
interface EditContactEventCommentProps {
  i18n: i18nType;
  status: StatusType;
  quote?: string;
  quoteAuthor?: string;
  comment: IContactEventComment;
  studentUserEntityId: number;
  editContactEventComment: EditContactEventCommentTriggerType;
  onClickCancel: () => void;
}

/**
 * EditContactEventCommentState
 */
interface EditContactEventCommentState {
  text: string;
  date: Date;
  type: ContactTypes;
  openReplyType?: "answer" | "modify" | "quote";
  locked: boolean;
}

/**
 * EditContactEventComment
 */
class EditContactEventComment extends SessionStateComponent<
  EditContactEventCommentProps,
  EditContactEventCommentState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: EditContactEventCommentProps) {
    super(props, "contact-event-comment");

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.clearUp = this.clearUp.bind(this);

    this.state = this.getRecoverStoredState(
      {
        locked: false,
        date: new Date(this.props.comment.commentDate),
        text: this.props.comment.text,
      },
      props.comment.id + "-edit"
    );
  }

  /**
   * onCKEditorChange
   * @param text text
   */
  onCKEditorChange(text: string) {
    this.setStateAndStore({ text }, this.props.comment.id + "-edit");
  }

  onDateChange = (date: Date) => {
    this.setStateAndStore({ date: date }, this.props.comment.id);
  };

  onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore(
      { type: e.target.value as ContactTypes },
      this.props.comment.id + "-edit"
    );
  };

  /**
   * clearUp
   */
  clearUp() {
    this.setStateAndClear(
      {
        date: new Date(this.props.comment.commentDate),
        text: this.props.comment.text,
      },
      this.props.comment.id + "-edit"
    );
  }

  /**
   * createReply
   */
  editContactEventComment() {
    this.setState({
      locked: true,
    });
    this.props.editContactEventComment(
      this.props.studentUserEntityId,
      this.props.comment.entry,
      this.props.comment.id,
      {
        creatorId: this.props.status.userId,
        text: this.state.text,
        commentDate: moment(this.state.date).format(),
      }
    );
    this.setState({
      locked: true,
    });

    this.handleOnCancelClick();
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
          onClick={this.editContactEventComment.bind(this)}
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
              {this.props.i18n.text.get("TODO: Muokkaa yhteydenottoa")}
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ editContactEventComment }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditContactEventComment);
