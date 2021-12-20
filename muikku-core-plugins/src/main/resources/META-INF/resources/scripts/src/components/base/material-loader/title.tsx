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

  let hidden = props.material.hidden || props.folder && props.folder.hidden

  if (props.isInFrontPage) {
    return null;
  }

  if (props.invisible) {
    return (<h2 className="material-page__title">
      {props.material.title}
      {hidden && <span>Piiloitettu</span>}
    </h2>);
  }

  const modifiers:Array<string> = typeof props.modifiers === "string" ? [props.modifiers] : props.modifiers;

  const materialPageType = props.material.assignmentType ? (props.material.assignmentType === "EXERCISE" ? "exercise" : "assignment") : "textual";

  return (<h2 className={`material-page__title material-page__title--${materialPageType}`}>
    {props.material.title}
    {hidden && <span>Piiloitettu</span>}
  </h2>);
}
