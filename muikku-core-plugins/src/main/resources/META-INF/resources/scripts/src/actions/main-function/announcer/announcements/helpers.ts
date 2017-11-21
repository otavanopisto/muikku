import { AnyActionType } from "~/actions";
import { AnnouncerNavigationItemListType, AnnouncerNavigationItemType } from "~/reducers/main-function/announcer/announcer-navigation";
import { AnnouncementsType, AnnouncementsStateType, AnnouncementListType, AnnouncementsPatchType } from "~/reducers/main-function/announcer/announcements";
import { StatusType } from "~/reducers/base/status";
import promisify from "~/util/promisify";
import mApi from '~/lib/mApi';
import notificationActions from '~/actions/base/notifications';

const MAX_LOADED_AT_ONCE = 30;

export async function loadAnnouncementsHelper(location:string | null, workspaceId: number, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
  //Remove the current messsage
  dispatch({
    type: "SET_CURRENT_MESSAGE_THREAD",
    payload: null
  });
  
  let state = getState();
  let navigation:AnnouncerNavigationItemListType = state.announcerNavigation;
  let announcements:AnnouncementsType = state.announcements;
  let status:StatusType = state.status;
  let actualLocation:string = location || announcements.location;
  
  //Avoid loading announcements if it's the same location
  if (actualLocation === announcements.location && announcements.state === "READY"){
    return;
  }
  
  //We set this state to loading
  dispatch({
    type: "UPDATE_ANNOUNCEMENTS_STATE",
    payload: <AnnouncementsStateType>"LOADING"
  });
  
  //We get the navigation location item
  let item:AnnouncerNavigationItemType = navigation.find((item)=>{
    return item.location === actualLocation;
  });
  if (!item){
    return dispatch({
      type: "UPDATE_ANNOUNCEMENTS_STATE",
      payload: <AnnouncementsStateType>"ERROR"
    });
  }
  
  let params:any = {
    onlyEditable: true,
    hideEnvironmentAnnouncements: !status.permissions.ANNOUNCER_CAN_PUBLISH_ENVIRONMENT,
  }
  if (workspaceId){
    params.workspaceEntityId = workspaceId;
  }
  switch (item.id) {
    case "past":
      params.timeFrame = "EXPIRED";
    break;
    case "archived":
      params.timeFrame = "ALL";
      params.onlyArchived = true;
    break;
    case "mine":
      params.timeFrame = "ALL";
      params.onlyMine = true;
    break;
    default:
      params.timeFrame = "CURRENTANDUPCOMING";
    break;
  }
  
  try {
    let announcements:AnnouncementListType = <AnnouncementListType>await promisify(mApi().announcer.announcements.read(params), 'callback')();
    //Create the payload for updating all the announcer properties
    let properLocation = location || item.location;
    let payload:AnnouncementsPatchType = {
      state: "READY",
      announcements,
      location: properLocation,
      selected: [],
      selectedIds: []
    }
    
    //And there it goes
    dispatch({
      type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
      payload
    });
  } catch (err){
    //Error :(
    dispatch(notificationActions.displayNotification(err.message, 'error'));
    dispatch({
      type: "UPDATE_ANNOUNCEMENTS_STATE",
      payload: <AnnouncementsStateType>"ERROR"
    });
  }
}