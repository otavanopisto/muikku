import * as React from "react";
import { DiscussionState } from "~/reducers/discussion";
import { localize } from "~/locales/i18n";
import { connect } from "react-redux";
import Link from "~/components/general/link";
import { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import DeleteThreadComponent from "../../dialogs/delete-thread-component";
import { getName } from "~/util/modifiers";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import Avatar from "~/components/general/avatar";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/avatar.scss";
import "~/sass/elements/discussion.scss";
import {
  DiscussionCurrentThreadListContainer,
  DiscussionCurrentThreadElement,
  DiscussionThreadHeader,
  DiscussionThreadBody,
  DiscussionThreadFooter,
} from "./threads/threads";
import ReplyThreadDrawer from "./reply-thread-drawer";
import DiscussionThreadReply from "./discussion-thread-reply";
import ModifyThreadDrawer from "./modify-thread-drawer";
import PagerV2 from "~/components/general/pagerV2";
import { AnyActionType } from "~/actions/index";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  SubscribeDiscussionThread,
  subscribeDiscussionThread,
  unsubscribeDiscussionThread,
  UnsubscribeDiscustionThread,
} from "~/actions/discussion/index";
import { DiscussionThread } from "~/generated/client";
import moment from "moment";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * CurrentThreadProps
 */
interface DiscussionCurrentThreadProps extends WithTranslation {
  discussion: DiscussionState;
  userId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permissions: any;
  status: StatusType;
  subscribeDiscussionThread: SubscribeDiscussionThread;
  unsubscribeDiscussionThread: UnsubscribeDiscustionThread;
}

/**
 * CurrentThreadState
 */
interface DiscussionCurrentThreadState {
  hiddenParentsLists: number[];
  openReplyType?: "answer" | "modify" | "quote";
  openedReplyEditorId?: number;
}

/**
 * CurrentThread
 */
class DiscussionCurrentThread extends React.Component<
  DiscussionCurrentThreadProps,
  DiscussionCurrentThreadState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DiscussionCurrentThreadProps) {
    super(props);

    this.state = {
      hiddenParentsLists: [],
    };
  }

  /**
   * If thread is locked, user can't reply to it
   *
   * @param thread thread
   * @returns boolean
   */
  isThreadLocked = (thread: DiscussionThread) => {
    switch (thread.lock) {
      case "ALL":
        return true;

      case "STUDENTS":
        return this.props.status.isStudent;

      default:
        return false;
    }
  };

  /**
   * getToPage
   * @param n n
   */
  getToPage(n: number) {
    const hash = window.location.hash.replace("#", "").split("/");

    const areaId = this.props.discussion.areaId
      ? this.props.discussion.areaId
      : 0;

    const areaString = hash.includes("subs")
      ? "subs"
      : areaId + "/" + this.props.discussion.page;

    window.location.hash =
      areaString +
      "/" +
      this.props.discussion.current.forumAreaId +
      "/" +
      this.props.discussion.current.id +
      "/" +
      n;
  }

  /**
   * onHideShowSubReplies
   * @param parentId parentId
   * Adds or removes parent elements from/to list depending wheter it is already in list.
   */
  onHideShowSubRepliesClick = (parentId: number) => (e: React.MouseEvent) => {
    if (this.state.hiddenParentsLists.includes(parentId)) {
      this.setState({
        hiddenParentsLists: this.state.hiddenParentsLists.filter(
          (id) => id !== parentId
        ),
      });
    } else {
      const updatedList = [...this.state.hiddenParentsLists];

      updatedList.push(parentId);

      this.setState({
        hiddenParentsLists: updatedList,
      });
    }
  };

  /**
   * handleOnReplyClick
   * @param type type
   */
  handleOnReplyClick =
    (type: "answer" | "modify" | "quote") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      this.setState({
        openReplyType: type !== this.state.openReplyType ? type : undefined,
      });
    };

  /**
   * handleOnCancelClick
   */
  handleOnCancelClick = () => {
    this.setState({
      openReplyType: undefined,
    });
  };

  /**
   * handles page changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem
   * @param selectedItem.selected selected
   */
  handlePagerChange = (selectedItem: { selected: number }) =>
    this.getToPage(selectedItem.selected + 1);

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
   * handleSubscribeOrUnsubscribeKeyDown
   * @param thread thread
   * @param isSubscribed isSubscribed
   */
  handleSubscribeOrUnsubscribeKeyDown =
    (thread: DiscussionThread, isSubscribed: boolean) =>
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === "Enter" || e.key === " ") {
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
      }
    };

  /**
   * render
   * @returns JSX.Element or null
   */
  render() {
    if (!this.props.discussion.current) {
      return null;
    }

    const isSubscribed =
      this.props.discussion.subscribedThreads.findIndex(
        (sThread) => sThread.threadId === this.props.discussion.current.id
      ) !== -1;

    const areaPermissions =
      (this.props.permissions.AREA_PERMISSIONS &&
        this.props.permissions.AREA_PERMISSIONS[
          this.props.discussion.current.forumAreaId
        ]) ||
      {};

    const userCreator = this.props.discussion.current.creator;

    const userCategory =
      this.props.discussion.current.creator.id > 10
        ? (this.props.discussion.current.creator.id % 10) + 1
        : this.props.discussion.current.creator.id;

    let avatar;

    if (!userCreator) {
      //This is what it shows when the user is not ready
      avatar = <div className="avatar avatar--category-1"></div>;
    } else {
      //This is what it shows when the user is ready
      avatar = (
        <Avatar
          key={userCreator.id}
          id={userCreator.id}
          name={userCreator.firstName}
          hasImage={userCreator.hasImage}
          userCategory={userCategory}
          avatarAriaLabel={this.props.i18n.t("wcag.OPUserAvatar", {
            ns: "messaging",
          })}
          avatarAriaHidden={true}
        />
      );
    }

    // Logged in user is student
    const student: boolean = this.props.status.isStudent;

    // Creator and logged in user are same
    const threadOwner: boolean =
      this.props.userId === this.props.discussion.current.creator.id;

    // User can edit if user is thread owner or user has editMessages permission
    const canEditThread: boolean = threadOwner || areaPermissions.editMessages;

    // If thread is locked, user can't reply to it
    const threadLocked = this.isThreadLocked(this.props.discussion.current);

    // Lock icon is shown if some value exists in lock property
    const showLockIcon = !!this.props.discussion.current.lock;

    // User can remove thread if user is thread owner or user has removeThread permission
    const canRemoveThread: boolean =
      (!student && threadOwner) ||
      areaPermissions.removeThread ||
      this.props.permissions.WORKSPACE_DELETE_FORUM_THREAD;

    const replies = this.props.discussion.currentReplies;

    // student can remove thread if student is thread owner
    let studentCanRemoveThread: boolean = threadOwner;

    // If the thread has someone elses messages, student can't remove the thread
    if (studentCanRemoveThread) {
      for (let i = 0; i < replies.length; i++) {
        if (this.props.userId !== replies[i].creator.id) {
          studentCanRemoveThread = false;
        }
      }
    }

    return (
      <DiscussionCurrentThreadListContainer
        sticky={this.props.discussion.current.sticky}
        locked={showLockIcon}
        title={
          <h2 className="application-list__title">
            <span className="application-list__title-main">
              {this.props.discussion.current.title}
            </span>
            <span className="application-list__title-aside">
              <Dropdown
                openByHover
                modifier="discussion-tooltip"
                content={
                  isSubscribed
                    ? this.props.i18n.t("labels.unsubscribe", {
                        ns: "messaging",
                      })
                    : this.props.i18n.t("labels.subscribe", {
                        ns: "messaging",
                      })
                }
              >
                <IconButton
                  as="div"
                  role="button"
                  aria-pressed={isSubscribed}
                  icon={isSubscribed ? "bookmark-full" : "bookmark-empty"}
                  onClick={this.handleSubscribeOrUnsubscribeClick(
                    this.props.discussion.current,
                    isSubscribed
                  )}
                  onKeyDown={this.handleSubscribeOrUnsubscribeKeyDown(
                    this.props.discussion.current,
                    isSubscribed
                  )}
                  buttonModifiers={
                    isSubscribed
                      ? ["discussion-action-active"]
                      : ["discussion-action"]
                  }
                />
              </Dropdown>
            </span>
          </h2>
        }
      >
        <DiscussionCurrentThreadElement
          isOpMessage
          avatar={<div className="avatar avatar--category-1">{avatar}</div>}
          hidden={false}
        >
          <DiscussionThreadHeader
            aside={
              <span style={{ display: "flex", alignItems: "center" }}>
                <span>
                  {localize.date(this.props.discussion.current.created)}
                </span>
              </span>
            }
          >
            <span className="application-list__item-header-main-content application-list__item-header-main-content--discussion-message-creator">
              {getName(
                userCreator,
                this.props.status.permissions.FORUM_SHOW_FULL_NAMES
              )}
            </span>
          </DiscussionThreadHeader>

          {this.state.openReplyType && this.state.openReplyType === "modify" ? (
            <ModifyThreadDrawer
              thread={this.props.discussion.current}
              onClickCancel={this.handleOnCancelClick}
            />
          ) : (
            <>
              <DiscussionThreadBody
                html={this.props.discussion.current.message}
              >
                {!moment(this.props.discussion.current.created).isSame(
                  this.props.discussion.current.lastModified
                ) ? (
                  <div className="application-list__item-edited">
                    {this.props.i18n.t(
                      "labels.edited",

                      {
                        context: "in",
                        ns: "messaging",
                        time: localize.date(
                          this.props.discussion.current.lastModified
                        ),
                      }
                    )}
                  </div>
                ) : null}
              </DiscussionThreadBody>
              {userCreator !== null ? (
                <DiscussionThreadFooter hasActions>
                  {!threadLocked || threadOwner ? (
                    <Link
                      className="link link--application-list"
                      onClick={this.handleOnReplyClick("answer")}
                    >
                      {this.props.i18n.t("actions.reply", { ns: "messaging" })}
                    </Link>
                  ) : null}
                  {!threadLocked || threadOwner ? (
                    <Link
                      className="link link--application-list"
                      onClick={this.handleOnReplyClick("quote")}
                    >
                      {this.props.i18n.t("actions.quote")}
                    </Link>
                  ) : null}
                  {canEditThread ? (
                    <Link
                      className="link link--application-list"
                      onClick={this.handleOnReplyClick("modify")}
                    >
                      {this.props.i18n.t("actions.edit")}
                    </Link>
                  ) : null}
                  {canRemoveThread || studentCanRemoveThread ? (
                    <DeleteThreadComponent>
                      <Link className="link link--application-list">
                        {this.props.i18n.t("actions.remove")}
                      </Link>
                    </DeleteThreadComponent>
                  ) : null}
                </DiscussionThreadFooter>
              ) : null}
            </>
          )}

          {this.state.openReplyType && this.state.openReplyType === "answer" ? (
            <ReplyThreadDrawer onClickCancel={this.handleOnCancelClick} />
          ) : null}

          {this.state.openReplyType && this.state.openReplyType === "quote" ? (
            <ReplyThreadDrawer
              quote={this.props.discussion.current.message}
              quoteAuthor={getName(
                userCreator,
                this.props.status.permissions.FORUM_SHOW_FULL_NAMES
              )}
              onClickCancel={this.handleOnCancelClick}
            />
          ) : null}
        </DiscussionCurrentThreadElement>

        {this.props.discussion.currentReplies.map((reply) => {
          // user can be null in situtations where whole user is removed completely
          // from muikku. Then there is no reply.creator to use.
          const user = reply.creator;

          // By default setting remove message is false
          let canRemoveMessage = false;

          // By default setting edit message is false
          let canEditMessage = false;
          let avatar;

          if (!user) {
            // This is what it shows when the user is not ready
            // Also if reply creator is null aka deleted
            // These situtations don't allow changing user specific color, so
            // color is same for all of those cases
            avatar = <div className="avatar avatar--category-1"></div>;
          } else {
            const userCategory =
              reply.creator.id > 10
                ? (reply.creator.id % 10) + 1
                : reply.creator.id;
            canRemoveMessage =
              this.props.userId === reply.creator.id ||
              areaPermissions.removeThread;
            canEditMessage =
              this.props.userId === reply.creator.id ||
              areaPermissions.editMessages;
            avatar = (
              <Avatar
                key={reply.id}
                id={user.id}
                name={user.firstName}
                hasImage={user.hasImage}
                userCategory={userCategory}
              />
            );
          }

          // Checks if element parent has hide its siblings
          const isHiddenElement = this.state.hiddenParentsLists.includes(
            reply.parentReplyId
          );

          // Checks if element has siblings that are hidden
          const parentHasHiddenSiblings =
            this.state.hiddenParentsLists.includes(reply.id);

          return (
            <DiscussionThreadReply
              key={reply.id}
              discussionItem={reply}
              user={user}
              isStudent={student}
              avatar={avatar}
              isHidden={isHiddenElement}
              parentHasHiddenSiblings={parentHasHiddenSiblings}
              canEditMessage={canEditMessage}
              canRemoveMessage={canRemoveMessage}
              threadLocked={threadLocked}
              onHideShowSubRepliesClick={this.onHideShowSubRepliesClick}
            />
          );
        })}

        <PagerV2
          previousLabel=""
          nextLabel=""
          breakLabel="..."
          initialPage={this.props.discussion.currentPage - 1}
          forcePage={this.props.discussion.currentPage - 1}
          marginPagesDisplayed={1}
          pageCount={this.props.discussion.currentTotalPages}
          pageRangeDisplayed={2}
          onPageChange={this.handlePagerChange}
        />
      </DiscussionCurrentThreadListContainer>
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
    userId: state.status.userId,
    permissions: state.status.permissions,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      subscribeDiscussionThread,
      unsubscribeDiscussionThread,
    },
    dispatch
  );
}

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(DiscussionCurrentThread)
);
