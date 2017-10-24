import { ActionType } from "~/actions";

export interface DiscussionAreaType {
  id: number,
  name: string,
  description: string,
  groupId: number,
  numThreads: number
}

export interface DiscussionAreaUpdateType {
  id?: number,
  name?: string,
  description?: string,
  groupId?: number,
  numThreads?: number
}

export interface DiscussionAreaListType extends Array<DiscussionAreaType> {};

export default function areas(state: DiscussionAreaListType=[], action: ActionType): DiscussionAreaListType {
  if (action.type === "UPDATE_DISCUSSION_AREAS"){
    let newAreas:DiscussionAreaListType = action.payload;
    return newAreas;
  } else if (action.type === "PUSH_DISCUSSION_AREA_LAST"){
    let newAreas:DiscussionAreaListType = state.concat([action.payload]);
    return newAreas;
  } else if (action.type === "UPDATE_DISCUSSION_AREA"){
    return state.map((area)=>{
      if (area.id === action.payload.areaId){
        return Object.assign({}, area, action.payload.update);
      }
      return area;
    })
  } else if (action.type === "DELETE_DISCUSSION_AREA"){
    return state.filter(area=>area.id!==action.payload);
  }
  return state;
}