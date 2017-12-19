import App from '~/containers/guider';
import reducer from '~/reducers/guider';
import runApp from '~/run';

import titleActions from '~/actions/base/title';
import * as queryString from 'query-string';

import mainFunctionDefault from '~/util/base-main-function';
import { Action } from 'redux';

let store = runApp(reducer, App);
mainFunctionDefault(store);
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.guider.guider')));

function loadLocation(originalData: any){
  
}

window.addEventListener("hashchange", ()=>{
  loadLocation(queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'}));
}, false);

let currentLocationData = queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
let currentLocationHasData = Object.keys(currentLocationData).length;
if (currentLocationHasData){
  loadLocation(currentLocationData);
}