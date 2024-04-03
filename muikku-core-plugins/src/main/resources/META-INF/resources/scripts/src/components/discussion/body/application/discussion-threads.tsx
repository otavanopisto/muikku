import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { getName } from "~/util/modifiers";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/discussion.scss";
import "~/sass/elements/avatar.scss";
import { DiscussionState } from "~/reducers/discussion";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import { StateType } from "~/reducers";
import OverflowDetector from "~/components/general/overflow-detector";
import Dropdown from "~/components/general/dropdown";
import {
  DiscussionThreads,
  DiscussionThread as DiscussionThreadComponent,
  DiscussionThreadHeader,
  DiscussionThreadBody,
  DiscussionThreadFooter,
} from "./threads/threads";
import { StatusType } from "~/reducers/base/status";
import Avatar from "~/components/general/avatar";
import PagerV2 from "~/components/general/pagerV2";
import { AnyActionType } from "~/actions/index";
import { IconButton } from "~/components/general/button";
import { bindActionCreators } from "redux";
import {
  subscribeDiscussionThread,
  unsubscribeDiscussionThread,
  SubscribeDiscussionThread,
  UnsubscribeDiscustionThread,
} from "~/actions/discussion/index";
import { DiscussionThread } from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";

/**
 * DiscussionThreadsProps
 */
interface DiscussionThreadsProps extends WithTranslation {
  discussion: DiscussionState;
  status: StatusType;
  subscribeDiscussionThread: SubscribeDiscussionThread;
  unsubscribeDiscussionThread: UnsubscribeDiscustionThread;
}

/**
 * DiscussionThreadsState
 */
interface DiscussionThreadsState {}

/**
 * DDiscussionThreads
 */
class DDiscussionThreads extends React.Component<
  DiscussionThreadsProps,
  DiscussionThreadsState
> {
  /**
   * Constructor method
   * @param props props
   */
  constructor(props: DiscussionThreadsProps) {
    super(props);

    this.getToThread = this.getToThread.bind(this);
    this.handleThreadKeyDown = this.handleThreadKeyDown.bind(this);
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
    let label = this.props.i18n.t("wcag.goToPage", { ns: "messaging" });

    if (selected) {
      label = this.props.i18n.t("wcag.currentPage", { ns: "messaging" });
    }

    return label;
  };

  /**
   * handleSubscribeOrUnsubscribeClick
   * @param thread thread
   * @param isSubscribed isSubscribed
   */
  handleSubscribeOrUnsubscribeClick =
    (thread: DiscussionThread, isSubscribed: boolean) =>
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
  getToThread(thread: DiscussionThread) {
    const areaId = this.props.discussion.areaId
      ? this.props.discussion.areaId
      : 0;

    window.location.hash =
      areaId +
      "/" +
      this.props.discussion.page +
      "/" +
      thread.forumAreaId +
      "/" +
      thread.id +
      "/1";
  }

  /**
   * handleThreadKeyDown
   * @param thread thread
   * @param e e
   */
  handleThreadKeyDown(
    thread: DiscussionThread,
    e: React.KeyboardEvent<HTMLDivElement>
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.getToThread(thread);
    }
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
    } else if (
      this.props.discussion.threads.length === 0 &&
      !this.props.discussion.current
    ) {
      return (
        <div className="empty">
          <span>
            {this.props.i18n.t("content.empty", {
              ns: "messaging",
              context: "messages",
            })}
          </span>
        </div>
      );
    }

    const threads = this.props.discussion.threads.map(
      (thread, index: number) => {
        const isSubscribed =
          this.props.discussion.subscribedThreads.findIndex(
            (sThread) => sThread.threadId === thread.id
          ) !== -1;

        const user = thread.creator;

        const userCategory =
          thread.creator.id > 10
            ? (thread.creator.id % 10) + 1
            : thread.creator.id;
        const threadCategory =
          thread.forumAreaId > 10
            ? (thread.forumAreaId % 10) + 1
            : thread.forumAreaId;
        let avatar;
        if (!user) {
          //This is what it shows when the user is not ready
          avatar = <div className="avatar avatar--category-1"></div>;
        } else {
          //This is what it shows when the user is ready
          avatar = (
            <Avatar
              key={thread.id}
              id={user.id}
              firstName={user.firstName}
              hasImage={user.hasImage}
              userCategory={userCategory}
              avatarAriaLabel={this.props.i18n.t("wcag.OPUserAvatar", {
                ns: "messaging",
              })}
              avatarAriaHidden={true}
            />
          );
        }
        return (
          <DiscussionThreadComponent
            key={thread.id}
            onClick={this.getToThread.bind(this, thread)}
            onKeyDown={this.handleThreadKeyDown.bind(this, thread)}
            avatar={avatar}
          >
            <DiscussionThreadHeader>
              <div className="application-list__item-header-main">
                {thread.lock ? (
                  <div className="discussion__icon icon-lock" />
                ) : null}
                {thread.sticky ? (
                  <div className="discussion__icon icon-pin"></div>
                ) : null}
                <div
                  className={`discussion-category discussion-category--category-${threadCategory}`}
                >
                  <span>{thread.title}</span>
                </div>
              </div>

              <div className="application-list__item-header-aside">
                {isSubscribed ? (
                  <Dropdown
                    openByHover
                    modifier="discussion-tooltip"
                    content={this.props.i18n.t("labels.unsubscribe", {
                      ns: "messaging",
                    })}
                  >
                    <IconButton
                      icon="bookmark-full"
                      onClick={this.handleSubscribeOrUnsubscribeClick(
                        thread,
                        true
                      )}
                      buttonModifiers={["discussion-action-active"]}
                    />
                  </Dropdown>
                ) : (
                  <Dropdown
                    openByHover
                    modifier="discussion-tooltip"
                    content={this.props.i18n.t("labels.subscribe", {
                      ns: "messaging",
                    })}
                  >
                    <IconButton
                      icon="bookmark-empty"
                      onClick={this.handleSubscribeOrUnsubscribeClick(
                        thread,
                        false
                      )}
                      buttonModifiers={["discussion-action"]}
                    />
                  </Dropdown>
                )}
              </div>
            </DiscussionThreadHeader>
            {thread.sticky ? (
              <DiscussionThreadBody>
                <OverflowDetector
                  as="div"
                  classNameWhenOverflown="application-list__item-text-body--discussion-message-overflow"
                  className="application-list__item-text-body--discussion-message rich-text"
                  dangerouslySetInnerHTML={{ __html: thread.message }}
                />
              </DiscussionThreadBody>
            ) : null}
            <DiscussionThreadFooter>
              <div className="application-list__item-footer-content-main">
                <span className="application-list__item-footer-meta">
                  {user &&
                    getName(
                      user,
                      this.props.status.permissions.FORUM_SHOW_FULL_NAMES
                    )}
                  , {localize.date(thread.created)}
                </span>
              </div>
              <div className="application-list__item-footer-content-aside">
                <div className="application-list__item-counter-container">
                  <span className="application-list__item-counter-title">
                    {this.props.i18n.t("labels.replyCount", {
                      ns: "messaging",
                    })}
                  </span>
                  <span className="application-list__item-counter">
                    {thread.numReplies}
                  </span>
                </div>
                <div className="application-list__item-date">
                  <span>
                    {this.props.i18n.t("labels.lastMessage", {
                      ns: "messaging",
                      time: localize.date(thread.updated),
                    })}
                  </span>
                </div>
              </div>
            </DiscussionThreadFooter>
          </DiscussionThreadComponent>
        );
      }
    );

    return (
      <BodyScrollKeeper hidden={!!this.props.discussion.current}>
        <DiscussionThreads>
          {threads}

          <PagerV2
            previousLabel=""
            nextLabel=""
            breakLabel="..."
            forcePage={this.props.discussion.page - 1}
            marginPagesDisplayed={1}
            pageCount={this.props.discussion.totalPages}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageChange}
          />
        </DiscussionThreads>
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

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(DDiscussionThreads)
);
