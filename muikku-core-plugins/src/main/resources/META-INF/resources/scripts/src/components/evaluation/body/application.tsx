import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
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
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * EvaluationApplicationProps
 */
interface EvaluationApplicationProps extends WithTranslation {
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
    const { t } = this.props;

    const title = t("labels.evaluation", { ns: "evaluation" });
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
          TODO: Kurssityyppien listaus valinta
        </label>

        <select
          onChange={this.handleWorkspaceSelectChange}
          value={this.props.evaluations.selectedWorkspaceId || undefined}
          className="form-element__select form-element__select--main-action"
        >
          <option value="">
            {t("labels.evaluationRequest", { ns: "evaluation", count: 0 })}
          </option>
          {workspaceOptions.length > 0 ? (
            <optgroup label={t("labels.courses", { ns: "workspace" })}>
              {workspaceOptions}
            </optgroup>
          ) : null}
        </select>
      </div>
    );

    const toolBar = <EvaluationToolbar title="" />;

    return (
      <ApplicationPanel
        title={title}
        primaryOption={primaryOption}
        toolbar={toolBar}
      >
        <EvaluationSorters />
        <div className="evaluation-cards-wrapper">
          <EvaluationList />
        </div>
      </ApplicationPanel>
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

export default withTranslation(["evaluation", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationApplication)
);
