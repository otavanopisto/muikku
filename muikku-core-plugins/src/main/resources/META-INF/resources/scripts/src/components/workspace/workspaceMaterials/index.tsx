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
  constructor(props: WorkspaceMaterialsBodyProps){
    super(props);
    
    this.disableAutoLoading = this.disableAutoLoading.bind(this);
  }
  disableAutoLoading(){
    //(this.refs["materials"] as any).getWrappedInstance().disableAutoLoadingUntilNewCurrentMaterialGiven();
    //(this.refs["materials"] as any).getWrappedInstance().makeItHashWasSetByMaterials();
  }
  render(){
    let aside = <NavigationAside onScrollToSection={this.disableAutoLoading} scrollPadding={132}/>;
    return (<div>
      <WorkspaceNavbar navigation={aside} activeTrail="materials" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="materials"> 
        <Materials aside={aside} ref="materials"/>
      </ScreenContainer>
    </div>);
  }
}