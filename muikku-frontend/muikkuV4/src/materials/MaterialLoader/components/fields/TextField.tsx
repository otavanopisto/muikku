/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FieldComponentProps, TextFieldContent } from "../../core/types";

/**
 * TextFieldProps
 */
interface TextFieldProps extends FieldComponentProps<TextFieldContent> {}

/**
 * TextField component
 * @param props - The props for the TextField component
 * @returns The TextField component
 */
export function TextField(props: TextFieldProps) {
  return <div>{props.content?.name}</div>;
}
