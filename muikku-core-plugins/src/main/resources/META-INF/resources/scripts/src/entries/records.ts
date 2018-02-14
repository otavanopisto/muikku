import App from '~/containers/records';
import reducer from '~/reducers/records';
import runApp from '~/run';
import {Action} from 'redux';

import * as queryString from 'query-string';

import mainFunctionDefault from '~/util/base-main-function';

import titleActions from '~/actions/base/title';
import { updateAllStudentUsersAndSetViewToRecords, setCurrentStudentUserViewAndWorkspace } from '~/actions/main-function/records/records';
import { updateCurriculumFilters } from '~/actions/main-function/coursepicker/coursepicker-filters';

let store = runApp(reducer, App);
mainFunctionDefault(store);

store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.records.pageTitle')));
store.dispatch(<Action>updateCurriculumFilters());

function loadCurrentLocation(){
  let dataSplitted:Array<string> = window.location.hash.replace("#", "").split("?");
  let givenLocation = dataSplitted[0].split("/")[0];
  let originalData:any = queryString.parse(dataSplitted[1] || "", {arrayFormat: 'bracket'});
  
  if (!givenLocation && !originalData.w){
    store.dispatch(<Action>updateAllStudentUsersAndSetViewToRecords());
  } else if (!givenLocation){
    store.dispatch(<Action>setCurrentStudentUserViewAndWorkspace(parseInt(originalData.u), parseInt(originalData.w)));
  }
}

window.addEventListener("hashchange", ()=>{
  loadCurrentLocation();
}, false);

loadCurrentLocation();