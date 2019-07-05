import * as React from 'react';
import { MaterialLoaderProps } from '~/components/base/material-loader';

interface MaterialLoaderAssesmentProps extends MaterialLoaderProps {
}

export function MaterialLoaderAssesment(props: MaterialLoaderAssesmentProps) {
  const verbalAssesment = (props.material.evaluation && props.material.evaluation.verbalAssessment) ||
    (props.compositeReplies && props.compositeReplies.evaluationInfo && props.compositeReplies.evaluationInfo.text);
  
  if (!verbalAssesment) {
    return null;
  }

  return (<div className="material-page__verbal-assessment">
    <div className="rich-text" dangerouslySetInnerHTML={{__html: verbalAssesment}}></div>
  </div>);
}