import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import { SortBy, EvaluationSort } from "../../../../../@types/evaluation";
import { EvaluationState } from "../../../../../reducers/main-function/evaluation/index";
import {
  SaveEvaluationSortFunction,
  saveEvaluationSortFunctionToServer,
} from "../../../../../actions/main-function/evaluation/evaluationActions";

/**
 * EvaluationSortersProps
 */
interface EvaluationSortersProps {
  i18n: i18nType;
  evaluations: EvaluationState;
  saveEvaluationSortFunctionToServer: SaveEvaluationSortFunction;
}

/**
 * EvaluationSortersState
 */
interface EvaluationSortersState {}

/**
 * Evaluation request list sorters
 */
class EvaluationSorters extends React.Component<
  EvaluationSortersProps,
  EvaluationSortersState
> {
  /**
   * constructor
   */
  constructor(props: EvaluationSortersProps) {
    super(props);
  }

  /**
   * Handles sorter buttons click
   * @param sortBy
   */
  handleClickSorter =
    (sortBy: SortBy) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      /**
       * Checking whether sorting workspace or all values
       */
      const sortKey = this.props.evaluations.selectedWorkspaceId
        ? "evaluation-workspace-sort"
        : "evaluation-default-sort";

      if (this.props.evaluations.evaluationSort.value === sortBy) {
        /**
         * If same sort is clicked again, set sort to no-sort
         */
        const sortFunction: EvaluationSort = {
          key: sortKey,
          value: "no-sort",
        };

        this.props.saveEvaluationSortFunctionToServer({ sortFunction });
      } else {
        /**
         * Otherwise select clicked new sort
         */
        const sortFunction: EvaluationSort = {
          key: sortKey,
          value: sortBy,
        };

        this.props.saveEvaluationSortFunctionToServer({ sortFunction });
      }
    };

  /**
   * Builds sorted class depending of if it is active
   * @param sortBy
   * @param sortByState
   * @returns builded class string
   */
  buildSorterClass = (sortBy: SortBy) => {
    if (
      this.props.evaluations.evaluationSort &&
      this.props.evaluations.evaluationSort.value === sortBy
    ) {
      return "sorter__item--selected";
    }
    return "";
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="sorter__container">
        <div
          onClick={this.handleClickSorter("sort-amount-asc")}
          className={`sorter__item ${this.buildSorterClass(
            "sort-amount-asc"
          )} sorter__item-amount--asc`}
          title={this.props.i18n.text.get(
            "plugin.evaluation.sorter.byDate.ascending"
          )}
        />
        <div
          onClick={this.handleClickSorter("sort-amount-desc")}
          className={`sorter__item ${this.buildSorterClass(
            "sort-amount-desc"
          )} sorter__item-amount--desc`}
          title={this.props.i18n.text.get(
            "plugin.evaluation.sorter.byDate.descending"
          )}
        />
        <div
          onClick={this.handleClickSorter("sort-alpha-asc")}
          className={`sorter__item ${this.buildSorterClass(
            "sort-alpha-asc"
          )} sorter__item-alpha--asc`}
          title={this.props.i18n.text.get(
            "plugin.evaluation.sorter.byLastname.ascending"
          )}
        />
        <div
          onClick={this.handleClickSorter("sort-alpha-desc")}
          className={`sorter__item ${this.buildSorterClass(
            "sort-alpha-desc"
          )} sorter__item-alpha--desc`}
          title={this.props.i18n.text.get(
            "plugin.evaluation.sorter.byLastname.descending"
          )}
        />
        {this.props.evaluations.selectedWorkspaceId ? null : (
          <>
            <div
              onClick={this.handleClickSorter("sort-workspace-alpha-asc")}
              className={`sorter__item ${this.buildSorterClass(
                "sort-workspace-alpha-asc"
              )} sorter__item-workspace--asc`}
              title={this.props.i18n.text.get(
                "plugin.evaluation.sorter.byWorkspace.ascending"
              )}
            />
            <div
              onClick={this.handleClickSorter("sort-workspace-alpha-desc")}
              className={`sorter__item ${this.buildSorterClass(
                "sort-workspace-alpha-desc"
              )} sorter__item-workspace--desc`}
              title={this.props.i18n.text.get(
                "plugin.evaluation.sorter.byWorkspace.descending"
              )}
            />
          </>
        )}
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
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
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ saveEvaluationSortFunctionToServer }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationSorters);
