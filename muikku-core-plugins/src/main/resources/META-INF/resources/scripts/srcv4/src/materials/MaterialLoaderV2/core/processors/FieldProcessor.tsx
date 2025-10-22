/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/dot-notation */
// srcv4/src/materials/MaterialLoaderV2/core/processors/FieldProcessor.ts

import * as React from "react";
import type { ProcessingRuleContext } from "../types";

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
    const fieldType = element.getAttribute("type");
    const ActualElement = this.objects[fieldType ?? ""];

    // This is here in case we get some brand new stuff, it should never come here
    if (!ActualElement) {
      return (
        <span key={key}>
          Invalid Element {fieldType} {element.innerHTML}
        </span>
      );
    }

    // Extract parameters from element
    const parameters: Record<string, any> = {};
    element.querySelectorAll("param").forEach((node) => {
      if (parameters[node.getAttribute("name") ?? ""]) {
        parameters[node.getAttribute("name") ?? ""] =
          node.getAttribute("value");
      }
    });

    // Parse JSON content
    if (parameters["type"] === "application/json") {
      try {
        parameters["content"] =
          parameters["content"] && JSON.parse(parameters["content"]);
      } catch (e) {
        // Handle parse error silently
      }
    }

    if (!parameters["type"]) {
      parameters["type"] = "application/json";
    }

    if (!parameters["content"]) {
      parameters["content"] = null;
    }

    // Add context parameters
    parameters["status"] = context.status;
    parameters["readOnly"] = context.readOnly;
    parameters["usedAs"] = context.usedAs;
    parameters["onChange"] = context.onValueChange;
    parameters["displayCorrectAnswers"] = context.displayCorrectAnswers;
    parameters["checkAnswers"] = context.checkAnswers;
    parameters["onAnswerChange"] = context.onAnswerChange;
    parameters["invisible"] = context.invisible;
    parameters["userId"] = context.status.userId;

    // Set initial value from composite replies
    parameters["initialValue"] = null;
    if (context.compositeReplies?.answers) {
      parameters["initialValue"] = context.compositeReplies.answers.find(
        (answer) => answer.fieldName === parameters.content?.name
      );
    }

    // Handle value field extraction
    if (
      parameters["initialValue"] &&
      typeof parameters["initialValue"].value !== "undefined"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      parameters["initialValue"] = parameters["initialValue"].value;
    }

    return <ActualElement key={key} {...parameters} />;
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
