import Notifications from '../components/base/notifications';
import { BrowserRouter, Route } from 'react-router-dom';
import * as React from 'react';
import '~/sass/util/base.scss';

import { Store } from 'react-redux';
import { StateType } from '~/reducers';
import {Action} from 'redux';
import Websocket from '~/util/websocket';
import * as queryString from 'query-string';

import titleActions from '~/actions/base/title';

import IndexBody from '../components/index/body';
import { loadAnnouncementsAsAClient } from '~/actions/main-function/announcements';
import { loadLastWorkspaceFromServer, loadWorkspacesFromServer } from '~/actions/main-function/workspaces';
import { loadLastMessageThreadsFromServer } from '~/actions/main-function/messages';

import CousePickerBody from '../components/coursepicker/body';
import { loadLoggedUser } from '~/actions/main-function/user-index';
import { loadCoursesFromServer, loadAvaliableEducationFiltersFromServer, loadAvaliableCurriculumFiltersFromServer } from '~/actions/main-function/courses';
import { CoursesActiveFiltersType } from '~/reducers/main-function/courses';
import { UserType } from '~/reducers/main-function/user-index';

import CommunicatorBody from '../components/communicator/body';
import { loadNewlyReceivedMessage, loadMessageThreads, loadMessageThread, loadMessagesNavigationLabels, loadSignature } from '~/actions/main-function/messages';

import DiscussionBody from '../components/discussion/body';
import {loadDiscussionAreasFromServer, loadDiscussionThreadsFromServer, loadDiscussionThreadFromServer} from '~/actions/main-function/discussion';

import {loadAnnouncement, loadAnnouncements} from '~/actions/main-function/announcements';
import AnnouncementsBody from '../components/announcements/body';
import { AnnouncementListType } from '~/reducers/main-function/announcements';

import AnnouncerBody from '../components/announcer/body';

import { updateLabelFilters, updateWorkspaceFilters } from '~/actions/main-function/guider';
import { GuiderActiveFiltersType } from '~/reducers/main-function/guider';
import { loadStudents, loadStudent } from '~/actions/main-function/guider';
import GuiderBody from '../components/guider/body';

import ProfileBody from '../components/profile/body';
import { loadProfilePropertiesSet, loadProfileUsername, loadProfileAddress } from '~/actions/main-function/profile';

interface MainFunctionProps {
  store: Store<StateType>,
  websocket: Websocket
}

(window as any).USES_HISTORY_API = true;

export default class MainFunction extends React.Component<MainFunctionProps,{}> {
  private prevPathName:string;
  private itsFirstTime:boolean;
  private loadedLibs:Array<string>;

  constructor(props: MainFunctionProps){
    super(props);
    
    this.renderIndexBody = this.renderIndexBody.bind(this);
    this.renderCoursePickerBody = this.renderCoursePickerBody.bind(this);
    this.renderCommunicatorBody = this.renderCommunicatorBody.bind(this);
    this.renderDiscussionBody = this.renderDiscussionBody.bind(this);
    this.renderAnnouncementsBody = this.renderAnnouncementsBody.bind(this);
    this.renderAnnouncerBody = this.renderAnnouncerBody.bind(this);
    this.renderGuiderBody = this.renderGuiderBody.bind(this);
    this.renderProfileBody = this.renderProfileBody.bind(this);
    
    this.itsFirstTime = true;
    this.loadedLibs = [];
    
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }
  loadlib(url: string){
    if (this.loadedLibs.indexOf(url) !== -1){
      return;
    }
    this.loadedLibs.push(url);
    
    let script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
  }
  onHashChange(){ 
    if (window.location.pathname.includes("/coursepicker")){
      this.loadCoursePickerData(queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'}));
    } else if (window.location.pathname.includes("/communicator")){
      this.loadCommunicatorData(window.location.hash.replace("#","").split("/"));
    } else if (window.location.pathname.includes("/discussion")){
      this.loadDiscussionData(window.location.hash.replace("#","").split("/"));
    } else if (window.location.pathname.includes("/announcements")){
      this.loadAnnouncementsData(parseInt(window.location.hash.replace("#","")));
    } else if (window.location.pathname.includes("/announcer")){
      this.loadAnnouncerData(window.location.hash.replace("#","").split("/"));
    } else if (window.location.pathname.includes("/guider")){
      this.loadGuiderData();
    }
  }
  updateFirstTime(){
    this.itsFirstTime = window.location.pathname !== this.prevPathName;
    this.prevPathName = window.location.pathname;
  }
  loadGuiderData(){
    //This code allows you to use the weird deprecated #userprofile/PYRAMUS-STUDENT-30055%22%3EJuhana type of links
    if (window.location.hash.replace("#","").indexOf("userprofile") === 0) {
      this.props.store.dispatch(loadStudent(decodeURIComponent(window.location.hash.split("/")[1]).split('"')[0]) as Action)
      return;
    }
    let originalData:any = queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});

    if (!originalData.c){
      let filters:GuiderActiveFiltersType = {
        "workspaceFilters": (originalData.w || []).map((num:string)=>parseInt(num)),
        "labelFilters": (originalData.l || []).map((num:string)=>parseInt(num)),
        "query": originalData.q || ""
      }
      this.props.store.dispatch(loadStudents(filters) as Action);
      return;
    }

    this.props.store.dispatch(loadStudent(originalData.c) as Action)
  }
  loadAnnouncerData(location: string[]){
    if (location.length === 1){
      this.props.store.dispatch(loadAnnouncements(location[0]) as Action);
    } else {
      this.props.store.dispatch(loadAnnouncement(location[0], parseInt(location[1])) as Action);
    }
  }
  loadAnnouncementsData(announcementId: number){
    this.props.store.dispatch(loadAnnouncement(null, announcementId) as Action);
  }
  //NOTE because loadDiscussionThreadsFromServer can only run after areas have been loaded, this needs to be so
  loadDiscussionData(location: string[]){
    if (location.length <= 2){
      //The link is expected to be like # none, in this case it will collapse to null, page 1
      //Else it can be #1 in that case it will collapse to area 1, page 1
      //Or otherwise #1/2 in that case it will collapse to area 1 page 2
      
      this.props.store.dispatch(loadDiscussionThreadsFromServer({
        areaId: parseInt(location[0]) || null,
        page: parseInt(location[1]) || 1
      }) as Action);
    } else {
      //There will always be an areaId and page designed #1/2/3 where then 3 is the threaid
      //and there can be a page as #1/2/3/4
      this.props.store.dispatch(loadDiscussionThreadFromServer({
        areaId: parseInt(location[0]),
        page: parseInt(location[1]),
        threadId: parseInt(location[2]),
        threadPage: parseInt(location[3]) || 1
      }) as Action);
    }
  }
  loadCoursePickerData(originalData:any){
    let filters:CoursesActiveFiltersType = {
      educationFilters: originalData.e || [],
      curriculumFilters: originalData.c || [],
      query: originalData.q || null,
      baseFilter: originalData.b || "ALL_COURSES"
    }
    this.props.store.dispatch(loadCoursesFromServer(filters) as Action);
  }
  loadCommunicatorData(location: string[]){
    if (location.length === 1){
      this.props.store.dispatch(loadMessageThreads(location[0]) as Action);
    } else {
      this.props.store.dispatch(loadMessageThread(location[0], parseInt(location[1])) as Action);
    }
  }
  renderCoursePickerBody(){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.props.store.dispatch(loadAvaliableEducationFiltersFromServer() as Action);
      this.props.store.dispatch(loadAvaliableCurriculumFiltersFromServer() as Action);
      
      this.props.store.dispatch(titleActions.updateTitle(this.props.store.getState().i18n.text.get('plugin.coursepicker.pageTitle')));
      
      let currentLocationData = queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
      let currentLocationHasData = Object.keys(currentLocationData).length;
      
      let state:StateType = this.props.store.getState();
      if (state.status.loggedIn){
        this.props.store.dispatch(loadLoggedUser((user:UserType)=>{
          if (!currentLocationHasData && user.curriculumIdentifier){
            location.hash = "#?" + queryString.stringify({
              c: [user.curriculumIdentifier]
            }, {arrayFormat: 'bracket'});
          } else {
            this.loadCoursePickerData(currentLocationData);
          }
        }) as Action);
      } else {
        this.loadCoursePickerData(currentLocationData);
      }
    }
    
    return <CousePickerBody/>
  }
  renderIndexBody(){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners().addEventListener("Communicator:newmessagereceived", loadLastMessageThreadsFromServer.bind(null,6));
      
      this.props.store.dispatch(loadAnnouncementsAsAClient() as Action);
      this.props.store.dispatch(loadLastWorkspaceFromServer() as Action);
      this.props.store.dispatch(loadWorkspacesFromServer() as Action);
      this.props.store.dispatch(loadLastMessageThreadsFromServer(6) as Action);
      this.props.store.dispatch(titleActions.updateTitle(this.props.store.getState().i18n.text.get('plugin.site.title')));
    }
    
    return <IndexBody/>
  }
  renderCommunicatorBody(){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners().addEventListener("Communicator:newmessagereceived", loadNewlyReceivedMessage);
      
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/ckeditor/4.5.9/ckeditor.js");
      
      this.props.store.dispatch(titleActions.updateTitle(this.props.store.getState().i18n.text.get('plugin.communicator.pageTitle')));
      this.props.store.dispatch(loadSignature() as Action);
      
      let currentLocation = window.location.hash.replace("#","").split("/");
      this.props.store.dispatch(loadMessagesNavigationLabels(()=>{
        if (currentLocation[0].includes("label")){
          this.loadCommunicatorData(currentLocation);
        }
      }) as Action);
      
      if (!window.location.hash){
        window.location.hash = "#inbox";
      } else {
        if (!currentLocation[0].includes("label")) {
          this.loadCommunicatorData(currentLocation);
        }
      }
    }
    
    return <CommunicatorBody/>
  }
  renderDiscussionBody(){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/ckeditor/4.5.9/ckeditor.js");
      
      this.props.store.dispatch(titleActions.updateTitle(this.props.store.getState().i18n.text.get('plugin.forum.pageTitle')));
      
      this.props.store.dispatch(loadDiscussionAreasFromServer(()=>{
        //here in the callback
        let currentLocation = window.location.hash.replace("#","").split("/");
        this.loadDiscussionData(currentLocation);
      }) as Action);
    }
    return <DiscussionBody/>
  }
  renderAnnouncementsBody(){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.props.store.dispatch(loadAnnouncementsAsAClient({hideWorkspaceAnnouncements: "false"}, (announcements:AnnouncementListType)=>{}) as Action);
      this.loadAnnouncementsData(parseInt(window.location.hash.replace("#","")));
    }
    return <AnnouncementsBody/>
  }
  renderAnnouncerBody(){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/ckeditor/4.5.9/ckeditor.js");
      
      this.props.store.dispatch(titleActions.updateTitle(this.props.store.getState().i18n.text.get('plugin.announcer.pageTitle')));
      
      if (!window.location.hash){
        window.location.hash = "#active";
      } else {
        this.loadAnnouncerData(window.location.hash.replace("#","").split("/"));
      }
    }
    
    return <AnnouncerBody/>
  }
  renderGuiderBody(){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.props.store.dispatch(titleActions.updateTitle(this.props.store.getState().i18n.text.get('plugin.guider.guider')));
      this.props.store.dispatch(updateLabelFilters() as Action);
      this.props.store.dispatch(updateWorkspaceFilters() as Action);
      
      this.loadGuiderData();
    }
    return <GuiderBody/>
  }
  renderProfileBody(){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.props.store.dispatch(titleActions.updateTitle(this.props.store.getState().i18n.text.get('plugin.profile.profile')));
      
      this.props.store.dispatch(loadProfileUsername() as Action);
      
      if (!this.props.store.getState().status.isStudent){
        this.props.store.dispatch(loadProfilePropertiesSet() as Action);
      } else {
        this.props.store.dispatch(loadProfileAddress() as Action);
      }
    }
    
    return <ProfileBody/>
  }
  render(){
    return (<BrowserRouter><div id="root">
      <Notifications></Notifications>
      <Route exact path="/" render={this.renderIndexBody}/>
      <Route path="/coursepicker" render={this.renderCoursePickerBody}/>
      <Route path="/communicator" render={this.renderCommunicatorBody}/>
      <Route path="/discussion" render={this.renderDiscussionBody}/>
      <Route path="/announcements" render={this.renderAnnouncementsBody}/>
      <Route path="/announcer" render={this.renderAnnouncerBody}/>
      <Route path="/guider" render={this.renderGuiderBody}/>
      <Route path="/profile" render={this.renderProfileBody}/>
    </div></BrowserRouter>);
  }
}