import { ActionType } from "~/actions";
import { WorkspaceType, WorkspaceListType } from "~/reducers/main-function/index/workspaces";

export interface GuiderUserLabelType {
  id: number,
  name: string,
  color: string,
  description: string,
  ownerIdentifier: string
}

export type GuiderUserLabelListType = Array<GuiderUserLabelType>;

export type GuiderWorkspaceType = WorkspaceType;
export type GuiderWorkspaceListType = WorkspaceListType;

export interface GuiderFilterType {
  labels: GuiderUserLabelListType,
  workspaces: GuiderWorkspaceListType
}

export default function areas(state: GuiderFilterType={
  labels: [],
  workspaces: []
}, action: ActionType): GuiderFilterType {
  if (action.type === "UPDATE_GUIDER_FILTERS_LABELS"){
    return Object.assign({}, state, {
      labels: action.payload
    });
  } else if (action.type === "UPDATE_GUIDER_FILTERS_WORKSPACES"){
    return Object.assign({}, state, {
      workspaces: action.payload
    });
  } else if (action.type === "UPDATE_GUIDER_FILTERS_ADD_LABEL"){
    return Object.assign({}, state, {
      labels: state.labels.concat([action.payload])
    });
  }
  return state;
}