import promisify, { promisifyNewConstructor } from '~/util/promisify';
import actions from '../base/notifications';
import {AnyActionType, SpecificActionType} from '~/actions';
import mApi, { MApiError } from '~/lib/mApi';
import {UserType, StudentUserAddressType,StudentUserProfileChatType, UserWithSchoolDataType, UserChatSettingsType} from '~/reducers/main-function/user-index';
import { StateType } from '~/reducers';
import $ from '~/lib/jquery';
import { resize } from '~/util/modifiers';
import { updateStatusProfile, updateStatusHasImage } from '~/actions/base/status';
import converse from '~/lib/converse';

export interface LoadProfilePropertiesSetTriggerType {
  ():AnyActionType
}

export interface SaveProfilePropertyTriggerType {
  (key: string, value: string, callback?: ()=>any):AnyActionType
}

export interface LoadProfileUsernameTriggerType {
  ():AnyActionType
}

export interface LoadProfileAddressTriggerType {
  ():AnyActionType
}

export interface UpdateProfileAddressTriggerType {
  (data: {
    street: string,
    postalCode: string,
    city: string,
    country: string,
    municipality: string,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

export interface LoadProfileChatSettingsTriggerType {
  ():AnyActionType
}

export interface UpdateProfileChatSettingsTriggerType {
  (data: {
    chatVisibility: string,
    chatNickname: string,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

export interface UploadProfileImageTriggerType {
  (data: {
    croppedB64: string,
    originalB64?: string,
    file?: File,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

export interface DeleteProfileImageTriggerType {
  ():AnyActionType
}

export interface SET_PROFILE_USER_PROPERTY extends SpecificActionType<"SET_PROFILE_USER_PROPERTY", {
  key: string,
  value: string
}>{}

export interface SET_PROFILE_USERNAME extends SpecificActionType<"SET_PROFILE_USERNAME", string>{}
export interface SET_PROFILE_ADDRESSES extends SpecificActionType<"SET_PROFILE_ADDRESSES", Array<StudentUserAddressType>>{}
export interface SET_PROFILE_STUDENT extends SpecificActionType<"SET_PROFILE_STUDENT", UserWithSchoolDataType>{}
export interface SET_PROFILE_CHAT_SETTINGS extends SpecificActionType<"SET_PROFILE_CHAT_SETTINGS", UserChatSettingsType>{}

let loadProfilePropertiesSet:LoadProfilePropertiesSetTriggerType =  function loadProfilePropertiesSet() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    try {
      let properties:any = (await promisify(mApi().user.properties.read(state.status.userId, {
        properties: 'profile-phone,profile-vacation-start,profile-vacation-end'
      }), 'callback')());

      properties.forEach((property:any)=>{
        dispatch({
          type: "SET_PROFILE_USER_PROPERTY",
          payload: {
            key: property.key,
            value: property.value
          }
        });
      })

    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

let saveProfileProperty:SaveProfilePropertyTriggerType = function saveProfileProperty(key, value, callback){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      await promisify(mApi().user.property.create({key, value}), 'callback')();

      dispatch({
        type: "SET_PROFILE_USER_PROPERTY",
        payload: {key, value}
      });

      callback && callback();
    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

let loadProfileUsername:LoadProfileUsernameTriggerType = function loadProfileUsername(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    try {
      let credentials:any = (await promisify(mApi().userplugin.credentials.read(), 'callback')());

      if (credentials && credentials.username) {
        dispatch({
          type: "SET_PROFILE_USERNAME",
          payload: credentials.username
        });
      }
    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

let loadProfileAddress:LoadProfileAddressTriggerType = function loadProfileAddress(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    try {
      let identifier = state.status.userSchoolDataIdentifier;
      let addresses:Array<StudentUserAddressType> = <Array<StudentUserAddressType>>(await promisify(mApi().user.students.addresses.read(identifier), 'callback')());

      let student:UserWithSchoolDataType = <UserWithSchoolDataType>(await promisify(mApi().user.students.read(identifier), 'callback')());

      dispatch({
        type: "SET_PROFILE_ADDRESSES",
        payload: addresses
      });

      dispatch({
        type: "SET_PROFILE_STUDENT",
        payload: student
      });

    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

let updateProfileAddress:UpdateProfileAddressTriggerType = function updateProfileAddress(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    try {
      if (data.municipality && data.municipality !== "") {
        let student:UserWithSchoolDataType = {...state.profile.student};
        student.municipality = data.municipality;

        dispatch({
          type: "SET_PROFILE_STUDENT",
          payload: <UserWithSchoolDataType>(await promisify(mApi().user.students.update(student.id, student), 'callback')())
        });
      }

      let address = state.profile.addresses.find(a=>a.defaultAddress);
      if (!address){
        address = state.profile.addresses[0];
      }

      let nAddress:StudentUserAddressType = {...address, ...{
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
        street: data.street
      }}

      let nAddressAsSaidFromServer:StudentUserAddressType = <StudentUserAddressType>await promisify(mApi().user.students.addresses.update(state.status.userSchoolDataIdentifier, nAddress.identifier, nAddress), 'callback')();

      let newAddresses = state.profile.addresses.map(a=>a.identifier === nAddressAsSaidFromServer.identifier ? nAddressAsSaidFromServer : a);

      dispatch({
        type: "SET_PROFILE_ADDRESSES",
        payload: newAddresses
      });

      dispatch(updateStatusProfile({
        ...state.status.profile,
        addresses: newAddresses.map((address)=>{
          return (address.street ? address.street + " " : "") +
            (address.postalCode ? address.postalCode + " " : "") + (address.city ? address.city + " " : "") +
            (address.country ? address.country + " " : "");
        })
      }))

      dispatch(actions.displayNotification(getState().i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.notif.successful'), 'success'));

      data.success && data.success();

    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }

      dispatch(actions.displayNotification(getState().i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.notif.error'), 'error'));

      data.fail && data.fail();
    }
  }
}

let loadProfileChatSettings:LoadProfileChatSettingsTriggerType = function loadProfileChatSettings(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      let chatSettings:any = (await promisify(mApi().chat.settings.read(), 'callback')());

      if (chatSettings && chatSettings.visibility && chatSettings.nick) {
        dispatch({
          type: "SET_PROFILE_CHAT_SETTINGS",
          payload: chatSettings
        });
      }

    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }
    }
  }
}

let updateProfileChatSettings: UpdateProfileChatSettingsTriggerType = function updateProfileChatSettings(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    try {

      await promisify(mApi().chat.settings.update({userIdentifier: state.status.userSchoolDataIdentifier, visibility: data.chatVisibility, nick: data.chatNickname}), 'callback')();



      data.success && data.success();

    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }

      dispatch(actions.displayNotification(getState().i18n.text.get('plugin.profile.chat.visibilityChange.error'), 'error'));

      data.fail && data.fail();
    }
  }
}

const imageSizes = [96, 256];

let uploadProfileImage:UploadProfileImageTriggerType = function uploadProfileImage(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    try {
      if (data.originalB64){
        await promisify (mApi().user.files
            .create({
              contentType: data.file.type,
              base64Data: data.originalB64,
              identifier: 'profile-image-original',
              name: data.file.name,
              visibility: 'PUBLIC'
            }), 'callback')();
      }

      let image:HTMLImageElement = <HTMLImageElement>await promisifyNewConstructor(Image, 'onload', 'onerror', {
        src: data.croppedB64
      })();

      let done = 0;

      for (let i = 0;  i < imageSizes.length; i++) {
        let size = imageSizes[i];
        await promisify (mApi().user.files
          .create({
            contentType: 'image/jpeg',
            base64Data: resize(image, size),
            identifier: 'profile-image-' + size,
            name: 'profile-' + size + '.jpg',
            visibility: 'PUBLIC'
          }), 'callback')();
      }

      dispatch(updateStatusHasImage(true));
      dispatch(actions.displayNotification(getState().i18n.text.get('plugin.profile.changeImage.dialog.notif.successful'), 'success'));

      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get('plugin.profile.changeImage.dialog.notif.error'), 'error'));
      data.fail && data.fail();
    }
  }
}

let deleteProfileImage:DeleteProfileImageTriggerType = function deleteProfileImage(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();
    let allImagesToDelete = ['original', ...imageSizes];

    try {
      for (let i = 0;  i < allImagesToDelete.length; i++) {
        let identifier = `profile-image-${allImagesToDelete[i]}`;
        await promisify(mApi().user.files.identifier.del(state.status.userId, identifier), 'callback')();
      }

      dispatch(updateStatusHasImage(false));
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      console.log(err);
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.profileImage.remove"), 'error'));
    }
  }
}

export {loadProfilePropertiesSet, saveProfileProperty, loadProfileUsername, loadProfileAddress, updateProfileAddress, loadProfileChatSettings, updateProfileChatSettings, uploadProfileImage, deleteProfileImage};