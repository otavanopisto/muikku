export { MaterialLoaderCore } from "./core/MaterialLoaderCore";
export {
  MaterialLoaderProvider,
  useMaterialLoaderContext,
} from "./core/MaterialLoaderProvider";
export { HTMLProcessor } from "./core/processors/HTMLProcessor";
export { defaultProcessingRules } from "./core/processors/ProcessingRules";
export { useContentProcessor } from "./core/hooks/useContentProcessor";

// Field management
export {
  FieldFactory,
  InMemoryFieldRegistry,
} from "./core/processors/FieldProcessor";
export {
  MaterialFieldsProvider,
  useMaterialFields,
  useRegisterField,
  useCreateField,
} from "./components/MaterialFields";

// Components
export { MaterialLoaderContent } from "./components/MaterialLoaderContent";
export { MaterialLoaderTitle } from "./components/MaterialLoaderTitle";

// Variants
export { SimpleMaterialLoader } from "./variants/SimpleMaterialLoader";

// Types
export type {
  ProcessingRule,
  ProcessingContext,
  FieldManagerLike,
} from "./core/processors/HTMLProcessor";
export type {
  FieldProps,
  FieldComponent,
  FieldRegistry,
} from "./core/processors/FieldProcessor";
export type {
  MaterialLoaderConfig,
  LayoutConfig,
} from "./configs/MaterialLoaderConfigs";
export type { Material, Workspace, MaterialCompositeReply } from "./types";
