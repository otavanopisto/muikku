import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';
import Users from './users';

import * as React from 'react';

interface WorkspaceUsersBodyProps {
  workspaceUrl: string
}

interface WorkspaceUsersBodyState {

}

export default class WorkspaceUsersBody extends React.Component<WorkspaceUsersBodyProps, WorkspaceUsersBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="users" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="workspace-users">
        <Users/>
      </ScreenContainer>
    </div>);
  }
}