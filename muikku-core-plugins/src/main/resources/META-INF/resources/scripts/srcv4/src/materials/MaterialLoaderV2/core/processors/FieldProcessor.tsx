/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// srcv4/src/materials/MaterialLoaderV2/core/processors/FieldProcessor.tsx

import * as React from "react";
import type {
  ProcessingRuleContext,
  FieldContent,
  FieldParameters,
  FieldRegistryEntry,
  FieldComponentProps,
  TextFieldContent,
  SelectFieldContent,
  MultiSelectFieldContent,
} from "../types";

// Import field components with proper typing
import { TextField } from "../../components/fields/TextField";
import { SelectField } from "../../components/fields/SelectField";
import { MultiSelectField } from "../../components/fields/MultiSelectField";
import { MemoField } from "../../components/fields/MemoField";
//import { FileField } from "../../components/fields/FileField";
import { ConnectField } from "../../components/fields/ConnectField";
import { OrganizerField } from "../../components/fields/OrganizerField";
///import { AudioField } from "../components/fields/AudioField";
import { JournalField } from "../../components/fields/JournalField";
import { SorterField } from "../../components/fields/Sorterfield";
//import { MathField } from "../../components/fields/MathField";

/**
 * FieldProcessor - Handles field element creation with proper typing
 */
export class FieldProcessor {
  // Field registry with proper typing
  private static readonly fieldRegistry: Record<string, FieldRegistryEntry> = {
    "application/vnd.muikku.field.text": {
      component: TextField,
      processor: createTextFieldParameters,
      canCheckAnswers: (content) =>
        canCheckTextAnswers(content as TextFieldContent),
    },
    "application/vnd.muikku.field.select": {
      component: SelectField,
      processor: createSelectFieldParameters,
      canCheckAnswers: (content) =>
        canCheckSelectAnswers(content as SelectFieldContent),
    },
    "application/vnd.muikku.field.multiselect": {
      component: MultiSelectField,
      processor: createMultiSelectFieldParameters,
      canCheckAnswers: (content) =>
        canCheckSelectAnswers(content as MultiSelectFieldContent),
    },
    "application/vnd.muikku.field.memo": {
      component: MemoField,
      processor: createMemoFieldParameters,
      canCheckAnswers: () => false,
    },
    /* "application/vnd.muikku.field.file": {
      component: FileField,
      processor: createFileFieldParameters,
      canCheckAnswers: () => false,
    }, */
    "application/vnd.muikku.field.connect": {
      component: ConnectField,
      processor: createConnectFieldParameters,
      canCheckAnswers: () => true,
    },
    "application/vnd.muikku.field.organizer": {
      component: OrganizerField,
      processor: createOrganizerFieldParameters,
      canCheckAnswers: () => true,
    },
    /* "application/vnd.muikku.field.audio": {
      component: AudioField,
      processor: createAudioFieldParameters,
      canCheckAnswers: () => false,
    }, */
    "application/vnd.muikku.field.sorter": {
      component: SorterField,
      processor: createSorterFieldParameters,
      canCheckAnswers: () => false,
    },
    /* "application/vnd.muikku.field.mathexercise": {
      component: MathField,
      processor: createMathFieldParameters,
      canCheckAnswers: () => false,
    }, */
    "application/vnd.muikku.field.journal": {
      component: JournalField,
      processor: createJournalFieldParameters,
      canCheckAnswers: () => false,
    },
  };

  /**
   * Create field element from HTML object element with proper typing
   */
  static createFieldElement(
    element: HTMLElement,
    context: ProcessingRuleContext,
    key?: number
  ): React.ReactElement {
    const fieldType = element.getAttribute("type");

    if (!fieldType) {
      return <span key={key}>Invalid Element: No type attribute</span>;
    }

    const fieldEntry = this.fieldRegistry[fieldType];

    if (!fieldEntry) {
      return (
        <span key={key}>
          Invalid Element {fieldType} {element.innerHTML}
        </span>
      );
    }

    // Process field parameters
    const parameters = fieldEntry.processor(element, context);

    // Create component props
    const componentProps: FieldComponentProps<FieldContent> = {
      content: parameters.content,
      status: parameters.status,
      readOnly: parameters.readOnly,
      usedAs: parameters.usedAs,
      initialValue: parameters.initialValue,
      onChange: parameters.onChange,
      displayCorrectAnswers: parameters.displayCorrectAnswers,
      checkAnswers: parameters.checkAnswers,
      onAnswerChange: parameters.onAnswerChange,
      invisible: parameters.invisible,
      userId: parameters.userId,
    };

    return React.createElement(fieldEntry.component, {
      ...componentProps,
      key,
    });
  }

  /**
   * Check if a field type can check answers
   */
  static canCheckAnswers(fieldType: string, content: FieldContent): boolean {
    const fieldEntry = this.fieldRegistry[fieldType];
    return fieldEntry ? fieldEntry.canCheckAnswers(content) : false;
  }

  /**
   * Get all registered field types
   */
  static getRegisteredFieldTypes(): string[] {
    return Object.keys(this.fieldRegistry);
  }
}

/**
 * Create text field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
function createTextFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
}

/**
 * Create select field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
function createSelectFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
}

/**
 * Create multi select field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
function createMultiSelectFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
}

/**
 * Create memo field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
function createMemoFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
}

/**
 * Create file field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
/* function createFileFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
} */

/**
 * Create connect field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
function createConnectFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
}

/**
 * Create organizer field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
function createOrganizerFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
}

/**
 * Create audio field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
/* function createAudioFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
} */

/**
 * Create sorter field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
function createSorterFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
}

/**
 * Create math field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
/* function createMathFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
} */

/**
 * Create journal field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @returns FieldParameters
 */
function createJournalFieldParameters(
  element: HTMLElement,
  context: ProcessingRuleContext
): FieldParameters {
  const content = parseFieldContent(element);
  return createBaseFieldParameters(element, context, content);
}

// Helper methods
/**
 * Parse field content
 * @param element HTMLElement
 * @returns FieldContent | null
 */
function parseFieldContent(element: HTMLElement): {
  content: FieldContent | null;
  type: string;
} {
  const parameters: Record<string, string> = {};

  element.querySelectorAll("param").forEach((node) => {
    const name = node.getAttribute("name");
    const value = node.getAttribute("value");
    if (name && value) {
      parameters[name] = value;
    }
  });

  if (parameters.type === "application/json" && parameters.content) {
    try {
      return {
        content: JSON.parse(parameters.content) as FieldContent,
        type: parameters.type,
      };
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return { content: null, type: "application/json" };
}

/**
 * Create base field parameters
 * @param element HTMLElement
 * @param context ProcessingRuleContext
 * @param content FieldContent | null
 * @returns FieldParameters
 */
function createBaseFieldParameters(
  _element: HTMLElement,
  context: ProcessingRuleContext,
  content: { content: FieldContent | null; type: string }
): FieldParameters {
  return {
    content: content.content,
    type: content.type,
    status: null,
    readOnly: context.readOnly,
    usedAs: context.usedAs,
    initialValue: getInitialValue(content.content, context),
    onChange: context.onValueChange,
    displayCorrectAnswers: context.displayCorrectAnswers,
    checkAnswers: context.checkAnswers,
    onAnswerChange: context.onAnswerChange,
    invisible: context.invisible,
    userId: 0,
  };
}

/**
 * Get the initial value of a field
 * @param content FieldContent | null
 * @param context ProcessingRuleContext
 * @returns any
 */
function getInitialValue(
  content: FieldContent | null,
  context: ProcessingRuleContext
) {
  if (!context.compositeReplies?.answers || !content) {
    return null;
  }

  const answer = context.compositeReplies.answers.find(
    (answer) => answer.fieldName === content.name
  );

  if (!answer) {
    return null;
  }

  // Handle value extraction
  if (typeof answer.value !== "undefined") {
    return answer.value;
  }

  return answer;
}

/**
 * Check if a text field can check answers
 * @param content TextFieldContent
 * @returns boolean
 */
function canCheckTextAnswers(content: TextFieldContent): boolean {
  return content.rightAnswers?.filter((option) => option.correct).length > 0;
}

/**
 * Check if a select field can check answers
 * @param content SelectFieldContent | MultiSelectFieldContent
 * @returns boolean
 */
function canCheckSelectAnswers(
  content: SelectFieldContent | MultiSelectFieldContent
): boolean {
  return content.options?.filter((option) => option.correct).length > 0;
}
