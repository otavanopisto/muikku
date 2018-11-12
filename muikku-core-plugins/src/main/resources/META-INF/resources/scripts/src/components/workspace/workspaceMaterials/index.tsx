import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

import Materials from './materials';
import NavigationAside from './aside';

interface WorkspaceMaterialsBodyProps {
  workspaceUrl: string
}

interface WorkspaceMaterialsBodyState {

}

export default class WorkspaceMaterialsBody extends React.Component<WorkspaceMaterialsBodyProps, WorkspaceMaterialsBodyState> {
  render(){
    let aside = <NavigationAside/>;
    return (<div>
      <WorkspaceNavbar navigation={aside} activeTrail="materials" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="materials">
        <Materials aside={aside}/>
      </ScreenContainer>
    </div>);
  }
}