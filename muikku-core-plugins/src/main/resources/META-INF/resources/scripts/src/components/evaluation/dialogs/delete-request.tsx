import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import { AssessmentRequest } from "../../../@types/evaluation";
import {
  deleteAssessmentRequest,
  DeleteAssessmentRequest
} from "../../../actions/main-function/evaluation/evaluationActions";

/**
 * ArchiveDialogProps
 */
interface DeleteRequestDialogProps extends AssessmentRequest {
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => any;
  i18n: i18nType;
  deleteAssessmentRequest: DeleteAssessmentRequest;
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
   * @param props
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
  createHtmlMarkup = (htmlString: string) => {
    return {
      __html: htmlString
    };
  };

  /**
   * deleteRequest
   * @param closeDialog
   */
  deleteRequest(closeDialog: () => any) {
    this.props.deleteAssessmentRequest({
      workspaceUserEntityId: this.props.workspaceUserEntityId
    });
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
     * @param closeDialog
     */
    const footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["fatal", "standard-ok"]}
            onClick={this.deleteRequest.bind(this, closeDialog)}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.archiveRequest.confirmationDialog.buttonArchiveLabel"
            )}
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            onClick={closeDialog}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.archiveRequest.confirmationDialog.buttonNoLabel"
            )}
          </Button>
        </div>
      );
    };

    /**
     * content
     * @param closeDialog
     */
    const content = (closeDialog: () => any) => {
      return (
        <div
          dangerouslySetInnerHTML={this.createHtmlMarkup(
            this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.archiveRequest.confirmationDialog.description",
              studentNameString,
              workspaceNameString
            )
          )}
        />
      );
    };
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-archive-request"
        title={this.props.i18n.text.get(
          "plugin.evaluation.evaluationModal.archiveRequest.confirmationDialog.title"
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
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ deleteAssessmentRequest }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteRequestDialog);
