/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsedAs } from "~/@types/shared";
import { MaterialCompositeReply } from "~/generated/client";
import { StatusType } from "~/reducers/base/status";
import { WebsocketStateType } from "~/reducers/util/websocket";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";

/**
 * CKEditor 4 parser that handles all field types
 */
export interface FieldDataParser {
  /**
   * Parse field data from a CKEditor 4 element
   * @param element - The CKEditor 4 element to parse
   * @returns The parsed field data
   */
  parseFieldData(
    element: HTMLElement,
    props: MaterialLoaderBaseData
  ): FieldData;
}

/**
 * Base interface for all field data
 */
export interface FieldData {
  type: string;
  content: any;
  parameters: Record<string, any>;
}

/**
 * MaterialLoaderBaseData
 */
export interface MaterialLoaderBaseData {
  material: MaterialContentNodeWithIdAndLogic;
  status: StatusType;
  workspace: WorkspaceDataType;
  websocketState: WebsocketStateType;
  answerable: boolean;
  compositeReplies?: MaterialCompositeReply;
  readOnly?: boolean;
  onConfirmedAndSyncedModification?: () => any;
  onModification?: () => any;
  displayCorrectAnswers: boolean;
  checkAnswers: boolean;
  onAnswerChange: (name: string, status: boolean) => any;
  onAnswerCheckableChange: (status: boolean) => any;
  usedAs: UsedAs;
  invisible: boolean;
  answerRegistry?: { [name: string]: any };
}

/**
 * TextField specific interfaces
 */
export interface TextFieldContent {
  autogrow: boolean;
  columns: string;
  hint: string;
  name: string;
  rightAnswers: Array<{
    caseSensitive: boolean;
    correct: boolean;
    normalizeWhitespace: boolean;
    text: string;
  }>;
}
