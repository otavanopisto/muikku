import { initializeWebSocketAtom } from "../atoms/websocket";
import { initializeAuthStatusAtom } from "../atoms/auth";
import { loadLangAtom } from "../atoms/locale";
import { initializeWorkspaceStatusAtom } from "../atoms/workspace";
import { executeAtomAction } from "../jotaiStore";
import {
  globalInitializedAtom,
  workspaceInitializedAtom,
} from "../atoms/shared";

/**
 * Core global initialization logic
 * This is the shared logic that both the hook and loader can use
 * @returns Promise
 */
async function performGlobalInitialization() {
  // Use the custom jotaiStore and executeAtomAction helper
  await Promise.all([
    executeAtomAction(initializeAuthStatusAtom),
    executeAtomAction(loadLangAtom),
  ]);

  // Initialize the rest of the atoms sequentially
  await Promise.all([
    //initializeChatSettings(),
    //initializeDiscussionAreaPermissions(),
    executeAtomAction(initializeWebSocketAtom),
    //updateUnreadMessages(),
  ]);

  executeAtomAction(globalInitializedAtom, true);
}

/**
 * Global initialization function that can be used in loaders
 * This replaces the useGlobalInitialization hook for loader usage
 * @returns Promise
 */
export async function globalInit() {
  return performGlobalInitialization();
}

/**
 * Workspace initialization function that can be used in loaders
 * @param workspaceUrlName - The workspace URL name
 * @returns Promise
 */
export async function workspaceInit(workspaceUrlName: string) {
  await executeAtomAction(initializeWorkspaceStatusAtom, workspaceUrlName);
  executeAtomAction(workspaceInitializedAtom, workspaceUrlName);
}

/**
 * Hook-based global initialization function
 * This can be used by components that need to trigger initialization
 * @param initializeAuthStatus - Auth initialization function from useSetAtom
 * @param loadLang - Language loading function from useSetAtom
 * @param initializeWebSocket - WebSocket initialization function from useSetAtom
 * @returns Promise
 */
export async function globalInitWithHooks(
  initializeAuthStatus: () => Promise<void>,
  loadLang: () => Promise<void>,
  initializeWebSocket: () => Promise<void>
) {
  // Initialize the auth status and language parallelly
  await Promise.all([initializeAuthStatus(), loadLang()]);

  // Initialize the rest of the atoms sequentially
  await Promise.all([
    //initializeChatSettings(),
    //initializeDiscussionAreaPermissions(),
    initializeWebSocket(),
    //updateUnreadMessages(),
  ]);
}
