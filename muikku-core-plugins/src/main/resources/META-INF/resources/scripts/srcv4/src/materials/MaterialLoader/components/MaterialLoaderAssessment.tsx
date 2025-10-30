import { useMaterialLoaderContext } from "../core/MaterialLoaderProvider";

/**
 * MaterialLoaderAssessment component
 * Displays assessment information (grade, points, etc.)
 */
export function MaterialLoaderAssessment() {
  const { material, compositeReplies, config } = useMaterialLoaderContext();

  // Don't render if assessment is disabled
  if (!config.enableAssessment) {
    return null;
  }

  // Only show for evaluated assignments
  if (material.assignmentType !== "EVALUATED") {
    return null;
  }

  const assessmentLabelText = "Assessment";
  const literalAssesment = compositeReplies?.evaluationInfo?.text;

  if (!literalAssesment) {
    return null;
  }

  return (
    <div className="material-page__assignment-assessment-literal">
      <div className="material-page__assignment-assessment-literal-label">
        {assessmentLabelText}:
      </div>
      <div
        className="material-page__assignment-assessment-literal-data rich-text"
        // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: literalAssesment }}
      ></div>

      {/* {audioAssessments !== undefined && audioAssessments.length > 0 ? (
        <>
          <div className="material-page__assignment-assessment-verbal-label">
            {t("labels.verbalEvaluation", { ns: "evaluation" })}:
          </div>
          <div className="voice-container">
            <RecordingsList records={audioRecords} noDeleteFunctions />
          </div>
        </>
      ) : null} */}
    </div>
  );
}
