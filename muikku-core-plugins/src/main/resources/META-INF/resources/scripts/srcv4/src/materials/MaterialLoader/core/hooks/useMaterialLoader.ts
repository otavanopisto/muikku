import { useStateManager } from "./useStateManager";
import { useAnswerManager } from "./useAnswerManager";
import { useFieldManager } from "./useFieldManager";
import { useContentProcessor } from "./useContentProcessor";
import type { MaterialLoaderConfig } from "../../configs/MaterialLoaderConfigs";
import type { MaterialLoaderCoreProps } from "../MaterialLoaderCore";

/**
 * useMaterialLoader
 * @param props props
 * @param config config
 * @returns useMaterialLoaderReturn
 */
export function useMaterialLoader(
  props: Omit<MaterialLoaderCoreProps, "children">,
  config: MaterialLoaderConfig
) {
  const stateManager = useStateManager(
    props.material,
    props.compositeReplies,
    config
  );
  const answerManager = useAnswerManager(
    props.material,
    props.compositeReplies,
    config
  );
  const fieldManager = useFieldManager(props.workspace, props.material, config);
  const processedContent = useContentProcessor(
    props.material.html,
    config.processingRules
  );

  return {
    // Core data
    material: props.material,
    workspace: props.workspace,
    compositeReplies: props.compositeReplies,

    // State
    ...stateManager,
    ...answerManager,
    ...fieldManager,

    // Processed content
    processedContent,

    // Event handlers
    onAnswerChange: answerManager.handleAnswerChange,
    onPushAnswer: stateManager.handlePushAnswer,
    onToggleAnswersVisible: answerManager.toggleAnswersVisible,

    // Configuration
    config,
  };
}
