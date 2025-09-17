import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import { AssessmentWithAudio, NodeEvaluation } from "~/generated/client";

const evaluationApi = MApi.getEvaluationApi();

/**
 * UseExamAssessmentProps
 */
interface UseExamAssessmentProps {
  workspaceId: number;
  workspaceNodeId: number;
  userEntityId: number;
}

/**
 * useExamAssessment
 * @param props - props
 */
export const useExamAssessment = (props: UseExamAssessmentProps) => {
  const { workspaceId, workspaceNodeId, userEntityId } = props;

  const [examNodeEvaluation, setExamNodeEvaluation] =
    React.useState<NodeEvaluation | null>(null);

  const [showExamContent, setShowExamContent] = React.useState(false);
  const [assessmentEditorOpen, setAssessmentEditorOpen] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const dataLoaded = React.useRef(false);

  /**
   * Updates is recording
   * @param value - value
   */
  const updateIsRecording = (value: boolean) => {
    setIsRecording(value);
  };

  /**
   * Toggles exam content
   * @param value - value
   */
  const toggleExamContent = (value?: boolean) => {
    setShowExamContent((prev) => value ?? !prev);
  };

  /**
   * Handles opening assessment editor, which opens the assessment editor and the exam content at the same time
   * and loads material evaluation data
   */
  const openAssessmentEditor = async () => {
    // If material evaluation data exist, just show content and editor straight away
    if (dataLoaded.current) {
      unstable_batchedUpdates(() => {
        setAssessmentEditorOpen(true);
        setShowExamContent(true);
      });
      return;
    }

    unstable_batchedUpdates(() => {
      setAssessmentEditorOpen(true);
      setShowExamContent(true);
      setIsLoading(true);
    });

    try {
      const nodeEvaluation = await evaluationApi.getWorkspaceNodeEvaluations({
        workspaceId: workspaceId,
        workspaceNodeId: workspaceNodeId,
        userEntityId: userEntityId,
      });

      dataLoaded.current = true;

      unstable_batchedUpdates(() => {
        setExamNodeEvaluation(nodeEvaluation[0]);
        setIsLoading(false);
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles closing assessment editor
   * @param value - value
   */
  const closeAssessmentEditor = (value?: boolean) => {
    setAssessmentEditorOpen((prev) => value ?? !prev);
  };

  /**
   * Updates exam node evaluation
   * @param assessmentWithAudio - assessmentWithAudio
   */
  const updateExamNodeEvaluation = (
    assessmentWithAudio: AssessmentWithAudio
  ) => {
    let gradeId: string | null = null;
    let gradeDataSource: string | null = null;

    let gradeScaleId: string | null = null;
    let gradeScaleDataSource: string | null = null;

    if (assessmentWithAudio.gradeIdentifier !== null) {
      /**
       * gradeId and source are included in same string, so splittin is required
       */
      const gradeIdentifierSplitted =
        assessmentWithAudio.gradeIdentifier.split("-");

      gradeId = gradeIdentifierSplitted[1];
      gradeDataSource = gradeIdentifierSplitted[0];
    }

    if (assessmentWithAudio.gradingScaleIdentifier !== null) {
      /**
       * gradeScaleId and source are included in same string, so splittin is required
       */
      const gradeScaleIdentifierSplitted =
        assessmentWithAudio.gradingScaleIdentifier.split("-");

      gradeScaleId = gradeScaleIdentifierSplitted[1];

      gradeScaleDataSource = gradeScaleIdentifierSplitted[0];
    }

    setExamNodeEvaluation((prev) => ({
      ...prev,
      evaluated: assessmentWithAudio.assessmentDate,
      verbalAssessment: assessmentWithAudio.verbalAssessment,
      gradeIdentifier: gradeId,
      gradeSchoolDataSource: gradeDataSource,
      gradingScaleIdentifier: gradeScaleId,
      gradingScaleSchoolDataSource: gradeScaleDataSource,
      passed: assessmentWithAudio.passing,
    }));
  };

  return {
    examNodeEvaluation,
    showExamContent,
    assessmentEditorOpen,
    isLoading,
    isRecording,
    toggleExamContent,
    openAssessmentEditor,
    closeAssessmentEditor,
    updateIsRecording,
    updateExamNodeEvaluation,
  };
};
