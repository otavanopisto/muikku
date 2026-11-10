import { useCallback, useEffect, useMemo, useState } from "react";
import type { SorterFieldContent } from "../types";
import type { FieldSyncState } from "./useFieldSyncHandle";
import {
  checkSorterAnswers,
  initSorterItems,
  isSorterFieldCorrect,
  moveSorterItem,
  serializeSorterAnswer,
} from "../utils/sorterField";

/**
 * Class-component-shaped handle expected by useFieldManager.
 */
interface FieldSyncHandle {
  state: FieldSyncState;
  setState: (update: Partial<FieldSyncState>) => void;
}

/**
 * useSorterField params
 */
interface UseSorterFieldParams {
  content: SorterFieldContent | null;
  initialValue?: string;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => void;
  onChange?: (handle: FieldSyncHandle, name: string, value: string) => void;
  handle: FieldSyncHandle;
}

/**
 * Sorter list state, insert-move, check, persist.
 * @param params - Field props plus sync handle
 */
export function useSorterField(params: UseSorterFieldParams) {
  const {
    content,
    initialValue,
    checkAnswers,
    onAnswerChange,
    onChange,
    handle,
  } = params;

  const [items, setItems] = useState(() =>
    initSorterItems(content, initialValue)
  );

  const answerState = useMemo(() => {
    if (!checkAnswers || !content) {
      return null;
    }
    return checkSorterAnswers(items, content);
  }, [checkAnswers, content, items]);

  const checkResult =
    answerState === null ? null : isSorterFieldCorrect(answerState);

  useEffect(() => {
    if (!content?.name || checkResult === null) {
      return;
    }
    onAnswerChange?.(content.name, checkResult);
  }, [checkResult, content?.name, onAnswerChange]);

  const persist = useCallback(
    (nextItems: typeof items) => {
      if (!content?.name) {
        return;
      }
      onChange?.(handle, content.name, serializeSorterAnswer(nextItems));
    },
    [content?.name, handle, onChange]
  );

  /**
   * Reorder and save.
   * @param from - Drag start index
   * @param to - Drop index
   */
  const moveByIndex = useCallback(
    (from: number, to: number) => {
      setItems((current) => {
        const next = moveSorterItem(current, from, to);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return {
    items,
    answerState,
    checkResult,
    moveByIndex,
  };
}
