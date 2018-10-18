import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { getUserImageUrl } from "~/util/modifiers";
import Button from "~/components/general/button";
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';
import { StatusType } from "~/reducers/base/status";

import '~/sass/elements/panel.scss';
import '~/sass/elements/item-list.scss';

interface WorkspaceTeachersProps {
  workspace: WorkspaceType,
  i18n: i18nType,
  status: StatusType
}

interface WorkspaceTeachersState {
}

function getWorkspaceMessage(i18n: i18nType, status: StatusType, workspace: WorkspaceType, html?: boolean){
  if (!workspace){
    return ""
  }

  let text = workspace.name + (workspace.nameExtension ? " (" + workspace.nameExtension + ")" : "");
  let pretext = "";
  if (html){
    let url = window.location.href;
    let arr = url.split("/");
    let server = arr[0] + "//" + arr[2];

    text = '<a href="' + server + status.contextPath + "/workspace/" + workspace.urlName + '">' + text + "</a></p>";
    pretext = "<p> </p>\n\n<p>";
  }
  return pretext + i18n.text.get("plugin.workspace.index.newMessageCaption", text);
}

class WorkspaceTeachers extends React.Component<WorkspaceTeachersProps, WorkspaceTeachersState> {
  constructor(props: WorkspaceTeachersProps){
    super(props);
  }
  render(){
    return <div className="panel panel--workspace-teachers">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--workspace-teachers icon-user"></div>
        <div className="panel__header-title">{this.props.i18n.text.get('plugin.workspace.index.teachersTitle')}</div>
      </div>
      {this.props.workspace && this.props.workspace.staffMembers && this.props.workspace.staffMembers.length ? this.props.workspace.staffMembers.map((teacher)=>
        <div className="panel__content">
          <div className="workspace-teacher" key={teacher.userEntityId}>
            <div className="workspace-teacher-profile-picture">
            <object data={getUserImageUrl(teacher.userEntityId)} type="image/jpeg">
              <img src="/gfx/default-user-picture.jpg" />
            </object>
          </div>
          <div className="workspace-teacher-info">
            <div className="workspace-teacher-name">
              <span className="workspace-teacher-info firstname">{teacher.firstName}</span>
              <span className="workspace-teacher-info lastname">{teacher.lastName}</span>
            </div>
            <div className="workspace-teacher-info email">{teacher.email}</div>
            {teacher.properties['profile-phone'] ?
              <div className="workspace-teacher-info phone">{this.props.i18n.text.get("plugin.workspace.index.phone.label")}: {teacher.properties['profile-phone']}
            </div> : null}
            {teacher.properties['profile-vacation-period'] ?
              <div className="workspace-teacher-info vacation-period">{this.props.i18n.text.get("plugin.workspace.index.teachersVacationPeriod.label")} {teacher.properties['profile-vacation-period']}
            </div> : null}
            <CommunicatorNewMessage extraNamespace="workspace-teachers" initialSelectedItems={[{
                type: "staff",
                value: teacher
              }]} initialSubject={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace)}
                initialMessage={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace, true)}>
                <Button buttonModifiers="message">
                  <span className="icon icon-envelope"></span>
                  {this.props.i18n.text.get("plugin.workspace.index.message.label")}
                </Button></CommunicatorNewMessage>
            </div>
          </div>
        </div>
        ) : (
        <div className="panel__content panel__content--empty">
          {this.props.i18n.text.get("plugin.workspace.index.teachersEmpty")}
        </div>
        )}
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceTeachers);