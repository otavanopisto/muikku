import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "reducers/base/i18n";
import { StateType } from "~/reducers";
import "~/sass/elements/evaluation.scss";
import { ButtonPill } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { ApplicationPanelToolbar } from "~/components/general/application-panel/application-panel";
import { SearchFormElement } from "~/components/general/form-element";
import { bindActionCreators } from "redux";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import { EvaluationFilters } from "~/@types/evaluation";
import {
  SetEvaluationFilters,
  setEvaluationFilters,
} from "~/actions/main-function/evaluation/evaluationActions";
import {
  UpdateEvaluationSearch,
  updateEvaluationSearch,
} from "~/actions/main-function/evaluation/evaluationActions";

/**
 * EvaluationToolbarProps
 */
interface EvaluationToolbarProps {
  i18n: i18nType;
  title: string;
  updateEvaluationSearch: UpdateEvaluationSearch;
  evaluations: EvaluationState;
  setEvaluationFilters: SetEvaluationFilters;
}

/**
 * EvaluationToolbarState
 */
interface EvaluationToolbarState {}

/**
 * EvaluationToolbar
 */
class EvaluationToolbar extends React.Component<
  EvaluationToolbarProps,
  EvaluationToolbarState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: EvaluationToolbarProps) {
    super(props);
  }

  /**
   * handleSearchFormElementChange
   * @param e
   */
  handleSearchFormElementChange = (e: string) => {
    this.props.updateEvaluationSearch({ searchString: e });
  };

  /**
   * handleCheckboxClick
   * @param filter filter
   */
  handleCheckboxClick =
    (filter: keyof EvaluationFilters) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedFilters: EvaluationFilters = {
        ...this.props.evaluations.evaluationFilters,
        [filter]: e.target.checked,
      };

      this.props.setEvaluationFilters({ evaluationFilters: updatedFilters });
    };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const checkboxes = [
      <div key="evaluated" className="filter-item">
        <input
          onChange={this.handleCheckboxClick("evaluated")}
          checked={this.props.evaluations.evaluationFilters.evaluated}
          type="checkbox"
          id="filterEvaluated"
        />
        <label htmlFor="filterEvaluated">
          {this.props.i18n.text.get(
            "plugin.evaluation.workspace.filter.checkbox.evaluated"
          )}
        </label>
      </div>,
      <div key="requestEvaluation" className="filter-item">
        <input
          onChange={this.handleCheckboxClick("assessmentRequest")}
          checked={this.props.evaluations.evaluationFilters.assessmentRequest}
          type="checkbox"
          id="filterAssessmentRequest"
        />
        <label htmlFor="filterAssessmentRequest">
          {this.props.i18n.text.get(
            "plugin.evaluation.workspace.filter.checkbox.requestEvaluation"
          )}
        </label>
      </div>,
      <div key="hasSupplementationRequest" className="filter-item">
        <input
          onChange={this.handleCheckboxClick("supplementationRequest")}
          checked={
            this.props.evaluations.evaluationFilters.supplementationRequest
          }
          type="checkbox"
          id="filterSupplementationRequest"
        />
        <label htmlFor="filterSupplementationRequest">
          {this.props.i18n.text.get(
            "plugin.evaluation.workspace.filter.checkbox.hasSupplementationRequest"
          )}
        </label>
      </div>,
      <div key="noevaluation" className="filter-item">
        <input
          onChange={this.handleCheckboxClick("notEvaluated")}
          checked={this.props.evaluations.evaluationFilters.notEvaluated}
          type="checkbox"
          id="filterNotEvaluated"
        />
        <label htmlFor="filterNotEvaluated">
          {this.props.i18n.text.get(
            "plugin.evaluation.workspace.filter.checkbox.noevaluation"
          )}
        </label>
      </div>,
    ];

    return (
      <ApplicationPanelToolbar>
        <SearchFormElement
          updateField={this.handleSearchFormElementChange}
          name="guider-search"
          id="searchUsers"
          placeholder={this.props.i18n.text.get("plugin.evaluation.freeSearch")}
          value={this.props.evaluations.evaluationSearch}
        />
        {this.props.evaluations.selectedWorkspaceId ? (
          <Dropdown items={checkboxes}>
            <ButtonPill buttonModifiers="filter" icon="filter" />
          </Dropdown>
        ) : null}
      </ApplicationPanelToolbar>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { updateEvaluationSearch, setEvaluationFilters },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationToolbar);
