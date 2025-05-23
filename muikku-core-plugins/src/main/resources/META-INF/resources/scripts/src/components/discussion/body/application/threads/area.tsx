import * as React from "react";
import {
  ApplicationListItem,
  ApplicationListItemContentWrapper,
} from "~/components/general/application-list";

/**
 * DiscussionThreadProps
 */
interface DiscussionAreaProps {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

/**
 * DiscussionThread
 */
export class DiscussionArea extends React.Component<
  DiscussionAreaProps,
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
      >
        <ApplicationListItemContentWrapper
          aside={
            <div
              className="avatar-container avatar-container--discussion-area"
              aria-hidden={true}
            >
              <span className="icon-bubbles"></span>
            </div>
          }
          asideModifiers="discussion"
          mainModifiers="discussion"
        >
          {this.props.children}
        </ApplicationListItemContentWrapper>
      </ApplicationListItem>
    );
  }
}
