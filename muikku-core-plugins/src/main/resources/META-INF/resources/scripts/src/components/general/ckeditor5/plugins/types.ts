import {
  InputTextView,
  SwitchButtonView,
  ButtonView,
  ViewNode,
  ViewElement,
  ViewCollection,
  LabeledFieldView,
  View,
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
  categoryTerms: OrganizerCategoryTerm[];
  terms: OrganizerTerm[];
  categories: OrganizerCategory[];
}

/**
 * Interface for the category of the organizer field
 */
export interface OrganizerCategory {
  id: string;
  name: string;
}

/**
 * Interface for the term of the organizer field
 */
export interface OrganizerTerm {
  id: string;
  name: string;
}

/**
 * Interface for the category term of the organizer field
 */
export interface OrganizerCategoryTerm {
  /**
   * The id of the category
   */
  category: string;
  /**
   * The ids of the terms
   */
  terms: string[];
}

/**
 * Interface for the form data of the organizer field
 */
export interface OrganizerFormData {
  termTitle: string;
  categories: OrganizerCategory[];
  terms: OrganizerTerm[];
  categoryTerms: OrganizerCategoryTerm[];
}

/**
 * Interface for the category data of the organizer field
 */
export interface OrganizerFormCategoryData {
  id: string;
  view: View;
  nameInput: LabeledFieldView<InputTextView>;
  termsCollection: ViewCollection;
}

/**
 * Interface for the term data of the organizer field
 */
export interface OrganizerForTermmData {
  id: string;
  text: string;
  categoryId: string;
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

// CONNECTFIELD PLUGIN TYPES

/**
 * Interface for connection between fields
 */
export interface Connection {
  /**
   * The name a.k.a id of the counterpart field
   */
  counterpart: string;
  /**
   * The name a.k.a id of the field
   */
  field: string;
}

/**
 * Interface for connected field
 */
export interface ConnectedField {
  /**
   * The name a.k.a id of the connected field
   */
  name: string;
  /**
   * The text value of the connected field
   */
  text: string;
}

/**
 * Interface for the content of the connect field
 */
export interface ConnectFieldDataContent {
  name: string;
  /**
   * The fields of the connect field
   */
  fields: ConnectedField[];
  /**
   * The counterparts of the connect field
   */
  counterparts: ConnectedField[];
  /**
   * The connections of the connect field
   */
  connections: Connection[];
}

/**
 * Interface for the form data of the connect field
 */
export interface ConnectFieldFormData {
  connections: Connection[];
  fields: ConnectedField[];
  counterparts: ConnectedField[];
}

/**
 * Interface for the pair of the connect field
 */
export interface ConnectFieldPairData {
  id: string;
  view: View;
  fieldInput: LabeledFieldView<InputTextView>;
  counterpartInput: LabeledFieldView<InputTextView>;
  fieldId: string;
  counterpartId: string;
}

/**
 * The options for the add pair method
 */
export interface ConnectFieldAddPairOptions {
  fieldId?: string;
  counterpartId?: string;
  fieldText?: string;
  counterpartText?: string;
}
