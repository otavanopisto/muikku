import mApi, {MApiError} from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import {GuiderActiveFiltersType, GuiderPatchType, GuiderStudentsStateType, GuiderStudentType, GuiderStudentUserProfileLabelType, GuiderNotificationStudentsDataType, GuiderStudentUserProfileType, GuiderCurrentStudentStateType, GuiderType} from '~/reducers/main-function/guider';
import {loadStudentsHelper} from './helpers';
import promisify from '~/util/promisify';
import {UserFileType, StudentUserProfilePhoneType, StudentUserProfileEmailType, StudentUserAddressType, UserGroupType} from 'reducers/user-index';
import notificationActions from '~/actions/base/notifications';
import {GuiderUserLabelType, GuiderUserLabelListType, GuiderWorkspaceListType} from '~/reducers/main-function/guider';
import {WorkspaceListType, WorkspaceStudentActivityType, WorkspaceForumStatisticsType, ActivityLogType} from '~/reducers/workspaces';
import {VOPSDataType} from '~/reducers/main-function/vops';
import {HOPSDataType} from '~/reducers/main-function/hops';
import {StateType} from '~/reducers';
import {colorIntToHex} from '~/util/modifiers';
import { PurchaseProductType, PurchaseType } from '~/reducers/main-function/profile';

export type UPDATE_GUIDER_ACTIVE_FILTERS = SpecificActionType<"UPDATE_GUIDER_ACTIVE_FILTERS", GuiderActiveFiltersType>
export type UPDATE_GUIDER_ALL_PROPS = SpecificActionType<"UPDATE_GUIDER_ALL_PROPS", GuiderPatchType>
export type UPDATE_GUIDER_STATE = SpecificActionType<"UPDATE_GUIDER_STATE", GuiderStudentsStateType>
export type ADD_TO_GUIDER_SELECTED_STUDENTS = SpecificActionType<"ADD_TO_GUIDER_SELECTED_STUDENTS", GuiderStudentType>
export type REMOVE_FROM_GUIDER_SELECTED_STUDENTS = SpecificActionType<"REMOVE_FROM_GUIDER_SELECTED_STUDENTS", GuiderStudentType>

export type SET_CURRENT_GUIDER_STUDENT = SpecificActionType<"SET_CURRENT_GUIDER_STUDENT", GuiderStudentUserProfileType>
export type SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD = SpecificActionType<"SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD", null>
export type SET_CURRENT_GUIDER_STUDENT_PROP = SpecificActionType<"SET_CURRENT_GUIDER_STUDENT_PROP", {property: string, value: any}>
export type UPDATE_CURRENT_GUIDER_STUDENT_STATE = SpecificActionType<"UPDATE_CURRENT_GUIDER_STUDENT_STATE", GuiderCurrentStudentStateType>
export type UPDATE_GUIDER_INSERT_PURCHASE_ORDER = SpecificActionType<"UPDATE_GUIDER_INSERT_PURCHASE_ORDER", PurchaseType>

export type ADD_FILE_TO_CURRENT_STUDENT = SpecificActionType<"ADD_FILE_TO_CURRENT_STUDENT", UserFileType>
export type REMOVE_FILE_FROM_CURRENT_STUDENT = SpecificActionType<"REMOVE_FILE_FROM_CURRENT_STUDENT", UserFileType>
export type UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS = SpecificActionType<"UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS", PurchaseProductType[]>;

export type ADD_GUIDER_LABEL_TO_USER = SpecificActionType<"ADD_GUIDER_LABEL_TO_USER", {
  studentId: string,
  label: GuiderStudentUserProfileLabelType
}>

export type REMOVE_GUIDER_LABEL_FROM_USER = SpecificActionType<"REMOVE_GUIDER_LABEL_FROM_USER", {
  studentId: string,
  label: GuiderStudentUserProfileLabelType
}>

export type UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS = SpecificActionType<"UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS", GuiderUserLabelListType>
export type UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES = SpecificActionType<"UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES", GuiderWorkspaceListType>
export type UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL = SpecificActionType<"UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL", GuiderUserLabelType>
export type UPDATE_GUIDER_AVAILABLE_FILTER_LABEL = SpecificActionType<"UPDATE_GUIDER_AVAILABLE_FILTER_LABEL", {
  labelId: number,
  update: {
    name: string,
    description: string,
    color: string
  }
}>
export type UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS = SpecificActionType<"UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS", {
  labelId: number,
  update: {
    flagName: string,
    flagColor: string
  }
}>
export type DELETE_GUIDER_AVAILABLE_FILTER_LABEL = SpecificActionType<"DELETE_GUIDER_AVAILABLE_FILTER_LABEL", number>
export type DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS = SpecificActionType<"DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS", number>


export interface LoadStudentsTriggerType {
  (filters: GuiderActiveFiltersType): AnyActionType
}

export interface LoadMoreStudentsTriggerType {
  (): AnyActionType
}

export interface LoadStudentTriggerType {
  (id: string): AnyActionType
}

export interface AddToGuiderSelectedStudentsTriggerType {
  (student: GuiderStudentType): AnyActionType
}

export interface RemoveFromGuiderSelectedStudentsTriggerType {
  (student: GuiderStudentType): AnyActionType
}

export interface AddGuiderLabelToCurrentUserTriggerType {
  (label: GuiderUserLabelType): AnyActionType
}

export interface RemoveGuiderLabelFromCurrentUserTriggerType {
  (label: GuiderUserLabelType): AnyActionType
}

export interface AddGuiderLabelToSelectedUsersTriggerType {
  (label: GuiderUserLabelType): AnyActionType
}

export interface RemoveGuiderLabelFromSelectedUsersTriggerType {
  (label: GuiderUserLabelType): AnyActionType
}

export interface AddFileToCurrentStudentTriggerType {
  (file: UserFileType): AnyActionType
}

export interface RemoveFileFromCurrentStudentTriggerType {
  (file: UserFileType): AnyActionType
}

export interface UpdateLabelFiltersTriggerType {
  ():AnyActionType
}

export interface UpdateWorkspaceFiltersTriggerType {
  ():AnyActionType
}

export interface CreateGuiderFilterLabelTriggerType {
  (name: string):AnyActionType
}

export interface UpdateGuiderFilterLabelTriggerType {
  (data: {
    label: GuiderUserLabelType,
    name: string,
    description: string,
    color: string,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface RemoveGuiderFilterLabelTriggerType {
  (data: {
    label: GuiderUserLabelType,
    success?: ()=>any,
    fail?: ()=>any
  }):AnyActionType
}

export interface UpdateAvailablePurchaseProductsTriggerType {
  (): AnyActionType
}

export interface DoPurchaseForCurrentStudentTriggerType {
  (order: PurchaseProductType): AnyActionType
}

let addFileToCurrentStudent:AddFileToCurrentStudentTriggerType = function addFileToCurrentStudent(file){
  return {
    type: "ADD_FILE_TO_CURRENT_STUDENT",
    payload: file
  }
}

let removeFileFromCurrentStudent:RemoveFileFromCurrentStudentTriggerType = function removeFileFromCurrentStudent(file){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().guider.files.del(file.id), 'callback')();
      dispatch({
        type: "REMOVE_FILE_FROM_CURRENT_STUDENT",
        payload: file
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.fileRemoveFailed"), 'error'));
    }
  }
}

let loadStudents:LoadStudentsTriggerType = function loadStudents(filters){
  return loadStudentsHelper.bind(this, filters, true);
}

let loadMoreStudents:LoadMoreStudentsTriggerType = function loadMoreStudents(){
  return loadStudentsHelper.bind(this, null, false);
}

let addToGuiderSelectedStudents:AddToGuiderSelectedStudentsTriggerType = function addToGuiderSelectedStudents(student){
  return {
    type: "ADD_TO_GUIDER_SELECTED_STUDENTS",
    payload: student
  }
}

let removeFromGuiderSelectedStudents:RemoveFromGuiderSelectedStudentsTriggerType = function removeFromGuiderSelectedStudents(student){
  return {
    type: "REMOVE_FROM_GUIDER_SELECTED_STUDENTS",
    payload: student
  }
}

let loadStudent:LoadStudentTriggerType = function loadStudent(id){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let currentUserSchoolDataIdentifier = getState().status.userSchoolDataIdentifier;

      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });

      dispatch({
        type: "SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD",
        payload: null
      });

      await Promise.all([
        promisify(mApi().guider.students.read(id), 'callback')()
          .then((basic:GuiderStudentType)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "basic", value: basic}})
          }),
        promisify(mApi().usergroup.groups.read({userIdentifier: id}), 'callback')()
          .then((usergroups:UserGroupType[])=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "usergroups", value: usergroups}})
          }),
        promisify(mApi().user.students.flags.read(id, {
            ownerIdentifier: currentUserSchoolDataIdentifier
          }), 'callback')()
          .then((labels:Array<GuiderStudentUserProfileLabelType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "labels", value: labels}})
          }),
        promisify(mApi().user.students.phoneNumbers.read(id), 'callback')()
          .then((phoneNumbers:Array<StudentUserProfilePhoneType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "phoneNumbers", value: phoneNumbers}})
          }),
        promisify(mApi().user.students.emails.read(id), 'callback')()
          .then((emails:Array<StudentUserProfileEmailType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "emails", value: emails}})
          }),
        promisify(mApi().user.students.addresses.read(id), 'callback')()
          .then((addresses:Array<StudentUserAddressType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "addresses", value: addresses}})
          }),
        promisify(mApi().guider.users.files.read(id), 'callback')()
          .then((files:Array<UserFileType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "files", value: files}})
          }),
// Removed until it works correctly
          // VOPS disabled until studies view redesign

//        promisify(mApi().records.vops.read(id), 'callback')()
//          .then((vops:VOPSDataType)=>{
//            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "vops", value: vops}})
//          }),
        promisify(mApi().records.hops.read(id), 'callback')()
          .then((hops:HOPSDataType)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "hops", value: hops}})
          }),
        promisify(mApi().guider.users.latestNotifications.read(id), 'callback')()
          .then((notifications:GuiderNotificationStudentsDataType)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "notifications", value: notifications}})
          }),
        promisify(mApi().workspace.workspaces.read({userIdentifier: id, includeInactiveWorkspaces: true}), 'callback')()
          .then(async (workspaces:WorkspaceListType)=>{
            if (workspaces && workspaces.length){
              await Promise.all([
                Promise.all(workspaces.map(async (workspace, index)=>{
                  let activity:WorkspaceStudentActivityType = <WorkspaceStudentActivityType>await promisify(mApi().guider.workspaces.studentactivity
                      .read(workspace.id, id), 'callback')();
                    workspaces[index].studentActivity = activity;
                  })
                ),
                Promise.all(workspaces.map(async (workspace, index)=>{
                  let statistics:WorkspaceForumStatisticsType = <WorkspaceForumStatisticsType>await promisify(mApi().workspace.workspaces.forumStatistics
                      .read(workspace.id, {userIdentifier: id}), 'callback')();
                    workspaces[index].forumStatistics = statistics;
                  })
                ),
                Promise.all(workspaces.map(async (workspace, index)=>{
                  let activityLogs:ActivityLogType[] = <ActivityLogType[]>await promisify(mApi().activitylogs.user.workspace
                      .read(id, {workspaceEntityId: workspace.id, from: new Date(new Date().getFullYear()-2, 0), to: new Date()}), 'callback')();
                    workspaces[index].activityLogs = activityLogs;
                  })
                )
              ]);
            }
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "workspaces", value: workspaces}})
          }),
          promisify(mApi().activitylogs.user.workspace.read(id, {from: new Date(new Date().getFullYear()-2, 0), to: new Date()}), 'callback')()
          .then((activityLogs:ActivityLogType[])=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "activityLogs", value: activityLogs}});
        }),
        promisify(mApi().ceepos.user.orders.read(id), "callback")().then((pOrders: PurchaseType[]) => {
          dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "purchases", value: pOrders}})
        }),
      ]);

      dispatch({
        type: "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
        payload: <GuiderCurrentStudentStateType>"READY"
      });

      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.user"), 'error'));
      dispatch({
        type: "UPDATE_GUIDER_ALL_PROPS",
        payload: {
          currentState: <GuiderCurrentStudentStateType>"ERROR"
        }
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
     }
  }
}

async function removeLabelFromUserUtil(student: GuiderStudentType, flags: Array<GuiderStudentUserProfileLabelType>, label: GuiderUserLabelType, dispatch:(arg:AnyActionType)=>any, getState:()=>StateType){
  try {
    let relationLabel:GuiderStudentUserProfileLabelType = flags.find((flag)=>flag.flagId === label.id);
    if (relationLabel){
      await promisify(mApi().user.students.flags.del(student.id, relationLabel.id), 'callback')();
      dispatch({
        type: "REMOVE_GUIDER_LABEL_FROM_USER",
        payload: {
          studentId: student.id,
          label: relationLabel
        }
      });
    }
  } catch (err){
    if (!(err instanceof MApiError)){
      throw err;
    }
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.label.remove"), 'error'));
  }
}

async function addLabelToUserUtil(student: GuiderStudentType, flags: Array<GuiderStudentUserProfileLabelType>, label: GuiderUserLabelType, dispatch:(arg:AnyActionType)=>any, getState:()=>StateType){
  try {
    let relationLabel:GuiderStudentUserProfileLabelType = flags.find((flag)=>flag.flagId === label.id);
    if (!relationLabel){
      let createdLabelRelation:GuiderStudentUserProfileLabelType = <GuiderStudentUserProfileLabelType>await promisify(mApi().user.students.flags.create(student.id, {
        flagId: label.id,
        studentIdentifier: student.id
      }), 'callback')();
      dispatch({
        type: "ADD_GUIDER_LABEL_TO_USER",
        payload: {
          studentId: student.id,
          label: createdLabelRelation
        }
      });
    }
  } catch (err){
    if (!(err instanceof MApiError)){
      throw err;
    }
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.label.add"), 'error'));
  }
}

let addGuiderLabelToCurrentUser:AddGuiderLabelToCurrentUserTriggerType = function addGuiderLabelToCurrentUser(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let guider:GuiderType = getState().guider;
    let student = guider.currentStudent;
    addLabelToUserUtil(student.basic, student.labels, label, dispatch, getState);
  }
}

let removeGuiderLabelFromCurrentUser:RemoveGuiderLabelFromCurrentUserTriggerType = function removeGuiderLabelFromCurrentUser(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let guider:GuiderType = getState().guider;
    let student = guider.currentStudent;
    removeLabelFromUserUtil(student.basic, student.labels, label, dispatch, getState);
  }
}

let addGuiderLabelToSelectedUsers:AddGuiderLabelToSelectedUsersTriggerType = function addGuiderLabelToSelectedUsers(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let guider:GuiderType = getState().guider;
    guider.selectedStudents.forEach((student:GuiderStudentType)=>{
      addLabelToUserUtil(student, student.flags, label, dispatch, getState);
    });
  }
}

let removeGuiderLabelFromSelectedUsers:RemoveGuiderLabelFromSelectedUsersTriggerType = function removeGuiderLabelFromSelectedUsers(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let guider:GuiderType = getState().guider;
    guider.selectedStudents.forEach((student:GuiderStudentType)=>{
      removeLabelFromUserUtil(student, student.flags, label, dispatch, getState);
    });
  }
}

let updateLabelFilters:UpdateLabelFiltersTriggerType = function updateLabelFilters(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let currentUser = getState().status.userSchoolDataIdentifier;
    try {
      dispatch({
        type: "UPDATE_GUIDER_AVAILABLE_FILTERS_LABELS",
        payload: <GuiderUserLabelListType>(await promisify(mApi().user.flags.read({
          ownerIdentifier: currentUser
        }), 'callback')()) || []
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.labels"), 'error'));
    }
  }
}

let updateWorkspaceFilters:UpdateWorkspaceFiltersTriggerType = function updateWorkspaceFilters(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let currentUser = getState().status.userSchoolDataIdentifier;
    try {
      dispatch({
        type: "UPDATE_GUIDER_AVAILABLE_FILTERS_WORKSPACES",
        payload: <GuiderWorkspaceListType>(await promisify(mApi().workspace.workspaces.read({
          userIdentifier: currentUser,
          includeInactiveWorkspaces: true,
          maxResults: 500,
          orderBy: "alphabet"
        }), 'callback')()) || []
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.workspaces"), 'error'));
    }
  }
}

let createGuiderFilterLabel:CreateGuiderFilterLabelTriggerType = function createGuiderFilterLabel(name){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    if (!name){
      return dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.createUpdateLabels.missing.title"), 'error'));
    }

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
        type: "UPDATE_GUIDER_AVAILABLE_FILTERS_ADD_LABEL",
        payload: newLabel
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.label.create"), 'error'));
    }
  }
}

let updateGuiderFilterLabel:UpdateGuiderFilterLabelTriggerType = function updateGuiderFilterLabel(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    if (!data.name){
      data.fail && data.fail();
      return dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.createUpdateLabels.missing.title"), 'error'));
    }

    let newLabel:GuiderUserLabelType = Object.assign({}, data.label, {
      name: data.name,
      description: data.description,
      color: data.color
    });

    try {
      await promisify(mApi().user.flags.update(data.label.id, newLabel), 'callback')();
      dispatch({
        type: "UPDATE_GUIDER_AVAILABLE_FILTER_LABEL",
        payload: {
          labelId: newLabel.id,
          update: {
            name: data.name,
            description: data.description,
            color: data.color
          }
        }
      });
      dispatch({
        type: "UPDATE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS",
        payload: {
          labelId: newLabel.id,
          update: {
            flagName: data.name,
            flagColor: data.color
          }
        }
      });
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      data.fail && data.fail();
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.label.update"), 'error'));
    }
  }
}

let removeGuiderFilterLabel:RemoveGuiderFilterLabelTriggerType = function removeGuiderFilterLabel(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().user.flags.del(data.label.id), 'callback')();
      dispatch({
        type: "DELETE_GUIDER_AVAILABLE_FILTER_LABEL",
        payload: data.label.id
      });
      dispatch({
        type: "DELETE_ONE_GUIDER_LABEL_FROM_ALL_STUDENTS",
        payload: data.label.id
      });
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      data.fail && data.fail();
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.label.remove"), 'error'));
    }
  }
}

const updateAvailablePurchaseProducts: UpdateAvailablePurchaseProductsTriggerType = function updateAvailablePurchaseProducts() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      const value: PurchaseProductType[] = await promisify(mApi().ceepos.products.read(), 'callback')() as any;
      dispatch({
        type: "UPDATE_GUIDER_AVAILABLE_PURCHASE_PRODUCTS",
        payload: value,
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.purchaseproducts"), 'error'));
    }
  }
}

const doPurchaseForCurrentStudent: DoPurchaseForCurrentStudentTriggerType = function doPurchaseForCurrentStudent(order: PurchaseProductType) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      const state = getState();
      const value: PurchaseType = await promisify(mApi().ceepos.order.create({
        studentIdentifier: state.guider.currentStudent.basic.id,
        product: order,
      }), 'callback')() as any;
      dispatch({
        type: "UPDATE_GUIDER_INSERT_PURCHASE_ORDER",
        payload: value,
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.guider.errormessage.purchasefailed"), 'error'));
    }
  }
}

export {loadStudents, loadMoreStudents, loadStudent,
  addToGuiderSelectedStudents, removeFromGuiderSelectedStudents,
  addGuiderLabelToCurrentUser, removeGuiderLabelFromCurrentUser,
  addGuiderLabelToSelectedUsers, removeGuiderLabelFromSelectedUsers,
  addFileToCurrentStudent, removeFileFromCurrentStudent, updateLabelFilters,
  updateWorkspaceFilters, createGuiderFilterLabel,
  updateGuiderFilterLabel, removeGuiderFilterLabel,
  updateAvailablePurchaseProducts, doPurchaseForCurrentStudent};
