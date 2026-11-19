/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import { toMemoDisplayHtml } from "../../utils/memoField";
import classes from "./JournalField.module.css";

/**
 * Read-only journal HTML. Uses the shared stored-html helper (html or escaped plain).
 */
export function JournalReadonly(props: { value: string }) {
  return (
    <div
      className={classes.readonly}
      dangerouslySetInnerHTML={{ __html: toMemoDisplayHtml(props.value) }}
    />
  );
}
