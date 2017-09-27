import actions from '~/actions/base/notifications';
import {colorIntToHex, hexToColorInt} from '~/util/modifiers';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';  
import {AnyActionType, SpecificActionType} from '~/actions';
import {CommunicatorNavigationItemListType, CommunicatorNavigationItemType,
  LabelListType, LabelType} from '~/reducers/main-function/communicator/communicator-navigation';

//////// ACTION INTERFACE
export interface UPDATE_COMMUNICATOR_NAVIGATION_LABELS extends SpecificActionType<"UPDATE_COMMUNICATOR_NAVIGATION_LABELS", CommunicatorNavigationItemListType>{}
export interface ADD_COMMUNICATOR_NAVIGATION_LABEL extends SpecificActionType<"ADD_COMMUNICATOR_NAVIGATION_LABEL", CommunicatorNavigationItemType>{}
export interface UPDATE_ONE_LABEL_FROM_ALL_MESSAGES extends SpecificActionType<"UPDATE_ONE_LABEL_FROM_ALL_MESSAGES", {
  labelId: number,
  update: {
    labelName: string,
    labelColor: number
  }
}>{}
export interface UPDATE_COMMUNICATOR_NAVIGATION_LABEL extends SpecificActionType<"UPDATE_COMMUNICATOR_NAVIGATION_LABEL", {
  labelId: number,
  update: {
    text: ()=>string,
    color: string
  }
}>{}
export interface DELETE_COMMUNICATOR_NAVIGATION_LABEL extends SpecificActionType<"DELETE_COMMUNICATOR_NAVIGATION_LABEL", {
  labelId: number
}>{}
export interface REMOVE_ONE_LABEL_FROM_ALL_MESSAGES extends SpecificActionType<"REMOVE_ONE_LABEL_FROM_ALL_MESSAGES", {
  labelId: number
}>{}

//////// TRIGGER INTERFACE
export interface UpdateCommunicatorNavigationLabelsTriggerType {
  (callback: ()=>any):AnyActionType
}

export interface AddCommunicatorLabelTriggerType {
  (name: string):AnyActionType
}

export interface UpdateCommunicatorLabelTriggerType {
  (label:CommunicatorNavigationItemType, newName:string, newColor:string):AnyActionType
}

export interface RemoveLabelTriggerType {
  (label: CommunicatorNavigationItemType):AnyActionType
}

let updateCommunicatorNavigationLabels:UpdateCommunicatorNavigationLabelsTriggerType = function updateCommunicatorNavigationLabels(callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let labels:LabelListType = <LabelListType>await promisify(mApi().communicator.userLabels.read(), 'callback')();
      dispatch({
        type: 'UPDATE_COMMUNICATOR_NAVIGATION_LABELS',
        payload: labels.map((label: LabelType)=>{
          return {
            location: "label-" + label.id,
            id: label.id,
            type: "label",
            icon: "tag",
            text(){return label.name},
            color: colorIntToHex(label.color)
          }
        })
      });
      callback && callback();
    } catch (err) {
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

let addCommunicatorLabel:AddCommunicatorLabelTriggerType = function addCommunicatorLabel(name){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let color = Math.round(Math.random() * 16777215);
    let label = {
      name,
      color
    };
    
    try {
      let newLabel:LabelType = <LabelType>await promisify(mApi().communicator.userLabels.create(label), 'callback')();
      dispatch({
        type: "ADD_COMMUNICATOR_NAVIGATION_LABEL",
        payload: {
          location: "label-" + newLabel.id,
          id: newLabel.id,
          type: "label",
          icon: "tag",
          text(){return newLabel.name},
          color: colorIntToHex(newLabel.color)
        }
      });
    } catch (err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

let updateCommunicatorLabel:UpdateCommunicatorLabelTriggerType = function updateCommunicatorLabel(label, newName, newColor){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let newLabelData = {
      name: newName,
      color: hexToColorInt(newColor),
      id: label.id
    };
    
    try {
      await promisify(mApi().communicator.userLabels.update(label.id, newLabelData), 'callback')();
      dispatch({
        type: "UPDATE_ONE_LABEL_FROM_ALL_MESSAGES",
        payload: {
          labelId: <number>label.id,
          update: {
            labelName: newLabelData.name,
            labelColor: newLabelData.color
          }
        }
      });
      dispatch({
        type: "UPDATE_COMMUNICATOR_NAVIGATION_LABEL",
        payload: {
          labelId: <number>label.id,
          update: {
            text: ()=>newLabelData.name,
            color: newColor
          }
        }
      });
    } catch(err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

let removeLabel:RemoveLabelTriggerType = function removeLabel(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      await promisify(mApi().communicator.userLabels.del(label.id), 'callback')();
      let {communicatorMessages} = getState();
      
      //Notice this is an external trigger, not the nicest thing, but as long as we use hash navigation, meh
      if (communicatorMessages.location === label.location){
        location.hash = "#inbox";
      }
      
      dispatch({
        type: "DELETE_COMMUNICATOR_NAVIGATION_LABEL",
        payload: {
          labelId: <number>label.id
        }
      });
      dispatch({
        type: "REMOVE_ONE_LABEL_FROM_ALL_MESSAGES",
        payload: {
          labelId: <number>label.id
        }
      });
    } catch (err){
      dispatch(actions.displayNotification(err.message, 'error'));
    }
  }
}

export default {updateCommunicatorNavigationLabels, addCommunicatorLabel, updateCommunicatorLabel, removeLabel}
export {updateCommunicatorNavigationLabels, addCommunicatorLabel, updateCommunicatorLabel, removeLabel}