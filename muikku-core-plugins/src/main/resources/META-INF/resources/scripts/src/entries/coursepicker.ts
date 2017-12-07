import App from '~/containers/coursepicker';
import reducer from '~/reducers/coursepicker';
import runApp from '~/run';
import {Action} from 'redux';
import mainFunctionDefault from '~/util/base-main-function';

import queryString from 'query-string';

import actions from '~/actions/main-function';
import titleActions from '~/actions/base/title';
import { loadUserIndexBySchoolData } from '~/actions/main-function/user-index';
import { updateEducationFilters, updateCurriculumFilters } from '~/actions/main-function/coursepicker/coursepicker-filters';

let store = runApp(reducer, App);
mainFunctionDefault(store);
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('TODO coursepicker title')));
store.dispatch(<Action>loadUserIndexBySchoolData(store.getState().status.userSchoolDataIdentifier));
store.dispatch(<Action>updateEducationFilters());
store.dispatch(<Action>updateCurriculumFilters());

function loadLocation(originalData: any){
  let actualDataToUse = {
    "educationFilters": originalData.e.map((n: string)=>parseInt(n)),
    "curriculumFilters": originalData.c.map((n: string)=>parseInt(n))
  }
  //TODO trigger the action here to update the filters
}

window.addEventListener("hashchange", ()=>{
  loadLocation(queryString.parse(window.location.hash));
}, false);
loadLocation(queryString.parse(window.location.hash));