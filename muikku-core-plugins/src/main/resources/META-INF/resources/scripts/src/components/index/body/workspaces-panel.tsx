import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {WorkspaceListType, WorkspaceType} from '~/reducers/workspaces';
import {StateType} from '~/reducers';

interface LastMessagesPanelProps {
  i18n: i18nType,
  workspaces: WorkspaceListType
}

interface LastMessagesPanelState {
  
}

class WorkspacesPanel extends React.Component<LastMessagesPanelProps, LastMessagesPanelState> {
  render(){
    return (<div className="panel panel--workspaces">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--workspaces icon-books"></div>
          <div className="panel__header-title">{this.props.i18n.text.get('plugin.frontPage.workspaces.title')}</div>
        </div>
        {this.props.workspaces.length ? (
          <div className="panel__content">
            <div className="item-list item-list--panel-workspaces">
              {this.props.workspaces.map((workspace: WorkspaceType)=>{
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
          <div className="panel__content panel__content--empty">
            {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part1')}
            <Link href="/coursepicker">
              {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.coursepicker')}
            </Link>
            {" "}{this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part2')}
          </div>
        )}
     </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
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