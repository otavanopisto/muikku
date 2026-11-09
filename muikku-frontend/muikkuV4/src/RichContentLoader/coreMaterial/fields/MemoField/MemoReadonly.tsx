/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import { toMemoDisplayHtml } from "../../utils/memoField";
import classes from "./MemoField.module.css";

/**
 * Read-only memo HTML (plain text is escaped + br).
 * @param props - Stored value
 */
export function MemoReadonly(props: { value: string }) {
  return (
    <div
      className={classes.readonly}
      dangerouslySetInnerHTML={{ __html: toMemoDisplayHtml(props.value) }}
    />
  );
}
