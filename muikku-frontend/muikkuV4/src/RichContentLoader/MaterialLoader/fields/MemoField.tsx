import { useMemo, useRef, useState } from "react";
import type {
  FieldComponentProps,
  MemoFieldContent,
} from "../../coreMaterial/types";
import { MemoReadonly } from "../../coreMaterial/fields/MemoField/MemoReadonly";
import { Synchronizer } from "../../coreMaterial/fields/Synchronizer";
import { MemoCounters } from "../../coreMaterial/fields/MemoField/MemoCounters";
import { MemoAnswerExample } from "../../coreMaterial/fields/MemoField/MemoAnswerExample";
import { MemoInput } from "../../coreMaterial/fields/MemoField/MemoInput";
import { useFieldSyncHandle } from "../../coreMaterial/hooks/useFieldSyncHandle";
import {
  countMemoText,
  exceedsMemoLimit,
  parseMemoLimit,
} from "../../coreMaterial/utils/memoField";
import classes from "../../coreMaterial/fields/MemoField/MemoField.module.css";

/**
 * MemoFieldProps
 */
interface MemoFieldProps extends FieldComponentProps<MemoFieldContent> {}

/**
 * Student materials memo field.
 * @param props - Live field props from FieldWithLiveProps
 */
export function MaterialMemoField(props: MemoFieldProps) {
  const {
    content,
    readOnly,
    initialValue,
    invisible,
    displayCorrectAnswers,
    onChange,
  } = props;

  const [value, setValue] = useState(initialValue ?? "");
  const handle = useFieldSyncHandle();
  const lastNoticeAt = useRef(0);
  const counts = useMemo(() => countMemoText(value), [value]);

  if (!content) {
    return null;
  }

  /**
   * Persist unless the next text exceeds max chars/words.
   * @param next - Next stored value
   */
  function handleChange(next: string) {
    if (!content) return;
    const maxChars = parseMemoLimit(content.maxChars);
    const maxWords = parseMemoLimit(content.maxWords);
    const nextCounts = countMemoText(next);
    const hit = exceedsMemoLimit(nextCounts.plain, maxChars, maxWords);
    if (hit) {
      const now = Date.now();
      if (now - lastNoticeAt.current > 1500) {
        lastNoticeAt.current = now;
      }
      return;
    }
    setValue(next);
    onChange?.(handle, content.name, next);
  }

  if (invisible) {
    return (
      <span className={classes.wrapper} aria-hidden>
        <MemoReadonly value="" />
        <MemoCounters
          words={counts.words}
          characters={counts.characters}
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
        readOnly={readOnly}
        onChange={handleChange}
      />
      <Synchronizer
        modified={handle.state.modified}
        synced={handle.state.synced}
        syncError={handle.state.syncError}
      />

      <MemoAnswerExample
        example={content.example}
        visible={displayCorrectAnswers}
      />
    </span>
  );
}
