import {
  CompulsoryFormData,
  SupportAction,
  SupportActionMatriculationExamination,
  SupportReason,
  UpperSecondaryFormData,
} from "~/@types/pedagogy-form";
import { PedagogyUserInfo } from "~/generated/client";
import { OptionDefault } from "../react-select/types";
import i18n from "~/locales/i18n";

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

export const supportActionsOptions: OptionDefault<SupportAction>[] = [
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
 * Initializes the uppersecondary form data
 * @returns initialized data
 */
export function initializeUpperSecondaryFormData(): UpperSecondaryFormData {
  return {
    formType: "upperSecondary",
    documentParticipants: "",
    cooperativePartners: "",
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
    matriculationExaminationSupport: [],
    matriculationExaminationSupportOther: "",
    studentOpinionOfSupport: [],
    schoolOpinionOfSupport: [],
  };
}
