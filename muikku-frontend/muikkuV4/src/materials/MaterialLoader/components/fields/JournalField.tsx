/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  FieldComponentProps,
  JournalFieldContent,
} from "../../core/types";

/**
 * JournalFieldProps
 */
interface JournalFieldProps extends FieldComponentProps<JournalFieldContent> {}

/**
 * JournalField component
 * @param props - The props for the JournalField component
 * @returns The JournalField component
 */
export function JournalField(props: JournalFieldProps) {
  return <div>{props.content?.name}</div>;
}
