import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';
import Users from './users';

import * as React from 'react';

interface WorkspaceUsersBodyProps {
  workspaceUrl: string
}

interface WorkspaceUsersBodyState {
  editModeActive: boolean,
}

export default class WorkspaceUsersBody extends React.Component<WorkspaceUsersBodyProps, WorkspaceUsersBodyState> {
  constructor(props: WorkspaceUsersBodyProps){
    super(props);

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
    this.toggleEditModeActive = this.toggleEditModeActive.bind(this);

    this.state = {
      editModeActive: true
    }
  }
  onOpenNavigation(){
    (this.refs.content as any).getWrappedInstance().refresh();
  }
  toggleEditModeActive() {
    this.setState({
      editModeActive: !this.state.editModeActive,
    });
  }
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="users" workspaceUrl={this.props.workspaceUrl}
        editModeAvailable editModeActive={this.state.editModeActive} toggleEditModeActive={this.toggleEditModeActive}/>
      <ScreenContainer viewModifiers="workspace-users">
        <Users/>
      </ScreenContainer>
    </div>);
  }
}