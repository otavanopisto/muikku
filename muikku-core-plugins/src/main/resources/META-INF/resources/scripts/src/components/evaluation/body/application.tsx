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
import {
  GroupedOption,
  OptionDefault,
} from "~/components/general/react-select/types";
import Select from "react-select";
import "~/sass/elements/react-select-override.scss";

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
  handleWorkspaceSelectChange = (
    e: OptionDefault<number> | OptionDefault<string>
  ) => {
    if (typeof e.value === "string" && e.value === "") {
      this.props.setSelectedWorkspaceId({
        workspaceId: undefined,
      });
    } else if (typeof e.value === "number") {
      this.props.setSelectedWorkspaceId({
        workspaceId: e.value,
      });
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const title = this.props.i18n.text.get("plugin.evaluation.title");
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

    const evaluationRequestOption = {
      label: this.props.i18n.text.get("plugin.evaluation.allRequests"),
      value: "",
    };

    /**
     * Maps options
     */
    const workspaceOptions = workspaces.map(
      (wItem, i) =>
        ({
          label: wItem.nameExtension
            ? `${wItem.name} (${wItem.nameExtension})`
            : wItem.name,
          value: wItem.id,
        } as OptionDefault<number>)
    );

    const groupedOptions: (
      | GroupedOption<OptionDefault<number>>
      | OptionDefault<string>
    )[] = [
      evaluationRequestOption,
      {
        label: this.props.i18n.text.get("plugin.evaluation.workspaces"),
        options: workspaceOptions,
      },
    ];

    const selectedOptions = [evaluationRequestOption, ...workspaceOptions].find(
      (option) =>
        (typeof option.value === "string" &&
          this.props.evaluations.selectedWorkspaceId === undefined &&
          option.value === "") ||
        (typeof option.value === "number" &&
          this.props.evaluations.selectedWorkspaceId === option.value)
    );

    /**
     * Renders primary options aka select with label
     */
    const primaryOption = (
      <div className="form-element form-element--main-action">
        <label htmlFor="selectCourses" className="visually-hidden">
          {this.props.i18n.text.get("plugin.coursepicker.select.label")}
        </label>

        <Select<OptionDefault<number> | OptionDefault<string>>
          onChange={this.handleWorkspaceSelectChange}
          className="react-select-override"
          classNamePrefix="react-select-override"
          value={selectedOptions}
          options={groupedOptions}
          styles={{
            // eslint-disable-next-line jsdoc/require-jsdoc
            container: (baseStyles, state) => ({
              ...baseStyles,
              width: "100%",
            }),
          }}
        />
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
