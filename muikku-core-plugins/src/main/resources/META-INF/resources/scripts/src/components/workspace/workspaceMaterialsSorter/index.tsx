import WorkspaceNavbar from '~/components/base/workspace/navbar';
import * as React from 'react';
import TableOfContentsComponent from '../workspaceMaterials/content';
import ScreenContainer from '~/components/general/screen-container';

interface WorkspaceMaterialsSorterProps {
  workspaceUrl: string,
}

interface WorkspaceMaterialsSorterState {
}

export default class WorkspaceMaterialsSorter extends React.Component<WorkspaceMaterialsSorterProps, WorkspaceMaterialsSorterState> {
  constructor(props: WorkspaceMaterialsSorterProps){
    super(props);
  }
  componentDidMount() {
    document.body.style.overflow = "";
  }
  render(){
    let navigationComponent = <TableOfContentsComponent doNotSetHashes enableTouch/>;
    return (<div>
      <WorkspaceNavbar activeTrail="materials" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="workspace">
        {navigationComponent}
      </ScreenContainer>
    </div>);
  }
}