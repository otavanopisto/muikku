import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

interface WorkspaceMaterialsBodyProps {
  workspaceUrl: string
}

interface WorkspaceMaterialsBodyState {

}

export default class WorkspaceMaterialsBody extends React.Component<WorkspaceMaterialsBodyProps, WorkspaceMaterialsBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="materials" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="materials">

      </ScreenContainer>
    </div>);
  }
}