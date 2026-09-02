import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { EvaluationCommentDataset } from "../../material-loader/types";

/**
 * Evaluation highlight props
 */
interface EvaluationHighlightProps {
  dataset: EvaluationCommentDataset;
  children?: React.ReactNode;
}

/**
 * Evaluation highlight
 * @param props - Evaluation highlight props
 * @returns Evaluation highlight
 */
export default function EvaluationHighlight(props: EvaluationHighlightProps) {
  const note = props.dataset.text;

  const mark = (
    <mark
      role={note ? "button" : undefined}
      tabIndex={note ? 0 : undefined}
      data-type="comment"
      data-comment={note}
    >
      {props.children}
    </mark>
  );

  if (!note) {
    return mark;
  }

  return (
    <Dropdown
      // openByHover
      openByHoverIsClickToo
      modifier="evaluation-highlight"
      content={note}
    >
      {mark}
    </Dropdown>
  );
}
