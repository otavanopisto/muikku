import type { FieldRegistry } from "../coreMaterial/types";
import { sharedFieldRegistry } from "../coreMaterial/registries/sharedFieldRegistry";
import { MaterialTextField } from "./fields/TextField";
import { MaterialMemoField } from "./fields/MemoField";
import { MaterialJournalField } from "./fields/JournalField";
import {
  canCheckTextAnswers,
  createFieldParameters,
} from "../coreMaterial/utils/createFieldParameters";

export const materialsFieldRegistry: FieldRegistry = {
  ...sharedFieldRegistry,
  "application/vnd.muikku.field.text": {
    component: MaterialTextField,
    processor: createFieldParameters,
    canCheckAnswers: canCheckTextAnswers,
  },
  "application/vnd.muikku.field.memo": {
    component: MaterialMemoField,
    processor: createFieldParameters,
    canCheckAnswers: () => false,
  },
  "application/vnd.muikku.field.journal": {
    component: MaterialJournalField,
    processor: createFieldParameters,
    canCheckAnswers: () => false,
  },
};
