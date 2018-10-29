import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

import WorkspaceHomeHeader from './header';
import WorkspaceDescription from './description';
import WorkspaceTeachers from './teachers';
import WorkspaceAnnouncements from './announcements';
import WorkspaceLicense from './license';
import WorkspaceMaterialProducers from './material-producers';

interface WorkspaceHomeBodyProps {
  workspaceUrl: string
}

interface WorkspaceHomeBodyState {

}

export default class WorkspaceHomeBody extends React.Component<WorkspaceHomeBodyProps, WorkspaceHomeBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="index" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="workspace">
        <WorkspaceHomeHeader/>
        <WorkspaceDescription/>
        <div className="panel-group panel-group--workspace">
          <WorkspaceTeachers/>
          <WorkspaceAnnouncements/>
        </div>
        <WorkspaceLicense/>
        <WorkspaceMaterialProducers/>
      </ScreenContainer>
    </div>);
  }
}