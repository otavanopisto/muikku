/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsedAs } from "~/@types/shared";

/**
 * CKEditor 4 parser that handles all field types
 */
export interface FieldDataParser {
  /**
   * Parse field data from a CKEditor 4 element
   * @param element - The CKEditor 4 element to parse
   * @returns The parsed field data
   */
  parseFieldData(element: HTMLElement): FieldData;
}

/**
 * Base interface for all field data
 */
export interface FieldData {
  type: string;
  content: any;
  parameters: Record<string, any>;
}

/**
 * Base interface for all field data
 */
export interface BaseFieldData {
  type: string;
  name: string;
  readOnly?: boolean;
  initialValue?: any;
  usedAs: UsedAs;
  displayCorrectAnswers?: boolean;
  checkAnswers?: boolean;
  invisible?: boolean;
  content: any;
  onAnswerChange?: (name: string, value: boolean) => void;
  onChange?: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => void;
}

/**
 * TextField specific interfaces
 */
export interface TextFieldContent {
  autogrow: boolean;
  columns: string;
  hint?: string;
  name: string;
  rightAnswers: Array<{
    caseSensitive: boolean;
    correct: boolean;
    normalizeWhitespace: boolean;
    text: string;
  }>;
}

/**
 * TextField specific data
 */
export interface TextFieldData extends BaseFieldData {
  content: TextFieldContent;
}

/**
 * Type guard for TextField
 * @param field - The field data to check
 * @returns True if the field is a TextField, false otherwise
 */
export function isTextFieldData(field: BaseFieldData): field is TextFieldData {
  return field.type === "application/vnd.muikku.field.text";
}
