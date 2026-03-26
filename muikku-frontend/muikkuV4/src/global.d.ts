/* eslint-disable jsdoc/require-jsdoc */
import type { MathfieldElement } from "mathlive";
import type * as React from "react";
type MathFieldProps = React.DetailedHTMLProps<
  React.HTMLAttributes<MathfieldElement>,
  MathfieldElement
>;
type MathSpanProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;
type MathDivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;
declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": MathFieldProps;
      "math-span": MathSpanProps;
      "math-div": MathDivProps;
    }
  }
}
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": MathFieldProps;
      "math-span": MathSpanProps;
      "math-div": MathDivProps;
    }
  }
}
export {};
