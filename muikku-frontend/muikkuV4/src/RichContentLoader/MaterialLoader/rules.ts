import type { EnhancedHTMLToReactComponentRule } from "../core/types";
import { createFieldRule } from "../coreMaterial/utils/createFieldRule";
import { createMaterialContentRules } from "../coreMaterial/utils/createMaterialContentRules";
import { materialsFieldRegistry } from "./registry";

/**
 * Materials rule package — media rules can be composed in later.
 */
export function createMaterialsRules(): EnhancedHTMLToReactComponentRule[] {
  return [
    ...createMaterialContentRules(),
    createFieldRule(materialsFieldRegistry),
  ];
}
