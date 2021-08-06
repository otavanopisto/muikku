import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { i18nType } from "reducers/base/i18n";
import { StateType } from "~/reducers";
import EvaluationToolbar from "./application/toolbar";
import EvaluationList from "./application/evaluation-list/evaluations-list";
import { StatusType } from "../../../reducers/base/status";
import { EvaluationState } from "../../../reducers/main-function/evaluation/index";
import {
  SetEvaluationSelectedWorkspace,
  setSelectedWorkspaceId,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { bindActionCreators } from "redux";
import EvaluationSorters from "./application/evaluation-list/evaluation-sorters";

/**
 * EvaluationApplicationProps
 */
interface EvaluationApplicationProps {
  i18n: i18nType;
  status: StatusType;
  evaluations: EvaluationState;
  setSelectedWorkspaceId: SetEvaluationSelectedWorkspace;
}

/**
 * EvaluationApplicationState
 */
interface EvaluationApplicationState {}

/**
 * EvaluationApplication
 */
class EvaluationApplication extends React.Component<
  EvaluationApplicationProps,
  EvaluationApplicationState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: EvaluationApplicationProps) {
    super(props);
  }

  /**
   * handleWorkspaceSelectChange
   * @param e
   */
  handleWorkspaceSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.setSelectedWorkspaceId({
      workspaceId:
        e.currentTarget.value === ""
          ? undefined
          : parseInt(e.currentTarget.value),
    });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const title = (
      <h1 className="application-panel__header-title">Evaluations</h1>
    );

    /**
     * Maps options
     */
    const workspaceOptions = this.props.evaluations.evaluationWorkspaces.map(
      (wItem, i) => (
        <option key={i} value={wItem.id}>
          {wItem.name}
        </option>
      )
    );

    /**
     * Renders primary options aka select with label
     */
    const primaryOption = (
      <div className="form-element form-element--main-action">
        <label htmlFor="selectCourses" className="visually-hidden">
          {this.props.i18n.text.get("plugin.coursepicker.select.label")}
        </label>

        <select
          onChange={this.handleWorkspaceSelectChange}
          value={this.props.evaluations.selectedWorkspaceId || undefined}
          className="form-element__select form-element__select--main-action"
        >
          <option value="">Kaikki arviointipyynnöt</option>
          <optgroup label="Työtilat">{workspaceOptions}</optgroup>
        </select>
      </div>
    );

    const toolBar = <EvaluationToolbar title="" />;

    return (
      <div className="application-panel-wrapper">
        <ApplicationPanel
          modifier=""
          title={title}
          primaryOption={primaryOption}
          toolbar={toolBar}
        >
          <EvaluationSorters />
          <EvaluationList />
        </ApplicationPanel>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ setSelectedWorkspaceId }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationApplication);
