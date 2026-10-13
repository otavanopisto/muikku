import type { FieldRegistry } from "../coreMaterial/types";
import { sharedFieldRegistry } from "../coreMaterial/registries/sharedFieldRegistry";
import { EvaluationTextField } from "./fields/TextField";
import { EvaluationMemoField } from "./fields/MemoField";
import { EvaluationJournalField } from "./fields/JournalField";
import {
  canCheckTextAnswers,
  createFieldParameters,
} from "../coreMaterial/utils/createFieldParameters";

/**
 * Evaluation materials field registry
 * @returns The evaluation materials field registry
 */
export const evaluationMaterialsFieldRegistry: FieldRegistry = {
  ...sharedFieldRegistry,
  "application/vnd.muikku.field.text": {
    component: EvaluationTextField,
    processor: createFieldParameters,
    canCheckAnswers: canCheckTextAnswers,
  },
  "application/vnd.muikku.field.memo": {
    component: EvaluationMemoField,
    processor: createFieldParameters,
    canCheckAnswers: () => false,
  },
  "application/vnd.muikku.field.journal": {
    component: EvaluationJournalField,
    processor: createFieldParameters,
    canCheckAnswers: () => false,
  },
};
