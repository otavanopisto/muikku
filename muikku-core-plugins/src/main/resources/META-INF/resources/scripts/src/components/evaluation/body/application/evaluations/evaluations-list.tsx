import * as React from "react";
import EvaluationCard from "./evaluation-card";
import {
  AssessmentRequest,
  EvaluationSort,
} from "../../../../../@types/evaluation";
import { bindActionCreators } from "redux";
import { StateType } from "../../../../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { EvaluationState } from "../../../../../reducers/main-function/evaluation/index";
import {
  SortBy,
  EvaluationImportantStatus,
} from "../../../../../@types/evaluation";
import {
  updateImportance,
  UpdateImportance,
  SetEvaluationSelectedWorkspace,
  setSelectedWorkspaceId,
  SaveEvaluationSortFunction,
  saveEvaluationSortFunctionToServer,
} from "../../../../../actions/main-function/evaluation/evaluationActions";
import { UpdateImportanceObject } from "../../../../../@types/evaluation";

/**
 * EvaluationListProps
 */
interface EvaluationListProps {
  assessmentRequest: AssessmentRequest[];
  selectedWorkspaceId?: number;
  setSelectedWorkspaceId: SetEvaluationSelectedWorkspace;
  evaluations: EvaluationState;
  saveEvaluationSortFunctionToServer: SaveEvaluationSortFunction;
  updateImportance: UpdateImportance;
}

/**
 * EvaluationListState
 */
interface EvaluationListState {}

/**
 * EvaluationList component
 */
export class EvaluationList extends React.Component<
  EvaluationListProps,
  EvaluationListState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: EvaluationListProps) {
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
   * Filters and sorts any given assessments list in following order
   * search string, evaluation sort function, sort selection aka checkboks and by importance which
   * also returns sorted list
   */
  filterAndSortAssessments = (assessments: AssessmentRequest[]) => {
    const {
      evaluated,
      notEvaluated,
      assessmentRequest,
      supplementationRequest,
    } = this.props.evaluations.evaluationFilters;
    const { importantRequests, unimportantRequests } = this.props.evaluations;

    let filteredAssessment = assessments;

    /**
     * By search string if  given
     */
    if (
      this.props.evaluations.evaluationSearch !== "" &&
      this.props.evaluations.evaluationSearch.length > 0
    ) {
      filteredAssessment =
        this.filterAssessmentsBySearchString(filteredAssessment);
    }

    /**
     * By sort function if given
     */
    if (this.props.evaluations.evaluationSort !== undefined) {
      filteredAssessment = this.sortAssessmentsBySortBy(
        filteredAssessment,
        this.props.evaluations.evaluationSort.value
      );
    }

    /**
     * By selection if given
     */
    if (
      evaluated ||
      notEvaluated ||
      assessmentRequest ||
      supplementationRequest
    ) {
      filteredAssessment =
        this.filterAssessmentsBySelections(filteredAssessment);
    }

    /**
     * By importance if given
     */
    if (importantRequests.length > 0 || unimportantRequests.length > 0) {
      filteredAssessment = this.sortByImportance(filteredAssessment);
    }

    return filteredAssessment;
  };

  /**
   * Filters assessments by selections aka active checkboxes
   * @param assessments
   */
  filterAssessmentsBySelections = (assessments: AssessmentRequest[]) => {
    let filteredAssessments = assessments;

    if (this.props.evaluations.evaluationFilters.evaluated) {
      filteredAssessments = filteredAssessments.filter(
        (aItem) => aItem.evaluationDate !== null
      );
    }
    if (this.props.evaluations.evaluationFilters.assessmentRequest) {
      filteredAssessments = filteredAssessments.filter(
        (aItem) => aItem.assessmentRequestDate !== null
      );
    }
    if (this.props.evaluations.evaluationFilters.supplementationRequest) {
      filteredAssessments = filteredAssessments.filter(
        (aItem) => aItem.evaluationDate && !aItem.graded
      );
    }
    if (this.props.evaluations.evaluationFilters.notEvaluated) {
      filteredAssessments = filteredAssessments.filter(
        (aItem) => aItem.evaluationDate === null
      );
    }

    return filteredAssessments;
  };

  /**
   * Filters assessments by active sort function
   * @param assessments
   */
  sortAssessmentsBySortBy = (
    assessments: AssessmentRequest[],
    sortBy: SortBy
  ) => {
    let filteredBySortAssessments = assessments;

    switch (sortBy) {
      case "no-sort":
        filteredBySortAssessments.sort((a, b) =>
          b.lastName.localeCompare(a.lastName)
        );
        break;

      case "sort-alpha-asc":
        filteredBySortAssessments.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
        break;

      case "sort-alpha-desc":
        filteredBySortAssessments.sort((a, b) =>
          b.lastName.localeCompare(a.lastName)
        );
        break;

      case "sort-amount-asc":
        filteredBySortAssessments.sort(byDate(true));
        break;

      case "sort-amount-desc":
        filteredBySortAssessments.sort(byDate(false));
        break;

      case "sort-workspace-alpha-asc":
        filteredBySortAssessments.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
        break;

      case "sort-workspace-alpha-desc":
        filteredBySortAssessments.sort((a, b) =>
          b.lastName.localeCompare(a.lastName)
        );
        break;

      default:
        filteredBySortAssessments.sort((a, b) =>
          b.lastName.localeCompare(a.lastName)
        );
        break;
    }

    return filteredBySortAssessments;
  };

  /**
   * Filters assessments by search string and
   * comparing it to workspace name or student name
   * @param assessments
   */
  filterAssessmentsBySearchString = (assessments: AssessmentRequest[]) => {
    const filteredAssessments = assessments.filter((aItem) => {
      /**
       * Building checkable student name
       */
      const studentName = `${aItem.firstName} ${aItem.lastName}`
        .trim()
        .toLowerCase()
        .split(" ");

      /**
       * Building checkable workspace name
       */
      const workspace = aItem.workspaceName.trim().toLowerCase().split(" ");

      /**
       * Check if part of name matches with search string
       */
      for (const element1 of studentName) {
        if (
          element1.includes(
            this.props.evaluations.evaluationSearch.toLowerCase()
          )
        ) {
          return aItem;
        }
      }

      /**
       * If not, check same with workspace name
       */
      for (const element2 of workspace) {
        if (
          element2.includes(
            this.props.evaluations.evaluationSearch.toLowerCase()
          )
        ) {
          return aItem;
        }
      }
    });

    return filteredAssessments;
  };

  /**
   * Sorts assessments by importance selections.
   * @param assessments listo of assessments
   */
  sortByImportance = (assessments: AssessmentRequest[]) => {
    const { importantRequests, unimportantRequests } = this.props.evaluations;

    /**
     * Filtering assessments that are marked as important
     */
    let importantAssessmentSelected = assessments.filter((item) =>
      importantRequests.includes(item.workspaceUserEntityId)
    );

    /**
     * Filtering assessments that are marked as unmportant
     */
    let unimportantAssessmentSelected = assessments.filter((item) =>
      unimportantRequests.includes(item.workspaceUserEntityId)
    );

    /**
     * Filtering everything else expect important or unimportant
     */
    let notImportantNorUnimportant = assessments.filter(
      (item) =>
        !importantRequests.includes(item.workspaceUserEntityId) &&
        !unimportantRequests.includes(item.workspaceUserEntityId)
    );

    /**
     * Here sorting these arrays by any active sort method
     */
    if (this.props.evaluations.evaluationSort !== undefined) {
      importantAssessmentSelected = this.sortAssessmentsBySortBy(
        importantAssessmentSelected,
        this.props.evaluations.evaluationSort.value
      );
      unimportantAssessmentSelected = this.sortAssessmentsBySortBy(
        unimportantAssessmentSelected,
        this.props.evaluations.evaluationSort.value
      );
      notImportantNorUnimportant = this.sortAssessmentsBySortBy(
        notImportantNorUnimportant,
        this.props.evaluations.evaluationSort.value
      );
    }

    /**
     * composing sorted list of assessments
     */
    return [
      ...importantAssessmentSelected,
      ...notImportantNorUnimportant,
      ...unimportantAssessmentSelected,
    ];
  };

  /**
   * handleUpdateImportance
   * @param object
   */
  handleUpdateImportance = (object: UpdateImportanceObject) => {
    this.props.updateImportance({
      importantAssessments: object.importantAssessments,
      unimportantAssessments: object.unimportantAssessments,
    });
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
    const filteredAssessment = this.filterAndSortAssessments(
      this.props.assessmentRequest
    );

    const importantAssessments = this.props.evaluations.importantRequests;
    const unimportantAssessments = this.props.evaluations.unimportantRequests;

    /**
     * renderEvaluationCards
     */
    const renderEvaluationCards = filteredAssessment.map((aItem, i) => {
      let important: EvaluationImportantStatus = "nostatus";

      if (importantAssessments.includes(aItem.workspaceUserEntityId)) {
        important = "important";
      } else if (unimportantAssessments.includes(aItem.workspaceUserEntityId)) {
        important = "unimportant";
      }

      return (
        <EvaluationCard
          key={i}
          {...aItem}
          selectedWorkspaceId={this.props.selectedWorkspaceId}
          setSelectedWorkspaceId={this.props.setSelectedWorkspaceId}
          updateEvaluationImportance={this.handleUpdateImportance}
          important={important}
          importantAssessments={importantAssessments}
          unimportantAssessments={unimportantAssessments}
        />
      );
    });

    /**
     * renders card list
     */
    let renderEvaluationCardList = (
      <div className="card-list-container">{renderEvaluationCards}</div>
    );

    /**
     * If there is no assessments, let give message about that
     */
    if (this.props.assessmentRequest.length <= 0) {
      renderEvaluationCardList = (
        <div className="card-list-container">
          <div className="evaluation-message-container">
            Mahtavaa! Kaikki arviointipyynnöt on käsitelty!
          </div>
        </div>
      );
    } else if (filteredAssessment.length <= 0) {
      /**
       * Otherwise check if filtered list is empty and give message about that
       */
      renderEvaluationCardList = (
        <div className="card-list-container">
          <div className="evaluation-message-container">
            Suodatuksella ei löytynyt osumia!
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="sorter__container">
          <div
            onClick={this.handleClickSorter("sort-amount-asc")}
            className={`sorter__item ${this.buildSorterClass(
              "sort-amount-asc"
            )} sorter__item-amount--asc`}
            title="Lajittele arviointipyyntöpäivämäärän mukaan nousevasti"
          />
          <div
            onClick={this.handleClickSorter("sort-amount-desc")}
            className={`sorter__item ${this.buildSorterClass(
              "sort-amount-desc"
            )} sorter__item-amount--desc`}
            title="Lajittele arviointipyyntöpäivämäärän mukaan laskevasti"
          />
          <div
            onClick={this.handleClickSorter("sort-alpha-asc")}
            className={`sorter__item ${this.buildSorterClass(
              "sort-alpha-asc"
            )} sorter__item-alpha--asc`}
            title="Lajittele sukunimen mukaan nousevasti"
          />
          <div
            onClick={this.handleClickSorter("sort-alpha-desc")}
            className={`sorter__item ${this.buildSorterClass(
              "sort-alpha-desc"
            )} sorter__item-alpha--desc`}
            title="Lajittele sukunimen mukaan laskevasti"
          />
          {this.props.evaluations.selectedWorkspaceId ? null : (
            <>
              <div
                onClick={this.handleClickSorter("sort-workspace-alpha-asc")}
                className={`sorter__item ${this.buildSorterClass(
                  "sort-workspace-alpha-asc"
                )} sorter__item-workspace--asc`}
                title="Lajittele työtilan mukaan nousevasti"
              />
              <div
                onClick={this.handleClickSorter("sort-workspace-alpha-desc")}
                className={`sorter__item ${this.buildSorterClass(
                  "sort-workspace-alpha-desc"
                )} sorter__item-workspace--desc`}
                title="Lajittele työtilan mukaan laskevasti"
              />
            </>
          )}
        </div>
        {renderEvaluationCardList}
      </>
    );
  }
}

/**
 * By date sorting function
 * @param ascending
 * @returns
 */
const byDate = (ascending: boolean) => {
  return (a: AssessmentRequest, b: AssessmentRequest) => {
    // equal items sort equally
    if (a.assessmentRequestDate === b.assessmentRequestDate) {
      return 0;
    }
    // nulls sort after anything else
    else if (a.assessmentRequestDate === null) {
      return 1;
    } else if (b.assessmentRequestDate === null) {
      return -1;
    }
    // otherwise, if we're ascending, lowest sorts first
    else if (ascending) {
      return a.assessmentRequestDate < b.assessmentRequestDate ? -1 : 1;
    }
    // if descending, highest sorts first
    else {
      return a.assessmentRequestDate < b.assessmentRequestDate ? 1 : -1;
    }
  };
};

/**
 * mapStateToProps
 * @param state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      setSelectedWorkspaceId,
      updateImportance,
      saveEvaluationSortFunctionToServer,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationList);
