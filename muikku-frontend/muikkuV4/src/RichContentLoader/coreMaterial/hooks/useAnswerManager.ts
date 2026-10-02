/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  AnswerManagerReturn,
  AssignmentStateConfig,
  MaterialLoaderConfig,
} from "../types";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
} from "~/generated/client";
import _ from "lodash";

/**
 * Tracks interactive answer-checking UI state for fields.
 *
 * Owns:
 * - answersVisible / answersChecked / answerCheckable
 * - answerRegistry (fieldName → correct/incorrect)
 * - handleAnswerChange (fields report check results)
 * - Syncing visible/checked flags when stateConfig.checksAnswers changes
 *
 * Does not own:
 * - Assignment reply state transitions (useAssignmentState / orchestrator)
 * - Field value save/sync (useFieldManager)
 * - Whether evaluation forces check/show (orchestrator config/policy)
 *
 * @param material - Used for correctAnswers policy (ALWAYS/ON_REQUEST/NEVER)
 * @param _compositeReplies - Reserved; not used for registry today
 * @param stateConfig - From useAssignmentState; drives checksAnswers side effects
 * @param config - Loader config (checkAnswers / answerable seeds)
 * @returns AnswerManagerReturn
 */
export function useAnswerManager(
  material: MaterialContentNode,
  _compositeReplies?: MaterialCompositeReply,
  stateConfig?: AssignmentStateConfig | null,
  config?: MaterialLoaderConfig
): AnswerManagerReturn {
  const previousStateConfigRef = useRef<AssignmentStateConfig | null>(
    stateConfig
  );

  // Answer visibility state
  const [answersVisible, setAnswersVisible] = useState<boolean>(() => {
    if (config?.checkAnswers) {
      return (material.correctAnswers ?? "ALWAYS") === "ALWAYS";
    }
    return false;
  });

  // Answer checked state
  const [answersChecked, setAnswersChecked] = useState<boolean>(() => {
    if (config?.checkAnswers) {
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
    if (!material || !config?.answerable) return;

    if (_.isEqual(previousStateConfigRef.current, stateConfig)) {
      return;
    }

    previousStateConfigRef.current = stateConfig;

    const shouldCheck = stateConfig?.checksAnswers ?? false;
    const isAlwaysShow = (material.correctAnswers ?? "ALWAYS") === "ALWAYS";

    if (shouldCheck && !answersChecked) {
      if (isAlwaysShow) {
        setAnswersVisible(true);
        setAnswersChecked(true);
      } else {
        setAnswersChecked(true);
      }
    } else if (!shouldCheck && answersChecked) {
      setAnswersVisible(false);
      setAnswersChecked(false);
    }
  }, [answersChecked, config, material, stateConfig]);

  /**
   * Handle answer change from fields
   * @param name - name
   * @param value - value
   */
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

  /**
   * Toggle answers visibility
   */
  const toggleAnswersVisible = useCallback(() => {
    setAnswersVisible((prev) => !prev);
  }, []);

  /**
   * Handle answer checkable change
   * @param checkable - checkable
   */
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
