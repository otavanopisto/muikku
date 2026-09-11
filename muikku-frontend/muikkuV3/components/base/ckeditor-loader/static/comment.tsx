import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { EmbeddedCommentDataset } from "~/components/base/material-loader/types";

/**
 * Comment annotation props
 */
interface CommentAnnotationProps {
  dataset: EmbeddedCommentDataset;
  children?: React.ReactNode;
}

/**
 * Comment annotation
 * @param props - Evaluation highlight props
 * @returns Evaluation highlight
 */
export default function CommentAnnotation(props: CommentAnnotationProps) {
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
      openByHover
      openByHoverIsClickToo
      modifier="comment"
      content={note}
    >
      {mark}
    </Dropdown>
  );
}
