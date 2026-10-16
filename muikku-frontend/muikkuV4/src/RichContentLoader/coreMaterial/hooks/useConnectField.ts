import { useCallback, useEffect, useMemo, useState } from "react";
import type { ConnectFieldContent } from "../types";
import {
  checkConnectAnswers,
  initConnectLayout,
  isConnectFieldCorrect,
  moveCounterpart,
  serializeConnectAnswer,
} from "../utils/connectField";
import type { FieldSyncState } from "./useFieldSyncHandle";

/**
 * Class-component-shaped handle expected by useFieldManager.
 */
interface FieldSyncHandle {
  state: FieldSyncState;
  setState: (update: Partial<FieldSyncState>) => void;
}

/**
 * useConnectField params
 */
interface UseConnectFieldParams {
  content: ConnectFieldContent | null;
  initialValue?: string;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => void;
  onChange?: (handle: FieldSyncHandle, name: string, value: string) => void;
  handle: FieldSyncHandle;
}

/**
 * Connect-field pairing state, swap, check, and persist.
 * @param params - Field props plus sync handle
 */
export function useConnectField(params: UseConnectFieldParams) {
  const {
    content,
    initialValue,
    checkAnswers,
    onAnswerChange,
    onChange,
    handle,
  } = params;

  const [{ fields, counterparts }, setLayout] = useState(() =>
    initConnectLayout(content, initialValue)
  );

  const answerState = useMemo(() => {
    if (!checkAnswers || !content) {
      return null;
    }
    return checkConnectAnswers(fields, counterparts, content);
  }, [checkAnswers, content, counterparts, fields]);

  const checkResult =
    answerState === null ? null : isConnectFieldCorrect(answerState);

  useEffect(() => {
    if (!content?.name || checkResult === null) {
      return;
    }
    onAnswerChange?.(content.name, checkResult);
  }, [checkResult, content?.name, onAnswerChange]);

  const persist = useCallback(
    (nextCounterparts: typeof counterparts) => {
      if (!content?.name) {
        return;
      }
      onChange?.(
        handle,
        content.name,
        serializeConnectAnswer(fields, nextCounterparts)
      );
    },
    [content?.name, fields, handle, onChange]
  );

  /**
   * Move a counterpart from one row to another and save.
   * @param from - Drag start index
   * @param to - Drop index
   */
  const moveByIndex = useCallback(
    (from: number, to: number) => {
      setLayout((current) => {
        const nextCounterparts = moveCounterpart(
          current.counterparts,
          from,
          to
        );
        persist(nextCounterparts);
        return { ...current, counterparts: nextCounterparts };
      });
    },
    [persist]
  );

  return {
    fields,
    counterparts,
    answerState,
    checkResult,
    moveByIndex,
  };
}
