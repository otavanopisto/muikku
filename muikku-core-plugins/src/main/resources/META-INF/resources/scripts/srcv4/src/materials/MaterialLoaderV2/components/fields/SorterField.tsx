/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FieldComponentProps, SorterFieldContent } from "../../core/types";

/**
 * TextFieldProps
 */
interface SorterFieldProps extends FieldComponentProps<SorterFieldContent> {}

export const SorterField: React.FC<SorterFieldProps> = (props) => {
  const { content, ...rest } = props;

  return <div>SorterField</div>;
};
