import MainFunctionNavbar from '../base/main-function/navbar';
import ScreenContainer from '../general/screen-container';

import AnnouncementsPanel from './body/announcements-panel';
import ContinueStudiesPanel from './body/continue-studies-panel';
import ImportantPanel from './body/important-panel';
import LastMessagesPanel from './body/latest-messages-panel';
import WorkspacesPanel from './body/workspaces-panel';

import * as React from 'react';

import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { StatusType } from '~/reducers/base/status';
import StudiesEnded from './body/studies-ended';

import CheckContactInfoDialog from '~/components/base/check-contact-info-dialog';

//TODO css get rid of ordered container 
class IndexBody extends React.Component<{
  status: StatusType
},{}> {
  render(){
    return (<div>
      <MainFunctionNavbar activeTrail="index"/>
        {this.props.status.isActiveUser ? <ScreenContainer viewModifiers="index">
          <div className="panel-group panel-group--studies">
            <ContinueStudiesPanel/>
            <WorkspacesPanel/>
          </div>
          <LastMessagesPanel/>
          <ImportantPanel/>
          <AnnouncementsPanel/></ScreenContainer> : <ScreenContainer viewModifiers="index"><StudiesEnded/></ScreenContainer>}
      <CheckContactInfoDialog/>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexBody);