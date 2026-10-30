/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useMemo, useRef } from "react";
import $ from "jquery";
import { HTMLtoReactComponent } from "../processors/HTMLProcessor";
import { HTMLPreprocessor } from "../processors/HTMLPreprocessor";
import type {
  EnhancedHTMLToReactComponentRule,
  RichContentProcessingContext,
} from "../types";

/**
 * Converts material/simple HTML into React nodes.
 *
 * Owns:
 * - HTML preprocessing — only when `html` changes
 * - React conversion — only when preprocessed HTML or rules change
 *
 * Context is read from a ref so compositeReplies patches do not rebuild fields.
 * Live check/show/readOnly still flow through FieldWithLiveProps.
 */
export function useContentProcessor(
  html: string | null,
  processingRules: EnhancedHTMLToReactComponentRule[],
  context?: RichContentProcessingContext
): React.ReactNode[] {
  const contextRef = useRef(context);
  contextRef.current = context;

  const preprocessedElements = useMemo(() => {
    if (!html) return [] as HTMLElement[];
    const $html = $(html);
    return HTMLPreprocessor.preprocess($html).toArray();
  }, [html]);

  return useMemo(
    () =>
      preprocessedElements.map((element, index) =>
        HTMLtoReactComponent(
          element,
          processingRules,
          index,
          contextRef.current
        )
      ),
    [preprocessedElements, processingRules]
  );
}
