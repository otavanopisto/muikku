import WorkspaceNavbar from '~/components/base/workspace/navbar';
import ScreenContainer from '~/components/general/screen-container';
import Application from './body/application';

import * as React from 'react';

import '~/sass/elements/panel.scss';
import '~/sass/elements/footer.scss';

interface WorkspaceJournalBodyProps {
  workspaceUrl: string
}

interface WorkspaceJournalBodyState {
  editModeActive: boolean,
}

export default class WorkspaceJournalBody extends React.Component<WorkspaceJournalBodyProps, WorkspaceJournalBodyState> {
  constructor(props: WorkspaceJournalBodyProps){
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
      <WorkspaceNavbar activeTrail="journal" workspaceUrl={this.props.workspaceUrl}
        editModeAvailable editModeActive={this.state.editModeActive} toggleEditModeActive={this.toggleEditModeActive}/>
      <ScreenContainer viewModifiers="journal">
        <Application />
      </ScreenContainer>
    </div>);
  }
}