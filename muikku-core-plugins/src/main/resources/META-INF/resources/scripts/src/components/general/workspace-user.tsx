import * as React from "react";
import Avatar from "~/components/general/avatar";
import { WorkspaceType } from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import LazyLoader from "~/components/general/lazy-loader";
import { IconButton } from "~/components/general/button";
import { getName, filterHighlight } from "~/util/modifiers";
import {
  ApplicationListItem,
  ApplicationListItemContentWrapper,
  ApplicationListItemContentActions,
} from "~/components/general/application-list";
import { WorkspaceStudent } from "~/generated/client/models/WorkspaceStudent";
import Dropdown from "~/components/general/dropdown";

/**
 * workspaceUserProps
 */
interface workspaceUserProps {
  student: WorkspaceStudent;
  workspace: WorkspaceType;
  status: StatusType;
  highlight: string;
  onSendMessage?: () => any;
  onSetToggleStatus: () => any;
}

/**
 * WorkspaceUser
 * @param props props
 * @returns JSX.Element
 */
export default function WorkspaceUser(props: workspaceUserProps) {
  const pedagogyFormIcon = props.student.hasPedagogyForm ? (
    <Dropdown
      alignSelfVertically="top"
      openByHover
      content={<p>Opiskelijalle on tehty pedagogisen tuen suunnitelma</p>}
    >
      <IconButton icon="book" disabled />
    </Dropdown>
  ) : null;

  const actionButtons = props.student.active ? (
    <ApplicationListItemContentActions>
      {pedagogyFormIcon}
      <IconButton
        buttonModifiers="workspace-users-contact"
        icon="envelope"
        onClick={props.onSendMessage}
      />
      <IconButton
        buttonModifiers="workspace-users-archive"
        icon="trash"
        onClick={props.onSetToggleStatus}
      />
    </ApplicationListItemContentActions>
  ) : (
    <ApplicationListItemContentActions>
      {pedagogyFormIcon}
      <IconButton
        buttonModifiers="workspace-users-unarchive"
        icon="back"
        onClick={props.onSetToggleStatus}
      />
    </ApplicationListItemContentActions>
  );

  return (
    <ApplicationListItem modifiers="workspace-user">
      <ApplicationListItemContentWrapper
        modifiers="workspace-user"
        mainModifiers="workspace-user"
        asideModifiers="workspace-user"
        aside={
          <LazyLoader className="avatar-container">
            <div className="item-list__profile-picture">
              <Avatar
                id={props.student.userEntityId}
                firstName={props.student.firstName}
                hasImage={props.student.hasImage}
              />
            </div>
          </LazyLoader>
        }
        actions={actionButtons}
      >
        <div className="application-list__item-content-primary-data">
          {filterHighlight(getName(props.student, true), props.highlight)}
        </div>
        <div className="application-list__item-content-secondary-data">
          {props.student.studyProgrammeName
            ? " (" + props.student.studyProgrammeName + ")"
            : ""}
        </div>
      </ApplicationListItemContentWrapper>
    </ApplicationListItem>
  );
}
