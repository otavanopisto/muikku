import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import NewThread from "../dialogs/new-thread";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import HoverButton from "~/components/general/hover-button";
import Toolbar from "./application/toolbar";
import { DiscussionType } from "~/reducers/discussion";
import { StateType } from "~/reducers";
import DiscussionThreads from "./application/discussion-threads";
import CurrentThread from "./application/current-thread";
import Button from "~/components/general/button";
import "~/sass/elements/link.scss";

/**
 * DiscussionApplicationState
 */
interface DiscussionApplicationState {}

/**
 * DiscussionApplicationProps
 */
interface DiscussionApplicationProps {
  i18n: i18nType;
  discussion: DiscussionType;
}

/**
 * DiscussionApplication
 */
class DiscussionApplication extends React.Component<
  DiscussionApplicationProps,
  DiscussionApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DiscussionApplicationProps) {
    super(props);
  }
  /**
   * render
   */
  render() {
    const title = this.props.i18n.text.get("plugin.forum.pageTitle");
    const toolbar = <Toolbar />;
    const primaryOption =
      !this.props.discussion.current &&
      this.props.discussion.areas.length > 0 ? (
        <NewThread>
          <Button buttonModifiers="primary-function">
            {this.props.i18n.text.get("plugin.discussion.createmessage.topic")}
          </Button>
        </NewThread>
      ) : null;
    const primaryOptionMobile =
      this.props.discussion.areas.length > 0 ? (
        <NewThread>
          <HoverButton icon="plus" modifier="new-message" />
        </NewThread>
      ) : null;

    return (
      <div className="application-panel-wrapper">
        <ApplicationPanel
          title={title}
          modifier="discussion"
          primaryOption={primaryOption}
          toolbar={toolbar}
        >
          <DiscussionThreads />
          <CurrentThread />
        </ApplicationPanel>
        {primaryOptionMobile}
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    discussion: state.discussion,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionApplication);
