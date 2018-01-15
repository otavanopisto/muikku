import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import notificationActions from '~/actions/base/notifications';
import { GuiderWorkspaceListType, GuiderUserLabelListType, GuiderUserLabelType } from '~/reducers/main-function/guider/guider-filters';
import { colorIntToHex } from '~/util/modifiers';

export interface UPDATE_GUIDER_FILTERS_LABELS extends SpecificActionType<"UPDATE_GUIDER_FILTERS_LABELS", GuiderUserLabelListType>{}
export interface UPDATE_GUIDER_FILTERS_WORKSPACES extends SpecificActionType<"UPDATE_GUIDER_FILTERS_WORKSPACES", GuiderWorkspaceListType>{}
export interface UPDATE_GUIDER_FILTERS_ADD_LABEL extends SpecificActionType<"UPDATE_GUIDER_FILTERS_ADD_LABEL", GuiderUserLabelType>{}

export interface UpdateLabelFiltersTriggerType {
  ():AnyActionType
}

export interface UpdateWorkspaceFiltersTriggerType {
  ():AnyActionType
}

export interface CreateGuiderFilterLabel {
  (name: string):AnyActionType
}

let updateLabelFilters:UpdateLabelFiltersTriggerType = function updateLabelFilters(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let currentUser = getState().status.userSchoolDataIdentifier;
    try {
      dispatch({
        type: "UPDATE_GUIDER_FILTERS_LABELS",
        payload: <GuiderUserLabelListType>(await promisify(mApi().user.flags.read({
          ownerIdentifier: currentUser
        }), 'callback')()) || []
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}
  
let updateWorkspaceFilters:UpdateWorkspaceFiltersTriggerType = function updateWorkspaceFilters(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let currentUser = getState().status.userSchoolDataIdentifier;
    try {
      dispatch({
        type: "UPDATE_GUIDER_FILTERS_WORKSPACES",
        payload: <GuiderWorkspaceListType>(await promisify(mApi().workspace.workspaces.read({
          userIdentifier: currentUser,
          maxResults: 500,
          orderBy: "alphabet"
        }), 'callback')()) || []
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}

let createGuiderFilterLabel:CreateGuiderFilterLabel = function createGuiderFilterLabel(name){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let currentUserSchoolDataIdentifier = getState().status.userSchoolDataIdentifier;
    
    let color:number = Math.round(Math.random() * 16777215);
    let label = {
      name,
      color: colorIntToHex(color),
      description: "",
      ownerIdentifier: currentUserSchoolDataIdentifier
    };
    
    try {
      let newLabel:GuiderUserLabelType = <GuiderUserLabelType>await promisify(mApi().user.flags.create(label), 'callback')();
      dispatch({
        type: "UPDATE_GUIDER_FILTERS_ADD_LABEL",
        payload: newLabel
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
    }
  }
}

export {updateLabelFilters, updateWorkspaceFilters, createGuiderFilterLabel}
export default {updateLabelFilters, updateWorkspaceFilters, createGuiderFilterLabel}