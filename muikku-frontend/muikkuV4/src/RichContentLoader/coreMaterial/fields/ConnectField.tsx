import type { ConnectFieldContent, FieldComponentProps } from "../types";

/**
 * ConnectFieldProps
 */
interface ConnectFieldProps extends FieldComponentProps<ConnectFieldContent> {}

/**
 * ConnectField component
 * @param props - The props for the ConnectField component
 * @returns The ConnectField component
 */
export function ConnectField(props: ConnectFieldProps) {
  return <div>{props.content?.name}</div>;
}
