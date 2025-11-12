/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useEffect } from "react";
import type { Workspace } from "../types";
import { MuikkuWebsocket } from "src/utils/websocket";
import type { MaterialContentNode } from "~/generated/client";

// Constants for timing
//const TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT = 666;
const TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_FAILED_IF_SERVER_DOES_NOT_REPLY = 2000;
const TIME_IT_WAITS_TO_TRIGGER_A_CHANGE_EVENT_IF_NO_OTHER_CHANGE_EVENT_IS_IN_QUEUE = 666;

/**
 * Hook for managing field synchronization and websocket communication
 * Extracted from Base component's field management logic
 * @param material - The material to manage
 * @param workspace - The workspace to manage
 */
export function useFieldManager(
  material: MaterialContentNode,
  workspace: Workspace
) {
  // Timeout registries for field synchronization
  const timeoutChangeRegistry = useRef<Record<string, NodeJS.Timeout>>({});
  const timeoutConnectionFailedRegistry = useRef<
    Record<string, NodeJS.Timeout>
  >({});

  // Context registry for field components
  const nameContextRegistry = useRef<Record<string, React.Component<any, any>>>(
    {}
  );

  const websocketInstance = MuikkuWebsocket.getInstance();

  /**
   * Handle field value change
   * @param context - The context to use for the field
   * @param name - The name of the field
   * @param newValue - The new value of the field
   * @param onModification - The callback to call when the field is modified
   */
  const handleValueChange = useCallback(
    (
      context: React.Component<any, any>,
      name: string,
      newValue: any,
      onModification?: () => void
    ) => {
      if (!websocketInstance) {
        return;
      }

      // Mark as modified
      if (!context.state.modified) {
        context.setState({ modified: true });
      }

      context.setState({ synced: false });

      // Call modification callback
      onModification?.();

      // Register context for future use
      nameContextRegistry.current[name] = context;

      // Clear previous timeout
      clearTimeout(timeoutChangeRegistry.current[name]);

      // Set new timeout for saving
      timeoutChangeRegistry.current[name] = setTimeout(() => {
        // Send message to server
        const messageData = JSON.stringify({
          answer: newValue,
          embedId: "",
          materialId: material.materialId,
          fieldName: name,
          workspaceEntityId: workspace.id,
          workspaceMaterialId: material.workspaceMaterialId,
          userEntityId: "", // This should come from status
        });

        const stackId = `${name}-${workspace.id}-${material.workspaceMaterialId}-${material.materialId}`;

        void websocketInstance.sendWithStackId(
          "workspace:field-answer-save",
          messageData,
          stackId
        );

        // Set timeout for connection failure
        timeoutConnectionFailedRegistry.current[name] = setTimeout(() => {
          websocketInstance.queueMessage(
            "workspace:field-answer-save",
            messageData,
            stackId
          );
          context.setState({ syncError: "server does not reply" });
        }, TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_FAILED_IF_SERVER_DOES_NOT_REPLY);
      }, TIME_IT_WAITS_TO_TRIGGER_A_CHANGE_EVENT_IF_NO_OTHER_CHANGE_EVENT_IS_IN_QUEUE);
    },
    [material, websocketInstance, workspace.id]
  );

  // Setup websocket listeners
  useEffect(() => {
    /**
     * Handle answer saved at server
     * @param data - The data from the server
     */
    const onAnswerSavedAtServer = (data: unknown) => {
      // For some reason the data comes as string
      const actualData: any = JSON.parse(data as string);

      // Check if this event is for our material
      if (
        actualData.materialId === material.materialId &&
        actualData.workspaceMaterialId === material.workspaceMaterialId &&
        actualData.workspaceEntityId === workspace.id
      ) {
        // Clear timeout that would mark the field as unsynced
        clearTimeout(
          timeoutConnectionFailedRegistry.current[actualData.fieldName]
        );
        delete timeoutConnectionFailedRegistry.current[actualData.fieldName];

        // Handle error case
        if (actualData.error) {
          //console.error(actualData.error);
          if (nameContextRegistry.current[actualData.fieldName]) {
            nameContextRegistry.current[actualData.fieldName].setState({
              synced: false,
              syncError: actualData.error,
            });
          }
          return;
        }

        // Handle success case
        if (nameContextRegistry.current[actualData.fieldName]) {
          if (
            !nameContextRegistry.current[actualData.fieldName].state.synced ||
            nameContextRegistry.current[actualData.fieldName].state.syncError
          ) {
            nameContextRegistry.current[actualData.fieldName].setState({
              synced: true,
              syncError: null,
            });
          }
        }
      }
    };

    if (websocketInstance) {
      websocketInstance.addCallback(
        "workspace:field-answer-saved",
        onAnswerSavedAtServer
      );
      websocketInstance.addCallback(
        "workspace:field-answer-error",
        onAnswerSavedAtServer
      );
    }

    // Cleanup
    return () => {
      if (websocketInstance) {
        websocketInstance.removeCallback(
          "workspace:field-answer-saved",
          onAnswerSavedAtServer
        );
        websocketInstance.removeCallback(
          "workspace:field-answer-error",
          onAnswerSavedAtServer
        );
      }
    };
  }, [material, websocketInstance, workspace.id]);

  // Cleanup timeouts on unmount
  useEffect(
    () => () => {
      Object.values(timeoutChangeRegistry.current).forEach(clearTimeout);
      Object.values(timeoutConnectionFailedRegistry.current).forEach(
        clearTimeout
      );
    },
    []
  );

  return {
    handleValueChange,
    nameContextRegistry: nameContextRegistry.current,
  };
}
