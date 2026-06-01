import { type Editor } from "@tiptap/react";
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
 * isBlockStyle checks if a style is a block style
 * @param style - The style to check
 * @returns true if the style is a block style, false otherwise
 */
export function isBlockStyle(style: StyleDefinition): boolean {
  const cls = style.attributes.class;
  return typeof cls === "string" && cls.includes("material-styles-block");
}

export const blockStylesSet = stylesSet.filter(isBlockStyle);

/**
 * Allow applying style boxes on basically any content.
 * (You can tighten exclusions later if you want, e.g. images/hr/codeBlock.)
 */
export function canApplyStyle(editor: Editor | null): boolean {
  if (!editor?.isEditable) return false;
  return true;
}

/**
 * Get the current wrapper style (styleSet node) at the cursor/selection.
 * Looks up the nearest parent node named "styleSet" and matches its class.
 */
export function getCurrentStyle(editor: Editor | null): string | null {
  if (!editor) return null;

  const wrapper = findParentNodeClosestToPos(
    editor.state.selection.$from,
    (node: Node) => node.type.name === "styleSet"
  );

  if (!wrapper) return null;

  const currentClass = wrapper.node.attrs.class as string | undefined;
  if (!currentClass) return null;

  const matching = blockStylesSet.find((style) => {
    const styleClass = style.attributes.class;
    return typeof styleClass === "string" && currentClass === styleClass;
  });

  return matching?.name ?? null;
}
