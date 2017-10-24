import notificationActions from '~/actions/base/notifications';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import { DiscussionAreaListType, DiscussionAreaType, DiscussionAreaUpdateType } from '~/reducers/main-function/discussion/discussion-areas';

export interface UPDATE_DISCUSSION_AREAS extends SpecificActionType<"UPDATE_DISCUSSION_AREAS", DiscussionAreaListType>{}
export interface PUSH_DISCUSSION_AREA_LAST extends SpecificActionType<"PUSH_DISCUSSION_AREA_LAST", DiscussionAreaType>{}
export interface UPDATE_DISCUSSION_AREA extends SpecificActionType<"UPDATE_DISCUSSION_AREA", {
  areaId: number,
  update: DiscussionAreaUpdateType
}>{}
export interface DELETE_DISCUSSION_AREA extends SpecificActionType<"DELETE_DISCUSSION_AREA", number>{}

export interface LoadDiscussionAreasTriggerType {
  (callback?: ()=>any):AnyActionType
}

let loadDiscussionAreas:LoadDiscussionAreasTriggerType = function loadDiscussionAreas(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      dispatch({
        type: 'UPDATE_DISCUSSION_AREAS',
        payload: <DiscussionAreaListType>await promisify(mApi().forum.areas.read(), 'callback')()
      });
      callback && callback();
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}
  
export interface CreateDiscussionAreaTriggerType {
  (data:{name: string, description: string, success?: ()=>any, fail?: ()=>any}):AnyActionType
}

let createDiscussionArea:CreateDiscussionAreaTriggerType = function createDiscussionArea(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let newArea = <DiscussionAreaType>await promisify(mApi().forum.areas.create({
        name: data.name,
        description: data.description
      }), 'callback')();
      dispatch({
        type: 'PUSH_DISCUSSION_AREA_LAST',
        payload: newArea
      });
      location.hash = "#" + newArea.id;
      data.success && data.success();
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      data.fail && data.fail();
    }
  }
}
  
export interface UpdateDiscussionAreaTriggerType {
  (data:{id: number, name: string, description: string, success?: ()=>any, fail?: ()=>any}):AnyActionType
}

let updateDiscussionArea:UpdateDiscussionAreaTriggerType = function updateDiscussionArea(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      await promisify(mApi().forum.areas.update(data.id, {
        name: data.name,
        description: data.description
      }), 'callback')();
      dispatch({
        type: 'UPDATE_DISCUSSION_AREA',
        payload: {
          areaId: data.id,
          update: {
            name: data.name,
            description: data.description
          }
        }
      });
      data.success && data.success();
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      data.fail && data.fail();
    }
  }
}
  
export interface DeleteDiscussionAreaTriggerType {
  (data:{id: number, success?: ()=>any, fail?: ()=>any}):AnyActionType
}

let deleteDiscussionArea:DeleteDiscussionAreaTriggerType = function deleteDiscussionArea(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      await promisify(mApi().forum.areas.del(data.id), 'callback')();
      location.hash = "";
      dispatch({
        type: 'DELETE_DISCUSSION_AREA',
        payload: data.id
      });
      data.success && data.success();
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      data.fail && data.fail();
    }
  }
}
  
export {loadDiscussionAreas, createDiscussionArea, updateDiscussionArea, deleteDiscussionArea}
export default {loadDiscussionAreas, createDiscussionArea, updateDiscussionArea, deleteDiscussionArea}