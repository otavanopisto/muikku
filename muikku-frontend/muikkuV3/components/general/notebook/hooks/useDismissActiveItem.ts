import * as React from "react";

/**
 * Clear active item when user clicks outside notebook rows / linked highlight.
 * @param activeItemId activeItemId
 * @param onDismiss onDismiss
 */
export function useDismissNotebookActiveItem(
  activeItemId: number | null,
  onDismiss: () => void
): void {
  React.useEffect(() => {
    if (activeItemId == null) {
      return;
    }

    /**
     * Handle pointer down
     * @param event event
     */
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) {
        return;
      }

      // Another note row handles its own activation
      if (target.closest("[data-notebook-item-id]")) {
        return;
      }

      // Optional: keep selection when clicking the linked span
      if (
        target.closest(
          `.material-highlight[data-muikku-highlight-id="${activeItemId}"]`
        )
      ) {
        return;
      }

      onDismiss();
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [activeItemId, onDismiss]);
}
