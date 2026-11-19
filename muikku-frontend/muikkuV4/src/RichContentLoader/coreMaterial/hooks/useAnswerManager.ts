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
 * Derive answer flags from material and state config
 * @param material - Material content node
 * @param stateConfig - Assignment state config
 * @param config - Material loader config
 * @returns Answer flags
 */
function deriveAnswerFlags(
  material: MaterialContentNode,
  stateConfig: AssignmentStateConfig | null | undefined,
  config?: MaterialLoaderConfig
) {
  // First check if the answers should be checked
  const shouldCheck =
    Boolean(config?.checkAnswers) || Boolean(stateConfig?.checksAnswers);

  // If not then...
  if (!shouldCheck) {
    return { answersVisible: false, answersChecked: false };
  }

  // If so then...
  return {
    answersChecked: (material.correctAnswers ?? "NEVER") !== "NEVER",
    answersVisible: (material.correctAnswers ?? "ALWAYS") === "ALWAYS",
  };
}

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

  const initialAnswerFlags = deriveAnswerFlags(material, stateConfig, config);

  // Answer visibility state
  const [answersVisible, setAnswersVisible] = useState<boolean>(
    initialAnswerFlags.answersVisible
  );

  // Answer checked state
  const [answersChecked, setAnswersChecked] = useState<boolean>(
    initialAnswerFlags.answersChecked
  );

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
