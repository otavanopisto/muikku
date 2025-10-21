/* eslint-disable react-refresh/only-export-components */
// srcv4/src/materials/MaterialLoader/components/MaterialFields.tsx
import * as React from "react";
import {
  type FieldRegistry,
  InMemoryFieldRegistry,
  type FieldComponent,
  FieldFactory,
} from "../core/processors/FieldProcessor";

/**
 * MaterialFieldsContextValue
 */
interface MaterialFieldsContextValue {
  registry: FieldRegistry;
  factory: FieldFactory;
}

const MaterialFieldsContext =
  React.createContext<MaterialFieldsContextValue | null>(null);

/**
 *
 */
export interface MaterialFieldsProviderProps {
  initial?: Record<string, FieldComponent>;
  readOnly?: boolean;
  onValueChange?: (name: string, value: any) => void;
  children: React.ReactNode;
}

/**
 * MaterialFieldsProvider
 * @param param0
 * @returns
 */
export function MaterialFieldsProvider({
  initial,
  readOnly,
  onValueChange,
  children,
}: MaterialFieldsProviderProps) {
  const registry = React.useMemo(
    () => new InMemoryFieldRegistry(initial),
    [initial]
  );
  const factory = React.useMemo(
    () => new FieldFactory({ registry, readOnly, onValueChange }),
    [registry, readOnly, onValueChange]
  );
  const value = React.useMemo(
    () => ({ registry, factory }),
    [registry, factory]
  );

  return (
    <MaterialFieldsContext value={value}>{children}</MaterialFieldsContext>
  );
}

/**
 * useMaterialFields
 * @returns
 */
export function useMaterialFields() {
  const ctx = React.use(MaterialFieldsContext);
  if (!ctx)
    throw new Error(
      "useMaterialFields must be used within MaterialFieldsProvider"
    );
  return ctx;
}

/**
 * useRegisterField
 */
export function useRegisterField() {
  const { registry } = useMaterialFields();
  return React.useCallback(
    (type: string, comp: FieldComponent) => registry.register(type, comp),
    [registry]
  );
}

/**
 * useCreateField
 */
export function useCreateField() {
  const { factory } = useMaterialFields();
  return React.useCallback(
    (type: string | null, params: Record<string, any>, key?: React.Key) =>
      factory.createField(type, params, key),
    [factory]
  );
}
