import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import "~/sass/elements/items-sorter.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/filter.scss";
import { SortBy, EvaluationSort } from "~/@types/evaluation";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import {
  UpdateEvaluationSortFunction,
  updateEvaluationSortFunctionToServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import Dropdown from "~/components/general/dropdown";
import { ButtonPill } from "~/components/general/button";

/**
 * EvaluationSortersProps
 */
interface EvaluationSortersProps {
  i18n: i18nType;
  evaluations: EvaluationState;
  updateEvaluationSortFunctionToServer: UpdateEvaluationSortFunction;
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
   * @param props props
   */
  constructor(props: EvaluationSortersProps) {
    super(props);
  }

  /**
   * Handles sorter buttons click
   * @param sortBy sortBy
   */
  handleClickSorter =
    (sortBy: SortBy) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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

        this.props.updateEvaluationSortFunctionToServer({ sortFunction });
      } else {
        /**
         * Otherwise select clicked new sort
         */
        const sortFunction: EvaluationSort = {
          key: sortKey,
          value: sortBy,
        };

        this.props.updateEvaluationSortFunctionToServer({ sortFunction });
      }
    };

  /**
   * Builds sorted class depending of if it is active
   * @param sortBy sortBy
   * @returns builded class string
   */
  buildSorterClass = (sortBy: SortBy) => {
    if (
      this.props.evaluations.evaluationSort &&
      this.props.evaluations.evaluationSort.value === sortBy
    ) {
      return "sorter-selected";
    }
    return "";
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="items-sorter">
        <Dropdown
          openByHover
          key="amount-asc"
          content={this.props.i18n.text.get(
            "plugin.evaluation.sorter.byDate.ascending"
          )}
        >
          <ButtonPill
            aria-label={this.props.i18n.text.get(
              "plugin.evaluation.sorter.byDate.ascending"
            )}
            onClick={this.handleClickSorter("sort-amount-asc")}
            buttonModifiers={[
              "sorter",
              this.buildSorterClass("sort-amount-asc"),
            ]}
            icon="sort-amount-asc"
          />
        </Dropdown>

        <Dropdown
          openByHover
          key="amount-desc"
          content={this.props.i18n.text.get(
            "plugin.evaluation.sorter.byDate.descending"
          )}
        >
          <ButtonPill
            aria-label={this.props.i18n.text.get(
              "plugin.evaluation.sorter.byDate.descending"
            )}
            onClick={this.handleClickSorter("sort-amount-desc")}
            buttonModifiers={[
              "sorter",
              this.buildSorterClass("sort-amount-desc"),
            ]}
            icon="sort-amount-desc"
          />
        </Dropdown>

        <Dropdown
          openByHover
          key="alpha-asc"
          content={this.props.i18n.text.get(
            "plugin.evaluation.sorter.byLastname.ascending"
          )}
        >
          <ButtonPill
            aria-label={this.props.i18n.text.get(
              "plugin.evaluation.sorter.byLastname.ascending"
            )}
            onClick={this.handleClickSorter("sort-alpha-asc")}
            buttonModifiers={[
              "sorter",
              this.buildSorterClass("sort-alpha-asc"),
            ]}
            icon="sort-alpha-asc"
          />
        </Dropdown>

        <Dropdown
          openByHover
          key="alpha-desc"
          content={this.props.i18n.text.get(
            "plugin.evaluation.sorter.byLastname.descending"
          )}
        >
          <ButtonPill
            aria-label={this.props.i18n.text.get(
              "plugin.evaluation.sorter.byLastname.descending"
            )}
            onClick={this.handleClickSorter("sort-alpha-desc")}
            buttonModifiers={[
              "sorter",
              this.buildSorterClass("sort-alpha-desc"),
            ]}
            icon="sort-alpha-desc"
          />
        </Dropdown>

        {this.props.evaluations.selectedWorkspaceId ? null : (
          <>
            <Dropdown
              openByHover
              key="workspace-alpha-asc"
              content={this.props.i18n.text.get(
                "plugin.evaluation.sorter.byWorkspace.ascending"
              )}
            >
              <ButtonPill
                aria-label={this.props.i18n.text.get(
                  "plugin.evaluation.sorter.byWorkspace.ascending"
                )}
                onClick={this.handleClickSorter("sort-workspace-alpha-asc")}
                buttonModifiers={[
                  "sorter",
                  this.buildSorterClass("sort-workspace-alpha-asc"),
                ]}
                icon="sort-asc"
              />
            </Dropdown>

            <Dropdown
              openByHover
              key="workspace-alpha-desc"
              content={this.props.i18n.text.get(
                "plugin.evaluation.sorter.byWorkspace.descending"
              )}
            >
              <ButtonPill
                aria-label={this.props.i18n.text.get(
                  "plugin.evaluation.sorter.byWorkspace.descending"
                )}
                onClick={this.handleClickSorter("sort-workspace-alpha-desc")}
                buttonModifiers={[
                  "sorter",
                  this.buildSorterClass("sort-workspace-alpha-desc"),
                ]}
                icon="sort-desc"
              />
            </Dropdown>
          </>
        )}
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ updateEvaluationSortFunctionToServer }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationSorters);
