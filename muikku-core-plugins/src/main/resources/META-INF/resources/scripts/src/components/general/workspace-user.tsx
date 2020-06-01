import * as React from "react";
import Avatar from "~/components/general/avatar";
import { ShortWorkspaceUserWithActiveStatusType} from "~/reducers/user-index";
import { WorkspaceType } from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { i18nType } from "~/reducers/base/i18n";
import { getUserImageUrl } from "~/util/modifiers";
import LazyLoader from "~/components/general/lazy-loader";
import {IconButton, ButtonPill} from '~/components/general/button';
import { getName, filterHighlight } from "~/util/modifiers";
import ApplicationList, { ApplicationListItem, ApplicationListItemContentWrapper, ApplicationListItemContentActions } from '~/components/general/application-list';

interface workspaceUserProps {
  student: ShortWorkspaceUserWithActiveStatusType,
  workspace: WorkspaceType,
  i18n: i18nType
  status: StatusType,
  highlight: string,
  onSendMessage?: ()=>any,
  onSetToggleStatus: ()=>any
}

export default function WorkspaceUser(props: workspaceUserProps){

  let actionButtons = props.student.active ? <ApplicationListItemContentActions><IconButton buttonModifiers="workspace-users-contact" icon="envelope" onClick={props.onSendMessage}/><IconButton buttonModifiers="workspace-users-archive" icon="trash" onClick={props.onSetToggleStatus}/></ApplicationListItemContentActions>: <IconButton buttonModifiers="workspace-users-unarchive" icon="back" onClick={props.onSetToggleStatus}/>;

  return <ApplicationListItem modifiers="workspace-user">
    <ApplicationListItemContentWrapper modifiers="workspace-user" mainModifiers="workspace-user" asideModifiers="workspace-user" aside={<LazyLoader className="avatar-container">
      <div className="item-list__profile-picture">
        <Avatar id={props.student.userEntityId} firstName={props.student.firstName} hasImage={props.student.hasImage}/>
      </div>
     </LazyLoader>} actions={actionButtons}>
      <div className="application-list__item-content-primary-data">{filterHighlight(getName(props.student, true), props.highlight)}</div>
      <div className="application-list__item-content-secondary-data">{props.student.studyProgrammeName ? " (" + props.student.studyProgrammeName + ")" : ""}</div>
    </ApplicationListItemContentWrapper>
  </ApplicationListItem>
}
