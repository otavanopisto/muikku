import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import { JournalComment } from "~/@types/journal";
import {
  DeleteWorkspaceJournalCommentTriggerType,
  deleteWorkspaceJournalComment,
} from "../../../../actions/workspaces/journals";

/**
 * DeleteJournalProps
 */
interface DeleteJournalCommentProps {
  i18n: i18nType;
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
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.i18n.text.get(
          "plugin.workspace.journal.deleteEntry.dialog.description"
        )}
      </div>
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
          {this.props.i18n.text.get(
            "plugin.workspace.journal.deleteEntry.dialog.deleteButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.journal.deleteEntry.dialog.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-journal"
        title={this.props.i18n.text.get(
          "plugin.workspace.journal.deleteEntry.dialog.title"
        )}
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
  return bindActionCreators({ deleteWorkspaceJournalComment }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteJournalComment);
