import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import {
  deleteWorkspaceJournalInCurrentWorkspace,
  DeleteWorkspaceJournalInCurrentWorkspaceTriggerType,
} from "~/actions/workspaces/journals";
import { WorkspaceJournalWithComments } from "~/reducers/workspaces/journals";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DeleteJournalProps
 */
interface DeleteJournalProps extends WithTranslation {
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
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>{t("content.removing", { ns: "journal" })}</div>
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
        title={t("labels.remove", { ns: "journal" })}
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { deleteWorkspaceJournalInCurrentWorkspace },
    dispatch
  );
}

export default withTranslation(["journal", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(DeleteJournal)
);
