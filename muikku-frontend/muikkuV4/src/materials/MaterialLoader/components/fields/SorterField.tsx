/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FieldComponentProps, SorterFieldContent } from "../../core/types";

/**
 * SorterFieldProps
 */
interface SorterFieldProps extends FieldComponentProps<SorterFieldContent> {}

/**
 * SorterField component
 * @param props - The props for the SorterField component
 * @returns The SorterField component
 */
export function SorterField(props: SorterFieldProps) {
  return <div>{props.content?.name}</div>;
}
