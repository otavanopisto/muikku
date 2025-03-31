import {
  InputTextView,
  SwitchButtonView,
  ButtonView,
  ViewNode,
  ViewElement,
} from "ckeditor5";

// OTHER GENERAL TYPES and FUNCTIONS
/**
 * Type guard function for param elements
 * @param node - The node to check
 * @returns True if the node is a param element, false otherwise
 */
export function isParamElement(node: ViewNode): node is ViewElement {
  return node.is("element", "param");
}

// TEXTFIELD PLUGIN TYPES

/**
 * Interface for answer choice
 */
export interface TextFieldAnswerRow {
  input: InputTextView;
  correctSwitch: SwitchButtonView;
  deleteButton: ButtonView;
  element: HTMLDivElement;
}

/**
 * Interface for answer choice
 */
export interface TextFieldAnswerChoice {
  text: string;
  isCorrect: boolean;
}

/**
 * Interface defining the data structure for the TextField form for CKEditor 5 plugin
 */
export interface TextFieldFormData {
  name?: string;
  width?: string;
  autoGrow?: boolean;
  hint?: string;
  answerChoices?: TextFieldAnswerChoice[];
}

/**
 * Interface for the content of the text field, that is saved in the data-field-content attribute
 */
export interface TextFieldDataContent {
  autogrow: boolean;
  columns: string;
  hint: string;
  name: string;
  rightAnswers: TextFieldRightAnswer[];
}

/**
 * Interface for the right answer of the text field
 */
export interface TextFieldRightAnswer {
  caseSensitive: boolean;
  correct: boolean;
  normalizeWhitespace: boolean;
  text: string;
}

// ORGANIZER PLUGIN TYPES

/**
 * Interface for the data of the organizer field
 */
export interface OrganizerFieldData {
  name?: string;
  termTitle: string;
  categories: OrganizerCategory[];
}

/**
 * Interface for the category of the organizer field
 */
export interface OrganizerCategory {
  id: string;
  name: string;
  terms: OrganizerTerm[];
}

/**
 * Interface for the term of the organizer field
 */
export interface OrganizerTerm {
  id: string;
  text: string;
}

/**
 * Interface for the form data of the organizer field
 */
export interface OrganizerFormData {
  termTitle: string;
  categories: OrganizerCategory[];
  terms: OrganizerTerm[];
}

/**
 * Interface for the content of the organizer field
 */
export interface OrganizerFieldDataContent {
  name: string;
  termTitle: string;
  terms: Array<{
    id: string;
    name: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
  }>;
  categoryTerms: Array<{
    category: string;
    terms: Array<string>;
  }>;
}
