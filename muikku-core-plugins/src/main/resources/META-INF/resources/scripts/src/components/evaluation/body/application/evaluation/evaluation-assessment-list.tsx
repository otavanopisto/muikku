import * as React from "react";
import "~/sass/elements/rich-text.scss";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";
import Link from "~/components/general/link";
import { WorkspaceDataType } from "~/reducers/workspaces";
import EvaluationAssessmentAssignment from "./evaluation-assessment-assignment";
import EvaluationAssessmentInterminEvaluation from "./evaluation-assessment-intermin-evaluation";
import {
  EvaluationAssessmentRequest,
  MaterialCompositeReply,
  WorkspaceMaterial,
} from "~/generated/client";
import { useTranslation } from "react-i18next";

/**
 * EvaluationEventContentCardProps
 */
interface AssessmentListProps {
  workspaces: WorkspaceDataType[];
  selectedAssessment: EvaluationAssessmentRequest;
}

/**
 * Creates evaluation assessment list component
 *
 * @param props props
 * @returns JSX.Element
 */
const AssessmentList = (props: AssessmentListProps) => {
  const { workspaces, selectedAssessment } = props;

  const { t } = useTranslation(["evaluation", "materials", "common"]);

  const [openAssignmentIds, setOpenAssignmentIds] = React.useState<number[]>(
    []
  );

  const evaluation = useSelector((state: StateType) => state.evaluations);

  // Combined state check into a single variable
  // whether data is ready to be displayed
  const isDataReady =
    evaluation.evaluationCurrentStudentAssigments.state === "READY" &&
    evaluation.evaluationCompositeReplies.state === "READY";

  /**
   * Handles closing all assignments
   */
  const handleCloseAll = () => setOpenAssignmentIds([]);

  /**
   * Handles opening all assignments
   */
  const handleOpenAll = () => {
    const allIds =
      evaluation.evaluationCurrentStudentAssigments.data?.assigments.map(
        (item) => item.id
      ) || [];
    setOpenAssignmentIds(allIds);
  };

  /**
   * Handles toggling an assignment
   * @param id id
   */
  const handleToggleAssignment = (id: number) => {
    setOpenAssignmentIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  /**
   * Shows hidden assignment if it is submitted or student has answered to it
   * before it was hidden
   * @param compositeReply compositeReply
   * @returns boolean
   */
  const showAsHiddenEvaluationAssignment = (
    compositeReply?: MaterialCompositeReply
  ): boolean =>
    compositeReply &&
    (compositeReply.submitted !== null ||
      [
        "ANSWERED",
        "SUBMITTED",
        "WITHDRAWN",
        "PASSED",
        "FAILED",
        "INCOMPLETE",
      ].includes(compositeReply.state));

  /**
   * Renders assignments
   * @returns JSX.Element
   */
  const renderAssignments = () => {
    // If there are no assignments, return empty message
    if (
      !evaluation.evaluationCurrentStudentAssigments.data?.assigments.length
    ) {
      return (
        <div className="empty">
          <span>
            {t("content.empty", { ns: "evaluation", context: "assignments" })}
          </span>
        </div>
      );
    }

    // Render assignments
    return evaluation.evaluationCurrentStudentAssigments.data.assigments.map(
      (item, i) => {
        const compositeReply =
          evaluation.evaluationCompositeReplies?.data?.find(
            (cReply) => cReply.workspaceMaterialId === item.id
          );

        const showAsHidden = item.hidden
          ? showAsHiddenEvaluationAssignment(compositeReply)
          : false;

        // If assignment is hidden and condition to show as hidden is not met, return null
        if (item.hidden && !showAsHidden) return null;

        // Get workspace
        const workspace = workspaces.find(
          (eWorkspace) => eWorkspace.id === selectedAssessment.workspaceEntityId
        );

        // Render assignment
        return (
          <AssignmentItem
            key={i}
            item={item}
            workspace={workspace}
            compositeReply={compositeReply}
            showAsHidden={showAsHidden}
            isOpen={openAssignmentIds.includes(item.id)}
            onOpenClick={handleToggleAssignment}
            onSave={handleCloseAll}
            selectedAssessment={selectedAssessment}
          />
        );
      }
    );
  };

  return (
    <div className="evaluation-modal__content">
      <div className="evaluation-modal__content-title">
        <>
          {t("labels.assignments", { ns: "materials" })}
          {isDataReady && (
            <div className="evaluation-modal__content-actions">
              <Link
                className="link link--evaluation link--evaluation-open-close"
                onClick={handleCloseAll}
              >
                {t("actions.closeAll")}
              </Link>
              <Link
                className="link link--evaluation link--evaluation-open-close"
                onClick={handleOpenAll}
              >
                {t("actions.openAll", { ns: "evaluation" })}
              </Link>
            </div>
          )}
        </>
      </div>

      <div className="evaluation-modal__content-body">
        {isDataReady ? renderAssignments() : <div className="loader-empty" />}
      </div>
    </div>
  );
};

/**
 * AssignmentItemProps
 */
interface AssignmentItemProps {
  item: WorkspaceMaterial;
  workspace: WorkspaceDataType | undefined;
  compositeReply: MaterialCompositeReply | undefined;
  showAsHidden: boolean;
  isOpen: boolean;
  onOpenClick: (id: number) => void;
  onSave: (id: number) => void;
  selectedAssessment: EvaluationAssessmentRequest;
}

/**
 * AssignmentItem
 * @param props props
 * @returns JSX.Element
 */
const AssignmentItem = (props: AssignmentItemProps) => {
  const {
    item,
    workspace,
    compositeReply,
    showAsHidden,
    isOpen,
    onOpenClick,
    onSave,
    selectedAssessment,
  } = props;

  if (item.assignmentType === "INTERIM_EVALUATION") {
    return (
      <EvaluationAssessmentInterminEvaluation
        workspace={workspace}
        open={isOpen}
        assigment={item}
        compositeReply={compositeReply}
        showAsHidden={showAsHidden}
        onClickOpen={onOpenClick}
        onSave={onSave}
        selectedAssessment={selectedAssessment}
      />
    );
  }

  return (
    <EvaluationAssessmentAssignment
      workspace={workspace}
      open={isOpen}
      assigment={item}
      compositeReply={compositeReply}
      showAsHidden={showAsHidden}
      onClickOpen={onOpenClick}
      onSave={onSave}
      selectedAssessment={selectedAssessment}
    />
  );
};

export default AssessmentList;
