/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  FieldComponentProps,
  MultiSelectFieldContent,
} from "../../core/types";

/**
 * TextFieldProps
 */
interface MultiSelectFieldProps
  extends FieldComponentProps<MultiSelectFieldContent> {}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = (props) => {
  const { content, ...rest } = props;

  return <div>MultiSelectField</div>;
};
