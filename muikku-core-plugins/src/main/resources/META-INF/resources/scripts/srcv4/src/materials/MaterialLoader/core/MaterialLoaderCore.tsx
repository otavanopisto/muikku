// srcv4/src/materials/MaterialLoader/core/MaterialLoaderCore.tsx
import * as React from "react";
import { useMaterialLoader } from "./hooks/useMaterialLoader";
import {
  defaultConfig,
  type MaterialLoaderConfig,
} from "../configs/MaterialLoaderConfigs";
import type { Material, Workspace, MaterialCompositeReply } from "../types";
import { MaterialLoaderProvider } from "./MaterialLoaderProvider";
import type { StateConfiguration } from "./hooks/useStateManager";

/**
 * MaterialLoaderCoreProps type
 */
export interface MaterialLoaderCoreProps {
  material: Material;
  workspace?: Workspace; // Optional for SimpleMaterialLoader
  compositeReplies?: MaterialCompositeReply;
  userEntityId?: number;

  // Configuration
  config?: MaterialLoaderConfig;

  // Event handlers
  onAssignmentStateModified?: () => void;
  onAnswerChange?: (name: string, value: boolean) => void;

  // Render function - maximum flexibility
  children: React.ReactNode;
}

/**
 * MaterialLoaderRenderProps type
 */
export interface MaterialLoaderRenderProps {
  // Core data
  material: Material;
  workspace?: Workspace;
  compositeReplies?: MaterialCompositeReply;

  // State
  readOnly: boolean;
  answerable: boolean;
  answersVisible: boolean;
  answersChecked: boolean;
  answerRegistry: Record<string, boolean>;
  stateConfiguration: StateConfiguration | null;

  // Processed content
  processedContent: React.ReactNode;

  // Event handlers
  onAnswerChange: (name: string, value: boolean) => void;
  onPushAnswer: () => void;
  onToggleAnswersVisible: () => void;

  // Configuration
  config: MaterialLoaderConfig;
}

/**
 * MaterialLoaderCore
 * @param children children
 * @param config config
 * @param props props
 * @returns MaterialLoaderCore
 */
export function MaterialLoaderCore({
  children,
  config = defaultConfig,
  ...props
}: MaterialLoaderCoreProps) {
  const materialLoaderProps = useMaterialLoader(props, config);

  return (
    <MaterialLoaderProvider value={materialLoaderProps}>
      {children}
    </MaterialLoaderProvider>
  );
}
