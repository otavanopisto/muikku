import type { FieldRegistry } from "../types";
import { SelectField } from "../fields/SelectField/SelectField";
import { MultiSelectField } from "../fields/MultiSelectField/MultiSelectField";
import { ConnectField } from "../fields/ConnectField/ConnectField";
import { OrganizerField } from "../fields/OrganizerField/OrganizerField";
import { SorterField } from "../fields/SorterField/SorterField";
import { AudioField } from "../fields/AudioField/AudioField";
import { FileField } from "../fields/FileField";
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
  "application/vnd.muikku.field.audio": {
    component: AudioField,
    processor: createFieldParameters,
    canCheckAnswers: () => true,
  },
  "application/vnd.muikku.field.file": {
    component: FileField,
    processor: createFieldParameters,
    canCheckAnswers: () => false,
  },
};
