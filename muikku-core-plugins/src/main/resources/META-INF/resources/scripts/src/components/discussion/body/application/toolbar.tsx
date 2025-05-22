import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/link.scss";
import "~/sass/elements/breadcrumb.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wcag.scss";
import "~/sass/elements/react-select-override.scss";
import { DiscussionState } from "~/reducers/discussion";
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
import { Action, bindActionCreators, Dispatch } from "redux";
import Select from "react-select";
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
import { WithTranslation, withTranslation } from "react-i18next";
import { OptionWithExtraContent } from "~/components/general/react-select/types";
import { OptionWithDescription } from "~/components/general/react-select/option";
import { AppDispatch } from "~/reducers/configureStore";

type DiscussionAreaOptionWithExtraContent = OptionWithExtraContent<
  string | number
>;

/**
 * DiscussionToolbarProps
 */
interface DiscussionToolbarProps extends WithTranslation {
  discussion: DiscussionState;
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
   * handleSelectChange
   * @param selectedOptions selectedOptions
   */
  handleSelectChange = (
    selectedOptions: DiscussionAreaOptionWithExtraContent
  ) => {
    window.location.hash = selectedOptions.value as string;
  };

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

    const otherOptions: DiscussionAreaOptionWithExtraContent[] =
      this.props.discussion.areas.map((area) => {
        const subscribed =
          this.props.discussion.subscribedAreas.findIndex(
            (sArea) => sArea.areaId === area.id
          ) !== -1;

        let label = area.name;

        if (subscribed) {
          label = `${area.name} (${this.props.i18n.t("labels.subscribed", {
            ns: "messaging",
          })})`;
        }

        return {
          value: area.id,
          label,
          extraContent: area.description,
        } as DiscussionAreaOptionWithExtraContent;
      });

    const options: DiscussionAreaOptionWithExtraContent[] = [
      {
        value: "",
        label: this.props.i18n.t("labels.allDiscussionAreas", {
          ns: "messaging",
        }),
      },
      {
        value: "subs",
        label: this.props.i18n.t("labels.subscriptions"),
      },
      ...otherOptions,
    ];

    const currentSelectValue = options.find(
      (option) => option.value === this.selectValue()
    );

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
              {this.props.i18n.t("wcag.selectArea", { ns: "messaging" })}
            </label>
            <Select<DiscussionAreaOptionWithExtraContent>
              className="react-select-override"
              classNamePrefix="react-select-override"
              onChange={this.handleSelectChange}
              value={currentSelectValue}
              options={options}
              components={{ Option: OptionWithDescription }}
              isSearchable={false}
            />
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
    discussion: state.discussion,
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
      showOnlySubscribedThreads,
      subscribeDiscussionArea,
      unsubscribeDiscussionArea,
    },
    dispatch
  );
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(DiscussionToolbar)
);
