import * as React from "react";
import { EmbeddedHighlightDataset } from "~/components/base/material-loader/types";

/**
 * Evaluation highlight props
 */
interface HighlightAnnotationProps {
  dataset: EmbeddedHighlightDataset;
  children?: React.ReactNode;
}

/**
 * Evaluation highlight
 * @param props - Evaluation highlight props
 * @returns Evaluation highlight
 */
export default function HighlightAnnotation(props: HighlightAnnotationProps) {
  return <mark data-type="highlight">{props.children}</mark>;
}
