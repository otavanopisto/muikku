import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {WorkspaceListType, WorkspaceType} from '~/reducers/main-function/index/workspaces';

interface LastMessagesPanelProps {
  i18n: i18nType,
  workspaces: WorkspaceListType
}

interface LastMessagesPanelState {
  
}

class WorkspacesPanel extends React.Component<LastMessagesPanelProps, LastMessagesPanelState> {
  render(){
    return (<div className="ordered-container__item">   
      <div className="text text--for-panels-title text--for-panels-title--workspaces">
        <span className="icon icon-books"></span>
        <span>{this.props.i18n.text.get('plugin.frontPage.workspaces.title')}</span>
      </div>
      <div className="panel panel--index">        
        {this.props.workspaces ? (
          <div className="item-list item-list--panel-workspaces">
            {this.props.workspaces.map((workspace: WorkspaceType)=>{
              return <Link key={workspace.id} className="item-list__item" href={`/workspace/${workspace.urlName}`}>
                <span className="item-list__icon icon-books"></span>
                <span className="item-list__text-body text">
                  {`${workspace.name} ${workspace.nameExtension ? workspace.nameExtension : ""}`}
                </span>
              </Link>
            })}
          </div>
        ) : (
          <div className="text text--panel-nothing">
            {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part1')}
            <Link href="/coursepicker">
              {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.coursepicker')}
            </Link>
            {" "}{this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part2')}
          </div>
        )}
       </div>
     </div>);
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    workspaces: state.workspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(WorkspacesPanel);