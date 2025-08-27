import { useState, useEffect, useRef } from "react";
import { MaterialContentNodeWithIdAndLogic } from "~/reducers/workspaces";

/**
 * useActiveMaterial
 * @param materials materials
 * @returns activeMaterialId
 */
export const useActiveMaterial = (
  materials: MaterialContentNodeWithIdAndLogic[]
) => {
  const [activeMaterialId, setActiveMaterialId] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActiveIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!materials.length) return;

    /**
     * handleScroll
     */
    const handleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const materialElements = materials
          .map((material) => ({
            id: material.workspaceMaterialId,
            element: document.getElementById(
              `p-${material.workspaceMaterialId}`
            ),
          }))
          .filter((item) => item.element);

        if (materialElements.length === 0) return;

        const viewportHeight = window.innerHeight;

        let newActiveMaterialId: number | null = null;

        // Special handling for first item (when scrolled to top)
        const firstElement = materialElements[0];
        if (firstElement.element) {
          const firstRect = firstElement.element.getBoundingClientRect();

          if (firstRect.top <= 200) {
            console.log("Is scrolled to top", firstElement.id);
            newActiveMaterialId = firstElement.id;
          }
        }

        // Special handling for last item (when scrolled to bottom)
        const lastElement = materialElements[materialElements.length - 1];
        if (lastElement.element && !newActiveMaterialId) {
          const lastRect = lastElement.element.getBoundingClientRect();

          if (lastRect.bottom >= viewportHeight - 200) {
            console.log("Is scrolled to bottom", lastElement.id);
            newActiveMaterialId = lastElement.id;
          }
        }

        // For middle items, find the one most centered in viewport
        if (!newActiveMaterialId) {
          console.log("No top/bottom match, checking middle items...");
          let mostCenteredMaterialId: number | null = null;
          let minDistanceFromCenter = Infinity;

          materialElements.forEach(({ id, element }) => {
            if (element) {
              const rect = element.getBoundingClientRect();

              // Only consider materials that are significantly visible
              const visibleHeight =
                Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
              const visibilityRatio = visibleHeight / rect.height;

              // Must be at least 10% visible to be considered
              if (visibilityRatio >= 0.1) {
                const elementCenter = rect.top + rect.height / 2;
                const viewportCenter = viewportHeight / 2;
                const distanceFromCenter = Math.abs(
                  elementCenter - viewportCenter
                );

                console.log(`Material ${id} center calculation:`, {
                  elementCenter,
                  viewportCenter,
                  distanceFromCenter,
                  currentMinDistance: minDistanceFromCenter,
                });

                if (distanceFromCenter < minDistanceFromCenter) {
                  minDistanceFromCenter = distanceFromCenter;
                  mostCenteredMaterialId = id;
                  console.log(
                    `New most centered: ${id} with distance ${distanceFromCenter}`
                  );
                }
              }
            }
          });

          console.log("mostCenteredMaterialId", mostCenteredMaterialId);
          newActiveMaterialId = mostCenteredMaterialId;
        }

        console.log(
          "Has changed",
          newActiveMaterialId && newActiveMaterialId !== lastActiveIdRef.current
        );

        // Only update if the active material has actually changed
        if (
          newActiveMaterialId &&
          newActiveMaterialId !== lastActiveIdRef.current
        ) {
          console.log("New active material:", newActiveMaterialId);
          setActiveMaterialId(newActiveMaterialId);
          lastActiveIdRef.current = newActiveMaterialId;
        }
      }, 50); // 50ms debounce
    };

    // Set initial active material (first one)
    if (materials.length > 0 && !activeMaterialId) {
      setActiveMaterialId(materials[0].workspaceMaterialId);
      lastActiveIdRef.current = materials[0].workspaceMaterialId;
    }

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [materials, activeMaterialId]);

  return { activeMaterialId };
};
