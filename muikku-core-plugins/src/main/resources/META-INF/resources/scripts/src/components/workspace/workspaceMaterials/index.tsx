import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

import Materials from './materials';
import NavigationComponent from './navigation';

interface WorkspaceMaterialsBodyProps {
  workspaceUrl: string,
  onActiveNodeIdChange: (newId: number)=>any
}

interface WorkspaceMaterialsBodyState {

}

export default class WorkspaceMaterialsBody extends React.Component<WorkspaceMaterialsBodyProps, WorkspaceMaterialsBodyState> {
  render(){
    let navigationComponent = <NavigationComponent/>;
    return (<div>
      <WorkspaceNavbar navigation={navigationComponent} activeTrail="materials" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="materials"> 
        <Materials aside={navigationComponent} ref="materials" onActiveNodeIdChange={this.props.onActiveNodeIdChange}/>
      </ScreenContainer>
    </div>);
  }
}