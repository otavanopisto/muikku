import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import Evaluation from "../body/application/evaluation/evaluation";
import { StatusType } from "~/reducers/base/status";
import {
  LoadBasePrice,
  loadBasePriceFromServer,
  LoadEvaluationCurrentStudentAssigments,
  loadCurrentStudentAssigmentsData,
  LoadEvaluationJournalEvents,
  loadEvaluationSelectedAssessmentJournalEventsFromServer,
  LoadEvaluationCompositeReplies,
  loadEvaluationCompositeRepliesFromServer,
  UpdateEvaluationSelectedAssessment,
  setSelectedAssessmentAndLoadEvents,
  LoadEvaluationJournalFeedbackFromServerTriggerType,
  loadEvaluationJournalFeedbackFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import { EvaluationAssessmentRequest } from "~/generated/client";

/**
 * EvaluateDialogProps
 */
interface EvaluateDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  isOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpen?: (jotan: any) => any;
  status: StatusType;
  assessment: EvaluationAssessmentRequest;
  setSelectedAssessmentAndLoadEvents: UpdateEvaluationSelectedAssessment;
  loadCurrentStudentAssigmentsData: LoadEvaluationCurrentStudentAssigments;
  loadEvaluationCompositeRepliesFromServer: LoadEvaluationCompositeReplies;
  loadEvaluationJournalFeedbackFromServer: LoadEvaluationJournalFeedbackFromServerTriggerType;
  loadEvaluationSelectedAssessmentJournalEventsFromServer: LoadEvaluationJournalEvents;
  loadBasePriceFromServer: LoadBasePrice;
}

/**
 * EvaluateDialogState
 */
interface EvaluateDialogState {}

/**
 * Evaluate dialog for evaluation
 */
class EvaluateDialog extends React.Component<
  EvaluateDialogProps,
  EvaluateDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: EvaluateDialogProps) {
    super(props);
  }

  /**
   * handleUpdateSelectAssessmentId
   * @param assessment assessment
   */
  handleUpdateSelectAssessmentOnDialogOpen = (
    assessment: EvaluationAssessmentRequest
  ) => {
    this.props.setSelectedAssessmentAndLoadEvents({ assessment });

    this.props.loadEvaluationCompositeRepliesFromServer({
      userEntityId: this.props.assessment.userEntityId,
      workspaceId: assessment.workspaceEntityId,
    });

    this.props.loadCurrentStudentAssigmentsData({
      workspaceId: assessment.workspaceEntityId,
    });

    this.props.loadEvaluationJournalFeedbackFromServer({
      userEntityId: assessment.userEntityId,
      workspaceEntityId: assessment.workspaceEntityId,
    });

    this.props.loadEvaluationSelectedAssessmentJournalEventsFromServer({
      assessment,
    });

    this.props.loadBasePriceFromServer({
      workspaceEntityId: assessment.workspaceEntityId,
    });
  };

  /**
   * handleOnDialogOpen
   */
  handleOnDialogOpen = () => {
    this.handleUpdateSelectAssessmentOnDialogOpen(this.props.assessment);
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (closeDialog: () => any) => (
      <Evaluation
        onClose={closeDialog}
        selectedAssessment={this.props.assessment}
      />
    );
    return (
      <Dialog
        onOpen={this.handleOnDialogOpen}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation"
        title="Arvioi"
        content={content}
        disableScroll
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      setSelectedAssessmentAndLoadEvents,
      loadCurrentStudentAssigmentsData,
      loadEvaluationCompositeRepliesFromServer,
      loadEvaluationJournalFeedbackFromServer,
      loadEvaluationSelectedAssessmentJournalEventsFromServer,
      loadBasePriceFromServer,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluateDialog);
