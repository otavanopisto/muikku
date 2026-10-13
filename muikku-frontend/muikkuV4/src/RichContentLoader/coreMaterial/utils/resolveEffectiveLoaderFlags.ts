import type { MaterialLoaderConfig } from "../types";

/**
 * Config wins when set; otherwise use derived state / answer-manager values.
 */
export function resolveEffectiveLoaderFlags(
  config: MaterialLoaderConfig,
  derived: {
    readOnly: boolean;
    answerable: boolean;
    answersVisible: boolean;
    answersChecked: boolean;
  }
) {
  return {
    readOnly: config.readOnly ?? derived.readOnly,
    answerable: config.answerable ?? derived.answerable,
    answersVisible: config.showAnswers ?? derived.answersVisible,
    answersChecked: config.checkAnswers ?? derived.answersChecked,
  };
}
