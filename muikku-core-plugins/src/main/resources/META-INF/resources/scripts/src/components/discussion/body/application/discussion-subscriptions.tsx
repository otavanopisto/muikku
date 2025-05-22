import * as React from "react";
import { connect } from "react-redux";
import { getName } from "~/util/modifiers";
import { localize } from "~/locales/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/discussion.scss";
import "~/sass/elements/avatar.scss";
import "~/sass/elements/label.scss";
import { DiscussionState } from "~/reducers/discussion";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import { StateType } from "~/reducers";
import OverflowDetector from "~/components/general/overflow-detector";
import {
  DiscussionThreads,
  DiscussionThread as DiscussionThreadComponent,
  DiscussionThreadHeader,
  DiscussionThreadBody,
  DiscussionThreadFooter,
  DiscussionThreadsListHeader,
} from "./threads/threads";
import Dropdown from "~/components/general/dropdown";
import { StatusType } from "~/reducers/base/status";
import Avatar from "~/components/general/avatar";
import { IconButton } from "~/components/general/button";
import { bindActionCreators } from "redux";
import {
  subscribeDiscussionThread,
  unsubscribeDiscussionThread,
  SubscribeDiscussionThread,
  UnsubscribeDiscustionThread,
  SubscribeDiscussionArea,
  subscribeDiscussionArea,
  UnsubscribeDiscustionArea,
  unsubscribeDiscussionArea,
} from "~/actions/discussion/index";
import { WorkspacesState } from "~/reducers/workspaces";
import { DiscussionArea as DiscussionAreaComponent } from "./threads/area";
import {
  ApplicationListItemBody,
  ApplicationListItemFooter,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import {
  DiscussionSubscribedArea,
  DiscussionSubscribedThread,
  DiscussionThread,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DiscussionSubscribedThreadsProps
 */
interface DiscussionSubscriptionsProps extends WithTranslation {
  discussion: DiscussionState;
  status: StatusType;
  workspaces: WorkspacesState;
  /**
   * Redux action method to subscribe discussion thread
   */
  subscribeDiscussionThread: SubscribeDiscussionThread;
  /**
   * Redux action method to unsubscribe discussion thread
   */
  unsubscribeDiscussionThread: UnsubscribeDiscustionThread;
  /**
   * Redux action method to subscribe discussion area
   */
  subscribeDiscussionArea: SubscribeDiscussionArea;
  /**
   * Redux action method to unsubscribe discussion area
   */
  unsubscribeDiscussionArea: UnsubscribeDiscustionArea;
}

/**
 * DiscussionSubscribedThreadsState
 */
interface DiscussionSubscriptionsState {
  filters: string[];
}

/**
 * DiscussionSubscribedThreads
 */
class DiscussionSubscriptions extends React.Component<
  DiscussionSubscriptionsProps,
  DiscussionSubscriptionsState
> {
  /**
   * Constructor method
   * @param props props
   */
  constructor(props: DiscussionSubscriptionsProps) {
    super(props);

    this.getToArea = this.getToArea.bind(this);
    this.getToThread = this.getToThread.bind(this);

    this.state = {
      filters: ["AREAS", "THREADS"],
    };
  }

  /**
   * Handles subscribe or unsubscribe thread click
   *
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
   * Handles subscribe or unsubscribe thread key down
   *
   * @param thread thread
   * @param isSubscribed isSubscribed
   */
  handleSubscribeOrUnsubscribeKeyDown =
    (thread: DiscussionThread, isSubscribed: boolean) =>
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
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
      }
    };

  /**
   * Handles subscribe or unsubscribe area click
   *
   * @param area area
   * @param isSubscribed isSubscribed
   */
  handleSubscribeOrUnsubscribeAreaClick =
    (area: DiscussionSubscribedArea, isSubscribed: boolean) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      if (isSubscribed) {
        this.props.unsubscribeDiscussionArea({
          areaId: area.area.id,
        });
      } else {
        this.props.subscribeDiscussionArea({
          areaId: area.area.id,
        });
      }
    };

  /**
   * Handles subscribe or unsubscribe area key down
   * @param area area
   * @param isSubscribed isSubscribed
   */
  handleSubscribeOrUnsubscribeAreaKeyDown =
    (area: DiscussionSubscribedArea, isSubscribed: boolean) =>
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        e.preventDefault();
        if (isSubscribed) {
          this.props.unsubscribeDiscussionArea({
            areaId: area.area.id,
          });
        } else {
          this.props.subscribeDiscussionArea({
            areaId: area.area.id,
          });
        }
      }
    };

  /**
   * Handle toggle filter changes
   *
   * @param e e
   */
  handleToggleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filter = e.target.value;
    const filters = [...this.state.filters];

    if (filters.includes(filter)) {
      filters.splice(filters.indexOf(filter), 1);
    } else {
      filters.push(filter);
    }

    this.setState({
      filters,
    });
  };

  /**
   * Creates area url and opens it to new tab with focus on that tab
   * or if url is same as current url, just changes hash value
   *
   * @param subscribedArea subscribedArea
   */
  getToArea(subscribedArea: DiscussionSubscribedArea) {
    const area = subscribedArea.area;
    const relatedToWorkspace = !!subscribedArea.workspaceId;

    const activeWorkspace = !!this.props.workspaces.currentWorkspace;
    const inThatWorkspace =
      !!this.props.workspaces.currentWorkspace &&
      subscribedArea.workspaceId === this.props.workspaces.currentWorkspace.id;

    // There is three different cases how subscribed current fetching can happen
    // FIRST: subscribed area is related to workspace and we are not in that workspace...
    // so we create url by hand and open it to new tab with focus on that tab (To specific workspace)
    if (relatedToWorkspace && !inThatWorkspace) {
      const url = `https://${window.location.hostname}/workspace/${subscribedArea.workspaceUrlName}/discussions#${area.id}`;
      this.open(url);
    }
    // SECOND: subscribed area is not related to any workspace, but we are in some workspace...
    // same procedure, create url and open it to new tab with focus on that tab. (To enviromental level)
    else if (!relatedToWorkspace && activeWorkspace) {
      const url = `https://${window.location.hostname}/discussion#${area.id}`;
      this.open(url);
    }
    // THIRD: area is related to workspace and we are in that workspace OR...
    // area is not related to any workspace and we are not in any workspace...
    // Follow normal procedure and mutate location hash value by latter conditions (Normal procedure)
    else if (
      (relatedToWorkspace && inThatWorkspace) ||
      (!relatedToWorkspace && !inThatWorkspace)
    ) {
      window.location.hash = `${area.id}`;
    }
  }

  /**
   * Creates thread url and opens it to new tab with focus on that tab
   * or if url is same as current url, just changes hash value
   *
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
      const hashString = `${thread.forumAreaId}/1/${thread.forumAreaId}/${thread.id}/1`;

      const url = `https://${window.location.hostname}/workspace/${subscribedThread.workspaceUrlName}/discussions#${hashString}`;
      this.open(url);
    }
    // SECOND: subscribed thread is not related to any workspace, but we are in some workspace...
    // same procedure, create url and open it to new tab with focus on that tab. (To enviromental level)
    else if (!relatedToWorkspace && activeWorkspace) {
      const hashString = `${thread.forumAreaId}/1/${thread.forumAreaId}/${thread.id}/1`;

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
      window.location.hash =
        "subs/" + thread.forumAreaId + "/" + thread.id + "/1";
    }
  }

  /**
   * Handles url opening to new tab with focus on that tab
   *
   * @param url url
   */
  open = (url: string) => {
    const win = window.open(url, "_blank");
    if (win != null) {
      win.focus();
    }
  };

  /**
   * Filters areas by workspace level and enviromental level
   *
   * @returns Filtered subscribed area lists
   */
  filterAreas = () => ({
    enviromentalLevelAreas: this.props.discussion.subscribedAreas.filter(
      (area) => area.workspaceId === undefined || area.workspaceId === null
    ),
    workspaceLevelAreas: this.props.discussion.subscribedAreas.filter(
      (area) => area.workspaceId
    ),
  });

  /**
   * Filters threads by workspace level and enviromental level
   *
   * @returns Filtered subscribed threads lists
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
   * Sort workspace level areas
   *
   * @param areas areas
   */
  sortWorkspaceLevelAreas = (areas: DiscussionSubscribedArea[]) => {
    if (areas.length < 2) {
      return areas;
    }
    // List we will return one all sortings has been done
    let sortedAreas: DiscussionSubscribedArea[] = [];

    // First sort all by workspaceId so latter sortings are easier to do
    const updatedAreas = areas.sort((a, b) => a.workspaceId - b.workspaceId);

    // Helper object to include subscribed items by workspace id
    const helperWorkspaceAreaObject: {
      [id: number]: DiscussionSubscribedArea[];
    } = {};

    // initialize helper object with empty array for every workspace id list
    // Push every item to corresponding list
    for (let i = 0; i < updatedAreas.length; i++) {
      const element = updatedAreas[i];

      if (!helperWorkspaceAreaObject[element.workspaceId]) {
        helperWorkspaceAreaObject[element.workspaceId] = [element];
      } else {
        helperWorkspaceAreaObject[element.workspaceId].push(element);
      }
    }

    // Get possible current workspace id
    const currentWorkspaceId = this.props.workspaces.currentWorkspace
      ? this.props.workspaces.currentWorkspace.id
      : undefined;

    let currentWorkspaceAreas: DiscussionSubscribedArea[] | undefined =
      undefined;

    // If current workspace id is found, get that list and delete it from helper object
    if (currentWorkspaceId) {
      currentWorkspaceAreas = helperWorkspaceAreaObject[currentWorkspaceId];
      delete helperWorkspaceAreaObject[currentWorkspaceId];

      if (currentWorkspaceAreas) {
        // Sort current workspace areas by areaId
        currentWorkspaceAreas = currentWorkspaceAreas.sort(
          (a, b) => a.areaId - b.areaId
        );
      }
    }

    // Go through that object and sort every item list by areaId and push
    // that list to sorted threads list once done
    for (const property in helperWorkspaceAreaObject) {
      const itemsByWorkspace = helperWorkspaceAreaObject[property].sort(
        (a, b) => a.areaId - b.areaId
      );

      sortedAreas = sortedAreas.concat(itemsByWorkspace);
    }

    // If current workspace areas is found, concat it to sorted areas list
    // as first items before other workspace areas
    return currentWorkspaceAreas
      ? [...currentWorkspaceAreas, ...sortedAreas]
      : sortedAreas;
  };

  /**
   * Sort workspace level threads
   *
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
    // Push every item to corresponding list
    for (let i = 0; i < updatedThreads.length; i++) {
      const element = updatedThreads[i];

      if (!helperWorkspaceThreadObject[element.workspaceId]) {
        helperWorkspaceThreadObject[element.workspaceId] = [element];
      } else {
        helperWorkspaceThreadObject[element.workspaceId].push(element);
      }
    }

    // Get possible current workspace id
    const currentWorkspaceId = this.props.workspaces.currentWorkspace
      ? this.props.workspaces.currentWorkspace.id
      : undefined;

    let currentWorkspaceThreads: DiscussionSubscribedThread[] | undefined =
      undefined;

    // If current workspace id is found, get that list and delete it from helper object
    if (currentWorkspaceId) {
      currentWorkspaceThreads = helperWorkspaceThreadObject[currentWorkspaceId];
      delete helperWorkspaceThreadObject[currentWorkspaceId];

      if (currentWorkspaceThreads) {
        // Sort current workspace threads by areaId
        currentWorkspaceThreads = currentWorkspaceThreads.sort(
          (a, b) => a.thread.forumAreaId - b.thread.forumAreaId
        );
      }
    }

    // Go through that object and sort every item list by areaId and push
    // that list to sorted threads list once done
    for (const property in helperWorkspaceThreadObject) {
      const itemsByWorkspace = helperWorkspaceThreadObject[property].sort(
        (a, b) => a.thread.forumAreaId - b.thread.forumAreaId
      );

      sortedThreads = sortedThreads.concat(itemsByWorkspace);
    }

    // If current workspace threads is found, concat it to sorted threads list
    // as first items before other workspace threads
    return currentWorkspaceThreads
      ? [...currentWorkspaceThreads, ...sortedThreads]
      : sortedThreads;
  };

  /**
   * Renders area item
   *
   * @param area area
   * @returns React.JSX.Element
   */
  renderAreaItem = (area: DiscussionSubscribedArea) => {
    const subscribedArea = area.area;

    const areaCategory =
      subscribedArea.id > 10 ? (subscribedArea.id % 10) + 1 : subscribedArea.id;

    return (
      <DiscussionAreaComponent
        key={subscribedArea.id}
        onClick={this.getToArea.bind(this, area)}
      >
        <ApplicationListItemHeader modifiers="discussion">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              className={`discussion-category discussion-category--category-${areaCategory}`}
            >
              <span>{subscribedArea.name}</span>
            </div>
          </div>
          <Dropdown
            openByHover
            modifier="discussion-tooltip"
            content={this.props.t("content.unsubscribe", { ns: "messaging" })}
          >
            <IconButton
              as="div"
              role="button"
              icon="bookmark-full"
              buttonModifiers={["discussion-subscription active"]}
              onClick={this.handleSubscribeOrUnsubscribeAreaClick(area, true)}
              onKeyDown={this.handleSubscribeOrUnsubscribeAreaKeyDown(
                area,
                true
              )}
            />
          </Dropdown>
        </ApplicationListItemHeader>

        {subscribedArea.description !== "" && (
          <ApplicationListItemBody>
            <div
              className="application-list__item-text-body--discussion-area-description"
              dangerouslySetInnerHTML={{
                __html: subscribedArea.description,
              }}
            />
          </ApplicationListItemBody>
        )}

        <ApplicationListItemFooter>
          <div className="application-list__item-footer-content-main">
            {area.workspaceName && (
              <span className="label">
                <span className="label__icon label__icon--workspace icon-books"></span>
                <span className="label__text label__text--workspace"></span>
                {area.workspaceName}
              </span>
            )}
          </div>
          <div className="application-list__item-footer-content-aside">
            <div className="application-list__item-counter-container">
              <span className="application-list__item-counter-title">
                {this.props.t("labels.threadCount", { ns: "messaging" })}
              </span>
              <span className="application-list__item-counter">
                {subscribedArea.numThreads}
              </span>
            </div>
          </div>
        </ApplicationListItemFooter>
      </DiscussionAreaComponent>
    );
  };

  /**
   * Renders thread item
   *
   * @param sThreads sThreads
   * @returns React.JSX.Element
   */
  renderThreadItem = (sThreads: DiscussionSubscribedThread) => {
    const subscribredThread = sThreads.thread;

    const user = subscribredThread.creator;

    const userCategory = user.id > 10 ? (user.id % 10) + 1 : user.id;
    const threadCategory =
      subscribredThread.forumAreaId > 10
        ? (subscribredThread.forumAreaId % 10) + 1
        : subscribredThread.forumAreaId;

    //This is what it shows when the user is not defined
    let avatar = <div className="avatar avatar--category-1"></div>;

    if (user) {
      //This is what it shows when the user is defined
      avatar = (
        <Avatar
          key={subscribredThread.id}
          id={user.id}
          name={user.firstName}
          hasImage={user.hasImage}
          userCategory={userCategory}
          avatarAriaLabel={this.props.t("wcag.OPUserAvatar", {
            ns: "messaging",
          })}
          avatarAriaHidden={true}
        />
      );
    }

    return (
      <DiscussionThreadComponent
        key={subscribredThread.id}
        onClick={this.getToThread.bind(this, sThreads)}
        avatar={avatar}
      >
        <DiscussionThreadHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            {subscribredThread.lock ? (
              <div className="discussion__icon icon-lock" />
            ) : null}
            {subscribredThread.sticky ? (
              <div className="discussion__icon icon-pin" />
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
            content={this.props.t("labels.unsubscribe", { ns: "messaging" })}
          >
            <IconButton
              icon="bookmark-full"
              onClick={this.handleSubscribeOrUnsubscribeClick(
                subscribredThread,
                true
              )}
              onKeyDown={this.handleSubscribeOrUnsubscribeKeyDown(
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
          <div className="application-list__item-footer-content-main application-list__item-footer-content-main--discussion-subscriptions">
            <span className="application-list__item-footer-meta">
              {user &&
                getName(
                  user,
                  this.props.status.permissions.FORUM_SHOW_FULL_NAMES
                )}
              , {localize.date(subscribredThread.created)}
            </span>

            {sThreads.workspaceName && (
              <span className="application-list__item-footer-meta application-list__item-footer-meta--discussion-subscriptions">
                <span className="label">
                  <span className="label__icon label__icon--workspace icon-books"></span>
                  <span className="label__text label__text--workspace"></span>
                  {sThreads.workspaceName}
                </span>
              </span>
            )}
          </div>
          <div className="application-list__item-footer-content-aside">
            <div className="application-list__item-counter-container">
              <span className="application-list__item-counter-title">
                {this.props.t("labels.replyCount", { ns: "messaging" })}
              </span>
              <span className="application-list__item-counter">
                {subscribredThread.numReplies}
              </span>
            </div>
            <div className="application-list__item-date">
              <span>
                {this.props.t("labels.lastMessage", {
                  ns: "messaging",
                  time: localize.date(subscribredThread.updated),
                })}
              </span>
            </div>
          </div>
        </DiscussionThreadFooter>
      </DiscussionThreadComponent>
    );
  };

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    const { discussion } = this.props;

    const amountOfItems =
      discussion.subscribedThreads.length + discussion.subscribedAreas.length;

    if (discussion.state === "LOADING") {
      return null;
    } else if (discussion.state === "ERROR") {
      return (
        <div className="empty">
          <span>{"ERROR"}</span>
        </div>
      );
    } else {
      if (
        discussion.subscribedThreadOnly &&
        amountOfItems === 0 &&
        !discussion.current
      ) {
        return (
          <div className="empty">
            <span>
              {this.props.t("content.empty", {
                ns: "evaluation",
                context: "subscriptions",
              })}
            </span>
          </div>
        );
      }
    }

    const { enviromentalLevelAreas, workspaceLevelAreas } = this.filterAreas();

    const { enviromentalLevelThreads, workspaceLevelThreads } =
      this.filterThreads();

    const showThreads = this.state.filters.includes("THREADS");
    const showAreas = this.state.filters.includes("AREAS");

    const enviromentalLevelAreaItems = showAreas
      ? enviromentalLevelAreas.map(this.renderAreaItem)
      : [];

    const enviromentalLevelThreadsItems = showThreads
      ? enviromentalLevelThreads.map(this.renderThreadItem)
      : [];

    const workspaceLevelAreaItems = showAreas
      ? this.sortWorkspaceLevelAreas(workspaceLevelAreas).map(
          this.renderAreaItem
        )
      : [];

    const workspaceLevelThreadsItems = showThreads
      ? this.sortWorkspaceLevelThreads(workspaceLevelThreads).map(
          this.renderThreadItem
        )
      : [];

    let allItems = [
      ...enviromentalLevelAreaItems,
      ...workspaceLevelAreaItems,
      ...enviromentalLevelThreadsItems,
      ...workspaceLevelThreadsItems,
    ];

    if (this.props.workspaces.currentWorkspace) {
      allItems = [
        ...workspaceLevelAreaItems,
        ...enviromentalLevelAreaItems,
        ...workspaceLevelThreadsItems,
        ...enviromentalLevelThreadsItems,
      ];
    }

    const filterItems = [
      <div key="discussion-areas-filter" className="dropdown__container-item">
        <div className="filter-item filter-item--workspace-page">
          <input
            id="discussionAreas"
            type="checkbox"
            value="AREAS"
            onChange={this.handleToggleFilterChange}
            checked={this.state.filters.includes("AREAS")}
          />
          <label htmlFor="discussionAreas" className="filter-item__label">
            Keskustelualueet
          </label>
        </div>
      </div>,
      <div key="discussion-threads-filter" className="dropdown__container-item">
        <div className="filter-item filter-item--workspace-page">
          <input
            id="discussionThreads"
            type="checkbox"
            value="THREADS"
            onChange={this.handleToggleFilterChange}
            checked={this.state.filters.includes("THREADS")}
          />
          <label htmlFor="discussionThreads" className="filter-item__label">
            Viestiketjut
          </label>
        </div>
      </div>,
    ];

    return (
      <BodyScrollKeeper hidden={!!discussion.current}>
        <DiscussionThreadsListHeader
          aside={
            <Dropdown items={filterItems}>
              <IconButton as="div" role="button" icon="filter" />
            </Dropdown>
          }
        >
          Tilatut keskustelut
        </DiscussionThreadsListHeader>
        <DiscussionThreads>
          {allItems.length > 0 ? (
            allItems
          ) : (
            <div className="empty">
              <span>
                {this.props.t("content.empty", {
                  ns: "evaluation",
                  context: "subscriptions",
                })}
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
    discussion: state.discussion,
    status: state.status,
    workspaces: state.workspaces,
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
      subscribeDiscussionArea,
      unsubscribeDiscussionArea,
    },
    dispatch
  );
}

export default withTranslation("evaluation")(
  connect(mapStateToProps, mapDispatchToProps)(DiscussionSubscriptions)
);
