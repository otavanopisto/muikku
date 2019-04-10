import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';

import * as React from 'react';

import HelpPanel from './help';
import MaterialEditor from '~/components/base/material-editor';

interface WorkspaceHelpBodyProps {
  workspaceUrl: string
}

interface WorkspaceHelpBodyState {

}

export default class WorkspaceHelpBody extends React.Component<WorkspaceHelpBodyProps, WorkspaceHelpBodyState> {
  render(){
    return (<div>
      <WorkspaceNavbar activeTrail="help" workspaceUrl={this.props.workspaceUrl}/>
      <ScreenContainer viewModifiers="workspace">
        <MaterialEditor/>
        <HelpPanel/>
      </ScreenContainer>
    </div>);
  }
}