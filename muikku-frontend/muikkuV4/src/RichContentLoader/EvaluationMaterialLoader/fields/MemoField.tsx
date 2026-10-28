import type {
  FieldComponentProps,
  MemoFieldContent,
} from "../../coreMaterial/types";

/**
 * MemoFieldProps
 */
interface MemoFieldProps extends FieldComponentProps<MemoFieldContent> {}

/**
 * MemoField component
 * @param props - The props for the MemoField component
 * @returns The MemoField component
 */
export function EvaluationMemoField(props: MemoFieldProps) {
  return <div>{props.content?.name}</div>;
}
