import {
  CompulsoryFormData,
  isCompulsoryForm,
  isUpperSecondaryForm,
  PedagogyFormData,
  PedagogySupportActionImplemented,
  SupportAction,
  SupportActionMatriculationExamination,
  SupportReason,
  UpperSecondaryFormData,
} from "~/@types/pedagogy-form";
import { PedagogyUserInfo } from "~/generated/client";
import { OptionDefault } from "~/components/general/react-select/types";
import i18n from "~/locales/i18n";
import _ from "lodash";

// Access to pedagogy form
export const UPPERSECONDARY_PEDAGOGYFORM = [
  "Nettilukio",
  "Aikuislukio",
  "Nettilukio/yksityisopiskelu (aineopintoina)",
];
export const COMPULSORY_PEDAGOGYFORM = [
  "Nettiperuskoulu",
  "Nettiperuskoulu/yksityisopiskelu",
  "Aikuisten perusopetuksen päättövaihe",
  "Aikuisten perusopetuksen alkuvaihe",
];

// Access to pedagogy support as whole (implemented actions at least)
export const UPPERSECONDARY_PEDAGOGYSUPPORT = [
  "Nettilukio",
  "Aikuislukio",
  "Nettilukio/yksityisopiskelu (aineopintoina)",
  "Aineopiskelu/lukio (oppivelvolliset)",
  "Aineopiskelu/yo-tutkinto",
  "Nettilukio/yksityisopiskelu (tutkinto)",
  "Kahden tutkinnon opinnot",
  "Aineopiskelu/lukio",
];
export const COMPULSORY_PEDAGOGYSUPPORT = [
  "Nettiperuskoulu",
  "Nettiperuskoulu/yksityisopiskelu",
  "Aineopiskelu/perusopetus",
  "Aineopiskelu/perusopetus (oppilaitos ilmoittaa)",
  "Aineopiskelu/perusopetus (oppivelvolliset)",
  "Aikuisten perusopetuksen päättövaihe",
  "Aikuisten perusopetuksen alkuvaihe",
];

type PedagogyStudyType = "upperSecondary" | "compulsory";

/**
 * Pedagogy support permissions
 */
export class PedagogySupportPermissions {
  private studyProgrammeName: string;
  private studyType: PedagogyStudyType | null;

  /**
   * Constructor
   * @param studyProgrammeName study programme name
   */
  constructor(studyProgrammeName: string) {
    this.studyProgrammeName = studyProgrammeName;
    this.studyType = this.determineStudyType();
  }

  /**
   * Determine the study type based on the study programme name
   * @returns "upperSecondary" | "compulsory" | null
   */
  private determineStudyType(): PedagogyStudyType | null {
    if (UPPERSECONDARY_PEDAGOGYSUPPORT.includes(this.studyProgrammeName)) {
      return "upperSecondary";
    }
    if (COMPULSORY_PEDAGOGYSUPPORT.includes(this.studyProgrammeName)) {
      return "compulsory";
    }
    return null;
  }

  /**
   * Check if the student has access to pedagogy form
   */
  hasPedagogyFormAccess(): boolean {
    if (!this.studyType) return false;
    return this.studyType === "upperSecondary"
      ? UPPERSECONDARY_PEDAGOGYFORM.includes(this.studyProgrammeName)
      : COMPULSORY_PEDAGOGYFORM.includes(this.studyProgrammeName);
  }

  /**
   * Check if the student has access to implemented actions
   */
  hasImplementedActionsAccess(): boolean {
    if (!this.studyType) return false;
    return this.studyType === "upperSecondary"
      ? UPPERSECONDARY_PEDAGOGYSUPPORT.includes(this.studyProgrammeName)
      : COMPULSORY_PEDAGOGYSUPPORT.includes(this.studyProgrammeName);
  }

  /**
   * Check if the student is upper secondary
   */
  isUpperSecondary(): boolean {
    return this.studyType === "upperSecondary";
  }

  /**
   * Check if the student is compulsory education
   */
  isCompulsory(): boolean {
    return this.studyType === "compulsory";
  }

  /**
   * Get the study type
   */
  getStudyType(): PedagogyStudyType | null {
    return this.studyType;
  }

  /**
   * Get the study programme name
   */
  getStudyProgrammeName(): string {
    return this.studyProgrammeName;
  }

  /**
   * Check if the student has any pedagogy support access (either form or implemented actions)
   */
  hasAnyAccess(): boolean {
    return this.hasPedagogyFormAccess() || this.hasImplementedActionsAccess();
  }
}

/**
 * Is used to give correct translation for the list of edited fields
 */
export const formFieldsWithTranslation: { [key: string]: string } = {
  authorOfDocument: i18n.t("labels.authorOfDocument", {
    ns: "pedagogySupportPlan",
  }),
  documentParticipants: i18n.t("labels.documentParticipants", {
    ns: "pedagogySupportPlan",
  }),
  cooperativePartners: i18n.t("labels.cooperativePartners", {
    ns: "pedagogySupportPlan",
  }),
  studentStrengths: i18n.t("labels.studentStrengths", {
    ns: "pedagogySupportPlan",
  }),
  supportReasonsOptions: i18n.t("labels.basisForSupport", {
    ns: "pedagogySupportPlan",
    context: "pedagogy",
  }),
  supportReasonOther: i18n.t("labels.basisForSupport", {
    ns: "pedagogySupportPlan",
    context: "else",
  }),
  supportActions: i18n.t("labels.plannedActions", {
    ns: "pedagogySupportPlan",
  }),
  supportActionOther: i18n.t("labels.plannedActions", {
    ns: "pedagogySupportPlan",
    context: "else",
  }),
  matriculationExaminationSupport: i18n.t("labels.matriculationPrePlan", {
    ns: "pedagogySupportPlan",
  }),
  matriculationExaminationSupportOther: i18n.t("labels.matriculationPrePlan", {
    ns: "pedagogySupportPlan",
    context: "else",
  }),
  studentOpinionOfSupport: i18n.t("labels.opinionOfSupport", {
    ns: "pedagogySupportPlan",
    context: "student",
  }),
  schoolOpinionOfSupport: i18n.t("labels.opinionOfSupport", {
    ns: "pedagogySupportPlan",
    context: "school",
  }),
  supportActionsImplemented: i18n.t("labels.implementedActions", {
    ns: "pedagogySupportPlan",
  }),
};

export const supportReasonsOptions: OptionDefault<SupportReason>[] = [
  {
    value: "disease",
    label: i18n.t("labels.disease", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "disability",
    label: i18n.t("labels.disability", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "lifeSituation",
    label: i18n.t("labels.lifeSituation", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "readingAndWritingDifficulties",
    label: i18n.t("labels.readingAndWritingDifficulties", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "foreignLanguageDifficulties",
    label: i18n.t("labels.foreignLanguageDifficulties", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "learningDifficulties",
    label: i18n.t("labels.learningDifficulties", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "other",
    label: i18n.t("labels.other", {
      ns: "pedagogySupportPlan",
      context: "support",
    }),
  },
];

export const supportActionsOptionsUppersecondary: OptionDefault<SupportAction>[] =
  [
    {
      value: "remedialInstruction",
      label: i18n.t("labels.remedialInstruction", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "specialEducation",
      label: i18n.t("labels.specialEducation", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "extraTime",
      label: i18n.t("labels.extraTime", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "scheduledStudies",
      label: i18n.t("labels.scheduledStudies", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "routedStudies",
      label: i18n.t("labels.routedStudies", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "linguisticAssistance",
      label: "Kielellinen tuki",
    },
    {
      value: "other",
      label: i18n.t("labels.other", {
        ns: "pedagogySupportPlan",
        context: "action",
      }),
    },
  ];

export const supportActionsOptionsCompulsory: OptionDefault<SupportAction>[] = [
  {
    value: "remedialInstruction",
    label: i18n.t("labels.remedialInstruction", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "specialEducation",
    label: i18n.t("labels.specialEducation", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "routedStudies",
    label: i18n.t("labels.routedStudies", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "customisedRoutedStudies",
    label: i18n.t("labels.customisedRoutedStudies", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "feedbackAndAssessment",
    label: i18n.t("labels.feedbackAndAssessment", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "exemptionByPrincipal",
    label: i18n.t("labels.exemptionByPrincipal", {
      ns: "pedagogySupportPlan",
    }),
  },
  {
    value: "other",
    label: i18n.t("labels.other", {
      ns: "pedagogySupportPlan",
      context: "action",
    }),
  },
];

export const matriculationSupportActionsOptions: OptionDefault<SupportActionMatriculationExamination>[] =
  [
    {
      value: "extraTime",
      label: i18n.t("labels.extraTime", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "invidualSpace",
      label: i18n.t("labels.invidualSpace", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "smallGroupSpace",
      label: i18n.t("labels.smallGroupSpace", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "restingPlace",
      label: i18n.t("labels.restingPlace", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "assistant",
      label: i18n.t("labels.assistant", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "assistedPrintAndScan",
      label: i18n.t("labels.assistedPrintAndScan", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "limitedAudioMaterial",
      label: i18n.t("labels.limitedAudioMaterial", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "fontSizeIncrease",
      label: i18n.t("labels.fontSizeIncrease", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "largerDisplay",
      label: i18n.t("labels.largerDisplay", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "adjustableWorkstation",
      label: i18n.t("labels.adjustableWorkstation", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "visionImpairedExamArrangement",
      label: i18n.t("labels.visionImpairedExamArrangement", {
        ns: "pedagogySupportPlan",
      }),
    },
    {
      value: "other",
      label: i18n.t("labels.other", {
        ns: "pedagogySupportPlan",
        context: "action",
      }),
    },
  ];

/**
 * Build address string from student info from values
 * that can be undefined
 *
 * @param studentInfo studentInfo
 * @returns builded address string
 */
export const buildAddress = (studentInfo: PedagogyUserInfo) => {
  // Fields and order to build address string
  const addressFields: (keyof PedagogyUserInfo)[] = [
    "streetAddress",
    "zipCode",
    "city",
    "country",
  ];

  const addressValuesFound = [];

  for (const field of addressFields) {
    if (studentInfo[field]) {
      addressValuesFound.push(studentInfo[field]);
    }
  }

  return addressValuesFound.length > 0 ? addressValuesFound.join(", ") : "-";
};

/**
 * Checks if the form data needs migration
 * @param formData form data
 * @returns boolean
 */
export function needsMigration(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any
): boolean {
  // If no formType field exists, it's old data
  return !formData.formType;
}

/**
 * Migrates the uppersecondary form data
 * @param oldData old data
 * @returns migrated data
 */
export function migrateUpperSecondaryData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oldData: any
): UpperSecondaryFormData {
  return {
    formType: "upperSecondary",
    documentParticipants: oldData.documentParticipants,
    cooperativePartners: oldData.cooperativePartners,
    decisionToSpecialEducation: false,
    decisionToSpecialEducationDate: undefined,
    studentStrengths: oldData.studentStrengths,
    needOfSupport: oldData.needOfSupport,
    supportActions: oldData.supportActions || [],
    supportActionOther: oldData.supportActionOther,
    matriculationExaminationSupport:
      oldData.matriculationExaminationSupport || [],
    matriculationExaminationSupportOther:
      oldData.matriculationExaminationSupportOther,
    studentOpinionOfSupport: oldData.studentOpinionOfSupport || [],
    schoolOpinionOfSupport: oldData.schoolOpinionOfSupport || [],
    // Note: supportActionsImplemented is excluded as requested
  };
}

/**
 * Initializes the pedagogy form data
 * @param existingData existing data
 * @param isUppersecondary is uppersecondary
 * @returns initialized data
 */
export function initializePedagogyFormData(
  existingData: string,
  isUppersecondary: boolean
): PedagogyFormData {
  const baseForm = isUppersecondary
    ? { ...initializeUpperSecondaryFormData() }
    : { ...initializeCompulsoryFormData() };

  // If there is no existing data or it is empty string, return base initial form
  if (!existingData || existingData === "") return baseForm;

  const existingDataForm = JSON.parse(existingData) as PedagogyFormData;

  // If there is existing data, but it is old upper secondary form, return initialized upper secondary form
  // that is initialized from old data
  if (isUppersecondary && needsMigration(existingDataForm)) {
    return {
      ...baseForm,
      ...migrateUpperSecondaryData(existingDataForm),
    };
  }

  return {
    ...baseForm,
    ...existingDataForm,
  };
}

/**
 * Initializes the uppersecondary form data
 * @returns initialized data
 */
export function initializeUpperSecondaryFormData(): UpperSecondaryFormData {
  return {
    formType: "upperSecondary",
    documentParticipants: "",
    cooperativePartners: "",
    decisionToSpecialEducation: false,
    studentStrengths: "",
    needOfSupport: "",
    supportActions: [],
    matriculationExaminationSupport: [],
    matriculationExaminationSupportOther: "",
    studentOpinionOfSupport: [],
    schoolOpinionOfSupport: [],
  };
}

/**
 * Initializes the compulsory form data
 * @returns initialized data
 */
export function initializeCompulsoryFormData(): CompulsoryFormData {
  return {
    formType: "compulsory",
    documentParticipants: "",
    cooperativePartners: "",
    studentStrengths: "",
    needOfSupport: "",
    supportActions: [],
    studentOpinionOfSupport: [],
    schoolOpinionOfSupport: [],
  };
}

/**
 * Initializes the implemented support actions form data
 * @param existingData existing data
 * @returns initialized data
 */
export function initializeImplemetedSupportActionsFormData(
  existingData: string
): PedagogySupportActionImplemented[] {
  if (!existingData || existingData === "") return [];

  const existingDataForm = JSON.parse(
    existingData
  ) as PedagogySupportActionImplemented[];

  return existingDataForm;
}

/**
 * Get the edited fields
 * @param oldData old pedagogyForm
 * @param newData new pedagogyForm
 * @returns string[]
 */
export const getEditedFields = (
  oldData: PedagogyFormData,
  newData: PedagogyFormData
) => {
  let changedValuesComparedToPrevious: string[] = [];

  // Check if the form type has changed
  if (isCompulsoryForm(oldData) && isCompulsoryForm(newData)) {
    changedValuesComparedToPrevious = Object.keys(newData).filter(
      (key: keyof CompulsoryFormData) => {
        if (typeof oldData[key] !== "object") {
          return oldData[key] !== newData[key];
        }
      }
    );

    const hasStudentOpinionChanged = !_.isEqual(
      newData.studentOpinionOfSupport,
      oldData.studentOpinionOfSupport
    );

    if (hasStudentOpinionChanged) {
      changedValuesComparedToPrevious.push("studentOpinionOfSupport");
    }

    const hasSchoolOpinionChanged = !_.isEqual(
      newData.schoolOpinionOfSupport,
      oldData.schoolOpinionOfSupport
    );

    if (hasSchoolOpinionChanged) {
      changedValuesComparedToPrevious.push("schoolOpinionOfSupport");
    }
  } else if (isUpperSecondaryForm(oldData) && isUpperSecondaryForm(newData)) {
    changedValuesComparedToPrevious = Object.keys(newData).filter(
      (key: keyof UpperSecondaryFormData) => {
        if (typeof oldData[key] !== "object") {
          return oldData[key] !== newData[key];
        }
      }
    );

    const hasStudentOpinionChanged = !_.isEqual(
      newData.studentOpinionOfSupport,
      oldData.studentOpinionOfSupport
    );

    if (hasStudentOpinionChanged) {
      changedValuesComparedToPrevious.push("studentOpinionOfSupport");
    }

    const hasSchoolOpinionChanged = !_.isEqual(
      newData.schoolOpinionOfSupport,
      oldData.schoolOpinionOfSupport
    );

    if (hasSchoolOpinionChanged) {
      changedValuesComparedToPrevious.push("schoolOpinionOfSupport");
    }
  }

  return changedValuesComparedToPrevious;
};
