import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateCurrentExamsActiveNodeId } from "~/actions/workspaces/exams";
import { MaterialContentNodeWithIdAndLogic } from "~/reducers/workspaces";
import { useScrollContext } from "../context/scroll-context";

/**
 * useActiveMaterial
 * @param materials materials
 */
export const useActiveMaterial = (
  materials: MaterialContentNodeWithIdAndLogic[]
) => {
  const atBottomRef = useRef<boolean>(false);
  const lastActiveIdRef = useRef<number | null>(null);
  const { scrollContainerRef, scrollContainerHeaderRef } = useScrollContext();

  const dispatch = useDispatch();

  /**
   * Updates the URL hash to reflect the current active material
   * @param materialId The material ID to set in the hash
   */
  const updateUrlHash = (materialId: number) => {
    const newHash = `#p-${materialId}`;

    // Use history.replaceState to avoid adding to browser history
    if (history.replaceState) {
      history.replaceState(null, "", newHash);
    } else {
      // Fallback for older browsers
      window.location.hash = newHash;
    }
  };

  useEffect(() => {
    if (!materials.length || !scrollContainerRef || !scrollContainerHeaderRef)
      return;

    /**
     * handleScroll
     */
    const handleScroll = () => {
      // Check if scroll has reached bottom
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef;
      const threshold = 5; // Small threshold for precision

      atBottomRef.current =
        scrollTop + clientHeight >= scrollHeight - threshold;

      const materialElements = materials.map((material) => ({
        id: material.workspaceMaterialId,
        element: document.getElementById(`p-${material.workspaceMaterialId}`),
      }));

      if (materialElements.length === 0) return;

      const viewportHeight = scrollContainerRef
        ? scrollContainerRef.clientHeight
        : window.innerHeight;

      let newActiveMaterialId: number | null = null;

      // Get the scroll container bounds for relative positioning
      const containerRect = scrollContainerRef
        ? scrollContainerRef.getBoundingClientRect()
        : { top: 0, bottom: viewportHeight };

      // Special handling for last item (when scrolled to bottom)
      const lastElement = materialElements[materialElements.length - 1];
      if (lastElement.element && atBottomRef.current) {
        newActiveMaterialId = lastElement.id;
      }

      // For all other cases (including top), find the one most centered in viewport
      if (!newActiveMaterialId) {
        let mostCenteredMaterialId: number | null = null;
        let minDistanceFromCenter = Infinity;

        materialElements.forEach(({ id, element }) => {
          if (element) {
            const rect = element.getBoundingClientRect();
            const relativeTop = rect.top - containerRect.top;
            const relativeBottom = rect.bottom - containerRect.top;

            // Account for dialog header height in visibility calculations
            // Similar to how materials component accounts for sticky navigation
            const adjustedTop =
              relativeTop + scrollContainerHeaderRef.clientHeight;
            const adjustedBottom =
              relativeBottom + scrollContainerHeaderRef.clientHeight;

            // Only consider materials that are significantly visible within the container
            const visibleTop = Math.max(
              adjustedTop,
              scrollContainerHeaderRef.clientHeight
            );
            const visibleBottom = Math.min(adjustedBottom, viewportHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibilityRatio = visibleHeight / rect.height;

            // Must be at least 10% visible to be considered
            if (visibilityRatio >= 0.1) {
              const elementCenter = adjustedTop + rect.height / 2;
              const viewportCenter = viewportHeight / 2;
              const distanceFromCenter = Math.abs(
                elementCenter - viewportCenter
              );

              if (distanceFromCenter < minDistanceFromCenter) {
                minDistanceFromCenter = distanceFromCenter;
                mostCenteredMaterialId = id;
              }
            }
          }
        });

        newActiveMaterialId = mostCenteredMaterialId;
      }

      // Only update if the active material has actually changed
      if (
        newActiveMaterialId &&
        newActiveMaterialId !== lastActiveIdRef.current
      ) {
        dispatch(updateCurrentExamsActiveNodeId(newActiveMaterialId));
        updateUrlHash(newActiveMaterialId);
        lastActiveIdRef.current = newActiveMaterialId;
      }
    };

    // Set initial active material (first one)
    if (materials.length > 0 && !lastActiveIdRef.current) {
      dispatch(
        updateCurrentExamsActiveNodeId(materials[0].workspaceMaterialId)
      );
      updateUrlHash(materials[0].workspaceMaterialId);
      lastActiveIdRef.current = materials[0].workspaceMaterialId;
    }

    // Listen to scroll events on the dialog content container
    scrollContainerRef.addEventListener("scroll", handleScroll, true);

    return () => {
      scrollContainerRef.removeEventListener("scroll", handleScroll, true);
    };
  }, [materials, scrollContainerRef, dispatch, scrollContainerHeaderRef]);
};
