//TODO please translate this... >:c
//You see those language strings...

import Link from '../../general/link';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';
import {LastWorkspaceType} from '~/reducers/main-function/index/last-workspace';

import '~/sass/elements/ordered-container.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/item-list.scss';
import '~/sass/elements/panel.scss';

interface ContinueStudiesPanelProps {
  i18n: i18nType,
  status: StatusType,
  lastWorkspace: LastWorkspaceType
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
    return (<div className="ordered-container__item ordered-container__item--index-panel-container">
      <div className="text text--for-panels-title text--for-panels-title--continue-studies">
        <span className="text__panel-icon text__panel-icon--continue-studies icon-revert"></span>
        <span className="text__panel-title">{this.props.i18n.text.get('plugin.frontPage.lastWorkspace.continueStudiesLink')}</span>
      </div>
      <div className="panel panel--index">
        <h2 className="text text--panel-continue-studies-workspace-name">
          {this.props.lastWorkspace.workspaceName}
        </h2>
        <span className="text text--panel-continue-studies">
          Olit vimeksi sivulla{" "}<b><i>{this.props.lastWorkspace.materialName}</i></b>{" "}
          <Link className="text__panel-link" href={this.props.lastWorkspace.url}>Jatka opintoja</Link>
        </span>
      </div>
    </div>);
  }
}

function mapStateToProps(state: any){
  return {
    status: state.status,
    i18n: state.i18n,
    lastWorkspace: state.lastWorkspace
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(ContinueStudiesPanel);