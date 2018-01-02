import mApi from '~/lib/mApi';
import {AnyActionType, SpecificActionType} from '~/actions';
import { GuiderStudentsFilterType, GuiderStudentsPatchType, GuiderStudentsStateType, GuiderStudentType, GuiderStudentUserProfileLabelType, GuiderStudentUserProfilePhoneType, GuiderStudentUserProfileEmailType, GuiderStudentUserAddressType, GuiderStudentUserFileType, GuiderVOPSDataType, GuiderHOPSDataType, GuiderLastLoginStudentDataType, GuiderNotificationStudentsDataType } from '~/reducers/main-function/guider/guider-students';
import { loadStudentsHelper } from './guider-students/helpers';
import promisify from '~/util/promisify';
import { UserGroupListType } from 'reducers/main-function/user-index';
import notificationActions from '~/actions/base/notifications';

export interface UPDATE_GUIDER_STUDENTS_FILTERS extends 
  SpecificActionType<"UPDATE_GUIDER_STUDENTS_FILTERS", GuiderStudentsFilterType>{}
export interface UPDATE_GUIDER_STUDENTS_ALL_PROPS extends 
  SpecificActionType<"UPDATE_GUIDER_STUDENTS_ALL_PROPS", GuiderStudentsPatchType>{}
export interface UPDATE_GUIDER_STUDENTS_STATE extends 
  SpecificActionType<"UPDATE_GUIDER_STUDENTS_STATE", GuiderStudentsStateType>{}
  
export interface LoadStudentsTriggerType {
  (filters: GuiderStudentsFilterType): AnyActionType
}
export interface LoadMoreStudentsTriggerType {
  (): AnyActionType
}

export interface LoadStudentTriggerType {
  (id: string): AnyActionType
}

let loadStudents:LoadStudentsTriggerType = function loadStudents(filters){
  return loadStudentsHelper.bind(this, filters, true);
}
  
let loadMoreStudents:LoadMoreStudentsTriggerType = function loadMoreStudents(){
  return loadStudentsHelper.bind(this, null, false);
}

let loadStudent:LoadStudentTriggerType = function loadStudent(id){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>any)=>{
    try {
      let currentUserSchoolDataIdentifier = getState().status.userSchoolDataIdentifier;
      
      dispatch({
        type: "UPDATE_GUIDER_STUDENTS_ALL_PROPS",
        payload: {
          currentState: "LOADING"
        }
      });
      
      let basic:GuiderStudentType = <GuiderStudentType>await promisify(mApi().user.students.read(id), 'callback')();
      let usergroups:UserGroupListType = <UserGroupListType>await promisify(mApi().usergroup.groups.read({userIdentifier: id}), 'callback')();
      let labels:Array<GuiderStudentUserProfileLabelType> = <Array<GuiderStudentUserProfileLabelType>>await promisify(mApi().user.students.read(id).flags.read({
        ownerIdentifier: currentUserSchoolDataIdentifier
      }), 'callback')();
      let phoneNumbers:Array<GuiderStudentUserProfilePhoneType> = <Array<GuiderStudentUserProfilePhoneType>>await promisify(mApi().user.students.read(id).phoneNumbers, 'callback')();
      let emails:Array<GuiderStudentUserProfileEmailType> = <Array<GuiderStudentUserProfileEmailType>>await promisify(mApi().user.students.read(id).emails, 'callback')();
      let addresses:Array<GuiderStudentUserAddressType> = <Array<GuiderStudentUserAddressType>>await promisify(mApi().user.students.read(id).addresses, 'callback')();
      let files:Array<GuiderStudentUserFileType> = <Array<GuiderStudentUserFileType>>await promisify(mApi().user.students.read(id).files, 'callback')();
      let vops:GuiderVOPSDataType = <GuiderVOPSDataType>await promisify(mApi().user.students.read(id).vops, 'callback')();
      let hops:GuiderHOPSDataType = <GuiderHOPSDataType>await promisify(mApi().user.students.read(id).hops, 'callback')();
      let lastLogin:GuiderLastLoginStudentDataType = (<Array<GuiderLastLoginStudentDataType>>await promisify(mApi().user.students.read(id).logins.read({maxResults:1}), 'callback')())[0];
      let notifications:GuiderNotificationStudentsDataType = <GuiderNotificationStudentsDataType>await promisify(mApi().user.students.read(id).latestNotifications, 'callback')();
      
      dispatch({
        type: "UPDATE_GUIDER_STUDENTS_ALL_PROPS",
        payload: {
          currentState: "READY",
          current: {
            basic,
            usergroups,
            labels,
            phoneNumbers,
            emails,
            addresses,
            files,
            vops,
            hops,
            lastLogin,
            notifications
          }
        }
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

export {loadStudents, loadMoreStudents, loadStudent};
export default {loadStudents, loadMoreStudents, loadStudent};