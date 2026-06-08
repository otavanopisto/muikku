import * as React from "react";
import {
  buildSelectionContext,
  closeNativeReadspeakerPopup,
  resolveBoundaryElement,
  SelectionEligibilityOptions,
} from "./selection-eligibility";
import { TextSelectionPopoverState } from "./types";

export type UseTextSelectionPopoverOptions = SelectionEligibilityOptions & {
  enabled: boolean;
  boundarySelector: string;
};

/**
 * Detects text selection and manages custom popover state.
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
     * handleMouseDown
     * @param event event
     */
    const handleMouseDown = (event: MouseEvent) => {
      const boundary = resolveBoundaryElement(boundarySelector);

      if (!boundary) {
        selectionStartedInBoundaryRef.current = false;
        return;
      }
      if ((event.target as Element)?.closest(".selection-context-popover")) {
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
      if (!selectionStartedInBoundaryRef.current) {
        return;
      }
      selectionStartedInBoundaryRef.current = false;
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
        { x: event.clientX, y: event.clientY },
        boundary,
        { loggedIn, editMode, rspkrLoaded }
      );
      if (!context) {
        close();
        return;
      }
      closeNativeReadspeakerPopup();
      savedRangeRef.current = range.cloneRange();
      selectionElementRef.current =
        selection.anchorNode?.nodeType === Node.TEXT_NODE
          ? selection.anchorNode.parentElement
          : (selection.anchorNode as Element | null);
      setState({ open: true, context });
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

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, enabled, loggedIn, editMode, rspkrLoaded, boundarySelector]);

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
