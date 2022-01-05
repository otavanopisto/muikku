import "~/sass/elements/application-list.scss";
import "~/sass/elements/message.scss";

import * as React from "react";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemContentWrapper,
  ApplicationListItemHeader,
  ApplicationListItemBody,
  ApplicationListItemFooter,
} from "~/components/general/application-list";

export class DiscussionThreads extends React.Component<{}, {}> {
  render() {
    return <ApplicationList>{this.props.children}</ApplicationList>;
  }
}

export class DiscussionThread extends React.Component<
  {
    onClick: (event: React.MouseEvent<HTMLDivElement>) => any;
    avatar: JSX.Element;
  },
  {}
> {
  render() {
    return (
      <ApplicationListItem
        className="message message--discussion"
        onClick={this.props.onClick}
      >
        <ApplicationListItemContentWrapper
          asideModifiers="discussion"
          mainModifiers="discussion"
          aside={this.props.avatar}
        >
          {this.props.children}
        </ApplicationListItemContentWrapper>
      </ApplicationListItem>
    );
  }
}

export class DiscussionThreadHeader extends React.Component<
  {
    aside?: React.ReactNode;
  },
  {}
> {
  render() {
    if (this.props.aside) {
      return (
        <ApplicationListItemHeader modifiers="discussion">
          <div className="application-list__item-header-main">
            {this.props.children}
          </div>
          <div className="application-list__item-header-aside">
            {this.props.aside}
          </div>
        </ApplicationListItemHeader>
      );
    }
    return (
      <ApplicationListItemHeader modifiers="discussion">
        {this.props.children}
      </ApplicationListItemHeader>
    );
  }
}

export class DiscussionThreadBody extends React.Component<{}, {}> {
  render() {
    return (
      <ApplicationListItemBody>{this.props.children}</ApplicationListItemBody>
    );
  }
}

export class DiscussionThreadFooter extends React.Component<
  {
    hasActions?: boolean;
  },
  {}
> {
  render() {
    return (
      <ApplicationListItemFooter modifiers="discussion-message">
        {this.props.children}
      </ApplicationListItemFooter>
    );
  }
}

export class DiscussionCurrentThread extends React.Component<
  {
    title: React.ReactNode;
    sticky: boolean;
    locked: boolean;
  },
  {}
> {
  render() {
    return (
      <ApplicationList>
        <div className="application-list__header application-list__header--discussion">
          {this.props.locked ? (
            <div className="discussion__icon icon-lock" />
          ) : null}
          {this.props.sticky ? (
            <div className="discussion__icon icon-pin" />
          ) : null}
          {this.props.title}
        </div>
        {this.props.children}
      </ApplicationList>
    );
  }
}

export class DiscussionCurrentThreadElement extends React.Component<
  {
    isOpMessage?: boolean;
    isReplyOfReply?: boolean;
    isReply?: boolean;
    avatar: any;
    hidden: boolean;
  },
  {}
> {
  render() {
    const baseMod = this.props.isOpMessage
      ? "discussion-message"
      : this.props.isReplyOfReply
      ? "discussion-reply-of-reply"
      : "discussion-reply";

    return (
      !this.props.hidden && (
        <ApplicationListItem modifiers={baseMod}>
          <ApplicationListItemContentWrapper
            asideModifiers="discussion"
            mainModifiers="discussion"
            aside={this.props.avatar}
          >
            {this.props.children}
          </ApplicationListItemContentWrapper>
        </ApplicationListItem>
      )
    );
  }
}
