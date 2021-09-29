import * as React from 'react';
import { MaterialLoaderProps } from '~/components/base/material-loader';

interface MaterialLoaderAssesmentProps extends MaterialLoaderProps {
}

export function MaterialLoaderAssesment(props: MaterialLoaderAssesmentProps) {
  const literalAssesment = (props.material.evaluation && props.material.evaluation.verbalAssessment) ||
    (props.compositeReplies && props.compositeReplies.evaluationInfo && props.compositeReplies.evaluationInfo.text);
  const audioAssessments = props.compositeReplies && props.compositeReplies.evaluationInfo && props.compositeReplies.evaluationInfo.audioAssessments;
  
  if (!literalAssesment && (audioAssessments === undefined || audioAssessments.length < 1)) {
    return null;
  }

  return (<div className="material-page__assignment-assessment-literal">
    <div className="material-page__assignment-assessment-literal-label">{props.i18n.text.get("plugin.workspace.materialsLoader.evaluation.literal.label")}:</div>
    <div className="material-page__assignment-assessment-literal-data rich-text" dangerouslySetInnerHTML={{__html: literalAssesment}}></div>
      
    {audioAssessments !== undefined ?
      <div>
        TODO: make these look nice
        {audioAssessments.map((audioAssessment) => {
          return <audio className="material-page__audiofield-file" controls src={`/rest/workspace/materialevaluationaudioassessment/${audioAssessment.id}`}></audio>
        })}
      </div>
      : null}

  </div>);
}
