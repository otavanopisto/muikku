/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/dot-notation */
// srcv4/src/materials/MaterialLoaderV2/core/processors/FieldProcessor.ts

import * as React from "react";
import type { CommonFieldProps, ProcessingRuleContext } from "../types";

// Import field components (these will need to be imported from the existing field components)
// For now, I'll create placeholder imports
/* import TextField from "~/components/base/material-loader/fields/text-field";
import SelectField from "~/components/base/material-loader/fields/select-field";
import MultiSelectField from "~/components/base/material-loader/fields/multiselect-field";
import MemoField from "~/components/base/material-loader/fields/memo-field";
import FileField from "~/components/base/material-loader/fields/file-field";
import ConnectField from "~/components/base/material-loader/fields/connect-field";
import OrganizerField from "~/components/base/material-loader/fields/organizer-field";
import AudioField from "~/components/base/material-loader/fields/audio-field";
import JournalField from "~/components/base/material-loader/fields/journal-field";
import SorterField from "~/components/base/material-loader/fields/sorter-field";
import MathField from "~/components/base/material-loader/fields/math-field"; */

/**
 * FieldProcessor - Handles field element creation
 * Extracted from Base component's getObjectElement method
 */
export class FieldProcessor {
  // Field registry - maps field types to components
  private static readonly objects: Record<string, any> = {
    "application/vnd.muikku.field.text": <>TextField</>,
    "application/vnd.muikku.field.select": <>SelectField</>,
    "application/vnd.muikku.field.multiselect": <>MultiSelectField</>,
    "application/vnd.muikku.field.memo": <>MemoField</>,
    "application/vnd.muikku.field.file": <>FileField</>,
    "application/vnd.muikku.field.connect": <>ConnectField</>,
    "application/vnd.muikku.field.organizer": <>OrganizerField</>,
    "application/vnd.muikku.field.audio": <>AudioField</>,
    "application/vnd.muikku.field.sorter": <>SorterField</>,
    "application/vnd.muikku.field.mathexercise": <>MathField</>,
    "application/vnd.muikku.field.journal": <>JournalField</>,
  };

  // Answer checkable registry - determines if fields can check answers
  private static readonly answerCheckables: Record<
    string,
    (params: any) => boolean
  > = {
    "application/vnd.muikku.field.text": (params) =>
      params.content &&
      params.content.rightAnswers.filter(
        (option: { correct: any }) => option.correct
      ).length > 0,
    "application/vnd.muikku.field.select": (params) =>
      params.content &&
      params.content.options.filter(
        (option: { correct: any }) => option.correct
      ).length > 0,
    "application/vnd.muikku.field.multiselect": (params) =>
      params.content &&
      params.content.options.filter(
        (option: { correct: any }) => option.correct
      ).length > 0,
    "application/vnd.muikku.field.connect": () => true,
    "application/vnd.muikku.field.organizer": () => true,
    "application/vnd.muikku.field.sorter": () => true,
  };

  /**
   * Create field element from HTML object element
   * Extracted from Base component's getObjectElement method
   */
  static createFieldElement(
    element: HTMLElement,
    context: ProcessingRuleContext,
    key?: number
  ): React.ReactElement {
    const fieldType = element.getAttribute("type") ?? "";
    const FieldComponent = this.objects[fieldType];

    // This is here in case we get some brand new stuff, it should never come here
    if (!FieldComponent) {
      return (
        <span key={key}>
          Invalid Element {fieldType} {element.innerHTML}
        </span>
      );
    }

    const commonProps = extractCommonFieldProps(element, context, key);

    // Extract field-specific initial value
    const initialValue = extractFieldInitialValue(
      commonProps.content,
      context.compositeReplies
    );

    commonProps.initialValue = initialValue;
    commonProps.onChange = context.onValueChange.bind(context);

    return <FieldComponent key={key} {...commonProps} />;
  }

  /**
   * Check if a field type can check answers
   */
  static canCheckAnswers(fieldType: string, parameters: any): boolean {
    const checker = this.answerCheckables[fieldType];
    return checker ? checker(parameters) : false;
  }

  /**
   * Get all registered field types
   */
  static getRegisteredFieldTypes(): string[] {
    return Object.keys(this.objects);
  }
}

/**
 * Extract common props that are the same for all field components
 * @param element HTML element containing field data
 * @param props Base props from MaterialLoader
 * @param key React key
 * @returns Object with common props for field components
 */
export function extractCommonFieldProps(
  element: HTMLElement,
  context: ProcessingRuleContext,
  key?: number
) {
  // Extract parameters from <param> elements
  const parameters: Record<string, any> = {};

  element.querySelectorAll("param").forEach((node) => {
    parameters[node.getAttribute("name") ?? ""] = node.getAttribute("value");
  });

  // Handle JSON content parsing
  if (parameters["type"] === "application/json") {
    try {
      parameters["content"] =
        parameters["content"] && JSON.parse(parameters["content"]);
    } catch (e) {
      // Keep original content if parsing fails
    }
  }

  // Set defaults
  parameters["type"] ??= "application/json";
  parameters["content"] ??= null;

  // Add common props from MaterialLoader
  const commonProps: CommonFieldProps = {
    // Field parameters
    type: parameters["type"],
    content: parameters["content"],

    // MaterialLoader props
    status: null,
    readOnly: context.readOnly,
    usedAs: context.usedAs,
    displayCorrectAnswers: context.displayCorrectAnswers,
    checkAnswers: context.checkAnswers,
    onAnswerChange: context.onAnswerChange,
    invisible: context.invisible,
    userId: 0,

    // React key
    key: key,
  };

  return commonProps;
}

/**
 * Extract field-specific initial value from composite replies
 * @param content Field content object
 * @param compositeReplies Composite replies from props
 * @returns Initial value for the field
 */
export function extractFieldInitialValue(content: any, compositeReplies: any) {
  if (!compositeReplies?.answers || !content?.name) {
    return null;
  }

  const answer = compositeReplies.answers.find(
    (answer: any) => answer.fieldName === content.name
  );

  if (!answer) {
    return null;
  }

  // Handle .value field if it exists
  return typeof answer.value !== "undefined" ? answer.value : answer;
}
