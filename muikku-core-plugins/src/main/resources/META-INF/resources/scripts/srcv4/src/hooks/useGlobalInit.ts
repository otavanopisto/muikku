import { useSetAtom } from "jotai";
import { initializeWebSocketAtom } from "../atoms/websocket";
import { initializeAuthStatusAtom } from "../atoms/auth";
import { loadLangAtom } from "../atoms/locale";

/**
 * Global initialization hook
 * @returns Global initialization function
 */
export function useGlobalInitialization() {
  const initializeAuthStatus = useSetAtom(initializeAuthStatusAtom);
  const loadLang = useSetAtom(loadLangAtom);
  // const initializeChatSettings = useSetAtom(initializeChatSettingsAtom);
  //   const initializeDiscussionAreaPermissions = useSetAtom(
  //     initializeDiscussionAreaPermissionsAtom
  //   );
  const initializeWebSocket = useSetAtom(initializeWebSocketAtom);
  //const updateUnreadMessages = useSetAtom(updateUnreadMessagesAtom);

  /**
   * Global initialization function
   * @returns Promise
   */
  return async function globalInit() {
    // Initialize the auth status and language parallelly
    await Promise.all([initializeAuthStatus(), loadLang()]);

    // Initialize the rest of the atoms sequentially
    await Promise.all([
      //initializeChatSettings(),
      //initializeDiscussionAreaPermissions(),
      initializeWebSocket(),
      //updateUnreadMessages(),
    ]);
  };
}
