//TODO please translate this... >:c
//You see those language strings...

import Link from '../../general/link';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';
import {WorkspaceMaterialReferenceType} from '~/reducers/workspaces';
import {StateType} from '~/reducers';
import Panel from '~/components/general/panel';

import '~/sass/elements/ordered-container.scss';

import '~/sass/elements/item-list.scss';

interface ContinueStudiesPanelProps {
  i18n: i18nType,
  status: StatusType,
  lastWorkspace: WorkspaceMaterialReferenceType
}

interface ContinueStudiesPanelState {

}

class ContinueStudiesPanel extends React.Component<ContinueStudiesPanelProps, ContinueStudiesPanelState> {
  render(){
    if (!this.props.status.loggedIn){
      return null;
    } else if (!this.props.lastWorkspace){
      return null;
    } else if (!this.props.status.isStudent) {
      return null;
    }
    return (<div className="ordered-container__item ordered-container__item--index-panel-container ordered-container__item--continue-studies">
      <div className="ordered-container__item-header">
        <span className="ordered-container__item-header-icon ordered-container__item-header-icon--continue-studies icon-revert"></span>
        <span className="ordered-container__item-header-text">{this.props.i18n.text.get('plugin.frontPage.latestWorkspace.title')}</span>
      </div>
      <Panel modifier="index">
        <h2 className="panel__header">
          {this.props.lastWorkspace.workspaceName}
        </h2>
        <div className="panel__content">
          {this.props.i18n.text.get('plugin.frontPage.latestWorkspace.material.part1')}{" "}<span className="panel__content-highlight">{this.props.lastWorkspace.materialName}.</span>{" "}
          <Link className="panel__link" href={this.props.lastWorkspace.url}>{this.props.i18n.text.get('plugin.frontPage.latestWorkspace.continueStudiesLink')}</Link>
        </div>
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




