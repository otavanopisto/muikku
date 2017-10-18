import { ActionType } from "~/actions";

export interface DiscussionAreaType {
  id: number,
  name: string,
  description: string,
  groupId: number,
  numThreads: number
}

export interface DiscussionAreaListType extends Array<DiscussionAreaType> {};

export default function areas(state: DiscussionAreaListType=[], action: ActionType): DiscussionAreaListType {
  if (action.type === "UPDATE_DISCUSSION_AREAS"){
    let newAreas:DiscussionAreaListType = action.payload;
    return newAreas;
  }
  return state;
} 