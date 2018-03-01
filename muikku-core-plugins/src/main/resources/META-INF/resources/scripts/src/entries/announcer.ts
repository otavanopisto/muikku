import App from '~/containers/announcer';
import reducer from '~/reducers/announcer';
import runApp from '~/run';
import titleActions from '~/actions/base/title';
import mainFunctionDefault from '~/util/base-main-function';
import { loadAnnouncements, loadAnnouncement } from '~/actions/main-function/announcer/announcements';
import { Action } from 'redux';

let store = runApp(reducer, App);
mainFunctionDefault(store);
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('plugin.announcer.pageTitle')));

let currentLocation = window.location.hash.replace("#","").split("/");
function loadLocation(location: string[]){
  if (location.length === 1){
    store.dispatch(<Action>loadAnnouncements(location[0]));
  } else {
    store.dispatch(<Action>loadAnnouncement(location[0], parseInt(location[1])));
  }
}

window.addEventListener("hashchange", ()=>{
  let newLocation: string[] = window.location.hash.replace("#","").split("/");
  loadLocation(newLocation);
}, false);
if (!window.location.hash){
  window.location.hash = "#active";
} else {
  loadLocation(currentLocation);
}