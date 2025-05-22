import * as React from "react";
import { connect } from "react-redux";
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
import { WorkspaceDataType } from "../../../reducers/workspaces/index";
import { WithTranslation, withTranslation } from "react-i18next";
import {
  GroupedOption,
  OptionDefault,
} from "~/components/general/react-select/types";
import Select from "react-select";
import "~/sass/elements/react-select-override.scss";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * EvaluationApplicationProps
 */
interface EvaluationApplicationProps extends WithTranslation {
  status: StatusType;
  currentWorkspace: WorkspaceDataType;
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
   * @returns React.JSX.Element
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
      workspaces.push({ ...currentWorkspace } as WorkspaceDataType);
    }

    workspaces.sort((a, b) => a.name.trim().localeCompare(b.name.trim()));

    const evaluationRequestOption = {
      label: t("labels.evaluationRequests", { ns: "evaluation" }),
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
        }) as OptionDefault<number>
    );

    const groupedOptions: (
      | GroupedOption<OptionDefault<number>>
      | OptionDefault<string>
    )[] = [
      evaluationRequestOption,
      {
        label: t("labels.workspaces", { ns: "workspace" }),
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
          TODO: Kurssityyppien listaus valinta
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

        {selectedOptions.value === "" ? (
          <>
            <ApplicationSubPanel modifier="evaluation-cards">
              <ApplicationSubPanel.Header>
                Arviointipyynnöt
              </ApplicationSubPanel.Header>
              <ApplicationSubPanel.Body>
                <div className="evaluation-cards-wrapper">
                  <EvaluationList
                    filterByStates={["pending", "pending_fail", "pending_pass"]}
                    emptyMessage="Arviointipyyntöjä ei löytynyt"
                    emptySearchMessage="Hakuehdoilla ei löytynyt arviointipyyntöjä"
                  />
                </div>
              </ApplicationSubPanel.Body>
            </ApplicationSubPanel>

            <ApplicationSubPanel modifier="evaluation-cards">
              <ApplicationSubPanel.Header>
                Välipalautepyynnöt
              </ApplicationSubPanel.Header>
              <ApplicationSubPanel.Body>
                <div className="evaluation-cards-wrapper">
                  <EvaluationList
                    filterByStates={["interim_evaluation_request"]}
                    emptyMessage="Välipalautepyyntöjä ei löytynyt"
                    emptySearchMessage="Hakuehdoilla ei löytynyt välipalautepyyntöjä"
                  />
                </div>
              </ApplicationSubPanel.Body>
            </ApplicationSubPanel>

            <ApplicationSubPanel modifier="evaluation-cards">
              <ApplicationSubPanel.Header>
                Täydennyspyynnöt (opettajan opiskelijalle laittamat)
              </ApplicationSubPanel.Header>
              <ApplicationSubPanel.Body>
                <div className="evaluation-cards-wrapper">
                  <EvaluationList
                    filterByStates={["incomplete"]}
                    emptyMessage="Täydennyspyyntöjä ei löytynyt"
                    emptySearchMessage="Hakuehdoilla ei löytynyt täydennyspyyntöjä"
                  />
                </div>
              </ApplicationSubPanel.Body>
            </ApplicationSubPanel>
          </>
        ) : (
          <div className="evaluation-cards-wrapper">
            <EvaluationList
              emptyMessage="Kurssikohtaisia arviointitapahtumia ei löytynyt"
              emptySearchMessage="Suodattimilla ei löytynyt arviointitapahtumia"
            />
          </div>
        )}
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ setSelectedWorkspaceId }, dispatch);
}

export default withTranslation(["evaluation", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationApplication)
);
