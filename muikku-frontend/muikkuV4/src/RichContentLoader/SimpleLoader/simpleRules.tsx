import type {
  EnhancedHTMLToReactComponentRule,
  ImageDataset,
  LinkDataset,
  MathEngine,
} from "../core/types";
import MathRenderer from "../core/components/static/Math";
import Image from "../core/components/static/Image";
import Link from "../core/components/static/Link";
import { extractDataSet } from "../core";

/**
 * Build simple rich-content rules.
 * Nested Image/Link processing uses this same rule set (not materials rules).
 */
export function createSimpleRules(
  mathEngine: MathEngine = "mathjax"
): EnhancedHTMLToReactComponentRule[] {
  const rules: EnhancedHTMLToReactComponentRule[] = [];

  rules.push(
    {
      id: "math-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        tagname === "span" &&
        (element.classList.contains("math-tex") ||
          element.getAttribute("data-type") === "math-equation"),
      processingFunction: (_tag, props, children) => (
        <MathRenderer key={props.key} engine={mathEngine} invisible={false}>
          {children}
        </MathRenderer>
      ),
    },
    {
      id: "image-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        (tagname === "figure" || tagname === "span") &&
        element.classList.contains("image"),
      preventChildProcessing: true,
      processingFunction: (_tag, props, _children, element) => {
        const dataset = extractDataSet<ImageDataset>(element);
        return (
          <Image
            key={props.key}
            element={element}
            dataset={dataset}
            invisible={false}
            path=""
            processingRules={rules}
          />
        );
      },
    },
    {
      id: "link-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        !!(tagname === "a" && (element as HTMLAnchorElement).href),
      preventChildProcessing: true,
      processingFunction: (_tag, props, _children, element) => {
        const dataset = extractDataSet<LinkDataset>(element);
        return (
          <Link
            key={props.key}
            element={element}
            dataset={dataset}
            invisible={false}
            path=""
            processingRules={rules}
          />
        );
      },
    }
  );

  return rules;
}
