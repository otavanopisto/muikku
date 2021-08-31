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
import { i18nType } from "~/reducers/base/i18n";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps {
  evaluations: EvaluationState;
  setSelectedWorkspaceId: SetEvaluationSelectedWorkspace;
  i18n: i18nType;
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
   * @param props
   */
  constructor(props: NavigationAsideProps) {
    super(props);
  }

  /**
   * handleNavigationWorkspaceClick
   * @param workspaceId
   */
  handleNavigationWorkspaceClick =
    (workspaceId?: number) => (e: React.MouseEvent) => {
      this.props.setSelectedWorkspaceId({ workspaceId });
    };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * Mapped workspaces as NavigationElement
     */
    const renderNavigationWorkspaceElements =
      this.props.evaluations.evaluationWorkspaces
        .sort((a, b) => a.name.trim().localeCompare(b.name.trim()))
        .map((wItem, i) => (
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
          {this.props.i18n.text.get("plugin.evaluation.allRequests")}
        </NavigationElement>
        {renderNavigationWorkspaceElements}
      </>
    );

    return (
      <NavigationMenu>
        <NavigationTopic name={this.props.i18n.text.get("plugin.evaluation.filter.viewSelection")}>
          {renderAllNavigationElements}
        </NavigationTopic>
      </NavigationMenu>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    evaluations: state.evaluations,
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ setSelectedWorkspaceId }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationAside);
