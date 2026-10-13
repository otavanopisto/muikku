import type { EnhancedHTMLToReactComponentRule } from "../../core/types";
import type { FieldRegistry, MaterialProcessingContext } from "../types";
import { createFieldElement } from "./createFieldElement";

/**
 * Builds the object/field processing rule bound to a registry.
 */
export function createFieldRule(
  registry: FieldRegistry
): EnhancedHTMLToReactComponentRule {
  return {
    id: "field-rule",
    shouldProcessHTMLElement: (tagname, element) =>
      tagname === "object" && !!registry[element.getAttribute("type") ?? ""],
    processingFunction: (_tag, props, _children, element, context) => {
      if (!context) return null;
      return createFieldElement(
        element,
        context as MaterialProcessingContext,
        registry,
        props.key
      );
    },
  };
}
