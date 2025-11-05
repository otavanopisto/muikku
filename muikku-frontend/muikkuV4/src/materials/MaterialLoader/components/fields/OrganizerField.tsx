/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  FieldComponentProps,
  OrganizerFieldContent,
} from "../../core/types";

/**
 * OrganizerFieldProps
 */
interface OrganizerFieldProps
  extends FieldComponentProps<OrganizerFieldContent> {}

/**
 * OrganizerField component
 * @param props - The props for the OrganizerField component
 * @returns The OrganizerField component
 */
export function OrganizerField(props: OrganizerFieldProps) {
  return <div>{props.content?.name}</div>;
}
