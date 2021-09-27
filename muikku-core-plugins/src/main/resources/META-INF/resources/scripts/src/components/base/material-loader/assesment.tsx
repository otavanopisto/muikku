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
      
    <div>
      TODO: audio players here for the audio assessments
    </div>

  </div>);
}
