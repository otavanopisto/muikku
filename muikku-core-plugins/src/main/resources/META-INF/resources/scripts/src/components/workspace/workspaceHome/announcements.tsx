import { WorkspaceType } from "~/reducers/workspaces";
import { AnnouncementListType } from "~/reducers/announcements";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { connect, Dispatch } from "react-redux";
import Link from "~/components/general/link";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";

interface WorkspaceAnnouncementsProps {
  status: StatusType,
  workspace: WorkspaceType,
  announcements: AnnouncementListType,
  i18n: i18nType
}

interface WorkspaceAnnouncementsState {
  
}

class WorkspaceAnnouncements extends React.Component<WorkspaceAnnouncementsProps, WorkspaceAnnouncementsState> {
  render(){
    if (this.props.status.loggedIn && this.props.status.isActiveUser &&
        this.props.status.permissions.WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS){
      return <div className="workspace-frontpage-announcements lg-flex-cell-last md-flex-cell-last lg-flex-cell-8 md-flex-cell-8 sm-flex-cell-full sm-flex-order-2">
        <h1 className="workspace-block-title">{this.props.i18n.text.get('plugin.workspace.index.announcementsTitle')}</h1>
        <div className="workspace-announcements-container">
          {this.props.announcements.length ? this.props.announcements.map(a=><Link to={this.props.status.contextPath + "/workspace/" + this.props.workspace.urlName + "/announcements?announcementId=" + a.id}
              key={a.id} as="div" className="workspace-single-announcement">
              <div className="workspace-announcement-title">{a.caption}</div>
              <div className="workspace-announcement-date">{this.props.i18n.time.format(a.startDate)}</div>
            </Link>) :
            <div className="workspace-announcements-empty lg-flex-cell-full md-flex-cell-full sm-flex-cell-full no-margin-top no-margin-bottom">{this.props.i18n.text.get("plugin.workspace.index.announcementsEmpty")}</div>}
        </div>
      </div>
    }
    
    return null
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    announcements: state.announcements.announcements,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceAnnouncements);