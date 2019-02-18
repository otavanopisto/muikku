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
  constructor(props: WorkspaceMaterialsBodyProps){
    super(props);

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
  }
  onOpenNavigation(){
    (this.refs.navigation as any).getWrappedInstance().refresh();
  }
  render(){
    let navigationComponent = <NavigationComponent ref="navigation"/>;
    return (<div>
      <WorkspaceNavbar activeTrail="materials" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="materials"> 
        <Materials onOpenNavigation={this.onOpenNavigation} navigation={navigationComponent} ref="materials" onActiveNodeIdChange={this.props.onActiveNodeIdChange}/>
      </ScreenContainer>
    </div>);
  }
}