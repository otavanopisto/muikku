import type {
  FieldComponentProps,
  MemoFieldContent,
} from "../../coreMaterial/types";
import { MemoCounters } from "../../coreMaterial/fields/MemoField/MemoCounters";
import { MemoAnswerExample } from "../../coreMaterial/fields/MemoField/MemoAnswerExample";
import { MemoReadonly } from "../../coreMaterial/fields/MemoField/MemoReadonly";
import { MemoSnapshots } from "../../coreMaterial/fields/MemoField/MemoSnapshots";
import classes from "../../coreMaterial/fields/MemoField/MemoField.module.css";
import { MemoInput } from "../../coreMaterial/fields/MemoField/MemoInput";

/**
 * MemoFieldProps
 */
interface MemoFieldProps extends FieldComponentProps<MemoFieldContent> {}

/**
 * Evaluation memo field: HTML view, counters, example, snapshots.
 * @param props - Live field props from FieldWithLiveProps
 */
export function EvaluationMemoField(props: MemoFieldProps) {
  const { content, initialValue, invisible, displayCorrectAnswers } = props;
  const value = initialValue ?? "";

  if (!content) {
    return null;
  }

  if (invisible) {
    return (
      <span className={classes.wrapper} aria-hidden>
        <MemoReadonly value="" />
        <MemoCounters
          words={0}
          characters={0}
          maxWords={content.maxWords}
          maxChars={content.maxChars}
        />
      </span>
    );
  }

  return (
    <span className={classes.wrapper}>
      <MemoInput
        value={value}
        richedit={content.richedit}
        rows={content.rows}
        maxChars={content.maxChars}
        maxWords={content.maxWords}
        readOnly={true}
      />

      <MemoAnswerExample
        example={content.example}
        visible={displayCorrectAnswers}
      />
      <MemoSnapshots
        fieldName={content.name}
        value={value}
        maxWords={content.maxWords}
        maxChars={content.maxChars}
      />
    </span>
  );
}
