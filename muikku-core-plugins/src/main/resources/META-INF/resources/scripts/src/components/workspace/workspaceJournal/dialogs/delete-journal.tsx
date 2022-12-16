import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18nOLD";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import {
  deleteWorkspaceJournalInCurrentWorkspace,
  DeleteWorkspaceJournalInCurrentWorkspaceTriggerType,
} from "~/actions/workspaces/journals";
import { WorkspaceJournalWithComments } from "~/reducers/workspaces/journals";

/**
 * DeleteJournalProps
 */
interface DeleteJournalProps {
  i18nOLD: i18nType;
  journal: WorkspaceJournalWithComments;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  deleteWorkspaceJournalInCurrentWorkspace: DeleteWorkspaceJournalInCurrentWorkspaceTriggerType;
}

/**
 * DeleteJournalState
 */
interface DeleteJournalState {
  locked: boolean;
}

/**
 * DeleteJournal
 */
class DeleteJournal extends React.Component<
  DeleteJournalProps,
  DeleteJournalState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteJournalProps) {
    super(props);

    this.deleteJournal = this.deleteJournal.bind(this);

    this.state = {
      locked: false,
    };
  }

  /**
   * deleteJournal
   * @param closeDialog closeDialog
   */
  deleteJournal(closeDialog: () => void) {
    this.setState({ locked: true });
    this.props.deleteWorkspaceJournalInCurrentWorkspace({
      journal: this.props.journal,
      /**
       * success
       */
      success: () => {
        this.setState({ locked: false });
        closeDialog();
      },
      /**
       * fail
       */
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
      <div>
        {this.props.i18nOLD.text.get(
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
          onClick={this.deleteJournal.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18nOLD.text.get(
            "plugin.workspace.journal.deleteEntry.dialog.deleteButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18nOLD.text.get(
            "plugin.workspace.journal.deleteEntry.dialog.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-journal"
        title={this.props.i18nOLD.text.get(
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
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { deleteWorkspaceJournalInCurrentWorkspace },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteJournal);
