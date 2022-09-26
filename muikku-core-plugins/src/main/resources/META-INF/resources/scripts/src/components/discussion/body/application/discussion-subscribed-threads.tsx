import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { getName } from "~/util/modifiers";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/discussion.scss";
import "~/sass/elements/avatar.scss";
import "~/sass/elements/label.scss";
import {
  DiscussionType,
  DiscussionThreadType,
  DiscussionUserType,
  DiscussionSubscribedThread,
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
import Dropdown from "~/components/general/dropdown";
import { StatusType } from "~/reducers/base/status";
import Avatar from "~/components/general/avatar";
import { AnyActionType } from "~/actions/index";
import { IconButton } from "~/components/general/button";
import { bindActionCreators } from "redux";
import {
  subscribeDiscussionThread,
  unsubscribeDiscussionThread,
  SubscribeDiscussionThread,
  UnsubscribeDiscustionThread,
} from "~/actions/discussion/index";
import { WorkspacesType } from "~/reducers/workspaces";

/**
 * DiscussionThreadsProps
 */
interface DiscussionSubscribedThreadsProps {
  discussion: DiscussionType;
  i18n: i18nType;
  status: StatusType;
  workspaces: WorkspacesType;
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
   * @param subscribedThread subscribedThread
   */
  getToThread(subscribedThread: DiscussionSubscribedThread) {
    const thread = subscribedThread.thread;
    const relatedToWorkspace = !!subscribedThread.workspaceId;

    const activeWorkspace = !!this.props.workspaces.currentWorkspace;
    const inThatWorkspace =
      !!this.props.workspaces.currentWorkspace &&
      subscribedThread.workspaceId ===
        this.props.workspaces.currentWorkspace.id;

    // There is three different cases how subscribed current fetching can happen
    // FIRST: subscribed thread is related to workspace and we are not in that workspace...
    // so we create url by hand and open it to new tab with focus on that tab (To specific workspace)
    if (relatedToWorkspace && !inThatWorkspace) {
      const hashString = `${thread.forumAreaId}/1/${thread.id}/1`;

      const url = `https://${window.location.hostname}/workspace/${subscribedThread.workspaceUrlName}/discussions#${hashString}`;
      this.open(url);
    }
    // SECOND: subscribed thread is not related to any workspace, but we are in some workspace...
    // same procedure, create url and open it to new tab with focus on that tab. (To enviromental level)
    else if (!relatedToWorkspace && activeWorkspace) {
      const hashString = `${thread.forumAreaId}/1/${thread.id}/1`;

      const url = `https://${window.location.hostname}/discussion#${hashString}`;
      this.open(url);
    }
    // THIRD: thread is related to workspace and we are in that workspace OR...
    // thread is not related to any workspace and we are not in any workspace...
    // Follow normal procedure and mutate location hash value by latter conditions (Normal procedure)
    else if (
      (relatedToWorkspace && inThatWorkspace) ||
      (!relatedToWorkspace && !inThatWorkspace)
    ) {
      // Opened area is where thread belongs to
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
  }

  /**
   * open
   * @param url url
   */
  open = (url: string) => {
    const win = window.open(url, "_blank");
    if (win != null) {
      win.focus();
    }
  };

  /**
   * filterThreads
   * @returns Filtered subscribed threads list
   */
  filterThreads = () => ({
    enviromentalLevelThreads: this.props.discussion.subscribedThreads.filter(
      (sThread) =>
        sThread.workspaceId === undefined || sThread.workspaceId === null
    ),
    workspaceLevelThreads: this.props.discussion.subscribedThreads.filter(
      (sThread) => sThread.workspaceId
    ),
  });

  /**
   * sortWorkspaceLevelThreads
   * @param threads threads
   */
  sortWorkspaceLevelThreads = (threads: DiscussionSubscribedThread[]) => {
    if (threads.length < 2) {
      return threads;
    }
    // List we will return one all sortings has been done
    let sortedThreads: DiscussionSubscribedThread[] = [];

    // First sort all by workspaceId so latter sortings are easier to do
    const updatedThreads = threads.sort(
      (a, b) => a.workspaceId - b.workspaceId
    );

    // Helper object to include subscribed items by workspace id
    const helperWorkspaceThreadObject: {
      [id: number]: DiscussionSubscribedThread[];
    } = {};

    // initialize helper object with empty array for every workspace id list
    for (let i = 0; i < updatedThreads.length; i++) {
      const element = updatedThreads[i];
      helperWorkspaceThreadObject[element.workspaceId] = [];
    }

    // Push every item to corresponding list
    for (let i = 0; i < updatedThreads.length; i++) {
      const element = updatedThreads[i];
      helperWorkspaceThreadObject[element.workspaceId].push(element);
    }

    // Go through that object and sort every item list by areaId and push
    // that list to sorted threads list once done
    for (const property in helperWorkspaceThreadObject) {
      const itemsByWorkspace = helperWorkspaceThreadObject[property].sort(
        (a, b) => a.thread.forumAreaId - b.thread.forumAreaId
      );

      sortedThreads = sortedThreads.concat(itemsByWorkspace);
    }

    return sortedThreads;
  };

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

    const { enviromentalLevelThreads, workspaceLevelThreads } =
      this.filterThreads();

    const enviromentalLevelThreadsItems = enviromentalLevelThreads.map(
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
            onClick={this.getToThread.bind(this, sThreads)}
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

              <Dropdown
                openByHover
                modifier="discussion-tooltip"
                content={this.props.i18n.text.get(
                  "plugin.discussion.unsubscribe.thread"
                )}
              >
                <IconButton
                  icon="bookmark-full"
                  onClick={this.handleSubscribeOrUnsubscribeClick(
                    subscribredThread,
                    true
                  )}
                  buttonModifiers={["discussion-subscription active"]}
                />
              </Dropdown>
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
                <span className="application-list__item-footer-meta">
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

    const workspaceLevelThreadsItems = this.sortWorkspaceLevelThreads(
      workspaceLevelThreads
    ).map((sThreads) => {
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
          onClick={this.getToThread.bind(this, sThreads)}
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

            <Dropdown
              openByHover
              modifier="discussion-tooltip"
              content={this.props.i18n.text.get(
                "plugin.discussion.unsubscribe.thread"
              )}
            >
              <IconButton
                icon="bookmark-full"
                onClick={this.handleSubscribeOrUnsubscribeClick(
                  subscribredThread,
                  true
                )}
                buttonModifiers={["discussion-subscription active"]}
              />
            </Dropdown>
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
              <span className="application-list__item-footer-meta">
                {user &&
                  getName(
                    user,
                    this.props.status.permissions.FORUM_SHOW_FULL_NAMES
                  )}
                , {this.props.i18n.time.format(subscribredThread.created)}
              </span>
              {sThreads.workspaceName && (
                <span className="label">
                  <span className="label__icon label__icon--workspace icon-books"></span>
                  <span className="label__text label__text--workspace"></span>
                  {sThreads.workspaceName}
                </span>
              )}
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
    });

    return (
      <BodyScrollKeeper hidden={!!this.props.discussion.current}>
        <DiscussionThreadsListHeader>
          {this.props.i18n.text.get(
            "plugin.discussion.browseareas.subscribtions.environment.title"
          )}
        </DiscussionThreadsListHeader>
        <DiscussionThreads>
          {enviromentalLevelThreadsItems.length > 0 ? (
            enviromentalLevelThreadsItems
          ) : (
            <div className="empty">
              <span>
                {this.props.i18n.text.get(
                  "plugin.discussion.browseareas.subscribtions.empty.title"
                )}
              </span>
            </div>
          )}
        </DiscussionThreads>
        <DiscussionThreadsListHeader>
          {this.props.i18n.text.get(
            "plugin.discussion.browseareas.subscribtions.workspace.title"
          )}
        </DiscussionThreadsListHeader>
        <DiscussionThreads>
          {workspaceLevelThreadsItems.length > 0 ? (
            workspaceLevelThreadsItems
          ) : (
            <div className="empty">
              <span>
                {this.props.i18n.text.get(
                  "plugin.discussion.browseareas.subscribtions.empty.title"
                )}
              </span>
            </div>
          )}
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
    i18n: state.i18n,
    discussion: state.discussion,
    status: state.status,
    workspaces: state.workspaces,
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
