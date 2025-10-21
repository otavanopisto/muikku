/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProcessingRule, ProcessingContext } from "./HTMLProcessor";

export const defaultProcessingRules: ProcessingRule[] = [
  // Object/Field processing
  {
    matches: (element) =>
      element.tagName === "OBJECT" && element.hasAttribute("type"),
    process: (element, context) => {
      const fieldType = element.getAttribute("type");
      const props = extractFieldProps(element);

      if (context.fieldManager) {
        return context.fieldManager.createField(fieldType, props);
      }

      return <span key={context.key}>Field: {fieldType}</span>;
    },
  },

  // Image processing
  {
    matches: (element) =>
      (element.tagName === "FIGURE" || element.tagName === "SPAN") &&
      element.classList.contains("image"),
    preventChildProcessing: true,
    process: (element, context) => <>Kuva</>,
  },

  // Math processing
  {
    matches: (element) => element.classList.contains("math-tex"),
    process: (element, context) => <>Matikka</>,
  },

  // Table processing
  {
    matches: (element) => element.tagName === "TABLE",
    process: (element, context) => <>Taulukko</>,
  },

  // Link processing
  {
    matches: (element) =>
      element.tagName === "A" &&
      (element as HTMLAnchorElement).href !== undefined,
    process: (element, context) => <>Linkki</>,
  },

  // IFrame processing
  {
    matches: (element) => element.tagName === "IFRAME",
    process: (element, context) => {
      const dataset = extractDataSet(element);
      return <>IFRAME</>;
    },
    preventChildProcessing: true,
  },

  /* {
    matches: (element) =>
      element.tagName === "DIV" && element.hasAttribute("data-show"),
    process: (element, context) => {
      // Get answer state from context (passed from MaterialLoader)
      const shouldShow = context.answerManager?.shouldShowAnswers() || false;

      // Clone element and update data-show attribute
      const newElement = element.cloneNode(true) as HTMLElement;
      newElement.setAttribute("data-show", shouldShow.toString());

      // Process children with updated element
      return processElementWithRules(newElement, context);
    },
  }, */

  // Word definition processing
  //   {
  //     matches: (element) =>
  //       element.tagName === "MARK" && element.dataset.muikkuWordDefinition,
  //     process: (element, context) => {
  //       const dataset = extractDataSet(element);
  //       return (
  //         <WordDefinitionComponent
  //           key={context.key}
  //           invisible={context.invisible}
  //           dataset={dataset}
  //         >
  //           {Array.from(element.childNodes).map((node, childIndex) => {
  //             if (node instanceof HTMLElement) {
  //               return context.processingRules
  //                 .find((rule) => rule.matches(node))
  //                 ?.process(node, { ...context, key: childIndex });
  //             }
  //             return node.textContent;
  //           })}
  //         </WordDefinitionComponent>
  //       );
  //     },
  //   },

  // Audio processing
  //   {
  //     matches: (element) => element.tagName === "AUDIO",
  //     process: (element, context) => {
  //       const props: any = { key: context.key };
  //       Array.from(element.attributes).forEach((attr) => {
  //         props[attr.name] = attr.value;
  //       });
  //       props.preload = "metadata";

  //       return React.createElement(
  //         "audio",
  //         props,
  //         Array.from(element.children).map((child, childIndex) => {
  //           if (child instanceof HTMLElement) {
  //             return context.processingRules
  //               .find((rule) => rule.matches(child))
  //               ?.process(child, { ...context, key: childIndex });
  //           }
  //           return child.textContent;
  //         })
  //       );
  //     },
  //   },

  // Source processing
  //   {
  //     matches: (element) => element.tagName === "SOURCE",
  //     process: (element, context) => {
  //       const dataset = extractDataSet(element);
  //       const src = dataset.original || "";
  //       const isAbsolute =
  //         src.indexOf("/") === 0 ||
  //         src.indexOf("mailto:") === 0 ||
  //         src.indexOf("data:") === 0 ||
  //         src.match(/^(?:[a-zA-Z]+:)?\/\//);

  //       const props: any = { key: context.key };
  //       Array.from(element.attributes).forEach((attr) => {
  //         props[attr.name] = attr.value;
  //       });

  //       if (!isAbsolute && context.path) {
  //         props.src = context.path + "/" + src;
  //       } else {
  //         props.src = src;
  //       }

  //       return React.createElement("source", props);
  //     },
  //   },
];

// Define a typed shape we can evolve safely
export type FieldProps = {
  type: string; // e.g. "application/json"
  content?: unknown; // parsed JSON or raw string
  name?: string; // many fields include "name" inside content JSON
  [key: string]: unknown; // allow vendor-specific extras
};

/**
 * extractFieldProps
 * @param element element
 */
function extractFieldProps(element: HTMLElement): FieldProps {
  const params: Record<string, string> = {};
  Array.from(element.children)
    .filter((node) => node.tagName === "PARAM")
    .forEach((param) => {
      const name = param.getAttribute("name");
      const value = param.getAttribute("value");
      if (name) params[name] = value ?? "";
    });

  const type = params.type || "application/json";

  // Normalize content
  let content: unknown = params.content;
  if (typeof content === "string" && type === "application/json") {
    content = JSON.parse(content);
  }

  // Return a typed object while preserving original params as extras
  return {
    type,
    content,
    ...params, // keep other fields (e.g., hint, placeholder) as-is
  };
}

/**
 * extractDataSet
 * @param element element
 */
function extractDataSet(element: HTMLElement): any {
  const dataset: any = { ...element.dataset };

  // Recursively extract dataset from children
  Array.from(element.childNodes).forEach((node) => {
    if (node instanceof HTMLElement) {
      Object.assign(dataset, extractDataSet(node));
    }
  });

  return dataset;
}
