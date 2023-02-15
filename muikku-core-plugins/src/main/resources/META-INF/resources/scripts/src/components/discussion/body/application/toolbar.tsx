import * as React from "react";
import { connect, Dispatch } from "react-redux";

import "~/sass/elements/link.scss";
import "~/sass/elements/breadcrumb.scss";
import "~/sass/elements/application-panel.scss";

import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wcag.scss";

import { i18nType } from "~/reducers/base/i18n";
import { DiscussionType } from "~/reducers/discussion";
import NewArea from "../../dialogs/new-area";
import ModifyArea from "../../dialogs/modify-area";
import DeleteArea from "../../dialogs/delete-area";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
} from "~/components/general/application-panel/application-panel";
import { ButtonPill } from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import { IconButton } from "../../../general/button";
import {
  SubscribeDiscussionArea,
  subscribeDiscussionArea,
  UnsubscribeDiscustionArea,
  unsubscribeDiscussionArea,
} from "../../../../actions/discussion/index";
import {
  ShowOnlySubscribedThreads,
  showOnlySubscribedThreads,
} from "~/actions/discussion/index";

/**
 * DiscussionToolbarProps
 */
interface DiscussionToolbarProps {
  i18n: i18nType;
  discussion: DiscussionType;
  status: StatusType;
  showOnlySubscribedThreads: ShowOnlySubscribedThreads;
  subscribeDiscussionArea: SubscribeDiscussionArea;
  unsubscribeDiscussionArea: UnsubscribeDiscustionArea;
}

/**
 * DiscussionToolbarState
 */
interface DiscussionToolbarState {}

/**
 * CommunicatorToolbar
 */
class DiscussionToolbar extends React.Component<
  DiscussionToolbarProps,
  DiscussionToolbarState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DiscussionToolbarProps) {
    super(props);

    this.onSelectChange = this.onSelectChange.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
  }

  /**
   * toggleAreaSubscribeClick
   * @param e e
   */
  toggleAreaSubscribeClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const subscribed =
      this.props.discussion.areaId &&
      this.props.discussion.subscribedAreas.find(
        (sArea) => sArea.areaId === this.props.discussion.areaId
      ) !== undefined;

    subscribed
      ? this.props.unsubscribeDiscussionArea({
          areaId: this.props.discussion.areaId,
        })
      : this.props.subscribeDiscussionArea({
          areaId: this.props.discussion.areaId,
        });
  };

  /**
   * onSelectChange
   * @param e e
   */
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    window.location.hash = e.target.value;
  }

  /**
   * onGoBackClick
   * @param e e
   */
  onGoBackClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const hash = window.location.hash.replace("#", "").split("/");
    if (hash.includes("subs")) {
      location.hash = "subs";
    } else {
      location.hash = hash[0] + "/" + hash[1];
    }
  }

  /**
   * selectValue
   */
  selectValue = () => {
    const location = window.location.hash.replace("#", "").split("/");

    if (location.includes("subs")) {
      return "subs";
    } else if (this.props.discussion.areaId) {
      return this.props.discussion.areaId;
    } else {
      return "";
    }
  };

  /**
   * render
   */
  render() {
    if (this.props.discussion.current) {
      const currentArea = this.props.discussion.areas.find(
        (area) => area.id === this.props.discussion.current.forumAreaId
      );
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <ButtonPill
              buttonModifiers="go-back"
              onClick={this.onGoBackClick}
              icon="back"
            />
            <div className="breadcrumb">
              <div
                className={`breadcrumb__item breadcrumb__item--area-${currentArea.id}`}
              >
                {currentArea.name}
              </div>
              <div className="breadcrumb__arrow">
                <span className="icon-arrow-right"></span>
              </div>
              <div className="breadcrumb__item">
                {this.props.discussion.current.title}
              </div>
            </div>
          </ApplicationPanelToolbarActionsMain>
        </ApplicationPanelToolbar>
      );
    }

    const areaIsSubscribed =
      this.props.discussion.subscribedAreas.findIndex(
        (sArea) => sArea.areaId === this.props.discussion.areaId
      ) !== -1;

    return (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
          {this.props.status.permissions.FORUM_CREATEENVIRONMENTFORUM ? (
            <NewArea>
              <ButtonPill
                disabled={this.props.discussion.subscribedThreadOnly}
                icon="plus"
                buttonModifiers={["discussion-toolbar"]}
              />
            </NewArea>
          ) : null}

          {this.props.status.permissions.FORUM_UPDATEENVIRONMENTFORUM ? (
            <ModifyArea>
              <ButtonPill
                disabled={
                  !this.props.discussion.areaId ||
                  this.props.discussion.subscribedThreadOnly
                }
                icon="pencil"
                buttonModifiers={["discussion-toolbar"]}
              />
            </ModifyArea>
          ) : null}

          {this.props.status.permissions.FORUM_DELETEENVIRONMENTFORUM ? (
            <DeleteArea>
              <ButtonPill
                disabled={
                  !this.props.discussion.areaId ||
                  this.props.discussion.subscribedThreadOnly
                }
                icon="trash"
                buttonModifiers={["discussion-toolbar"]}
              />
            </DeleteArea>
          ) : null}

          <ButtonPill
            disabled={!this.props.discussion.areaId}
            onClick={this.toggleAreaSubscribeClick}
            icon={areaIsSubscribed ? "bookmark-full" : "bookmark-empty"}
            buttonModifiers={["discussion-toolbar"]}
          />

          <div className="form-element">
            <label htmlFor="discussionAreaSelect" className="visually-hidden">
              {this.props.i18n.text.get("plugin.wcag.areaSelect.label")}
            </label>
            <select
              id="discussionAreaSelect"
              className="form-element__select form-element__select--toolbar-selector"
              onChange={this.onSelectChange}
              value={this.selectValue()}
            >
              <option value="">
                {this.props.i18n.text.get("plugin.discussion.browseareas.all")}
              </option>
              <option value="subs">
                {this.props.i18n.text.get(
                  "plugin.discussion.browseareas.subscribtions"
                )}
              </option>
              {this.props.discussion.areas.map((area) => {
                const subscribed =
                  this.props.discussion.subscribedAreas.findIndex(
                    (sArea) => sArea.areaId === area.id
                  ) !== -1;

                return (
                  <option key={area.id} value={area.id}>
                    {area.name}{" "}
                    {subscribed &&
                      `(${this.props.i18n.text.get(
                        "plugin.discussion.subscribed.area.label"
                      )})`}
                  </option>
                );
              })}
            </select>
          </div>
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
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
      showOnlySubscribedThreads,
      subscribeDiscussionArea,
      unsubscribeDiscussionArea,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionToolbar);
