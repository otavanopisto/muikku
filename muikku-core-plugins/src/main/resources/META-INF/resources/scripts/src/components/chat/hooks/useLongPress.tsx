/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";

/**
 * useLongPressProps
 */
interface UseLongPressProps {
  /**
   * Callback for long press
   * @param e e
   */
  onLongPress: (e: any) => void;
  /**
   * Callback for click
   * @param e e
   */
  onClick?: (e: any) => void;
  /**
   * Options
   */
  obj: { shouldPreventDefault: boolean; delay: number };
  /**
   * If true, the long press will be disabled
   */
  disabled: boolean;
}

/**
 * Custom hook for long press
 * @param props props
 */
function useLongPress(props: UseLongPressProps) {
  const [longPressTriggered, setLongPressTriggered] = React.useState(false);
  const timeout = React.useRef<NodeJS.Timeout>(null);
  const target = React.useRef<any>(null);

  React.useEffect(() => {
    if (props.disabled && timeout.current) {
      clearTimeout(timeout.current);
    }
  }, [props.disabled]);

  /**
   * Start
   * @param event event
   */
  const start = React.useCallback(
    (event: any) => {
      if (props.obj.shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        props.onLongPress(event);
        setLongPressTriggered(true);
      }, props.obj.delay);
    },
    [props]
  );

  /**
   * Clear
   * @param event event
   * @param shouldTriggerClick shouldTriggerClick
   */
  const clear = React.useCallback(
    (event: any, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick &&
        !longPressTriggered &&
        props.onClick &&
        props.onClick(event);
      setLongPressTriggered(false);
      if (props.obj.shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [longPressTriggered, props]
  );

  return {
    onMouseDown: (e: any) => start(e),
    onTouchStart: (e: any) => start(e),
    onMouseUp: (e: any) => clear(e),
    onMouseLeave: (e: any) => clear(e, false),
    onTouchEnd: (e: any) => clear(e),
  };
}

/**
 * Type guard for touch event
 * @param event event
 */
const isTouchEvent = (event: any) => "touches" in event;

/**
 * preventDefault
 * @param event event
 */
const preventDefault = (event: any) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export default useLongPress;
