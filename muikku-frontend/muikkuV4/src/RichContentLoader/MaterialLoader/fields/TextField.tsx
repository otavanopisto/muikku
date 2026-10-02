import type {
  FieldComponentProps,
  TextFieldContent,
} from "../../coreMaterial/types";

/**
 * TextFieldProps
 */
interface TextFieldProps extends FieldComponentProps<TextFieldContent> {}

/**
 * TextField component
 * @param props - The props for the TextField component
 * @returns The TextField component
 */
export function MaterialTextField(props: TextFieldProps) {
  return <div>{props.content?.name}</div>;
}
