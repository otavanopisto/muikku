import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import {
  RemoveWorkspaceEvent,
  removeWorkspaceEventFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import { EvaluationEvent } from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DeleteDialogProps
 */
interface DeleteDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => void;
  evaluations: EvaluationState;
  eventData: EvaluationEvent;
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
   * @param props props
   */
  constructor(props: DeleteDialogProps) {
    super(props);

    this.handleDeleteEventClick = this.handleDeleteEventClick.bind(this);
  }

  /**
   * handleDeleteEventClick
   * @param closeDialog closeDialog
   */
  handleDeleteEventClick(closeDialog: () => void) {
    const { eventData } = this.props;

    this.props.removeWorkspaceEventFromServer({
      identifier: eventData.identifier,
      eventType: eventData.type,
      /**
       * onSuccess
       */
      onSuccess: () => {
        const draftId = eventData.identifier;

        cleanWorkspaceAndSupplementationDrafts(draftId);

        closeDialog();
      },
      /**
       * onFail
       */
      onFail: () => closeDialog(),
    });
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { evaluationSelectedAssessmentId } = this.props.evaluations;

    const studentNameString = `${evaluationSelectedAssessmentId.lastName}, ${evaluationSelectedAssessmentId.firstName}`;

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.handleDeleteEventClick.bind(this, closeDialog)}
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
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.t("content.removing", {
          context: "evaluation",
          studentName: studentNameString,
        })}
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-remove-assessment"
        title={this.props.t("labels.remove", { ns: "evaluation" })}
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
 * @param draftId draftId
 */
export const cleanWorkspaceAndSupplementationDrafts = (draftId: string) => {
  const supplementationEditorEditLiteralEvaluation = localStorage.getItem(
    `supplementation-editor-edit.${draftId}.literalEvaluation`
  );

  const supplementationEditorNewLiteralEvaluation = localStorage.getItem(
    `supplementation-editor-new.${draftId}.literalEvaluation`
  );

  const workspaceEditorEditLiteralEvaluation = localStorage.getItem(
    `workspace-editor-edit.${draftId}.literalEvaluation`
  );

  const workspaceEditorEditGrade = localStorage.getItem(
    `workspace-editor-edit.${draftId}.grade`
  );

  const workspaceEditorEditBasePrice = localStorage.getItem(
    `workspace-editor-edit.${draftId}.basePrice`
  );

  const workspaceEditorEditSelectedPriceOption = localStorage.getItem(
    `workspace-editor-edit.${draftId}.selectedPriceOption`
  );

  const workspaceEditorEditExistingBilledPriceObject = localStorage.getItem(
    `workspace-editor-edit.${draftId}.existingBilledPriceObject`
  );

  const workspaceEditorNewLiteralEvaluation = localStorage.getItem(
    `workspace-editor-new.${draftId}.literalEvaluation`
  );

  const workspaceEditorNewGrade = localStorage.getItem(
    `workspace-editor-new.${draftId}.grade`
  );

  const workspaceEditorNewBasePrice = localStorage.getItem(
    `workspace-editor-new.${draftId}.basePrice`
  );

  const workspaceEditorNewSelectedPriceOption = localStorage.getItem(
    `workspace-editor-new.${draftId}.selectedPriceOption`
  );

  const workspaceEditorNewExistingBilledPriceObject = localStorage.getItem(
    `workspace-editor-new.${draftId}.existingBilledPriceObject`
  );

  if (supplementationEditorEditLiteralEvaluation !== null) {
    localStorage.removeItem(
      `supplementation-editor-edit.${draftId}.literalEvaluation`
    );
  }
  if (supplementationEditorNewLiteralEvaluation !== null) {
    localStorage.removeItem(
      `supplementation-editor-new.${draftId}.literalEvaluation`
    );
  }

  if (
    workspaceEditorEditLiteralEvaluation !== null ||
    workspaceEditorEditGrade !== null ||
    workspaceEditorEditSelectedPriceOption !== null ||
    workspaceEditorEditBasePrice !== null ||
    workspaceEditorEditExistingBilledPriceObject !== null
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
    workspaceEditorNewLiteralEvaluation !== null ||
    workspaceEditorNewGrade !== null ||
    workspaceEditorNewSelectedPriceOption !== null ||
    workspaceEditorNewBasePrice !== null ||
    workspaceEditorNewExistingBilledPriceObject !== null
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
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ removeWorkspaceEventFromServer }, dispatch);
}

export default withTranslation(["evaluation"])(
  connect(mapStateToProps, mapDispatchToProps)(DeleteDialog)
);
