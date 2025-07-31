import { PedagogyWorkspace } from "~/generated/client";

export type PedagogyFormType = "compulsory" | "upperSecondary";

// used for frontend logic
const useRoles = [
  "STUDENT",
  "COURSE_TEACHER",
  "GUIDANCE_COUNSELOR",
  "SPECIAL_ED_TEACHER",
  "STUDENT_PARENT",
] as const;

// For the PedagogyForm JSON
const reasonsForSupport = [
  "disease",
  "disability",
  "lifeSituation",
  "readingAndWritingDifficulties",
  "foreignLanguageDifficulties",
  "learningDifficulties",
  "other",
] as const;

// For the PedagogyForm JSON
const supportActions = [
  "remedialInstruction",
  "specialEducation",
  "extraTime",
  "scheduledStudies",
  "routedStudies",
  "linguisticAssistance",
  "customisedRoutedStudies",
  "feedbackAndAssessment",
  "exemptionByPrincipal",
  "other",
] as const;

// For the PedagogyForm JSON
const matriculationExaminationSupport = [
  "extraTime",
  "invidualSpace",
  "smallGroupSpace",
  "restingPlace",
  "assistant",
  "assistedPrintAndScan",
  "limitedAudioMaterial",
  "fontSizeIncrease",
  "largerDisplay",
  "adjustableWorkstation",
  "visionImpairedExamArrangement",
  "other",
] as const;

export type UserRole = (typeof useRoles)[number];

// Types for the PedagogyForm JSON
export type SupportReason = (typeof reasonsForSupport)[number];

// Types for the PedagogyForm JSON
export type SupportAction = (typeof supportActions)[number];

// Types for the PedagogyForm JSON
export type SupportActionMatriculationExamination =
  (typeof matriculationExaminationSupport)[number];

// Types for the PedagogyForm JSON
export type OpinionType = "studentOpinionOfSupport" | "schoolOpinionOfSupport";

/**
 * Part of JSON
 * Support actions that have been implemented
 */
export interface PedagogySupportActionImplemented {
  /**
   * Name of the user who created the mark
   */
  creatorName: string;
  /**
   * Identifier of the user who created the mark
   */
  creatorIdentifier: string;
  /**
   * The action that has been implemented
   */
  action: SupportAction;
  /**
   * The details of the action
   */
  course?: PedagogyWorkspace;
  /**
   * The extra information of the action
   */
  extraInfoDetails?: string;
  /**
   * The date when the action was implemented
   */
  date: Date;
}

/**
 * Part of JSON
 * Opinion
 */
export interface Opinion {
  /**
   * Name of the user who created the opinion mark
   */
  creatorName: string;
  /**
   * Identifier of the user who created the opinion mark
   */
  creatorIdentifier: string;
  /**
   * The opinion of the user
   */
  opinion?: string;
  /**
   * The date when the opinion was created
   */
  creationDate: Date;
  /**
   * The date when the opinion was last updated
   */
  updatedDate?: Date;
}

/**
 * FormData JSON object with type definitions
 */
export interface FormData {
  /**
   * Teacher or teachers responsible for the document
   */
  documentParticipants?: string;
  /**
   * Other participants in the document
   */
  cooperativePartners?: string;
  /**
   * The description of the student's strengths
   */
  studentStrengths?: string;
  /**
   * The description of the student's challenges
   */
  needOfSupport?: string;
  /**
   * Actions to support the student
   */
  supportActions: SupportAction[];
  /**
   * Some other support actions
   */
  supportActionOther?: string;
  /**
   * Support actions that have been implemented
   */
  supportActionsImplemented: PedagogySupportActionImplemented[];
  /**
   * Support plan for the matriculation examination
   */
  matriculationExaminationSupport: SupportActionMatriculationExamination[];
  /**
   * Some other support plan for the matriculation examination
   */
  matriculationExaminationSupportOther?: string;
  /**
   * The student's opinion of the support
   */
  studentOpinionOfSupport?: Opinion[];
  /**
   * School's opinion of the support
   */
  schoolOpinionOfSupport?: Opinion[];
}

/**
 * FormData JSON object with type definitions
 */
export interface CompulsoryFormData {
  /**
   * Form type
   */
  formType: PedagogyFormType;
  /**
   * Teacher or teachers responsible for the document
   */
  documentParticipants?: string;
  /**
   * Other participants in the document
   */
  cooperativePartners?: string;
  /**
   * The description of the student's strengths
   */
  studentStrengths?: string;
  /**
   * The description of the student's challenges
   */
  needOfSupport?: string;
  /**
   * Actions to support the student
   */
  supportActions: SupportAction[];
  /**
   * Some other support actions
   */
  supportActionOther?: string;
  /**
   * The student's opinion of the support
   */
  studentOpinionOfSupport?: Opinion[];
  /**
   * School's opinion of the support
   */
  schoolOpinionOfSupport?: Opinion[];
}

/**
 * FormData JSON object with type definitions
 */
export interface UpperSecondaryFormData {
  /**
   * Form type
   */
  formType: PedagogyFormType;
  /**
   * Teacher or teachers responsible for the document
   */
  documentParticipants?: string;
  /**
   * Other participants in the document
   */
  cooperativePartners?: string;
  /**
   * The description of the student's strengths
   */
  studentStrengths?: string;
  /**
   * The description of the student's challenges
   */
  needOfSupport?: string;
  /**
   * Actions to support the student
   */
  supportActions: SupportAction[];
  /**
   * Some other support actions
   */
  supportActionOther?: string;
  /**
   * Support plan for the matriculation examination
   */
  matriculationExaminationSupport: SupportActionMatriculationExamination[];
  /**
   * Some other support plan for the matriculation examination
   */
  matriculationExaminationSupportOther?: string;
  /**
   * The student's opinion of the support
   */
  studentOpinionOfSupport?: Opinion[];
  /**
   * School's opinion of the support
   */
  schoolOpinionOfSupport?: Opinion[];
}

/**
 * Union type for all form data
 */
export type PedagogyFormData = UpperSecondaryFormData | CompulsoryFormData;

/**
 * Checks if the form is a CompulsoryFormData
 * @param form PedagogyFormData
 * @returns boolean
 */
export const isCompulsoryForm = (
  form: PedagogyFormData
): form is CompulsoryFormData => form.formType === "compulsory";

/**
 * Checks if the form is a UpperSecondaryFormData
 * @param form PedagogyFormData
 * @returns boolean
 */
export const isUpperSecondaryForm = (
  form: PedagogyFormData
): form is UpperSecondaryFormData => form.formType === "upperSecondary";
