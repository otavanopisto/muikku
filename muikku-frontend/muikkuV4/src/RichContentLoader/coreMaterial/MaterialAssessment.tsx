import { useMaterialContentContext } from "./MaterialContentProvider";

/**
 * Shared literal assessment block
 */
export function MaterialAssessment() {
  const { material, compositeReplies, config } = useMaterialContentContext();

  if (config.enableAssessment === false) {
    return null;
  }

  if (material.assignmentType !== "EVALUATED") {
    return null;
  }

  const literalAssessment = compositeReplies?.evaluationInfo?.text;
  if (!literalAssessment) {
    return null;
  }

  return (
    <div className="material-page__assignment-assessment-literal">
      <div className="material-page__assignment-assessment-literal-label">
        Assessment:
      </div>
      <div
        className="material-page__assignment-assessment-literal-data rich-text"
        // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: literalAssessment }}
      />
    </div>
  );
}
