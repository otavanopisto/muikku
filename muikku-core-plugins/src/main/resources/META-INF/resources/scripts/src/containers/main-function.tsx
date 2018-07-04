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
import { loadUserIndexBySchoolData } from '~/actions/main-function/user-index';
import { loadCoursesFromServer, loadAvaliableEducationFiltersFromServer, loadAvaliableCurriculumFiltersFromServer } from '~/actions/main-function/courses';
import { CoursesActiveFiltersType } from '~/reducers/main-function/courses';
import { UserType } from '~/reducers/main-function/user-index';

interface MainFunctionProps {
  store: Store<StateType>,
  websocket: Websocket
}

export default class MainFunction extends React.Component<MainFunctionProps,{}> {
  private prevPathName:string;
  private itsFirstTime:boolean;
  constructor(props: MainFunctionProps){
    super(props);
    
    this.renderIndexBody = this.renderIndexBody.bind(this);
    this.renderCoursePickerBody = this.renderCoursePickerBody.bind(this);
    
    this.itsFirstTime = true;
    
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }
  onHashChange(){ 
    if (window.location.pathname.includes("/coursepicker")){
      this.loadCoursePickerData(queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'}));
    }
  }
  updateFirstTime(){
    this.itsFirstTime = window.location.pathname !== this.prevPathName;
    this.prevPathName = window.location.pathname;
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
  renderCoursePickerBody(){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.props.store.dispatch(loadAvaliableEducationFiltersFromServer() as Action);
      this.props.store.dispatch(loadAvaliableCurriculumFiltersFromServer() as Action);
      
      this.props.store.dispatch(titleActions.updateTitle(this.props.store.getState().i18n.text.get('plugin.coursepicker.pageTitle')));
      
      let currentLocationData = queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
      let currentLocationHasData = Object.keys(currentLocationData).length;
      if (currentLocationHasData){
        this.loadCoursePickerData(currentLocationData);
      }
      
      let state:StateType = this.props.store.getState();
      if (state.status.loggedIn){
        this.props.store.dispatch(loadUserIndexBySchoolData(state.status.userSchoolDataIdentifier, (user:UserType)=>{
          if (!currentLocationHasData && user.curriculumIdentifier){
            location.hash = "#?" + queryString.stringify({
              c: [user.curriculumIdentifier]
            }, {arrayFormat: 'bracket'});
          } else if (!currentLocationHasData){
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
  render(){
    return (<BrowserRouter><div id="root">
      <Notifications></Notifications>
      <Route exact path="/" render={this.renderIndexBody}/>
      <Route path="/coursepicker" render={this.renderCoursePickerBody}/>
    </div></BrowserRouter>);
  }
}