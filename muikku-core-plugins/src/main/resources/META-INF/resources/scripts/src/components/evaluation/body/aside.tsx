import * as React from "react";
import { connect } from "react-redux";
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
import { Action, bindActionCreators, Dispatch } from "redux";
import { WorkspaceDataType } from "../../../reducers/workspaces/index";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps extends WithTranslation {
  evaluations: EvaluationState;
  setSelectedWorkspaceId: SetEvaluationSelectedWorkspace;
  currentWorkspace: WorkspaceDataType;
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
    const { t } = this.props;
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
      workspaces.push({ ...currentWorkspace } as WorkspaceDataType);
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
          {t("labels.evaluationRequests", { ns: "evaluation" })}
        </NavigationElement>
        {renderNavigationWorkspaceElements.length > 0
          ? renderNavigationWorkspaceElements
          : null}
      </>
    );

    return (
      <NavigationMenu>
        <NavigationTopic name={t("labels.limitations", { ns: "evaluation" })}>
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
    currentWorkspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ setSelectedWorkspaceId }, dispatch);
}

export default withTranslation(["evaluation", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
