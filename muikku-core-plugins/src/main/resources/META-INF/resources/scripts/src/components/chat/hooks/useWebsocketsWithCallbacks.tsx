import * as React from "react";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

/**
 * useWebsocketsWithCallBacks
 */
interface WebsocketCallback {
  [key: string]: (data: unknown) => void;
}

/**
 * Custom hook for multiple different websocket events
 * @param callbacks callbacks
 */
export function useWebsocketsWithCallbacks(callbacks: WebsocketCallback) {
  const websocket = useChatWebsocketContext();

  const callbacksRef = React.useRef(callbacks);

  React.useEffect(() => {
    Object.keys(callbacksRef.current).forEach((key) => {
      const callback = callbacksRef.current[key];

      websocket.addEventCallback(key, callback);

      return () => {
        websocket.removeEventCallback(key, callback);
      };
    });
  }, [websocket]);
}
