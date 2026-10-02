import type { FieldComponentProps, SelectFieldContent } from "../types";

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
