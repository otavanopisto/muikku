/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import { HTMLToReactComponentRule } from "~/util/modifiers";
import { FieldManager } from "../fields/FieldManager";
import {
  CommonFieldProps,
  DataProvider,
  IframeDataset,
  ImageDataset,
  LinkDataset,
  StaticDataset,
  WordDefinitionDataset,
} from "../types";
import { StateManager } from "../state/StateManager";

// Import existing field components (we'll keep using these)
import TextField from "~/components/base/material-loaderV2/components/fields/text-field";
import SelectField from "~/components/base/material-loaderV2/components/fields/select-field";
import MultiSelectField from "~/components/base/material-loaderV2/components/fields/multiselect-field";
import MemoField from "~/components/base/material-loaderV2/components/fields/memo-field";
import FileField from "~/components/base/material-loaderV2/components/fields/file-field";
import ConnectField from "~/components/base/material-loaderV2/components/fields/connect-field";
import OrganizerField from "~/components/base/material-loaderV2/components/fields/organizer-field";
import AudioField from "~/components/base/material-loaderV2/components/fields/audio-field";
import JournalField from "~/components/base/material-loaderV2/components/fields/journal-field";
import SorterField from "~/components/base/material-loaderV2/components/fields/sorter-field";
import MathField from "~/components/base/material-loaderV2/components/fields/math-field";

// Import existing static components
import Image from "~/components/base/material-loaderV2/components/static/image";
import WordDefinition from "~/components/base/material-loaderV2/components/static/word-definition";
import IFrame from "~/components/base/material-loaderV2/components/static/iframe";
import Link from "~/components/base/material-loaderV2/components/static/link";
import Table from "~/components/base/material-loaderV2/components/static/table";
import MathJAX from "~/components/base/material-loaderV2/components/static/mathjax";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";

// Field component mapping (moved from current Base component)
const FIELD_COMPONENTS: { [key: string]: any } = {
  "application/vnd.muikku.field.text": TextField,
  "application/vnd.muikku.field.select": SelectField,
  "application/vnd.muikku.field.multiselect": MultiSelectField,
  "application/vnd.muikku.field.memo": MemoField,
  "application/vnd.muikku.field.file": FileField,
  "application/vnd.muikku.field.connect": ConnectField,
  "application/vnd.muikku.field.organizer": OrganizerField,
  "application/vnd.muikku.field.audio": AudioField,
  "application/vnd.muikku.field.sorter": SorterField,
  "application/vnd.muikku.field.mathexercise": MathField,
  "application/vnd.muikku.field.journal": JournalField,
};

/**
 * Create processing rules for HTML-to-React conversion
 * @param fieldManager field manager instance
 * @param stateManager state manager instance
 * @param dataProvider data provider
 * @param path material path for relative URLs
 * @param invisible whether content is invisible
 * @returns array of processing rules
 */
export function createProcessingRules(
  fieldManager: FieldManager,
  stateManager: StateManager, // Add StateManager parameter
  dataProvider: DataProvider,
  path: string,
  invisible: boolean
): HTMLToReactComponentRule[] {
  return [
    // Rule for "contains incorrect exercises" div style box
    {
      shouldProcessHTMLElement: (tagName, element) =>
        tagName === "div" &&
        element.getAttribute("data-show") !== null &&
        element.getAttribute("data-name") === "excercises-incorrect-style-box",

      preprocessReactProperties: (tag, props, children, element) => {
        // Use StateManager instead of FieldManager
        if (stateManager.shouldCheckAnswers()) {
          const correctAnswers = fieldManager
            .getFields()
            .filter(
              (field) =>
                fieldManager.getFieldValidationState(field.name) === "valid"
            ).length;
          const totalAnswers = fieldManager.getFields().length;

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

    // Rule for "all exercises correct" div style box
    {
      shouldProcessHTMLElement: (tagName, element) =>
        tagName === "div" &&
        element.getAttribute("data-show") !== null &&
        element.getAttribute("data-name") === "excercises-correct-style-box",

      preprocessReactProperties: (tag, props, children, element) => {
        if (stateManager.shouldCheckAnswers()) {
          const correctAnswers = fieldManager
            .getFields()
            .filter(
              (field) =>
                fieldManager.getFieldValidationState(field.name) === "valid"
            ).length;
          const totalAnswers = fieldManager.getFields().length;

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

    // Rule for general data-show elements
    {
      shouldProcessHTMLElement: (tagName, element) =>
        tagName === "div" && element.getAttribute("data-show") !== null,

      preprocessReactProperties: (tag, props, children, element) => {
        if (
          stateManager.shouldCheckAnswers() &&
          stateManager.shouldShowAnswers()
        ) {
          props["data-show"] = "true";
        } else {
          props["data-show"] = "false";
        }
      },
    },

    // Rule for field objects (text fields, select fields, etc.)
    {
      shouldProcessHTMLElement: (tagName, element) =>
        tagName === "object" && FIELD_COMPONENTS[element.getAttribute("type")],

      processingFunction: (tag, props, children, element) =>
        createFieldElement(
          element,
          fieldManager,
          stateManager,
          dataProvider,
          props.key
        ),
    },

    // Rule for iframes
    {
      shouldProcessHTMLElement: (tagName) => tagName === "iframe",
      preventChildProcessing: true,

      processingFunction: (tag, props, children, element) => {
        const dataset = extractDataSet<IframeDataset>(element);
        return (
          <IFrame
            key={props.key}
            element={element}
            path={path}
            invisible={invisible}
            dataset={dataset}
          />
        );
      },
    },

    // Rule for word definitions
    {
      shouldProcessHTMLElement: (tagName, element) =>
        !!(tagName === "mark" && element.dataset.muikkuWordDefinition),

      processingFunction: (tag, props, children, element) => {
        const dataset = extractDataSet<WordDefinitionDataset>(element);
        return (
          <WordDefinition
            key={props.key}
            invisible={invisible}
            dataset={dataset}
          >
            {children}
          </WordDefinition>
        );
      },
    },

    // Rule for images
    {
      shouldProcessHTMLElement: (tagName, element) =>
        (tagName === "figure" || tagName === "span") &&
        element.classList.contains("image"),
      preventChildProcessing: true,

      processingFunction: (tag, props, children, element) => {
        const dataset = extractDataSet<ImageDataset>(element);
        return (
          <Image
            key={props.key}
            element={element}
            path={path}
            invisible={invisible}
            dataset={dataset}
            processingRules={createProcessingRules(
              fieldManager,
              stateManager, // Pass stateManager
              dataProvider,
              path,
              invisible
            )}
          />
        );
      },
      id: "image-rule",
    },

    // Rule for math expressions
    {
      shouldProcessHTMLElement: (tagName, element) =>
        tagName === "span" && element.classList.contains("math-tex"),

      processingFunction: (tag, props, children, element) => (
        <MathJAX key={props.key} invisible={invisible}>
          {children}
        </MathJAX>
      ),
    },

    // Rule for links
    {
      shouldProcessHTMLElement: (tagName, element) =>
        !!(tagName === "a" && (element as HTMLAnchorElement).href),
      preventChildProcessing: true,

      processingFunction: (tag, props, children, element) => {
        const dataset = extractDataSet<LinkDataset>(element);
        return (
          <Link
            key={props.key}
            element={element}
            path={path}
            dataset={dataset}
            processingRules={createProcessingRules(
              fieldManager,
              stateManager, // Pass stateManager
              dataProvider,
              path,
              invisible
            )}
          />
        );
      },
      id: "link-rule",
    },

    // Rule for tables
    {
      shouldProcessHTMLElement: (tagName) => tagName === "table",

      processingFunction: (tag, props, children, element) => (
        <Table
          key={props.key}
          element={element}
          props={props}
          // eslint-disable-next-line react/no-children-prop
          children={children}
        />
      ),
    },

    // Rule for audio elements
    {
      shouldProcessHTMLElement: (tagName) => tagName === "audio",

      preprocessReactProperties: (tag, props, children, element) => {
        props.preload = "metadata";
      },

      processingFunction: (tag, props, children, element) => (
        <AudioPoolComponent {...props} invisible={invisible}>
          {children}
        </AudioPoolComponent>
      ),
    },

    // Rule for source elements
    {
      shouldProcessHTMLElement: (tagName) => tagName === "source",

      preprocessReactProperties: (tag, props, children, element) => {
        const dataset = extractDataSet<any>(element);
        const src = dataset.original || "";
        const isAbsolute =
          src.indexOf("/") == 0 ||
          src.indexOf("mailto:") == 0 ||
          src.indexOf("data:") == 0 ||
          src.match("^(?:[a-zA-Z]+:)?//");

        if (!isAbsolute) {
          props.src = `${path}/${src}`;
        }
      },
    },
  ];
}

/**
 * Create field element (moved from current Base component)
 * @param element HTML element
 * @param fieldManager field manager
 * @param stateManager state manager
 * @param dataProvider data provider
 * @param key React key
 * @returns React element
 */
function createFieldElement(
  element: HTMLElement,
  fieldManager: FieldManager,
  stateManager: StateManager,
  dataProvider: DataProvider,
  key?: number
): React.ReactElement {
  const fieldType = element.getAttribute("type");
  const FieldComponent = FIELD_COMPONENTS[fieldType];

  // If the field component is not found, return an invalid element
  if (!FieldComponent) {
    return (
      <span key={key}>
        Invalid Element {fieldType} {element.innerHTML}
      </span>
    );
  }

  // Extract parameters from param elements
  const parameters: { [key: string]: any } = extractFieldParameters(element);

  const fieldName = parameters.content?.name;

  if (!fieldName) {
    return <span key={key}>Missing field name</span>;
  }

  // Create common field props we want to pass to all fields
  const commonProps = createCommonFieldProps(
    fieldType,
    fieldName,
    fieldManager,
    stateManager,
    dataProvider,
    key
  );

  // Merge common props with field-specific parameters
  const fieldProps = {
    ...commonProps,
    ...parameters,
  };

  return <FieldComponent {...fieldProps} />;
}

/**
 * Create common field props
 * @param type field type
 * @param fieldName field name
 * @param fieldManager field manager
 * @param stateManager state manager
 * @param dataProvider data provider
 * @param key key
 * @returns common field props
 */
function createCommonFieldProps(
  type: string,
  fieldName: string,
  fieldManager: FieldManager,
  stateManager: StateManager,
  dataProvider: DataProvider,
  key?: number
): CommonFieldProps {
  return {
    key,
    type,
    userId: dataProvider.userId,
    invisible: false, // This should come from props
    readOnly: !stateManager.canEdit(),
    context: dataProvider.context,
    onChange: (value: any) => {
      fieldManager.handleFieldChange(fieldName, value);
    },
    initialValue: fieldManager.getFieldValue(fieldName),
    // validationState: fieldManager.getFieldValidationState(fieldName),
    // hasError: fieldManager.hasFieldError(fieldName),
    // errorMessage: fieldManager.getFieldError(fieldName),
  };
}

/**
 * Extract field parameters
 * @param element element
 * @returns field parameters
 */
function extractFieldParameters(element: HTMLElement): { [key: string]: any } {
  const parameters: { [key: string]: any } = {};

  element.querySelectorAll("param").forEach((node) => {
    const name = node.getAttribute("name");
    const value = node.getAttribute("value");
    if (name) {
      parameters[name] = value;
    }
  });

  // Parse JSON content if present
  if (parameters["type"] === "application/json" && parameters["content"]) {
    try {
      parameters["content"] = JSON.parse(parameters["content"]);
    } catch (e) {
      // Ignore parsing errors
    }
  }

  // Set defaults
  if (!parameters["type"]) {
    parameters["type"] = "application/json";
  }
  if (!parameters["content"]) {
    parameters["content"] = null;
  }

  return parameters;
}

/**
 * extractDataSet
 * @param element element
 */
export function extractDataSet<T extends StaticDataset>(
  element: HTMLElement
): T {
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

  return finalThing as T;
}
