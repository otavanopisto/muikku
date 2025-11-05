/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsedAs } from "~/@types/shared";
import {
  MaterialAssigmentType,
  MaterialCompositeReplyStateType,
} from "~/generated/client";
import { StatusType } from "~/reducers/base/status";

/**
 * State configuration interface (cleaned up from current STATES array)
 */
export interface StateConfig {
  assignmentType: MaterialAssigmentType;
  states: MaterialCompositeReplyStateType[] | MaterialCompositeReplyStateType;
  buttonClass: string;
  buttonText: string;
  buttonDisabled: boolean;
  successState?: MaterialCompositeReplyStateType;
  fieldsReadOnly?: boolean;
  checksAnswers?: boolean;
  displaysHideShowAnswersButton?: boolean;
  modifyState?: MaterialCompositeReplyStateType;
  successText?: string;
}

/**
 * Common field props interface
 */
export interface CommonFieldProps {
  userId: number;
  key?: number;
  type: string;
  readOnly?: boolean;
  initialValue?: string;
  status: StatusType;
  usedAs: UsedAs;
  content: any;
  onChange?: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => any;
  invisible?: boolean;
  displayCorrectAnswers?: boolean;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => any;
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
