/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  FieldComponentProps,
  OrganizerFieldContent,
} from "../../core/types";

/**
 * TextFieldProps
 */
interface OrganizerFieldProps
  extends FieldComponentProps<OrganizerFieldContent> {}

export const OrganizerField: React.FC<OrganizerFieldProps> = (props) => {
  const { content, ...rest } = props;

  return <div>OrganizerField</div>;
};
