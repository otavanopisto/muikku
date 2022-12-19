import * as React from "react";
import { connect, Dispatch } from "react-redux";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import NavigationMenu, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import {
  SetEvaluationSelectedWorkspace,
  setSelectedWorkspaceId,
} from "~/actions/main-function/evaluation/evaluationActions";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { WorkspaceType } from "../../../reducers/workspaces/index";
import { EvaluationWorkspace } from "~/@types/evaluation";
import { AnyActionType } from "~/actions";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps {
  evaluations: EvaluationState;
  setSelectedWorkspaceId: SetEvaluationSelectedWorkspace;
  i18nOLD: i18nType;
  currentWorkspace: WorkspaceType;
}

/**
 * NavigationAsideState
 */
interface NavigationAsideState {}

/**
 * NavigationAside component
 */
class NavigationAside extends React.Component<
  NavigationAsideProps,
  NavigationAsideState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NavigationAsideProps) {
    super(props);
  }

  /**
   * handleNavigationWorkspaceClick
   * @param workspaceId workspaceId
   * @returns void
   */
  handleNavigationWorkspaceClick = (workspaceId?: number) => () => {
    this.props.setSelectedWorkspaceId({ workspaceId });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const workspaces = [...this.props.evaluations.evaluationWorkspaces];
    const currentWorkspace = this.props.currentWorkspace;

    /**
     * This is because, when admin goes to workspace where he/she is not
     * workspace teacher, the select list will be missing that current active workspace.
     * So here we check if its not in the list and push currentWorkspace as temporary option
     */
    if (
      currentWorkspace &&
      this.props.evaluations.evaluationWorkspaces
        .map((eWorkspace) => eWorkspace.id)
        .indexOf(currentWorkspace.id) === -1
    ) {
      workspaces.push({ ...currentWorkspace } as EvaluationWorkspace);
    }

    workspaces.sort((a, b) => a.name.trim().localeCompare(b.name.trim()));

    /**
     * Mapped workspaces as NavigationElement
     */
    const renderNavigationWorkspaceElements = workspaces.map((wItem) => (
      <NavigationElement
        modifiers="aside-navigation"
        key={wItem.id}
        onClick={this.handleNavigationWorkspaceClick(wItem.id)}
        isActive={wItem.id === this.props.evaluations.selectedWorkspaceId}
      >
        {`${wItem.name} ${
          wItem.nameExtension !== null && wItem.nameExtension !== ""
            ? `(${wItem.nameExtension})`
            : ""
        } `}
      </NavigationElement>
    ));

    /**
     * All Navigation elements, including choice for all evaluation request
     */
    const renderAllNavigationElements = (
      <>
        <NavigationElement
          modifiers="aside-navigation"
          key="all"
          onClick={this.handleNavigationWorkspaceClick(undefined)}
          isActive={this.props.evaluations.selectedWorkspaceId === undefined}
        >
          {this.props.i18nOLD.text.get("plugin.evaluation.allRequests")}
        </NavigationElement>
        {renderNavigationWorkspaceElements.length > 0
          ? renderNavigationWorkspaceElements
          : null}
      </>
    );

    return (
      <NavigationMenu>
        <NavigationTopic
          name={this.props.i18nOLD.text.get(
            "plugin.evaluation.filter.viewSelection"
          )}
        >
          {renderAllNavigationElements}
        </NavigationTopic>
      </NavigationMenu>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    evaluations: state.evaluations,
    i18nOLD: state.i18nOLD,
    currentWorkspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ setSelectedWorkspaceId }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationAside);
