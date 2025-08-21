/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyncMessage, DataProvider } from "../types";

/**
 * SyncManager handles websocket synchronization of field changes
 * Simplified version of the complex sync logic from the current Base component
 */
export class SyncManager {
  private dataProvider: DataProvider;
  private pendingChanges = new Map<string, any>();
  private syncTimeout: NodeJS.Timeout | null = null;
  private websocket: any; // Will be set when websocket is available
  private onFieldSynced?: (fieldName: string) => void;
  private onFieldError?: (fieldName: string, error: string) => void;

  // Timing constants (moved from current Base component)
  private static readonly CHANGE_DEBOUNCE_MS = 666;
  private static readonly SYNC_TIMEOUT_MS = 2000;

  /**
   * Constructor
   * @param dataProvider data provider
   * @param websocket websocket
   * @param onFieldSynced on field synced
   * @param onFieldError on field error
   */
  constructor(
    dataProvider: DataProvider,
    websocket: any,
    onFieldSynced?: (fieldName: string) => void,
    onFieldError?: (fieldName: string, error: string) => void
  ) {
    this.dataProvider = dataProvider;
    this.websocket = websocket;
    this.onFieldSynced = onFieldSynced;
    this.onFieldError = onFieldError;

    // Setup websocket listeners
    this.setupWebsocketListeners();
  }

  /**
   * Setup websocket event listeners
   */
  private setupWebsocketListeners(): void {
    if (!this.websocket) return;

    // Listen for field save success
    this.websocket.addEventCallback(
      "workspace:field-answer-saved",
      (data: any) => this.handleFieldSaved(data)
    );

    // Listen for field save errors
    this.websocket.addEventCallback(
      "workspace:field-answer-error",
      (data: any) => this.handleFieldError(data)
    );
  }

  /**
   * Queue field change for synchronization
   * @param fieldName field name
   * @param value field value
   */
  queueFieldSync(fieldName: string, value: any): void {
    this.pendingChanges.set(fieldName, value);
    this.scheduleSync();
  }

  /**
   * Schedule synchronization with debouncing
   */
  private scheduleSync(): void {
    if (this.syncTimeout) return;

    this.syncTimeout = setTimeout(() => {
      this.flushChanges();
    }, SyncManager.CHANGE_DEBOUNCE_MS);
  }

  /**
   * Send all pending changes to server
   */
  private flushChanges(): void {
    if (!this.websocket || this.pendingChanges.size === 0) {
      this.syncTimeout = null;
      return;
    }

    this.pendingChanges.forEach((value, fieldName) => {
      this.sendFieldSync(fieldName, value);
    });

    this.pendingChanges.clear();
    this.syncTimeout = null;
  }

  /**
   * Send individual field sync message
   * @param fieldName field name
   * @param value field value
   */
  private sendFieldSync(fieldName: string, value: any): void {
    if (!this.websocket) return;

    const messageData: SyncMessage = {
      fieldName,
      value,
      materialId: this.dataProvider.material.materialId,
      workspaceId: this.dataProvider.workspace.id,
      userId: this.dataProvider.workspace.id, // This should come from user context
    };

    const stackId = this.generateStackId(fieldName);

    // Send the message
    this.websocket.sendMessage(
      "workspace:field-answer-save",
      JSON.stringify(messageData),
      null,
      stackId
    );

    // Set timeout for sync failure
    setTimeout(() => {
      this.handleSyncTimeout(fieldName, value, stackId);
    }, SyncManager.SYNC_TIMEOUT_MS);
  }

  /**
   * Generate unique stack ID for websocket message
   * @param fieldName field name
   * @returns unique stack ID
   */
  private generateStackId(fieldName: string): string {
    return `${fieldName}-${this.dataProvider.workspace.id}-${this.dataProvider.material.materialId}`;
  }

  /**
   * Handle sync timeout - retry or mark as failed
   * @param fieldName field name
   * @param value field value
   * @param stackId stack ID
   */
  private handleSyncTimeout(
    fieldName: string,
    value: any,
    stackId: string
  ): void {
    if (!this.websocket) return;

    // Check if field is still pending
    if (this.pendingChanges.has(fieldName)) {
      // Retry the sync
      this.websocket.queueMessage(
        "workspace:field-answer-save",
        JSON.stringify({
          fieldName,
          value,
          materialId: this.dataProvider.material.materialId,
          workspaceId: this.dataProvider.workspace.id,
          userId: this.dataProvider.workspace.id,
        }),
        null,
        stackId
      );

      // Notify of sync timeout
      this.onFieldError?.(fieldName, "server does not reply");
    }
  }

  /**
   * Handle successful field save from websocket
   * @param data websocket data
   */
  private handleFieldSaved(data: any): void {
    try {
      const actualData = typeof data === "string" ? JSON.parse(data) : data;

      // Check if this event belongs to our material
      if (
        actualData.materialId === this.dataProvider.material.materialId &&
        actualData.workspaceMaterialId ===
          this.dataProvider.material.workspaceMaterialId &&
        actualData.workspaceEntityId === this.dataProvider.workspace.id
      ) {
        const { fieldName, error } = actualData;

        if (error) {
          // Handle sync error
          this.onFieldError?.(fieldName, error);
        } else {
          // Handle successful sync
          this.onFieldSynced?.(fieldName);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error processing field saved event:", error);
    }
  }

  /**
   * Handle field save error from websocket
   * @param data websocket data
   */
  private handleFieldError(data: any): void {
    try {
      const actualData = typeof data === "string" ? JSON.parse(data) : data;

      // Check if this event belongs to our material
      if (
        actualData.materialId === this.dataProvider.material.materialId &&
        actualData.workspaceMaterialId ===
          this.dataProvider.material.workspaceMaterialId &&
        actualData.workspaceEntityId === this.dataProvider.workspace.id
      ) {
        const { fieldName, error } = actualData;
        this.onFieldError?.(fieldName, error || "Unknown error");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error processing field error event:", error);
    }
  }

  /**
   * Check if there are pending changes
   */
  hasPendingChanges(): boolean {
    return this.pendingChanges.size > 0;
  }

  /**
   * Get number of pending changes
   */
  getPendingChangesCount(): number {
    return this.pendingChanges.size;
  }

  /**
   * Get list of pending field names
   */
  getPendingFieldNames(): string[] {
    return Array.from(this.pendingChanges.keys());
  }

  /**
   * Clear all pending changes
   */
  clearPendingChanges(): void {
    this.pendingChanges.clear();
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
      this.syncTimeout = null;
    }
  }

  /**
   * Force immediate sync of all pending changes
   */
  forceSync(): void {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
      this.syncTimeout = null;
    }
    this.flushChanges();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.clearPendingChanges();
    this.websocket = null;
  }
}

/**
 * Hook for using SyncManager in React components
 * @param dataProvider data provider
 * @param websocket websocket
 * @param onFieldSynced callback when field is synced
 * @param onFieldError callback when field sync fails
 * @returns SyncManager
 */
export function useSyncManager(
  dataProvider: DataProvider,
  websocket: any,
  onFieldSynced?: (fieldName: string) => void,
  onFieldError?: (fieldName: string, error: string) => void
): SyncManager {
  return new SyncManager(dataProvider, websocket, onFieldSynced, onFieldError);
}
