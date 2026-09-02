import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { EmbeddedCommentDataset } from "~/components/base/material-loader/types";

/**
 * Evaluation highlight props
 */
interface EmbedAnnotationCommentProps {
  dataset: EmbeddedCommentDataset;
  children?: React.ReactNode;
}

/**
 * Evaluation highlight
 * @param props - Evaluation highlight props
 * @returns Evaluation highlight
 */
export default function EmbedAnnotationComment(
  props: EmbedAnnotationCommentProps
) {
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
      modifier="embedded-comment"
      content={note}
    >
      {mark}
    </Dropdown>
  );
}
