// Hook to handle loading roooms and people list from rest api.
import * as React from "react";
import { useChatContext } from "../context/chat-context";

export type UseChatWindow = ReturnType<typeof useChatWindow>;

/**
 * Custom hook to handle chat window
 */
function useChatWindow() {
  const { isMobileWidth, minimized } = useChatContext();

  const [detached, setDetached] = React.useState<boolean>(false);
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);

  // Ref to store and track window position
  const windowPositonRef = React.useRef<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>(null);

  /**
   * Reset all states and ref position values
   */
  const reset = () => {
    setDetached(false);
    setFullScreen(false);
    windowPositonRef.current = null;
  };

  React.useEffect(() => {
    // Reset chat window states and ref values when minimized from fullscreen view
    // or mobile view is active
    if ((minimized && fullScreen) || isMobileWidth) {
      reset();
    }
  }, [fullScreen, isMobileWidth, minimized]);

  /**
   * Toggle fullscreen view
   */
  const toggleFullscreen = React.useCallback(() => {
    setFullScreen((prev) => !prev);
  }, []);

  /**
   * Toggle detached view
   */
  const toggleDetached = React.useCallback(() => {
    setDetached((prev) => !prev);
  }, []);

  return {
    toggleFullscreen,
    toggleDetached,
    detached,
    fullScreen,
    windowPositonRef,
  };
}

export default useChatWindow;
