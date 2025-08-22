/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { FieldContext, FieldData, DataProvider } from "../types";

/**
 * Hook for managing field state and lifecycle
 * Replaces the FieldManager class with React hooks
 * @param dataProvider data provider
 * @param onFieldChange on field change
 * @returns FieldManager
 */
export function useFieldManager(
  dataProvider: DataProvider,
  onFieldChange: (fieldName: string, value: any) => void
) {
  // Field state
  const [fieldValues, setFieldValues] = useState(new Map<string, any>());
  const [fieldErrors, setFieldErrors] = useState(new Map<string, string>());
  const [fieldStates, setFieldStates] = useState(
    new Map<string, FieldContext>()
  );

  // Computed values - use useMemo
  const fields = useMemo(
    (): FieldData[] =>
      Array.from(fieldValues.entries()).map(([name, value]) => ({
        name,
        type: "text", // This should come from dataProvider or be computed
        content: value,
        required: false, // This should come from dataProvider or be computed
      })),
    [fieldValues]
  );

  // Computed values - use useMemo
  const hasFieldErrors = useMemo(
    (): boolean => fieldErrors.size > 0,
    [fieldErrors]
  );

  // Computed values - use useMemo
  const totalFields = useMemo((): number => fieldValues.size, [fieldValues]);

  // Computed values - use useMemo
  const modifiedFields = useMemo(
    (): string[] =>
      Array.from(fieldStates.entries())
        .filter(([_, state]) => state.modified)
        .map(([name]) => name),
    [fieldStates]
  );

  // Computed values - use useMemo
  const syncedFields = useMemo(
    (): string[] =>
      Array.from(fieldStates.entries())
        .filter(([_, state]) => state.synced)
        .map(([name]) => name),
    [fieldStates]
  );

  /**
   * Handle field change
   * @param fieldName field name
   * @param value value
   */
  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      unstable_batchedUpdates(() => {
        setFieldValues((prev) => new Map(prev).set(fieldName, value));

        //Update field state
        setFieldStates((prev) => {
          const newMap = new Map(prev);
          newMap.set(fieldName, {
            name: fieldName,
            value,
            modified: true,
            synced: false,
            syncError: undefined,
            // eslint-disable-next-line jsdoc/require-jsdoc
            setState: (state: Partial<FieldContext>) => {
              setFieldStates((current) => {
                const currentMap = new Map(current);
                const currentState = currentMap.get(fieldName);
                if (currentState) {
                  currentMap.set(fieldName, { ...currentState, ...state });
                }
                return currentMap;
              });
            },
          });
          return newMap;
        });
      });

      // Call parent callback
      onFieldChange(fieldName, value);
    },
    [onFieldChange]
  );

  /**
   * Mark field synced
   * @param fieldName field name
   */
  const markFieldSynced = useCallback((fieldName: string) => {
    // setFieldStates((prev) => {
    //   const newMap = new Map(prev);
    //   const field = newMap.get(fieldName);
    //   if (field) {
    //     newMap.set(fieldName, {
    //       ...field,
    //       synced: true,
    //       syncError: undefined,
    //     });
    //   }
    //   return newMap;
    // });
  }, []);

  /**
   * Mark field error
   * @param fieldName field name
   * @param error error
   */
  const markFieldError = useCallback((fieldName: string, error: string) => {
    // setFieldStates((prev) => {
    //   const newMap = new Map(prev);
    //   const field = newMap.get(fieldName);
    //   if (field) {
    //     newMap.set(fieldName, {
    //       ...field,
    //       synced: false,
    //       syncError: error,
    //     });
    //   }
    //   return newMap;
    // });
  }, []);

  /**
   * Reset field
   * @param fieldName field name
   */
  const resetField = useCallback((fieldName: string) => {
    // setFieldValues((prev) => {
    //   const newMap = new Map(prev);
    //   newMap.delete(fieldName);
    //   return newMap;
    // });
    // setFieldErrors((prev) => {
    //   const newMap = new Map(prev);
    //   newMap.delete(fieldName);
    //   return newMap;
    // });
    // setFieldStates((prev) => {
    //   const newMap = new Map(prev);
    //   newMap.delete(fieldName);
    //   return newMap;
    // });
  }, []);

  /**
   * Reset all fields
   */
  const resetAllFields = useCallback(() => {
    // setFieldValues(new Map());
    // setFieldErrors(new Map());
    // setFieldStates(new Map());
  }, []);

  /**
   * Get field value
   * @param fieldName field name
   * @returns field value
   */
  const getFieldValue = useCallback(
    (fieldName: string): any => fieldValues.get(fieldName),
    [fieldValues]
  );

  /**
   * Get field error
   * @param fieldName field name
   * @returns field error
   */
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => fieldErrors.get(fieldName),
    [fieldErrors]
  );

  /**
   * Check if field has error
   */
  const hasFieldError = useCallback(
    (fieldName: string): boolean => fieldErrors.has(fieldName),
    [fieldErrors]
  );

  /**
   * Get field validation state
   * @param fieldName field name
   * @returns field validation state
   */
  const getFieldValidationState = useCallback(
    (fieldName: string): "valid" | "invalid" | "pending" => {
      if (fieldErrors.has(fieldName)) return "invalid";
      if (fieldStates.get(fieldName)?.modified) return "pending";
      return "valid";
    },
    [fieldErrors, fieldStates]
  );

  return React.useMemo(
    () => ({
      // Computed values (no function calls needed)
      fields,
      hasFieldErrors,
      totalFields,
      modifiedFields,
      syncedFields,

      // Methods (only where needed)
      handleFieldChange,
      markFieldSynced,
      markFieldError,
      resetField,
      resetAllFields,
      getFieldValue,
      getFieldError,
      hasFieldError,
      getFieldValidationState,
    }),
    [
      fields,
      hasFieldErrors,
      totalFields,
      modifiedFields,
      syncedFields,
      handleFieldChange,
      markFieldSynced,
      markFieldError,
      resetField,
      resetAllFields,
      getFieldValue,
      getFieldError,
      hasFieldError,
      getFieldValidationState,
    ]
  );
}
