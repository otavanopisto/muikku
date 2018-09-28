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
import { RouteComponentProps } from 'react-router';

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
    
  }
  renderWorkspaceHome(props: RouteComponentProps<any>){
    this.updateFirstTime();
    if (this.itsFirstTime){
      this.props.websocket.restoreEventListeners();
      
      let state = this.props.store.getState();
      this.props.store.dispatch(titleActions.updateTitle(state.status.currentWorkspaceName + ' - ' + state.i18n.text.get('plugin.site.title')));
    }
    
    return <WorkspaceHomeBody workspaceUrl={props.match.params["workspaceUrl"]}/>
  }
  updateFirstTime(){
    this.itsFirstTime = window.location.pathname !== this.prevPathName;
    this.prevPathName = window.location.pathname;
  }
  render(){
    return (<BrowserRouter><div id="root">
      <Notifications></Notifications>
        
      <Route path="/workspace/:workspaceUrl" render={this.renderWorkspaceHome}/>
    </div></BrowserRouter>);
  }
}