import App from '~/containers/announcements';
import reducer from '~/reducers/announcements';
import runApp from '~/run';
import mainFunctionDefault from '~/util/base-main-function';
import { Action } from 'redux';
import {loadAnnouncementsAsAClient, loadAnnouncement} from '~/actions/main-function/announcements';
import {AnnouncementListType} from '~/reducers/main-function/announcements';

let store = runApp(reducer, App);
mainFunctionDefault(store);

let urlString = window.location.search;
let indexOf = urlString.indexOf('=') + 1;    
let annnouncementId = parseInt(urlString.substring(indexOf));

store.dispatch(<Action>loadAnnouncementsAsAClient({hideWorkspaceAnnouncements: "false"}, (announcements:AnnouncementListType)=>{}));
store.dispatch(<Action>loadAnnouncement(null, annnouncementId));

//let currentLocation = window.location.hash.replace("#","").split("/");
//function loadLocation(location: string[]){
//  if (location.length === 1){
//    store.dispatch(<Action>loadAnnouncements(location[0]));
//  } else {
//    store.dispatch(<Action>loadAnnouncement(location[0], parseInt(location[1])));
//  }
//}
//
//window.addEventListener("hashchange", ()=>{
//  let newLocation: string[] = window.location.hash.replace("#","").split("/");
//  loadLocation(newLocation);
//}, false);
//if (!window.location.hash){
//  window.location.hash = "#active";
//} else {
//  loadLocation(currentLocation);
//}