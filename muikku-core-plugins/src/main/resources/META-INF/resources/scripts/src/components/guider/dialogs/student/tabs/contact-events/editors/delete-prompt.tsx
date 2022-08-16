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
import { ContactLogsContext } from "../../guidance-relation";
import { IContactLogs } from "~/reducers/main-function/guider";
import {
  loadStudentContactLogs,
  LoadContactLogsTriggerType,
} from "~/actions/main-function/guider";

/**
 * ContactEventDeletePromptProps
 */
interface ContactEventDeletePromptProps {
  i18n: i18nType;
  commentId?: number;
  contactLogs: IContactLogs;
  contactLogEntryId: number;
  studentUserEntityId: number;
  deleteContactLogEvent: DeleteContactLogEventTriggerType;
  deleteContactLogEventComment: DeleteContactLogEventCommentTriggerType;
  loadStudentContactLogs: LoadContactLogsTriggerType;
  children: JSX.Element;
}

/**
 * A prompt for deleting a contact log entry or comment
 * @param props ContactEventDeletePromptProps
 */
const ContactEventDeletePrompt: React.FC<ContactEventDeletePromptProps> = (
  props
) => {
  const [locked, setLocked] = React.useState<boolean>(false);
  const {
    i18n,
    commentId,
    contactLogEntryId,
    studentUserEntityId,
    contactLogs,
    deleteContactLogEvent,
    deleteContactLogEventComment,
    loadStudentContactLogs,
  } = props;
  const contactLogsPerPage = React.useContext(ContactLogsContext);
  /**
   * handleOnDelete
   * @param closeDialog closeDialog
   */
  const handleOnDelete = (closeDialog: () => void) => {
    setLocked(true);
    if (!commentId) {
      deleteContactLogEvent(
        studentUserEntityId,
        contactLogEntryId,
        /**
         * onSuccess
         */
        () => {
          closeDialog();
          if (contactLogs.results.length === 0) {
            const returnPage =
              contactLogs.firstResult === 0
                ? 0
                : contactLogs.firstResult / contactLogsPerPage - 1;

            loadStudentContactLogs(
              studentUserEntityId,
              contactLogsPerPage,
              returnPage,
              true
            );
          }
        }
      );
    } else {
      deleteContactLogEventComment(
        studentUserEntityId,
        contactLogEntryId,
        commentId,
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
   * content element
   * @param closeDialog function to close the dialog
   * @returns JSX.Element
   */
  const content = (closeDialog: () => void) => (
    <div>
      {commentId
        ? i18n.text.get(
            "plugin.guider.user.dialog.removePrompt.comment.content"
          )
        : i18n.text.get("plugin.guider.user.dialog.removePrompt.entry.content")}
    </div>
  );

  /**
   * footer element
   * @param closeDialog function to close the dialog
   * @returns JSX.Element
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["fatal", "standard-ok"]}
        onClick={() => handleOnDelete(closeDialog)}
        disabled={locked}
      >
        {i18n.text.get(
          "plugin.discussion.confirmThreadRemovalDialog.confirmButton"
        )}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
      >
        {i18n.text.get(
          "plugin.discussion.confirmThreadRemovalDialog.cancelButton"
        )}
      </Button>
    </div>
  );

  return (
    /**
     * footer
     * @param closeDialog close dialog function
     * @returns JSX.Element
     */

    <Dialog
      modifier="delete-area"
      title={
        commentId
          ? i18n.text.get(
              "plugin.guider.user.dialog.removePrompt.comment.title"
            )
          : i18n.text.get("plugin.guider.user.dialog.removePrompt.entry.title")
      }
      content={content}
      footer={footer}
    >
      {props.children}
    </Dialog>
  );
};

/**
 * mapStateToProps
 * @param state state
 * @returns props from state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    contactLogs: state.guider.currentStudent.contactLogs,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns dispatch function
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      deleteContactLogEvent,
      deleteContactLogEventComment,
      loadStudentContactLogs,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactEventDeletePrompt);
