import WorkspaceNavbar from '~/components/base/workspace/navbar';

import * as React from 'react';

import WorkspaceHomeHeader from './header';

interface WorkspaceHomeBodyProps {
  workspaceUrl: string
}

interface WorkspaceHomeBodyState {
  
}

export default class WorkspaceHomeBody extends React.Component<WorkspaceHomeBodyProps, WorkspaceHomeBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="index" workspaceUrl={this.props.workspaceUrl}/>
      <WorkspaceHomeHeader/>
    </div>);
  }
}