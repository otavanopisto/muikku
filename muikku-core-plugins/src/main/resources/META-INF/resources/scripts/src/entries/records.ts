import App from '~/containers/records';
import reducer from '~/reducers/records';
import runApp from '~/run';
import {Action} from 'redux';

import * as queryString from 'query-string';

import mainFunctionDefault from '~/util/base-main-function';

import titleActions from '~/actions/base/title';
import { updateAllStudentUsersAndSetViewToRecords, setCurrentStudentUserViewAndWorkspace, setLocationToVopsInTranscriptOfRecords, setLocationToHopsInTranscriptOfRecords } from '~/actions/main-function/records';
import { loadAvaliableCurriculumFiltersFromServer } from '~/actions/main-function/courses';
import { updateVops } from '~/actions/main-function/vops';
import { updateHops } from '~/actions/main-function/hops';

let store = runApp(reducer, App);
mainFunctionDefault(store);

store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.records.pageTitle')));
store.dispatch(<Action>loadAvaliableCurriculumFiltersFromServer());

function loadCurrentLocation(){
  let dataSplitted:Array<string> = window.location.hash.replace("#", "").split("?");
  let givenLocation = dataSplitted[0].split("/")[0];
  let originalData:any = queryString.parse(dataSplitted[1] || "", {arrayFormat: 'bracket'});
  
  if (!givenLocation && !originalData.w){
    store.dispatch(<Action>updateAllStudentUsersAndSetViewToRecords());
  } else if (!givenLocation){
    store.dispatch(<Action>setCurrentStudentUserViewAndWorkspace(parseInt(originalData.u), originalData.i, parseInt(originalData.w)));
  } else if (givenLocation === "vops"){
    store.dispatch(<Action>setLocationToVopsInTranscriptOfRecords());
    store.dispatch(<Action>updateVops());
  } else if (givenLocation === "hops"){
    store.dispatch(<Action>setLocationToHopsInTranscriptOfRecords());
    store.dispatch(<Action>updateHops());
  }
}

window.addEventListener("hashchange", ()=>{
  loadCurrentLocation();
}, false);

loadCurrentLocation();