import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import RecordingsList from "../../general/voice-recorder/recordings-list";
import { RecordValue } from "../../../@types/recorder";

/**
 * MaterialLoaderAssesmentProps
 */
type MaterialLoaderAssesmentProps = MaterialLoaderProps;

/**
 * MaterialLoaderAssesment
 * @param props props
 * @returns JSX.Element
 */
export function MaterialLoaderAssesment(props: MaterialLoaderAssesmentProps) {
  const literalAssesment =
    (props.material.evaluation && props.material.evaluation.verbalAssessment) ||
    (props.compositeReplies &&
      props.compositeReplies.evaluationInfo &&
      props.compositeReplies.evaluationInfo.text);

  const audioAssessments =
    (props.compositeReplies &&
      props.compositeReplies.evaluationInfo &&
      props.compositeReplies.evaluationInfo.audioAssessments) ||
    (props.material.evaluation && props.material.evaluation.audioAssessments);

  if (literalAssesment === undefined && audioAssessments === undefined) {
    return null;
  }

  const audioRecords =
    audioAssessments &&
    audioAssessments.map(
      (aAssessment) =>
        ({
          id: aAssessment.id,
          name: aAssessment.name,
          contentType: aAssessment.contentType,
          url: `/rest/workspace/materialevaluationaudioassessment/${aAssessment.id}`,
        } as RecordValue)
    );

  // As default use case in the materials assignmentType is check from material object
  // but in the case evaluation it is done from assignment object when used from evaluation
  const isInterminEvaluation =
    props.usedAs === "default"
      ? props.material.assignmentType === "INTERIM_EVALUATION"
      : props.material.assignment &&
        props.material.assignment.assignmentType === "INTERIM_EVALUATION";

  // Corresponding text is shown whether assessment is
  // given for interim evaluation
  const assessmentLabelText = isInterminEvaluation
    ? props.i18nOLD.text.get(
        "plugin.workspace.materialsLoader.evaluation.literalIntermin.label"
      )
    : props.i18nOLD.text.get(
        "plugin.workspace.materialsLoader.evaluation.literal.label"
      );

  return (
    <div className="material-page__assignment-assessment-literal">
      <div className="material-page__assignment-assessment-literal-label">
        {assessmentLabelText}:
      </div>
      <div
        className="material-page__assignment-assessment-literal-data rich-text"
        dangerouslySetInnerHTML={{ __html: literalAssesment }}
      ></div>

      {audioAssessments !== undefined && audioAssessments.length > 0 ? (
        <>
          <div className="material-page__assignment-assessment-verbal-label">
            {props.i18nOLD.text.get(
              "plugin.workspace.materialsLoader.evaluation.verbal.label"
            )}
            :
          </div>
          <div className="voice-container">
            <RecordingsList records={audioRecords} noDeleteFunctions />
          </div>
        </>
      ) : null}
    </div>
  );
}
