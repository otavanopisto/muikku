/**
 * MaterialLoader types
 */
export interface Material {
  id: string;
  title: string;
  html: string;
  assignmentType:
    | "THEORY"
    | "EXERCISE"
    | "EVALUATED"
    | "JOURNAL"
    | "INTERIM_EVALUATION";
  type?: string;
  ai?: boolean;
  contentHiddenForUser?: boolean;
  correctAnswers?: "ALWAYS" | "NEVER" | "ON_REQUEST";
}

/**
 * Workspace type
 */
export interface Workspace {
  id: string;
  urlName: string;
  materialsAreDisabled?: boolean;
}

/**
 * MaterialCompositeReply type
 */
export interface MaterialCompositeReply {
  state:
    | "UNANSWERED"
    | "ANSWERED"
    | "SUBMITTED"
    | "PASSED"
    | "FAILED"
    | "INCOMPLETE"
    | "WITHDRAWN";
  lock: "NONE" | "LOCKED";
  answers?: any[];
  evaluationInfo?: any;
  workspaceMaterialReplyId?: string;
}
