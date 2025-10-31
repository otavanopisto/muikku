import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { EvaluationAssessmentRequest } from "~/generated/client";
import { StateType } from "~/reducers";
import { WorkspaceDataType } from "~/reducers/workspaces";
import EvaluationExamsListItem from "./evaluation-exams-list-item";

/**
 * EvaluationExamsListProps
 */
interface EvaluationExamsListProps {
  workspaces: WorkspaceDataType[];
  selectedAssessment: EvaluationAssessmentRequest;
}

/**
 * Evaluation exams list component
 * @param props - props
 */
const EvaluationExamsList = (props: EvaluationExamsListProps) => {
  const { t } = useTranslation(["evaluation", "exams", "common"]);

  const { evaluationExams, evaluationCompositeReplies } = useSelector(
    (state: StateType) => state.evaluations
  );

  // Check if any necessary data is ready
  const examsIsReady = evaluationExams.state === "READY";
  const evaluationCompositeRepliesIsReady =
    evaluationCompositeReplies.state === "READY";

  // Get exams
  const exams = evaluationExams.data;

  const workspace = props.workspaces.find(
    (workspace) => workspace.id === props.selectedAssessment.workspaceEntityId
  );

  // Generate list content
  const listContent =
    exams && exams.length > 0 ? (
      exams.map((exam) => (
        <EvaluationExamsListItem
          key={exam.folderId}
          exam={exam}
          studentUserEntityId={props.selectedAssessment.userEntityId}
          workspace={workspace}
          evaluationCompositeReplies={evaluationCompositeReplies.data}
        />
      ))
    ) : (
      <div className="empty">
        <span>
          {t("content.empty", { ns: "evaluation", context: "exams" })}
        </span>
      </div>
    );

  return (
    <div className="evaluation-modal__content">
      <div className="evaluation-modal__content-title">
        {t("labels.exams", { ns: "exams" })}
      </div>

      <div className="evaluation-modal__content-body">
        {examsIsReady && evaluationCompositeRepliesIsReady ? (
          listContent
        ) : (
          <div className="loader-empty" />
        )}
      </div>
    </div>
  );
};

export default EvaluationExamsList;
