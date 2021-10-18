import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import Evaluation from "../body/application/evaluation/evaluation";
import { AssessmentRequest } from "~/@types/evaluation";
import { StatusType } from "~/reducers/base/status";
import {
  LoadBasePrice,
  loadBasePriceFromServer,
  LoadEvaluationCurrentStudentAssigments,
  loadCurrentStudentAssigmentsData,
  LoadEvaluationStudyDiaryEvent,
  loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer,
  LoadEvaluationCompositeReplies,
  loadEvaluationCompositeRepliesFromServer,
  UpdateEvaluationSelectedAssessment,
  updateSelectedAssessment,
} from "~/actions/main-function/evaluation/evaluationActions";

/**
 * EvaluateDialogProps
 */
interface EvaluateDialogProps {
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => any;
  onOpen?: (jotan: any) => any;
  i18n: i18nType;
  status: StatusType;
  assessment: AssessmentRequest;
  updateSelectedAssessment: UpdateEvaluationSelectedAssessment;
  loadCurrentStudentAssigmentsData: LoadEvaluationCurrentStudentAssigments;
  loadEvaluationCompositeRepliesFromServer: LoadEvaluationCompositeReplies;
  loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer: LoadEvaluationStudyDiaryEvent;
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
   */
  constructor(props: EvaluateDialogProps) {
    super(props);
  }

  /**
   * handleUpdateSelectAssessmentId
   */
  handleUpdateSelectAssessmentOnDialogOpen = (
    assessment: AssessmentRequest
  ): any => {
    this.props.updateSelectedAssessment({ assessment });
    this.props.loadEvaluationCompositeRepliesFromServer({
      userEntityId: this.props.assessment.userEntityId,
      workspaceId: assessment.workspaceEntityId,
    });
    this.props.loadCurrentStudentAssigmentsData({
      workspaceId: assessment.workspaceEntityId,
    });
    this.props.loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer({
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
    const content = (closeDialog: () => any) => {
      return (
        <Evaluation
          onClose={closeDialog}
          selectedAssessment={this.props.assessment}
        />
      );
    };
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
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      updateSelectedAssessment,
      loadCurrentStudentAssigmentsData,

      loadEvaluationCompositeRepliesFromServer,
      loadEvaluationSelectedAssessmentStudyDiaryEventsFromServer,
      loadBasePriceFromServer,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluateDialog);
