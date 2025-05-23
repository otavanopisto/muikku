import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import {
  DeleteEvaluationJournalFeedbackTriggerType,
  deleteEvaluationJournalFeedback,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { EvaluationJournalFeedback } from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * DeleteJournalProps
 */
interface DeleteJournalFeedbackProps extends WithTranslation {
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
      <div>{this.props.t("content.removing", { ns: "comment" })}</div>
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
  return bindActionCreators({ deleteEvaluationJournalFeedback }, dispatch);
}

export default withTranslation()(
  connect(null, mapDispatchToProps)(DeleteJournalFeedback)
);
