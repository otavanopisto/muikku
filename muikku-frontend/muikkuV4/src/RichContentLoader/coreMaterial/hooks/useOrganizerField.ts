import { useCallback, useEffect, useMemo, useState } from "react";
import type { OrganizerFieldContent } from "../types";
import type { FieldSyncState } from "./useFieldSyncHandle";
import {
  addTermToBox,
  checkOrganizerAnswers,
  initOrganizerBoxes,
  moveTermBetweenBoxes,
  removeTermFromBox,
  shuffleItems,
  usedTermIds,
} from "../utils/organizerField";

/**
 * Class-component-shaped handle expected by useFieldManager.
 */
interface FieldSyncHandle {
  state: FieldSyncState;
  setState: (update: Partial<FieldSyncState>) => void;
}

/**
 * useOrganizerField params
 */
interface UseOrganizerFieldParams {
  content: OrganizerFieldContent | null;
  initialValue?: string;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => void;
  onChange?: (handle: FieldSyncHandle, name: string, value: string) => void;
  handle: FieldSyncHandle;
}

/**
 * Organizer pool, boxes, add/remove, check, persist.
 * @param params - Field props plus sync handle
 */
export function useOrganizerField(params: UseOrganizerFieldParams) {
  const {
    content,
    initialValue,
    checkAnswers,
    onAnswerChange,
    onChange,
    handle,
  } = params;

  const [order] = useState(() =>
    shuffleItems(content?.terms.map((term) => term.id) ?? [])
  );
  const [boxes, setBoxes] = useState(() =>
    initOrganizerBoxes(content?.categories ?? [], initialValue)
  );
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

  const check = useMemo(() => {
    if (!checkAnswers || !content) {
      return null;
    }
    return checkOrganizerAnswers(boxes, content);
  }, [boxes, checkAnswers, content]);

  const checkResult = check?.overall === "PASS" ? true : check ? false : null;
  const inUse = useMemo(() => usedTermIds(boxes), [boxes]);

  useEffect(() => {
    if (!content?.name || checkResult === null) {
      return;
    }
    onAnswerChange?.(content.name, checkResult);
  }, [checkResult, content?.name, onAnswerChange]);

  const persist = useCallback(
    (nextBoxes: typeof boxes) => {
      if (!content?.name) {
        return;
      }
      onChange?.(handle, content.name, JSON.stringify(nextBoxes));
    },
    [content?.name, handle, onChange]
  );

  /**
   * Place a term in a category and save.
   * @param termId - Term
   * @param categoryId - Category
   */
  const addTerm = useCallback(
    (termId: string, categoryId: string) => {
      setBoxes((current) => {
        const next = addTermToBox(current, categoryId, termId);
        if (next === current) {
          return current;
        }
        persist(next);
        return next;
      });
      setSelectedTermId(null);
    },
    [persist]
  );

  /**
   * Remove a term from a category and save.
   * @param categoryId - Category
   * @param termId - Term
   */
  const removeTerm = useCallback(
    (categoryId: string, termId: string) => {
      setBoxes((current) => {
        const next = removeTermFromBox(current, categoryId, termId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  /**
   * Move a placed term between categories and save.
   * @param fromCategoryId - Source category
   * @param toCategoryId - Target category
   * @param termId - Term
   */
  const moveTerm = useCallback(
    (fromCategoryId: string, toCategoryId: string, termId: string) => {
      setBoxes((current) => {
        const next = moveTermBetweenBoxes(
          current,
          fromCategoryId,
          toCategoryId,
          termId
        );
        if (next === current) {
          return current;
        }
        persist(next);
        return next;
      });
      setSelectedTermId(null);
    },
    [persist]
  );

  /**
   * Toggle pool selection for click-to-place.
   * @param termId - Term
   */
  const toggleSelectedTerm = useCallback((termId: string) => {
    setSelectedTermId((current) => (current === termId ? null : termId));
  }, []);

  /**
   * Place the selected term into a category, if any.
   * @param categoryId - Category
   */
  const placeSelectedIn = useCallback(
    (categoryId: string) => {
      if (!selectedTermId) {
        return;
      }
      addTerm(selectedTermId, categoryId);
    },
    [addTerm, selectedTermId]
  );

  return {
    order,
    boxes,
    inUse,
    selectedTermId,
    check,
    checkResult,
    addTerm,
    removeTerm,
    moveTerm,
    toggleSelectedTerm,
    placeSelectedIn,
  };
}
