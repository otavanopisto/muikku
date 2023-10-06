import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import "~/sass/elements/form.scss";
import {
  deleteAssessmentRequest,
  DeleteAssessmentRequest,
  deleteInterimEvaluationRequest,
  DeleteInterimEvaluationRequest,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { EvaluationAssessmentRequest } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ArchiveDialogProps
 */
interface DeleteRequestDialogProps
  extends EvaluationAssessmentRequest,
    WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => void;
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
            ? this.props.t("actions.remove", {
                context: "interimEvaluationRequest",
              })
            : this.props.t("actions.remove", {
                context: "evaluationRequest",
              })}{" "}
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
      <div
        dangerouslySetInnerHTML={this.createHtmlMarkup(
          this.props.t("content.removing", {
            context: this.props.interimEvaluationRequest
              ? "interimRequest"
              : "evaluationRequest",
            student: studentNameString,
            workspace: workspaceNameString,
          })
        )}
      />
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-archive-request"
        title={this.props.t("labels.remove", {
          context: this.props.interimEvaluationRequest
            ? "interimEvaluationRequest"
            : "evaluationRequest",
          student: studentNameString,
          workspace: workspaceNameString,
        })}
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { deleteAssessmentRequest, deleteInterimEvaluationRequest },
    dispatch
  );
}

export default withTranslation(["evaluation"])(
  connect(null, mapDispatchToProps)(DeleteRequestDialog)
);
