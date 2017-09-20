import {ActionType} from "~/actions";
import {NotificationType, NotificationListType} from '~/reducers';

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