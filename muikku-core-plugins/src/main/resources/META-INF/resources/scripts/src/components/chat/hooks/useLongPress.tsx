/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";

/**
 * useLongPressProps
 */
interface UseLongPressProps {
  onLongPress: (e: any) => void;
  onClick?: (e: any) => void;
  obj: { shouldPreventDefault: boolean; delay: number };
}

/**
 * useLongPress
 * @param props props
 */
const useLongPress = (props: UseLongPressProps) => {
  const [longPressTriggered, setLongPressTriggered] = React.useState(false);
  const timeout: any = React.useRef();
  const target: any = React.useRef();

  /**
   * Start
   * @param event event
   */
  const start = React.useCallback(
    (event) => {
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
    (event, shouldTriggerClick = true) => {
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
};

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
