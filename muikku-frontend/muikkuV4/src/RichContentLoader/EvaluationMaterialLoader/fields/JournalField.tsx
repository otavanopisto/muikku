import type {
  FieldComponentProps,
  JournalFieldContent,
} from "../../coreMaterial/types";
import { JournalReadonly } from "../../coreMaterial/fields/JournalField/JournalReadonly";
import classes from "../../coreMaterial/fields/JournalField/JournalField.module.css";

/**
 * JournalFieldProps
 */
interface JournalFieldProps extends FieldComponentProps<JournalFieldContent> {}

/**
 * Evaluation journal field: HTML view only.
 * @param props - Live field props
 */
export function EvaluationJournalField(props: JournalFieldProps) {
  const { content, initialValue, invisible } = props;
  const value = initialValue ?? "";

  if (!content) {
    return null;
  }

  if (invisible) {
    return (
      <span className={classes.wrapper} aria-hidden>
        <JournalReadonly value="" />
      </span>
    );
  }

  return (
    <span className={classes.wrapper}>
      <JournalReadonly value={value} />
    </span>
  );
}
