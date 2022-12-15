import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import { AssessmentRequest } from "../../../@types/evaluation";
import {
  deleteAssessmentRequest,
  DeleteAssessmentRequest,
  deleteInterimEvaluationRequest,
  DeleteInterimEvaluationRequest,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ArchiveDialogProps
 */
interface DeleteRequestDialogProps
  extends AssessmentRequest,
    WithTranslation<["common", "evaluation"]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => void;
  i18nn: i18nType;
  deleteAssessmentRequest: DeleteAssessmentRequest;
  deleteInterimEvaluationRequest: DeleteInterimEvaluationRequest;
}

/**
 * ArchiveDialogState
 */
interface DeleteRequestDialogState {}

/**
 * ArchiveDialog
 */
class DeleteRequestDialog extends React.Component<
  DeleteRequestDialogProps,
  DeleteRequestDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteRequestDialogProps) {
    super(props);

    this.deleteRequest = this.deleteRequest.bind(this);
  }

  /**
   * createHtmlMarkup
   * This should sanitize html
   * @param htmlString string that contains html
   */
  createHtmlMarkup = (htmlString: string) => ({
    __html: htmlString,
  });

  /**
   * deleteRequest
   * @param closeDialog closeDialog
   */
  deleteRequest(closeDialog: () => void) {
    if (this.props.interimEvaluationRequest) {
      this.props.deleteInterimEvaluationRequest({
        interimEvaluatiomRequestId: this.props.id,
      });
    } else {
      this.props.deleteAssessmentRequest({
        workspaceUserEntityId: this.props.workspaceUserEntityId,
      });
    }

    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { firstName, lastName, workspaceName, workspaceNameExtension } =
      this.props;

    const studentNameString = `${lastName}, ${firstName}`;

    let workspaceNameString = `${workspaceName}`;

    if (workspaceNameExtension) {
      workspaceNameString = `${workspaceName} (${workspaceNameExtension})`;
    }

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.deleteRequest.bind(this, closeDialog)}
        >
          {this.props.interimEvaluationRequest
            ? this.props.t(
                "evaluation:actions.confirmRemove_interimEvaluationRequest"
              )
            : this.props.t(
                "evaluation:actions.confirmRemove_evaluationRequest"
              )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.t("common:actions.cancel")}
        </Button>
      </div>
    );

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div
        dangerouslySetInnerHTML={this.createHtmlMarkup(
          this.props.interimEvaluationRequest
            ? this.props.i18nn.text.get(
                "plugin.evaluation.evaluationModal.deleteInterimRequest.confirmationDialog.description",
                studentNameString,
                workspaceNameString
              )
            : this.props.i18nn.text.get(
                "plugin.evaluation.evaluationModal.archiveRequest.confirmationDialog.description",
                studentNameString,
                workspaceNameString
              )
        )}
      />
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-archive-request"
        title={
          this.props.interimEvaluationRequest
            ? this.props.i18nn.text.get(
                "plugin.evaluation.evaluationModal.deleteInterimRequest.confirmationDialog.title"
              )
            : this.props.i18nn.text.get(
                "plugin.evaluation.evaluationModal.archiveRequest.confirmationDialog.title"
              )
        }
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
    i18nn: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { deleteAssessmentRequest, deleteInterimEvaluationRequest },
    dispatch
  );
}

export default withTranslation(["common", "evaluation"])(
  connect(mapStateToProps, mapDispatchToProps)(DeleteRequestDialog)
);
