// srcv4/src/materials/MaterialLoaderV2/core/hooks/useMaterialLoaderUtils.ts

import { useMemo } from "react";
import type { Material } from "../types";

/**
 * Utility hook for material page type determination
 * Extracted from MaterialLoader's returnMaterialPageType method
 */
export function useMaterialPageType(material: Material): string {
  return useMemo(() => {
    switch (material.assignmentType) {
      case "EXERCISE":
        return "exercise";
      case "EVALUATED":
        return "assignment";
      case "JOURNAL":
        return "journal";
      case "INTERIM_EVALUATION":
        return "interim-evaluation";
      default:
        return "theory";
    }
  }, [material.assignmentType]);
}

/**
 * Utility hook for determining if material is hidden
 */
export function useMaterialVisibility(
  material: Material,
  folder?: Material
): boolean {
  return useMemo(
    () => material.hidden ?? folder?.hidden ?? false,
    [material.hidden, folder]
  );
}

/**
 * Utility hook for CSS class generation
 */
export function useMaterialClassName(
  material: Material,
  modifiers?: string | string[],
  folder?: Material
): string {
  const pageType = useMaterialPageType(material);
  const isHidden = useMaterialVisibility(material, folder);

  return useMemo(() => {
    const modifierArray =
      typeof modifiers === "string" ? [modifiers] : modifiers ?? [];
    const modifierClasses = modifierArray
      .map((s) => `material-page--${s}`)
      .join(" ");

    return `material-page material-page--${pageType} ${modifierClasses} ${
      isHidden ? "state-HIDDEN" : ""
    }`;
  }, [modifiers, pageType, isHidden]);
}
