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
import { ApplicationPanelToolbar } from "~/components/general/application-panel/application-panel";
import { ButtonPill } from "~/components/general/button";

/**
 * DiscussionToolbarProps
 */
interface DiscussionToolbarProps {
  i18n: i18nType;
  discussion: DiscussionType;
  status: StatusType;
}

/**
 * DiscussionToolbarState
 */
interface DiscussionToolbarState {}

/**
 * CommunicatorToolbar
 */
class CommunicatorToolbar extends React.Component<
  DiscussionToolbarProps,
  DiscussionToolbarState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: DiscussionToolbarProps) {
    super(props);

    this.onSelectChange = this.onSelectChange.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
  }

  /**
   * @param e
   */
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    window.location.hash = e.target.value;
  }

  /**
   * @param e
   */
  onGoBackClick(e: React.MouseEvent<HTMLAnchorElement>) {
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState) {
      const canGoBack =
        (!document.referrer ||
          document.referrer.indexOf(window.location.host) !== -1) &&
        history.length;
      if (canGoBack) {
        history.back();
      } else {
        const splitted = location.hash.split("/");
        history.replaceState("", "", splitted[0] + "/" + splitted[1]);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      const splitted = location.hash.split("/");
      location.hash = splitted[0] + "/" + splitted[1];
    }
  }

  /**
   * render
   */
  render() {
    if (this.props.discussion.current) {
      const currentArea = this.props.discussion.areas.find(
        (area) => area.id === this.props.discussion.current.forumAreaId
      );
      return (
        <div className="application-panel__toolbar">
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
        </div>
      );
    }

    return (
      <ApplicationPanelToolbar>
        {this.props.status.permissions.FORUM_CREATEENVIRONMENTFORUM ? (
          <NewArea>
            <ButtonPill icon="plus" buttonModifiers={["discussion-toolbar"]} />
          </NewArea>
        ) : null}
        {this.props.status.permissions.FORUM_UPDATEENVIRONMENTFORUM ? (
          <ModifyArea>
            <ButtonPill
              disabled={!this.props.discussion.areaId}
              icon="pencil"
              buttonModifiers={["discussion-toolbar"]}
            />
          </ModifyArea>
        ) : null}
        {this.props.status.permissions.FORUM_DELETEENVIRONMENTFORUM ? (
          <DeleteArea>
            <ButtonPill
              disabled={!this.props.discussion.areaId}
              icon="trash"
              buttonModifiers={["discussion-toolbar"]}
            />
          </DeleteArea>
        ) : null}
        <div className="form-element">
          <label htmlFor="discussionAreaSelect" className="visually-hidden">
            {this.props.i18n.text.get("plugin.wcag.areaSelect.label")}
          </label>
          <select
            id="discussionAreaSelect"
            className="form-element__select form-element__select--toolbar-selector"
            onChange={this.onSelectChange}
            value={this.props.discussion.areaId || ""}
          >
            <option value="">
              {this.props.i18n.text.get("plugin.discussion.browseareas.all")}
            </option>
            {this.props.discussion.areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
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
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorToolbar);
