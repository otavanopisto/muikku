import type {
  EnhancedHTMLToReactComponentRule,
  IframeDataset,
  ImageDataset,
  LinkDataset,
  SourceDataset,
  WordDefinitionDataset,
} from "../../core/types";
import { extractDataSet } from "../../core/utils/extractDataSet";
import WordDefinition from "../../core/components/static/WordDefinition";
import IFrame from "../../core/components/static/IFrame";
import Image from "../../core/components/static/Image";
import Link from "../../core/components/static/Link";
import Table from "../../core/components/static/Table";
import MathRenderer from "../../core/components/static/Math";
import type { MaterialProcessingContext } from "../types";
import {
  getMaterialMediaPath,
  isAbsoluteUrl,
} from "../utils/getMaterialMediaPath";

/**
 * Cast a context to a MaterialProcessingContext
 * @param context - The context to cast
 * @returns The MaterialProcessingContext or undefined
 */
function asMaterialContext(
  context: unknown
): MaterialProcessingContext | undefined {
  return context as MaterialProcessingContext | undefined;
}

/**
 * Shared material content rules (everything except the injectable field rule).
 * Used by MaterialLoader and EvaluationMaterialLoader.
 */
export function createMaterialContentRules(): EnhancedHTMLToReactComponentRule[] {
  const rules: EnhancedHTMLToReactComponentRule[] = [];

  rules.push(
    // Exercises incorrect box rule
    {
      id: "exercises-incorrect-box-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        tagname === "div" &&
        element.getAttribute("data-show") !== null &&
        element.getAttribute("data-name") === "excercises-incorrect-style-box",

      preprocessReactProperties: (
        _tag,
        props,
        _children,
        _element,
        context
      ) => {
        const ctx = asMaterialContext(context);
        if (!ctx) return;

        // prerequisites for showing the box
        if (ctx.checkAnswers && ctx.answerRegistry) {
          // We get the correct answers
          const correctAnswers = Object.keys(ctx.answerRegistry).filter(
            (key) => ctx.answerRegistry[key]
          ).length;

          // And the total answers
          const totalAnswers = Object.keys(ctx.answerRegistry).length;

          // If there are incorrect answers, show the box, otherwise hide it
          props["data-show"] =
            correctAnswers !== totalAnswers ? "true" : "false";
        } else {
          props["data-show"] = "false";
        }
      },
    },

    // Exercises correct box rule
    {
      id: "exercises-correct-box-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        tagname === "div" &&
        element.getAttribute("data-show") !== null &&
        element.getAttribute("data-name") === "excercises-correct-style-box",
      preprocessReactProperties: (
        _tag,
        props,
        _children,
        _element,
        context
      ) => {
        const ctx = asMaterialContext(context);
        if (!ctx) return;

        // prerequisites for showing the box
        if (ctx.checkAnswers && ctx.answerRegistry) {
          // We get the correct answers
          const correctAnswers = Object.keys(ctx.answerRegistry).filter(
            (key) => ctx.answerRegistry[key]
          ).length;

          // And the total answers
          const totalAnswers = Object.keys(ctx.answerRegistry).length;

          // If all answers are correct show the box, otherwise hide it
          props["data-show"] =
            correctAnswers === totalAnswers ? "true" : "false";
        } else {
          props["data-show"] = "false";
        }
      },
    },

    // Generic data-show div processing
    {
      id: "data-show-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        tagname === "div" && element.getAttribute("data-show") !== null,

      preprocessReactProperties: (
        _tag,
        props,
        _children,
        _element,
        context
      ) => {
        const ctx = asMaterialContext(context);
        if (!ctx) return;

        props["data-show"] =
          ctx.checkAnswers && ctx.displayCorrectAnswers ? "true" : "false";
      },
    },

    // Iframe elements
    {
      id: "iframe-rule",
      shouldProcessHTMLElement: (tagname) => tagname === "iframe",

      preventChildProcessing: true,
      processingFunction: (_tag, props, children, element, context) => {
        const ctx = asMaterialContext(context);
        if (!ctx) return null;

        const dataset = extractDataSet<IframeDataset>(element);
        return (
          <IFrame
            key={props.key}
            element={element}
            dataset={dataset}
            invisible={ctx.invisible}
            path={getMaterialMediaPath(ctx)}
          >
            {children}
          </IFrame>
        );
      },
    },

    // Word definition elements
    {
      id: "word-definition-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        !!(tagname === "mark" && element.dataset.muikkuWordDefinition),

      processingFunction: (_tag, props, children, element, context) => {
        const ctx = asMaterialContext(context);
        if (!ctx) return null;

        const dataset = extractDataSet<WordDefinitionDataset>(element);
        return (
          <WordDefinition
            key={props.key}
            dataset={dataset}
            invisible={ctx.invisible}
          >
            {children}
          </WordDefinition>
        );
      },
    },

    // Image elements
    {
      id: "image-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        (tagname === "figure" || tagname === "span") &&
        element.classList.contains("image"),

      preventChildProcessing: true,
      processingFunction: (_tag, props, _children, element, context) => {
        const ctx = asMaterialContext(context);
        if (!ctx) return null;

        const dataset = extractDataSet<ImageDataset>(element);
        return (
          <Image
            key={props.key}
            element={element}
            dataset={dataset}
            invisible={ctx.invisible}
            path={getMaterialMediaPath(ctx)}
            processingRules={rules}
          />
        );
      },
    },

    // Math elements
    {
      id: "math-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        tagname === "span" && element.classList.contains("math-tex"),

      processingFunction: (_tag, props, children, _element, context) => (
        <MathRenderer
          key={props.key}
          engine="mathjax"
          invisible={asMaterialContext(context)?.invisible}
        >
          {children}
        </MathRenderer>
      ),
    },

    // Link elements
    {
      id: "link-rule",
      shouldProcessHTMLElement: (tagname, element) =>
        !!(tagname === "a" && (element as HTMLAnchorElement).href),

      preventChildProcessing: true,
      processingFunction: (_tag, props, _children, element, context) => {
        const ctx = asMaterialContext(context);
        if (!ctx) return null;

        const dataset = extractDataSet<LinkDataset>(element);
        return (
          <Link
            key={props.key}
            element={element}
            dataset={dataset}
            invisible={ctx.invisible}
            path={getMaterialMediaPath(ctx)}
            processingRules={rules}
          />
        );
      },
    },

    // Table elements
    {
      id: "table-rule",
      shouldProcessHTMLElement: (tagname) => tagname === "table",
      processingFunction: (_tag, props, children, element) => (
        <Table
          key={props.key}
          element={element}
          props={props}
          children={children}
        />
      ),
    },

    // Audio elements
    {
      id: "audio-rule",
      shouldProcessHTMLElement: (tagname) => tagname === "audio",
      preprocessReactProperties: (_tag, props) => {
        props.preload = "metadata";
      },
      // Stub until AudioPool is ported
      processingFunction: (_tag, props) => (
        <div key={props.key}>AudioPoolComponent</div>
      ),
    },

    // Source elements
    {
      id: "source-rule",
      shouldProcessHTMLElement: (tagname) => tagname === "source",
      preprocessReactProperties: (_tag, props, _children, element, context) => {
        const ctx = asMaterialContext(context);
        if (!ctx) return;

        const dataset = extractDataSet<SourceDataset>(element);
        const src = dataset.original ?? "";
        if (src && !isAbsoluteUrl(src)) {
          props.src = `${getMaterialMediaPath(ctx)}/${src}`;
        } else if (src) {
          props.src = src;
        }
      },
    }
  );

  return rules;
}
