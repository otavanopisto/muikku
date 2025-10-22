/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// srcv4/src/materials/MaterialLoaderV2/core/processors/ProcessingRules.ts

import type { EnhancedHTMLToReactComponentRule } from "./HTMLProcessor";
import { FieldProcessor } from "./FieldProcessor";

// Import static components (these will need to be imported from existing components)
/* import Image from "~/components/base/material-loader/static/image";
import WordDefinition from "~/components/base/material-loader/static/word-definition";
import IFrame from "~/components/base/material-loader/static/iframe";
import Link from "~/components/base/material-loader/static/link";
import Table from "~/components/base/material-loader/static/table";
import MathJAX from "~/components/base/material-loader/static/mathjax";
import { AudioPoolComponent } from "~/components/general/audio-pool-component"; */

/**
 * Create processing rules with context support
 * Extracted from Base component's processingRules array
 */
export function createProcessingRules(): EnhancedHTMLToReactComponentRule[] {
  return [
    {
      /**
       * "contains incorrect exercises" div style box
       */
      shouldProcessHTMLElement: (tagname, element) =>
        tagname === "div" &&
        element.getAttribute("data-show") !== null &&
        element.getAttribute("data-name") === "excercises-incorrect-style-box",

      preprocessReactProperties: (tag, props, children, element, context) => {
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

      preprocessReactProperties: (tag, props, children, element, context) => {
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

      preprocessReactProperties: (tag, props, children, element, context) => {
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

      processingFunction: (tag, props, children, element, context) =>
        FieldProcessor.createFieldElement(element, context!, props.key),
    },
    {
      /**
       * Iframe elements
       */
      shouldProcessHTMLElement: (tagname) => tagname === "iframe",
      preventChildProcessing: true,

      processingFunction: (tag, props, children, element, context) => {
        const dataset = extractDataSet(element);
        const path = `/workspace/${context?.workspace.urlName}/materials/${context?.material.id}`;
        return <>IFrame</>;
      },
    },
    {
      /**
       * Word definition elements
       */
      shouldProcessHTMLElement: (tagname, element) =>
        !!(tagname === "mark" && element.dataset.muikkuWordDefinition),

      processingFunction: (tag, props, children, element, context) => {
        const dataset = extractDataSet(element);
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

      processingFunction: (tag, props, children, element, context) => {
        const dataset = extractDataSet(element);
        const path = `/workspace/${context?.workspace.urlName}/materials/${context?.material.id}`;
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

      processingFunction: (tag, props, children, element, context) => (
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

      processingFunction: (tag, props, children, element, context) => {
        const dataset = extractDataSet(element);
        const path = `/workspace/${context?.workspace.urlName}/materials/${context?.material.id}`;
        return <>Link</>;
      },
    },
    {
      /**
       * Table elements
       */
      shouldProcessHTMLElement: (tagname) => tagname === "table",

      processingFunction: (tag, props, children, element) => <>Table</>,
    },
    {
      /**
       * Audio elements
       */
      shouldProcessHTMLElement: (tagname) => tagname === "audio",

      preprocessReactProperties: (tag, props, children, element) => {
        props.preload = "metadata";
      },

      processingFunction: (tag, props, children, element, context) => (
        <>AudioPoolComponent</>
      ),
    },
    {
      /**
       * Source elements
       */
      shouldProcessHTMLElement: (tagname) => tagname === "source",

      preprocessReactProperties: (tag, props, children, element, context) => {
        const dataset = extractDataSet(element);
        const src = dataset.original || "";
        const isAbsolute =
          src.indexOf("/") == 0 ||
          src.indexOf("mailto:") == 0 ||
          src.indexOf("data:") == 0 ||
          src.match("^(?:[a-zA-Z]+:)?//");
        if (!isAbsolute) {
          const path = `/workspace/${context?.workspace.urlName}/materials/${context?.material.id}`;
          props.src = path + "/" + src;
        }
      },
    },
  ];
}

/**
 * Extract dataset from element and its children
 * Extracted from modifiers.ts
 */
function extractDataSet(element: HTMLElement): any {
  let finalThing: any = {
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

  return finalThing;
}
