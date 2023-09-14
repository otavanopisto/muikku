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
import {
  DeleteEvaluationJournalFeedbackTriggerType,
  deleteEvaluationJournalFeedback,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { EvaluationJournalFeedback } from "~/generated/client";

/**
 * DeleteJournalProps
 */
interface DeleteJournalFeedbackProps {
  i18n: i18nType;
  journalFeedback: EvaluationJournalFeedback;
  deleteEvaluationJournalFeedback: DeleteEvaluationJournalFeedbackTriggerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}

/**
 * DeleteJournalState
 */
interface DeleteJournalFeedbackState {
  locked: boolean;
}

/**
 * DeleteJournal
 */
class DeleteJournalFeedback extends React.Component<
  DeleteJournalFeedbackProps,
  DeleteJournalFeedbackState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteJournalFeedbackProps) {
    super(props);

    this.deleteJournalFeedback = this.deleteJournalFeedback.bind(this);

    this.state = {
      locked: false,
    };
  }

  /**
   * deleteJournal
   * @param closeDialog closeDialog
   */
  deleteJournalFeedback(closeDialog: () => void) {
    const { journalFeedback } = this.props;

    this.setState({ locked: true });

    this.props.deleteEvaluationJournalFeedback({
      feedbackId: journalFeedback.id,
      userEntityId: journalFeedback.student,
      workspaceEntityId: journalFeedback.workspaceEntityId,
      // eslint-disable-next-line jsdoc/require-jsdoc
      success: () => {
        localStorage.removeItem(
          `diary-journalFeedback-edit.${journalFeedback.student}-${journalFeedback.workspaceEntityId}-${journalFeedback.id}.feedbackText`
        );
        this.setState({ locked: false }, () => {
          closeDialog();
        });
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
      <div>
        {this.props.i18n.text.get(
          "plugin.workspace.journal.deleteComment.dialog.description"
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
          onClick={this.deleteJournalFeedback.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.journal.deleteComment.dialog.deleteButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.journal.deleteComment.dialog.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-journal"
        title={this.props.i18n.text.get(
          "plugin.workspace.journal.deleteComment.dialog.title"
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
  return bindActionCreators({ deleteEvaluationJournalFeedback }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteJournalFeedback);
