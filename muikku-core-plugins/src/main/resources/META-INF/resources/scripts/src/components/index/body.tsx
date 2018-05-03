import MainFunctionNavbar from '../base/main-function/navbar';
import ScreenContainer from '../general/screen-container';

import AnnouncementsPanel from './body/announcements-panel';
import ContinueStudiesPanel from './body/continue-studies-panel';
import ImportantPanel from './body/important-panel';
import LastMessagesPanel from './body/latest-messages-panel';
import WorkspacesPanel from './body/workspaces-panel';

import * as React from 'react';

import '~/sass/elements/container.scss';
import '~/sass/elements/ordered-container.scss';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { StatusType } from '~/reducers/base/status';
import StudiesEnded from './body/studies-ended';

//TODO css get rid of ordered container 
class IndexBody extends React.Component<{
  status: StatusType
},{}> {
  render(){
    return (<div className="container container--full">
      <MainFunctionNavbar activeTrail="index"/>
      <ScreenContainer>
        {this.props.status.isActiveUser ? <div className="ordered-container ordered-container--index-panels">
          <div className="ordered-container__item ordered-container__item--studies">
            <div className="ordered-container">
              <ContinueStudiesPanel/>
              <WorkspacesPanel/>
            </div>
          </div>
          <div className="ordered-container__item ordered-container__item--messages">
            <div className="ordered-container">
              <LastMessagesPanel/>
            </div>
          </div>
          <div className="ordered-container__item ordered-container__item--announcements">
            <div className="ordered-container">
              <ImportantPanel/>
              <AnnouncementsPanel/>
            </div>
          </div>
        </div> : <div className="ordered-container ordered-container--index-panels"><StudiesEnded/></div>}
      </ScreenContainer>
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