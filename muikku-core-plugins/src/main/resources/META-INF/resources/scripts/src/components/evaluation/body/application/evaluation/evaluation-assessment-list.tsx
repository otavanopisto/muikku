import * as React from "react";
import "~/sass/elements/rich-text.scss";
import { StateType } from "~/reducers";
import { AnyActionType } from "~/actions";
import { connect, Dispatch } from "react-redux";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import Link from "~/components/general/link";
import { WorkspaceDataType } from "~/reducers/workspaces";
import EvaluationAssessmentAssignment from "./evaluation-assessment-assignment";
import EvaluationAssessmentInterminEvaluation from "./evaluation-assessment-intermin-evaluation";
import {
  EvaluationAssessmentRequest,
  MaterialCompositeReply,
} from "~/generated/client";
import { useTranslation } from "react-i18next";

/**
 * EvaluationEventContentCardProps
 */
interface AssessmentListProps {
  evaluation: EvaluationState;
  workspaces: WorkspaceDataType[];
  selectedAssessment: EvaluationAssessmentRequest;
}

/**
 * Creates evaluation diary event component
 *
 * @param props props
 * @returns JSX.Element
 */
const AssessmentList: React.FC<AssessmentListProps> = (props) => {
  const { evaluation, workspaces, selectedAssessment } = props;

  const { t } = useTranslation(["evaluation", "materials", "common"]);

  const [listOfAssignmentIds, setListOfAssignmentIds] = React.useState<
    number[]
  >([]);

  React.useEffect(() => {
    if (
      evaluation.evaluationDiaryEntries.state === "READY" &&
      evaluation.evaluationDiaryEntries.data &&
      evaluation.evaluationDiaryEntries.data.length > 0
    ) {
      setListOfAssignmentIds(
        evaluation.evaluationDiaryEntries.data.map((dEntry) => dEntry.id)
      );
    }
  }, [
    evaluation.evaluationDiaryEntries.data,
    evaluation.evaluationDiaryEntries.state,
  ]);

  /**
   * Handles close all material contents click
   */
  const handleCloseAllMaterialContentClick = () => {
    setListOfAssignmentIds([]);
  };

  /**
   * Handles open all material contents click
   */
  const handleOpenAllMaterialContentClick = () => {
    if (
      evaluation.evaluationCurrentStudentAssigments &&
      evaluation.evaluationCurrentStudentAssigments.data
    ) {
      const numberList =
        evaluation.evaluationCurrentStudentAssigments.data.assigments.map(
          (item) => item.id
        );

      setListOfAssignmentIds(numberList);
    }
  };

  /**
   * Shows hidden evaluation assignment if it's has been submitted and assignment
   * is set to be hidden or even if student has answered it before it was set to hidden then
   * other states are also shown as they are part of evaluation
   *
   * @param compositeReply assignment compositereply
   * @returns boolean whether to show assignment or not
   */
  const showAsHiddenEvaluationAssignment = (
    compositeReply?: MaterialCompositeReply
  ): boolean =>
    compositeReply &&
    (compositeReply.submitted !== null ||
      compositeReply.state === "ANSWERED" ||
      compositeReply.state === "SUBMITTED" ||
      compositeReply.state === "WITHDRAWN" ||
      compositeReply.state === "PASSED" ||
      compositeReply.state === "FAILED" ||
      compositeReply.state === "INCOMPLETE");

  /**
   * Handles close specific material content
   *
   * @param materialId materialId
   */
  const handleCloseSpecificMaterialContent = (materialId: number) => {
    const updatedList = listOfAssignmentIds.filter((id) => id !== materialId);

    setListOfAssignmentIds(updatedList);
  };

  /**
   * Handles open Material click
   *
   * @param id id
   */
  const handleOpenMaterialClick = (id: number) => {
    const updatedList = [...listOfAssignmentIds];

    const index = updatedList.findIndex((itemId) => itemId === id);

    if (index !== -1) {
      updatedList.splice(index, 1);
    } else {
      updatedList.push(id);
    }

    setListOfAssignmentIds(updatedList);
  };

  // renderEvaluationAssessmentAssignments
  const renderEvaluationAssessmentAssignments =
    evaluation.evaluationCurrentStudentAssigments.data &&
    evaluation.evaluationCurrentStudentAssigments.data.assigments.length > 0 ? (
      evaluation.evaluationCurrentStudentAssigments.data.assigments.map(
        (item, i) => {
          // Possible composite reply
          const compositeReply =
            evaluation.evaluationCompositeReplies &&
            evaluation.evaluationCompositeReplies.data &&
            evaluation.evaluationCompositeReplies.data.find(
              (cReply) => cReply.workspaceMaterialId === item.id
            );

          let showAsHidden = false;

          // If item is set to be hidden check is student has submitted it before
          // it was set to hidden
          if (item.hidden) {
            showAsHidden = showAsHiddenEvaluationAssignment(compositeReply);
          }

          // Don't show assignment
          if (item.hidden && !showAsHidden) {
            return null;
          }

          const workspace = workspaces.find(
            (eWorkspace) =>
              eWorkspace.id === selectedAssessment.workspaceEntityId
          );

          const open = listOfAssignmentIds.includes(item.id);

          // For simplicity, we'll use intermin evaluation as its own component
          if (item.assignmentType === "INTERIM_EVALUATION") {
            return (
              <EvaluationAssessmentInterminEvaluation
                key={i}
                workspace={workspace}
                open={open}
                assigment={item}
                compositeReply={compositeReply}
                showAsHidden={showAsHidden}
                onClickOpen={handleOpenMaterialClick}
                onSave={handleCloseSpecificMaterialContent}
                selectedAssessment={selectedAssessment}
              />
            );
          }

          // Otherwise, it's an assignment component which includes EVALAUTE and EXERCISE type assignments
          return (
            <EvaluationAssessmentAssignment
              key={i}
              workspace={workspace}
              open={open}
              assigment={item}
              compositeReply={compositeReply}
              showAsHidden={showAsHidden}
              onClickOpen={handleOpenMaterialClick}
              onSave={handleCloseSpecificMaterialContent}
              selectedAssessment={selectedAssessment}
            />
          );
        }
      )
    ) : (
      <div className="empty">
        <span>
          {t("content.empty", { ns: "evaluation", context: "assignments" })}
        </span>
      </div>
    );

  return (
    <div className="evaluation-modal__content">
      <div className="evaluation-modal__content-title">
        <>
          {t("labels.assignments", { ns: "materials" })}
          {evaluation.evaluationCurrentStudentAssigments.state === "READY" &&
          evaluation.evaluationCompositeReplies.state === "READY" ? (
            <div className="evaluation-modal__content-actions">
              <Link
                className="link link--evaluation link--evaluation-open-close"
                onClick={handleCloseAllMaterialContentClick}
              >
                {t("actions.closeAll")}
              </Link>
              <Link
                className="link link--evaluation link--evaluation-open-close"
                onClick={handleOpenAllMaterialContentClick}
              >
                {t("actions.openAll", { ns: "evaluation" })}
              </Link>
            </div>
          ) : null}
        </>
      </div>
      <div className="evaluation-modal__content-body">
        {evaluation.evaluationCurrentStudentAssigments.state === "READY" &&
        evaluation.evaluationCompositeReplies.state === "READY" ? (
          renderEvaluationAssessmentAssignments
        ) : (
          <div className="loader-empty" />
        )}
      </div>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    evaluation: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentList);
