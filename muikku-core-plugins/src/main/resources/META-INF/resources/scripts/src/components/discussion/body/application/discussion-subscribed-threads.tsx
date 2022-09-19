import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { getName } from "~/util/modifiers";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/discussion.scss";
import "~/sass/elements/avatar.scss";
import {
  DiscussionType,
  DiscussionThreadType,
  DiscussionUserType,
} from "~/reducers/discussion";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import { StateType } from "~/reducers";
import OverflowDetector from "~/components/general/overflow-detector";
import {
  DiscussionThreads,
  DiscussionThread,
  DiscussionThreadHeader,
  DiscussionThreadBody,
  DiscussionThreadFooter,
  DiscussionThreadsListHeader,
} from "./threads/threads";
import { StatusType } from "~/reducers/base/status";
import Avatar from "~/components/general/avatar";
import { AnyActionType } from "~/actions/index";
import { ButtonPill } from "~/components/general/button";
import { bindActionCreators } from "redux";
import {
  subscribeDiscussionThread,
  unsubscribeDiscussionThread,
  SubscribeDiscussionThread,
  UnsubscribeDiscustionThread,
} from "../../../../actions/discussion/index";

/**
 * DiscussionThreadsProps
 */
interface DiscussionSubscribedThreadsProps {
  discussion: DiscussionType;
  i18n: i18nType;
  status: StatusType;
  subscribeDiscussionThread: SubscribeDiscussionThread;
  unsubscribeDiscussionThread: UnsubscribeDiscustionThread;
}

/**
 * DiscussionThreadsState
 */
interface DiscussionSubscribedThreadsState {}

/**
 * DDiscussionThreads
 */
class DiscussionSubscribedThreads extends React.Component<
  DiscussionSubscribedThreadsProps,
  DiscussionSubscribedThreadsState
> {
  /**
   * Constructor method
   * @param props props
   */
  constructor(props: DiscussionSubscribedThreadsProps) {
    super(props);

    this.getToThread = this.getToThread.bind(this);
  }

  /**
   * handles page changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem
   * @param selectedItem.selected selected
   */
  handlePageChange = (selectedItem: { selected: number }) => {
    window.location.hash =
      (this.props.discussion.areaId || 0) + "/" + (selectedItem.selected + 1);
  };

  /**
   * Creates aria-label for a tags depending if link is selected
   * or not
   * @param index link index
   * @param selected if selected
   * @returns label with correct locale string
   */
  handleAriaLabelBuilder = (index: number, selected: boolean): string => {
    let label = this.props.i18n.text.get("plugin.wcag.pager.goToPage.label");

    if (selected) {
      label = this.props.i18n.text.get("plugin.wcag.pager.current.label");
    }

    return label;
  };

  /**
   * handleSubscribeOrUnsubscribeClick
   * @param thread thread
   * @param isSubscribed isSubscribed
   */
  handleSubscribeOrUnsubscribeClick =
    (thread: DiscussionThreadType, isSubscribed: boolean) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      if (isSubscribed) {
        this.props.unsubscribeDiscussionThread({
          areaId: thread.forumAreaId,
          threadId: thread.id,
        });
      } else {
        this.props.subscribeDiscussionThread({
          areaId: thread.forumAreaId,
          threadId: thread.id,
        });
      }
    };

  /**
   * getToThread
   * @param thread thread
   */
  getToThread(thread: DiscussionThreadType) {
    if (this.props.discussion.areaId === thread.forumAreaId) {
      window.location.hash =
        thread.forumAreaId +
        "/" +
        this.props.discussion.page +
        "/" +
        thread.id +
        "/1";
    }
    window.location.hash = thread.forumAreaId + "/1" + "/" + thread.id + "/1";
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (this.props.discussion.state === "LOADING") {
      return null;
    } else if (this.props.discussion.state === "ERROR") {
      //TODO: put a translation here t! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return (
        <div className="empty">
          <span>{"ERROR"}</span>
        </div>
      );
    } else {
      if (
        this.props.discussion.subscribedThreadOnly &&
        this.props.discussion.subscribedThreads.length === 0 &&
        !this.props.discussion.current
      ) {
        return (
          <div className="empty">
            <span>Ei tilattuja viestejä</span>
          </div>
        );
      }
    }

    const subscribedThreadsOnly = this.props.discussion.subscribedThreads.map(
      (sThreads) => {
        const subscribredThread = sThreads.thread;

        const user: DiscussionUserType = subscribredThread.creator;

        const userCategory = user.id > 10 ? (user.id % 10) + 1 : user.id;
        const threadCategory =
          subscribredThread.forumAreaId > 10
            ? (subscribredThread.forumAreaId % 10) + 1
            : subscribredThread.forumAreaId;

        let avatar;
        if (!user) {
          //This is what it shows when the user is not ready
          avatar = <div className="avatar avatar--category-1"></div>;
        } else {
          //This is what it shows when the user is ready
          avatar = (
            <Avatar
              key={subscribredThread.id}
              id={user.id}
              firstName={user.firstName}
              hasImage={user.hasImage}
              userCategory={userCategory}
              avatarAriaLabel={this.props.i18n.text.get(
                "plugin.wcag.userAvatar.label"
              )}
            />
          );
        }

        return (
          <DiscussionThread
            key={subscribredThread.id}
            onClick={this.getToThread.bind(this, subscribredThread)}
            avatar={avatar}
          >
            <DiscussionThreadHeader>
              <div style={{ display: "flex", alignItems: "center" }}>
                {subscribredThread.locked ? (
                  <div className="discussion__icon icon-lock"></div>
                ) : null}
                {subscribredThread.sticky ? (
                  <div className="discussion__icon icon-pin"></div>
                ) : null}
                <div
                  className={`discussion-category discussion-category--category-${threadCategory}`}
                >
                  <span>{subscribredThread.title}</span>
                </div>
              </div>

              <div>
                <ButtonPill
                  icon="book"
                  onClick={this.handleSubscribeOrUnsubscribeClick(
                    subscribredThread,
                    true
                  )}
                  buttonModifiers={["discussion-subscription active"]}
                />
              </div>
            </DiscussionThreadHeader>
            {subscribredThread.sticky ? (
              <DiscussionThreadBody>
                <OverflowDetector
                  as="div"
                  classNameWhenOverflown="application-list__item-text-body--discussion-message-overflow"
                  className="application-list__item-text-body--discussion-message rich-text"
                  dangerouslySetInnerHTML={{
                    __html: subscribredThread.message,
                  }}
                />
              </DiscussionThreadBody>
            ) : null}
            <DiscussionThreadFooter>
              <div className="application-list__item-footer-content-main">
                <span>
                  {user &&
                    getName(
                      user,
                      this.props.status.permissions.FORUM_SHOW_FULL_NAMES
                    )}
                  , {this.props.i18n.time.format(subscribredThread.created)}
                </span>
              </div>
              <div className="application-list__item-footer-content-aside">
                <div className="application-list__item-counter-container">
                  <span className="application-list__item-counter-title">
                    {this.props.i18n.text.get(
                      "plugin.discussion.titleText.replyCount"
                    )}{" "}
                  </span>
                  <span className="application-list__item-counter">
                    {subscribredThread.numReplies}
                  </span>
                </div>
                <div className="application-list__item-date">
                  <span>
                    {this.props.i18n.text.get(
                      "plugin.discussion.titleText.lastMessage"
                    )}{" "}
                    {this.props.i18n.time.format(subscribredThread.updated)}
                  </span>
                </div>
              </div>
            </DiscussionThreadFooter>
          </DiscussionThread>
        );
      }
    );

    return (
      <BodyScrollKeeper hidden={!!this.props.discussion.current}>
        <DiscussionThreadsListHeader>
          Keskustelujen tilaukset
        </DiscussionThreadsListHeader>
        <DiscussionThreads>{subscribedThreadsOnly}</DiscussionThreads>
        <DiscussionThreadsListHeader>
          Työtilojen keskusteluiden tilaukset
        </DiscussionThreadsListHeader>
      </BodyScrollKeeper>
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      subscribeDiscussionThread,
      unsubscribeDiscussionThread,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionSubscribedThreads);
