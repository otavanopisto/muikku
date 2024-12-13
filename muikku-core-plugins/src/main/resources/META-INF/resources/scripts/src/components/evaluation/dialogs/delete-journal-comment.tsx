import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { WithTranslation, withTranslation } from "react-i18next";
import {
  DeleteEvaluationJournalCommentTriggerType,
  deleteEvaluationJournalComment,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { WorkspaceJournalComment } from "~/generated/client";

/**
 * DeleteJournalProps
 */
interface DeleteJournalCommentProps extends WithTranslation {
  userEntityId: number;
  workspaceEntityId: number;
  journalComment: WorkspaceJournalComment;
  deleteEvaluationJournalComment: DeleteEvaluationJournalCommentTriggerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}

/**
 * DeleteJournalState
 */
interface DeleteJournalCommentState {
  locked: boolean;
}

/**
 * DeleteJournal
 */
class DeleteJournalComment extends React.Component<
  DeleteJournalCommentProps,
  DeleteJournalCommentState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteJournalCommentProps) {
    super(props);

    this.deleteJournalComment = this.deleteJournalComment.bind(this);

    this.state = {
      locked: false,
    };
  }

  /**
   * deleteJournal
   * @param closeDialog closeDialog
   */
  deleteJournalComment(closeDialog: () => void) {
    const { journalComment, userEntityId, workspaceEntityId } = this.props;

    this.setState({ locked: true });
    this.props.deleteEvaluationJournalComment({
      commentId: this.props.journalComment.id,
      journalEntryId: this.props.journalComment.journalEntryId,
      workspaceEntityId: this.props.workspaceEntityId,
      // eslint-disable-next-line jsdoc/require-jsdoc
      success: () => {
        localStorage.removeItem(
          `diary-journalComment-edit.${userEntityId}-${workspaceEntityId}-${journalComment.journalEntryId}-${journalComment.id}.journalCommentText`
        );

        this.setState({ locked: false });
        closeDialog();
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      fail: () => {
        this.setState({ locked: false });
      },
    });
  }

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>{this.props.t("content.removing", { context: "comment" })}</div>
    );
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.deleteJournalComment.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-journal"
        title={this.props.t("actions.remove", { context: "comment" })}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ deleteEvaluationJournalComment }, dispatch);
}

export default withTranslation(["evaluation"])(
  connect(null, mapDispatchToProps)(DeleteJournalComment)
);
