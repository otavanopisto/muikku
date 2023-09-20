import { WorkspaceType } from "~/reducers/workspaces";

const states = ["PENDING", "APPROVED", "ACTIVE", "INACTIVE"] as const;

const users = ["TEACHERS", "GUARDIANS"] as const;

const useRoles = [
  "STUDENT",
  "COURSE_TEACHER",
  "GUIDANCE_COUNSELOR",
  "SPECIAL_ED_TEACHER",
] as const;

const reasonsForSupport = [
  "disease",
  "disability",
  "lifeSituation",
  "readingAndWritingDifficulties",
  "foreignLanguageDifficulties",
  "learningDifficulties",
  "other",
] as const;

const supportActions = [
  "remedialInstruction",
  "specialEducation",
  "extraTime",
  "scheduledStudies",
  "routedStudies",
  "other",
] as const;

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

/**
 * The state of the form
 */
export type FormState = typeof states[number];

/**
 * The viewing rights of the form
 * who have reading access to the published form data inside Muikku
 */
export type Visibility = typeof users[number];

export type SupportReason = typeof reasonsForSupport[number];

export type SupportAction = typeof supportActions[number];

export type SupportActionMatriculationExamination =
  typeof matriculationExaminationSupport[number];

export type OpinionType = "studentOpinionOfSupport" | "schoolOpinionOfSupport";

export type HistoryEntryType = "EDIT" | "VIEW";

/**
 * The history of the updates made to the form
 */
export interface HistoryEntry {
  /**
   * Id of the user who made the update
   */
  modifierId: number;
  /**
   * The user who made the update
   */
  modifierName: string;
  /**
   * If the user who made the update has an avatar
   */
  modifierHasAvatar: boolean;
  /**
   * Fields that were edited in the update
   */
  editedFields?: string[];
  /**
   * The description or details of the update what was done
   */
  details?: string;
  /**
   * The date when the update was made
   */
  date: Date;
  /**
   * The type of the history entry
   */
  type: HistoryEntryType | null;
}

/**
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
 * FormData
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

/**
 * The student information of the form
 */
export interface UserInfo {
  /**
   * The first name of the student
   * must include the middle names if the student has one
   * @example "Matti Johannes"
   */
  firstName: string;
  /**
   * The last name of the student
   * @example "Meikäläinen"
   */
  lastName: string;
  /**
   * Date of birth of the student
   */
  dateOfBirth?: Date;
  /**
   * Phone number of the student
   */
  phoneNumber?: string | null;
  /**
   * The city where the student lives
   */
  city?: string | null;
  /**
   * The country where the student lives
   */
  country?: string | null;
  /**
   * Email of the student
   */
  email?: string | null;
  /**
   * The street address of the student
   */
  streetAddress?: string | null;
  /**
   * The address of the student
   */
  addressName?: string | null;
  /**
   * The postal code of the student
   */
  zipCode?: string | null;
}

/**
 * The pedagogy form
 */
export interface PedagogyForm {
  /**
   * The id of the student
   * @example "STUDENT-1"
   */
  studentIdentifier: string;
  /**
   * Date when the document was created
   */
  created?: Date;
  /**
   * Id of the user who created the document
   */
  ownerId: number;
  /**
   * Info of the user who created the document
   */
  ownerInfo: UserInfo;
  /**
   * The id of the form
   */
  id: number;
  /**
   * State of the form
   * @example "PENDING" | "APPROVED" | "NOT_SENT" | "INACTIVE"
   */
  state: FormState;
  /**
   * Student information. Data is automatically filled in from the student's profile
   * and can not be changed in the form
   */
  studentInfo: UserInfo;
  /**
   * The data of the form
   * @example "JSON möhkäle"
   */
  formData?: string;
  /**
   * Update history of the form
   */
  history: HistoryEntry[];
  /**
   * permissions for reading and viewing the form inside Muikku
   * @example ["TEACHER", "GUARDIANS"]
   */
  visibility: Visibility[];
}
