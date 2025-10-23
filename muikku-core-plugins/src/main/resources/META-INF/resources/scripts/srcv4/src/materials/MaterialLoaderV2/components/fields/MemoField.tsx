/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FieldComponentProps, MemoFieldContent } from "../../core/types";

/**
 * TextFieldProps
 */
interface MemoFieldProps extends FieldComponentProps<MemoFieldContent> {}

export const MemoField: React.FC<MemoFieldProps> = (props) => {
  const { content, ...rest } = props;

  return <div>MemoField</div>;
};
