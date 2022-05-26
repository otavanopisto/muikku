import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import {
  deleteContactLogEvent,
  DeleteContactLogEventTriggerType,
  deleteContactLogEventComment,
  DeleteContactLogEventCommentTriggerType,
} from "~/actions/main-function/guider";
import { StateType } from "~/reducers";
import * as React from "react";
/**
 * ContactEventDeletePromptProps
 */
interface ContactEventDeletePromptProps {
  i18n: i18nType;
  commentId?: number;
  contactLogEntryId: number;
  studentUserEntityId: number;
  deleteContactLogEvent: DeleteContactLogEventTriggerType;
  deleteContactLogEventComment: DeleteContactLogEventCommentTriggerType;
  children: JSX.Element;
}

/**
 * ContactEventDeletePromptState
 */
interface ContactEventDeletePromptState {
  locked: boolean;
}

/**
 * A prompt for deleting a contact log entry or comment
 */
class ContactEventDeletePrompt extends React.Component<
  ContactEventDeletePromptProps,
  ContactEventDeletePromptState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ContactEventDeletePromptProps) {
    super(props);
    this.state = {
      locked: false,
    };
  }

  /**
   * handleOnDelete
   * @param closeDialog closeDialog
   */
  handleOnDelete = (closeDialog: () => void) => {
    this.setState({ locked: true });
    if (!this.props.commentId) {
      this.props.deleteContactLogEvent(
        this.props.studentUserEntityId,
        this.props.contactLogEntryId,
        /**
         * onSuccess
         */
        () => {
          closeDialog();
        }
      );
    } else {
      this.props.deleteContactLogEventComment(
        this.props.studentUserEntityId,
        this.props.contactLogEntryId,
        this.props.commentId,
        /**
         * onSuccess
         */
        () => {
          closeDialog();
        }
      );
    }
  };

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.commentId
          ? this.props.i18n.text.get(
              "plugin.guider.user.dialog.removePrompt.comment.content"
            )
          : this.props.i18n.text.get(
              "plugin.guider.user.dialog.removePrompt.entry.content"
            )}
      </div>
    );

    /**
     * footer
     * @param closeDialog close dialog function
     * @returns JSX.Element
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.handleOnDelete.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.discussion.confirmThreadRemovalDialog.confirmButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.text.get(
            "plugin.discussion.confirmThreadRemovalDialog.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-area"
        title={
          this.props.commentId
            ? this.props.i18n.text.get(
                "plugin.guider.user.dialog.removePrompt.comment.title"
              )
            : this.props.i18n.text.get(
                "plugin.guider.user.dialog.removePrompt.entry.title"
              )
        }
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
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
 * @returns dispatch function
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { deleteContactLogEvent, deleteContactLogEventComment },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactEventDeletePrompt);
