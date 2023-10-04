import { WorkspaceType } from "~/reducers/workspaces";

// used for frontend logic
const useRoles = [
  "STUDENT",
  "COURSE_TEACHER",
  "GUIDANCE_COUNSELOR",
  "SPECIAL_ED_TEACHER",
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
  "other",
] as const;

export type UserRole = typeof useRoles[number];

export type SupportReason = typeof reasonsForSupport[number];

export type SupportAction = typeof supportActions[number];

export type SupportActionMatriculationExamination =
  typeof matriculationExaminationSupport[number];

export type OpinionType = "studentOpinionOfSupport" | "schoolOpinionOfSupport";

/**
 * Part of JSON
 * Support actions that have been implemented
 */
export interface SupportActionImplementation {
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
  course?: WorkspaceType;
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
   * Reasoning for the support
   */
  supportReasons: SupportReason[];
  /**
   * Some other reason for the support
   */
  supportReasonOther?: string;
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
   * Support actions that have been implemented
   */
  supportActionsImplemented: SupportActionImplementation[];
  /**
   * The student's opinion of the support
   */
  studentOpinionOfSupport?: Opinion[];
  /**
   * School's opinion of the support
   */
  schoolOpinionOfSupport?: Opinion[];
}
