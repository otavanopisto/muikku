import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/message.scss";
import BodyScrollLoader from "~/components/general/body-scroll-loader";
import Course from "./courses/course";
import { StateType } from "~/reducers";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import {
  loadMoreWorkspacesFromServer,
  LoadMoreWorkspacesFromServerTriggerType,
} from "~/actions/workspaces";
import { WorkspacesStateType, WorkspaceDataType } from "~/reducers/workspaces";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * CoursepickerWorkspacesProps
 */
interface CoursepickerWorkspacesProps extends WithTranslation<["common"]> {
  workspacesState: WorkspacesStateType;
  workspacesHasMore: boolean;
  loadMoreWorkspacesFromServer: LoadMoreWorkspacesFromServerTriggerType;
  workspaces: WorkspaceDataType[];
}

/**
 * CoursepickerWorkspacesState
 */
interface CoursepickerWorkspacesState {}

/**
 * CoursepickerWorkspaces
 */
class CoursepickerWorkspaces extends BodyScrollLoader<
  CoursepickerWorkspacesProps,
  CoursepickerWorkspacesState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CoursepickerWorkspacesProps) {
    super(props);

    //once this is in state READY only then a loading more event can be triggered
    this.statePropertyLocation = "workspacesState";
    //it will only call the function if this is true
    this.hasMorePropertyLocation = "workspacesHasMore";
    //this is the function that will be called
    this.loadMoreTriggerFunctionLocation = "loadMoreWorkspacesFromServer";
  }

  /**
   * render
   */
  render() {
    if (this.props.workspacesState === "LOADING") {
      return null;
    } else if (this.props.workspacesState === "ERROR") {
      //TODO ERRORMSG: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return (
        <div className="empty">
          <span>{"ERROR"}</span>
        </div>
      );
    } else if (this.props.workspaces.length === 0) {
      return (
        <div className="empty">
          <span>
            {this.props.t("content.notFound", { context: "workspaces" })}
          </span>
        </div>
      );
    }

    return (
      <ApplicationList>
        {this.props.workspaces.map((workspace: WorkspaceDataType) => (
          <Course key={workspace.id} workspace={workspace} />
        ))}
        {this.props.workspacesState === "LOADING_MORE" ? (
          <ApplicationListItem className="loader-empty" />
        ) : null}
      </ApplicationList>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspacesState: state.workspaces.state,
    workspacesHasMore: state.workspaces.hasMore,
    workspaces: state.workspaces.availableWorkspaces,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ loadMoreWorkspacesFromServer }, dispatch);
}

export default withTranslation(["workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(CoursepickerWorkspaces)
);
