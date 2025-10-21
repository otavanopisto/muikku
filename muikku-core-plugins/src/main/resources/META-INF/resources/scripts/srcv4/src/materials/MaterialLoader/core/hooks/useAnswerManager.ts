import { useState, useCallback } from "react";
import type { Material, MaterialCompositeReply } from "../../types";
import type { MaterialLoaderConfig } from "../../configs/MaterialLoaderConfigs";

/**
 * AnswerManagerReturn type
 */
interface AnswerManagerReturn {
  answersVisible: boolean;
  answersChecked: boolean;
  answerRegistry: Record<string, boolean>;
  handleAnswerChange: (name: string, value: boolean) => void;
  toggleAnswersVisible: () => void;
}

/**
 * useAnswerManager
 * @param material material
 * @param compositeReplies compositeReplies
 * @param config config
 * @returns AnswerManagerReturn
 */
export function useAnswerManager(
  _material: Material,
  _compositeReplies: MaterialCompositeReply | undefined,
  config: MaterialLoaderConfig
): AnswerManagerReturn {
  const [answersVisible, setAnswersVisible] = useState(
    config.showAnswers ?? false
  );
  const [answersChecked, _] = useState(config.checkAnswers ?? false);
  const [answerRegistry, setAnswerRegistry] = useState<Record<string, boolean>>(
    {}
  );

  /**
   * handleAnswerChange
   * @param name name
   * @param value value
   */
  const handleAnswerChange = useCallback((name: string, value: boolean) => {
    setAnswerRegistry((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * toggleAnswersVisible
   */
  const toggleAnswersVisible = useCallback(() => {
    setAnswersVisible((prev) => !prev);
  }, []);

  return {
    answersVisible,
    answersChecked,
    answerRegistry,
    handleAnswerChange,
    toggleAnswersVisible,
  };
}
