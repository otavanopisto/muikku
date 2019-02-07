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

import WorkspaceHomeBody from '~/components/workspace/workspaceHome';
import WorkspaceHelpBody from '~/components/workspace/workspaceHelp';
import WorkspaceDiscussionBody from '~/components/workspace/workspaceDiscussions';
import WorkspaceAnnouncementsBody from '~/components/workspace/workspaceAnnouncements';
import WorkspaceAnnouncerBody from '~/components/workspace/workspaceAnnouncer';
import WorkspaceMaterialsBody from '~/components/workspace/workspaceMaterials';

import { RouteComponentProps } from 'react-router';
import { setCurrentWorkspace, loadStaffMembersOfWorkspace, loadWholeWorkspaceMaterials,
  setCurrentWorkspaceMaterialsActiveNodeId, loadWorkspaceCompositeMaterialReplies,
  updateLastWorkspace,
  loadStudentsOfWorkspace} from '~/actions/workspaces';
import { loadAnnouncementsAsAClient, loadAnnouncement, loadAnnouncements } from '~/actions/announcements';
import { loadDiscussionAreasFromServer, loadDiscussionThreadsFromServer, loadDiscussionThreadFromServer, setDiscussionWorkpaceId } from '~/actions/discussion';
import WorkspaceUsersBody from '~/components/workspace/workspaceUsers';

interface WorkspaceProps {
  store: Store<StateType>,
  websocket: Websocket
}

(window as any).USES_HISTORY_API = true;

export default class Workspace extends React.Component<WorkspaceProps,{}> {
  private prevPathName:string;
  private itsFirstTime:boolean;
  private loadedLibs:Array<string>;

  constructor(props: WorkspaceProps){
    super(props);
    
    this.itsFirstTime = true;
    this.loadedLibs = [];
    
    this.updateFirstTime = this.updateFirstTime.bind(this);
    this.onHashChange = this.onHashChange.bind(this);
    this.renderWorkspaceHome = this.renderWorkspaceHome.bind(this);
    this.renderWorkspaceHelp = this.renderWorkspaceHelp.bind(this);
    this.renderWorkspaceDiscussions = this.renderWorkspaceDiscussions.bind(this);
    this.renderWorkspaceAnnouncements = this.renderWorkspaceAnnouncements.bind(this);
    this.renderWorkspaceAnnouncer = this.renderWorkspaceAnnouncer.bind(this);
    this.renderWorkspaceMaterials = this.renderWorkspaceMaterials.bind(this);
    this.renderWorkspaceUsers = this.renderWorkspaceUsers.bind(this);
    
    this.loadWorkspaceDiscussionData = this.loadWorkspaceDiscussionData.bind(this);
    this.loadWorkspaceAnnouncementsData = this.loadWorkspaceAnnouncementsData.bind(this);
    this.loadWorkspaceAnnouncerData = this.loadWorkspaceAnnouncerData.bind(this);
    this.loadWorkspaceMaterialsData = this.loadWorkspaceMaterialsData.bind(this);
    
    this.onWorkspaceMaterialsBodyActiveNodeIdChange = this.onWorkspaceMaterialsBodyActiveNodeIdChange.bind(this);
    
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
    if (window.location.pathname.includes("/discussion")){
      this.loadWorkspaceDiscussionData(window.location.hash.replace("#","").split("/"));
    } else if (window.location.pathname.includes("/announcements")){
      this.loadWorkspaceAnnouncementsData(parseInt(window.location.hash.replace("#","")));
    } else if (window.location.pathname.includes("/announcer")){
      this.loadWorkspaceAnnouncerData(window.location.hash.replace("#","").split("/"));
    } else if (window.location.pathname.includes("/materials")){
      if (window.location.hash.replace("#", "")){
        this.loadWorkspaceMaterialsData(parseInt(window.location.hash.replace("#", "").replace("p-", "")));
      } else if (this.props.store.getState().workspaces.currentMaterials &&
          this.props.store.getState().workspaces.currentMaterials[0] &&
          this.props.store.getState().workspaces.currentMaterials[0].children[0]) {
        this.loadWorkspaceMaterialsData(this.props.store.getState().workspaces.currentMaterials[0].children[0].workspaceMaterialId);
      }
    }
  }
  onWorkspaceMaterialsBodyActiveNodeIdChange(newId: number){
    let state:StateType = this.props.store.getState();
  
    if (!newId){
      history.pushState(null, null, '#');
      if (state.workspaces.currentMaterials &&
          state.workspaces.currentMaterials[0] &&
          state.workspaces.currentMaterials[0].children[0]) {
        this.loadWorkspaceMaterialsData(state.workspaces.currentMaterials[0].children[0].workspaceMaterialId);
        
        if (state.workspaces.currentWorkspace.isCourseMember){
          this.props.store.dispatch(updateLastWorkspace({
            url: location.origin + location.pathname,
            workspaceName: state.workspaces.currentWorkspace.name,
            materialName: state.workspaces.currentMaterials[0].children[0].title
          }) as Action)
        }
      }
    } else {
      history.pushState(null, null, '#p-' + newId);
      this.loadWorkspaceMaterialsData(newId);
      
      if (state.workspaces.currentWorkspace.isCourseMember){
        let indexFound = -1;
        let materialChapter = state.workspaces.currentMaterials.find(m=>{
          let index = m.children.findIndex(s=>s.workspaceMaterialId === newId);
          if (index !== -1){
            indexFound = index;
          }
          return index !== -1;
        });
        if (indexFound !== -1){
          this.props.store.dispatch(updateLastWorkspace({
            url: location.origin + location.pathname + '#p-' + newId,
            workspaceName: state.workspaces.currentWorkspace.name,
            materialName: materialChapter.children[indexFound].title
          }) as Action);
        }
      }
    }
  }
  renderWorkspaceHome(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.status.currentWorkspaceName));
      this.props.store.dispatch(setCurrentWorkspace({workspaceId: state.status.currentWorkspaceId, success: (workspace)=>{
        if (!workspace.staffMembers && state.status.permissions.WORSKPACE_LIST_WORKSPACE_MEMBERS){
          this.props.store.dispatch(loadStaffMembersOfWorkspace(workspace) as Action)
        }
      }}) as Action);
      
      if (state.status.loggedIn && state.status.isActiveUser && state.status.permissions.WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS){
        this.props.store.dispatch(loadAnnouncementsAsAClient({
          hideEnvironmentAnnouncements: "false",
          workspaceEntityId: state.status.currentWorkspaceId
        }) as Action);
      }
      
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/ckeditor/4.5.9/ckeditor.js");
    }
    
    return <WorkspaceHomeBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  renderWorkspaceHelp(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.status.currentWorkspaceName));
      this.props.store.dispatch(setCurrentWorkspace({workspaceId: state.status.currentWorkspaceId}) as Action);
    }
    
    return <WorkspaceHelpBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  renderWorkspaceDiscussions(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/ckeditor/4.5.9/ckeditor.js");
      
      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.status.currentWorkspaceName));
      this.props.store.dispatch(setCurrentWorkspace({workspaceId: state.status.currentWorkspaceId}) as Action);
      this.props.store.dispatch(setDiscussionWorkpaceId(state.status.currentWorkspaceId) as Action);
      this.props.store.dispatch(loadDiscussionAreasFromServer(()=>{
        //here in the callback
        let currentLocation = window.location.hash.replace("#","").split("/");
        this.loadWorkspaceDiscussionData(currentLocation);
      }) as Action);
    }
    
    return <WorkspaceDiscussionBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  renderWorkspaceAnnouncements(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.status.currentWorkspaceName));
      
      //Maybe we shouldn't load again, but whatever, maybe it updates
      this.props.store.dispatch(loadAnnouncementsAsAClient({
        hideEnvironmentAnnouncements: "false",
        workspaceEntityId: state.status.currentWorkspaceId
      }) as Action);
      
      this.loadWorkspaceAnnouncementsData(parseInt(window.location.hash.replace("#","")));
    }
    return <WorkspaceAnnouncementsBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  renderWorkspaceAnnouncer(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/ckeditor/4.5.9/ckeditor.js");
      
      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.status.currentWorkspaceName));
      this.props.store.dispatch(setCurrentWorkspace({workspaceId: state.status.currentWorkspaceId}) as Action);
      
      if (!window.location.hash){
        window.location.hash = "#active";
      } else {
        this.loadWorkspaceAnnouncerData(window.location.hash.replace("#","").split("/"));
      }
    }
    return <WorkspaceAnnouncerBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  updateFirstTime(){
    this.itsFirstTime = window.location.pathname !== this.prevPathName;
    this.prevPathName = window.location.pathname;
  }
  loadWorkspaceDiscussionData(location: string[]){
    let state = this.props.store.getState();
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
  loadWorkspaceAnnouncementsData(announcementId: number){
    this.props.store.dispatch(loadAnnouncement(null, announcementId) as Action);
  }
  loadWorkspaceAnnouncerData(location: string[]){
    let state = this.props.store.getState();
    if (location.length === 1){
      this.props.store.dispatch(loadAnnouncements(location[0], state.status.currentWorkspaceId) as Action);
    } else {
      this.props.store.dispatch(loadAnnouncement(location[0], parseInt(location[1]), state.status.currentWorkspaceId) as Action);
    }
  }
  loadWorkspaceMaterialsData(id: number): void {
    if (id){
      this.props.store.dispatch(setCurrentWorkspaceMaterialsActiveNodeId(id) as Action);
    }
  }
  renderWorkspaceMaterials(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/ckeditor/4.5.9/ckeditor.js");
      
      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.status.currentWorkspaceName));
      this.props.store.dispatch(setCurrentWorkspace({workspaceId: state.status.currentWorkspaceId}) as Action);
      this.props.store.dispatch(loadWorkspaceCompositeMaterialReplies(state.status.currentWorkspaceId) as Action);
      this.props.store.dispatch(loadWholeWorkspaceMaterials(state.status.currentWorkspaceId, (result)=>{
        if (!window.location.hash.replace("#", "") && result[0] && result[0].children && result[0].children[0]){
          this.loadWorkspaceMaterialsData(result[0].children[0].workspaceMaterialId);
        } else if (window.location.hash.replace("#", "")){
          this.loadWorkspaceMaterialsData(parseInt(window.location.hash.replace("#", "").replace("p-", "")));
        }
      }) as Action);
    }
    
    return <WorkspaceMaterialsBody workspaceUrl={props.match.params["workspaceUrl"]}
      onActiveNodeIdChange={this.onWorkspaceMaterialsBodyActiveNodeIdChange}/>
  }
  renderWorkspaceUsers(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.status.currentWorkspaceName));
      this.props.store.dispatch(setCurrentWorkspace({
        workspaceId: state.status.currentWorkspaceId,
        success: (workspace)=>{
          if (!workspace.staffMembers && state.status.permissions.WORSKPACE_LIST_WORKSPACE_MEMBERS){
            this.props.store.dispatch(loadStaffMembersOfWorkspace(workspace) as Action)
          }
          if (!workspace.activeStudents && state.status.permissions.WORSKPACE_LIST_WORKSPACE_MEMBERS){
            this.props.store.dispatch(loadStudentsOfWorkspace(workspace, true) as Action)
          }
        }
      }) as Action);
    }
    
    return <WorkspaceUsersBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  render(){
    return (<BrowserRouter><div id="root">
      <Notifications></Notifications>
        
      <Route exact path="/workspace/:workspaceUrl/" render={this.renderWorkspaceHome}/>
      <Route path="/workspace/:workspaceUrl/help" render={this.renderWorkspaceHelp}/>
      <Route path="/workspace/:workspaceUrl/discussions" render={this.renderWorkspaceDiscussions}/>
      <Route path="/workspace/:workspaceUrl/announcements" render={this.renderWorkspaceAnnouncements}/>
      <Route path="/workspace/:workspaceUrl/announcer" render={this.renderWorkspaceAnnouncer}/>
      <Route path="/workspace/:workspaceUrl/materials" render={this.renderWorkspaceMaterials}/>
      <Route path="/workspace/:workspaceUrl/users" render={this.renderWorkspaceUsers}/>
    </div></BrowserRouter>);
  }
}