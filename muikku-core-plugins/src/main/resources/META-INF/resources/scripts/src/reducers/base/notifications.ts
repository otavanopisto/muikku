import {ActionType} from "~/actions";
import {NotificationType, NotificationListType} from '~/reducers/index.d';

export default function notifications(state: NotificationListType=[], action: ActionType){
  if (action.type === 'ADD_NOTIFICATION') {
    let newNotification: NotificationType = action.payload;
    return state.concat(newNotification);
  } else if (action.type === 'HIDE_NOTIFICATION') {
    return state.filter((element: NotificationType)=>element.id !== action.payload.id);
  }
  return state;
}