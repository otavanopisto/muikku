import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { getName, getUserImageUrl } from "~/util/modifiers";
import Button from "~/components/general/button";
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';
import Avatar from '~/components/general/avatar';
import { StatusType } from "~/reducers/base/status";
import moment from '~/lib/moment';

import '~/sass/elements/panel.scss';
import '~/sass/elements/item-list.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/glyph.scss';

interface WorkspaceTeachersProps {
  workspace: WorkspaceType,
  i18n: i18nType,
  status: StatusType
}

interface WorkspaceTeachersState {
}

export function getWorkspaceMessage(i18n: i18nType, status: StatusType, workspace: WorkspaceType, html?: boolean) {
  if (!workspace) {
    return ""
  }

  let pretext = "";
  let text = workspace.name + (workspace.nameExtension ? " (" + workspace.nameExtension + ")" : "");

  if (html) {
    let url = window.location.href;
    let arr = url.split("/");
    let server = arr[0] + "//" + arr[2];

    pretext = '<p></p>';
    text = '<p><i class="message-from-workspace">' + i18n.text.get("plugin.workspace.index.newMessageCaption") + ' ' + '<a href="' + server + status.contextPath + "/workspace/" + workspace.urlName + '">' + text + "</a></i></p>";
  }

  return pretext + text;
}

class WorkspaceTeachers extends React.Component<WorkspaceTeachersProps, WorkspaceTeachersState> {
  constructor(props: WorkspaceTeachersProps) {
    super(props);
  }
  render() {
    if (!this.props.status.loggedIn) {
      return null;
    }
    return <div className="panel panel--workspace-teachers">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--workspace-teachers icon-user"></div>
        <h2 className="panel__header-title">{this.props.i18n.text.get('plugin.workspace.index.teachersTitle')}</h2>
      </div>
      {this.props.workspace && this.props.workspace.staffMembers && this.props.workspace.staffMembers.results.length ? (
        <div className="panel__body">
          <div className="item-list item-list--panel-teachers">
            {this.props.workspace.staffMembers.results.map((teacher) => {
              // by default wether we display the vacation period depends on whether the vacation starts at all
              let displayVacationPeriod = !!teacher.properties['profile-vacation-start'];
              // however if we have a range
              if (teacher.properties['profile-vacation-end']) {
                // we must check for the ending
                const vacationEndsAt = moment(teacher.properties['profile-vacation-end']);
                const today = moment();
                // if it's before or it's today then we display, otherwise nope
                displayVacationPeriod = vacationEndsAt.isAfter(today, "day") || vacationEndsAt.isSame(today, "day");
              }

              return <div className="item-list__item item-list__item--teacher" key={teacher.userEntityId}>
                <div className="item-list__profile-picture">
                  <Avatar id={teacher.userEntityId} firstName={teacher.firstName} hasImage={teacher.hasImage}></Avatar>
                </div>
                <div className="item-list__text-body item-list__text-body--multiline">
                  <div className="item-list__user-name">{teacher.firstName} {teacher.lastName}</div>
                  <div className="item-list__user-contact-info">
                    <div className="item-list__user-email"><span className="glyph icon-envelope"></span>{teacher.email}</div>
                    {teacher.properties['profile-phone'] ?
                      <div className="item-list__user-phone"><span className="glyph icon-phone"></span>{teacher.properties['profile-phone']}
                      </div> : null}
                  </div>
                  {displayVacationPeriod ?
                    <div className="item-list__user-vacation-period">
                      {this.props.i18n.text.get("plugin.workspace.index.teachersVacationPeriod.label")}&nbsp;
                      {this.props.i18n.time.format(teacher.properties['profile-vacation-start'])}
                      {teacher.properties['profile-vacation-end'] ? "–" + this.props.i18n.time.format(teacher.properties['profile-vacation-end']) : null}
                    </div> : null}
                  <CommunicatorNewMessage extraNamespace="workspace-teachers" initialSelectedItems={[{
                    type: "staff",
                    value: {
                      id: teacher.userEntityId,
                      name: getName(teacher, true)
                    }
                  }]} initialSubject={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace)}
                    initialMessage={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace, true)}>
                    <Button buttonModifiers={["info", "contact-teacher"]}>
                      {this.props.i18n.text.get("plugin.workspace.index.message.label")}
                    </Button></CommunicatorNewMessage>
                </div>
              </div>
            })}
          </div>
        </div>
      ) : (
        <div className="panel__body panel__body--empty">
          {this.props.i18n.text.get("plugin.workspace.index.teachersEmpty")}
        </div>
      )}
    </div>
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceTeachers);
