/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SyncMessage, DataProvider } from "../types";

/**
 * Hook for managing websocket synchronization of field changes
 * Replaces the SyncManager class with React hooks
 * @param dataProvider data provider
 * @param websocket websocket instance
 * @param onFieldSynced callback when field is synced
 * @param onFieldError callback when field sync fails
 * @returns SyncManager
 */
export function useSyncManager(
  dataProvider: DataProvider,
  websocket: any,
  onFieldSynced: (fieldName: string) => void,
  onFieldError: (fieldName: string, error: string) => void
) {
  // Sync state
  const [pendingChanges, setPendingChanges] = useState(new Map<string, any>());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [syncTimeout, setSyncTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Refs for cleanup
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const websocketRef = useRef(websocket);

  // Computed values - use useMemo
  const hasPendingChanges = useMemo(
    (): boolean => pendingChanges.size > 0,
    [pendingChanges]
  );

  // Computed values - use useMemo
  const pendingChangesCount = useMemo(
    (): number => pendingChanges.size,
    [pendingChanges]
  );

  // Computed values - use useMemo
  const pendingFieldNames = useMemo(
    (): string[] => Array.from(pendingChanges.keys()),
    [pendingChanges]
  );

  /**
   * Sync pending changes
   */
  const syncPendingChanges = useCallback(async () => {
    if (pendingChanges.size === 0 || !isConnected) {
      return;
    }

    try {
      const changes = Array.from(pendingChanges.entries()).map(
        ([fieldName, value]) => ({
          fieldName,
          value,
          materialId: dataProvider.material.materialId,
          workspaceId: dataProvider.workspace.id,
          userId: dataProvider.userId,
        })
      );

      // Send changes via websocket
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        websocketRef.current.send(JSON.stringify(changes));

        // Mark all fields as synced
        changes.forEach((change) => {
          onFieldSynced(change.fieldName);
        });

        // Clear pending changes
        setPendingChanges(new Map());
      }
    } catch (error) {
      // Mark all fields as having errors
      pendingFieldNames.forEach((fieldName) => {
        onFieldError(
          fieldName,
          error instanceof Error ? error.message : "Sync failed"
        );
      });
    }
  }, [
    pendingChanges,
    isConnected,
    dataProvider.material.materialId,
    dataProvider.workspace.id,
    dataProvider.userId,
    pendingFieldNames,
    onFieldSynced,
    onFieldError,
  ]);

  /**
   * Queue field sync
   * @param fieldName field name
   * @param value value
   */
  const queueFieldSync = useCallback(
    (fieldName: string, value: any) => {
      setPendingChanges((prev) => new Map(prev).set(fieldName, value));

      // Clear existing timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // Set new timeout for batch sync
      const timeout = setTimeout(() => {
        syncPendingChanges();
      }, 1000); // 1 second debounce

      syncTimeoutRef.current = timeout;
      //setSyncTimeout(timeout);
    },
    [syncPendingChanges]
  );

  /**
   * Force sync
   */
  const forceSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    syncPendingChanges();
  }, [syncPendingChanges]);

  const clearPendingChanges = useCallback(() => {
    setPendingChanges(new Map());
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
  }, []);

  /**
   * Get pending value
   * @param fieldName field name
   * @returns pending value
   */
  const getPendingValue = useCallback(
    (fieldName: string): any => pendingChanges.get(fieldName),
    [pendingChanges]
  );

  /**
   * Check if field has pending change
   * @param fieldName field name
   * @returns true if field has pending change
   */
  const hasPendingChange = useCallback(
    (fieldName: string): boolean => pendingChanges.has(fieldName),
    [pendingChanges]
  );

  /**
   * Handle websocket open
   */
  const handleWebsocketOpen = useCallback(() => {
    //setIsConnected(true);
  }, []);

  /**
   * Handle websocket close
   */
  const handleWebsocketClose = useCallback(() => {
    //setIsConnected(false);
  }, []);

  /**
   * Handle websocket message
   * @param event message event
   */
  const handleWebsocketMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message: SyncMessage = JSON.parse(event.data);

        if (message.fieldName && pendingChanges.has(message.fieldName)) {
          // Field was synced successfully
          onFieldSynced(message.fieldName);

          // Remove from pending changes
          setPendingChanges((prev) => {
            const newMap = new Map(prev);
            newMap.delete(message.fieldName);
            return newMap;
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to parse websocket message:", error);
      }
    },
    [pendingChanges, onFieldSynced]
  );

  // Setup websocket listeners
  useEffect(() => {
    if (!websocket) return;

    websocketRef.current = websocket;

    websocket.addEventListener("open", handleWebsocketOpen);
    websocket.addEventListener("close", handleWebsocketClose);
    websocket.addEventListener("message", handleWebsocketMessage);

    return () => {
      websocket.removeEventListener("open", handleWebsocketOpen);
      websocket.removeEventListener("close", handleWebsocketClose);
      websocket.removeEventListener("message", handleWebsocketMessage);
    };
  }, [
    websocket,
    handleWebsocketOpen,
    handleWebsocketClose,
    handleWebsocketMessage,
  ]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    },
    []
  );

  return React.useMemo(
    () => ({
      // Computed values (no function calls needed)
      hasPendingChanges,
      pendingChangesCount,
      pendingFieldNames,
      isConnected,

      // Methods (only where needed)
      queueFieldSync,
      syncPendingChanges,
      forceSync,
      clearPendingChanges,
      getPendingValue,
      hasPendingChange,
    }),
    [
      hasPendingChanges,
      pendingChangesCount,
      pendingFieldNames,
      isConnected,
      queueFieldSync,
      syncPendingChanges,
      forceSync,
      clearPendingChanges,
      getPendingValue,
      hasPendingChange,
    ]
  );
}
