import { useState, useCallback, useMemo } from "react";
import type { Material, MaterialCompositeReply } from "../../types";
import type { MaterialLoaderConfig } from "../../configs/MaterialLoaderConfigs";

/**
 * StateManagerReturn type
 */
interface StateManagerReturn {
  readOnly: boolean;
  answerable: boolean;
  stateConfiguration: StateConfiguration | null;
  handlePushAnswer: () => void;
}

/**
 * useStateManager
 * @param material material
 * @param compositeReplies compositeReplies
 * @param config config
 * @returns StateManagerReturn
 */
export function useStateManager(
  material: Material,
  compositeReplies: MaterialCompositeReply | undefined,
  config: MaterialLoaderConfig
): StateManagerReturn {
  const [assignmentState, _] = useState(
    compositeReplies?.state ?? "UNANSWERED"
  );

  const stateConfiguration = useMemo(
    () => getStateConfiguration(material.assignmentType, assignmentState),
    [material.assignmentType, assignmentState]
  );

  const readOnly = useMemo(() => {
    if (config.readOnly) return true;
    if (compositeReplies?.lock !== "NONE") return true;
    return stateConfiguration?.fieldsReadOnly ?? false;
  }, [config.readOnly, compositeReplies?.lock, stateConfiguration]);

  const answerable = useMemo(() => {
    if (compositeReplies?.lock !== "NONE") return false;
    return config.answerable && material.assignmentType !== "THEORY";
  }, [compositeReplies?.lock, config.answerable, material.assignmentType]);

  const handlePushAnswer = useCallback(() => {
    if (stateConfiguration?.successState) {
      // This will be wired to actual API calls in Phase 3
      // eslint-disable-next-line no-console
      console.log("Push answer to state:", stateConfiguration.successState);
    }
  }, [stateConfiguration]);

  return {
    readOnly,
    answerable: answerable ?? false,
    stateConfiguration,
    handlePushAnswer,
  };
}

// State configuration logic (simplified version of the old STATES array)

/**
 * getStateConfiguration
 * @param assignmentType assignmentType
 * @param state state
 * @returns StateConfiguration | null
 */
function getStateConfiguration(
  assignmentType: string,
  state: string
): StateConfiguration | null {
  // This would contain the logic from the old STATES array
  // For now, return a basic configuration
  return {
    assignmentType,
    state,
    fieldsReadOnly: false,
    successState: "SUBMITTED",
  };
}

/**
 * StateConfiguration type
 */
export interface StateConfiguration {
  assignmentType: string;
  state: string;
  fieldsReadOnly: boolean;
  successState?: string;
}
