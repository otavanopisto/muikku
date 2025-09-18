import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import { ExamAttendance, MaterialCompositeReply } from "~/generated/client";
import { localize } from "~/locales/i18n";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
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
import RecordingsList from "~/components/general/voice-recorder/recordings-list";
import { createAssignmentInfoArray } from "~/components/general/evaluation-assessment-details/helper";

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

  const myRef = React.useRef<HTMLDivElement>(null);

  const evaluations = useSelector((state: StateType) => state.evaluations);

  const { evaluationSelectedAssessmentId, evaluationCurrentStudentAssigments } =
    evaluations;

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

  const currentExamContentIds = React.useMemo(
    () => exam.contents.map((nodeContent) => nodeContent.workspaceMaterialId),
    [exam.contents]
  );

  const currentExamAssigments = React.useMemo(
    () =>
      evaluationCurrentStudentAssigments.data?.assigments.filter((assignment) =>
        currentExamContentIds.includes(assignment.id)
      ),
    [evaluationCurrentStudentAssigments.data, currentExamContentIds]
  );

  // Lets create list of nodes with logic,
  // that merged node content object with assignment object
  const contentNodesWithLogic: MaterialContentNodeWithIdAndLogic[] =
    React.useMemo(() => {
      if (!evaluationCurrentStudentAssigments.data) {
        return [];
      }

      return exam.contents.map((nodeContent) => {
        const assignment =
          evaluationCurrentStudentAssigments.data?.assigments.find(
            (assignment) => assignment.id === nodeContent.workspaceMaterialId
          );

        if (assignment) {
          return {
            ...nodeContent,
            assignment: evaluationCurrentStudentAssigments.data.assigments.find(
              (assignment) => assignment.id === nodeContent.workspaceMaterialId
            ),
          };
        }
      });
    }, [evaluationCurrentStudentAssigments.data, exam.contents]);

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
   * assigmentGradeClass
   * @param exam - exam
   * @returns classMod
   */
  const assigmentGradeClass = (exam?: ExamAttendance) => {
    const { evaluationInfo } = exam;

    if (!evaluationInfo) {
      return;
    }

    if (evaluationInfo) {
      switch (evaluationInfo.type) {
        case "FAILED":
          return "state-FAILED";

        default:
          return "state-EVALUATED";
      }
    }
  };

  /**
   * Render exam meta
   * @returns JSX.Element
   */
  const renderExamMeta = () => {
    const { evaluationInfo } = exam;

    // Check if exam has ended
    const isEnded = !!exam.ended;

    // Check if exam has been started
    const isStarted = !!exam.started;

    // Check if exam has time limit
    const hasTimeLimit = exam.minutes > 0;

    // Evaluation date if evaluated
    const evaluationDate = evaluationInfo && evaluationInfo.date;

    // Checking if its evaluated with grade
    const evaluatedWithGrade = evaluationInfo && evaluationInfo.grade;

    // Points and max points object
    const pointsAndMaxPoints = {
      points: exam.evaluationInfo?.points,
      show: exam.evaluationInfo?.points !== undefined,
    };

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

            {evaluationDate && (
              <div className="evaluation-modal__item-meta-item">
                <span className="evaluation-modal__item-meta-item-label">
                  {t("labels.evaluated", { ns: "workspace" })}
                </span>
                <span className="evaluation-modal__item-meta-item-data">
                  {localize.date(evaluationDate)}
                </span>
              </div>
            )}

            {evaluatedWithGrade && (
              <div className="evaluation-modal__item-meta-item">
                <span className="evaluation-modal__item-meta-item-label">
                  {t("labels.grade", { ns: "workspace" })}
                </span>
                <span
                  className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assigmentGradeClass(exam)}`}
                >
                  {evaluationInfo.grade}
                </span>
              </div>
            )}

            {pointsAndMaxPoints.show && (
              <div className="evaluation-modal__item-meta-item">
                <span className="evaluation-modal__item-meta-item-label">
                  {t("labels.points", { ns: "workspace" })}
                </span>
                <span className="evaluation-modal__item-meta-item-data">
                  {localize.number(pointsAndMaxPoints.points)}
                </span>
              </div>
            )}
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
   * Render assessment content
   * @returns JSX.Element
   */
  const renderAssessmentContent = () => {
    const { evaluationInfo } = exam;

    if (!evaluationInfo) {
      return null;
    }

    let evalStateClassName = "";
    let evalStateIcon = "";

    switch (evaluationInfo.type) {
      case "FAILED":
        evalStateClassName = "material-page__assignment-assessment--failed";
        evalStateIcon = "icon-thumb-down";
        break;
      case "PASSED":
        evalStateClassName = "material-page__assignment-assessment--passed";
        evalStateIcon = "icon-thumb-up";
        break;
    }

    return (
      <div
        className={`material-page__assignment-assessment ${evalStateClassName}`}
      >
        <div
          className={`material-page__assignment-assessment-icon ${evalStateIcon}`}
        ></div>
        <div className="material-page__assignment-assessment-literal">
          <div className="material-page__assignment-assessment-literal-label">
            {t("labels.literalEvaluation", { ns: "evaluation" })}
          </div>
          <div
            className="material-page__assignment-assessment-literal-data rich-text"
            dangerouslySetInnerHTML={{ __html: evaluationInfo.text }}
          ></div>

          {evaluationInfo.audioAssessments !== undefined &&
          evaluationInfo.audioAssessments.length > 0 ? (
            <>
              <div className="material-page__assignment-assessment-verbal-label">
                {t("labels.verbalEvaluation", { ns: "evaluation" })}:
              </div>
              <div className="voice-container">
                <RecordingsList
                  records={evaluationInfo.audioAssessments}
                  noDeleteFunctions
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  /**
   * Render content
   * @returns JSX.Element
   */
  const renderContent = () => {
    const assignmentItems =
      contentNodesWithLogic && contentNodesWithLogic.length > 0 ? (
        contentNodesWithLogic.map((cNode, i) => {
          const compositeReply = evaluationCompositeReplies.find(
            (cReply) => cReply.workspaceMaterialId === cNode.assignment.id
          );

          // First item is assessment always
          return i === 0 ? (
            <>
              <div
                key={cNode.id}
                className="evaluation-modal__content-sub-item"
              >
                <AssignmentItem
                  exam={exam}
                  contentNode={cNode}
                  studentUserEntityId={studentUserEntityId}
                  workspace={workspace}
                  compositeReply={compositeReply}
                />
              </div>
            </>
          ) : (
            <div key={cNode.id} className="evaluation-modal__content-sub-item">
              <AssignmentItem
                exam={exam}
                contentNode={cNode}
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

  // Assignment info array
  const assignmentInfoArray = createAssignmentInfoArray(
    evaluationCompositeReplies,
    currentExamAssigments
  );

  return (
    <>
      <div className="evaluation-modal__item" onClick={handleShowExamContent}>
        <div
          ref={myRef}
          className={`evaluation-modal__item-header ${assigmentGradeClass(exam)}`}
        >
          <div className="evaluation-modal__item-header-title evaluation-modal__item-header-title--exam">
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
        <AnimateHeight duration={400} height={showExamContent ? "auto" : 0}>
          {renderAssessmentContent()}
        </AnimateHeight>
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
            assignmentInfoArray={assignmentInfoArray}
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
  contentNode: MaterialContentNodeWithIdAndLogic;
  studentUserEntityId: number;
  compositeReply?: MaterialCompositeReply;
  workspace: WorkspaceDataType;
}

/**
 * Assignment item component for exams list
 * @param props - props
 */
const AssignmentItem = (props: AssignmentItemProps) => {
  const { compositeReply, studentUserEntityId, workspace, exam, contentNode } =
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
    if (contentNode.assignment.assignmentType === "EVALUATED") {
      return "assignment";
    }
    return "exercise";
  };

  /**
   * assignmentFunctionClass
   * @param compositeReply compositeReply
   * @returns Assignment function button class
   */
  const assignmentFunctionClass = (compositeReply?: MaterialCompositeReply) => {
    if (compositeReply) {
      const { evaluationInfo } = compositeReply;

      if (evaluationInfo) {
        switch (evaluationInfo.type) {
          case "FAILED":
            return "state-FAILED";

          default:
            return "state-EVALUATED";
        }
      }
    }
  };

  /**
   * Render assignment meta
   * @returns JSX.Element
   */
  const renderAssignmentMeta = () => {
    if (!compositeReply) {
      return null;
    }

    const { evaluationInfo } = compositeReply;

    // Checking if assigments is submitted at all.
    // Its date string
    const hasSubmitted = compositeReply.submitted;

    // Evaluation date if evaluated
    const evaluationDate = evaluationInfo && evaluationInfo.date;

    // Points and max points object
    const pointsAndMaxPoints = {
      points: compositeReply.evaluationInfo?.points,
      maxPoints: contentNode.assignment.maxPoints,
      show: compositeReply.evaluationInfo?.points !== undefined,
    };

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

        {evaluationDate && (
          <div className="evaluation-modal__item-meta-item">
            <span className="evaluation-modal__item-meta-item-label">
              {t("labels.evaluated", { ns: "workspace" })}
            </span>
            <span className="evaluation-modal__item-meta-item-data">
              {localize.date(evaluationDate)}
            </span>
          </div>
        )}

        {pointsAndMaxPoints.show && (
          <div className="evaluation-modal__item-meta-item">
            <span className="evaluation-modal__item-meta-item-label">
              {t("labels.points", { ns: "workspace" })}
            </span>
            <span className="evaluation-modal__item-meta-item-data">
              {!pointsAndMaxPoints.maxPoints
                ? localize.number(pointsAndMaxPoints.points)
                : `${localize.number(
                    pointsAndMaxPoints.points
                  )} / ${localize.number(pointsAndMaxPoints.maxPoints)}`}
            </span>
          </div>
        )}
      </div>
    );
  };

  const titleModifiers = [materialTypeClass()];

  return (
    <div className="evaluation-modal__item">
      <div
        ref={myRef}
        className={`evaluation-modal__item-header ${assignmentFunctionClass(compositeReply)}`}
      >
        <div
          onClick={handleToggleContent}
          className={`evaluation-modal__item-header-title ${titleModifiers.map((modifier) => `evaluation-modal__item-header-title--${modifier}`).join(" ")}`}
        >
          {contentNode.assignment.title}
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
        title={`${props.exam.name} - ${contentNode.assignment.title}`}
        show={assignmentEditorOpen}
        onClose={handleCloseAssessmentEditor}
      >
        <ExamAssignmentEditor
          selectedAssessment={evaluationSelectedAssessmentId}
          editorLabel={t("labels.literalEvaluation", {
            ns: "evaluation",
            context: "assignment",
          })}
          materialAssignment={contentNode.assignment}
          compositeReply={compositeReply}
          onClose={handleCloseAssessmentEditor}
        />
      </SlideDrawer>

      <AnimateHeight duration={400} height={contentOpen ? "auto" : 0}>
        {workspace && contentNode.assignment && (
          <EvaluationMaterial
            material={contentNode}
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
