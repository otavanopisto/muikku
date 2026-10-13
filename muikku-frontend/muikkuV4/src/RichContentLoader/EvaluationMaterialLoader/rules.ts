import type { EnhancedHTMLToReactComponentRule } from "../core/types";
import { createFieldRule } from "../coreMaterial/utils/createFieldRule";
import { evaluationMaterialsFieldRegistry } from "./registry";
import { createMaterialContentRules } from "../coreMaterial/utils/createMaterialContentRules";

/**
 * Create evaluation materials rules
 * @returns The evaluation materials rules
 */
export function createEvaluationMaterialsRules(): EnhancedHTMLToReactComponentRule[] {
  return [
    ...createMaterialContentRules(),
    createFieldRule(evaluationMaterialsFieldRegistry),
  ];
}
