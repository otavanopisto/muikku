/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InterimEvaluationRequest,
  MaterialAssigmentType,
  MaterialCompositeReply,
  MaterialCompositeReplyStateType,
  MaterialContentNode,
  MaterialEvaluation,
  WorkspaceActivity,
  WorkspaceMaterial,
} from "~/generated/client";

// Content version support for CKEditor 4 → Tiptap migration
export type ContentVersion = "ckeditor4" | "tiptap";

/**
 * State configuration interface (cleaned up from current STATES array)
 */
export interface StateConfig {
  readonly assignmentType: MaterialAssigmentType;
  readonly states: MaterialCompositeReplyStateType[];
  readonly button: {
    readonly className: string;
    readonly text: string;
    readonly disabled: boolean;
    readonly action: string;
  };
  readonly behavior: {
    readonly checksAnswers: boolean;
    readonly fieldsReadOnly: boolean;
    readonly displaysHideShowAnswersButton: boolean;
    readonly canModify: boolean;
  };
  readonly transitions: {
    readonly successState: MaterialCompositeReplyStateType;
    readonly modifyState?: MaterialCompositeReplyStateType;
    readonly successText?: string;
  };
}

/**
 * Data provider interface (abstracts data source)
 */
export interface DataProvider {
  readonly folder: {
    readonly contentVersion: ContentVersion;
  } & MaterialContentNode;

  // Material data
  readonly material: {
    readonly contentVersion: ContentVersion;
    readonly evaluation?: MaterialEvaluation;
    readonly assignment?: WorkspaceMaterial;
  } & MaterialContentNode;

  // Workspace data
  readonly workspace: {
    readonly id: number;
    readonly urlName: string;
    readonly language: string;
    readonly activity?: WorkspaceActivity;
    readonly interimEvaluationRequests?: InterimEvaluationRequest[];
  };

  // Context tool
  readonly context: {
    readonly tool: ContextTool;
  };

  // Current state
  readonly currentState: MaterialCompositeReplyStateType;
  readonly assignmentType: MaterialAssigmentType;

  // User permissions
  readonly canEdit: boolean;
  readonly canSubmit: boolean;
  readonly canViewAnswers: boolean;

  // Field data
  readonly fields: FieldData[];
  readonly answers: AnswerData[];

  // Context-specific methods
  readonly getInterimEvaluationRequest?: () =>
    | InterimEvaluationRequest
    | undefined;

  // Actions
  onFieldChange: (fieldName: string, value: any) => void;
  onSubmit: () => Promise<void>;
  onModify: () => Promise<void>;
}

/**
 * Field-related types
 */
export interface FieldData {
  readonly name: string;
  readonly type: string;
  readonly content: any;
  readonly required: boolean;
}

/**
 * Answer data interface
 */
export interface AnswerData {
  readonly fieldName: string;
  readonly value: any;
  readonly timestamp: Date;
}

/**
 * Field context for state management
 */
export interface FieldContext {
  readonly name: string;
  readonly value: any;
  readonly modified: boolean;
  readonly synced: boolean;
  readonly syncError?: string;
  setState: (state: Partial<FieldContext>) => void;
}

/**
 * Sync-related types
 */
export interface SyncMessage {
  readonly fieldName: string;
  readonly value: any;
  readonly materialId: number;
  readonly workspaceId: number;
  readonly userId: number;
}

export type ContextTool = "evaluation" | "materials" | "exams";

/**
 * Material loader props interface
 */
export interface MaterialLoaderV2Props {
  readonly invisible?: boolean;
  readonly dataProvider: DataProvider;
  readonly stateConfigs: StateConfig[];
  readonly children: (
    props: RenderProps,
    state: RenderState,
    config: StateConfig
  ) => React.ReactElement;
  readonly modifiers?: string | string[];
  readonly id?: string;
  readonly websocket: any;
  readonly readOnly?: boolean;
}

/**
 * Props passed to render function
 */
export interface RenderProps {
  readonly folder: DataProvider["folder"];
  readonly material: DataProvider["material"];
  readonly workspace: DataProvider["workspace"];
  readonly context: DataProvider["context"];
  readonly currentState: MaterialCompositeReplyStateType;
  readonly assignmentType: MaterialAssigmentType;
  readonly canEdit: boolean;
  readonly canSubmit: boolean;
  readonly canViewAnswers: boolean;
  readonly fields: FieldData[];
  readonly answers: AnswerData[];
  readonly invisible?: boolean;
  readonly readOnly?: boolean;
  readonly getInterimEvaluationRequest?: () => InterimEvaluationRequest;
  readonly onFieldChange: (fieldName: string, value: any) => void;
  readonly onSubmit: () => Promise<void>;
  readonly onModify: () => Promise<void>;
}

/**
 * State passed to render function
 */
export interface RenderState {
  readonly elements: HTMLElement[];
  readonly compositeReply?: MaterialCompositeReply;
  readonly stateConfiguration?: StateConfig;
}

// DATASETS
/**
 * WordDefinitionDataset
 */
export interface WordDefinitionDataset {
  muikkuWordDefinition: string;
}

/**
 * LinkDataset
 */
export interface LinkDataset {
  url?: string;
}

/**
 * ImageDataset
 */
export interface ImageDataset {
  author: string;
  authorUrl: string;
  license: string;
  licenseUrl: string;
  source: string;
  sourceUrl: string;
  original?: string;
}

/**
 * IframeDataset
 */
export interface IframeDataset {
  url?: string;
}

export type StaticDataset =
  | WordDefinitionDataset
  | LinkDataset
  | ImageDataset
  | IframeDataset;
