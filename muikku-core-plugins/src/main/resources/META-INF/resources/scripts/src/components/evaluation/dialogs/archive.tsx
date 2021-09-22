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
import { EvaluationState } from "../../../reducers/main-function/evaluation/index";
import {
  UpdateNeedsReloadEvaluationRequests,
  updateNeedsReloadEvaluationRequests,
} from "../../../actions/main-function/evaluation/evaluationActions";
import {
  LoadEvaluationAssessmentRequest,
  loadEvaluationAssessmentRequestsFromServer,
} from "../../../actions/main-function/evaluation/evaluationActions";
import {
  LoadEvaluationAssessmentEvent,
  loadEvaluationAssessmentEventsFromServer,
} from "../../../actions/main-function/evaluation/evaluationActions";
import {
  ArchiveStudent,
  archiveStudent,
} from "../../../actions/main-function/evaluation/evaluationActions";

/**
 * ArchiveDialogProps
 */
interface ArchiveDialogProps extends AssessmentRequest {
  children?: React.ReactElement<any>;
  place: "card" | "modal";
  isOpen?: boolean;
  onClose?: () => any;
  i18n: i18nType;
  archiveStudent: ArchiveStudent;
  evaluations: EvaluationState;
  loadEvaluationAssessmentEventsFromServer: LoadEvaluationAssessmentEvent;
  loadEvaluationAssessmentRequestsFromServer: LoadEvaluationAssessmentRequest;
  updateNeedsReloadEvaluationRequests: UpdateNeedsReloadEvaluationRequests;
}

/**
 * ArchiveDialogState
 */
interface ArchiveDialogState {}

/**
 * ArchiveDialog
 */
class ArchiveDialog extends React.Component<
  ArchiveDialogProps,
  ArchiveDialogState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: ArchiveDialogProps) {
    super(props);

    this.archiveStudent = this.archiveStudent.bind(this);
  }

  /**
   * createHtmlMarkup
   * This should sanitize html
   * @param htmlString string that contains html
   */
  createHtmlMarkup = (htmlString: string) => {
    return {
      __html: htmlString,
    };
  };

  /**
   * deleteRequest
   * @param closeDialog
   */
  archiveStudent(closeDialog: () => any) {
    const { workspaceUserEntityId, workspaceEntityId, onClose } = this.props;

    this.props.archiveStudent({
      workspaceEntityId,
      workspaceUserEntityId,
      onSuccess: () => {
        if (this.props.place === "card") {
          this.props.loadEvaluationAssessmentRequestsFromServer();
        } else {
          this.props.updateNeedsReloadEvaluationRequests({ value: true });
          this.props.loadEvaluationAssessmentEventsFromServer({
            assessment: this.props.evaluations.evaluationSelectedAssessmentId,
          });
        }

        onClose && onClose();
      },
    });
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { firstName, lastName } = this.props;

    const studentNameString = `${lastName}, ${firstName}`;

    /**
     * footer
     * @param closeDialog
     */
    const footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["fatal", "standard-ok"]}
            onClick={this.archiveStudent.bind(this, closeDialog)}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.archiveStudent.confirmationDialog.buttonArchiveLabel"
            )}
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            onClick={this.props.onClose ? this.props.onClose : closeDialog}
          >
            {this.props.place === "card"
              ? this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.archiveStudent.confirmationDialog.buttonNoLabel"
                )
              : this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.archiveRequest.confirmationDialog.noLabel"
                )}
          </Button>
        </div>
      );
    };

    /**
     * content
     * @param closeDialog
     */
    const content = () => {
      return (
        <div
          dangerouslySetInnerHTML={this.createHtmlMarkup(
            this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.archiveStudent.confirmationDialog.description",
              studentNameString
            )
          )}
        />
      );
    };
    return (
      <Dialog
        isOpen={this.props.isOpen}
        modifier="evaluation-archive-student"
        title={this.props.i18n.text.get(
          "plugin.evaluation.evaluationModal.archiveStudent.confirmationDialog.title"
        )}
        content={content}
        footer={footer}
      >
        {this.props.children && this.props.children}
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
    i18n: state.i18n,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      archiveStudent,
      loadEvaluationAssessmentEventsFromServer,
      loadEvaluationAssessmentRequestsFromServer,
      updateNeedsReloadEvaluationRequests,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveDialog);
