import { atom } from "jotai";
import {
  MuikkuWebsocket,
  type WebSocketCallbacks,
  type WebSocketInitOptions,
  type WebSocketListener,
} from "~/src/utils/websocket";
import { userAtom } from "./auth";

// WebSocket state
export const websocketAtom = atom<MuikkuWebsocket | null>(null);
export const websocketConnectedAtom = atom<boolean>(false);
export const websocketErrorAtom = atom<string | null>(null);

export const websocketDisconnectedAtom = atom<{
  showModal: boolean;
  code: string | null;
}>({
  showModal: false,
  code: null,
});

// Initial WebSocket listeners
const initialWebsocketListeners: WebSocketListener = {
  "Communicator:newmessagereceived": [() => console.log("newmessagereceived")],
  "Communicator:messageread": [() => console.log("messageread")],
  "Communicator:threaddeleted": [() => console.log("threaddeleted")],
  "chat:settings-change": [() => console.log("chat:settings-change")],
};

// Initial WebSocket options
const initialWebSocketOptions: WebSocketInitOptions = {
  reconnectInterval: 5000,
  pingInterval: 30000,
  maxReconnectAttempts: 5,
  eventListeners: initialWebsocketListeners,
};

/**
 * Initialize WebSocket connection atom action
 */
export const initializeWebSocketAtom = atom(
  null,
  async (get, set, callbacks: WebSocketCallbacks = {}) => {
    const user = get(userAtom);

    // If user is not logged in or WebSocket is already initialized, return
    if (!user || !user?.loggedIn || get(websocketAtom)) {
      return;
    }

    try {
      // Create WebSocket instance
      const websocket = MuikkuWebsocket.createInstance(
        initialWebSocketOptions,
        {
          onConnected: () => {
            set(websocketConnectedAtom, true);
            set(websocketErrorAtom, null);
            callbacks.onConnected?.();
          },
          onDisconnected: () => {
            set(websocketConnectedAtom, false);
            callbacks.onDisconnected?.();
          },
          onError: (error) => {
            set(websocketErrorAtom, error.message);
            callbacks.onError?.(error);
          },
          onMessage: (message) => {
            callbacks.onMessage?.(message);
          },
          onSync: () => {
            callbacks.onSync?.();
          },
          onDesync: () => {
            callbacks.onDesync?.();
          },
          openNotificationDialog: (message) => {
            console.log("openNotificationDialog", message);
            set(websocketDisconnectedAtom, {
              showModal: true,
              code: message,
            });
            callbacks.openNotificationDialog?.(message);
          },
        }
      );

      // Connect to WebSocket
      await websocket.connect();

      // Store the instance
      set(websocketAtom, websocket);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "WebSocket initialization failed";
      set(websocketErrorAtom, errorMessage);
      throw error;
    }
  }
);

/**
 * Disconnect WebSocket atom action
 */
export const disconnectWebSocketAtom = atom(null, (get, set) => {
  const websocket = get(websocketAtom);
  if (websocket) {
    websocket.disconnect();
    set(websocketAtom, null);
    set(websocketConnectedAtom, false);
  }
});
