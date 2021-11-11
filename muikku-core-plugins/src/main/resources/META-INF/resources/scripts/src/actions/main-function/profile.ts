import promisify, { promisifyNewConstructor } from '~/util/promisify';
import actions from '../base/notifications';
import {AnyActionType, SpecificActionType} from '~/actions';
import mApi, { MApiError } from '~/lib/mApi';
import { StudentUserAddressType, UserWithSchoolDataType, UserChatSettingsType} from '~/reducers/user-index';
import { StateType } from '~/reducers';
import { resize } from '~/util/modifiers';
import { updateStatusProfile, updateStatusHasImage } from '~/actions/base/status';
import { PurchaseType, StoredWorklistItem, WorklistBillingState, WorklistItemsSummary, WorklistSection, WorklistTemplate } from '~/reducers/main-function/profile';
import moment from '~/lib/moment';

export interface LoadProfilePropertiesSetTriggerType {
  ():AnyActionType
}

export interface SaveProfilePropertyTriggerType {
  (data: {
    key: string,
    value: string,
    success: ()=>any,
    fail: ()=>any
  }):AnyActionType
}

export interface LoadProfileUsernameTriggerType {
  ():AnyActionType
}

export interface LoadProfileAddressTriggerType {
  ():AnyActionType
}

export interface LoadProfilePurchasesTriggerType {
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
    visibility: string,
    nick?: string,
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

export interface SetProfileLocationTriggerType {
  (location: string):AnyActionType
}

export interface LoadProfileWorklistTemplatesTriggerType {
  (): AnyActionType;
}

export interface LoadProfileWorklistSectionsTriggerType {
  (cb?: (d: Array<WorklistSection>) => void): AnyActionType;
}

export interface InsertProfileWorklistItemTriggerType {
  (data: {
    templateId: number,
    description: string,
    entryDate: string,
    price: number,
    factor: number,
    billingNumber: number,
    success?: () => void,
    fail?: () => void,
  }): AnyActionType;
}

export interface DeleteProfileWorklistItemTriggerType {
  (data: {
    item: StoredWorklistItem,
    success?: () => void,
    fail?: () => void,
  }): AnyActionType;
}

export interface EditProfileWorklistItemTriggerType {
  (data: {
    item: StoredWorklistItem,
    description: string,
    entryDate: string,
    price: number,
    factor: number,
    billingNumber: number,
    success?: () => void,
    fail?: () => void,
  }): AnyActionType;
}

export interface UpdateProfileWorklistItemsStateTriggerType {
  (data: {
    beginDate: string;
    endDate: string;
    state: WorklistBillingState;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

export interface LoadProfileWorklistSectionTriggerType {
  (index: number, refresh?: boolean): AnyActionType;
}

export interface SET_PROFILE_USERNAME extends SpecificActionType<"SET_PROFILE_USERNAME", string>{}
export interface SET_PROFILE_LOCATION extends SpecificActionType<"SET_PROFILE_LOCATION", string>{}
export interface SET_PROFILE_ADDRESSES extends SpecificActionType<"SET_PROFILE_ADDRESSES", Array<StudentUserAddressType>>{}
export interface SET_PROFILE_STUDENT extends SpecificActionType<"SET_PROFILE_STUDENT", UserWithSchoolDataType>{}
export interface SET_PROFILE_CHAT_SETTINGS extends SpecificActionType<"SET_PROFILE_CHAT_SETTINGS", UserChatSettingsType>{}
export interface SET_WORKLIST_TEMPLATES extends SpecificActionType<"SET_WORKLIST_TEMPLATES", Array<WorklistTemplate>>{}
export interface SET_WORKLIST extends SpecificActionType<"SET_WORKLIST", Array<WorklistSection>>{}
export interface SET_PURCHASE_HISTORY  extends SpecificActionType<"SET_PURCHASE_HISTORY", Array<PurchaseType>>{};

let loadProfilePropertiesSet:LoadProfilePropertiesSetTriggerType =  function loadProfilePropertiesSet() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    try {
      let properties:any = (await promisify(mApi().user.properties.read(state.status.userId, {
        properties: 'profile-phone,profile-vacation-start,profile-vacation-end,communicator-auto-reply,communicator-auto-reply-msg,communicator-auto-reply-subject'
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

let saveProfileProperty:SaveProfilePropertyTriggerType = function saveProfileProperty(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {
      const prop = {key: data.key, value: data.value};
      await promisify(mApi().user.property.create(prop), 'callback')();

      dispatch({
        type: "SET_PROFILE_USER_PROPERTY",
        payload: prop,
      });

      data.success && data.success();
    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }

      data.fail && data.fail();
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

      data.success && data.success();

    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }

      data.fail && data.fail();
    }
  }
}

let loadProfileChatSettings:LoadProfileChatSettingsTriggerType = function loadProfileChatSettings(){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    const state = getState();
    if (state.profile.chatSettings) {
      return;
    }
    try {
      let chatSettings:any = (await promisify(mApi().chat.settings.cacheClear().read(), 'callback')());

      if (chatSettings && chatSettings.visibility) {
        dispatch({
          type: "SET_PROFILE_CHAT_SETTINGS",
          payload: chatSettings
        });
      } else {
        dispatch({
          type: "SET_PROFILE_CHAT_SETTINGS",
          payload: {
            visibility: "DISABLED",
            nick: null,
          },
        });
      }

    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      } else {
        dispatch({
          type: "SET_PROFILE_CHAT_SETTINGS",
          payload: {
            visibility: "DISABLED",
            nick: null,
          },
        });
      }
    }
  }
}

let updateProfileChatSettings: UpdateProfileChatSettingsTriggerType = function updateProfileChatSettings(data){
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    try {

      const request = await fetch("/rest/chat/settings", {
        method: "PUT",
        body: JSON.stringify({visibility: data.visibility, nick: data.nick}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const status = request.status;
      if (status === 200) {
        const json = <UserChatSettingsType>(await request.json());

        dispatch({
          type: "SET_PROFILE_CHAT_SETTINGS",
          payload: <UserChatSettingsType>(json),
        });

        data.success && data.success();
      } else {
        const message = await request.text();
        dispatch(actions.displayNotification(message, 'error'));
        data.fail && data.fail();
      }

    } catch(err){
      if (!(err instanceof MApiError)){
        throw err;
      }

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
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.profileImage.remove"), 'error'));
    }
  }
}

const setProfileLocation: SetProfileLocationTriggerType = function setProfileLocation(location: string) {
  return {
    type: "SET_PROFILE_LOCATION",
    payload: location,
  }
}

const insertProfileWorklistItem: InsertProfileWorklistItemTriggerType = function insertProfileWorklistItem(data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    if (!state.profile || !state.profile.worklist) {
      return;
    }

    try {
      const worklistItem: StoredWorklistItem = await promisify(mApi().worklist.worklistItems.create(data), 'callback')() as StoredWorklistItem;

      let displayName = state.i18n.time.format(worklistItem.entryDate, "MMMM YYYY");
      displayName = displayName[0].toUpperCase() + displayName.substr(1);

      const expectedSummary: WorklistItemsSummary = {
        beginDate: moment(worklistItem.entryDate).startOf("month").format("YYYY-MM-DD"),
        endDate: moment(worklistItem.entryDate).endOf("month").format("YYYY-MM-DD"),
        displayName,
        count: 1,
      }

      const currWorklist = getState().profile.worklist;
      const matchingSummaryIndex = currWorklist.findIndex((f) => f.summary.beginDate === expectedSummary.beginDate);
      if (matchingSummaryIndex === -1) {
        const newWorklist = [...currWorklist];
        const entryDate = moment(worklistItem.entryDate).startOf("month");
        const itemWithMoreIndex = newWorklist.findIndex((p) => {
          return moment(p.summary.beginDate).isAfter(entryDate);
        });

        // we can add it here right away because not finding
        // the worklist summary thing means that it was just
        // created so we can add its single item right away
        if (itemWithMoreIndex === -1) {
          newWorklist.push({
            summary: expectedSummary,
            items: [worklistItem],
          });
        } else {
          newWorklist.splice(itemWithMoreIndex, 0, {
            summary: expectedSummary,
            items: [worklistItem],
          });
        }

        dispatch({
          type: "SET_WORKLIST",
          payload: newWorklist,
        });
      } else {
        const newSummary = {...currWorklist[matchingSummaryIndex]};
        newSummary.summary.count++;

        // on the other hand here we should only add the worklist
        // item if there are items already rather than null
        // in which case it hasn't been loaded
        if (newSummary.items) {
          const itemWithMoreIndex = newSummary.items.findIndex((p) => {
            return moment(p.entryDate).isAfter(worklistItem.entryDate);
          });

          if (itemWithMoreIndex === -1) {
            newSummary.items = [...newSummary.items, worklistItem];
          } else {
            newSummary.items.splice(itemWithMoreIndex, 0, worklistItem);
          }

        }

        const newWorklist = [...currWorklist]
        newWorklist[matchingSummaryIndex] = newSummary;

        dispatch({
          type: "SET_WORKLIST",
          payload: newWorklist,
        });
      }
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      data.fail && data.fail();
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.worklist"), 'error'));
    }
  }
}

const deleteProfileWorklistItem: DeleteProfileWorklistItemTriggerType = function deleteProfileWorklistItem(data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    if (!state.profile || !state.profile.worklist) {
      return;
    }

    try {
      await promisify(mApi().worklist.worklistItems.del(data.item), 'callback')();
      const expectedSummaryBeginDate = moment(data.item.entryDate).startOf("month").format("YYYY-MM-DD");

      const currWorklist = getState().profile.worklist;
      const matchingSummaryIndex = currWorklist.findIndex((f) => f.summary.beginDate === expectedSummaryBeginDate);
      if (matchingSummaryIndex !== -1) {
        const newSummary = {...currWorklist[matchingSummaryIndex]};
        newSummary.summary.count--;

        if (newSummary.items) {
          newSummary.items = newSummary.items.filter((i) => i.id !== data.item.id);
        }

        let newWorklist: WorklistSection[];
        if (newSummary.summary.count === 0) {
          newWorklist = currWorklist.filter((i, index) => {
            return index !== matchingSummaryIndex;
          });
        } else {
          newWorklist = [...currWorklist];
          newWorklist[matchingSummaryIndex] = newSummary;
        }

        dispatch({
          type: "SET_WORKLIST",
          payload: newWorklist,
        });
      }
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      data.fail && data.fail();
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.worklist"), 'error'));
    }
  }
}

const editProfileWorklistItem: EditProfileWorklistItemTriggerType = function deleteProfileWorklistItem(data) {
  if (
    data.description === data.item.description &&
    data.entryDate === data.item.entryDate &&
    data.factor === data.item.factor &&
    data.price === data.item.price &&
    data.billingNumber === data.item.billingNumber
  ) {
    data.success && data.success();
    return;
  }

  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    if (!state.profile || !state.profile.worklist) {
      return;
    }

    try {
      const newWorklistItem: StoredWorklistItem = await promisify(mApi().worklist.worklistItems.update({
        id: data.item.id,
        entryDate: data.entryDate,
        description: data.description,
        price: data.price,
        factor: data.factor,
        billingNumber: data.billingNumber,
      }), 'callback')() as StoredWorklistItem;

      const expectedSummaryBeginDate = moment(newWorklistItem.entryDate).startOf("month").format("YYYY-MM-DD");

      const currWorklist = getState().profile.worklist;
      const matchingSummaryIndex = currWorklist.findIndex((f) => f.summary.beginDate === expectedSummaryBeginDate);
      if (matchingSummaryIndex !== -1 && currWorklist[matchingSummaryIndex].items) {
        const newSummary = {...currWorklist[matchingSummaryIndex]};

        let newItems = newSummary.items.filter((i) => {
          if (i.id === data.item.id) {
            return false;
          }

          return true;
        });

        const itemWithMoreIndex = newItems.findIndex((p) => {
          return moment(p.entryDate).isAfter(newWorklistItem.entryDate);
        });

        if (itemWithMoreIndex === -1) {
          newItems = [...newItems, newWorklistItem];
        } else {
          newItems.splice(itemWithMoreIndex, 0, newWorklistItem);
        }

        newSummary.items = newItems;

        const newWorklist = [...currWorklist]
        newWorklist[matchingSummaryIndex] = newSummary;

        dispatch({
          type: "SET_WORKLIST",
          payload: newWorklist,
        });
      }
      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      data.fail && data.fail();
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.worklist"), 'error'));
    }
  }
}

const loadProfileWorklistTemplates: LoadProfileWorklistTemplatesTriggerType = function loadProfileWorklistTemplates() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    if (state.profile && state.profile.worklistTemplates) {
      return;
    }

    try {
      const templates = await promisify(mApi().worklist.templates.read(), 'callback')();;
      dispatch({
        type: "SET_WORKLIST_TEMPLATES",
        payload: <Array<WorklistTemplate>>templates,
      });
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.worklist"), 'error'));
    }
  }
}

const loadProfileWorklistSections: LoadProfileWorklistSectionsTriggerType = function loadProfileWorklistSections(cb?: (d: Array<WorklistSection>) => void) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    if (state.profile && state.profile.worklist) {
      return;
    }

    try {
      const summaries: Array<WorklistItemsSummary> = await promisify(mApi().worklist.worklistSummary.read({
        owner: state.status.userSchoolDataIdentifier,
      }), 'callback')() as any;
      const payload = summaries.map((s) => {
        return {
          summary: s,
          items: null,
        }
      });
      dispatch({
        type: "SET_WORKLIST",
        payload,
      });
      cb && cb(payload);
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.worklist"), 'error'));
    }
  }
}

const loadProfileWorklistSection: LoadProfileWorklistSectionTriggerType = function loadProfileWorklistSection(index: number, refresh?: boolean) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    if ((!state.profile || !state.profile.worklist || !state.profile.worklist[index]) || (state.profile.worklist[index].items && !refresh)) {
      return;
    }

    try {
      const summary = state.profile.worklist[index].summary;
      const items: Array<StoredWorklistItem> = await promisify(mApi().worklist.worklistItems.read({
        owner: state.status.userSchoolDataIdentifier,
        beginDate: summary.beginDate,
        endDate: summary.endDate,
      }), 'callback')() as any;
      const newWorkList = [...getState().profile.worklist];
      newWorkList[index] = {...newWorkList[index], items};

      dispatch({
        type: "SET_WORKLIST",
        payload: newWorkList,
      });

    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.worklist"), 'error'));
    }
  }
}

const loadProfilePurchases: LoadProfilePurchasesTriggerType = function loadProfilePurchases() {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();
    try {

      const studentId = state.status.userSchoolDataIdentifier.replace("PYRAMUS-", "");
      const historia: PurchaseType[] = await promisify(mApi().ceepos.user.orders.read(studentId), 'callback')() as any;

      dispatch({
        type: "SET_PURCHASE_HISTORY",
        payload: historia,
      });

    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.purchases"), 'error'));
    }
  }
}

const updateProfileWorklistItemsState: UpdateProfileWorklistItemsStateTriggerType = function updateProfileWorklistItemsState(data) {
  return async (dispatch:(arg:AnyActionType)=>any, getState:()=>StateType)=>{
    let state = getState();

    if (!state.profile || !state.profile.worklist) {
      return;
    }

    try {
      const updatedItems: Array<StoredWorklistItem> = await promisify(mApi().worklist.updateWorklistItemsState.update({
        userIdentifier: state.status.userSchoolDataIdentifier,
        beginDate: data.beginDate,
        endDate: data.endDate,
        state: data.state,
      }), 'callback')() as any;

      // create a new worklist where we would replace the old worklist items with
      const newWorkList = getState().profile.worklist.map((worklistGroup) => {
        const newWorklistGroup = {...worklistGroup};
        if (newWorklistGroup.items) {
          newWorklistGroup.items = newWorklistGroup.items.map((i) => {
            const foundInUpdate = updatedItems.find((updatedItem) => updatedItem.id === i.id);
            // we merge the data in case, as there had been issues with incomplete data from
            // the update that is partial
            return {...i, ...foundInUpdate} || i;
          });
        }
        return newWorklistGroup;
      });

      dispatch({
        type: "SET_WORKLIST",
        payload: newWorkList,
      });

      data.success && data.success();
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
      dispatch(actions.displayNotification(getState().i18n.text.get("plugin.profile.errormessage.worklist"), 'error'));
      data.fail && data.fail();
    }
  }
}

export {loadProfilePropertiesSet, saveProfileProperty, loadProfileUsername, loadProfileAddress,
  updateProfileAddress, loadProfileChatSettings, updateProfileChatSettings, uploadProfileImage,
  deleteProfileImage, setProfileLocation, loadProfileWorklistTemplates, loadProfileWorklistSections,
  loadProfileWorklistSection, insertProfileWorklistItem, deleteProfileWorklistItem, editProfileWorklistItem,
  updateProfileWorklistItemsState, loadProfilePurchases};

