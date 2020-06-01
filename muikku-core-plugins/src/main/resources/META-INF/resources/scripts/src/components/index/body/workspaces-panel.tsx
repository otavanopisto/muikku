import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {WorkspaceListType, WorkspaceType} from '~/reducers/workspaces';
import {StatusType} from '~/reducers/base/status';
import {StateType} from '~/reducers';

import '~/sass/elements/panel.scss';

import '~/sass/elements/panel.scss';

interface WorkspacesPanelProps {
  i18n: i18nType,
  status: StatusType,
  workspaces: WorkspaceListType
}

interface WorkspacesPanelState {

}

class WorkspacesPanel extends React.Component<WorkspacesPanelProps, WorkspacesPanelState> {
  render(){
    return (<div className="panel panel--workspaces">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--workspaces icon-books"></div>
          <div className="panel__header-title">{this.props.i18n.text.get('plugin.frontPage.workspaces.title')}</div>
        </div>
        {this.props.workspaces.length ? (
          <div className="panel__body">
            <div className="item-list item-list--panel-workspaces">
              {this.props.workspaces.sort((workspaceA: WorkspaceType, workspaceB: WorkspaceType)=>{
                if(workspaceA.name.toLocaleLowerCase() < workspaceB.name.toLocaleLowerCase()) { return -1; }
                if(workspaceA.name > workspaceB.name) { return 1; }
                return 0;
              }).map((workspace: WorkspaceType)=>{
                return <Link key={workspace.id} className="item-list__item item-list__item--workspaces" href={`/workspace/${workspace.urlName}`}>
                  <span className="item-list__icon item-list__icon--workspaces icon-books"></span>
                  <span className="item-list__text-body">
                    {`${workspace.name} ${workspace.nameExtension ? "(" + workspace.nameExtension + ")" : ""}`}
                  </span>
                </Link>
              })}
            </div>
          </div>
        ) : (
          <div className="panel__body panel__body--empty">
            {this.props.status.isStudent ?
              <div>
                {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part1')}
                <Link href="/coursepicker">
                  {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.coursepicker')}
                </Link>
                {" "}{this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part2')}
              </div> :
              <div>
                {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.teacher')}
              </div>
            }
          </div>
        )}
     </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    status: state.status,
    i18n: state.i18n,
    workspaces: state.workspaces.userWorkspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspacesPanel);
