import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { i18nType } from "reducers/base/i18n";
import { StateType } from "~/reducers";
import EvaluationToolbar from "./application/toolbar";
import EvaluationList from "./application/evaluation-list/evaluations-list";
import { StatusType } from "~/reducers/base/status";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import {
  SetEvaluationSelectedWorkspace,
  setSelectedWorkspaceId,
} from "~/actions/main-function/evaluation/evaluationActions";
import { bindActionCreators } from "redux";
import EvaluationSorters from "./application/evaluation-list/evaluation-sorters";
import { WorkspaceType } from "../../../reducers/workspaces/index";
import { EvaluationWorkspace } from "../../../@types/evaluation";
import { AnyActionType } from "~/actions";

/**
 * EvaluationApplicationProps
 */
interface EvaluationApplicationProps {
  i18n: i18nType;
  status: StatusType;
  currentWorkspace: WorkspaceType;
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
   * @param props props
   */
  constructor(props: EvaluationApplicationProps) {
    super(props);
  }

  /**
   * handleWorkspaceSelectChange
   * @param e e
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
      <h1 className="application-panel__header-title">
        {this.props.i18n.text.get("plugin.evaluation.title")}
      </h1>
    );
    const currentWorkspace = this.props.currentWorkspace;

    const workspaces = [...this.props.evaluations.evaluationWorkspaces];

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
     * Maps options
     */
    const workspaceOptions = workspaces.map((wItem, i) => (
      <option key={wItem.id} value={wItem.id}>
        {`${wItem.name} ${
          wItem.nameExtension !== null && wItem.nameExtension !== ""
            ? `(${wItem.nameExtension})`
            : ""
        } `}
      </option>
    ));

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
          <option value="">
            {this.props.i18n.text.get("plugin.evaluation.allRequests")}
          </option>
          {workspaceOptions.length > 0 ? (
            <optgroup
              label={this.props.i18n.text.get("plugin.evaluation.workspaces")}
            >
              {workspaceOptions}
            </optgroup>
          ) : null}
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
          <div className="evaluation-cards-wrapper">
            <EvaluationList />
          </div>
        </ApplicationPanel>
      </div>
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
    i18n: state.i18n,
    status: state.status,
    evaluations: state.evaluations,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationApplication);
