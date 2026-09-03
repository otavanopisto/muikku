import * as React from "react";
import {
  buildSelectionContext,
  resolveBoundaryElement,
  SelectionEligibilityOptions,
} from "./selection-eligibility";
import { TextSelectionPopoverState } from "./types";

export type UseTextSelectionPopoverOptions = SelectionEligibilityOptions & {
  enabled: boolean;
  boundarySelector: string;
};

const TOUCH_MOUSE_SUPPRESS_MS = 600;
const TOUCH_SELECTION_SETTLE_MS = 30;
/**
 * Detects text selection and manages custom popover state.
 * Supports mouse and touch (mobile long-press / selection handles).
 * @param options options
 */
export function useTextSelectionPopover(
  options: UseTextSelectionPopoverOptions
) {
  const { enabled, loggedIn, editMode, rspkrLoaded, boundarySelector } =
    options;
  const [state, setState] = React.useState<TextSelectionPopoverState>({
    open: false,
    context: null,
  });
  const savedRangeRef = React.useRef<Range | null>(null);
  const selectionElementRef = React.useRef<Element | null>(null);
  const selectionStartedInBoundaryRef = React.useRef(false);
  const suppressMouseUntilRef = React.useRef(0);
  const touchOpenTimeoutRef = React.useRef<number | null>(null);

  /**
   * close
   */
  const close = React.useCallback(() => {
    setState((prev) => {
      if (!prev.open && prev.context === null) {
        return prev;
      }
      return { open: false, context: null };
    });
    savedRangeRef.current = null;
    selectionElementRef.current = null;
  }, []);

  /**
   * restoreSelection
   */
  const restoreSelection = React.useCallback(() => {
    const range = savedRangeRef.current;
    if (!range) {
      return;
    }
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  // Effect to handle text selection and build selection context
  React.useEffect(() => {
    if (!enabled) {
      close();
      return;
    }

    /**
     * Clears a pending touch open timer.
     */
    const clearTouchOpenTimeout = () => {
      if (touchOpenTimeoutRef.current !== null) {
        window.clearTimeout(touchOpenTimeoutRef.current);
        touchOpenTimeoutRef.current = null;
      }
    };

    /**
     * Opens popover from current selection if eligible.
     * @param clientX client X
     * @param clientY client Y
     */
    const tryOpenFromSelection = (clientX: number, clientY: number) => {
      const boundary = resolveBoundaryElement(boundarySelector);
      if (!boundary) {
        close();
        return;
      }
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        close();
        return;
      }
      const range = selection.getRangeAt(0);
      const context = buildSelectionContext(
        selection,
        range,
        { x: clientX, y: clientY },
        boundary,
        { loggedIn, editMode, rspkrLoaded }
      );
      if (!context) {
        close();
        return;
      }
      savedRangeRef.current = range.cloneRange();
      selectionElementRef.current =
        selection.anchorNode?.nodeType === Node.TEXT_NODE
          ? selection.anchorNode.parentElement
          : (selection.anchorNode as Element | null);
      setState({ open: true, context });
    };

    /**
     * Whether event target is inside the custom popover.
     * @param target event target
     */
    const isPopoverTarget = (target: EventTarget | null) =>
      !!(target as Element | null)?.closest?.(".selection-context-popover");

    /**
     * Whether synthetic mouse events should be ignored after touch.
     */
    const shouldSuppressMouse = () =>
      Date.now() < suppressMouseUntilRef.current;

    /**
     * handleMouseDown
     * @param event event
     */
    const handleMouseDown = (event: MouseEvent) => {
      if (shouldSuppressMouse()) {
        return;
      }
      const boundary = resolveBoundaryElement(boundarySelector);
      if (!boundary) {
        selectionStartedInBoundaryRef.current = false;
        return;
      }
      if (isPopoverTarget(event.target)) {
        return;
      }
      selectionStartedInBoundaryRef.current = boundary.contains(
        event.target as Node
      );
      close();
    };

    /**
     * handleMouseUp
     * @param event event
     */
    const handleMouseUp = (event: MouseEvent) => {
      if (shouldSuppressMouse()) {
        return;
      }
      if (!selectionStartedInBoundaryRef.current) {
        return;
      }
      selectionStartedInBoundaryRef.current = false;
      tryOpenFromSelection(event.clientX, event.clientY);
    };

    /**
     * handleTouchStart
     * @param event event
     */
    const handleTouchStart = (event: TouchEvent) => {
      clearTouchOpenTimeout();
      if (isPopoverTarget(event.target)) {
        return;
      }
      // Close on new touch outside popover; opening happens on touchend.
      close();
    };

    /**
     * handleTouchEnd
     * @param event event
     */
    const handleTouchEnd = (event: TouchEvent) => {
      if (isPopoverTarget(event.target)) {
        return;
      }
      const touch = event.changedTouches[0];
      const clientX = touch?.clientX ?? 0;
      const clientY = touch?.clientY ?? 0;
      // Prevent following synthetic mouse events from closing/reopening.
      suppressMouseUntilRef.current = Date.now() + TOUCH_MOUSE_SUPPRESS_MS;
      clearTouchOpenTimeout();
      // Let mobile selection settle after long-press / handle drag.
      touchOpenTimeoutRef.current = window.setTimeout(() => {
        touchOpenTimeoutRef.current = null;
        tryOpenFromSelection(clientX, clientY);
      }, TOUCH_SELECTION_SETTLE_MS);
    };

    /**
     * handleSelectionChange
     */
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        // Do not close while waiting for touch settle / while interacting with popover.
        if (touchOpenTimeoutRef.current !== null) {
          return;
        }
        if (state.open) {
          close();
        }
      }
    };

    /**
     * handleKeyDown
     * @param event event
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTouchOpenTimeout();
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    close,
    enabled,
    loggedIn,
    editMode,
    rspkrLoaded,
    boundarySelector,
    state.open,
  ]);
  const getSavedRange = React.useCallback(() => savedRangeRef.current, []);
  return {
    ...state,
    close,
    restoreSelection,
    getSavedRange,
    selectionElementRef,
    savedRangeRef,
  };
}
