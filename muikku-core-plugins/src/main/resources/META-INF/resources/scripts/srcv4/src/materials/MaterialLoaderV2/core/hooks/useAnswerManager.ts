/* eslint-disable @typescript-eslint/no-explicit-any */
// srcv4/src/materials/MaterialLoaderV2/core/hooks/useAnswerManager.ts

import { useState, useCallback, useMemo, useEffect } from "react";
import type { AnswerManagerReturn } from "../types";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
} from "~/generated/client";

/**
 * Hook for managing answer checking and validation
 * Extracted from MaterialLoader component's answer management logic
 */
export function useAnswerManager(
  material: MaterialContentNode,
  _compositeReplies?: MaterialCompositeReply,
  checkAnswers = false,
  _displayCorrectAnswers = false
): AnswerManagerReturn {
  // Answer visibility state
  const [answersVisible, setAnswersVisible] = useState<boolean>(() => {
    if (checkAnswers) {
      return (material.correctAnswers ?? "ALWAYS") === "ALWAYS";
    }
    return false;
  });

  // Answer checked state
  const [answersChecked, setAnswersChecked] = useState<boolean>(() => {
    if (checkAnswers) {
      return (material.correctAnswers ?? "NEVER") !== "NEVER";
    }
    return false;
  });

  // Answer checkable state
  const [answerCheckable, setAnswerCheckable] = useState<boolean>(true);

  // Answer registry for tracking field correctness
  const [answerRegistry, setAnswerRegistry] = useState<Record<string, any>>({});

  // Sync version of answer registry for fast updates
  const answerRegistrySync = useMemo<Record<string, any>>(() => ({}), []);

  // Update answer states when checkAnswers changes
  useEffect(() => {
    if (checkAnswers) {
      const isAlwaysShow = (material.correctAnswers ?? "ALWAYS") === "ALWAYS";
      setAnswersChecked(true);
      setAnswersVisible(isAlwaysShow);
    } else {
      setAnswersChecked(false);
      setAnswersVisible(false);
    }
  }, [checkAnswers, material.correctAnswers]);

  // Handle answer change from fields
  const handleAnswerChange = useCallback(
    (name: string, value: boolean | null) => {
      // Update sync registry immediately
      if (value === null) {
        delete answerRegistrySync[name];
      } else {
        answerRegistrySync[name] = value;
      }

      // Update state with new registry
      setAnswerRegistry({ ...answerRegistrySync });
    },
    [answerRegistrySync]
  );

  // Toggle answers visibility
  const toggleAnswersVisible = useCallback(() => {
    setAnswersVisible((prev) => !prev);
  }, []);

  // Handle answer checkable change
  const handleAnswerCheckableChange = useCallback((checkable: boolean) => {
    setAnswerCheckable(checkable);
  }, []);

  return {
    answersVisible,
    answersChecked,
    answerCheckable,
    answerRegistry,
    handleAnswerChange,
    toggleAnswersVisible,
    handleAnswerCheckableChange,
  };
}
