import * as React from 'react';
import { MaterialLoaderProps } from '~/components/base/material-loader';

interface MaterialLoaderAssesmentProps extends MaterialLoaderProps {
}

export function MaterialLoaderAssesment(props: MaterialLoaderAssesmentProps) {
  const literalAssesment = (props.material.evaluation && props.material.evaluation.verbalAssessment) ||
    (props.compositeReplies && props.compositeReplies.evaluationInfo && props.compositeReplies.evaluationInfo.text);
  
  if (!literalAssesment) {
    return null;
  }

  return (<div className="material-page__assignment-assessment-literal">
    <div className="rich-text" dangerouslySetInnerHTML={{__html: literalAssesment}}></div>
  </div>);
}