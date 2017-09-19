import {ActionType} from "~/actions";

export default function notifications(state: NotificationListType=[], action: ActionType<any>){
  if (action.type === 'ADD_NOTIFICATION') {
    let id: number = (new Date()).getTime();
    let newNotification: NotificationType = Object.assign({id: id}, action.payload);
    return state.concat(newNotification);
  } else if (action.type === 'HIDE_NOTIFICATION') {
    return state.filter((element: NotificationType)=>element.id !== action.payload.id);
  }
  return state;
}

export interface NotificationType {
  id?: number,
  severity: "error" | "warning" | "loading" | "default" | "warning" | "info" | "fatal" | "success" | "secondary" | "inverse",
  message: string
}

export interface NotificationListType extends Array<NotificationType> {};