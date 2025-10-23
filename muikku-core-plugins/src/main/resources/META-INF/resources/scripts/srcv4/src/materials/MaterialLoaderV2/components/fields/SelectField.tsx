/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FieldComponentProps, SelectFieldContent } from "../../core/types";

/**
 * TextFieldProps
 */
interface SelectFieldProps extends FieldComponentProps<SelectFieldContent> {}

export const SelectField: React.FC<SelectFieldProps> = (props) => {
  const { content, ...rest } = props;

  return <div>SelectField</div>;
};
