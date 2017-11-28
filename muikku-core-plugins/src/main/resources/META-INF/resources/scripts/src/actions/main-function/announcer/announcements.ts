import notificationActions from '~/actions/base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {AnnouncementsStateType, AnnouncementsPatchType,
  AnnouncementListType, AnnouncementType, AnnouncementUpdateType, AnnouncementsType} from '~/reducers/main-function/announcer/announcements';
import { loadAnnouncementsHelper } from './announcements/helpers';
import { AnnouncerNavigationItemListType } from '~/reducers/main-function/announcer/announcer-navigation';

export interface UPDATE_ANNOUNCEMENTS_STATE extends SpecificActionType<"UPDATE_ANNOUNCEMENTS_STATE", AnnouncementsStateType>{}
export interface UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES extends SpecificActionType<"UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES", AnnouncementsPatchType>{}
export interface UPDATE_SELECTED_ANNOUNCEMENTS extends SpecificActionType<"UPDATE_SELECTED_ANNOUNCEMENTS", AnnouncementListType>{}
export interface ADD_TO_ANNOUNCEMENTS_SELECTED extends SpecificActionType<"ADD_TO_ANNOUNCEMENTS_SELECTED", AnnouncementType>{}
export interface REMOVE_FROM_ANNOUNCEMENTS_SELECTED extends SpecificActionType<"REMOVE_FROM_ANNOUNCEMENTS_SELECTED", AnnouncementType>{}
export interface SET_CURRENT_ANNOUNCEMENT extends SpecificActionType<"SET_CURRENT_ANNOUNCEMENT", AnnouncementType>{}
export interface UPDATE_ONE_ANNOUNCEMENT extends SpecificActionType<"UPDATE_ONE_ANNOUNCEMENT", {
  update: AnnouncementUpdateType,
  announcement: AnnouncementType
}>{}
export interface DELETE_ANNOUNCEMENT extends SpecificActionType<"DELETE_ANNOUNCEMENT", AnnouncementType>{}

//TODO notOverrideCurrent should go once the missing data in the current announcement is fixed
export interface LoadAnnouncementsTriggerType {
  (location:string, workspaceId?:number, notOverrideCurrent?: boolean):AnyActionType
}

export interface LoadAnnouncementTriggerType {
  (location:string, announcementId:number):AnyActionType
}

export interface AddToAnnouncementsSelectedTriggerType {
  (announcement: AnnouncementType):AnyActionType
}

export interface RemoveFromAnnouncementsSelectedTriggerType {
  (announcement: AnnouncementType):AnyActionType
}

export interface UpdateAnnouncementTriggerType {
  (announcement: AnnouncementType, update: AnnouncementUpdateType):AnyActionType
}

export interface DeleteAnnouncementTriggerType {
  (data: {
    announcement: AnnouncementType,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

export interface DeleteSelectedAnnouncementsTriggerType {
  ():AnyActionType
}

let loadAnnouncements:LoadAnnouncementsTriggerType = function loadAnnouncements(location, workspaceId, notOverrideCurrent){
  return loadAnnouncementsHelper.bind(this, location, workspaceId, notOverrideCurrent);
}
  
let loadAnnouncement:LoadAnnouncementTriggerType = function loadAnnouncement(location, announcementId){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let navigation:AnnouncerNavigationItemListType = state.announcerNavigation;
    let announcements:AnnouncementsType = state.announcements;
    
    let announcement:AnnouncementType = state.announcements.announcements.find((a:AnnouncementType)=>a.id === announcementId);
    try {
      if (!announcement){
        announcement = <AnnouncementType>await promisify(mApi().announcer.announcements.read(announcementId), 'callback')();
        //TODO we should be able to get the information of wheter there is an announcement later or not, trace all this
        //and remove the unnecessary code
        dispatch(loadAnnouncements(location, null, false));
      }
      
      dispatch({
        type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
        payload: {
          location,
          current: announcement
        }
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}

let addToAnnouncementsSelected:AddToAnnouncementsSelectedTriggerType = function addToAnnouncementsSelected(announcement){
  return {
    type: "ADD_TO_ANNOUNCEMENTS_SELECTED",
    payload: announcement
  }
}

let removeFromAnnouncementsSelected:RemoveFromAnnouncementsSelectedTriggerType = function removeFromAnnouncementsSelected(announcement){
  return {
    type: "REMOVE_FROM_ANNOUNCEMENTS_SELECTED",
    payload: announcement
  }
}

let updateAnnouncement:UpdateAnnouncementTriggerType = function updateAnnouncement(announcement, update){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      await promisify(mApi().announcer.announcements.update(announcement.id, update), 'callback')();
      dispatch({
        type: "UPDATE_ONE_ANNOUNCEMENT",
        payload: {
          update,
          announcement
        }
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}

let deleteAnnouncement:DeleteAnnouncementTriggerType = function deleteAnnouncement(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let announcements:AnnouncementsType = state.announcements;
    
    try {
      await promisify(mApi().announcer.announcements.del(data.announcement.id), 'callback')();
      dispatch({
        type: "DELETE_ANNOUNCEMENT",
        payload: data.announcement
      });
      data.success();
    } catch (err){
      data.fail();
    }
  }
}

let deleteSelectedAnnouncements:DeleteSelectedAnnouncementsTriggerType = function deleteSelectedAnnouncements(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let state = getState();
    let announcements:AnnouncementsType = state.announcements;
    
    await Promise.all(announcements.selected.map(async (announcement)=>{
      try {
        await promisify(mApi().announcer.announcements.del(announcement.id), 'callback')();
        dispatch({
          type: "DELETE_ANNOUNCEMENT",
          payload: announcement
        });
      } catch(err){
        dispatch(notificationActions.displayNotification(err.message, 'error'));
      }
    }));
  }
}

export {loadAnnouncements, addToAnnouncementsSelected, removeFromAnnouncementsSelected,
  updateAnnouncement, loadAnnouncement, deleteSelectedAnnouncements, deleteAnnouncement}
export default {loadAnnouncements, addToAnnouncementsSelected, removeFromAnnouncementsSelected,
  updateAnnouncement, loadAnnouncement, deleteSelectedAnnouncements, deleteAnnouncement}