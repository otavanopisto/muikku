// Types imports
import type {
  Workspace,
  MaterialLoaderConfig,
  AssignmentStateConfig,
  ProcessingRuleContext,
  EnhancedHTMLToReactComponentRule,
} from "./core/types";

// State imports
import { AssignmentStateManager } from "./core/state/AssignmentStateManager";

// Hooks imports
import { useAssignmentState } from "./core/hooks/useAssignmentState";
import { useContentProcessor } from "./core/hooks/useContentProcessor";
import { useAnswerManager } from "./core/hooks/useAnswerManager";
import { useFieldManager } from "./core/hooks/useFieldManager";
import { useMaterialLoader } from "./core/hooks/useMaterialLoader";
import {
  useMaterialPageType,
  useMaterialVisibility,
  useMaterialClassName,
} from "./core/hooks/useMaterialLoaderUtils";

// Processors imports
import { HTMLtoReactComponent } from "./core/processors/HTMLProcessor";
import { HTMLPreprocessor } from "./core/processors/HTMLPreprocessor";
import { FieldProcessor } from "./core/processors/FieldProcessor";
import { createProcessingRules } from "./core/processors/ProcessingRules";

// components imports
import { MaterialLoaderContent } from "./components/MaterialLoaderContent";
import { MaterialLoaderTitle } from "./components/MaterialLoaderTitle";
import { MaterialLoaderButtons } from "./components/MaterialLoaderButtons";
import { MaterialLoaderAssessment } from "./components/MaterialLoaderAssessment";

// Fields imports
import { TextField } from "./components/fields/TextField";
import { SelectField } from "./components/fields/SelectField";
import { MultiSelectField } from "./components/fields/MultiSelectField";
import { MemoField } from "./components/fields/MemoField";
import { ConnectField } from "./components/fields/ConnectField";
import { OrganizerField } from "./components/fields/OrganizerField";
import { JournalField } from "./components/fields/JournalField";
import { SorterField } from "./components/fields/SorterField";

// Configs imports
import { defaultConfig, simpleConfig } from "./configs/MaterialLoaderConfigs";

// Variants imports
import { SimpleMaterialLoader } from "./variants/SimpleLoader";

// Re-export types for convenience
export {
  // Types exports
  type Workspace,
  type MaterialLoaderConfig,
  type AssignmentStateConfig,
  type ProcessingRuleContext,
  type EnhancedHTMLToReactComponentRule,

  // State exports
  AssignmentStateManager,

  // Hooks exports
  useAssignmentState,
  useContentProcessor,
  useAnswerManager,
  useFieldManager,
  useMaterialLoader,
  useMaterialPageType,
  useMaterialVisibility,
  useMaterialClassName,

  // Processors exports
  HTMLtoReactComponent,
  HTMLPreprocessor,
  FieldProcessor,
  createProcessingRules,

  // Components exports
  MaterialLoaderContent,
  MaterialLoaderTitle,
  MaterialLoaderButtons,
  MaterialLoaderAssessment,

  // Fields exports
  TextField,
  SelectField,
  MultiSelectField,
  MemoField,
  ConnectField,
  OrganizerField,
  JournalField,
  SorterField,

  // Configs exports
  defaultConfig,
  simpleConfig,

  // Variants exports
  SimpleMaterialLoader,
};
