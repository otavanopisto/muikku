import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import "~/sass/elements/form.scss";
import {
  deleteAssessmentRequest,
  DeleteAssessmentRequest,
  deleteInterimEvaluationRequest,
  DeleteInterimEvaluationRequest,
  DeleteSupplementationRequest,
  deleteSupplementationRequest,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { EvaluationAssessmentRequest } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * ArchiveDialogProps
 */
interface DeleteRequestDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  evaluationAssessmentRequest: EvaluationAssessmentRequest;
  isOpen?: boolean;
  onClose?: () => void;
  deleteAssessmentRequest: DeleteAssessmentRequest;
  deleteInterimEvaluationRequest: DeleteInterimEvaluationRequest;
  deleteSupplementationRequest: DeleteSupplementationRequest;
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
    const { state, id, workspaceUserEntityId } =
      this.props.evaluationAssessmentRequest;

    if (state === "interim_evaluation_request") {
      this.props.deleteInterimEvaluationRequest({
        interimEvaluatiomRequestId: id,
      });
    } else if (state === "incomplete") {
      this.props.deleteSupplementationRequest({
        workspaceUserEntityId: workspaceUserEntityId,
        supplementationRequestId: id,
      });
    } else {
      this.props.deleteAssessmentRequest({
        workspaceUserEntityId: workspaceUserEntityId,
      });
    }

    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const {
      firstName,
      lastName,
      workspaceName,
      workspaceNameExtension,
      state,
    } = this.props.evaluationAssessmentRequest;

    const studentNameString = `${lastName}, ${firstName}`;

    let workspaceNameString = `${workspaceName}`;

    if (workspaceNameExtension) {
      workspaceNameString = `${workspaceName} (${workspaceNameExtension})`;
    }

    let deleteButtonLocale = this.props.t("actions.remove", {
      context: "evaluationRequest",
    });

    if (state === "interim_evaluation_request") {
      deleteButtonLocale = this.props.t("actions.remove", {
        context: "interimEvaluationRequest",
      });
    } else if (state === "incomplete") {
      deleteButtonLocale = this.props.t("actions.remove", {
        context: "supplementationRequest",
      });
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
          {deleteButtonLocale}
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
    const content = (closeDialog: () => void) => {
      let localeString = this.props.t("content.removing", {
        context: "evaluationRequest",
        student: studentNameString,
        workspace: workspaceNameString,
      });

      if (state === "interim_evaluation_request") {
        localeString = this.props.t("content.removing", {
          context: "interimRequest",
          student: studentNameString,
          workspace: workspaceNameString,
        });
      } else if (state === "incomplete") {
        localeString = this.props.t("content.removing", {
          context: "supplementationRequest",
          student: studentNameString,
          workspace: workspaceNameString,
        });
      }

      return (
        <div dangerouslySetInnerHTML={this.createHtmlMarkup(localeString)} />
      );
    };

    let titleLocale = this.props.t("labels.remove", {
      context: "evaluationRequest",
      student: studentNameString,
      workspace: workspaceNameString,
    });

    if (state === "interim_evaluation_request") {
      titleLocale = this.props.t("labels.remove", {
        context: "interimEvaluationRequest",
        student: studentNameString,
        workspace: workspaceNameString,
      });
    } else if (state === "incomplete") {
      titleLocale = this.props.t("labels.remove", {
        context: "supplementationRequest",
        student: studentNameString,
        workspace: workspaceNameString,
      });
    }

    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-archive-request"
        title={titleLocale}
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      deleteAssessmentRequest,
      deleteInterimEvaluationRequest,
      deleteSupplementationRequest,
    },
    dispatch
  );
}

export default withTranslation(["evaluation"])(
  connect(null, mapDispatchToProps)(DeleteRequestDialog)
);
