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
          asideModifiers="discussion"
          mainModifiers="discussion"
        >
          {this.props.children}
        </ApplicationListItemContentWrapper>
      </ApplicationListItem>
    );
  }
}
