import notificationActions from '~/actions/base/notifications';
import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {AnnouncementsStateType, AnnouncementsPatchType,
  AnnouncementListType, AnnouncementType, AnnouncementUpdateType, AnnouncementsType} from '~/reducers/announcements';
import { loadAnnouncementsHelper } from './helpers';
import { AnnouncerNavigationItemListType } from '~/reducers/announcements';
import moment from '~/lib/moment';
import { StateType } from '~/reducers';
import { loadUserGroupIndex } from '~/actions/user-index';

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
export interface UPDATE_ANNOUNCEMENTS extends SpecificActionType<"UPDATE_ANNOUNCEMENTS", AnnouncementListType>{}

export interface LoadAnnouncementsAsAClientTriggerType {
  (options?: any, callback?: (announcements:AnnouncementListType )=>any):AnyActionType
}

//TODO notOverrideCurrent should go once the missing data in the current announcement is fixed
export interface LoadAnnouncementsTriggerType {
  (location:string, workspaceId?:number, notOverrideCurrent?: boolean, force?: boolean):AnyActionType
}

export interface LoadAnnouncementTriggerType {
  (location:string, announcementId:number, workspaceId?: number):AnyActionType
}

export interface AddToAnnouncementsSelectedTriggerType {
  (announcement: AnnouncementType):AnyActionType
}

export interface RemoveFromAnnouncementsSelectedTriggerType {
  (announcement: AnnouncementType):AnyActionType
}

export interface UpdateAnnouncementTriggerType {
  (data:{
    announcement: AnnouncementType,
    update: AnnouncementUpdateType,
    success?: ()=>any,
    fail?: ()=>any,
    cancelRedirect?: boolean
  }):AnyActionType
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

interface AnnouncementGeneratorType {
  caption: string,
  content: string,
  endDate: string,
  publiclyVisible: boolean,
  startDate: string,
  userGroupEntityIds: Array<number>,
  workspaceEntityIds: Array<number>
}

export interface CreateAnnouncementTriggerType {
  (data: {
    announcement: AnnouncementGeneratorType,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

function validateAnnouncement(dispatch:(arg:AnyActionType)=>any, getState:()=>StateType, announcement: AnnouncementGeneratorType){
  if (!announcement.caption){
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.announcer.errormessage.createAnnouncement.missing.caption"), 'error'));
    return false;
  } else if (!announcement.content){
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.announcer.errormessage.createAnnouncement.missing.content"), 'error'));
    return false;
  } else if (!announcement.endDate){
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.announcer.errormessage.createAnnouncement.missing.endDate"), 'error'));
    return false;
  } else if (!announcement.startDate){
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.announcer.errormessage.createAnnouncement.missing.startDate"), 'error'));
    return false;
  }

  return true;
}

let loadAnnouncements:LoadAnnouncementsTriggerType = function loadAnnouncements(location, workspaceId, notOverrideCurrent, force){
  return loadAnnouncementsHelper.bind(this, location, workspaceId, notOverrideCurrent, force);
}

let loadAnnouncement:LoadAnnouncementTriggerType = function loadAnnouncement(location, announcementId, workspaceId){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    let announcement:AnnouncementType = state.announcements.announcements.find((a:AnnouncementType)=>a.id === announcementId);
    try {
      if (!announcement){
        announcement = <AnnouncementType>await promisify(mApi().announcer.announcements.read(announcementId), 'callback')();
        announcement.userGroupEntityIds.forEach(id=>dispatch(loadUserGroupIndex(id)));
        //TODO we should be able to get the information of wheter there is an announcement later or not, trace all this
        //and remove the unnecessary code

        //this is where notOverrideCurrent plays a role when loading all the other announcements after itself
        dispatch(loadAnnouncements(location, workspaceId, true, false));
      } else {
        // load the user group entities if not loaded for that announcement
        // this doe not reload if it's found
        announcement.userGroupEntityIds.forEach(id=>dispatch(loadUserGroupIndex(id)));
      }

      dispatch({
        type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
        payload: {
          location,
          current: announcement
        }
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.announcer.errormessage.loadAnnouncement"), 'error'));
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

let updateAnnouncement:UpdateAnnouncementTriggerType = function updateAnnouncement(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();
    let announcements:AnnouncementsType = state.announcements;

    if (!validateAnnouncement(dispatch, getState, data.announcement)){return data.fail && data.fail()};

    try {
      let nAnnouncement:AnnouncementType = Object.assign({}, data.announcement, data.update);
      await promisify(mApi().announcer.announcements.update(data.announcement.id, nAnnouncement), 'callback')();

      let diff = moment(nAnnouncement.endDate).diff(moment(), 'days');
      if (announcements.location !== "active" && diff >= 0){
        if (data.cancelRedirect){
          dispatch({
            type: "DELETE_ANNOUNCEMENT",
            payload: data.announcement
          });
          return;
        }
        location.hash = "#active";
      } else if (announcements.location !== "past" && diff < 0){
        if (data.cancelRedirect){
          dispatch({
            type: "DELETE_ANNOUNCEMENT",
            payload: data.announcement
          });
          return;
        }
        location.hash = "#past";
      } else {
        dispatch({
          type: "UPDATE_ONE_ANNOUNCEMENT",
          payload: {
            update: <AnnouncementUpdateType>await promisify(mApi().announcer.announcements.read(data.announcement.id), 'callback')(),
            announcement: data.announcement
          }
        });
      }
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.announcer.errormessage.updateAnnouncement"), 'error'));
      data.fail && data.fail();
    }
  }
}

let deleteAnnouncement:DeleteAnnouncementTriggerType = function deleteAnnouncement(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
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
      if (!(err instanceof MApiError)){
        throw err;
      }
      data.fail();
    }
  }
}

let deleteSelectedAnnouncements:DeleteSelectedAnnouncementsTriggerType = function deleteSelectedAnnouncements(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
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
        if (!(err instanceof MApiError)){
          throw err;
        }
        dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.announcer.errormessage.deleteAnnouncement"), 'error'));
      }
    }));
  }
}

let createAnnouncement:CreateAnnouncementTriggerType = function createAnnouncement(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();
    let announcements:AnnouncementsType = state.announcements;

    if (!validateAnnouncement(dispatch, getState, data.announcement)){return data.fail && data.fail()};

    try {
      await promisify(mApi().announcer.announcements.create(data.announcement), 'callback')();

      let diff = moment(data.announcement.endDate).diff(moment(), 'days');
      if (announcements.location !== "active" && diff >= 0){
        location.hash = "#active";
      } else if (announcements.location !== "past" && diff < 0){
        location.hash = "#past";
      } else {
        //TODO why in the world the request to create the announcement does not return the created object?
        //I am forced to reload all the announcements due to being unable to know what was created
        dispatch(loadAnnouncements(announcements.location, announcements.workspaceId, true, true));
      }
      data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.announcer.errormessage.createAnnouncement"), 'error'));
      data.fail();
    }
  }
}

let loadAnnouncementsAsAClient:LoadAnnouncementsAsAClientTriggerType = function loadAnnouncementsFromServer(options={hideWorkspaceAnnouncements: "false", loadUserGroups: true}, callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: "UPDATE_ANNOUNCEMENTS_STATE",
        payload: <AnnouncementsStateType>"LOADING"
      });

      const loadUserGroups = options.loadUserGroups;
      delete options.loadUserGroups;
      
      let announcements:AnnouncementListType = <AnnouncementListType>await promisify(mApi().announcer.announcements.read(options), 'callback')();
      if (loadUserGroups) {
        announcements.forEach(a=>a.userGroupEntityIds.forEach(id=>dispatch(loadUserGroupIndex(id))));
      }
      
      let payload:AnnouncementsPatchType = {
        state: "READY",
        announcements,
        location: null,
        selected: [],
        selectedIds: []
      }
      
      //And there it goes
      dispatch({
        type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
        payload
      });
      
      callback && callback(announcements);
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.announcer.errormessage.loadAnnouncements"), 'error'));
    }
  }
}

export {loadAnnouncements, addToAnnouncementsSelected, removeFromAnnouncementsSelected,
  updateAnnouncement, loadAnnouncement, deleteSelectedAnnouncements, deleteAnnouncement,
  createAnnouncement, loadAnnouncementsAsAClient}
export default {loadAnnouncements, addToAnnouncementsSelected, removeFromAnnouncementsSelected,
  updateAnnouncement, loadAnnouncement, deleteSelectedAnnouncements, deleteAnnouncement,
  createAnnouncement, loadAnnouncementsAsAClient}
