import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
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
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * EvaluationSortersProps
 */
interface EvaluationSortersProps extends WithTranslation {
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
      // Checking whether sorting workspace or all values
      const sortKey = this.props.evaluations.selectedWorkspaceId
        ? "evaluation-workspace-sort"
        : "evaluation-default-sort";

      if (this.props.evaluations.evaluationSort.value === sortBy) {
        // If same sort is clicked again, set sort to no-sort
        const sortFunction: EvaluationSort = {
          key: sortKey,
          value: "no-sort",
        };

        this.props.updateEvaluationSortFunctionToServer({ sortFunction });
      } else {
        // Otherwise select clicked new sort
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
    const { t } = this.props;

    return (
      <div className="items-sorter">
        <Dropdown
          openByHover
          key="amount-asc"
          content={t("labels.sortAscending", {
            ns: "evaluation",
            context: "date",
          })}
        >
          <ButtonPill
            aria-label={t("labels.sortAscending", {
              ns: "evaluation",
              context: "date",
            })}
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
          content={t("labels.sortDescending", {
            ns: "evaluation",
            context: "date",
          })}
        >
          <ButtonPill
            aria-label={t("labels.sortDescending", {
              ns: "evaluation",
              context: "date",
            })}
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
          content={t("labels.sortAscending", {
            ns: "evaluation",
            context: "lastName",
          })}
        >
          <ButtonPill
            aria-label={t("labels.sortAscending", {
              ns: "evaluation",
              context: "lastName",
            })}
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
          content={t("labels.sortDescending", {
            ns: "evaluation",
            context: "lastName",
          })}
        >
          <ButtonPill
            aria-label={t("labels.sortDescending", {
              ns: "evaluation",
              context: "lastName",
            })}
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
              content={t("labels.sortAscending", {
                ns: "evaluation",
                context: "workspace",
              })}
            >
              <ButtonPill
                aria-label={t("labels.sortAscending", {
                  ns: "evaluation",
                  context: "workspace",
                })}
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
              content={t("labels.sortDescending", {
                ns: "evaluation",
                context: "workspace",
              })}
            >
              <ButtonPill
                aria-label={t("labels.sortDescending", {
                  ns: "evaluation",
                  context: "workspace",
                })}
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
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ updateEvaluationSortFunctionToServer }, dispatch);
}

export default withTranslation(["evaluation", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationSorters)
);
