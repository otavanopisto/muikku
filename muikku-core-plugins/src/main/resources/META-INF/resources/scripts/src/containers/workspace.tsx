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
  updateFirstTime(){
    this.itsFirstTime = window.location.pathname !== this.prevPathName;
    this.prevPathName = window.location.pathname;
  }
  render(){
    return (<BrowserRouter><div id="root">
      <Notifications></Notifications>
    </div></BrowserRouter>);
  }
}