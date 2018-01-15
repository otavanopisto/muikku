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
  } else if (action.type === "UPDATE_GUIDER_FILTER_LABEL"){
    return Object.assign({}, state, {
      labels: state.labels.map((label)=>{
        if (label.id === action.payload.labelId){
          return Object.assign({}, label, action.payload.update)
        }
        return label;
      })
    });
  } else if (action.type === "DELETE_GUIDER_FILTER_LABEL"){
    return Object.assign({}, state, {
      labels: state.labels.filter((label)=>{
        return (label.id !== action.payload);
      })
    });
  }
  return state;
}