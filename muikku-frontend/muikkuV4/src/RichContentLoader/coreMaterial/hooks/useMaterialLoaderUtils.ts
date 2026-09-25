import { useMemo } from "react";
import type { MaterialContentNode } from "~/generated/client";

/**
 * Use the material page type
 * @param material - The material
 * @returns The material page type
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
 * Use the material visibility
 * @param material - The material
 * @param folder - The folder
 * @returns The material visibility
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
 * Use the material class name
 * @param material - The material
 * @param modifiers - The modifiers
 * @param folder - The folder
 * @returns The material class name
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
      typeof modifiers === "string" ? [modifiers] : (modifiers ?? []);
    const modifierClasses = modifierArray
      .map((s) => `material-page--${s}`)
      .join(" ");

    return `material-page material-page--${pageType} ${modifierClasses} ${
      isHidden ? "state-HIDDEN" : ""
    }`;
  }, [modifiers, pageType, isHidden]);
}
