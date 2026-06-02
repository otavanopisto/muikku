import { useEffect } from "react";

// Overloaded function signatures for the useCallbackOnEvent hook
export function useCallbackOnEvent<K extends keyof WindowEventMap>(
  event: K,
  callback: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): void;

// Overloaded function signatures for the useCallbackOnEvent hook
export function useCallbackOnEvent(
  event: string,
  callback: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
): void;

/**
 * Hook to call a callback on a given event.
 * @param event - The event to listen for.
 * @param callback - The callback to call when the event is triggered.
 * @param options - The options to pass to the event listener.
 */
export function useCallbackOnEvent(
  event: string,
  callback: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    const handler = (e: Event) => {
      callback(e);
    };
    window.addEventListener(event, handler, options);
    return () => window.removeEventListener(event, handler, options);
  }, [callback, event, options]);
}
