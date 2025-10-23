/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// srcv4/src/materials/MaterialLoaderV2/core/processors/ProcessingRules.ts

import type { EnhancedHTMLToReactComponentRule } from "./HTMLProcessor";
import { FieldProcessor } from "./FieldProcessor";
import type {
  IframeDataset,
  ImageDataset,
  LinkDataset,
  SourceDataset,
  StaticDataset,
  WordDefinitionDataset,
} from "../types";

// Import static components (these will need to be imported from existing components)
/* import Image from "~/components/base/material-loader/static/image";
import WordDefinition from "~/components/base/material-loader/static/word-definition";
import IFrame from "~/components/base/material-loader/static/iframe";
import Link from "~/components/base/material-loader/static/link";
import Table from "~/components/base/material-loader/static/table";
import MathJAX from "~/components/base/material-loader/static/mathjax";
import { AudioPoolComponent } from "~/components/general/audio-pool-component"; */

const MATERIALS_AND_HELP_RULES: EnhancedHTMLToReactComponentRule[] = [
  {
    /**
     * "contains incorrect exercises" div style box
     */
    shouldProcessHTMLElement: (tagname, element) =>
      tagname === "div" &&
      element.getAttribute("data-show") !== null &&
      element.getAttribute("data-name") === "excercises-incorrect-style-box",

    preprocessReactProperties: (_tag, props, _children, _element, context) => {
      if (!context) return;

      // prerequisites for showing the box
      if (context?.checkAnswers && context?.answerRegistry) {
        // We get the correct answers
        const correctAnswers = Object.keys(context.answerRegistry).filter(
          (key) => context.answerRegistry[key]
        ).length;

        // And the total answers
        const totalAnswers = Object.keys(context.answerRegistry).length;

        // If there are incorrect answers
        if (correctAnswers !== totalAnswers) {
          props["data-show"] = "true";
        } else {
          props["data-show"] = "false";
        }
      } else {
        props["data-show"] = "false";
      }
    },
  },
  {
    /**
     * "all exercises correct" div style box
     */
    shouldProcessHTMLElement: (tagname, element) =>
      tagname === "div" &&
      element.getAttribute("data-show") !== null &&
      element.getAttribute("data-name") === "excercises-correct-style-box",

    preprocessReactProperties: (_tag, props, _children, _element, context) => {
      if (!context) return;

      // prerequisites for showing the box
      if (context?.checkAnswers && context?.answerRegistry) {
        // We get the correct answers
        const correctAnswers = Object.keys(context.answerRegistry).filter(
          (key) => context.answerRegistry[key]
        ).length;

        // And the total answers
        const totalAnswers = Object.keys(context.answerRegistry).length;

        // If all answers are correct
        if (correctAnswers === totalAnswers) {
          props["data-show"] = "true";
        } else {
          props["data-show"] = "false";
        }
      } else {
        props["data-show"] = "false";
      }
    },
  },
  {
    /**
     * Generic data-show div processing
     */
    shouldProcessHTMLElement: (tagname, element) =>
      tagname === "div" && element.getAttribute("data-show") !== null,

    preprocessReactProperties: (_tag, props, _children, _element, context) => {
      if (!context) return;

      if (context?.checkAnswers && context?.displayCorrectAnswers) {
        props["data-show"] = "true";
      } else {
        props["data-show"] = "false";
      }
    },
  },
  {
    /**
     * Object elements (custom fields)
     */
    shouldProcessHTMLElement: (tagname, element) =>
      tagname === "object" &&
      FieldProcessor.getRegisteredFieldTypes().includes(
        element.getAttribute("type") ?? ""
      ),

    processingFunction: (_tag, props, _children, element, context) =>
      context && FieldProcessor.createFieldElement(element, context, props.key),
  },
  {
    /**
     * Iframe elements
     */
    shouldProcessHTMLElement: (tagname) => tagname === "iframe",
    preventChildProcessing: true,

    processingFunction: (_tag, _props, _children, element, context) => {
      if (!context) return;
      const dataset = extractDataSet<IframeDataset>(element);
      const path = `/workspace/${context?.workspace.urlName}/materials/${context?.material.path}`;
      return <>IFrame</>;
    },
  },
  {
    /**
     * Word definition elements
     */
    shouldProcessHTMLElement: (tagname, element) =>
      !!(tagname === "mark" && element.dataset.muikkuWordDefinition),

    processingFunction: (_tag, _props, _children, element, context) => {
      if (!context) return;
      const dataset = extractDataSet<WordDefinitionDataset>(element);
      return <>WordDefinition</>;
    },
  },
  {
    /**
     * Image elements
     */
    shouldProcessHTMLElement: (tagname, element) =>
      (tagname === "figure" || tagname === "span") &&
      element.classList.contains("image"),
    preventChildProcessing: true,

    processingFunction: (_tag, _props, _children, element, context) => {
      if (!context) return;
      const dataset = extractDataSet<ImageDataset>(element);
      const path = `/workspace/${context?.workspace.urlName}/materials/${context?.material.path}`;
      return <>Image</>;
    },
    id: "image-rule",
  },
  {
    /**
     * Math elements
     */
    shouldProcessHTMLElement: (tagname, element) =>
      tagname === "span" && element.classList.contains("math-tex"),

    processingFunction: (_tag, _props, _children, _element, _context) => (
      <>MathJAX</>
    ),
  },
  {
    /**
     * Link elements
     */
    shouldProcessHTMLElement: (tagname, element) =>
      !!(tagname === "a" && (element as HTMLAnchorElement).href),
    id: "link-rule",
    preventChildProcessing: true,

    processingFunction: (_tag, _props, _children, element, context) => {
      if (!context) return;
      const dataset = extractDataSet<LinkDataset>(element);
      const path = `/workspace/${context?.workspace.urlName}/materials/${context?.material.path}`;
      return <>Link</>;
    },
  },
  {
    /**
     * Table elements
     */
    shouldProcessHTMLElement: (tagname) => tagname === "table",

    processingFunction: (_tag, _props, _children, _element) => <>Table</>,
  },
  {
    /**
     * Audio elements
     */
    shouldProcessHTMLElement: (tagname) => tagname === "audio",

    preprocessReactProperties: (_tag, props, _children, _element) => {
      props.preload = "metadata";
    },

    processingFunction: (_tag, _props, _children, _element, _context) => (
      <>AudioPoolComponent</>
    ),
  },
  {
    /**
     * Source elements
     */
    shouldProcessHTMLElement: (tagname) => tagname === "source",

    preprocessReactProperties: (_tag, props, _children, element, context) => {
      if (!context) return;
      const dataset = extractDataSet<SourceDataset>(element);
      const src = dataset.original ?? "";
      const isAbsolute =
        src.startsWith("/") ||
        src.startsWith("mailto:") ||
        src.startsWith("data:") ||
        /^(?:[a-zA-Z]+:)?\/\//.test(src);
      if (!isAbsolute) {
        const path = `/workspace/${context?.workspace.urlName}/materials/${context?.material.path}`;
        props.src = path + "/" + src;
      }
    },
  },
];

const SIMPLE_RULES: EnhancedHTMLToReactComponentRule[] = [
  {
    /**
     * shouldProcessHTMLElement
     * @param tagname tagname
     * @param element element
     * @returns boolean
     */
    shouldProcessHTMLElement: (tagname, element) =>
      tagname === "span" && element.classList.contains("math-tex"),
    /**
     * processingFunction
     * @param _tag tag
     * @param _props  props
     * @param _children  children
     * @param _element  element
     * @returns any
     */
    processingFunction: (_tag, _props, _children, _element) => <>MathJAX</>,
  },
  {
    /**
     * shouldProcessHTMLElement
     * @param tagname tagname
     * @param element element
     * @returns boolean
     */
    shouldProcessHTMLElement: (tagname, element) =>
      (tagname === "figure" || tagname === "span") &&
      element.classList.contains("image"),
    preventChildProcessing: true,

    /**
     * processingFunction
     * @param _tag tag
     * @param _props props
     * @param _children children
     * @param element element
     * @returns any
     */
    processingFunction: (_tag, _props, _children, element) => {
      const dataset = extractDataSet<ImageDataset>(element);
      return <>Image</>;
    },
    id: "image-rule",
  },
  {
    /**
     * shouldProcessHTMLElement
     * @param tagname tagname
     * @param element element
     * @returns boolean
     */
    shouldProcessHTMLElement: (tagname, element) =>
      !!(tagname === "a" && (element as HTMLAnchorElement).href),
    id: "link-rule",
    preventChildProcessing: true,

    /**
     * processingFunction
     * @param _tag tag
     * @param _props props
     * @param _children children
     * @param element element
     * @returns any
     */
    processingFunction: (_tag, _props, _children, element) => {
      const dataset = extractDataSet<LinkDataset>(element);
      return <>Link</>;
    },
  },
];

/**
 * Create processing rules with context support
 * Extracted from Base component's processingRules array
 */
export function createProcessingRules(type: "materials" | "simple") {
  switch (type) {
    case "materials":
      return MATERIALS_AND_HELP_RULES;
    case "simple":
      return SIMPLE_RULES;
    default:
      return MATERIALS_AND_HELP_RULES;
  }
}

/**
 * Extract dataset from element and its children
 * Extracted from modifiers.ts
 */
function extractDataSet<T extends StaticDataset>(element: HTMLElement): T {
  let finalThing = {
    ...element.dataset,
  };
  Array.from(element.childNodes).map((node) => {
    if (node instanceof HTMLElement) {
      finalThing = {
        ...finalThing,
        ...extractDataSet(node),
      };
    }
  });

  return finalThing as unknown as T;
}
