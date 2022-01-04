import "~/sass/elements/link.scss";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";

import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import { WorkspaceJournalType } from "~/reducers/workspaces";
import {
  deleteWorkspaceJournalInCurrentWorkspace,
  DeleteWorkspaceJournalInCurrentWorkspaceTriggerType
} from "~/actions/workspaces";

interface DeleteJournalProps {
  i18n: i18nType;
  journal: WorkspaceJournalType;
  children: React.ReactElement<any>;
  deleteWorkspaceJournalInCurrentWorkspace: DeleteWorkspaceJournalInCurrentWorkspaceTriggerType;
}

interface DeleteJournalState {
  locked: boolean;
}

class DeleteJournal extends React.Component<
  DeleteJournalProps,
  DeleteJournalState
> {
  constructor(props: DeleteJournalProps) {
    super(props);

    this.deleteJournal = this.deleteJournal.bind(this);

    this.state = {
      locked: false
    };
  }
  deleteJournal(closeDialog: () => any) {
    this.setState({ locked: true });
    this.props.deleteWorkspaceJournalInCurrentWorkspace({
      journal: this.props.journal,
      success: () => {
        this.setState({ locked: false });
        closeDialog();
      },
      fail: () => {
        this.setState({ locked: false });
      }
    });
  }
  render() {
    let content = (closeDialog: () => any) => (
      <div>
        {this.props.i18n.text.get(
          "plugin.workspace.journal.deleteEntry.dialog.description"
        )}
      </div>
    );

    let footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["fatal", "standard-ok"]}
            onClick={this.deleteJournal.bind(this, closeDialog)}
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
    };

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

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { deleteWorkspaceJournalInCurrentWorkspace },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteJournal);
