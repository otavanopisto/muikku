import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/evaluation.scss";
import { ButtonPill } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
} from "~/components/general/application-panel/application-panel";
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
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * EvaluationToolbarProps
 */
interface EvaluationToolbarProps extends WithTranslation {
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
   * @param e e
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
   * @returns React.JSX.Element
   */
  render() {
    const { t } = this.props;

    const checkboxes = [
      <div key="interimRequest" className="filter-item">
        <input
          onChange={this.handleCheckboxClick("interimRequest")}
          checked={this.props.evaluations.evaluationFilters.interimRequest}
          type="checkbox"
          id="filterNotEvaluated"
        />
        <label htmlFor="filterNotEvaluated">
          {t("labels.interimEvaluationFilter2", {
            ns: "evaluation",
          })}
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
          {t("labels.withEvaluationRequest", { ns: "evaluation" })}
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
          {t("labels.withSupplementationRequest", { ns: "evaluation" })}
        </label>
      </div>,
      <div key="interimEvaluation" className="filter-item">
        <input
          onChange={this.handleCheckboxClick("interimEvaluation")}
          checked={this.props.evaluations.evaluationFilters.interimEvaluation}
          type="checkbox"
          id="filterNotEvaluated"
        />
        <label htmlFor="filterNotEvaluated">
          {t("labels.interimEvaluationFilter1", {
            ns: "evaluation",
          })}
        </label>
      </div>,
      <div key="evaluated" className="filter-item">
        <input
          onChange={this.handleCheckboxClick("evaluated")}
          checked={this.props.evaluations.evaluationFilters.evaluated}
          type="checkbox"
          id="filterEvaluated"
        />
        <label htmlFor="filterEvaluated">
          {t("labels.evaluated", { ns: "evaluation" })}
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
          {t("labels.noEvaluation", { ns: "evaluation" })}
        </label>
      </div>,
    ];

    return (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
          <SearchFormElement
            updateField={this.handleSearchFormElementChange}
            name="guider-search"
            id="searchUsers"
            placeholder={t("labels.search", { ns: "evaluation" })}
            value={this.props.evaluations.evaluationSearch}
          />
          {this.props.evaluations.selectedWorkspaceId ? (
            <Dropdown items={checkboxes}>
              <ButtonPill buttonModifiers="filter" icon="filter" />
            </Dropdown>
          ) : null}
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { updateEvaluationSearch, setEvaluationFilters },
    dispatch
  );
}

export default withTranslation(["evaluation", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationToolbar)
);
