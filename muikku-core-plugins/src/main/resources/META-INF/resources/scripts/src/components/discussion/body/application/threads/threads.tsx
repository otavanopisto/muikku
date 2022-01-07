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

/**
 * DiscussionThreads
 */
export class DiscussionThreads extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  render() {
    return <ApplicationList>{this.props.children}</ApplicationList>;
  }
}

/**
 * DiscussionThreadProps
 */
interface DiscussionThreadProps {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => any;
  avatar: JSX.Element;
}

/**
 * DiscussionThread
 */
export class DiscussionThread extends React.Component<
  DiscussionThreadProps,
  Record<string, unknown>
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

/**
 * DiscussionThreadHeaderProps
 */
interface DiscussionThreadHeaderProps {
  aside?: React.ReactNode;
}

/**
 * DiscussionThreadHeader
 */
export class DiscussionThreadHeader extends React.Component<
  DiscussionThreadHeaderProps,
  Record<string, unknown>
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

/**
 * DiscussionThreadBody
 */
export class DiscussionThreadBody extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  render() {
    return (
      <ApplicationListItemBody>{this.props.children}</ApplicationListItemBody>
    );
  }
}

/**
 * DiscussionThreadFooterProps
 */
interface DiscussionThreadFooterProps {
  hasActions?: boolean;
}

/**
 * DiscussionThreadFooter
 */
export class DiscussionThreadFooter extends React.Component<
  DiscussionThreadFooterProps,
  Record<string, unknown>
> {
  render() {
    return (
      <ApplicationListItemFooter modifiers="discussion-message">
        {this.props.children}
      </ApplicationListItemFooter>
    );
  }
}

/**
 * DiscussionCurrentThreadProps
 */
interface DiscussionCurrentThreadProps {
  title: React.ReactNode;
  sticky: boolean;
  locked: boolean;
}

/**
 * DiscussionCurrentThread
 */
export class DiscussionCurrentThread extends React.Component<
  DiscussionCurrentThreadProps,
  Record<string, unknown>
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

/**
 * DiscussionCurrentThreadElementProps
 */
interface DiscussionCurrentThreadElementProps {
  isOpMessage?: boolean;
  isReplyOfReply?: boolean;
  isReply?: boolean;
  avatar: any;
  hidden: boolean;
}

/**
 * DiscussionCurrentThreadElement
 */
export class DiscussionCurrentThreadElement extends React.Component<
  DiscussionCurrentThreadElementProps,
  Record<string, unknown>
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
