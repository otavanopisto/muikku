import * as React from "react";
import InterimEvaluationEditor from "./external-content/interim-evaluation-editor";
import { RenderProps, RenderState } from "../types";

/**
 * MaterialLoaderExternalContentProps
 */
interface MaterialLoaderExternalContentProps extends RenderProps, RenderState {}

/**
 * Component is used for special cases where the material is not used most
 * basic way. For example in case of interim evaluation there is external editor
 * that has its own logic and functionality, but is still partly working like normal material.
 * @param props props
 */
export function MaterialLoaderExternalContent(
  props: MaterialLoaderExternalContentProps
) {
  const { material } = props;
  let className = "material-page__content-wrapper";

  const langAttribute =
    props.material.titleLanguage ||
    props.folder?.titleLanguage ||
    props.workspace.language;

  if (material.contentHiddenForUser) {
    className =
      "material-page__content material-page__content--view-restricted";
  }

  const jotain = 0;

  if (
    //props.usedAs === "evaluationTool" &&
    jotain &&
    material.assignmentType === "INTERIM_EVALUATION"
  ) {
    return (
      <div className={`${className} rs_skip_always`} lang={langAttribute}>
        <InterimEvaluationEditor {...props} />
      </div>
    );
  }

  if (material.assignmentType === "INTERIM_EVALUATION") {
    return (
      <div className={`${className} rs_skip_always`} lang={langAttribute}>
        <InterimEvaluationEditor {...props} />
      </div>
    );
  }

  return null;
}
