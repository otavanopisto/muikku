import "~/sass/elements/link.scss";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";

import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import {
  deleteContactEvent,
  DeleteContactEventTriggerType,
  deleteContactEventComment,
  DeleteContactEventCommentTriggerType,
} from "~/actions/main-function/guider";
import { StateType } from "~/reducers";

/**
 * ContactEventDeletePromptProps
 */
interface ContactEventDeletePromptProps {
  i18n: i18nType;
  commentId?: number;
  contactLogEntryId: number;
  studentUserEntityId: number;
  deleteContactEvent: DeleteContactEventTriggerType;
  deleteContactEventComment: DeleteContactEventCommentTriggerType;
  children: React.ReactElement<any>;
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
   * deleteComponent
   * @param closeDialog closeDialog
   */
  deleteComponent = (closeDialog: () => any) => {
    this.setState({ locked: true });
    if (!this.props.commentId) {
      this.props.deleteContactEvent(
        this.props.studentUserEntityId,
        this.props.contactLogEntryId
      );
    } else {
      this.props.deleteContactEventComment(
        this.props.studentUserEntityId,
        this.props.contactLogEntryId,
        this.props.commentId
      );
    }
    closeDialog();
  };

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
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
     * @param closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.deleteComponent.bind(this, closeDialog)}
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
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { deleteContactEvent, deleteContactEventComment },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactEventDeletePrompt);
