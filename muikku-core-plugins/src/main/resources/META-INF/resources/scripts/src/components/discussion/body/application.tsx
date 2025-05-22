import * as React from "react";
import { connect } from "react-redux";
import NewThread from "../dialogs/new-thread";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import HoverButton from "~/components/general/hover-button";
import Toolbar from "./application/toolbar";
import { DiscussionState } from "~/reducers/discussion";
import { StateType } from "~/reducers";
import DiscussionThreads from "./application/discussion-threads";
import DiscussionCurrentThread from "./application/discussion-current-thread";
import Button from "~/components/general/button";
import "~/sass/elements/link.scss";
import { WithTranslation, withTranslation } from "react-i18next";
import DiscussionSubscriptions from "./application/discussion-subscriptions";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DiscussionApplicationState
 */
interface DiscussionApplicationState {}

/**
 * DiscussionApplicationProps
 */
interface DiscussionApplicationProps extends WithTranslation {
  discussion: DiscussionState;
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
   * componentDidMount
   */
  componentDidMount() {
    this.props.i18n.setDefaultNamespace("messaging");
  }

  /**
   * render
   */
  render() {
    const title = this.props.i18n.t("labels.discussion");
    const toolbar = <Toolbar />;
    const primaryOption =
      !this.props.discussion.current &&
      this.props.discussion.areas.length > 0 ? (
        <NewThread>
          <Button buttonModifiers="primary-function">
            {this.props.i18n.t("actions.create", {
              ns: "messaging",
              context: "message",
            })}
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
      <>
        <ApplicationPanel
          title={title}
          primaryOption={primaryOption}
          toolbar={toolbar}
        >
          {!this.props.discussion.subscribedThreadOnly && <DiscussionThreads />}
          {this.props.discussion.subscribedThreadOnly && (
            <DiscussionSubscriptions />
          )}

          <DiscussionCurrentThread />
        </ApplicationPanel>
        {primaryOptionMobile}
      </>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    discussion: state.discussion,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return {};
}

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(DiscussionApplication)
);
