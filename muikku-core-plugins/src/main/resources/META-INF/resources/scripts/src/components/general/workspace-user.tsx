import * as React from "react";
import Avatar from "~/components/general/avatar";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import LazyLoader from "~/components/general/lazy-loader";
import { IconButton } from "~/components/general/button";
import { getName, filterHighlight } from "~/util/modifiers";
import {
  ApplicationListItem,
  ApplicationListItemContentWrapper,
} from "~/components/general/application-list";
import { WorkspaceStudent } from "~/generated/client/models/WorkspaceStudent";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";

/**
 * workspaceUserProps
 */
interface workspaceUserProps {
  student: WorkspaceStudent;
  workspace: WorkspaceDataType;
  status: StatusType;
  highlight: string;
  onSendMessage?: () => any;
  onSetToggleStatus: () => any;
}

/**
 * WorkspaceUser
 * @param props props
 * @returns React.JSX.Element
 */
export default function WorkspaceUser(props: workspaceUserProps) {
  const { t } = useTranslation(["common"]);

  const pedagogyFormIcon = props.student.hasPedagogyForm ? (
    <Dropdown
      alignSelfVertically="top"
      openByHover
      content={
        <span id={`pedagogyPlan-` + props.student.userEntityId}>
          {t("labels.pedagogyPlan", {
            ns: "common",
          })}
        </span>
      }
    >
      <div className="label label--pedagogy-plan">
        <span
          className="label__text label__text--pedagogy-plan"
          aria-labelledby={`pedagogyPlan-` + props.student.userEntityId}
        >
          P
        </span>
      </div>
    </Dropdown>
  ) : null;

  const u18CompulsoryIcon = props.student.u18Compulsory ? (
    <Dropdown
      alignSelfVertically="top"
      openByHover
      content={
        <span id={`u18Compulsory-` + props.student.userEntityId}>
          {t("labels.u18Compulsory", {
            ns: "common",
          })}
        </span>
      }
    >
      <div className="label label--u18-compulsory">
        <span
          className="label__text label__text--u18-compulsory"
          aria-labelledby={`u18Compulsory-` + props.student.userEntityId}
        >
          O
        </span>
      </div>
    </Dropdown>
  ) : null;

  const actionButtons = props.student.active ? (
    <>
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
    </>
  ) : (
    <>
      <IconButton
        buttonModifiers="workspace-users-unarchive"
        icon="back"
        onClick={props.onSetToggleStatus}
      />
    </>
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
                name={props.student.firstName}
                hasImage={props.student.hasImage}
              />
            </div>
          </LazyLoader>
        }
        actions={actionButtons}
      >
        <div className="application-list__item-content-primary-data">
          {filterHighlight(getName(props.student, true), props.highlight)}
          <div className="labels">
            {pedagogyFormIcon}
            {u18CompulsoryIcon}
          </div>
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
