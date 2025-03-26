import * as React from "react";
import MathJAX from "./mathjax";

/**
 * StrMathJAX
 * @param props props
 * @param props.children children
 * @param props.invisible invisible
 * @param props.html html
 */
export function StrMathJAX(props: {
  children: string;
  invisible?: boolean;
  html?: boolean;
}) {
  if (!props.children || typeof props.children !== "string") {
    return null;
  }
  const trimmed = props.children.trim();
  if (trimmed.indexOf("`") === 0 || trimmed.indexOf("\\(") === 0) {
    return <MathJAX invisible={props.invisible}>{props.children}</MathJAX>;
  }
  if (props.html) {
    return <span dangerouslySetInnerHTML={{ __html: trimmed }} />;
  }

  return <>{trimmed}</>;
}
