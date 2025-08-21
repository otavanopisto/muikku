/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldContext, FieldData, AnswerData, DataProvider } from "../types";

/**
 * FieldManager handles field lifecycle, state, and validation
 * Replaces the complex field management from the current Base component
 */
export class FieldManager {
  private fields = new Map<string, FieldContext>();
  private dataProvider: DataProvider;
  private onFieldChange: (fieldName: string, value: any) => void;

  constructor(
    dataProvider: DataProvider,
    onFieldChange: (fieldName: string, value: any) => void
  ) {
    this.dataProvider = dataProvider;
    this.onFieldChange = onFieldChange;
    this.initializeFields();
  }

  /**
   * Initialize fields from data provider
   */
  private initializeFields(): void {
    this.dataProvider.fields.forEach((field) => {
      const existingAnswer = this.dataProvider.answers.find(
        (answer) => answer.fieldName === field.name
      );

      this.fields.set(field.name, {
        name: field.name,
        value: existingAnswer?.value ?? null,
        modified: false,
        synced: true,
        syncError: undefined,
        setState: (state: Partial<FieldContext>) => {
          const currentField = this.fields.get(field.name);
          if (currentField) {
            this.fields.set(field.name, { ...currentField, ...state });
          }
        },
      });
    });
  }

  /**
   * Get all fields
   */
  getFields(): FieldData[] {
    return this.dataProvider.fields;
  }

  /**
   * Get field by name
   * @param name field name
   * @returns field data
   */
  getField(name: string): FieldData | undefined {
    return this.dataProvider.fields.find((field) => field.name === name);
  }

  /**
   * Get field context by name
   * @param name field name
   * @returns field context
   */
  getFieldContext(name: string): FieldContext | undefined {
    return this.fields.get(name);
  }

  /**
   * Get field value
   * @param name field name
   * @returns field value
   */
  getFieldValue(name: string): any {
    const context = this.fields.get(name);
    return context?.value ?? null;
  }

  /**
   * Check if field is modified
   * @param name field name
   * @returns true if field is modified
   */
  isFieldModified(name: string): boolean {
    const context = this.fields.get(name);
    return context?.modified ?? false;
  }

  /**
   * Check if field is synced
   * @param name field name
   * @returns true if field is synced
   */
  isFieldSynced(name: string): boolean {
    const context = this.fields.get(name);
    return context?.synced ?? true;
  }

  /**
   * Check if field has sync error
   * @param name field name
   * @returns true if field has sync error
   */
  hasFieldError(name: string): boolean {
    const context = this.fields.get(name);
    return !!context?.syncError;
  }

  /**
   * Get field sync error
   * @param name field name
   * @returns field sync error
   */
  getFieldError(name: string): string | undefined {
    const context = this.fields.get(name);
    return context?.syncError;
  }

  /**
   * Handle field value change
   * @param name field name
   * @param value field value
   */
  handleFieldChange(name: string, value: any): void {
    const context = this.fields.get(name);
    if (!context) return;

    // Update field context
    context.setState({
      value,
      modified: true,
      synced: false,
      syncError: undefined,
    });

    // Notify parent of change
    this.onFieldChange(name, value);
  }

  /**
   * Mark field as synced
   * @param name field name
   */
  markFieldSynced(name: string): void {
    const context = this.fields.get(name);
    if (context) {
      context.setState({
        synced: true,
        syncError: undefined,
      });
    }
  }

  /**
   * Mark field as sync error
   * @param name field name
   * @param error field error
   */
  markFieldError(name: string, error: string): void {
    const context = this.fields.get(name);
    if (context) {
      context.setState({
        synced: false,
        syncError: error,
      });
    }
  }

  /**
   * Reset field to initial state
   * @param name field name
   */
  resetField(name: string): void {
    const existingAnswer = this.dataProvider.answers.find(
      (answer) => answer.fieldName === name
    );

    const context = this.fields.get(name);
    if (context) {
      context.setState({
        value: existingAnswer?.value ?? null,
        modified: false,
        synced: true,
        syncError: undefined,
      });
    }
  }

  /**
   * Reset all fields
   */
  resetAllFields(): void {
    this.fields.forEach((_, name) => {
      this.resetField(name);
    });
  }

  /**
   * Get all modified fields
   */
  getModifiedFields(): string[] {
    return Array.from(this.fields.entries())
      .filter(([_, context]) => context.modified)
      .map(([name]) => name);
  }

  /**
   * Get all unsynced fields
   */
  getUnsyncedFields(): string[] {
    return Array.from(this.fields.entries())
      .filter(([_, context]) => !context.synced)
      .map(([name]) => name);
  }

  /**
   * Get all fields with errors
   */
  getFieldsWithErrors(): string[] {
    return Array.from(this.fields.entries())
      .filter(([_, context]) => !!context.syncError)
      .map(([name]) => name);
  }

  /**
   * Check if any fields are modified
   */
  hasModifiedFields(): boolean {
    return this.getModifiedFields().length > 0;
  }

  /**
   * Check if any fields are unsynced
   */
  hasUnsyncedFields(): boolean {
    return this.getUnsyncedFields().length > 0;
  }

  /**
   * Check if any fields have errors
   */
  hasFieldErrors(): boolean {
    return this.getFieldsWithErrors().length > 0;
  }

  /**
   * Get field validation state
   * @param name field name
   * @returns field validation state
   */
  getFieldValidationState(name: string): "valid" | "invalid" | "pending" {
    const context = this.fields.get(name);
    if (!context) return "valid";

    if (context.syncError) return "invalid";
    if (!context.synced) return "pending";
    return "valid";
  }

  /**
   * Get all answers for submission
   */
  getAnswersForSubmission(): AnswerData[] {
    return Array.from(this.fields.entries())
      .filter(([_, context]) => context.modified)
      .map(([name, context]) => ({
        fieldName: name,
        value: context.value,
        timestamp: new Date(),
      }));
  }

  /**
   * Update field from external source (e.g., websocket)
   * @param name field name
   * @param value field value
   */
  updateFieldFromExternal(name: string, value: any): void {
    const context = this.fields.get(name);
    if (context) {
      context.setState({
        value,
        modified: false,
        synced: true,
        syncError: undefined,
      });
    }
  }
}

/**
 * Hook for using FieldManager in React components
 * @param dataProvider data provider
 * @param onFieldChange on field change
 * @returns FieldManager
 */
export function useFieldManager(
  dataProvider: DataProvider,
  onFieldChange: (fieldName: string, value: any) => void
): FieldManager {
  return new FieldManager(dataProvider, onFieldChange);
}
