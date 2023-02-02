import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import { AssessmentRequest } from "~/@types/evaluation";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import {
  UpdateNeedsReloadEvaluationRequests,
  updateNeedsReloadEvaluationRequests,
} from "~/actions/main-function/evaluation/evaluationActions";
import {
  LoadEvaluationAssessmentRequest,
  loadEvaluationAssessmentRequestsFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import {
  LoadEvaluationAssessmentEvent,
  loadEvaluationAssessmentEventsFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import {
  ArchiveStudent,
  archiveStudent,
} from "~/actions/main-function/evaluation/evaluationActions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ArchiveDialogProps
 */
interface ArchiveDialogProps extends AssessmentRequest, WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  place: "card" | "modal";
  isOpen?: boolean;
  onClose?: () => void;
  i18nOLD: i18nType;
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
   * @param props props
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
  createHtmlMarkup = (htmlString: string) => ({
    __html: htmlString,
  });

  /**
   * deleteRequest
   */
  archiveStudent() {
    const { workspaceUserEntityId, workspaceEntityId, onClose } = this.props;

    this.props.archiveStudent({
      workspaceEntityId,
      workspaceUserEntityId,
      /**
       * onSuccess
       */
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
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.archiveStudent.bind(this, closeDialog)}
        >
          {/* {t("evaluation:actions.remove_student")} */}
          {this.props.t("actions.archiveStudent", { ns: "evaluation" })}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.props.onClose ? this.props.onClose : closeDialog}
        >
          {this.props.place === "card"
            ? this.props.t("actions.cancel")
            : "Ei (TODO: Translate)"}{" "}
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
          this.props.t("content.archive_student", {
            ns: "evaluation",
            studentName: studentNameString,
          })
        )}
      />
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        modifier="evaluation-archive-student"
        title={this.props.t("labels.archiveStudent", { ns: "evaluation" })}
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
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
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

export default withTranslation(["evaluation", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(ArchiveDialog)
);
