import { useMemo } from "react";
import type { MaterialContentNode } from "~/generated/client";

/**
 * Maps assignmentType → CSS page type token (exercise, assignment, theory, …).
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
 * Whether the material (or its folder) is hidden.
 * @param material - Material content node
 * @param folder - Folder content node
 * @returns Whether the material (or its folder) is hidden
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
 * Builds material-page className from page type, modifiers, and hidden state.
 * Used by loader containers for the <article> wrapper.
 * @param material - Material content node
 * @param modifiers - Modifiers
 * @param folder - Folder content node
 * @returns Material class name
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
