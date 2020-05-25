import mApi, {MApiError} from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import promisify from '~/util/promisify';
import {UserStatusType,StudyprogrammeListType, StudyprogrammeTypeStatusType} from 'reducers/main-function/users';
import {UserType, ManipulateStudentType, ManipulateStaffmemberType} from 'reducers/user-index';
import notificationActions from '~/actions/base/notifications';
import {StateType} from '~/reducers';

export type UPDATE_STUDENT_USERS = SpecificActionType<"UPDATE_STUDENT_USERS", UserType>
export type UPDATE_STAFF_USERS = SpecificActionType<"UPDATE_STAFF_USERS", UserType>
export type UPDATE_USERS_STATE = SpecificActionType<"UPDATE_USERS_STATE", UserStatusType>
export type UPDATE_STUDYPROGRAMME_TYPES = SpecificActionType<"UPDATE_STUDYPROGRAMME_TYPES", StudyprogrammeListType>
export type UPDATE_STUDYPROGRAMME_STATUS_TYPE = SpecificActionType<"UPDATE_STUDYPROGRAMME_STATUS_TYPE", StudyprogrammeTypeStatusType>

export interface CreateStudentTriggerType {
  (data: { 
    student: ManipulateStudentType,
    success?: () => any,
    fail?: () => any
  }): AnyActionType
}

export interface CreateStaffmemberTriggerType {
  (data: { 
    staffmember: ManipulateStaffmemberType,
    success?: () => any,
    fail?: () => any
  }): AnyActionType
}

export interface loadStudyprogrammesTriggerType {
  (): AnyActionType
}

export interface LoadUsersTriggerType {
  (): AnyActionType
}

let createStudent: CreateStudentTriggerType = function createStudent (data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().user.students.create(data.student), 'callback')().then(() => {
        promisify(mApi().user.students.read(), 'callback')()
        .then((students:UserType) => {
          dispatch({
            type: "UPDATE_STUDENT_USERS", 
            payload: students
          });
        });
      });
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.create.student.success"), 'success'));    
      data.success && data.success();
    } catch (err) {
      if (!(err instanceof MApiError)){
        throw err;
      }
        dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.create.student.error"), 'error'));    
      }
      data.fail && data.fail();
  }
}

let createStaffmember: CreateStaffmemberTriggerType = function createStaffmember (data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().user.staffMembers.create(data.staffmember), 'callback')().then(() => {
        promisify(mApi().user.staffMembers.read(), 'callback')()
        .then((users:UserType)=>{ 
          dispatch({
            type: "UPDATE_STAFF_USERS", 
            payload: users
          });
        })
      });
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.create.student.success"), 'success'));    
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.organization.create.student.error"), 'error'));    
      data.fail && data.fail();
    }
  }
}

let loadStudyprogrammes: loadStudyprogrammesTriggerType = function loadStudyprogrammes() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      dispatch({
        type: "UPDATE_STUDYPROGRAMME_TYPES",
        payload: <StudyprogrammeListType>(await promisify(mApi().user.studyProgrammes.read(), 'callback')())
      });
      dispatch({
        type: "UPDATE_STUDYPROGRAMME_STATUS_TYPE",
        payload: <StudyprogrammeTypeStatusType>"READY"
      });
    } catch(err) { 
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch({
        type: "UPDATE_STUDYPROGRAMME_STATUS_TYPE",
        payload: <StudyprogrammeTypeStatusType>"ERROR"
      });
      dispatch(notificationActions.displayNotification(getState().i18n.text.get("TODO: Error"), 'error'));
    }
  }
}


let loadUsers:LoadUsersTriggerType = function loadUsers (){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      
      let currentUserSchoolDataIdentifier = getState().status.userSchoolDataIdentifier;

      dispatch({
        type: "LOCK_TOOLBAR",
        payload: null
      });
      
      await Promise.all([
        promisify(mApi().user.students.read(), 'callback')()
          .then((users:UserType)=>{
            dispatch({
              type: "UPDATE_STUDENT_USERS", 
              payload: users
            });
          }),
        promisify(mApi().user.staffMembers.read(), 'callback')()
          .then((users:UserType)=>{
            dispatch({
              type: "UPDATE_STAFF_USERS", 
              payload: users
            });
          }),
      ]);
      dispatch({
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"READY"
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
        type: "UPDATE_USERS_STATE",
        payload: <UserStatusType>"ERROR"
      });
      dispatch({
        type: "UNLOCK_TOOLBAR",
        payload: null
      });
     }
  }
}



export {loadUsers, loadStudyprogrammes, createStaffmember, createStudent};