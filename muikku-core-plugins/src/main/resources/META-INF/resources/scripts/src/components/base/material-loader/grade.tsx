import * as React from 'react';
import { MaterialLoaderProps } from '~/components/base/material-loader';

interface MaterialLoaderGradeProps extends MaterialLoaderProps {
}

export function MaterialLoaderGrade(props: MaterialLoaderGradeProps) {
  const grade = (props.material.evaluation && props.material.evaluation.grade) ||
    (props.compositeReplies && props.compositeReplies.evaluationInfo && props.compositeReplies.evaluationInfo.grade);
  
  if (!grade) {
    return null;
  }

  return (<div className="material-page__assignment-assessment-grade">
    {grade}
  </div>);
}