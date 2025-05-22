import * as React from "react";
import { getName } from "~/util/modifiers";
import Avatar from "~/components/general/avatar";
import {
  ApplicationListItem,
  ApplicationListItemContentWrapper,
  ApplicationListItemContentData,
} from "~/components/general/application-list";
import { Student, StaffMember } from "~/generated/client";

/**
 * UserProps
 */
interface UserProps {
  user: Student | StaffMember;
  actions: React.ReactElement<any>;
}

/**
 * User
 * @param props props
 * @returns React.JSX.Element
 */
export default function User(props: UserProps) {
  return (
    <ApplicationListItem key={props.user.id} modifiers="user">
      <ApplicationListItemContentWrapper
        modifiers="user"
        actions={props.actions}
        mainModifiers="user"
        asideModifiers="user"
        aside={
          <Avatar
            id={props.user.userEntityId}
            hasImage={props.user.hasImage}
            name={props.user.firstName}
          />
        }
      >
        <ApplicationListItemContentData modifiers="primary">
          {getName(props.user, true)}
        </ApplicationListItemContentData>
        <ApplicationListItemContentData modifiers="secondary">
          {props.user.email}
        </ApplicationListItemContentData>
      </ApplicationListItemContentWrapper>
    </ApplicationListItem>
  );
}
