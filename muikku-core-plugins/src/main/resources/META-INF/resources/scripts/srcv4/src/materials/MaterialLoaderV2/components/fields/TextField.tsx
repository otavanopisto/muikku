/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FieldComponentProps, TextFieldContent } from "../../core/types";

/**
 * TextFieldProps
 */
interface TextFieldProps extends FieldComponentProps<TextFieldContent> {}

export const TextField = (props: TextFieldProps) => {
  const { content, ...rest } = props;

  return <div>TextField</div>;
};
