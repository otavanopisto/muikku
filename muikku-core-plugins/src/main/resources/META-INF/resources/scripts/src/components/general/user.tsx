import * as React from "react";
import { UserType } from "~/reducers/user-index";
import { i18nType } from "~/reducers/base/i18n";
import { getName } from "~/util/modifiers";
import Avatar from "~/components/general/avatar";
import {
  ApplicationListItem,
  ApplicationListItemContentWrapper,
  ApplicationListItemContentData
} from "~/components/general/application-list";

interface UserProps {
  user: UserType;
  actions: React.ReactElement<any>;
}

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
            firstName={props.user.firstName}
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
