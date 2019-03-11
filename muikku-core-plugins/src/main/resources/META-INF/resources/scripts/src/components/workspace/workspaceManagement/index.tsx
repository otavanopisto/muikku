import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';
import ManagementPanel from './management';

import * as React from 'react';

interface WorkspaceManagementBodyProps {
  workspaceUrl: string
}

interface WorkspaceManagementBodyState {

}

export default class WorkspaceManagementBody extends React.Component<WorkspaceManagementBodyProps, WorkspaceManagementBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="workspace-management" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="workspace">
        <ManagementPanel/>
      </ScreenContainer>
    </div>);
  }
}