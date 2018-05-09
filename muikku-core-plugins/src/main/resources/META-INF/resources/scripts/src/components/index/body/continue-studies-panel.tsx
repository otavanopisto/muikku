//TODO please translate this... >:c
//You see those language strings...

import Link from '../../general/link';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';
import {ShortWorkspaceType} from '~/reducers/main-function/workspaces';
import {StateType} from '~/reducers';
import Panel from '~/components/general/panel';

import '~/sass/elements/ordered-container.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/item-list.scss';

interface ContinueStudiesPanelProps {
  i18n: i18nType,
  status: StatusType,
  lastWorkspace: ShortWorkspaceType
}

interface ContinueStudiesPanelState {
  
}

class ContinueStudiesPanel extends React.Component<ContinueStudiesPanelProps, ContinueStudiesPanelState> {
  render(){
    if (!this.props.status.loggedIn){
      return null;
    } else if (!this.props.lastWorkspace){
      return null;
    }
    
    return (<div className="ordered-container__item ordered-container__item--index-panel-container ordered-container__item--continue-studies">
      <div className="text text--for-panels-title">
        <span className="text__panel-icon text__panel-icon--continue-studies icon-revert"></span>
        <span className="text__panel-title">{this.props.i18n.text.get('plugin.frontPage.latestWorkspace.title')}</span>
      </div>
      <Panel modifier="index">
        <h2 className="text text--panel-continue-studies-workspace-name">
          {this.props.lastWorkspace.workspaceName}
        </h2>
        <span className="text text--panel-continue-studies">
          {this.props.i18n.text.get('plugin.frontPage.latestWorkspace.material.part1')}{" "}<b><i>{this.props.lastWorkspace.materialName}</i></b>{" "}
          <Link className="text__panel-link text--panel-continue-studies-link" href={this.props.lastWorkspace.url}>{this.props.i18n.text.get('plugin.frontPage.latestWorkspace.continueStudiesLink')}</Link>
        </span>
      </Panel>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    status: state.status,
    i18n: state.i18n,
    lastWorkspace: state.workspaces.lastWorkspace
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContinueStudiesPanel);