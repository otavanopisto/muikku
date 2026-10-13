export type {
  Workspace,
  MaterialLoaderConfig,
  MaterialProcessingContext,
  FieldRegistry,
  FieldRegistryEntry,
} from "./types";

export { sharedFieldRegistry } from "./registries/sharedFieldRegistry";
export { createFieldRule } from "./utils/createFieldRule";
export { createFieldElement } from "./utils/createFieldElement";

export { MaterialLoader } from "../MaterialLoader/MaterialLoader";
export { useMaterialsLoader } from "../MaterialLoader/useMaterialsLoader";
export { materialsFieldRegistry } from "../MaterialLoader/registry";

export { EvaluationMaterialLoader } from "../EvaluationMaterialLoader/EvaluationMaterialLoader";
export { useEvaluationMaterialsLoader } from "../EvaluationMaterialLoader/useEvaluationLoader";
export { evaluationMaterialsFieldRegistry } from "../EvaluationMaterialLoader/registry";

export { createMaterialContentRules } from "./utils/createMaterialContentRules";
export {
  getMaterialMediaPath,
  isAbsoluteUrl,
} from "./utils/getMaterialMediaPath";

export {
  createFieldParameters,
  parseFieldContent,
  getInitialValue,
  canCheckTextAnswers,
  canCheckSelectAnswers,
} from "./utils/createFieldParameters";
