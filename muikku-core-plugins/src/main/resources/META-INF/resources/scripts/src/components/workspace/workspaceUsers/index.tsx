import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

interface WorkspaceUsersBodyProps {
  workspaceUrl: string
}

interface WorkspaceUsersBodyState {

}

export default class WorkspaceUsersBody extends React.Component<WorkspaceUsersBodyProps, WorkspaceUsersBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="help" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="workspace">
        
      </ScreenContainer>
    </div>);
  }
}