/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  ConnectFieldContent,
  FieldComponentProps,
} from "../../core/types";

/**
 * TextFieldProps
 */
interface ConnectFieldProps extends FieldComponentProps<ConnectFieldContent> {}

export const ConnectField: React.FC<ConnectFieldProps> = (props) => {
  const { content, ...rest } = props;

  return <div>ConnectField</div>;
};
