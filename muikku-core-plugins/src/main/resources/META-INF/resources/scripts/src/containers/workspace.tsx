import Notifications from '../components/base/notifications';
import { BrowserRouter, Route } from 'react-router-dom';
import * as React from 'react';
import '~/sass/util/base.scss';

import { Store } from 'react-redux';
import { StateType } from '~/reducers';
import {Action} from 'redux';
import Websocket from '~/util/websocket';

import titleActions from '~/actions/base/title';

import WorkspaceHomeBody from '~/components/workspace/workspaceHome';
import WorkspaceHelpBody from '~/components/workspace/workspaceHelp';
import WorkspaceDiscussionBody from '~/components/workspace/workspaceDiscussions';
import WorkspaceAnnouncementsBody from '~/components/workspace/workspaceAnnouncements';
import WorkspaceAnnouncerBody from '~/components/workspace/workspaceAnnouncer';
import WorkspaceMaterialsBody from '~/components/workspace/workspaceMaterials';
import WorkspaceJournalBody from '~/components/workspace/workspaceJournal';
import WorkspaceManagementBody from '~/components/workspace/workspaceManagement';
import WorkspaceUsersBody from '~/components/workspace/workspaceUsers';
import WorkspacePermissionsBody from '~/components/workspace/workspacePermissions';

import { RouteComponentProps } from 'react-router';
import { setCurrentWorkspace, loadStaffMembersOfWorkspace, loadWholeWorkspaceMaterials,
  setCurrentWorkspaceMaterialsActiveNodeId, loadWorkspaceCompositeMaterialReplies,
  updateLastWorkspace,
  loadStudentsOfWorkspace,
  loadCurrentWorkspaceJournalsFromServer,
  loadWorkspaceDetailsInCurrentWorkspace,
  loadWorkspaceTypes,
  loadCurrentWorkspaceUserGroupPermissions,
  loadWholeWorkspaceHelp} from '~/actions/workspaces';
import { loadAnnouncementsAsAClient, loadAnnouncement, loadAnnouncements } from '~/actions/announcements';
import { loadDiscussionAreasFromServer, loadDiscussionThreadsFromServer, loadDiscussionThreadFromServer, setDiscussionWorkpaceId } from '~/actions/discussion';

import { CKEDITOR_VERSION } from '~/lib/ckeditor';
import { displayNotification } from '~/actions/base/notifications';

interface WorkspaceProps {
  store: Store<StateType>,
  websocket: Websocket
}

interface WorkspaceState {
  enrollmentDialogOpen: boolean;
  signupDialogOpen: boolean;
}

(window as any).USES_HISTORY_API = true;

export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {
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
    this.renderWorkspaceJournal = this.renderWorkspaceJournal.bind(this);
    this.renderWorkspaceManagement = this.renderWorkspaceManagement.bind(this);
    this.renderWorkspacePermissions = this.renderWorkspacePermissions.bind(this);

    this.loadWorkspaceDiscussionData = this.loadWorkspaceDiscussionData.bind(this);
    this.loadWorkspaceAnnouncementsData = this.loadWorkspaceAnnouncementsData.bind(this);
    this.loadWorkspaceAnnouncerData = this.loadWorkspaceAnnouncerData.bind(this);
    this.loadWorkspaceMaterialsData = this.loadWorkspaceMaterialsData.bind(this);
    this.loadWorkspaceHelpData = this.loadWorkspaceHelpData.bind(this);
    this.closeEnrollmentDialog = this.closeEnrollmentDialog.bind(this);
    this.closeSignupDialog = this.closeSignupDialog.bind(this);

    this.onWorkspaceMaterialsBodyActiveNodeIdChange = this.onWorkspaceMaterialsBodyActiveNodeIdChange.bind(this);
    this.onWorkspaceHelpBodyActiveNodeIdChange = this.onWorkspaceHelpBodyActiveNodeIdChange.bind(this);

    window.addEventListener("hashchange", this.onHashChange.bind(this));

    this.state = {
      enrollmentDialogOpen: !props.store.getState().status.loggedIn,
      signupDialogOpen: false,
    }
  }
  closeEnrollmentDialog() {
    this.setState({
      enrollmentDialogOpen: false,
    });
  }
  closeSignupDialog() {
    this.setState({
      signupDialogOpen: false,
    });
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
      const hashvalue = window.location.hash.replace("#", "");
      // the scroll can be buggy and it can attempt to load sections
      // like usual browser scrolling that is very unpredictable
      if (!hashvalue.startsWith("s-")) {
        const supposedLoadedSection = hashvalue &&
        parseInt(window.location.hash.replace("#", "").replace("p-", ""));
        const signupDialogOn = hashvalue === "signup";
        if (signupDialogOn) {
          this.setState({
            signupDialogOpen: true,
          });
        } else if (supposedLoadedSection){
          this.loadWorkspaceMaterialsData(supposedLoadedSection);
        } else if (this.props.store.getState().workspaces.currentMaterials &&
            this.props.store.getState().workspaces.currentMaterials[0] &&
            this.props.store.getState().workspaces.currentMaterials[0].children[0]) {
          this.loadWorkspaceMaterialsData(this.props.store.getState().workspaces.currentMaterials[0].children[0].workspaceMaterialId);
        }
      }
    } else if (window.location.pathname.includes("/help")){
      const hashvalue = window.location.hash.replace("#", "");
      if (!hashvalue.startsWith("s-")) {
        if (window.location.hash.replace("#", "")){
          this.loadWorkspaceHelpData(parseInt(window.location.hash.replace("#", "").replace("p-", "")));
        } else if (this.props.store.getState().workspaces.currentMaterials &&
            this.props.store.getState().workspaces.currentMaterials[0] &&
            this.props.store.getState().workspaces.currentMaterials[0].children[0]) {
          this.loadWorkspaceHelpData(this.props.store.getState().workspaces.currentMaterials[0].children[0].workspaceMaterialId);
        }
      }
    }
  }
  onWorkspaceMaterialsBodyActiveNodeIdChange(newId: number){
    let state:StateType = this.props.store.getState();

    if (!newId){
      history.pushState(null, null, location.origin + location.pathname + '#');
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
      const newHash = '#p-' + newId;
      // defusing the new id
      if (newHash !== location.hash) {

        // TODO At this point the baseURI goes bad after opening and closing the material editor and scrolling

        const element = document.querySelector(newHash);
        if (element) {
          element.id = ""
        }
        history.pushState(null, null, location.origin + location.pathname + newHash);
        if (element) {
          element.id = 'p-' + newId;
        }
      }

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
            url: location.origin + location.pathname + newHash,
            workspaceName: state.workspaces.currentWorkspace.name,
            materialName: materialChapter.children[indexFound].title
          }) as Action);
        }
      }
    }
  }
  onWorkspaceHelpBodyActiveNodeIdChange(newId: number){
    let state:StateType = this.props.store.getState();

    if (!newId){
      history.pushState(null, null, '#');
      if (state.workspaces.currentHelp &&
          state.workspaces.currentHelp[0] &&
          state.workspaces.currentHelp[0].children[0]) {
        this.loadWorkspaceHelpData(state.workspaces.currentHelp[0].children[0].workspaceMaterialId);
      }
    } else {
      const newHash = '#p-' + newId;
      // defusing the new id
      if (newHash !== location.hash) {
        const element = document.querySelector(newHash);
        if (element) {
          element.id = ""
        }
        history.pushState(null, null, newHash);
        if (element) {
          element.id = 'p-' + newId;
        }
      }

      this.loadWorkspaceHelpData(newId);
    }
  }
  renderWorkspaceHome(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(`//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`);

      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.status.currentWorkspaceName));
      this.props.store.dispatch(setCurrentWorkspace({workspaceId: state.status.currentWorkspaceId, success: (workspace)=>{
        if (!workspace.staffMembers && state.status.loggedIn){
          this.props.store.dispatch(loadStaffMembersOfWorkspace(workspace) as Action)
        }
      }}) as Action);

      if (state.status.loggedIn && state.status.isActiveUser && state.status.permissions.WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS){
        this.props.store.dispatch(loadAnnouncementsAsAClient({
          hideEnvironmentAnnouncements: "true",
          workspaceEntityId: state.status.currentWorkspaceId
        }) as Action);
      }

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(`//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`);
    }

    return <WorkspaceHomeBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  renderWorkspaceHelp(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(`//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`);

      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.i18n.text.get('plugin.workspace.helpPage.title')));
      this.props.store.dispatch(setCurrentWorkspace({workspaceId: state.status.currentWorkspaceId, loadDetails: state.status.permissions.WORKSPACE_VIEW_WORKSPACE_DETAILS}) as Action);
      this.props.store.dispatch(loadWholeWorkspaceHelp(state.status.currentWorkspaceId, state.status.permissions.WORKSPACE_MANAGE_WORKSPACE, (result)=>{
        if (!window.location.hash.replace("#", "") && result[0]){
          this.loadWorkspaceHelpData(result[0].workspaceMaterialId);
        } else if (window.location.hash.replace("#", "")){
          this.loadWorkspaceHelpData(parseInt(window.location.hash.replace("#", "").replace("p-", "")));
        }
      }) as Action);
    }

    return <WorkspaceHelpBody workspaceUrl={props.match.params["workspaceUrl"]}
      onActiveNodeIdChange={this.onWorkspaceHelpBodyActiveNodeIdChange}/>
  }
  renderWorkspaceDiscussions(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(`//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`);

      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.i18n.text.get('plugin.workspace.discussions.pageTitle')));
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
      this.props.store.dispatch(titleActions.updateTitle(state.i18n.text.get('plugin.workspace.announcements.pageTitle')));

      //Maybe we shouldn't load again, but whatever, maybe it updates
      this.props.store.dispatch(loadAnnouncementsAsAClient({
        hideEnvironmentAnnouncements: "true",
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
      this.loadlib(`//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`);

      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.i18n.text.get('plugin.workspace.announcer.pageTitle')));
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
    const actualLocation = location.filter(l => !!l);
    let state = this.props.store.getState();
    if (actualLocation.length === 1){
      this.props.store.dispatch(loadAnnouncements(actualLocation[0], state.status.currentWorkspaceId) as Action);
    } else {
      this.props.store.dispatch(loadAnnouncement(actualLocation[0], parseInt(actualLocation[1]), state.status.currentWorkspaceId) as Action);
    }
  }
  loadWorkspaceMaterialsData(id: number): void {
    if (id){
      this.props.store.dispatch(setCurrentWorkspaceMaterialsActiveNodeId(id) as Action);
    }
  }
  loadWorkspaceHelpData(id: number): void {
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
      this.loadlib(`//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`);

      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.i18n.text.get('plugin.workspace.materials.pageTitle')));
      this.props.store.dispatch(setCurrentWorkspace({workspaceId: state.status.currentWorkspaceId, loadDetails: state.status.permissions.WORKSPACE_VIEW_WORKSPACE_DETAILS}) as Action);
      this.props.store.dispatch(loadWorkspaceCompositeMaterialReplies(state.status.currentWorkspaceId) as Action);
      this.props.store.dispatch(loadWholeWorkspaceMaterials(state.status.currentWorkspaceId, state.status.permissions.WORKSPACE_MANAGE_WORKSPACE, (result)=>{
        if (!window.location.hash.replace("#", "") && result[0] && result[0].children && result[0].children[0]){
          this.loadWorkspaceMaterialsData(result[0].children[0].workspaceMaterialId);
        } else if (window.location.hash.replace("#", "")){
          this.loadWorkspaceMaterialsData(parseInt(window.location.hash.replace("#", "").replace("p-", "")));
        }
      }) as Action);

      if (state.status.loggedIn && state.status.isStudent && !state.status.permissions.WORKSPACE_IS_WORKSPACE_STUDENT) {
        if (!state.status.permissions.WORKSPACE_SIGNUP) {
          this.props.store.dispatch(displayNotification(state.i18n.text.get('plugin.workspace.materials.cannotSignUpWarning'), "notice") as Action);
        } else {
          this.props.store.dispatch(displayNotification(
            state.i18n.text.get('plugin.workspace.materials.notSignedUpWarning') +
              ` <a href="#signup">${state.i18n.text.get('plugin.workspace.materials.notSignedUpWarningLink')}</a>`,
            "notice",
          ) as Action);
        }
      }
    }

    return <WorkspaceMaterialsBody workspaceUrl={props.match.params["workspaceUrl"]}
      onActiveNodeIdChange={this.onWorkspaceMaterialsBodyActiveNodeIdChange}
      enrollmentDialogOpen={this.state.enrollmentDialogOpen}
      signupDialogOpen={this.state.signupDialogOpen}
      onCloseSignupDialog={this.closeSignupDialog}
      onCloseEnrollmentDialog={this.closeEnrollmentDialog}/>
  }
  renderWorkspaceUsers(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(`//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`);

      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.i18n.text.get('plugin.workspace.users.pageTitle')));
      this.props.store.dispatch(setCurrentWorkspace({
        workspaceId: state.status.currentWorkspaceId,
        success: (workspace)=>{
          if (!workspace.staffMembers && state.status.loggedIn){
            this.props.store.dispatch(loadStaffMembersOfWorkspace(workspace) as Action)
          }
          if (!workspace.students && state.status.permissions.WORSKPACE_LIST_WORKSPACE_MEMBERS){
            this.props.store.dispatch(loadStudentsOfWorkspace(workspace) as Action)
          }
        }
      }) as Action);
    }

    return <WorkspaceUsersBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  renderWorkspaceJournal(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(`//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`);

      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.i18n.text.get('plugin.workspace.journal.pageTitle')));
      this.props.store.dispatch(setCurrentWorkspace({
        workspaceId: state.status.currentWorkspaceId,
        success: (workspace)=>{
          if (!workspace.students && state.status.permissions.WORSKPACE_LIST_WORKSPACE_MEMBERS){
            this.props.store.dispatch(loadStudentsOfWorkspace(workspace) as Action);
          }
          if (!workspace.journals){
            if (state.status.permissions.WORSKPACE_LIST_WORKSPACE_MEMBERS){
              this.props.store.dispatch(loadCurrentWorkspaceJournalsFromServer() as Action);
            } else {
              this.props.store.dispatch(loadCurrentWorkspaceJournalsFromServer(state.status.userId) as Action);
            }
          }
        }
      }) as Action);
    }

    return <WorkspaceJournalBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  renderWorkspaceManagement(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();

      this.loadlib("//cdn.muikkuverkko.fi/libs/jssha/2.0.2/sha.js");
      this.loadlib("//cdn.muikkuverkko.fi/libs/jszip/3.0.0/jszip.min.js");
      this.loadlib(`//cdn.muikkuverkko.fi/libs/ckeditor/${CKEDITOR_VERSION}/ckeditor.js`);

      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.i18n.text.get('plugin.workspace.management.pageTitle')));
      this.props.store.dispatch(loadWorkspaceTypes() as Action);
      this.props.store.dispatch(setCurrentWorkspace({
        workspaceId: state.status.currentWorkspaceId,
        success: (workspace)=>{
          this.props.store.dispatch(loadCurrentWorkspaceUserGroupPermissions() as Action);
          if (state.status.permissions.WORKSPACE_VIEW_WORKSPACE_DETAILS) {
            this.props.store.dispatch(loadWorkspaceDetailsInCurrentWorkspace() as Action);
          }
        }
      }) as Action);
    }

    return <WorkspaceManagementBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  renderWorkspacePermissions(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();

      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.i18n.text.get('plugin.workspace.permissions.pageTitle')));
      this.props.store.dispatch(setCurrentWorkspace({
        workspaceId: state.status.currentWorkspaceId,
        success: (workspace)=>{
          this.props.store.dispatch(loadCurrentWorkspaceUserGroupPermissions() as Action);
        }
      }) as Action);
    }

    return <WorkspacePermissionsBody workspaceUrl={props.match.params["workspaceUrl"]}/>
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
      <Route path="/workspace/:workspaceUrl/journal" render={this.renderWorkspaceJournal}/>
      <Route path="/workspace/:workspaceUrl/workspace-management" render={this.renderWorkspaceManagement}/>
      <Route path="/workspace/:workspaceUrl/permissions" render={this.renderWorkspacePermissions}/>
    </div></BrowserRouter>);
  }
}
