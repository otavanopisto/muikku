import type { Editor } from "@tiptap/react";
import type { Node } from "@tiptap/pm/model";
import { findParentNodeClosestToPos } from "@tiptap/react";

/**
 * StyleDefinition is the definition of a style
 */
export interface StyleDefinition {
  name: string;
  element: string;
  attributes: Record<string, unknown>;
}

export const stylesSet: StyleDefinition[] = [
  {
    name: "Yleistyyli",
    element: "div",
    attributes: {
      class: "material-basicbox material-styles-block",
    },
  },
  {
    name: "Oppimispäiväkirja",
    element: "div",
    attributes: {
      class: "material-journalbox material-styles-block",
    },
  },
  {
    name: "Pohdi",
    element: "div",
    attributes: {
      class: "material-ponderbox material-styles-block",
    },
  },
  {
    name: "Tavoitteet",
    element: "div",
    attributes: {
      class: "material-objectivebox material-styles-block",
    },
  },
  {
    name: "Huomio",
    element: "div",
    attributes: {
      class: "material-infobox material-styles-block",
    },
  },
  {
    name: "Ohjeet",
    element: "div",
    attributes: {
      class: "material-instructionbox material-styles-block",
    },
  },
  {
    name: "Arviointiperusteet",
    element: "div",
    attributes: {
      class: "material-assignmentbox material-styles-block",
    },
  },
  {
    name: "Linkki",
    element: "div",
    attributes: {
      class: "material-linkbox material-styles-block",
    },
  },
  {
    name: "Ääni",
    element: "div",
    attributes: {
      class: "material-audiobox material-styles-block",
    },
  },
  {
    name: "Tiedosto",
    element: "div",
    attributes: {
      class: "material-filebox material-styles-block",
    },
  },
  {
    name: "Taulukko",
    element: "div",
    attributes: {
      class: "material-tablebox material-styles-block",
    },
  },
  {
    name: "Taulukko (pienennetty fontti)",
    element: "div",
    attributes: {
      class: "material-tablebox-small material-styles-block",
    },
  },
  {
    name: "Sisäinen Muikku-linkki",
    element: "div",
    attributes: {
      class: "material-muikkulinkbox material-styles-block",
    },
  },
  {
    name: "Korostettu teksti",
    element: "div",
    attributes: {
      class: "material-text-highlight material-styles-text",
    },
  },
  {
    name: "Sitaatti",
    element: "div",
    attributes: {
      class: "material-citation-basic material-styles-text",
    },
  },
  {
    name: "Pitkä sitaatti",
    element: "div",
    attributes: {
      class: "material-citation-long material-styles-text",
    },
  },
  {
    name: "Esimerkki",
    element: "div",
    attributes: {
      class: "material-example material-styles-text",
    },
  },
  {
    name: "Harjoitustehtävä",
    element: "div",
    attributes: {
      class: "material-exercise material-styles-text",
    },
  },
  {
    name: "Harjoitustehtävän palaute",
    element: "div",
    attributes: {
      class: "material-exercise-feedback material-styles-block",
      "data-show": "true",
    },
  },
  {
    name: "Harjoitustehtävät oikein",
    element: "div",
    attributes: {
      class:
        "material-exercise-feedback material-exercise-feedback-correct material-styles-block",
      "data-show": "true",
      "data-name": "excercises-correct-style-box",
    },
  },
  {
    name: "Harjoitustehtäviä väärin",
    element: "div",
    attributes: {
      class:
        "material-exercise-feedback material-exercise-feedback-incorrect material-styles-block",
      "data-show": "true",
      "data-name": "excercises-incorrect-style-box",
    },
  },
  {
    name: "Kuuntele ja toista",
    element: "div",
    attributes: {
      class:
        "material-visually-guided-styles-combo-block material-visually-guided-styles-combo__listen-and-speak",
    },
  },
  {
    name: "Kuuntele",
    element: "div",
    attributes: {
      class:
        "material-visually-guided-styles-block material-visually-guided-styles__listen",
    },
  },
  {
    name: "Puhu",
    element: "div",
    attributes: {
      class:
        "material-visually-guided-styles-block material-visually-guided-styles__speak",
    },
  },
  {
    name: "Lue",
    element: "div",
    attributes: {
      class:
        "material-visually-guided-styles-block material-visually-guided-styles__read",
    },
  },
  {
    name: "Kirjoita",
    element: "div",
    attributes: {
      class:
        "material-visually-guided-styles-block material-visually-guided-styles__write",
    },
  },
  {
    name: "Katso",
    element: "div",
    attributes: {
      class:
        "material-visually-guided-styles-block material-visually-guided-styles__look",
    },
  },
  {
    name: "Yhdistä",
    element: "div",
    attributes: {
      class:
        "material-visually-guided-styles-block material-visually-guided-styles__connect",
    },
  },
  {
    name: "Äänitä",
    element: "div",
    attributes: {
      class:
        "material-visually-guided-styles-block material-visually-guided-styles__record",
    },
  },
  {
    name: "Etsi",
    element: "div",
    attributes: {
      class:
        "material-visually-guided-styles-block material-visually-guided-styles__search",
    },
  },
];

/**
 * Can use div box.
 * @param editor - The editor.
 * @returns True if the div box can be used, false otherwise.
 */
export function canUseDivBox(editor: Editor | null) {
  return !!editor?.isEditable;
}

/**
 * Get the active div box.
 * @param editor - The editor.
 * @returns The active div box or null.
 */
export function getActiveDivBox(editor: Editor | null) {
  if (!editor) return null;
  return findParentNodeClosestToPos(
    editor.state.selection.$from,
    (node: Node) => node.type.name === "divBox"
  );
}

/**
 * Get the current div box preset.
 * @param editor - The editor.
 * @returns The current div box preset or null.
 */
export function getCurrentDivBoxPreset(editor: Editor | null): string | null {
  if (!editor) return null;
  const box = getActiveDivBox(editor);
  if (!box) return null;

  const preset = box.node.attrs["data-style"] as string | undefined;
  if (preset) return preset;

  // fallback for legacy content without data-style: try match exact preset class string
  const cls = box.node.attrs.class as string | undefined;
  if (!cls) return null;

  const match = stylesSet.find((s) => {
    const styleClass = s.attributes.class;
    return typeof styleClass === "string" && cls === styleClass;
  });

  return match?.name ?? null;
}

/**
 * isBlockStyle checks if a style is a block style
 * @param style - The style to check
 * @returns true if the style is a block style, false otherwise
 */
export function isBlockStyle(style: StyleDefinition): boolean {
  const cls = style.attributes.class;
  return typeof cls === "string" && cls.includes("material-styles-block");
}

export const blockStylesSet = stylesSet.filter(isBlockStyle);
