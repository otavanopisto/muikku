/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  FieldComponentProps,
  MultiSelectFieldContent,
} from "../../core/types";

/**
 * MultiSelectFieldProps
 */
interface MultiSelectFieldProps
  extends FieldComponentProps<MultiSelectFieldContent> {}

/**
 * MultiSelectField component
 * @param props - The props for the MultiSelectField component
 * @returns The MultiSelectField component
 */
export function MultiSelectField(props: MultiSelectFieldProps) {
  return <div>{props.content?.name}</div>;
}
