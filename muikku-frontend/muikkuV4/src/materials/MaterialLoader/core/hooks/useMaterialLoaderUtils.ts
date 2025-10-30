import { useMemo } from "react";
import type { MaterialContentNode } from "~/generated/client";
/**
 * Utility hook for material page type determination
 * Extracted from MaterialLoader's returnMaterialPageType method
 * @param material - The material to determine the page type for
 * @returns The page type of the material
 */
export function useMaterialPageType(material: MaterialContentNode): string {
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
 * @param material - The material to determine the visibility for
 * @param folder - The folder to use for the visibility
 * @returns The visibility of the material
 */
export function useMaterialVisibility(
  material: MaterialContentNode,
  folder?: MaterialContentNode
): boolean {
  return useMemo(
    () => material.hidden ?? folder?.hidden ?? false,
    [material.hidden, folder]
  );
}

/**
 * Utility hook for CSS class generation
 * @param material - The material to generate the class for
 * @param modifiers - The modifiers to apply to the class
 * @param folder - The folder to use for the class
 * @returns The generated class
 */
export function useMaterialClassName(
  material: MaterialContentNode,
  modifiers?: string | string[],
  folder?: MaterialContentNode
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
