/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  FieldComponentProps,
  JournalFieldContent,
} from "../../core/types";

/**
 * TextFieldProps
 */
interface JournalFieldProps extends FieldComponentProps<JournalFieldContent> {}

export const JournalField: React.FC<JournalFieldProps> = (props) => {
  const { content, ...rest } = props;

  return <div>JournalField</div>;
};
