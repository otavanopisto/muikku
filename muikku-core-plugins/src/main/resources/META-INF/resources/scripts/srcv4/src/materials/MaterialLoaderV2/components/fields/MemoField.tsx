/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { FieldComponentProps, MemoFieldContent } from "../../core/types";

/**
 * MemoFieldProps
 */
interface MemoFieldProps extends FieldComponentProps<MemoFieldContent> {}

/**
 * MemoField component
 * @param props - The props for the MemoField component
 * @returns The MemoField component
 */
export function MemoField(props: MemoFieldProps) {
  return <div>{props.content?.name}</div>;
}
