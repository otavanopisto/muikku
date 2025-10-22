// srcv4/src/materials/MaterialLoaderV2/core/types/index.ts

/**
 * Core types for MaterialLoaderV2
 */

export interface Material {
  id: string;
  title: string;
  html: string;
  assignmentType:
    | "EXERCISE"
    | "EVALUATED"
    | "JOURNAL"
    | "INTERIM_EVALUATION"
    | "THEORY";
  correctAnswers?: "ALWAYS" | "NEVER" | "ON_REQUEST";
  hidden?: boolean;
  contentHiddenForUser?: boolean;
  ai?: boolean;
}

export interface Workspace {
  id: number;
  urlName: string;
}

export interface MaterialCompositeReply {
  state?: string;
  lock?: "NONE" | "LOCKED";
  answers?: {
    fieldName: string;
    value: any;
  }[];
  workspaceMaterialReplyId?: number;
}

export interface StatusType {
  userId: number;
  loggedIn: boolean;
}

export interface WebsocketStateType {
  websocket?: {
    addEventCallback: (event: string, callback: (data: any) => void) => void;
    sendMessage: (
      event: string,
      data: string,
      callback: any,
      stackId: string
    ) => void;
    queueMessage: (
      event: string,
      data: string,
      callback: any,
      stackId: string
    ) => void;
  };
}

export type UsedAs = "default" | "evaluationTool";

export interface ProcessingRuleContext {
  // Material data
  material: Material;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;

  // State
  readOnly: boolean;
  answerable: boolean;
  displayCorrectAnswers: boolean;
  checkAnswers: boolean;
  invisible: boolean;

  // Handlers
  onAnswerChange: (name: string, value: boolean) => void;
  onValueChange: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => void;

  // Other props
  status: StatusType;
  usedAs: UsedAs;
  answerRegistry: Record<string, any>;
  websocketState: WebsocketStateType;
}

export interface MaterialLoaderConfig {
  readOnly?: boolean;
  answerable?: boolean;
  showAnswers?: boolean;
  checkAnswers?: boolean;
  enableEditor?: boolean;
  enableButtons?: boolean;
  enableAssessment?: boolean;
  enableAI?: boolean;
  enableExternalContent?: boolean;
  enableAnswerCounter?: boolean;
  enableProducersLicense?: boolean;
  modifiers?: string | string[];
  className?: string;
}

export interface MaterialLoaderContextValue {
  material: Material;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignmentState: AssignmentStateReturn;
  answerManager: AnswerManagerReturn;
  contentProcessor: React.ReactNode[];
  config: MaterialLoaderConfig;
}

// These will be defined in their respective hook files
export interface AssignmentStateReturn {
  currentState: string;
  stateConfig: AssignmentStateConfig | null;
  readOnly: boolean;
  answerable: boolean;
  buttonConfig: ButtonConfig | null;
  handleStateTransition: (newState: string) => void;
}

export interface AnswerManagerReturn {
  answersVisible: boolean;
  answersChecked: boolean;
  answerCheckable: boolean;
  answerRegistry: Record<string, any>;
  handleAnswerChange: (name: string, value: boolean) => void;
  toggleAnswersVisible: () => void;
}

export interface ButtonConfig {
  className: string;
  text: string;
  disabled: boolean;
  successState?: string;
  successText?: string;
}

export interface AssignmentStateConfig {
  assignmentType: string;
  state: string | string[];
  displaysHideShowAnswersOnRequestButtonIfAllowed?: boolean;
  buttonClass?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
  successState?: string;
  successText?: string;
  fieldsReadOnly?: boolean;
  checksAnswers?: boolean;
  modifyState?: string;
}

// Add processor types
export interface EnhancedHTMLToReactComponentRule {
  shouldProcessHTMLElement: (tag: string, element: HTMLElement) => boolean;
  preventChildProcessing?: boolean;
  processingFunction?: (
    tag: string,
    props: any,
    children: any[],
    element: HTMLElement,
    context?: ProcessingRuleContext
  ) => any;
  preprocessReactProperties?: (
    tag: string,
    props: any,
    children: any[],
    element: HTMLElement,
    context?: ProcessingRuleContext
  ) => string | void;
  preprocessElement?: (element: HTMLElement) => string | void;
  id?: string;
}
