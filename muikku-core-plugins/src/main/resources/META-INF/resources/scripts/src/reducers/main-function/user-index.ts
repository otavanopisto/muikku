import { ActionType } from "~/actions";

export interface UserType {
  id: Number,
  firstName: string,
  lastName?: string | null,
  nickName?: string | null,
  studyProgrammeName?: string | null,
  hasImage: boolean,
  hasEvaluationFees: false,
  curriculumIdentifier?: string | number | null;
}

export interface UserIndexType {
  [index: number]: UserType
}

export default function userIndex(state={}, action: ActionType){
  if (action.type === "SET_USER_INDEX"){
    let prop:{[index: number]: UserType} = {};
    prop[action.payload.index] = action.payload.value;
    return Object.assign({}, state, prop);
  }
  return state;
}