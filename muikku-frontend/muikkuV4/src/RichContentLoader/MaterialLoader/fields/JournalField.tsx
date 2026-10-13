import type {
  FieldComponentProps,
  JournalFieldContent,
} from "../../coreMaterial/types";

/**
 * JournalFieldProps
 */
interface JournalFieldProps extends FieldComponentProps<JournalFieldContent> {}

/**
 * JournalField component
 * @param props - The props for the JournalField component
 * @returns The JournalField component
 */
export function MaterialJournalField(props: JournalFieldProps) {
  return <div>{props.content?.name}</div>;
}
