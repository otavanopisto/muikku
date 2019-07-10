import * as React from 'react';
import { MaterialContentNodeType, WorkspaceType } from '~/reducers/workspaces';
import { MaterialLoaderProps } from '~/components/base/material-loader';
import Dropdown from '~/components/general/dropdown';
import { ButtonPill } from '~/components/general/button';

interface MaterialLoaderTitleProps extends MaterialLoaderProps {
}

function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}

export function MaterialLoaderTitle(props: MaterialLoaderTitleProps) {
  if (props.isInFrontPage) {
    return null;
  }
  
  if (props.invisible) {
    return (<h2 className="material-page__title">
      {props.material.title}
    </h2>);
  }
  
  const modifiers:Array<string> = typeof props.modifiers === "string" ? [props.modifiers] : props.modifiers;
  
  const materialPageType = props.material.assignmentType ? (props.material.assignmentType === "EXERCISE" ? "exercise" : "assignment") : "textual";
  let iconForTitle = null;
  if (props.compositeReplies && props.compositeReplies.state) {
    if (props.compositeReplies.state === "FAILED" || props.compositeReplies.state === "INCOMPLETE") {
      iconForTitle = "thumb-down-alt";
    } else if (props.compositeReplies.state === "PASSED") {
      iconForTitle = "thumb-up-alt";
    } else if (props.compositeReplies.state === "UNANSWERED") {
      iconForTitle = null;
    } else {
      iconForTitle = "checkmark";
    }
  }

  return (<h2 className={`material-page__title material-page__title--${materialPageType}`}>
    {props.material.title}
    {iconForTitle ? <span className={`material-page__title-icon icon-${iconForTitle}`}/> : null}
  </h2>);
}