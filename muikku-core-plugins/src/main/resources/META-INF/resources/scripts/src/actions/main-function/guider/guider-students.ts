import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import { GuiderStudentsFilterType, GuiderStudentsPatchType, GuiderStudentsStateType, GuiderStudentType, GuiderStudentUserProfileLabelType, GuiderStudentUserProfilePhoneType, GuiderStudentUserProfileEmailType, GuiderStudentUserAddressType, GuiderLastLoginStudentDataType, GuiderNotificationStudentsDataType, GuiderStudentUserProfileType, GuiderCurrentStudentStateType, GuiderStudentsType } from '~/reducers/main-function/guider/guider-students';
import { loadStudentsHelper } from './guider-students/helpers';
import promisify from '~/util/promisify';
import { UserGroupListType, UserFileType } from 'reducers/main-function/user-index';
import notificationActions from '~/actions/base/notifications';
import { GuiderUserLabelType } from '~/reducers/main-function/guider/guider-filters';
import { WorkspaceListType, WorkspaceStudentActivityType, WorkspaceForumStatisticsType } from '~/reducers/main-function/index/workspaces';
import { VOPSDataType } from '~/reducers/main-function/vops';
import { HOPSDataType } from '~/reducers/main-function/hops';

export type UPDATE_GUIDER_STUDENTS_FILTERS = SpecificActionType<"UPDATE_GUIDER_STUDENTS_FILTERS", GuiderStudentsFilterType>
export type UPDATE_GUIDER_STUDENTS_ALL_PROPS = SpecificActionType<"UPDATE_GUIDER_STUDENTS_ALL_PROPS", GuiderStudentsPatchType>
export type UPDATE_GUIDER_STUDENTS_STATE = SpecificActionType<"UPDATE_GUIDER_STUDENTS_STATE", GuiderStudentsStateType>
export type ADD_TO_GUIDER_SELECTED_STUDENTS = SpecificActionType<"ADD_TO_GUIDER_SELECTED_STUDENTS", GuiderStudentType>
export type REMOVE_FROM_GUIDER_SELECTED_STUDENTS = SpecificActionType<"REMOVE_FROM_GUIDER_SELECTED_STUDENTS", GuiderStudentType>

export type SET_CURRENT_GUIDER_STUDENT = SpecificActionType<"SET_CURRENT_GUIDER_STUDENT", GuiderStudentUserProfileType>
export type SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD = SpecificActionType<"SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD", null>
export type SET_CURRENT_GUIDER_STUDENT_PROP = SpecificActionType<"SET_CURRENT_GUIDER_STUDENT_PROP", {property: string, value: any}>
export type UPDATE_CURRENT_GUIDER_STUDENT_STATE = SpecificActionType<"UPDATE_CURRENT_GUIDER_STUDENT_STATE", GuiderCurrentStudentStateType>

export type ADD_FILE_TO_CURRENT_STUDENT = SpecificActionType<"ADD_FILE_TO_CURRENT_STUDENT", UserFileType>
export type REMOVE_FILE_FROM_CURRENT_STUDENT = SpecificActionType<"REMOVE_FILE_FROM_CURRENT_STUDENT", UserFileType>

export type ADD_GUIDER_LABEL_TO_USER = SpecificActionType<"ADD_GUIDER_LABEL_TO_USER", {
  studentId: string,
  label: GuiderStudentUserProfileLabelType
}>

export type REMOVE_GUIDER_LABEL_FROM_USER = SpecificActionType<"REMOVE_GUIDER_LABEL_FROM_USER", {
  studentId: string,
  label: GuiderStudentUserProfileLabelType
}>


export interface LoadStudentsTriggerType {
  (filters: GuiderStudentsFilterType): AnyActionType
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

let addFileToCurrentStudent:AddFileToCurrentStudentTriggerType = function addFileToCurrentStudent(file){
  return {
    type: "ADD_FILE_TO_CURRENT_STUDENT",
    payload: file
  }
}
  
let removeFileFromCurrentStudent:RemoveFileFromCurrentStudentTriggerType = function removeFileFromCurrentStudent(file){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      await promisify(mApi().guider.files.del(file.id), 'callback')();
      dispatch({
        type: "REMOVE_FILE_FROM_CURRENT_STUDENT",
        payload: file
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
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
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let currentUserSchoolDataIdentifier = getState().status.userSchoolDataIdentifier;
      
      dispatch({
        type: "SET_CURRENT_GUIDER_STUDENT_EMPTY_LOAD",
        payload: null
      });
      
      await Promise.all([
        promisify(mApi().user.students.read(id), 'callback')()
          .then((basic:GuiderStudentType)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "basic", value: basic}})
          }),
        promisify(mApi().usergroup.groups.read({userIdentifier: id}), 'callback')()
          .then((usergroups:UserGroupListType)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "usergroups", value: usergroups}})
          }),
        promisify(mApi().user.students.flags.read(id, {
            ownerIdentifier: currentUserSchoolDataIdentifier
          }), 'callback')()
          .then((labels:Array<GuiderStudentUserProfileLabelType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "labels", value: labels}})
          }),
        promisify(mApi().user.students.phoneNumbers.read(id), 'callback')()
          .then((phoneNumbers:Array<GuiderStudentUserProfilePhoneType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "phoneNumbers", value: phoneNumbers}})
          }),
        promisify(mApi().user.students.emails.read(id), 'callback')()
          .then((emails:Array<GuiderStudentUserProfileEmailType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "emails", value: emails}})
          }),
        promisify(mApi().user.students.addresses.read(id), 'callback')()
          .then((addresses:Array<GuiderStudentUserAddressType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "addresses", value: addresses}})
          }),
        promisify(mApi().guider.users.files.read(id), 'callback')()
          .then((files:Array<UserFileType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "files", value: files}})
          }),
        promisify(mApi().records.vops.read(id), 'callback')()
          .then((vops:VOPSDataType)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "vops", value: vops}})
          }),
        promisify(mApi().records.hops.read(id), 'callback')()
          .then((hops:HOPSDataType)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "hops", value: hops}})
          }),
        promisify(mApi().user.students.logins.read(id, {maxResults:1}), 'callback')()
          .then((lastLoginData:Array<GuiderLastLoginStudentDataType>)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "lastLogin", value: lastLoginData[0]}})
          }),
        promisify(mApi().guider.users.latestNotifications.read(id), 'callback')()
          .then((notifications:GuiderNotificationStudentsDataType)=>{
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "notifications", value: notifications}})
          }),
        promisify(mApi().workspace.workspaces.read({userIdentifier: id}), 'callback')()
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
                )
              ]);
            }
            
            dispatch({type: "SET_CURRENT_GUIDER_STUDENT_PROP", payload: {property: "workspaces", value: workspaces}})
          })
      ]);
      
      dispatch({
        type: "UPDATE_CURRENT_GUIDER_STUDENT_STATE",
        payload: <GuiderCurrentStudentStateType>"READY"
      });
    } catch (err){
      dispatch(notificationActions.displayNotification(err.message, 'error'));
      dispatch({
        type: "UPDATE_GUIDER_STUDENTS_ALL_PROPS",
        payload: {
          currentState: "ERROR"
        }
      });
     }
  }
}

async function removeLabelFromUserUtil(student: GuiderStudentType, flags: Array<GuiderStudentUserProfileLabelType>, label: GuiderUserLabelType, dispatch:(arg:AnyActionType)=>any){
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
    dispatch(notificationActions.displayNotification(err.message, 'error'));
  }
}

async function addLabelToUserUtil(student: GuiderStudentType, flags: Array<GuiderStudentUserProfileLabelType>, label: GuiderUserLabelType, dispatch:(arg:AnyActionType)=>any){
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
    dispatch(notificationActions.displayNotification(err.message, 'error'));
  }
}

let addGuiderLabelToCurrentUser:AddGuiderLabelToCurrentUserTriggerType = function addGuiderLabelToCurrentUser(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let students:GuiderStudentsType = getState().guiderStudents;
    let student = students.current;
    addLabelToUserUtil(student.basic, student.labels, label, dispatch);
  }
}

let removeGuiderLabelFromCurrentUser:RemoveGuiderLabelFromCurrentUserTriggerType = function removeGuiderLabelFromCurrentUser(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let students:GuiderStudentsType = getState().guiderStudents;
    let student = students.current;
    removeLabelFromUserUtil(student.basic, student.labels, label, dispatch);
  }
}

let addGuiderLabelToSelectedUsers:AddGuiderLabelToSelectedUsersTriggerType = function addGuiderLabelToSelectedUsers(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let students:GuiderStudentsType = getState().guiderStudents;
    students.selected.forEach((student:GuiderStudentType)=>{
      addLabelToUserUtil(student, student.flags, label, dispatch);
    });
  }
}

let removeGuiderLabelFromSelectedUsers:RemoveGuiderLabelFromSelectedUsersTriggerType = function removeGuiderLabelFromSelectedUsers(label){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    let students:GuiderStudentsType = getState().guiderStudents;
    students.selected.forEach((student:GuiderStudentType)=>{
      removeLabelFromUserUtil(student, student.flags, label, dispatch);
    });
  }
}

export {loadStudents, loadMoreStudents, loadStudent,
  addToGuiderSelectedStudents, removeFromGuiderSelectedStudents,
  addGuiderLabelToCurrentUser, removeGuiderLabelFromCurrentUser,
  addGuiderLabelToSelectedUsers, removeGuiderLabelFromSelectedUsers,
  addFileToCurrentStudent, removeFileFromCurrentStudent};
export default {loadStudents, loadMoreStudents, loadStudent,
  addToGuiderSelectedStudents, removeFromGuiderSelectedStudents,
  addGuiderLabelToCurrentUser, removeGuiderLabelFromCurrentUser,
  addGuiderLabelToSelectedUsers, removeGuiderLabelFromSelectedUsers,
  addFileToCurrentStudent, removeFileFromCurrentStudent};