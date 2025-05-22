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
 * DiscussionThreadsProps
 */
interface DiscussionThreadsProps {
  children?: React.ReactNode;
}

/**
 * DiscussionThreads
 */
export class DiscussionThreads extends React.Component<
  DiscussionThreadsProps,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    return <ApplicationList>{this.props.children}</ApplicationList>;
  }
}

/**
 * DiscussionThreadProps
 */
interface DiscussionThreadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (event: React.MouseEvent<HTMLDivElement>) => any;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  avatar: React.JSX.Element;
  children?: React.ReactNode;
}

/**
 * DiscussionThread
 */
export class DiscussionThread extends React.Component<
  DiscussionThreadProps,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    return (
      <ApplicationListItem
        className="message message--discussion"
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
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
  children?: React.ReactNode;
}

/**
 * DiscussionThreadHeader
 */
export class DiscussionThreadHeader extends React.Component<
  DiscussionThreadHeaderProps,
  Record<string, unknown>
> {
  /**
   * render
   */
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
 * DiscussionThreadBodyProps
 */
interface DiscussionThreadBodyProps {
  html?: string;
  children?: React.ReactNode;
}

/**
 * DiscussionThreadBody
 */
export class DiscussionThreadBody extends React.Component<
  DiscussionThreadBodyProps,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    return (
      <ApplicationListItemBody content={this.props.html} modifiers="discussion">
        {this.props.children}
      </ApplicationListItemBody>
    );
  }
}

/**
 * DiscussionThreadFooterProps
 */
interface DiscussionThreadFooterProps {
  hasActions?: boolean;
  children?: React.ReactNode;
}

/**
 * DiscussionThreadFooter
 */
export class DiscussionThreadFooter extends React.Component<
  DiscussionThreadFooterProps,
  Record<string, unknown>
> {
  /**
   * render
   */
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
  children?: React.ReactNode;
}

/**
 * DiscussionCurrentThread
 */
export class DiscussionCurrentThreadListContainer extends React.Component<
  DiscussionCurrentThreadProps,
  Record<string, unknown>
> {
  /**
   * render
   */
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  avatar: any;
  hidden: boolean;
  children?: React.ReactNode;
}

/**
 * DiscussionCurrentThreadElement
 */
export class DiscussionCurrentThreadElement extends React.Component<
  DiscussionCurrentThreadElementProps,
  Record<string, unknown>
> {
  /**
   * render
   */
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

/**
 * DiscussionThreadHeaderProps
 */
interface DiscussionThreadsListHeaderProps {
  aside?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * DiscussionThreadHeader
 */
export class DiscussionThreadsListHeader extends React.Component<
  DiscussionThreadsListHeaderProps,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    if (this.props.aside) {
      return (
        <ApplicationListItemHeader modifiers="discussion-thread-list">
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
      <ApplicationListItemHeader modifiers="discussion-thread-list">
        {this.props.children}
      </ApplicationListItemHeader>
    );
  }
}
