import type { StaticDataset } from "../types";

/**
 * Extract dataset from element and its children
 * @param element - The element to extract the dataset from
 * @returns The dataset
 */
export function extractDataSet<T extends StaticDataset>(
  element: HTMLElement
): T {
  let finalThing = {
    ...element.dataset,
  };

  Array.from(element.childNodes).forEach((node) => {
    if (node instanceof HTMLElement) {
      finalThing = {
        ...finalThing,
        ...extractDataSet(node),
      };
    }
  });

  return finalThing as unknown as T;
}
