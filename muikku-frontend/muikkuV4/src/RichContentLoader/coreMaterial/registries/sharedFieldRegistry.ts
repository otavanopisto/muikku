import type { FieldRegistry } from "../types";
import { SelectField } from "../fields/SelectField";
import { MultiSelectField } from "../fields/MultiSelectField";
import { ConnectField } from "../fields/ConnectField";
import { OrganizerField } from "../fields/OrganizerField";
import { SorterField } from "../fields/SorterField";
import {
  canCheckSelectAnswers,
  createFieldParameters,
} from "../utils/createFieldParameters";

/**
 * Fields shared by materials + evaluation (no usedAs forks).
 * Text/Memo/Journal are added per feature registry.
 */
export const sharedFieldRegistry: FieldRegistry = {
  "application/vnd.muikku.field.select": {
    component: SelectField,
    processor: createFieldParameters,
    canCheckAnswers: canCheckSelectAnswers,
  },
  "application/vnd.muikku.field.multiselect": {
    component: MultiSelectField,
    processor: createFieldParameters,
    canCheckAnswers: canCheckSelectAnswers,
  },
  "application/vnd.muikku.field.connect": {
    component: ConnectField,
    processor: createFieldParameters,
    canCheckAnswers: () => true,
  },
  "application/vnd.muikku.field.organizer": {
    component: OrganizerField,
    processor: createFieldParameters,
    canCheckAnswers: () => true,
  },
  "application/vnd.muikku.field.sorter": {
    component: SorterField,
    processor: createFieldParameters,
    canCheckAnswers: () => true,
  },
};
