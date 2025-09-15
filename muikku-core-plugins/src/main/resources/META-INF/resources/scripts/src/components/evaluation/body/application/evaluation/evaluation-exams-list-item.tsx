import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import {
  ExamAttendance,
  MaterialCompositeReply,
  MaterialContentNode,
} from "~/generated/client";
import { localize } from "~/locales/i18n";
import { WorkspaceDataType } from "~/reducers/workspaces";
import EvaluationMaterial from "./evaluation-material";
import "~/sass/elements/evaluation.scss";

/**
 * EvaluationExamsListItemProps
 */
interface EvaluationExamsListItemProps {
  exam: ExamAttendance;
  studentUserEntityId: number;
  workspace: WorkspaceDataType;
  evaluationCompositeReplies: MaterialCompositeReply[];
}

/**
 * Evaluation exams list item component
 * @param props - props
 */
const EvaluationExamsListItem = React.forwardRef(
  (props: EvaluationExamsListItemProps, ref: React.Ref<HTMLDivElement>) => {
    const { studentUserEntityId, workspace, exam, evaluationCompositeReplies } =
      props;
    const { contents } = exam;

    const { t } = useTranslation(["evaluation", "common"]);

    const [showContent, setShowContent] = React.useState(false);

    /**
     * handleToggleOpen
     */
    const handleToggleContent = () => {
      setShowContent(!showContent);
    };

    /**
     * Render exam meta
     * @returns JSX.Element
     */
    const renderExamMeta = () => {
      // Check if exam has ended
      const isEnded = !!exam.ended;

      // Check if exam has been started
      const isStarted = !!exam.started;

      // Check if exam has time limit
      const hasTimeLimit = exam.minutes > 0;

      return (
        <div className="evaluation-modal__item-meta">
          {isEnded ? (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.examEnded", { ns: "exams" })}:
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {`${localize.date(exam.ended)} - ${localize.date(exam.ended, "LT")}`}
              </span>
            </div>
          ) : isStarted ? (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.examStarted", { ns: "exams" })}:
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {`${localize.date(exam.started)} - ${localize.date(exam.started, "LT")}`}
              </span>
            </div>
          ) : (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.examNotStarted", { ns: "exams" })}
              </span>
            </div>
          )}

          {hasTimeLimit && (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.examDuration", { ns: "exams" })}:
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {exam.minutes} minuuttia
              </span>
            </div>
          )}
        </div>
      );
    };

    /**
     * Render content
     * @returns JSX.Element
     */
    const renderContent = () => {
      const assignmentItems =
        contents && contents.length > 0 ? (
          contents.map((content) => {
            const compositeReply = evaluationCompositeReplies.find(
              (cReply) =>
                cReply.workspaceMaterialId === content.workspaceMaterialId
            );

            return (
              <div
                key={content.materialId}
                className="evaluation-modal__content-sub-item"
              >
                <AssignmentItem
                  content={content}
                  studentUserEntityId={studentUserEntityId}
                  workspace={workspace}
                  compositeReply={compositeReply}
                />
              </div>
            );
          })
        ) : (
          <div className="empty">
            <span>
              {t("content.empty", { ns: "evaluation", context: "assignments" })}
            </span>
          </div>
        );

      return assignmentItems;
    };

    return (
      <>
        <div
          ref={ref}
          className="evaluation-modal__item"
          onClick={handleToggleContent}
        >
          <div className="evaluation-modal__item-header">
            <div className="evaluation-modal__item-header-title">
              {props.exam.name}
              {renderExamMeta()}
            </div>
          </div>
        </div>

        <AnimateHeight duration={400} height={showContent ? "auto" : 0}>
          {renderContent()}
        </AnimateHeight>
      </>
    );
  }
);

/**
 * AssignmentItemProps
 */
interface AssignmentItemProps {
  studentUserEntityId: number;
  content: MaterialContentNode;
  compositeReply?: MaterialCompositeReply;
  workspace: WorkspaceDataType;
}

/**
 * Assignment item component for exams list
 * @param props - props
 */
const AssignmentItem = (props: AssignmentItemProps) => {
  const { content, compositeReply, studentUserEntityId, workspace } = props;

  const [contentOpen, setContentOpen] = React.useState(false);

  const { t } = useTranslation(["evaluation", "common"]);

  /**
   * Handle toggle content
   */
  const handleToggleContent = () => {
    setContentOpen(!contentOpen);
  };

  /**
   * Get material type class
   * @returns string
   */
  const materialTypeClass = () => {
    if (content.assignmentType === "EVALUATED") {
      return "assignment";
    }
    return "exercise";
  };

  /**
   * Render assignment meta
   * @returns JSX.Element
   */
  const renderAssignmentMeta = () => {
    if (!compositeReply) {
      return null;
    }

    // Checking if assigments is submitted at all.
    // Its date string
    const hasSubmitted = compositeReply.submitted;

    return (
      <div className="evaluation-modal__item-meta">
        {hasSubmitted === null ||
        (hasSubmitted !== null && compositeReply.state === "WITHDRAWN") ? (
          <div className="evaluation-modal__item-meta-item">
            <span className="evaluation-modal__item-meta-item-data">
              {t("labels.notDone", { ns: "evaluation" })}
            </span>
          </div>
        ) : (
          hasSubmitted && (
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.done", { ns: "evaluation" })}
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {localize.date(hasSubmitted)}
              </span>
            </div>
          )
        )}
      </div>
    );
  };

  const titleModifiers = [materialTypeClass()];

  return (
    <div className="evaluation-modal__item">
      <div className="evaluation-modal__item-header">
        <div
          onClick={handleToggleContent}
          className={`evaluation-modal__item-header-title ${titleModifiers.map((modifier) => `evaluation-modal__item-header-title--${modifier}`).join(" ")}`}
        >
          {content.title}
          {renderAssignmentMeta()}
        </div>
      </div>

      <AnimateHeight duration={400} height={contentOpen ? "auto" : 0}>
        {workspace && content && (
          <EvaluationMaterial
            material={content}
            workspace={workspace}
            compositeReply={compositeReply}
            userEntityId={studentUserEntityId}
          />
        )}
      </AnimateHeight>
    </div>
  );
};

EvaluationExamsListItem.displayName = "EvaluationExamsListItem";

export default EvaluationExamsListItem;
