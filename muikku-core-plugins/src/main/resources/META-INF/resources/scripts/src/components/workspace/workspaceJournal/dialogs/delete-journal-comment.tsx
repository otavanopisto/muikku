import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import { JournalComment } from "~/@types/journal";
import {
  DeleteWorkspaceJournalCommentTriggerType,
  deleteWorkspaceJournalComment,
} from "~/actions/workspaces/journals";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * DeleteJournalProps
 */
interface DeleteJournalCommentProps extends WithTranslation {
  workspaceEntityId: number;
  journalComment: JournalComment;
  deleteWorkspaceJournalComment: DeleteWorkspaceJournalCommentTriggerType;

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
    this.setState({ locked: true });
    this.props.deleteWorkspaceJournalComment({
      deleteCommentPayload: {
        id: this.props.journalComment.id,
        journalEntryId: this.props.journalComment.journalEntryId,
      },
      journalEntryId: this.props.journalComment.journalEntryId,
      workspaceEntityId: this.props.workspaceEntityId,
    });
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>{t("content.removing_comment")}</div>
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
      <Dialog
        modifier="delete-journal"
        title={t("actions.remove_comment")}
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
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ deleteWorkspaceJournalComment }, dispatch);
}

export default withTranslation(["journal", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(DeleteJournalComment)
);
