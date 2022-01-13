import Feed from "../../general/feed";
import * as React from "react";
import mApi from "~/lib/mApi";

/**
 * FrontpageFeedProps
 */
interface FrontpageFeedProps {
  feedReadTarget: string;
  queryOptions: any;
}

/**
 * FrontpageFeedState
 */
interface FrontpageFeedState {
  entries: Array<any>;
}

/**
 * FrontpageFeed
 */
export default class FrontpageFeed extends React.Component<
  FrontpageFeedProps,
  FrontpageFeedState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: FrontpageFeedProps) {
    super(props);

    this.state = {
      entries: [],
    };
  }
  /**
   * componentDidMount
   */
  componentDidMount() {
    mApi()
      .feed.feeds.read(this.props.feedReadTarget, this.props.queryOptions)
      .callback((err: Error, entries: Array<any>) => {
        if (!err) {
          this.setState({ entries });
        }
      });
  }
  /**
   * render
   */
  render() {
    return <Feed entries={this.state.entries}></Feed>;
  }
}
