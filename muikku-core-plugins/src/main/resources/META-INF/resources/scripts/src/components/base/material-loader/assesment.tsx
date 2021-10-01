import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import RecordingsList from "../../general/voice-recorder/recordings-list";
import { RecordValue } from "../../../@types/recorder";

/**
 * MaterialLoaderAssesmentProps
 */
interface MaterialLoaderAssesmentProps extends MaterialLoaderProps {}

/**
 * MaterialLoaderAssesment
 * @param props
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

  return (
    <div className="material-page__assignment-assessment-literal">
      <div className="material-page__assignment-assessment-literal-label">
        {props.i18n.text.get(
          "plugin.workspace.materialsLoader.evaluation.literal.label"
        )}
        :
      </div>
      <div
        className="material-page__assignment-assessment-literal-data rich-text"
        dangerouslySetInnerHTML={{ __html: literalAssesment }}
      ></div>

      {audioAssessments !== undefined && audioAssessments.length > 0 ? (
        <>
          <div className="material-page__assignment-assessment-literal-label">
            {props.i18n.text.get(
              "plugin.workspace.materialsLoader.evaluation.verbal.label"
            )}
            :
          </div>
          <RecordingsList records={audioRecords} noDeleteFunctions />
        </>
      ) : null}
    </div>
  );
}
