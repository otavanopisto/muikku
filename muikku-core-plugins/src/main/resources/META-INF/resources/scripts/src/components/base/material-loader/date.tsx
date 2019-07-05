import * as React from 'react';
import { MaterialLoaderProps } from '~/components/base/material-loader';

interface MaterialLoaderDateProps extends MaterialLoaderProps {
}

export function MaterialLoaderDate(props: MaterialLoaderDateProps) {
  const date = (props.material.evaluation && props.material.evaluation.evaluated) ||
    (props.compositeReplies && props.compositeReplies.evaluationInfo && props.compositeReplies.evaluationInfo.date);
  
  if (!date) {
    return null;
  }

  return (<div className="material-page__date">
    {props.i18n.time.format(date)}
   </div>);
}