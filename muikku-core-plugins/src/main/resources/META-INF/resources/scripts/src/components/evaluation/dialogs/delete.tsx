import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import { EvaluationState } from "../../../reducers/main-function/evaluation/index";
import {
  RemoveWorkspaceEvent,
  removeWorkspaceEventFromServer,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { i18nType } from "../../../reducers/base/i18n";

/**
 * DeleteDialogProps
 */
interface DeleteDialogProps {
  i18n: i18nType;
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => any;
  evaluations: EvaluationState;
  removeWorkspaceEventFromServer: RemoveWorkspaceEvent;
}

/**
 * DeleteDialogState
 */
interface DeleteDialogState {}

/**
 * DeleteDialog
 */
class DeleteDialog extends React.Component<
  DeleteDialogProps,
  DeleteDialogState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: DeleteDialogProps) {
    super(props);

    this.handleDeleteEventClick = this.handleDeleteEventClick.bind(this);
  }

  /**
   * handleDeleteEventClick
   */
  handleDeleteEventClick(closeDialog: () => any) {
    const { evaluationAssessmentEvents } = this.props.evaluations;

    if (evaluationAssessmentEvents.data) {
      const latestIndex = evaluationAssessmentEvents.data.length - 1;

      this.props.removeWorkspaceEventFromServer({
        identifier: evaluationAssessmentEvents.data[latestIndex].identifier,
        eventType: evaluationAssessmentEvents.data[latestIndex].type,
        onSuccess: () => {
          const draftId =
            evaluationAssessmentEvents.data[latestIndex].identifier;

          cleanWorkspaceAndSupplementationDrafts(draftId);

          closeDialog();
        },
        onFail: () => closeDialog(),
      });
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { evaluationSelectedAssessmentId } = this.props.evaluations;

    const studentNameString = `${evaluationSelectedAssessmentId.lastName}, ${evaluationSelectedAssessmentId.firstName}`;

    let footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["fatal", "standard-ok"]}
            onClick={this.handleDeleteEventClick.bind(this, closeDialog)}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.workspaceEvaluationDialog.removeDialog.removeButton",
              studentNameString
            )}
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            onClick={closeDialog}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.workspaceEvaluationDialog.removeDialog.cancelButton"
            )}
          </Button>
        </div>
      );
    };
    let content = (closeDialog: () => any) => {
      return (
        <div>
          {this.props.i18n.text.get(
            "plugin.evaluation.workspaceEvaluationDialog.removeDialog.description",
            studentNameString
          )}
        </div>
      );
    };
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-remove-assessment"
        title={this.props.i18n.text.get(
          "plugin.evaluation.workspaceEvaluationDialog.removeDialog.title"
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
 * cleanWorkspaceAndSupplementationDrafts
 * @param draftId
 */
export const cleanWorkspaceAndSupplementationDrafts = (draftId: string) => {
  if (
    localStorage.getItem(
      `supplementation-editor-edit.${draftId}.literalEvaluation`
    )
  ) {
    localStorage.removeItem(
      `supplementation-editor-edit.${draftId}.literalEvaluation`
    );
  }
  if (
    localStorage.getItem(
      `supplementation-editor-new.${draftId}.literalEvaluation`
    )
  ) {
    localStorage.removeItem(
      `supplementation-editor-new.${draftId}.literalEvaluation`
    );
  }

  if (
    localStorage.getItem(
      `workspace-editor-edit.${draftId}.literalEvaluation`
    ) ||
    localStorage.getItem(`workspace-editor-edit.${draftId}.grade`) ||
    localStorage.getItem(
      `workspace-editor-edit.${draftId}.selectedPriceOption`
    ) ||
    localStorage.getItem(`workspace-editor-edit.${draftId}.basePrice`) ||
    localStorage.getItem(
      `workspace-editor-edit.${draftId}.existingBilledPriceObject`
    )
  ) {
    localStorage.removeItem(
      `workspace-editor-edit.${draftId}.literalEvaluation`
    );
    localStorage.removeItem(`workspace-editor-edit.${draftId}.grade`);
    localStorage.removeItem(
      `workspace-editor-edit.${draftId}.selectedPriceOption`
    );
    localStorage.removeItem(`workspace-editor-edit.${draftId}.basePrice`);
    localStorage.removeItem(
      `workspace-editor-edit.${draftId}.existingBilledPriceObject`
    );
  }

  if (
    localStorage.getItem(`workspace-editor-new.${draftId}.literalEvaluation`) ||
    localStorage.getItem(`workspace-editor-new.${draftId}.grade`) ||
    localStorage.getItem(
      `workspace-editor-new.${draftId}.selectedPriceOption`
    ) ||
    localStorage.getItem(`workspace-editor-new.${draftId}.basePrice`) ||
    localStorage.getItem(
      `workspace-editor-new.${draftId}.existingBilledPriceObject`
    )
  ) {
    localStorage.removeItem(
      `workspace-editor-new.${draftId}.literalEvaluation`
    );
    localStorage.removeItem(`workspace-editor-new.${draftId}.grade`);
    localStorage.removeItem(
      `workspace-editor-new.${draftId}.selectedPriceOption`
    );
    localStorage.removeItem(`workspace-editor-new.${draftId}.basePrice`);
    localStorage.removeItem(
      `workspace-editor-new.${draftId}.existingBilledPriceObject`
    );
  }
};

/* localStorage.getItem(`workspace-editor-edit.${draftId}.`)
 */
/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ removeWorkspaceEventFromServer }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDialog);
