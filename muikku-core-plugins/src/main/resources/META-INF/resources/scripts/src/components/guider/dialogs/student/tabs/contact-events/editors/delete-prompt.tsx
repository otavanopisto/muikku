import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useTranslation } from "react-i18next";
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
import {
  loadStudentContactLogs,
  LoadContactLogsTriggerType,
} from "~/actions/main-function/guider";
import { ContactLog } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * ContactEventDeletePromptProps
 */
interface ContactEventDeletePromptProps {
  commentId?: number;
  contactLogs: ContactLog;
  contactLogEntryId: number;
  studentUserEntityId: number;
  deleteContactLogEvent: DeleteContactLogEventTriggerType;
  deleteContactLogEventComment: DeleteContactLogEventCommentTriggerType;
  loadStudentContactLogs: LoadContactLogsTriggerType;
  children: React.JSX.Element;
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
    commentId,
    contactLogEntryId,
    studentUserEntityId,
    contactLogs,
    deleteContactLogEvent,
    deleteContactLogEventComment,
    loadStudentContactLogs,
  } = props;
  const contactLogsPerPage = React.useContext(ContactLogsContext);
  const { t } = useTranslation(["guider", "common"]);
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
   * @returns React.JSX.Element
   */
  const content = (closeDialog: () => void) => (
    <div>
      {commentId
        ? t("content.removing", { context: "comment" })
        : t("content.removing", { ns: "messaging", context: "contactEntry" })}
    </div>
  );

  /**
   * footer element
   * @param closeDialog function to close the dialog
   * @returns React.JSX.Element
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["fatal", "standard-ok"]}
        onClick={() => handleOnDelete(closeDialog)}
        disabled={locked}
      >
        {t("actions.remove")}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    /**
     * footer
     * @param closeDialog close dialog function
     * @returns React.JSX.Element
     */

    <Dialog
      modifier="delete-area"
      title={
        commentId
          ? t("actions.remove", { context: "comment" })
          : t("actions.remove", { context: "contactEntry" })
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
    contactLogs: state.guider.currentStudent.contactLogs,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns dispatch function
 */
function mapDispatchToProps(dispatch: AppDispatch) {
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
