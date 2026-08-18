import * as React from "react";
import Dropdown from "~/components/general/dropdown";

/**
 * Evaluation highlight props
 */
interface EvaluationHighlightProps {
  dataset: {
    muikkuEvaluationHighlight?: string;
    muikkuEvaluationHighlightColor?: string;
  };
  children?: React.ReactNode;
}

/**
 * Evaluation highlight
 * @param props - Evaluation highlight props
 * @returns Evaluation highlight
 */
export default function EvaluationHighlight(props: EvaluationHighlightProps) {
  const note = props.dataset.muikkuEvaluationHighlight;
  const color = props.dataset.muikkuEvaluationHighlightColor;

  const mark = (
    <mark
      role={note ? "button" : undefined}
      tabIndex={note ? 0 : undefined}
      data-muikku-evaluation-highlight={note}
      data-muikku-evaluation-highlight-color={color}
    >
      {props.children}
    </mark>
  );

  if (!note) {
    return mark;
  }

  return (
    <Dropdown
      openByHover
      openByHoverIsClickToo
      modifier="evaluation-highlight"
      content={note}
    >
      {mark}
    </Dropdown>
  );
}
