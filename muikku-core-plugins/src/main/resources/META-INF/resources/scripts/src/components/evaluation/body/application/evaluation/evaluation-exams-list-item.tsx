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
import { convertTimeRangeToMinutes } from "~/helper-functions/time-helpers";
import SlideDrawer from "./slide-drawer";
import { useExamAssessment } from "~/components/evaluation/hooks/exam-assessment";
import { ButtonPill } from "~/components/general/button";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import ExamAssessmentEditor from "./editors/exam-assessment-editor";
import ExamAssignmentEditor from "./editors/exam-assignment-editor";

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
const EvaluationExamsListItem = (props: EvaluationExamsListItemProps) => {
  const { studentUserEntityId, workspace, exam, evaluationCompositeReplies } =
    props;
  const { contents } = exam;

  const myRef = React.useRef<HTMLDivElement>(null);

  const evaluations = useSelector((state: StateType) => state.evaluations);

  const { evaluationSelectedAssessmentId } = evaluations;

  const { t } = useTranslation(["evaluation", "common"]);

  const {
    isLoading,
    isRecording,
    showExamContent,
    assessmentEditorOpen,
    examNodeEvaluation,
    toggleExamContent,
    openAssessmentEditor,
    closeAssessmentEditor,
    updateIsRecording,
    updateExamNodeEvaluation,
  } = useExamAssessment({
    workspaceId: workspace.id,
    workspaceNodeId: exam.folderId,
    userEntityId: studentUserEntityId,
  });

  /**
   * Handles is recording change
   * @param value - value
   */
  const handleIsRecordingChange = updateIsRecording;

  /**
   * Handles updating exam node evaluation
   * @param assessmentWithAudio - assessmentWithAudio
   */
  const handleUpdateExamNodeEvaluation = updateExamNodeEvaluation;

  /**
   * Handles closing assessment editor
   */
  const handleCloseAssessmentEditor = () => {
    closeAssessmentEditor(false);
  };

  /**
   * Scrolls to opened element
   */
  const handleExecuteScrollToElement = () => {
    window.dispatchEvent(new Event("resize"));

    myRef.current.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Handles showing exam content
   * @param e - event
   */
  const handleShowExamContent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    toggleExamContent();
  };

  /**
   * Handles opening editor
   * @param e - event
   */
  const handleOpenEditor = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
    openAssessmentEditor();
    handleExecuteScrollToElement();
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
          <>
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.examEnded", { ns: "exams" })}:
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {`${localize.date(exam.ended)} - ${localize.date(exam.ended, "LT")}`}
              </span>
            </div>

            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.examDuration", { ns: "exams" })}:
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {`${convertTimeRangeToMinutes(exam.started, exam.ended)} (${exam.minutes}) minuuttia`}
              </span>
            </div>
          </>
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

        {!isEnded && hasTimeLimit && (
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
                exam={exam}
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
        ref={myRef}
        className="evaluation-modal__item"
        onClick={handleShowExamContent}
      >
        <div className="evaluation-modal__item-header">
          <div className="evaluation-modal__item-header-title">
            {props.exam.name}
            {renderExamMeta()}
          </div>

          {!!exam?.ended && (
            <div className="evaluation-modal__item-functions">
              <ButtonPill
                onClick={handleOpenEditor}
                buttonModifiers={["evaluate"]}
                icon="evaluate"
              />
            </div>
          )}
        </div>
      </div>

      <SlideDrawer
        title={props.exam.name}
        show={assessmentEditorOpen}
        onClose={handleCloseAssessmentEditor}
      >
        {isLoading ? (
          <div className="loader-empty" />
        ) : (
          <ExamAssessmentEditor
            selectedAssessment={evaluationSelectedAssessmentId}
            editorLabel={t("labels.literalEvaluation", {
              ns: "evaluation",
              context: "assignment",
            })}
            exam={exam}
            materialEvaluation={examNodeEvaluation}
            isRecording={isRecording}
            onIsRecordingChange={handleIsRecordingChange}
            onClose={handleCloseAssessmentEditor}
            updateMaterialEvaluationData={handleUpdateExamNodeEvaluation}
          />
        )}
      </SlideDrawer>

      <AnimateHeight duration={400} height={showExamContent ? "auto" : 0}>
        {renderContent()}
      </AnimateHeight>
    </>
  );
};

/**
 * AssignmentItemProps
 */
interface AssignmentItemProps {
  exam: ExamAttendance;
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
  const { content, compositeReply, studentUserEntityId, workspace, exam } =
    props;

  const [contentOpen, setContentOpen] = React.useState(false);
  const [assignmentEditorOpen, setAssignmentEditorOpen] = React.useState(false);

  const myRef = React.useRef<HTMLDivElement>(null);

  const { t } = useTranslation(["evaluation", "common"]);

  const evaluations = useSelector((state: StateType) => state.evaluations);

  const { evaluationSelectedAssessmentId } = evaluations;

  /**
   * Handle toggle content
   */
  const handleToggleContent = () => {
    setContentOpen(!contentOpen);
  };

  /**
   * Handles opening editor
   * @param e - event
   */
  const handleOpenEditor = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setAssignmentEditorOpen(true);
    setContentOpen(true);
    handleExecuteScrollToElement();
  };

  /**
   * Handles closing editor
   */
  const handleCloseAssessmentEditor = () => {
    setAssignmentEditorOpen(false);
  };

  /**
   * Scrolls to opened element
   */
  const handleExecuteScrollToElement = () => {
    window.dispatchEvent(new Event("resize"));

    myRef.current.scrollIntoView({ behavior: "smooth" });
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
    <div className="evaluation-modal__item" ref={myRef}>
      <div className="evaluation-modal__item-header">
        <div
          onClick={handleToggleContent}
          className={`evaluation-modal__item-header-title ${titleModifiers.map((modifier) => `evaluation-modal__item-header-title--${modifier}`).join(" ")}`}
        >
          {content.title}
          {renderAssignmentMeta()}
        </div>

        {!!exam?.ended && (
          <div className="evaluation-modal__item-functions">
            <ButtonPill
              onClick={handleOpenEditor}
              buttonModifiers={["evaluate"]}
              icon="evaluate"
            />
          </div>
        )}
      </div>

      <SlideDrawer
        title={`${props.exam.name} - ${content.title}`}
        show={assignmentEditorOpen}
        onClose={handleCloseAssessmentEditor}
      >
        <ExamAssignmentEditor
          selectedAssessment={evaluationSelectedAssessmentId}
          editorLabel={t("labels.literalEvaluation", {
            ns: "evaluation",
            context: "assignment",
          })}
          materialAssignment={content}
          compositeReply={compositeReply}
          onClose={handleCloseAssessmentEditor}
        />
      </SlideDrawer>

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

export default EvaluationExamsListItem;
