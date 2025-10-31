/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FieldComponentProps, SelectFieldContent } from "../../core/types";

/**
 * SelectFieldProps
 */
interface SelectFieldProps extends FieldComponentProps<SelectFieldContent> {}

/**
 * SelectField component
 * @param props - The props for the SelectField component
 * @returns The SelectField component
 */
export function SelectField(props: SelectFieldProps) {
  return <div>{props.content?.name}</div>;
}
