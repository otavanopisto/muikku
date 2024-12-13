import Feed from "../../general/feed";
import * as React from "react";
import MApi, { isMApiError } from "~/api/api";
import { FeedEntry, GetFeedsRequest } from "~/generated/client";

/**
 * FrontpageFeedProps
 */
interface FrontpageFeedProps {
  feedReadTarget: string[];
  queryOptions: Partial<Omit<GetFeedsRequest, "feedReadTarget">>;
}

/**
 * FrontpageFeedState
 */
interface FrontpageFeedState {
  entries: FeedEntry[];
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
  async componentDidMount() {
    const feedsApi = MApi.getFeedsApi();

    try {
      const feeds = await feedsApi.getFeeds({
        feedReadTarget: this.props.feedReadTarget,
        ...this.props.queryOptions,
      });

      this.setState({ entries: feeds });
    } catch (err) {
      this.setState({ entries: [] });
      if (!isMApiError(err)) {
        throw err;
      }
    }
  }
  /**
   * render
   */
  render() {
    return <Feed entries={this.state.entries}></Feed>;
  }
}
